import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  username: string;
  isHost: boolean;

  setUsername: (username: string) => void;
  setIsHost: (value: boolean) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      username: "",
      isHost: false,

      setUsername: (username) => set({ username }),
      setIsHost: (value) => set({ isHost: value }),

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
