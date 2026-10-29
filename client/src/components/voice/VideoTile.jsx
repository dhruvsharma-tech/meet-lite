import { MicOff, Mic } from 'lucide-react';
import { VideoTrack, useIsSpeaking } from '@livekit/components-react';

export default function VideoTile({ trackRef, participant }) {
  const p = participant || trackRef?.participant;
  const isSpeaking = useIsSpeaking(p);

  const hasVideo =
    Boolean(trackRef?.publication?.track) &&
    !trackRef?.publication?.isMuted &&
    Boolean(p?.isCameraEnabled);

  const isMuted = !p?.isMicrophoneEnabled;
  const isLocal = Boolean(p?.isLocal);
  const displayName = p?.name || p?.identity || 'Participant';
  const initial = displayName[0]?.toUpperCase() || '?';

  return (
    <div
      className={`relative w-full h-full min-h-[160px] bg-[#1e1f22] rounded-xl overflow-hidden flex items-center justify-center transition-all duration-150 border-2 select-none ${
        isSpeaking ? 'border-[#23a55a] shadow-[0_0_12px_rgba(35,165,90,0.4)]' : 'border-[#2b2d31]'
      }`}
    >
      {/* Video Feed (rendered only when camera is ON) */}
      {hasVideo ? (
        <VideoTrack
          trackRef={trackRef}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        /* Avatar Placeholder when Camera is OFF */
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-md">
            {initial}
          </div>
        </div>
      )}

      {/* Participant Name Badge & Mic Status */}
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-medium text-white max-w-[85%] z-10">
        <span className="truncate">{displayName}</span>
        {isLocal && <span className="text-[#949ba4] text-[11px] font-normal">(You)</span>}
        {isMuted ? (
          <MicOff className="w-3.5 h-3.5 text-[#f23f42] shrink-0" />
        ) : (
          <Mic className="w-3.5 h-3.5 text-[#23a55a] shrink-0" />
        )}
      </div>

      {/* Speaking Glow indicator icon on top right */}
      {isSpeaking && (
        <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-[#23a55a] animate-pulse z-10" />
      )}
    </div>
  );
}
