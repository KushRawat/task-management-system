'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "./types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  setSession: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, token) => set({ user, accessToken: token }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "task-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
