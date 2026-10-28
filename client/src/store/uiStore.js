import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isCreateServerOpen: false,
  isCreateChannelOpen: false,
  isServerSettingsOpen: false,
  isMemberListOpen: true,

  setCreateServerOpen: (open) => set({ isCreateServerOpen: open }),
  setCreateChannelOpen: (open) => set({ isCreateChannelOpen: open }),
  setServerSettingsOpen: (open) => set({ isServerSettingsOpen: open }),
  toggleMemberList: () => set((state) => ({ isMemberListOpen: !state.isMemberListOpen })),
}));

export default useUIStore;

