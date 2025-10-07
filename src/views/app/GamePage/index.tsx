"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Player, Message } from "@/types/app/Game/game";
import Button from "@/components/Button/Button";
import { Send, Users, MessageCircle, Crown } from "lucide-react";

const GamePage: React.FC = () => {
  const params = useParams();
  const search = useSearchParams();
  const roomId = params?.roomId;
  const usernameFromQuery = search?.get("username") || undefined;
  const username =
    (typeof window !== "undefined" &&
      (localStorage.getItem("username") || usernameFromQuery)) ||
    usernameFromQuery ||
    "Guest";

  const socket = useSocket(roomId as string | undefined, username);

  const [players, setPlayers] = useState<Player[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [guess, setGuess] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [wordLength, setWordLength] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [isRiddler, setIsRiddler] = useState(false);
  const [secretWord, setSecretWord] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // initial roomInfo (emitted by server upon create/join)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onRoomInfo = (info: any) => {
      setWordLength(info.wordLength || 0);
      setRound(info.round || 1);
      setPlayers(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (info.players || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          score: p.score || 0,
          isHost: p.isHost || false,
        }))
      );
      if (info.role === "riddler") {
        setIsRiddler(true);
        if (info.word) setSecretWord(info.word);
      } else {
        setIsRiddler(false);
        setSecretWord(null);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onUpdatePlayers = (list: any[]) => {
      setPlayers(
        list.map((p) => ({
          id: p.id,
          name: p.name,
          score: p.score || 0,
          isHost: p.isHost || false,
        }))
      );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMessage = (msg: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id || Date.now().toString(),
          player: msg.player,
          text: msg.text,
          isSystem: msg.isSystem || false,
          timestamp: new Date(msg.timestamp || Date.now()),
        },
      ]);
    };

    const onWinner = ({
      username: who,
      word,
    }: {
      username: string;
      word: string;
    }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          player: "System",
          text: `${who} guessed the word "${word}"!`,
          isSystem: true,
          timestamp: new Date(),
        },
      ]);
    };

    const onNewRound = ({
      wordLength: wl,
      round: r,
    }: {
      wordLength: number;
      round: number;
    }) => {
      setWordLength(wl);
      setRound(r);
      setSecretWord(null); // riddler will be sent new word via roomInfo
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          player: "System",
          text: `Round ${r} started`,
          isSystem: true,
          timestamp: new Date(),
        },
      ]);
    };

    socket.on("roomInfo", onRoomInfo);
    socket.on("updatePlayers", onUpdatePlayers);
    socket.on("message", onMessage);
    socket.on("winner", onWinner);
    socket.on("newRound", onNewRound);

    // optional: wrongGuess (private)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("wrongGuess", ({ username: who, guess }: any) => {
      // show small system message or ignore
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          player: "System",
          text: `${who} guessed "${guess}"`,
          isSystem: true,
          timestamp: new Date(),
        },
      ]);
    });

    return () => {
      socket.off("roomInfo", onRoomInfo);
      socket.off("updatePlayers", onUpdatePlayers);
      socket.off("message", onMessage);
      socket.off("winner", onWinner);
      socket.off("newRound", onNewRound);
      socket.off("wrongGuess");
    };
  }, [socket]);

  const handleGuessSubmit = () => {
    if (!guess.trim() || !roomId) return;
    socket.emit("guessWord", { roomId, username, guess });
    setGuess("");
  };

  const handleChatSubmit = () => {
    if (!chatMessage.trim() || !roomId) return;
    socket.emit("chatMessage", { roomId, username, text: chatMessage });
    setChatMessage("");
  };

  const generateUnderscores = (len: number) => {
    if (!len || len <= 0) return "";
    return "_ ".repeat(len).trim();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden relative">
      {/* content kept same as your UI — only dynamic data plugged in */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Room: {roomId}
          </h1>
          <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Round {round}</p>
          </div>
        </div>

        {/* WORD DISPLAY */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center mb-6">
          <p className="text-gray-400 text-sm mb-2">Guess the word</p>
          <p className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest">
            {generateUnderscores(wordLength)}
          </p>
          <p className="text-gray-400 text-sm mt-2">{wordLength} letters</p>

          {/* Show secret to riddler only */}
          {isRiddler && secretWord && (
            <div className="mt-3 text-sm text-green-300">
              Secret word (you): <strong>{secretWord}</strong>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Players */}
          <div className="lg:col-span-1 bg-white/10 rounded-xl border border-white/20 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3 border-b border-white/20 pb-2">
              <Users className="text-purple-400" size={20} />
              <h2 className="text-xl text-white font-semibold">
                Players ({players.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
              {players.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
                >
                  <div className="flex gap-2 items-center">
                    {i === 0 && <Crown className="text-yellow-400" size={16} />}
                    <span className="text-white font-medium">{p.name}</span>
                  </div>
                  <span className="text-purple-400 font-semibold">
                    {p.score || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT */}
          <div className="lg:col-span-2 bg-white/10 rounded-xl border border-white/20 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3 border-b border-white/20 pb-2">
              <MessageCircle className="text-blue-400" size={20} />
              <h2 className="text-xl text-white font-semibold">Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin">
              {messages.map((m) =>
                m.isSystem ? (
                  <p
                    key={m.id}
                    className="text-center text-gray-400 italic text-sm"
                  >
                    {m.text}
                  </p>
                ) : (
                  <div key={m.id} className="bg-white/5 rounded-lg p-3">
                    <p className="text-purple-400 font-semibold text-sm mb-1">
                      {m.player}
                    </p>
                    <p className="text-white">{m.text}</p>
                  </div>
                )
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button
                onClick={handleChatSubmit}
                variant="primary"
                icon={<Send />}
                disabled={!chatMessage.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* GUESS INPUT */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your guess..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
    </div>
  );
};

export default GamePage;
