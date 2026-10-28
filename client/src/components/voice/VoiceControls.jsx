import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, MessageSquare, PhoneOff } from 'lucide-react';
import { useLocalParticipant } from '@livekit/components-react';
import { useVoiceStore } from '../../store/voiceStore';

export default function VoiceControls({ onDisconnect }) {
  const { isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, localParticipant } = useLocalParticipant();

  const isChatOpen = useVoiceStore((state) => state.isChatOpen);
  const toggleChat = useVoiceStore((state) => state.toggleChat);

  const handleToggleMic = async () => {
    if (!localParticipant) return;
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const handleToggleCamera = async () => {
    if (!localParticipant) return;
    await localParticipant.setCameraEnabled(!isCameraEnabled);
  };

  const handleToggleScreenShare = async () => {
    if (!localParticipant) return;
    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    } catch (err) {
      console.warn('Screen sharing cancelled or failed:', err);
    }
  };

  return (
    <div className="h-20 bg-[#1e1f22] border-t border-[#111214] px-6 flex items-center justify-center shrink-0 z-20">
      <div className="flex items-center gap-3">
        {/* 1. Mic Button */}
        <button
          onClick={handleToggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isMicrophoneEnabled
              ? 'bg-[#35373c] hover:bg-[#3f4147] text-white'
              : 'bg-[#f23f42] hover:bg-[#da373a] text-white'
          }`}
          title={isMicrophoneEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicrophoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* 2. Camera Button */}
        <button
          onClick={handleToggleCamera}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isCameraEnabled
              ? 'bg-[#35373c] hover:bg-[#3f4147] text-white'
              : 'bg-[#2b2d31] hover:bg-[#35373c] text-[#80848e]'
          }`}
          title={isCameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* 3. Screen Share Button */}
        <button
          onClick={handleToggleScreenShare}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isScreenShareEnabled
              ? 'bg-[#23a55a] hover:bg-[#1f9250] text-white'
              : 'bg-[#35373c] hover:bg-[#3f4147] text-white'
          }`}
          title={isScreenShareEnabled ? 'Stop Sharing Screen' : 'Share Screen'}
        >
          {isScreenShareEnabled ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </button>

        {/* 4. Ephemeral Chat Toggle Button */}
        <button
          onClick={toggleChat}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isChatOpen
              ? 'bg-[#5865f2] hover:bg-[#4752c4] text-white'
              : 'bg-[#35373c] hover:bg-[#3f4147] text-white'
          }`}
          title={isChatOpen ? 'Close Voice Chat' : 'Open Voice Chat'}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* 5. Red Disconnect Button */}
        <button
          onClick={onDisconnect}
          className="w-12 h-12 rounded-full bg-[#f23f42] hover:bg-[#da373a] text-white flex items-center justify-center transition-all cursor-pointer shadow-md ml-2"
          title="Disconnect from Voice Channel"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

