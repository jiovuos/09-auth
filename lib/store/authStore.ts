import { create } from "zustand";

type AuthUser = {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
} | null;

interface AuthState {
  user: AuthUser;
  isAuthenticated: boolean;
  setUser: (u: AuthUser) => void;
  clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (u) => set({ user: u, isAuthenticated: !!u }),
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
}));
