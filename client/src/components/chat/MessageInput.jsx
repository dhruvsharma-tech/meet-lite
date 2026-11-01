import { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';

export default function MessageInput({ channelName, onSendMessage, onTyping }) {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  // Auto-grow textarea up to 4 lines
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    if (onTyping) onTyping();
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSendMessage(content.trim());
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="px-4 pb-4">
      <div className="bg-[#141628]/90 border border-white/10 focus-within:border-[#5865f2]/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-lg backdrop-blur-sm transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName || 'channel'}`}
          rows={1}
          maxLength={2000}
          className="flex-1 bg-transparent text-sm text-[#f2f3f5] placeholder-[#80848e] focus:outline-none resize-none max-h-32 leading-5 scrollbar-thin"
        />
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="p-1.5 rounded-full text-[#80848e] hover:text-[#5865f2] disabled:opacity-30 disabled:hover:text-[#80848e] transition-colors cursor-pointer shrink-0"
          title="Send Message"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

