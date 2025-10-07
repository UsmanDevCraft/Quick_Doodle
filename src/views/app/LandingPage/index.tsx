"use client";

import React from "react";
import { Users, Home, Globe } from "lucide-react";
import Button from "@/components/Button/Button";

// Main Landing Page Component
const GameLandingPage: React.FC = () => {
  const handleJoinRoom = () => {
    console.log("Join Room clicked");
    // Add your navigation logic here
  };

  const handleCreateRoom = () => {
    console.log("Create Room clicked");
    // Add your navigation logic here
  };

  const handlePlayGlobally = () => {
    console.log("Play Globally clicked");
    // Add your navigation logic here
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo/Title Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
            Game Arena
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl font-light tracking-wide">
            Choose your battle mode
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col items-center gap-6 animate-slide-up">
          <Button onClick={handleJoinRoom} variant="primary" icon={<Users />}>
            Join Room
          </Button>

          <Button
            onClick={handleCreateRoom}
            variant="secondary"
            icon={<Home />}
          >
            Create Room
          </Button>

          <Button
            onClick={handlePlayGlobally}
            variant="accent"
            icon={<Globe />}
          >
            Play Globally
          </Button>
        </div>

        {/* Footer text */}
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
