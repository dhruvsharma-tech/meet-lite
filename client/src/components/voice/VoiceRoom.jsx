import { useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Users, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  useParticipants,
  useConnectionState,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track, ConnectionState, VideoPresets, RoomEvent } from 'livekit-client';
import toast from 'react-hot-toast';

import useLiveKit from '../../hooks/useLiveKit';
import { useVoiceStore } from '../../store/voiceStore';
import { useAuthStore } from '../../store/authStore';
import ParticipantGrid from './ParticipantGrid';
import ScreenShareView from './ScreenShareView';
import VoiceControls from './VoiceControls';
import VoiceChatPanel from './VoiceChatPanel';

function VoiceRoomInner({ channelName, onDisconnect }) {
  const room = useRoomContext();
  const user = useAuthStore((state) => state.user);
  const isChatOpen = useVoiceStore((state) => state.isChatOpen);
  const addVoiceMessage = useVoiceStore((state) => state.addVoiceMessage);
  const participants = useParticipants();
  const connectionState = useConnectionState();

  // Detect active screen share track
  const screenShareTracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  const activeScreenShare = screenShareTracks.length > 0 ? screenShareTracks[0] : null;

  const isReconnecting = connectionState === ConnectionState.Reconnecting;

  // Listen for in-call chat messages over Native LiveKit WebRTC Data Channel (0ms latency, zero server DB load)
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload, participant, kind, topic) => {
      try {
        const decoded = new TextDecoder().decode(payload);
        const data = JSON.parse(decoded);
        if (data && (data.type === 'chat' || topic === 'chat')) {
          addVoiceMessage({
            id: data.id || `${Date.now()}-${Math.random()}`,
            userId: data.userId || participant?.identity,
            name: data.name || participant?.name || 'User',
            content: data.content,
            createdAt: data.createdAt || new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('[LiveKit DataChannel] Could not decode incoming packet:', err);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, addVoiceMessage]);

  // Send ephemeral chat message via LiveKit reliable WebRTC data channel
  const handleSendVoiceMessage = useCallback(
    async (content) => {
      if (!room || !content?.trim()) return;
      const trimmed = content.trim();

      const message = {
        type: 'chat',
        id: `${Date.now()}-${room.localParticipant.identity}`,
        userId: room.localParticipant.identity,
        name: room.localParticipant.name || user?.name || 'You',
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      try {
        const payload = new TextEncoder().encode(JSON.stringify(message));
        await room.localParticipant.publishData(payload, {
          reliable: true,
          topic: 'chat',
        });
        // Optimistic display for sender
        addVoiceMessage(message);
      } catch (err) {
        console.error('[LiveKit DataChannel] Message send failed:', err);
        toast.error('Failed to send in-call message');
      }
    },
    [room, user, addVoiceMessage]
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111214] overflow-hidden relative">
      {/* Voice Header */}
      <header className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between shrink-0 shadow-xs bg-[#2b2d31] z-10 select-none">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Volume2 className="w-5 h-5 text-[#23a55a]" />
          <span>{channelName}</span>
          <span className="text-xs text-[#80848e] font-normal ml-2 hidden sm:inline">
            Voice & Video Connected
          </span>
          {/* Reconnecting Badge */}
          {isReconnecting && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fee75c]/20 text-[#fee75c] border border-[#fee75c]/30 animate-pulse ml-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Reconnecting...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-[#b5bac1] bg-[#1e1f22] px-2.5 py-1 rounded-md">
          <Users className="w-3.5 h-3.5 text-[#23a55a]" />
          <span>{participants.length} connected</span>
        </div>
      </header>

      {/* Main Center Area: Grid/ScreenShare + Ephemeral Chat */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {activeScreenShare ? (
            <ScreenShareView screenShareTrack={activeScreenShare} />
          ) : (
            <ParticipantGrid />
          )}
        </div>

        {/* Collapsible Right Side Chat Panel via WebRTC Data Channels */}
        {isChatOpen && <VoiceChatPanel onSendMessage={handleSendVoiceMessage} />}
      </div>

      {/* Bottom Floating/Docked Voice Controls */}
      <VoiceControls onDisconnect={onDisconnect} />

      {/* Automatically Play Audio from Remote Participants */}
      <RoomAudioRenderer />
    </div>
  );
}

export default function VoiceRoom({ channelId, channelName, serverId }) {
  const navigate = useNavigate();
  const { token, serverUrl, isLoading, error, disconnect } = useLiveKit(channelId);

  // Scalable LiveKit Room Options for 10-20 users
  const roomOptions = useMemo(
    () => ({
      // 1. AdaptiveStream: only pull resolution needed for tile display size (saves downstream CPU & bandwidth)
      adaptiveStream: true,
      // 2. Dynacast: pause upstream video when no subscribers are watching (saves upstream CPU & bandwidth)
      dynacast: true,
      // 3. Audio Processing: Noise suppression, acoustic echo cancellation, and auto gain control
      audioCaptureDefaults: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      // 4. Video Presets: default 360p capture to avoid 1080p camera overload in group calls
      videoCaptureDefaults: {
        resolution: VideoPresets.h360.resolution, // 640x360
      },
      // 5. Simulcast: publish multi-resolution layers (180p, 360p, 720p)
      publishDefaults: {
        simulcast: true,
        videoSimulcastLayers: [
          VideoPresets.h180,
          VideoPresets.h360,
          VideoPresets.h720,
        ],
        stopMicTrackOnMute: false,
      },
      disconnectOnPageLeave: true,
      stopLocalTrackOnUnpublish: true,
    }),
    []
  );

  const handleDisconnect = () => {
    disconnect();
    if (serverId) {
      navigate(`/app/${serverId}`);
    }
  };

  const handleRoomError = (err) => {
    console.error('[LiveKit Room Error]:', err);
    toast.error('Voice room error: ' + (err.message || 'Connection lost'));
  };

  const handleRoomDisconnected = (reason) => {
    console.log('[LiveKit Disconnected]:', reason);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#313338] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#5865f2] mb-3" />
        <p className="text-sm text-[#b5bac1]">Connecting to voice channel #{channelName}...</p>
      </div>
    );
  }

  if (error || !token || !serverUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#313338] text-white p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#f23f42]/20 flex items-center justify-center text-[#f23f42] mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold mb-1">Failed to Connect</h3>
        <p className="text-sm text-[#b5bac1] max-w-sm mb-4">
          {error || 'Could not establish connection to the LiveKit media server.'}
        </p>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
        >
          Return to Server
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={false}
      audio={true}
      options={roomOptions}
      onError={handleRoomError}
      onDisconnected={handleRoomDisconnected}
      className="flex-1 flex flex-col h-full overflow-hidden"
    >
      <VoiceRoomInner
        channelName={channelName}
        onDisconnect={handleDisconnect}
      />
    </LiveKitRoom>
  );
}

