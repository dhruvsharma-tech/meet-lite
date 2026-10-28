import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import socket from '../socket';
import { useVoiceStore } from '../store/voiceStore';

export function useLiveKit(channelId) {
  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomRef = useRef(null);

  const setConnected = useVoiceStore((state) => state.setConnected);
  const addVoiceMessage = useVoiceStore((state) => state.addVoiceMessage);
  const clearVoiceMessages = useVoiceStore((state) => state.clearVoiceMessages);
  const setMuted = useVoiceStore((state) => state.setMuted);
  const setCameraOn = useVoiceStore((state) => state.setCameraOn);
  const setScreenSharing = useVoiceStore((state) => state.setScreenSharing);

  // 1. Fetch token and connect to voice signaling
  useEffect(() => {
    if (!channelId) {
      setToken(null);
      setServerUrl(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    clearVoiceMessages();

    async function fetchToken() {
      try {
        const res = await api.post('/api/livekit/token', { channelId });
        if (!isMounted) return;

        setToken(res.data.token);
        setServerUrl(res.data.url);
        setConnected(true);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to get LiveKit token:', err);
        setError(err.response?.data?.message || 'Failed to connect to voice channel');
        setConnected(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchToken();

    // Join ephemeral socket voice room
    socket.emit('voice:join', { channelId }, (response) => {
      if (response?.messages && Array.isArray(response.messages)) {
        response.messages.forEach((msg) => addVoiceMessage(msg));
      }
    });

    const handleVoiceMessageNew = ({ channelId: incomingChannelId, message }) => {
      if (incomingChannelId === channelId) {
        addVoiceMessage(message);
      }
    };

    socket.on('voice:message:new', handleVoiceMessageNew);

    return () => {
      isMounted = false;
      socket.emit('voice:leave', { channelId });
      socket.off('voice:message:new', handleVoiceMessageNew);
      clearVoiceMessages();
      setConnected(false);
      setMuted(false);
      setCameraOn(false);
      setScreenSharing(false);
    };
  }, [channelId, setConnected, clearVoiceMessages, addVoiceMessage, setMuted, setCameraOn, setScreenSharing]);

  // 2. Attach LiveKit room instance for controls
  const attachRoom = useCallback((room) => {
    roomRef.current = room;
  }, []);

  // 3. Media control toggles
  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room?.localParticipant) return;
    const currentState = room.localParticipant.isMicrophoneEnabled;
    await room.localParticipant.setMicrophoneEnabled(!currentState);
    setMuted(currentState); // if it was enabled, it is now muted
  }, [setMuted]);

  const toggleCamera = useCallback(async () => {
    const room = roomRef.current;
    if (!room?.localParticipant) return;
    const currentState = room.localParticipant.isCameraEnabled;
    await room.localParticipant.setCameraEnabled(!currentState);
    setCameraOn(!currentState);
  }, [setCameraOn]);

  const toggleScreenShare = useCallback(async () => {
    const room = roomRef.current;
    if (!room?.localParticipant) return;
    const currentState = room.localParticipant.isScreenShareEnabled;
    try {
      await room.localParticipant.setScreenShareEnabled(!currentState);
      setScreenSharing(!currentState);
    } catch (err) {
      console.warn('Screen share cancelled or failed:', err);
      setScreenSharing(false);
    }
  }, [setScreenSharing]);

  const disconnect = useCallback(() => {
    const room = roomRef.current;
    if (room) {
      room.disconnect();
    }
    setConnected(false);
  }, [setConnected]);

  // 4. Send ephemeral message
  const sendVoiceMessage = useCallback((content) => {
    if (!channelId || !content?.trim()) return;
    socket.emit('voice:message:send', {
      channelId,
      content: content.trim(),
    });
  }, [channelId]);

  return {
    token,
    serverUrl,
    isLoading,
    error,
    attachRoom,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    disconnect,
    sendVoiceMessage,
  };
}

export default useLiveKit;
