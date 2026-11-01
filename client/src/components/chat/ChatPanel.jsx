import { Hash, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useUIStore } from '../../store/uiStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

export default function ChatPanel({ channelId, channelName }) {
  const { serverId } = useParams();
  const { sendMessage, handleTyping } = useSocket(channelId, serverId);
  const toggleMemberList = useUIStore((state) => state.toggleMemberList);
  const isMemberListOpen = useUIStore((state) => state.isMemberListOpen);

  return (
    <div className="flex-1 flex flex-col h-full chat-cosmic-bg overflow-hidden relative">
      {/* Chat Top Header */}
      <header className="h-12 border-b border-white/5 px-4 flex items-center justify-between shrink-0 shadow-sm bg-[#0a0b16]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Hash className="w-5 h-5 text-[#80848e]" />
          <span>{channelName}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMemberList}
            className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
              isMemberListOpen ? 'text-white bg-white/10' : 'text-[#b5bac1]'
            }`}
            title="Toggle Member List"
          >
            <Users className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Message List Viewport */}
      <MessageList channelId={channelId} channelName={channelName} />

      {/* Typing Indicator */}
      <TypingIndicator channelId={channelId} />

      {/* Message Input Bar */}
      <MessageInput
        channelName={channelName}
        onSendMessage={sendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
}

