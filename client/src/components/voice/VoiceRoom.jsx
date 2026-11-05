import { useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Users, AlertCircle, RefreshCw, PanelLeft } from 'lucide-react';
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
import { useUIStore } from '../../store/uiStore';
import ParticipantGrid from './ParticipantGrid';
import ScreenShareView from './ScreenShareView';
import VoiceControls from './VoiceControls';
import VoiceChatPanel from './VoiceChatPanel';
import SpaceLoadingScreen from '../common/SpaceLoadingScreen';

function VoiceRoomInner({ channelName, onDisconnect }) {
  const room = useRoomContext();
  const user = useAuthStore((state) => state.user);
  const isChatOpen = useVoiceStore((state) => state.isChatOpen);
  const addVoiceMessage = useVoiceStore((state) => state.addVoiceMessage);
  const toggleChannelSidebar = useUIStore((state) => state.toggleChannelSidebar);
  const isChannelSidebarOpen = useUIStore((state) => state.isChannelSidebarOpen);
  const participants = useParticipants();
  const connectionState = useConnectionState();

  // Detect active screen share track
  const screenShareTracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  const activeScreenShare = screenShareTracks.length > 0 ? screenShareTracks[0] : null;

  const isReconnecting = connectionState === ConnectionState.Reconnecting;

  // Listen for in-call chat messages over Native LiveKit WebRTC Data Channel
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
      if (!room || !content.trim()) return;

      const messagePayload = {
        type: 'chat',
        id: `${Date.now()}-${Math.random()}`,
        userId: user?.id,
        name: user?.name || 'Me',
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(messagePayload));

        await room.localParticipant.publishData(data, {
          reliable: true,
          topic: 'chat',
        });

        // Add to local state immediately
        addVoiceMessage(messagePayload);
      } catch (err) {
        console.error('[LiveKit DataChannel] Send failed:', err);
        toast.error('Failed to send in-call chat message');
      }
    },
    [room, user, addVoiceMessage]
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111214] overflow-hidden relative">
      {/* Voice Header */}
      <header className="h-12 border-b border-[#1f2023] px-3 sm:px-4 flex items-center justify-between shrink-0 shadow-xs bg-[#2b2d31] z-10 select-none">
        <div className="flex items-center gap-2 text-white font-semibold text-sm min-w-0">
          {/* Sidebar Toggle Button - visible on ALL screen sizes */}<button onClick={toggleChannelSidebar} className={`p-1.5 -ml-1 rounded-lg transition-colors shrink-0 cursor-pointer ${isChannelSidebarOpen ? "text-white bg-white/10" : "text-[#b5bac1] hover:text-white hover:bg-white/10"}`} title={isChannelSidebarOpen ? "Collapse Channels" : "Open Channels"}><PanelLeft className="w-5 h-5" /></button>
          <Volume2 className="w-5 h-5 text-[#23a55a] shrink-0" />
          <span className="truncate">{channelName}</span>
          <span className="text-xs text-[#80848e] font-normal ml-2 hidden sm:inline">
            Connected
          </span>
          {/* Reconnecting Badge */}
          {isReconnecting && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#fee75c]/20 text-[#fee75c] border border-[#fee75c]/30 animate-pulse ml-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Reconnecting...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-[#b5bac1] bg-[#1e1f22] px-2.5 py-1 rounded-md shrink-0">
          <Users className="w-3.5 h-3.5 text-[#23a55a]" />
          <span>{participants.length}</span>
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

  // Scalable LiveKit Room Options
  const roomOptions = useMemo(
    () => ({
      adaptiveStream: true,
      dynacast: true,
      audioCaptureDefaults: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      videoCaptureDefaults: {
        resolution: VideoPresets.h360.resolution,
      },
      publishDefaults: {
        simulcast: true,
      },
    }),
    []
  );

  const handleDisconnect = () => {
    disconnect();
    if (serverId) {
      navigate(`/app/${serverId}`);
    } else {
      navigate('/app');
    }
  };

  const handleRoomDisconnected = (reason) => {
    console.log('[LiveKit Disconnected]:', reason);
  };

  if (isLoading) {
    return <SpaceLoadingScreen message={`Connecting to #${channelName}...`} />;
  }

  if (error || !token || !serverUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#111214] text-white p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#f23f42]/20 flex items-center justify-center text-[#f23f42] mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold mb-1">Failed to Connect</h3>
        <p className="text-xs text-[#949ba4] max-w-sm mb-4">
          {error || 'Could not fetch token for this voice channel.'}
        </p>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          Return to Server
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      serverUrl={serverUrl}
      options={roomOptions}
      data-lk-theme="default"
      className="flex-1 flex flex-col h-full overflow-hidden"
      onDisconnected={handleRoomDisconnected}
    >
      <VoiceRoomInner
        channelName={channelName}
        onDisconnect={handleDisconnect}
      />
    </LiveKitRoom>
  );
}

