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
    <div className="w-80 h-full bg-[#2b2d31] border-l border-[#1f2023] flex flex-col shrink-0 z-30 select-none">
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
          className="p-1 rounded hover:bg-[#35373c] text-[#b5bac1] hover:text-white transition-colors cursor-pointer"
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
            <p className="text-[10px] mt-1 text-[#80848e]/70">
              Messages will disappear when the voice channel is empty.
            </p>
          </div>
        ) : (
          voiceMessages.map((msg) => {
            const isMe = msg.userId === currentUser?.id;
            return (
              <div key={msg.id} className="flex flex-col text-xs">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`font-semibold ${isMe ? 'text-[#5865f2]' : 'text-white'}`}>
                    {msg.name || 'User'}
                  </span>
                  <span className="text-[10px] text-[#80848e]">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
                <div className="bg-[#313338] rounded-md px-2.5 py-1.5 text-[#dbdee1] break-words text-[13px] leading-relaxed">
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#1f2023] bg-[#2b2d31]">
        <div className="flex items-center bg-[#383a40] rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#5865f2]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send in-call message..."
            className="flex-1 bg-transparent border-none text-white text-xs outline-none placeholder:text-[#80848e]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-1 rounded text-[#5865f2] hover:text-white disabled:opacity-30 disabled:hover:text-[#5865f2] transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

