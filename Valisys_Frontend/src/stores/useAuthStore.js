import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('valisys_token') || null,
  isAuthenticated: !!localStorage.getItem('valisys_token'),

  login: (token) => {
    localStorage.setItem('valisys_token', token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('valisys_token');
    set({ token: null, isAuthenticated: false });
  }
}));

export default useAuthStore;