"use client";
import { useEffect } from "react";
import socket from "@/lib/socket";

export const useSocket = (roomId: string, username: string) => {
  useEffect(() => {
    if (!roomId || !username) return;
    socket.connect();

    socket.emit("joinRoom", { roomId, username });

    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.on("disconnect", () => console.log("Disconnected"));

    return () => {
      socket.disconnect();
    };
  }, [roomId, username]);

  return socket;
};
