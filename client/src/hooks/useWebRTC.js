import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

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

  useEffect(() => {
    let isMounted = true;
    let streamInstance = null;

    async function initMediaAndRoom() {
      try {
        // Request user media
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

        // Register socket listeners
        const onUserJoined = ({ name: joinedName }) => {
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

        const onChatMessage = (msg) => {
          if (!isMounted) return;
          setMessages((prev) => [...prev, msg]);
        };

        socket.on('user-joined', onUserJoined);
        socket.on('user-left', onUserLeft);
        socket.on('chat-message', onChatMessage);

        // Join room after media is ready
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

    initMediaAndRoom();

    return () => {
      isMounted = false;
      socket.emit('leave-room');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('chat-message');

      // Stop all tracks on unmount
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
  };
}
