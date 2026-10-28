import { useChatStore } from '../../store/chatStore';

const EMPTY_TYPING = [];

export default function TypingIndicator({ channelId }) {
  const rawTyping = useChatStore((state) => state.typingUsers[channelId]);
  const typingUsers = rawTyping || EMPTY_TYPING;

  if (typingUsers.length === 0) {
    return <div className="h-6" />;
  }

  let text = '';
  if (typingUsers.length === 1) {
    text = `${typingUsers[0].name} is typing...`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
  } else {
    text = 'Several people are typing...';
  }

  return (
    <div className="h-6 px-4 flex items-center gap-2 text-xs text-[#b5bac1] select-none">
      {/* 3 Bouncing Dots */}
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#b5bac1] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#b5bac1] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#b5bac1] animate-bounce" />
      </span>
      <span className="font-medium text-white">{text}</span>
    </div>
  );
}
