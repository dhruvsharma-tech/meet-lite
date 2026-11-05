import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, MessageSquare, PhoneOff, Loader2 } from 'lucide-react';
import { useLocalParticipant } from '@livekit/components-react';
import { VideoPresets } from 'livekit-client';
import toast from 'react-hot-toast';
import { useVoiceStore } from '../../store/voiceStore';

export default function VoiceControls({ onDisconnect }) {
  const { isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, localParticipant } = useLocalParticipant();
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isMicLoading, setIsMicLoading] = useState(false);

  const isChatOpen = useVoiceStore((state) => state.isChatOpen);
  const toggleChat = useVoiceStore((state) => state.toggleChat);

  const handleToggleMic = async () => {
    if (!localParticipant || isMicLoading) return;
    setIsMicLoading(true);
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    } catch (err) {
      console.error('Mic toggle error:', err);
      toast.error('Microphone error: ' + (err.message || 'Device in use'));
    } finally {
      setIsMicLoading(false);
    }
  };

  const handleToggleCamera = async () => {
    if (!localParticipant || isCameraLoading) return;
    setIsCameraLoading(true);
    try {
      await localParticipant.setCameraEnabled(
        !isCameraEnabled,
        { resolution: VideoPresets.h360.resolution },
        { simulcast: true }
      );
      if (!isCameraEnabled) {
        toast.success('Camera turned on (360p Simulcast)');
      } else {
        toast('Camera turned off', { icon: '📷' });
      }
    } catch (err) {
      console.error('Camera toggle error:', err);
      const msg = err?.message || err?.name || '';
      if (
        msg.includes('NotReadableError') ||
        msg.includes('Could not start video source') ||
        msg.includes('Device in use') ||
        msg.includes('TrackStartError')
      ) {
        toast.error('Camera busy! Your webcam is already in use by another tab or browser.', {
          duration: 5000,
        });
      } else if (msg.includes('NotAllowedError') || msg.includes('Permission denied')) {
        toast.error('Camera permission blocked. Please allow camera in browser address bar.');
      } else {
        toast.error('Camera error: ' + (err.message || 'Could not start camera'));
      }
    } finally {
      setIsCameraLoading(false);
    }
  };

  const handleToggleScreenShare = async () => {
    if (!localParticipant) return;
    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    } catch (err) {
      console.error('Screen share error:', err);
      if (err.name !== 'NotAllowedError') {
        toast.error('Screen share failed: ' + err.message);
      }
    }
  };

  return (
    <div className="p-2 sm:p-3 shrink-0 flex items-center justify-center bg-[#1e1f22]/95 backdrop-blur-md border-t border-[#2b2d31] select-none z-20">
      <div className="flex items-center gap-2 sm:gap-3 bg-[#111214]/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#2b2d31] shadow-xl">
        {/* 1. Mic Button */}
        <button
          onClick={handleToggleMic}
          disabled={isMicLoading}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isMicrophoneEnabled
              ? 'bg-[#23a55a] hover:bg-[#1f9250] text-white'
              : 'bg-[#f23f42] hover:bg-[#da373a] text-white'
          }`}
          title={isMicrophoneEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicLoading ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white" />
          ) : isMicrophoneEnabled ? (
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* 2. Camera Button */}
        <button
          onClick={handleToggleCamera}
          disabled={isCameraLoading}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isCameraEnabled
              ? 'bg-[#23a55a] hover:bg-[#1f9250] text-white'
              : 'bg-[#f23f42] hover:bg-[#da373a] text-white'
          }`}
          title={isCameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCameraLoading ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white" />
          ) : isCameraEnabled ? (
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* 3. Screen Share Button */}
        <button
          onClick={handleToggleScreenShare}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isScreenShareEnabled
              ? 'bg-[#23a55a] hover:bg-[#1f9250] text-white'
              : 'bg-[#35373c] hover:bg-[#3f4147] text-white'
          }`}
          title={isScreenShareEnabled ? 'Stop Sharing Screen' : 'Share Screen'}
        >
          {isScreenShareEnabled ? (
            <MonitorOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* 4. Ephemeral Chat Toggle Button */}
        <button
          onClick={toggleChat}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isChatOpen
              ? 'bg-[#5865f2] hover:bg-[#4752c4] text-white'
              : 'bg-[#35373c] hover:bg-[#3f4147] text-white'
          }`}
          title={isChatOpen ? 'Close Voice Chat' : 'Open Voice Chat'}
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 5. Red Disconnect Button */}
        <button
          onClick={onDisconnect}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f23f42] hover:bg-[#da373a] text-white flex items-center justify-center transition-all cursor-pointer shadow-md ml-1 sm:ml-2"
          title="Disconnect from Voice Channel"
        >
          <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
