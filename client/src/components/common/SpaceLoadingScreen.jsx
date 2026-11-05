export default function SpaceLoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070814] text-[#f2f3f5] select-none overflow-hidden app-cosmic-bg">
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#5865f2]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Astronauts Space Animation Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md w-full px-6 text-center">
        <div className="relative w-full aspect-video sm:w-[360px] sm:h-[200px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(88,101,242,0.25)] bg-[#0d0f1b] flex items-center justify-center">
          <img
            src="/space-loader.gif"
            alt="Loading in space"
            className="w-full h-full object-cover select-none pointer-events-none"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/space-loader.png';
            }}
          />
          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070814]/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Loading text & sleek progress indicator */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-base font-semibold text-white tracking-wider flex items-center gap-1.5">
            <span>{message}</span>
            <span className="inline-flex gap-0.5">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </p>

          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-[#5865f2] via-[#a78bfa] to-[#5865f2] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
