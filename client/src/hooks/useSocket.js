import { useEffect, useRef, useCallback } from 'react';
import socket, { connectSocket } from '../socket';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { useServerStore } from '../store/serverStore';

export function useSocket(channelId) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addMessage = useChatStore((state) => state.addMessage);
  const addOptimisticMessage = useChatStore((state) => state.addOptimisticMessage);
  const confirmOptimisticMessage = useChatStore((state) => state.confirmOptimisticMessage);
  const removeOptimisticMessage = useChatStore((state) => state.removeOptimisticMessage);
  const setTypingUser = useChatStore((state) => state.setTypingUser);
  const updateMemberPresence = useServerStore((state) => state.updateMemberPresence);

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Connect socket if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    }
  }, [isAuthenticated]);

  // Join/leave channel room & setup listeners
  useEffect(() => {
    if (!channelId) return;

    // Join channel
    socket.emit('channel:join', { channelId });

    // Handle new incoming messages (from server broadcast — may include our own confirmed msg)
    const handleNewMessage = (message) => {
      if (message.channelId === channelId) {
        addMessage(channelId, message);
      }
    };

    // Handle typing indicators from other users
    const handleTypingUpdate = ({ channelId: incomingChannelId, userId, name, isTyping }) => {
      // Don't show typing indicator for yourself
      if (userId === user?.id) return;
      if (incomingChannelId === channelId) {
        setTypingUser(channelId, { userId, name, isTyping });
      }
    };

    socket.on('message:new', handleNewMessage);
    socket.on('typing:update', handleTypingUpdate);

    // Presence updates from server
    const handlePresenceUpdate = ({ userId, status }) => {
      updateMemberPresence(userId, status);
    };
    socket.on('presence:update', handlePresenceUpdate);

    return () => {
      socket.emit('channel:leave', { channelId });
      socket.off('message:new', handleNewMessage);
      socket.off('typing:update', handleTypingUpdate);
      socket.off('presence:update', handlePresenceUpdate);

      // Stop typing if leaving channel
      if (isTypingRef.current) {
        socket.emit('typing:stop', { channelId });
        isTypingRef.current = false;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [channelId, user?.id, addMessage, addOptimisticMessage, setTypingUser, updateMemberPresence]);

  // Send message with optimistic update
  const sendMessage = useCallback(
    (content) => {
      if (!channelId || !content.trim()) return;

      // Stop typing immediately when sending
      if (isTypingRef.current) {
        socket.emit('typing:stop', { channelId });
        isTypingRef.current = false;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // 1. Create a temporary optimistic message — shown instantly in UI
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      const optimisticMessage = {
        id: tempId,
        channelId,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        pending: true,          // used by MessageItem to show "sending..." style
        user: {
          id: user?.id,
          name: user?.name || 'You',
          avatar: user?.avatar || null,
        },
      };

      // 2. Show message instantly
      addOptimisticMessage(channelId, optimisticMessage);

      // 3. Send to server — use acknowledgment callback
      socket.emit('message:send', { channelId, content: content.trim() }, (response) => {
        if (response?.ok && response?.message) {
          // Server confirmed — swap temp with real message
          confirmOptimisticMessage(channelId, tempId, response.message);
        } else {
          // Server rejected — remove temp message and show subtle error
          removeOptimisticMessage(channelId, tempId);
          console.warn('[Chat] Message failed:', response?.error);
        }
      });
    },
    [channelId, user, addOptimisticMessage, confirmOptimisticMessage, removeOptimisticMessage]
  );

  // Debounced typing handler
  const handleTyping = useCallback(() => {
    if (!channelId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing:start', { channelId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { channelId });
      isTypingRef.current = false;
    }, 1500);
  }, [channelId]);

  return {
    sendMessage,
    handleTyping,
  };
}

export default useSocket;

