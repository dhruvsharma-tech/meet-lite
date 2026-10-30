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
        toast.error('Camera busy! Your webcam is already in use by another tab or browser on this computer. Turn off camera in Tab 1 or Tab 2 first.', {
          duration: 5000,
        });
      } else if (msg.includes('NotAllowedError') || msg.includes('Permission denied')) {
        toast.error('Camera permission blocked. Please allow camera in your browser address bar.');
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
      console.warn('Screen sharing cancelled or failed:', err);
      if (err.name !== 'NotAllowedError') {
        toast.error('Screen share error: ' + (err.message || 'Failed'));
      }
    }
  };

  return (
    <div className="h-20 bg-[#1e1f22] border-t border-[#111214] px-6 flex items-center justify-center shrink-0 z-20">
      <div className="flex items-center gap-3">
        {/* 1. Mic Button */}
        <button
          onClick={handleToggleMic}
          disabled={isMicLoading}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isMicrophoneEnabled
              ? 'bg-[#23a55a] hover:bg-[#1f9250] text-white'
              : 'bg-[#f23f42] hover:bg-[#da373a] text-white'
          }`}
          title={isMicrophoneEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : isMicrophoneEnabled ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </button>

        {/* 2. Camera Button */}
        <button
          onClick={handleToggleCamera}
          disabled={isCameraLoading}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isCameraEnabled
              ? 'bg-[#23a55a] hover:bg-[#1f9250] text-white'
              : 'bg-[#f23f42] hover:bg-[#da373a] text-white'
          }`}
          title={isCameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCameraLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : isCameraEnabled ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
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

