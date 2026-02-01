import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  activeNotification: null, 

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  setNotification: (notification) => {
    set({ activeNotification: notification });
    if (notification) {
      setTimeout(() => set({ activeNotification: null }), 4000);
    }
  },

  clearNotification: () => set({ activeNotification: null })
}));