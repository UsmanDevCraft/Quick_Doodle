import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  username: string;
  isHost: boolean;
  riddleMode: "riddle" | "draw";

  setUsername: (username: string) => void;
  setIsHost: (value: boolean) => void;
  setRiddleMode: (mode: "riddle" | "draw") => void;
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
      setRiddleMode: (mode: "riddle" | "draw") => set({ riddleMode: mode }),

      resetUser: () => set({ username: "", isHost: false }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        username: state.username,
        isHost: state.isHost,
        riddleMode: state.riddleMode,
      }),
    }
  )
);
