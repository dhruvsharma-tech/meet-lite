import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useWebRTC } from '../hooks/useWebRTC';
import VideoTile from '../components/VideoTile';
import Controls from '../components/Controls';
import ChatPanel from '../components/ChatPanel';

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();

  const name = location.state?.name?.trim() || 'Guest';

  const {
    localStream,
    peerName,
    messages,
    sendMessage,
    micOn,
    camOn,
    toggleMic,
    toggleCam,
    leave,
    error,
    isJoined,
  } = useWebRTC(roomId, name);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText && roomId) {
      navigator.clipboard.writeText(roomId).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Error state (e.g. Camera/mic permissions blocked)
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{error}</h2>
          <p className="text-sm text-slate-500 mb-6">
            Please allow access to your camera and microphone in browser settings to join the call.
          </p>
          <button
            type="button"
            onClick={leave}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-medium text-xs transition shadow"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Connecting / Joining state
  if (!isJoined) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Starting camera & joining room {roomId}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 max-w-6xl w-full mx-auto gap-4">
      {/* Header with Room ID + Copy Button + User */}
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
          <span className="text-xs text-slate-500 font-medium">
            You: <strong className="text-slate-800">{name}</strong>
          </span>
          <button
            type="button"
            id="header-leave-btn"
            onClick={leave}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-xs transition shadow-sm"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main Area: Video Area (with Controls & Local overlay) + Chat Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[460px]">
        {/* Video Area (2 cols on large screen) */}
        <div className="lg:col-span-2 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[380px] shadow-sm">
          {/* Remote Video Tile / Presence Placeholder */}
          <div className="text-center p-6">
            {peerName ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-2xl shadow">
                  {peerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white tracking-wide">
                    {peerName} is here
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    WebRTC peer connection starts in Step 12
                  </p>
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

          {/* Local Video Tile Overlay (bottom-right) */}
          <div className="absolute bottom-4 right-4 z-10">
            <VideoTile
              stream={localStream}
              name={name}
              isLocal
              isMuted={!micOn}
              isCameraOff={!camOn}
              className="w-36 h-24 sm:w-48 sm:h-32 shadow-2xl border-2 border-slate-700/80"
            />
          </div>

          {/* Floating Media Controls (bottom-center) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <Controls
              micOn={micOn}
              camOn={camOn}
              onToggleMic={toggleMic}
              onToggleCam={toggleCam}
              onLeave={leave}
            />
          </div>
        </div>

        {/* Chat Panel (1 col on large screen) */}
        <div className="lg:col-span-1 flex flex-col min-h-[380px]">
          <ChatPanel
            messages={messages}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
