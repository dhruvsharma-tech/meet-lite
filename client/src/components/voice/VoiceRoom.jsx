import { useNavigate } from 'react-router-dom';
import { Volume2, Users, Loader2, AlertCircle } from 'lucide-react';
import { LiveKitRoom, RoomAudioRenderer, useTracks, useParticipants } from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';

import useLiveKit from '../../hooks/useLiveKit';
import { useVoiceStore } from '../../store/voiceStore';
import ParticipantGrid from './ParticipantGrid';
import ScreenShareView from './ScreenShareView';
import VoiceControls from './VoiceControls';
import VoiceChatPanel from './VoiceChatPanel';

function VoiceRoomInner({ channelName, onDisconnect, sendVoiceMessage }) {
  const isChatOpen = useVoiceStore((state) => state.isChatOpen);
  const participants = useParticipants();

  // Detect active screen share track
  const screenShareTracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  const activeScreenShare = screenShareTracks.length > 0 ? screenShareTracks[0] : null;

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

        {/* Collapsible Right Side Chat Panel */}
        {isChatOpen && <VoiceChatPanel onSendMessage={sendVoiceMessage} />}
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
  const { token, serverUrl, isLoading, error, disconnect, sendVoiceMessage } = useLiveKit(channelId);

  const handleDisconnect = () => {
    disconnect();
    if (serverId) {
      navigate(`/app/${serverId}`);
    }
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
      className="flex-1 flex flex-col h-full overflow-hidden"
    >
      <VoiceRoomInner
        channelName={channelName}
        onDisconnect={handleDisconnect}
        sendVoiceMessage={sendVoiceMessage}
      />
    </LiveKitRoom>
  );
}
