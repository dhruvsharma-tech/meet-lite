import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';

export default function ChatPanel({ messages = [], onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom whenever new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  const formatTime = (time) => {
    if (!time) return '';
    try {
      return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-full min-h-[420px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="font-semibold text-slate-800 text-sm">Room Chat</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {messages.filter((m) => m.type !== 'system').length} messages
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[420px]">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-xs">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, idx) => {
            // System message (joined / left)
            if (msg.type === 'system') {
              return (
                <div key={msg.id || idx} className="flex justify-center my-2">
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-100/90 px-3 py-1 rounded-full border border-slate-200/40">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isMine = msg.id === socket.id;

            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                {!isMine && (
                  <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-1">
                    {msg.name}
                  </span>
                )}
                <div
                  className={`max-w-[85%] px-3.5 py-2 text-xs leading-relaxed break-words whitespace-pre-wrap ${
                    isMine
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm shadow-sm'
                      : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm border border-slate-200/60'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.time && (
                  <span className="text-[9px] text-slate-400 mt-1 px-1">
                    {formatTime(msg.time)}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + Send */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-slate-50/50 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message... (Enter to send)"
          maxLength={500}
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs transition shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <span>Send</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
