"use client";

import React, { useState } from "react";
import { Send, Users, MessageCircle, Crown } from "lucide-react";
import Button from "@/components/Button/Button";
import { Player, Message } from "@/types/app/Game/game";

// Main Game Room Component
const GamePage: React.FC = () => {
  // Mock room ID from params - in Next.js you'd use useSearchParams() or useParams()
  const roomId = "ROOM123";

  // Game state
  const [currentWord] = useState("elephant"); // This would come from your game logic
  const [guess, setGuess] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  // Mock data - replace with actual state management
  const [players] = useState<Player[]>([
    { id: "1", name: "You", score: 150, isHost: true },
    { id: "2", name: "Player2", score: 120, isHost: false },
    { id: "3", name: "Player3", score: 90, isHost: false },
    { id: "4", name: "Player4", score: 75, isHost: false },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      player: "System",
      text: "Welcome to the game!",
      timestamp: new Date(),
      isSystem: true,
    },
    {
      id: "2",
      player: "Player2",
      text: "Hey everyone!",
      timestamp: new Date(),
      isSystem: false,
    },
    {
      id: "3",
      player: "Player3",
      text: "Ready to play!",
      timestamp: new Date(),
      isSystem: false,
    },
  ]);

  const handleGuessSubmit = () => {
    if (guess.trim()) {
      // Add your guess logic here
      console.log("Guess submitted:", guess);
      setGuess("");
    }
  };

  const handleChatSubmit = () => {
    if (chatMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        player: "You",
        text: chatMessage,
        timestamp: new Date(),
        isSystem: false,
      };
      setMessages([...messages, newMessage]);
      setChatMessage("");
    }
  };

  const handleGuessKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGuessSubmit();
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleChatSubmit();
    }
  };

  // Generate underscores based on word length
  const generateUnderscores = (word: string) => {
    return word
      .split("")
      .map((char) => (char === " " ? "  " : "_ "))
      .join("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Room: {roomId}
            </h1>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <p className="text-gray-300 text-sm">Round 1 of 3</p>
            </div>
          </div>

          {/* Word Display */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Guess the word</p>
            <p className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-widest">
              {generateUnderscores(currentWord)}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {currentWord.length} letters
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Players List */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 h-[400px] lg:h-[500px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/20">
              <Users className="text-purple-400" size={20} />
              <h2 className="text-xl font-semibold text-white">
                Players ({players.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {player.isHost && (
                      <Crown className="text-yellow-400" size={16} />
                    )}
                    <span className="text-white font-medium">
                      {player.name}
                    </span>
                  </div>
                  <span className="text-purple-400 font-bold">
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 h-[400px] lg:h-[500px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/20">
              <MessageCircle className="text-blue-400" size={20} />
              <h2 className="text-xl font-semibold text-white">Chat</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${msg.isSystem ? "text-center" : ""}`}
                >
                  {msg.isSystem ? (
                    <p className="text-gray-400 text-sm italic">{msg.text}</p>
                  ) : (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-purple-400 font-semibold text-sm mb-1">
                        {msg.player}
                      </p>
                      <p className="text-white">{msg.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleChatKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <Button
                onClick={handleChatSubmit}
                variant="primary"
                icon={<Send size={18} />}
                disabled={!chatMessage.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Guess Input */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleGuessKeyPress}
              placeholder="Type your guess here..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <Button
              onClick={handleGuessSubmit}
              variant="accent"
              className="sm:w-auto w-full text-lg py-4"
              disabled={!guess.trim()}
            >
              Submit Guess
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
};

export default GamePage;
