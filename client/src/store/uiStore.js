import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isCreateServerOpen: false,
  createServerMode: 'CREATE', // 'CREATE' | 'JOIN'
  isCreateChannelOpen: false,
  isServerSettingsOpen: false,
  isMemberListOpen: true,
  isInviteModalOpen: false,
  isMobileNavOpen: false, // Mobile sliding drawer for servers + channels

  openCreateServer: (mode = 'CREATE') => set({ isCreateServerOpen: true, createServerMode: mode }),
  setCreateServerOpen: (open) => set((state) => ({ isCreateServerOpen: open, createServerMode: open ? state.createServerMode : 'CREATE' })),
  setCreateChannelOpen: (open) => set({ isCreateChannelOpen: open }),
  setServerSettingsOpen: (open) => set({ isServerSettingsOpen: open }),
  setInviteModalOpen: (open) => set({ isInviteModalOpen: open }),
  toggleMemberList: () => set((state) => ({ isMemberListOpen: !state.isMemberListOpen })),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
}));

export default useUIStore;
