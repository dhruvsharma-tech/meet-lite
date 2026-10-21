import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../socket';

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const name = location.state?.name?.trim() || 'Guest';

  const [isJoined, setIsJoined] = useState(false);
  const [peerName, setPeerName] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const onUserJoined = ({ name: joinedName }) => {
      if (isMounted) setPeerName(joinedName);
    };

    const onUserLeft = () => {
      if (isMounted) setPeerName(null);
    };

    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);

    // Join room
    socket.emit('join-room', { roomId, name }, (res) => {
      if (!isMounted) return;

      if (!res?.ok) {
        navigate('/', { state: { error: res?.error || 'FAILED_TO_JOIN' } });
        return;
      }

      setIsJoined(true);

      // Check if another user was already present in the room
      if (Array.isArray(res.users)) {
        const otherUser = res.users.find((u) => u.id !== socket.id);
        if (otherUser) {
          setPeerName(otherUser.name);
        }
      }
    });

    return () => {
      isMounted = false;
      socket.emit('leave-room');
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
    };
  }, [roomId, name, navigate]);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText && roomId) {
      navigator.clipboard.writeText(roomId).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (!isJoined) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Joining room {roomId}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 max-w-6xl w-full mx-auto gap-4">
      {/* Header with Room ID + Copy Button + Leave */}
      <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-sm text-slate-500 font-medium">Room ID:</span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md text-sm border border-slate-200">
            {roomId}
          </span>
          <button
            type="button"
            id="copy-room-id-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 transition"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            You: <strong className="text-slate-800">{name}</strong>
          </span>
          <button
            type="button"
            id="leave-room-btn"
            onClick={() => navigate('/')}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-xs transition shadow-sm"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main Area: Video Area + Chat Placeholder */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[460px]">
        {/* Video Area (2 cols on large screen) */}
        <div className="lg:col-span-2 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[340px] shadow-sm">
          {/* Remote Video Tile Placeholder */}
          <div className="text-center p-6">
            {peerName ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-2xl">
                  {peerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white tracking-wide">
                    {peerName} is here
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Remote video placeholder</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 max-w-sm">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-slate-200">
                  Waiting for someone to join. Share the room ID.
                </h3>
                <p className="text-xs text-slate-500">
                  Send the 8-digit Room ID to invite another participant.
                </p>
              </div>
            )}
          </div>

          {/* Local Video Tile Placeholder (bottom-right overlay) */}
          <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-3 shadow-lg flex items-center gap-2 text-slate-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Local Video: <strong>{name}</strong></span>
          </div>
        </div>

        {/* Chat Placeholder (1 col on large screen) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Room Chat</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Step 10
              </span>
            </div>

            <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                💬
              </div>
              <span>Chat panel placeholder</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <input
              type="text"
              disabled
              placeholder="Chat will be available in Step 10..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
