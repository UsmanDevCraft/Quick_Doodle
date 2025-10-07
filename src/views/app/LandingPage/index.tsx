"use client";

import React, { useState } from "react";
import { Users, Home, Globe } from "lucide-react";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import socket from "@/lib/socket";

const GameLandingPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(false);

  // ✅ Handle username input validation
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUsername(value);
    setIsValid(value.length >= 4 && value.length <= 20);
  };

  // ✅ Create Room
  const handleCreateRoom = () => {
    const roomId = nanoid(6);
    socket.connect();
    socket.emit("createRoom", { roomId, username });
    socket.on("roomCreated", () => {
      router.push(`/game/${roomId}?username=${username}`);
    });
  };

  // ✅ Join Room
  const handleJoinRoom = () => {
    const roomId = prompt("Enter Room ID:")?.trim();
    if (!roomId) return;
    router.push(`/game/${roomId}?username=${username}`);
  };

  // ✅ Play Globally (future mode)
  const handlePlayGlobally = () => {
    alert("Global play mode coming soon!");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
            Game Arena
          </h1>

          {/* Username input */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Set your Username..."
              className={`max-w-xs flex-1 bg-white/5 border ${
                isValid ? "border-green-400" : "border-white/20"
              } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-center`}
            />
          </div>

          <p className="text-gray-300 text-lg sm:text-xl font-light tracking-wide">
            Choose your battle mode
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-6 animate-slide-up">
          <Button
            onClick={handleJoinRoom}
            variant="primary"
            icon={<Users />}
            disabled={!isValid}
          >
            Join Room
          </Button>

          <Button
            onClick={handleCreateRoom}
            variant="secondary"
            icon={<Home />}
            disabled={!isValid}
          >
            Create Room
          </Button>

          <Button
            onClick={handlePlayGlobally}
            variant="accent"
            icon={<Globe />}
            disabled={!isValid}
          >
            Play Globally
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Connect with players worldwide or create your own private room</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s backwards;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default GameLandingPage;
