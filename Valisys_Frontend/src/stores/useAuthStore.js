import { create } from 'zustand';

const storageKey = 'valisys_token';
const userDataKey = 'valisys_user';
const themeKey = 'valisys_theme'; 

const getInitialTheme = () => {
    return localStorage.getItem(themeKey) || 'white';
};

const getStoredUser = () => {
  const data = localStorage.getItem(userDataKey);
  
  if (!data || data === 'undefined') {
    return { id: null, nome: 'Usuário' };
  }
  
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.removeItem(userDataKey); 
    return { id: null, nome: 'Usuário' };
  }
};

const useAuthStore = create((set) => ({
  token: localStorage.getItem(storageKey) || null,
  isAuthenticated: !!localStorage.getItem(storageKey),
  user: getStoredUser(), 
  theme: getInitialTheme(), 

  login: (token, userData) => { 
    localStorage.setItem(storageKey, token);
    localStorage.setItem(userDataKey, JSON.stringify(userData)); 
    set({ token, isAuthenticated: true, user: userData });
  },

  logout: () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(userDataKey); 
    set({ token: null, isAuthenticated: false, user: { id: null, nome: 'Usuário' } });
  },
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeKey, newTheme);
    return { theme: newTheme };
  })
}));

export default useAuthStore;