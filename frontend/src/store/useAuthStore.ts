import { create } from 'zustand';

interface AuthState {
  user: any | null;
  child: any | null;
  setUser: (user: any) => void;
  setChild: (child: any) => void;
  updateChild: (updates: Partial<any>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  child: JSON.parse(localStorage.getItem('child') || 'null'),

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setChild: (child) => {
    localStorage.setItem('child', JSON.stringify(child));
    set({ child });
  },

  // Merge partial updates into the child profile
  updateChild: (updates) => {
    const current = get().child || {};
    const updated = { ...current, ...updates };
    localStorage.setItem('child', JSON.stringify(updated));
    set({ child: updated });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('child');
    set({ user: null, child: null });
  },
}));
