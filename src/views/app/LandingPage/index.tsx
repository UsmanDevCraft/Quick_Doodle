"use client";

import React, { useState } from "react";
import { Users, Home, Globe } from "lucide-react";
import Button from "@/components/Button/Button";
import Tooltip from "@/components/Tooltip/Tooltip";
import Modal from "@/components/Modal/Modal";
import Alert from "@/components/Alert/Alert";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import socket from "@/lib/socket";
import Loader from "@/components/Loader/Loader";
import { useUserStore } from "@/store/app/userData";
import { useCreateRoom } from "@/hooks/rooms/useCreateRoom";

const GameLandingPage: React.FC = () => {
  const router = useRouter();
  const { mutateAsync: createRoom } = useCreateRoom();
  const { username, setUsername, setIsHost } = useUserStore();
  const storedUsername = username;
  const isValid = username.length >= 4;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [isShowLoader, setIsShowLoader] = useState(false);

  // Alert state
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const showAlert = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    title?: string
  ) => {
    setAlert({ isOpen: true, message, type, title });
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUsername(value);
  };

  const handleCreateModalSubmit = async (mode: "private" | "global") => {
    const name = username.trim();

    if (!name || name.length < 4) {
      showAlert("Username must be at least 4 characters.", "warning");
      return;
    }

    setUsername(name);
    setIsHost(true);

    const roomId = nanoid(6);
    if (!socket.connected) socket.connect();

    try {
      setIsShowLoader(true);

      await createRoom({
        roomId,
        username: name,
        mode,
      });
    } catch (err) {
      console.error(err);
      showAlert("Could not create room. Please try again.", "error");
      setIsShowLoader(false);
    }
  };

  const handleCreateRoom = () => {
    if (!username) return;
    setIsCreateModalOpen(true);
  };

  const handleJoinRoom = () => {
    if (!username) return;
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    const trimmedRoomId = roomId.trim();
    if (!trimmedRoomId) {
      showAlert("Please enter a room ID", "warning");
      return;
    }
    setIsModalOpen(false);
    setIsShowLoader(true);
    router.push(`/game/${trimmedRoomId}`);
  };

  const handlePlayGlobally = () => {
    if (!username) return;

    if (!socket.connected) socket.connect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit("joinGlobalRoom", { username }, (res: any) => {
      if (!storedUsername) {
        setUsername(username);
      }
      if (!res.success) {
        showAlert(res.message || "Failed to join global room.", "error");
      } else {
        setIsShowLoader(true);
        router.push(`/game/${res.roomId}`);
      }
    });
  };

  return (
    <>
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
                    : "opacity-100 cursor-pointer"
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
                    : "opacity-100 cursor-pointer"
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
                    : "opacity-100 cursor-pointer"
                }`}
              >
                Play Globally
              </Button>
            </Tooltip>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-400 text-sm">
            <p>
              Connect with players worldwide or create your own private room
            </p>
          </div>
        </div>

        {/* Create Room Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Room"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Choose Room Type
              </label>
              <p className="text-sm text-gray-400">
                Select whether you want to create a{" "}
                <span className="text-white font-semibold">Private</span> or{" "}
                <span className="text-white font-semibold">Global</span> room.
                <br />
                <span className="text-gray-400">
                  • <span className="text-blue-400 font-medium">Global</span>{" "}
                  rooms are open — any player can join. <br />•{" "}
                  <span className="text-purple-400 font-medium">Private</span>{" "}
                  rooms are invite-only — share your room link to play with
                  friends.
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleCreateModalSubmit("private")}
                className="flex-1 px-4 py-3 rounded-lg font-semibold bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                Private
              </button>
              <button
                onClick={() => handleCreateModalSubmit("global")}
                className="flex-1 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all"
              >
                Global
              </button>
            </div>
          </div>
        </Modal>

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

        {/* Alert */}
        <Alert
          isOpen={alert.isOpen}
          onClose={() => setAlert({ ...alert, isOpen: false })}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          duration={0} // Set to 3000 for 3s auto-close
        />

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

      {isShowLoader && <Loader />}
    </>
  );
};

export default GameLandingPage;
