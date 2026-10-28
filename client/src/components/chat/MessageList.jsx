import { useEffect, useRef, useState, useCallback } from 'react';
import { Hash, Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import messageService from '../../services/messageService';
import MessageItem from './MessageItem';

const EMPTY_MESSAGES = [];

export default function MessageList({ channelId, channelName }) {
  // Stable selectors to avoid React 19 getSnapshot infinite loop
  const rawMessages = useChatStore((state) => state.messages[channelId]);
  const messages = rawMessages || EMPTY_MESSAGES;

  const hasMore = useChatStore((state) => Boolean(state.hasMore[channelId]));
  const nextCursor = useChatStore((state) => state.nextCursors[channelId] ?? null);
  const setMessages = useChatStore((state) => state.setMessages);
  const prependMessages = useChatStore((state) => state.prependMessages);

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const prevHeightRef = useRef(0);

  // 1. Fetch initial message history
  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      setIsLoadingHistory(true);
      try {
        const data = await messageService.getMessages(channelId);
        if (!isMounted) return;

        // Backend returns newest first; reverse so oldest is at the top of the chat view
        const chronological = (data.messages || []).reverse();
        setMessages(channelId, chronological, Boolean(data.nextCursor), data.nextCursor);
      } catch (err) {
        console.error('Failed to load message history:', err);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [channelId, setMessages]);

  // 2. Auto-scroll to bottom on new message
  useEffect(() => {
    if (!isLoadingMore) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages.length, isLoadingMore]);

  // 3. Infinite scroll — load older messages when user scrolls near the top
  const handleScroll = useCallback(async () => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingMore || !hasMore || !nextCursor) return;

    if (container.scrollTop < 60) {
      setIsLoadingMore(true);
      prevHeightRef.current = container.scrollHeight;

      try {
        const data = await messageService.getMessages(channelId, nextCursor);
        const olderChronological = (data.messages || []).reverse();
        prependMessages(
          channelId,
          olderChronological,
          Boolean(data.nextCursor),
          data.nextCursor
        );

        // Maintain scroll position after prepending
        requestAnimationFrame(() => {
          if (container) {
            const addedHeight = container.scrollHeight - prevHeightRef.current;
            container.scrollTop = addedHeight + container.scrollTop;
          }
        });
      } catch (err) {
        console.error('Failed to load more messages:', err);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [channelId, hasMore, nextCursor, isLoadingMore, prependMessages]);

  if (isLoadingHistory && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5865f2]" />
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-1 py-4 flex flex-col justify-start"
    >
      {/* Loading older messages indicator */}
      {isLoadingMore && (
        <div className="py-2 flex justify-center items-center text-xs text-[#80848e]">
          <Loader2 className="w-4 h-4 animate-spin text-[#5865f2] mr-2" />
          Loading older messages...
        </div>
      )}

      {/* Start of channel header */}
      {!hasMore && (
        <div className="px-4 pt-8 pb-4 mb-2 select-none">
          <div className="w-16 h-16 rounded-full bg-[#35373c] flex items-center justify-center text-white mb-3 shadow-md">
            <Hash className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">
            Welcome to #{channelName}!
          </h2>
          <p className="text-sm text-[#949ba4]">
            This is the start of the #{channelName} channel.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-0.5">
        {messages.map((msg, idx) => {
          const prevMsg = idx > 0 ? messages[idx - 1] : null;

          // Check if message should be displayed compact:
          // Same author AND within 5 minutes (300,000ms)
          const isSameAuthor = prevMsg?.userId === msg.userId || prevMsg?.user?.id === msg.user?.id;
          const timeDiff = prevMsg
            ? new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime()
            : Infinity;
          const isCompact = isSameAuthor && timeDiff < 5 * 60 * 1000;

          return <MessageItem key={msg.id} message={msg} isCompact={isCompact} />;
        })}
        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
}
