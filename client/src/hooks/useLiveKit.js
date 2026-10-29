import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoPresets } from 'livekit-client';
import api from '../services/api';
import { useVoiceStore } from '../store/voiceStore';

export function useLiveKit(channelId) {
  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomRef = useRef(null);

  const setConnected = useVoiceStore((state) => state.setConnected);
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

    return () => {
      isMounted = false;
      clearVoiceMessages();
      setConnected(false);
      setMuted(false);
      setCameraOn(false);
      setScreenSharing(false);
    };
  }, [channelId, setConnected, clearVoiceMessages, setMuted, setCameraOn, setScreenSharing]);

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
    setMuted(currentState);
  }, [setMuted]);

  const toggleCamera = useCallback(async () => {
    const room = roomRef.current;
    if (!room?.localParticipant) return;
    const currentState = room.localParticipant.isCameraEnabled;
    await room.localParticipant.setCameraEnabled(
      !currentState,
      { resolution: VideoPresets.h360.resolution },
      { simulcast: true }
    );
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
  };
}

export default useLiveKit;

