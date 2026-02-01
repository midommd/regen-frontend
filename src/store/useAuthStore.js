import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('regen_user')) || null,
  isLoading: false,
  error: null,

  setUser: (userData) => {
    localStorage.setItem('regen_user', JSON.stringify(userData));
    set({ user: userData });
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const userPayload = response.user ? response.user : response;

      localStorage.setItem('regen_user', JSON.stringify(userPayload));
      if (response.token) {
        localStorage.setItem('token', response.token); 
      }

      set({ user: userPayload, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false, message: err.message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      
      const userPayload = response.user ? response.user : response;

      localStorage.setItem('regen_user', JSON.stringify(userPayload));
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      set({ user: userPayload, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false, message: err.message };
    }
  },

  logout: () => {
    authService.logout?.();
    localStorage.removeItem('regen_user');
    localStorage.removeItem('token');
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null })
}));