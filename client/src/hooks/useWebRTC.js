import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

const RTC_CONFIG = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export function useWebRTC(roomId, name) {
  const navigate = useNavigate();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerName, setPeerName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  const pcRef = useRef(null);
  const iceCandidatesQueue = useRef([]);

  useEffect(() => {
    let isMounted = true;
    let streamInstance = null;

    // Helper: Flush queued ICE candidates after remote description is set
    async function flushQueuedCandidates(pc) {
      while (iceCandidatesQueue.current.length > 0) {
        const candidate = iceCandidatesQueue.current.shift();
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.warn('Error adding queued ICE candidate:', e);
        }
      }
    }

    // Helper: Create and configure RTCPeerConnection
    function createPeerConnection(stream) {
      if (pcRef.current) {
        pcRef.current.close();
      }

      const pc = new RTCPeerConnection(RTC_CONFIG);
      pcRef.current = pc;
      setStatus('connecting');

      // Add local tracks BEFORE createOffer / createAnswer
      if (stream) {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }

      // Relay local ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate });
        }
      };

      // Receive remote stream
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      // Connection status tracking
      pc.onconnectionstatechange = () => {
        if (isMounted) {
          setStatus(pc.connectionState);
        }
      };

      return pc;
    }

    async function initCall() {
      try {
        // 1. Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamInstance = stream;
        setLocalStream(stream);

        // 2. Setup socket listeners
        // Existing user receives user-joined -> creates offer
        const onUserJoined = async ({ name: joinedName }) => {
          if (!isMounted) return;
          setPeerName(joinedName);
          setMessages((prev) => [
            ...prev,
            {
              id: `sys-${Date.now()}-${Math.random()}`,
              type: 'system',
              text: `${joinedName} joined`,
              time: Date.now(),
            },
          ]);

          try {
            const pc = createPeerConnection(streamInstance);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('offer', { sdp: pc.localDescription });
          } catch (err) {
            console.error('Error creating offer:', err);
          }
        };

        const onUserLeft = ({ name: leftName } = {}) => {
          if (!isMounted) return;
          setPeerName((current) => {
            const displayName = leftName || current || 'User';
            setMessages((prev) => [
              ...prev,
              {
                id: `sys-${Date.now()}-${Math.random()}`,
                type: 'system',
                text: `${displayName} left`,
                time: Date.now(),
              },
            ]);
            return null;
          });
        };

        // Second user receives offer -> sets remote, creates answer
        const onOffer = async ({ sdp }) => {
          if (!isMounted) return;
          try {
            let pc = pcRef.current;
            if (!pc) {
              pc = createPeerConnection(streamInstance);
            }

            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            await flushQueuedCandidates(pc);

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('answer', { sdp: pc.localDescription });
          } catch (err) {
            console.error('Error handling offer:', err);
          }
        };

        // First user receives answer -> sets remote
        const onAnswer = async ({ sdp }) => {
          if (!isMounted) return;
          try {
            const pc = pcRef.current;
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(sdp));
              await flushQueuedCandidates(pc);
            }
          } catch (err) {
            console.error('Error handling answer:', err);
          }
        };

        // ICE candidate relay
        const onIceCandidate = async ({ candidate }) => {
          if (!isMounted) return;
          try {
            const pc = pcRef.current;
            if (pc && pc.remoteDescription && pc.remoteDescription.type) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
              iceCandidatesQueue.current.push(candidate);
            }
          } catch (err) {
            console.warn('Error adding ICE candidate:', err);
          }
        };

        const onChatMessage = (msg) => {
          if (!isMounted) return;
          setMessages((prev) => [...prev, msg]);
        };

        socket.on('user-joined', onUserJoined);
        socket.on('user-left', onUserLeft);
        socket.on('offer', onOffer);
        socket.on('answer', onAnswer);
        socket.on('ice-candidate', onIceCandidate);
        socket.on('chat-message', onChatMessage);

        // 3. Emit join-room
        socket.emit('join-room', { roomId, name }, (res) => {
          if (!isMounted) return;

          if (!res?.ok) {
            navigate('/', { state: { error: res?.error || 'FAILED_TO_JOIN' } });
            return;
          }

          setIsJoined(true);

          if (Array.isArray(res.users)) {
            const otherUser = res.users.find((u) => u.id !== socket.id);
            if (otherUser) {
              setPeerName(otherUser.name);
            }
          }
        });
      } catch (err) {
        if (!isMounted) return;
        setError('Camera and mic permission needed');
      }
    }

    initCall();

    return () => {
      isMounted = false;
      socket.emit('leave-room');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('chat-message');

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      iceCandidatesQueue.current = [];

      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId, name, navigate]);

  const toggleMic = useCallback(() => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const toggleCam = useCallback(() => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCamOn(videoTrack.enabled);
    }
  }, [localStream]);

  const leave = useCallback(() => {
    socket.emit('leave-room');
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    iceCandidatesQueue.current = [];
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    navigate('/');
  }, [localStream, navigate]);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    socket.emit('chat-message', { text: trimmed });
  }, []);

  return {
    localStream,
    remoteStream,
    peerName,
    messages,
    sendMessage,
    micOn,
    camOn,
    toggleMic,
    toggleCam,
    leave,
    error,
    isJoined,
    status,
  };
}
