"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/hooks/useSocket";
import {
  Player,
  Message,
  RoomInfo,
  SocketMessage,
  WinnerData,
  NewRoundData,
  JoinRoomResponse,
} from "@/types/app/Game/game";
import Button from "@/components/Button/Button";
import {
  Send,
  Users,
  MessageCircle,
  Crown,
  UserX,
  MoreVertical,
} from "lucide-react";
import Modal from "@/components/Modal/Modal";
import Alert from "@/components/Alert/Alert";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

const GamePage: React.FC = () => {
  const params = useParams();
  const roomId = params?.roomId;
  const router = useRouter();

  const storedUsername =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const isHost =
    typeof window !== "undefined"
      ? localStorage.getItem("isHost") === "true"
      : false;

  const username = storedUsername || "";

  // Ensure localStorage is updated with the latest username
  useEffect(() => {
    if (username && username !== storedUsername) {
      localStorage.setItem("username", username);
    }
  }, [username, storedUsername]);

  const socket = useSocket(roomId as string | undefined, username);

  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    isNavigate?: boolean;
  }>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const showAlert = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    title?: string,
    isNavigate?: boolean
  ) => {
    setAlert({ isOpen: true, message, type, title, isNavigate });
  };

  const [players, setPlayers] = useState<Player[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [guess, setGuess] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [wordLength, setWordLength] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(!storedUsername);
  const [isRiddler, setIsRiddler] = useState(false);
  const [userName, setUserName] = useState(storedUsername || "");
  const [secretWord, setSecretWord] = useState<string | null>(null);
  const [riddlerName, setRiddlerName] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  // Ref for auto-scrolling chat
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const listenersAttached = useRef(false);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // === MAIN SOCKET LISTENERS (ATTACHED ONLY ONCE) ===
  useEffect(() => {
    if (!socket || !roomId || !username || username === "Guest") return;

    // Prevent duplicate listeners
    if (listenersAttached.current) return;
    listenersAttached.current = true;

    const onRoomInfo = (info: RoomInfo) => {
      setWordLength(info.wordLength || 0);
      setRound(info.round || 1);
      setPlayers(
        (info.players || []).map((p) => ({
          id: p.id,
          name: p.name,
          score: p.score || 0,
          isHost: p.isHost || false,
        }))
      );
      setRiddlerName(info.riddler || null);
      setIsRiddler(info.role === "riddler");
      setSecretWord(info.role === "riddler" && info.word ? info.word : null);
    };

    const onUpdatePlayers = (list: Player[]) => {
      setPlayers(
        list.map((p) => ({
          id: p.id,
          name: p.name,
          score: p.score || 0,
          isHost: p.isHost || false,
        }))
      );
    };

    const onMessage = (msg: SocketMessage) => {
      setMessages((prev) => {
        // Deduplicate by message ID
        if (msg.id && prev.some((m) => m.id === msg.id)) return prev;

        return [
          ...prev,
          {
            id: msg.id || Date.now().toString(),
            player: msg.player,
            text: msg.text,
            isSystem: msg.isSystem || false,
            timestamp: new Date(msg.timestamp || Date.now()),
          },
        ];
      });
    };

    const onWinner = (data: WinnerData) => {
      console.log("Winner announced:", data);
      // Handled via system message
    };

    const onNewRound = (data: NewRoundData) => {
      setWordLength(data.wordLength);
      setRound(data.round);
      setRiddlerName(data.riddler);
      setIsRiddler(username === data.riddler);
      setSecretWord(data.word && username === data.riddler ? data.word : null);
    };

    // Attach all listeners
    socket.on("roomInfo", onRoomInfo);
    socket.on("updatePlayers", onUpdatePlayers);
    socket.on("message", onMessage);
    socket.on("winner", onWinner);
    socket.on("newRound", onNewRound);

    // Request room info once
    socket.emit("requestRoomInfo", { roomId, username });

    // Cleanup on unmount
    return () => {
      listenersAttached.current = false;
      socket.off("roomInfo", onRoomInfo);
      socket.off("updatePlayers", onUpdatePlayers);
      socket.off("message", onMessage);
      socket.off("winner", onWinner);
      socket.off("newRound", onNewRound);
    };
  }, [socket, roomId, username]);

  // === RECONNECT HANDLER (ONLY ON CONNECT) ===
  useEffect(() => {
    if (!socket || !roomId || !username || username === "Guest") return;

    const onConnect = () => {
      console.log("Reconnected, requesting room info...");
      socket.emit("requestRoomInfo", { roomId, username });
    };

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, [socket, roomId, username]);

  // === AUTO-JOIN FOR NON-HOST (ONLY IF USERNAME EXISTS) ===
  useEffect(() => {
    if (!socket || !roomId || !username || username === "Guest" || isHost)
      return;

    if (storedUsername) {
      socket.emit(
        "checkRoom",
        roomId,
        (res: { exists: boolean; message: string }) => {
          if (!res.exists) {
            router.replace("/not-found?reason=room_doesnot_exist");
          } else {
            socket.emit(
              "joinRoom",
              { roomId, username },
              (res: JoinRoomResponse) => {
                if (!res?.success) {
                  showAlert(
                    res?.message || "Failed to join room",
                    "error",
                    undefined,
                    true
                  );
                } else {
                  console.log("Auto joined room successfully");
                }
              }
            );
          }
        }
      );
    }
  }, [socket, roomId, username, storedUsername, router, isHost]);

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

  const handleModalSubmit = () => {
    const trimmed = userName.trim();

    if (!trimmed || trimmed.length < 3) {
      showAlert("Please enter a valid username (min 3 characters)", "error");
      return;
    }

    localStorage.setItem("username", trimmed);
    localStorage.setItem("isHost", "false");

    setIsModalOpen(false);
    setUserName(trimmed);

    socket.emit(
      "checkRoom",
      roomId,
      (res: { exists: boolean; message: string }) => {
        if (!res.exists) {
          router.replace("/not-found?reason=room_doesnot_exist");
        } else {
          socket.emit(
            "joinRoom",
            { roomId, username: trimmed },
            (res: JoinRoomResponse) => {
              if (!res?.success) {
                showAlert(
                  res?.message || "Failed to join room",
                  "error",
                  undefined,
                  true
                );
              } else {
                console.log("Joined room successfully");
              }
            }
          );
        }
      }
    );
  };

  const generateUnderscores = (len: number) => {
    if (!len || len <= 0) return "";
    return "_ ".repeat(len).trim();
  };

  const handleKickPlayer = (playerName: string) => {
    if (!playerName) return;
    socket.emit(
      "voteKick",
      { roomId, target: playerName, voter: userName },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (res: any) => {
        if (!res.success) Alert(res.message);
      }
    );
  };

  const handleLeaveRoom = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit("leaveRoom", { roomId, username }, (res: any) => {
      if (res?.success) {
        router.push("/");
      } else {
        console.error(res?.message || "Failed to leave room");
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden relative">
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
          {riddlerName && !isRiddler && (
            <p className="text-gray-400 text-sm mb-2">Guess the word</p>
          )}

          {isRiddler && secretWord ? (
            <>
              <p className="text-4xl sm:text-5xl font-mono font-bold text-green-300 tracking-widest">
                {secretWord.toUpperCase()}
              </p>
              <p className="text-gray-400 text-sm mt-2 italic">
                You are the <strong>riddler</strong> this round — give hints in
                chat
              </p>
            </>
          ) : (
            <>
              <p className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest">
                {generateUnderscores(wordLength)}
              </p>
              <p className="text-gray-400 text-sm mt-2">{wordLength} letters</p>
              <p className="text-gray-400 text-sm mt-2">
                Riddler:{" "}
                <span className="text-purple-300 font-semibold">
                  {riddlerName === username ? "You" : riddlerName || "??"}
                </span>
              </p>
            </>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Players */}
          <div className="lg:col-span-1 bg-white/10 rounded-xl border border-white/20 p-4 flex flex-col max-h-[400px] overflow-auto">
            <div className="flex items-center gap-2 mb-3 border-b border-white/20 pb-2">
              <Users className="text-purple-400" size={20} />
              <h2 className="text-xl text-white font-semibold">
                Players ({players.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-white/5 p-3 rounded-lg group relative"
                >
                  <div className="flex gap-2 items-center">
                    {p.isHost && (
                      <Crown className="text-yellow-400" size={16} />
                    )}
                    <span className="text-white font-medium">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 font-semibold">
                      {p.score || 0}
                    </span>
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPosition({
                          x: rect.right - 150,
                          y: rect.bottom + 5,
                        });
                        setSelectedPlayer(p.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                    >
                      <MoreVertical className="text-white/70" size={18} />
                    </button>
                  </div>

                  {selectedPlayer &&
                    createPortal(
                      <div
                        style={{
                          position: "fixed",
                          top: `${menuPosition.y}px`,
                          left: `${menuPosition.x}px`,
                          zIndex: 9999,
                        }}
                        className="bg-gray-900/95 border border-white/20 rounded-lg shadow-xl overflow-hidden"
                        onMouseLeave={() => setSelectedPlayer(null)}
                      >
                        <button
                          onClick={() => {
                            const p = players.find(
                              (pl) => pl.id === selectedPlayer
                            );
                            if (!p) return;
                            p.name === storedUsername
                              ? handleLeaveRoom()
                              : handleKickPlayer(p.name);
                            setSelectedPlayer(null);
                          }}
                          className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        >
                          <UserX size={16} />
                          {players.find((pl) => pl.id === selectedPlayer)
                            ?.name === storedUsername
                            ? "Leave Room"
                            : "Kick Player"}
                        </button>
                      </div>,
                      document.body
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* CHAT */}
          <div className="lg:col-span-2 bg-white/10 rounded-xl border border-white/20 p-4 flex flex-col max-h-[400px] overflow-auto">
            <div className="flex items-center gap-2 mb-3 border-b border-white/20 pb-2">
              <MessageCircle className="text-blue-400" size={20} />
              <h2 className="text-xl text-white font-semibold">Chat</h2>
            </div>
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin"
            >
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
                      {m.player === username ? "You" : m.player}
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
        {riddlerName && !isRiddler ? (
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
        ) : (
          <div className="text-center text-gray-400 italic">
            You are the riddler this round. Give hints in the chat
          </div>
        )}
      </div>

      {/* Alert */}
      <Alert
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        duration={0}
        isNavigate={alert.isNavigate}
      />

      {/* Join Room Modal */}
      {isModalOpen && !storedUsername && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Join Room"
          isJoinRoom={true}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Set Your User Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username..."
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleModalSubmit();
                }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleModalSubmit}
                className="flex-1 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all"
              >
                Join
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GamePage;
