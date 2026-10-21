export default function Controls({
  micOn = true,
  camOn = true,
  onToggleMic,
  onToggleCam,
  onLeave,
}) {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-2xl">
      {/* Mic Button */}
      <button
        type="button"
        id="toggle-mic-btn"
        onClick={onToggleMic}
        title={micOn ? 'Mute microphone' : 'Unmute microphone'}
        className={`p-2.5 rounded-xl transition flex items-center justify-center ${
          micOn
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30'
        }`}
      >
        {micOn ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
      </button>

      {/* Camera Button */}
      <button
        type="button"
        id="toggle-cam-btn"
        onClick={onToggleCam}
        title={camOn ? 'Turn camera off' : 'Turn camera on'}
        className={`p-2.5 rounded-xl transition flex items-center justify-center ${
          camOn
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30'
        }`}
      >
        {camOn ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        )}
      </button>

      <div className="h-5 w-px bg-slate-700 mx-0.5"></div>

      {/* Red Leave Button */}
      <button
        type="button"
        id="leave-call-btn"
        onClick={onLeave}
        title="Leave call"
        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-xs transition shadow-sm hover:shadow flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Leave</span>
      </button>
    </div>
  );
}
