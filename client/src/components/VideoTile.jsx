import { useRef, useEffect } from 'react';

export default function VideoTile({
  stream,
  name,
  isLocal = false,
  isMuted = false,
  isCameraOff = false,
  className = '',
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, [stream]);

  return (
    <div
      className={`relative bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center ${className}`}
    >
      {stream && !isCameraOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal || isMuted}
          className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-slate-300 mb-1.5 shadow">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {isCameraOff ? 'Camera Off' : 'No Video'}
          </span>
        </div>
      )}

      {/* Label Badge */}
      {name && (
        <div className="absolute bottom-2 left-2 bg-slate-950/75 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-200 border border-slate-800 flex items-center gap-1.5 shadow pointer-events-none">
          {isLocal && (
            <span
              className={`w-1.5 h-1.5 rounded-full ${isCameraOff ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
            />
          )}
          <span>{isLocal ? `You (${name})` : name}</span>
          {isLocal && isMuted && (
            <span className="text-rose-400 font-bold ml-0.5">Muted</span>
          )}
        </div>
      )}
    </div>
  );
}
