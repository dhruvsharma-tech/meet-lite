import { useState, useEffect } from 'react';
import {
  Mic, MicOff, Video, VideoOff,
  Monitor, MonitorOff, MessageSquare,
  PhoneOff, Loader2, FlipHorizontal,
} from 'lucide-react';
import { useLocalParticipant } from '@livekit/components-react';
import { VideoPresets } from 'livekit-client';
import toast from 'react-hot-toast';
import { useVoiceStore } from '../../store/voiceStore';

// Detect mobile device once
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function VoiceControls({ onDisconnect }) {
  const { isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, localParticipant } =
    useLocalParticipant();

  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isMicLoading, setIsMicLoading]       = useState(false);
  const [isFlipping, setIsFlipping]           = useState(false);

  // 'user' = front cam, 'environment' = rear cam
  const [facingMode, setFacingMode] = useState('user');

  // Show flip button only on mobile AND when camera is currently ON
  const showFlipBtn = isMobile && isCameraEnabled;

  const isChatOpen = useVoiceStore((state) => state.isChatOpen);
  const toggleChat = useVoiceStore((state) => state.toggleChat);

  // ── Mic ──────────────────────────────────────────────────────────────────
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

  // ── Camera ───────────────────────────────────────────────────────────────
  const handleToggleCamera = async () => {
    if (!localParticipant || isCameraLoading) return;
    setIsCameraLoading(true);
    try {
      await localParticipant.setCameraEnabled(!isCameraEnabled, {
        resolution: VideoPresets.h360.resolution,
        facingMode,                    // keep the current facing mode
      });
      if (!isCameraEnabled) toast.success('Camera on');
      else { toast('Camera off', { icon: '📷' }); setFacingMode('user'); }
    } catch (err) {
      console.error('Camera toggle error:', err);
      const msg = err?.message || err?.name || '';
      if (msg.includes('NotReadableError') || msg.includes('Could not start video source'))
        toast.error('Camera busy — it may be used by another tab.', { duration: 5000 });
      else if (msg.includes('NotAllowedError') || msg.includes('Permission denied'))
        toast.error('Camera permission blocked. Allow it in your browser settings.');
      else
        toast.error('Camera error: ' + (err.message || 'Could not start camera'));
    } finally {
      setIsCameraLoading(false);
    }
  };

  // ── Flip Camera (mobile only) ─────────────────────────────────────────────
  const handleFlipCamera = async () => {
    if (!localParticipant || isFlipping || !isCameraEnabled) return;
    setIsFlipping(true);
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    try {
      // Turn camera off first, then back on with the new facing mode
      await localParticipant.setCameraEnabled(false);
      await localParticipant.setCameraEnabled(true, {
        resolution: VideoPresets.h360.resolution,
        facingMode: nextFacing,
      });
      setFacingMode(nextFacing);
      toast.success(nextFacing === 'environment' ? '📷 Rear camera' : '🤳 Front camera');
    } catch (err) {
      console.error('Camera flip error:', err);
      toast.error('Could not switch camera: ' + (err.message || 'Try again'));
      // Try to restore previous camera on failure
      try {
        await localParticipant.setCameraEnabled(true, {
          resolution: VideoPresets.h360.resolution,
          facingMode,
        });
      } catch (_) {}
    } finally {
      setIsFlipping(false);
    }
  };

  // ── Screen Share ──────────────────────────────────────────────────────────
  const handleToggleScreenShare = async () => {
    if (!localParticipant) return;

    // Mobile browsers don't support getDisplayMedia reliably
    if (isMobile) {
      toast.error('Screen sharing is not supported on mobile browsers.', {
        icon: '🖥️',
        duration: 3500,
      });
      return;
    }

    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    } catch (err) {
      console.error('Screen share error:', err);
      if (err.name !== 'NotAllowedError') {
        toast.error('Screen share failed: ' + err.message);
      }
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-2 sm:p-3 shrink-0 flex items-center justify-center bg-[#1e1f22]/95 backdrop-blur-md border-t border-[#2b2d31] select-none z-20">
      <div className="flex items-center gap-2 sm:gap-3 bg-[#111214]/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#2b2d31] shadow-xl">

        {/* 1. Mic */}
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
          {isMicLoading
            ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            : isMicrophoneEnabled
              ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {/* 2. Camera */}
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
          {isCameraLoading
            ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            : isCameraEnabled
              ? <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {/* 3. Flip Camera — mobile only, visible when camera is ON */}
        {showFlipBtn && (
          <button
            onClick={handleFlipCamera}
            disabled={isFlipping}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-[#5865f2] hover:bg-[#4752c4] text-white transition-all cursor-pointer shadow-md"
            title={facingMode === 'user' ? 'Switch to Rear Camera' : 'Switch to Front Camera'}
          >
            {isFlipping
              ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              : <FlipHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        )}

        {/* 4. Screen Share — disabled on mobile */}
        <div className="relative group">
          <button
            onClick={handleToggleScreenShare}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all shadow-md ${
              isMobile
                ? 'bg-[#35373c] text-zinc-500 cursor-not-allowed opacity-50'
                : isScreenShareEnabled
                  ? 'bg-[#23a55a] hover:bg-[#1f9250] text-white cursor-pointer'
                  : 'bg-[#35373c] hover:bg-[#3f4147] text-white cursor-pointer'
            }`}
            title={isMobile ? 'Screen sharing not available on mobile' : (isScreenShareEnabled ? 'Stop Sharing Screen' : 'Share Screen')}
          >
            {isScreenShareEnabled && !isMobile
              ? <MonitorOff className="w-4 h-4 sm:w-5 sm:h-5" />
              : <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Mobile tooltip badge */}
          {isMobile && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f23f42] text-white text-[8px] font-black flex items-center justify-center pointer-events-none">
              ✕
            </span>
          )}
        </div>

        {/* 5. Voice Chat Toggle */}
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

        {/* 6. Disconnect */}
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
