import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  username: string;
  isHost: boolean;
  riddleMode: string;

  setUsername: (username: string) => void;
  setIsHost: (value: boolean) => void;
  setRiddleMode: (mode: string) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      username: "",
      isHost: false,
      riddleMode: "riddle",

      setUsername: (username) => set({ username }),
      setIsHost: (value) => set({ isHost: value }),
      setRiddleMode: (mode) => set({ riddleMode: mode }),

      resetUser: () => set({ username: "", isHost: false }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        username: state.username,
        isHost: state.isHost,
      }),
    }
  )
);
