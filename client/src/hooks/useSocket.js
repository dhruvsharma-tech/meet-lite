import { useEffect, useRef, useCallback } from 'react';
import socket, { connectSocket } from '../socket';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { useServerStore } from '../store/serverStore';

export function useSocket(channelId) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addMessage = useChatStore((state) => state.addMessage);
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

    // Handle new incoming messages
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
  }, [channelId, user?.id, addMessage, setTypingUser, updateMemberPresence]);

  // Send message helper
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

      socket.emit('message:send', {
        channelId,
        content: content.trim(),
      });
    },
    [channelId]
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

