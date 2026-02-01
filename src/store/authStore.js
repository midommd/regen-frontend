import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const userData = await authService.login(credentials);
          set({ user: userData, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return { success: false, message: err.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const newUser = await authService.register(userData);
          set({ user: newUser, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return { success: false, message: err.message };
        }
      },

      logout: () => {
        set({ user: null });
      }
    }),
    {
      name: 'regen-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);