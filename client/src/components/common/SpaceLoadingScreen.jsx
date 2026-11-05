export default function SpaceLoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070814] text-[#f2f3f5] select-none overflow-hidden">
      {/* Full-Screen Animated Space Background GIF (from Pinterest) */}
      <img
        src="/space-full-bg.gif"
        alt="Space Loading Background"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/space-loader.gif';
        }}
      />

      {/* Cinematic dark vignette overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 bg-radial from-transparent via-black/25 to-black/70 pointer-events-none" />

      {/* Centered Loading Indicator */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        {/* Glowing Glass Tag */}
        <div className="px-5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center gap-2.5">
          <p className="text-base sm:text-lg font-bold text-white tracking-widest uppercase flex items-center gap-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <span>{message}</span>
            <span className="inline-flex gap-0.5 text-[#5865f2]">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </p>

          {/* Glowing Cosmic Progress Bar */}
          <div className="w-48 sm:w-56 h-1.5 bg-white/15 rounded-full overflow-hidden shadow-inner">
            <div className="h-full w-full bg-gradient-to-r from-[#5865f2] via-[#a78bfa] to-[#5865f2] rounded-full animate-pulse shadow-[0_0_12px_rgba(88,101,242,0.8)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
