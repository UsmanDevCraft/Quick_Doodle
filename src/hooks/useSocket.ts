// hooks/useSocket.ts
"use client";
import { useEffect } from "react";
import socket from "@/lib/socket";

export const useSocket = (
  roomId: string | undefined,
  username: string | undefined
) => {
  const isHost =
    typeof window !== "undefined" && localStorage.getItem("isHost") === "true";

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

    // ❌ Don't disconnect on component unmount (causes auto leave)
    // ✅ Only disconnect when the user closes tab/window
    const handleBeforeUnload = () => {
      socket.disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // optionally leave room instead of disconnecting
      // socket.emit("leaveRoom", { roomId, username });
    };
  }, [roomId, username, isHost]);

  return socket;
};
