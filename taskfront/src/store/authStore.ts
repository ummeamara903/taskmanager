import { create } from "zustand";

interface AuthState {
  loggedIn: boolean;
  token: string | null;   // <-- add token
  setLoggedIn: (value: boolean) => void;
  setToken: (value: string | null) => void;  // <-- setter for token
}

export const useAuthStore = create<AuthState>((set) => ({
  loggedIn: false,
  token: null,
  setLoggedIn: (value) => set({ loggedIn: value }),
  setToken: (value) => set({ token: value }),
}));
