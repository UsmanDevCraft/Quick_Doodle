"use client";

import React, { useState } from "react";
import { Users, Home, Globe } from "lucide-react";
import Button from "@/components/Button/Button";
import Tooltip from "@/components/Tooltip/Tooltip";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import socket from "@/lib/socket";

const GameLandingPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomId, setRoomId] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUsername(value);
    setIsValid(value.length >= 4 && value.length <= 20);
  };

  const handleCreateRoom = () => {
    const name = username.trim();

    if (!name || name.length < 4) {
      alert("Username must be at least 4 characters.");
      return;
    }

    localStorage.setItem("username", name);
    localStorage.setItem("isHost", "true");

    const roomId = nanoid(6);
    if (!socket.connected) socket.connect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit("createRoom", { roomId, username: name }, (res: any) => {
      if (res && res.success) {
        router.push(`/game/${roomId}?username=${encodeURIComponent(name)}`);
      } else {
        alert("Could not create room");
      }
    });
  };

  const handleJoinRoom = () => {
    if (!username) return;
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    const trimmedRoomId = roomId.trim();
    if (!trimmedRoomId) {
      alert("Please enter a room ID");
      return;
    }
    setIsModalOpen(false);
    router.push(`/game/${trimmedRoomId}?username=${username}`);
  };

  const handlePlayGlobally = () => {
    console.log("Global mode coming soon!");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
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
          <Tooltip message="Enter a username first!" disabled={isValid}>
            <Button
              onClick={handleJoinRoom}
              variant="primary"
              icon={<Users />}
              disabled={!isValid}
              className={`${
                !isValid
                  ? "opacity-50 cursor-not-allowed hover:opacity-50"
                  : "opacity-100"
              }`}
            >
              Join Room
            </Button>
          </Tooltip>

          <Tooltip message="Enter a username first!" disabled={isValid}>
            <Button
              onClick={handleCreateRoom}
              variant="secondary"
              icon={<Home />}
              disabled={!isValid}
              className={`${
                !isValid
                  ? "opacity-50 cursor-not-allowed hover:opacity-50"
                  : "opacity-100"
              }`}
            >
              Create Room
            </Button>
          </Tooltip>

          <Tooltip message="Enter a username first!" disabled={isValid}>
            <Button
              onClick={handlePlayGlobally}
              variant="accent"
              icon={<Globe />}
              disabled={!isValid}
              className={`${
                !isValid
                  ? "opacity-50 cursor-not-allowed hover:opacity-50"
                  : "opacity-100"
              }`}
            >
              Play Globally
            </Button>
          </Tooltip>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Connect with players worldwide or create your own private room</p>
        </div>
      </div>

      {/* Join Room Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Join Room"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room code..."
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === "Enter") handleModalSubmit();
              }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 rounded-lg font-semibold bg-white/5 hover:bg-white/10 text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleModalSubmit}
              className="flex-1 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all"
            >
              Join
            </button>
          </div>
        </div>
      </Modal>

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
