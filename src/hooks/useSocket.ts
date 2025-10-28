"use client";
import { useEffect } from "react";
import socket from "@/lib/socket";

export const useSocket = (
  roomId: string | undefined,
  username: string | undefined
) => {
  const isHost =
    typeof window !== "undefined" && localStorage.getItem("isHost") === "true";

  // ✅ Fix #1 — Ensure socket listeners are always ready before create/join
  useEffect(() => {
    if (!socket.connected) socket.connect();

    // if the component unmounts or tab closes — disconnect cleanly
    const handleBeforeUnload = () => {
      socket.disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.removeAllListeners(); // clear old listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // don't disconnect here — otherwise we lose connection on every re-render
    };
  }, []);

  // ✅ Your main effect stays as is
  useEffect(() => {
    if (!roomId || !username) return;

    if (!socket.connected) socket.connect();

    if (!isHost) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.emit("joinRoom", { roomId, username }, (res: any) => {
        if (!res || !res.success)
          console.error("Failed to join room:", res?.message);
        else console.log("Joined room", roomId);
      });
    }

    // optional cleanup (not disconnect)
    return () => {};
  }, [roomId, username, isHost]);

  return socket;
};
