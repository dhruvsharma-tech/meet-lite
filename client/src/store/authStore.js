import { create } from 'zustand';
import authService from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isLoading: false,
  }),

  clearUser: () => set({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const data = await authService.getMe();
      if (data?.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return data.user;
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return null;
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },
}));

export default useAuthStore;
