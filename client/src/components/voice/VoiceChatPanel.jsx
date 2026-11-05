import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { useVoiceStore } from '../../store/voiceStore';
import { useAuthStore } from '../../store/authStore';

export default function VoiceChatPanel({ onSendMessage }) {
  const [input, setInput] = useState('');
  const voiceMessages = useVoiceStore((state) => state.voiceMessages);
  const toggleChat = useVoiceStore((state) => state.toggleChat);
  const currentUser = useAuthStore((state) => state.user);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [voiceMessages.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-30 sm:hidden backdrop-blur-xs"
        onClick={toggleChat}
      />
      <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-80 h-full bg-[#2b2d31] border-l border-[#1f2023] flex flex-col shrink-0 shadow-2xl select-none sm:static sm:z-20">
        {/* Panel Header */}
        <div className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between font-semibold text-white text-sm shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#80848e]" />
            <span>In-Call Chat</span>
            <span className="text-[10px] font-normal text-[#80848e] bg-[#1e1f22] px-1.5 py-0.5 rounded">
              Ephemeral
            </span>
          </div>
          <button
            onClick={toggleChat}
            className="p-1.5 rounded-lg hover:bg-[#35373c] text-[#b5bac1] hover:text-white transition-colors cursor-pointer"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages List View */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {voiceMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#80848e]">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">No in-call messages yet.</p>
              <p className="text-[11px] text-[#80848e]/70 mt-1">
                Messages vanish when you leave the call.
              </p>
            </div>
          ) : (
            voiceMessages.map((msg) => {
              const isOwn = msg.userId === currentUser?.id;
              return (
                <div key={msg.id} className="flex flex-col text-xs leading-relaxed">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`font-semibold ${isOwn ? 'text-[#5865f2]' : 'text-white'}`}>
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-[#80848e]">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[#dbdee1] bg-[#1e1f22] rounded-lg px-2.5 py-1.5 break-words">
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-[#1f2023] bg-[#232428] shrink-0">
          <div className="flex items-center gap-2 bg-[#383a40] rounded-lg px-3 py-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send message to call..."
              className="flex-1 bg-transparent text-white text-xs outline-none placeholder-[#80848e]"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="text-[#b5bac1] hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
