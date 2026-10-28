import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: {},     // { [channelId]: Message[] }
  typingUsers: {},  // { [channelId]: Array<{ userId, name }> }
  hasMore: {},      // { [channelId]: boolean }
  nextCursors: {},  // { [channelId]: string | null }

  setMessages: (channelId, messages, hasMore = false, nextCursor = null) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: messages,
      },
      hasMore: {
        ...state.hasMore,
        [channelId]: hasMore,
      },
      nextCursors: {
        ...state.nextCursors,
        [channelId]: nextCursor,
      },
    })),

  addMessage: (channelId, message) =>
    set((state) => {
      const channelMessages = state.messages[channelId] || [];
      // Prevent duplicate messages if already present
      if (channelMessages.some((m) => m.id === message.id)) {
        return state;
      }
      return {
        messages: {
          ...state.messages,
          [channelId]: [...channelMessages, message],
        },
      };
    }),

  prependMessages: (channelId, olderMessages, hasMore = false, nextCursor = null) =>
    set((state) => {
      const current = state.messages[channelId] || [];
      // Filter out any duplicates
      const existingIds = new Set(current.map((m) => m.id));
      const filteredOlder = olderMessages.filter((m) => !existingIds.has(m.id));

      return {
        messages: {
          ...state.messages,
          [channelId]: [...filteredOlder, ...current],
        },
        hasMore: {
          ...state.hasMore,
          [channelId]: hasMore,
        },
        nextCursors: {
          ...state.nextCursors,
          [channelId]: nextCursor,
        },
      };
    }),

  setTypingUser: (channelId, { userId, name, isTyping }) =>
    set((state) => {
      const currentTyping = state.typingUsers[channelId] || [];
      let updated;
      if (isTyping) {
        if (currentTyping.some((u) => u.userId === userId)) {
          updated = currentTyping;
        } else {
          updated = [...currentTyping, { userId, name }];
        }
      } else {
        updated = currentTyping.filter((u) => u.userId !== userId);
      }

      return {
        typingUsers: {
          ...state.typingUsers,
          [channelId]: updated,
        },
      };
    }),
}));

export default useChatStore;

