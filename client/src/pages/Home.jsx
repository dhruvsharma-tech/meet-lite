import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { socket } from '../socket';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load name from localStorage with try/catch
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('meetlite_name') || '';
    } catch {
      return '';
    }
  });

  const [roomIdInput, setRoomIdInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Save name to localStorage on change
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    try {
      localStorage.setItem('meetlite_name', val);
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  };

  // Check if redirected from Room with an error in navigation state
  useEffect(() => {
    if (location.state?.error) {
      const err = location.state.error;
      if (err === 'ROOM_NOT_FOUND') {
        setErrorMessage('Room not found. Please check the Room ID.');
      } else if (err === 'ROOM_FULL') {
        setErrorMessage('Room is full. Maximum 2 participants allowed.');
      } else {
        setErrorMessage(typeof err === 'string' ? err : 'Unable to join room.');
      }
    }
  }, [location.state]);

  // Create room flow
  const handleCreateRoom = () => {
    if (isCreating) return;
    setIsCreating(true);
    setErrorMessage('');

    socket.emit('create-room', (res) => {
      setIsCreating(false);
      if (res?.ok && res.roomId) {
        navigate(`/room/${res.roomId}`, { state: { name: name.trim() } });
      } else {
        setErrorMessage('Failed to create room. Please try again.');
      }
    });
  };

  // Join room flow
  const handleJoinRoom = (e) => {
    e.preventDefault();
    const cleanId = roomIdInput.trim();
    if (!cleanId) return;

    setErrorMessage('');
    navigate(`/room/${cleanId}`, { state: { name: name.trim() } });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meet Lite</h1>
          <p className="text-sm text-slate-500 mt-1">
            Fast, secure 1-on-1 video calls with instant chat
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Optional Name Input */}
          <div>
            <label htmlFor="name-input" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Your Name (Optional)
            </label>
            <input
              id="name-input"
              type="text"
              maxLength={20}
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Alice"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
            />
          </div>

          {/* Create Room Button */}
          <button
            type="button"
            id="create-room-btn"
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm transition shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating room...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Create New Room</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
              or
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Join Room Form */}
          <form onSubmit={handleJoinRoom} className="space-y-2">
            <div>
              <label htmlFor="room-id-input" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Join an Existing Room
              </label>
              <div className="flex gap-2">
                <input
                  id="room-id-input"
                  type="text"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  placeholder="Enter 8-digit Room ID"
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                />
                <button
                  type="submit"
                  id="join-room-btn"
                  disabled={!roomIdInput.trim()}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-medium text-sm transition shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Join
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
