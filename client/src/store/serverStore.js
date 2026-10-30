import { create } from 'zustand';

export const useServerStore = create((set) => ({
  servers: [],
  currentServer: null,
  channels: [],
  members: [],

  setServers: (servers) => set({ servers }),

  addServer: (server) =>
    set((state) => ({
      servers: [...state.servers, server],
    })),

  removeServer: (serverId) =>
    set((state) => ({
      servers: state.servers.filter((s) => s.id !== serverId),
      currentServer: state.currentServer?.id === serverId ? null : state.currentServer,
      channels: state.currentServer?.id === serverId ? [] : state.channels,
      members: state.currentServer?.id === serverId ? [] : state.members,
    })),

  setCurrentServer: (currentServer) =>
    set({
      currentServer,
      channels: currentServer?.channels || [],
      members: currentServer?.members || [],
    }),

  setChannels: (channels) => set({ channels }),

  addChannel: (channel) =>
    set((state) => ({
      channels: [...state.channels, channel],
    })),

  removeChannel: (channelId) =>
    set((state) => ({
      channels: state.channels.filter((c) => c.id !== channelId),
    })),

  setMembers: (members) => set({ members }),

  setOnlineUsers: (onlineUserIds = []) =>
    set((state) => {
      const onlineSet = new Set(onlineUserIds);
      return {
        members: state.members.map((m) => {
          const uid = m.userId || m.user?.id;
          const isOnline = onlineSet.has(uid);
          return {
            ...m,
            status: isOnline ? 'online' : 'offline',
            isOnline,
            user: m.user ? { ...m.user, isOnline } : { isOnline },
          };
        }),
      };
    }),

  updateMemberPresence: (userId, status) =>
    set((state) => ({
      members: state.members.map((m) => {
        if (m.userId === userId || m.user?.id === userId) {
          const isOnline = status === 'online';
          return {
            ...m,
            status,
            isOnline,
            user: m.user ? { ...m.user, isOnline } : { isOnline },
          };
        }
        return m;
      }),
    })),
}));

export default useServerStore;

