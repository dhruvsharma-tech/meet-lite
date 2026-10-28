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

  updateMemberPresence: (userId, status) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.userId === userId || m.user?.id === userId
          ? { ...m, status }
          : m
      ),
    })),
}));

export default useServerStore;

