import { create } from 'zustand';

export const useVoiceStore = create((set) => ({
  participants: [],
  isMuted: false,
  isCameraOn: false,
  isScreenSharing: false,
  isConnected: false,
  voiceMessages: [],
  isChatOpen: false,

  setParticipants: (participants) => set({ participants }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setMuted: (isMuted) => set({ isMuted }),

  toggleCamera: () => set((state) => ({ isCameraOn: !state.isCameraOn })),
  setCameraOn: (isCameraOn) => set({ isCameraOn }),

  toggleScreenShare: () => set((state) => ({ isScreenSharing: !state.isScreenSharing })),
  setScreenSharing: (isScreenSharing) => set({ isScreenSharing }),

  setConnected: (isConnected) => set({ isConnected }),

  addVoiceMessage: (message) =>
    set((state) => ({
      voiceMessages: [...state.voiceMessages, message],
    })),

  clearVoiceMessages: () => set({ voiceMessages: [] }),

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setChatOpen: (isChatOpen) => set({ isChatOpen }),

  reset: () =>
    set({
      participants: [],
      isMuted: false,
      isCameraOn: false,
      isScreenSharing: false,
      isConnected: false,
      voiceMessages: [],
      isChatOpen: false,
    }),
}));

export default useVoiceStore;
