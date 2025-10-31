// components/gamePage/playerList/PlayerList.tsx
import React from "react";
import { Users, Crown, MoreVertical, UserX } from "lucide-react";
import { createPortal } from "react-dom";
import { Player } from "@/types/app/Game/game";

interface PlayerListProps {
  players: Player[];
  username: string;
  isHost: boolean;
  selectedPlayer: string | null;
  setSelectedPlayer: (id: string | null) => void;
  menuPosition: { x: number; y: number };
  setMenuPosition: (pos: { x: number; y: number }) => void;
  handleKickPlayer: (playerName: string) => void;
  handleLeaveRoom: () => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  username,
  isHost,
  selectedPlayer,
  setSelectedPlayer,
  menuPosition,
  setMenuPosition,
  handleKickPlayer,
  handleLeaveRoom,
}) => {
  return (
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
              {p.isHost && <Crown className="text-yellow-400" size={16} />}
              <span className="text-white font-medium">{p.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-semibold">
                {p.score ?? 0}
              </span>
              {(isHost || p.name === username) && (
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
              )}
            </div>

            {/* Context Menu */}
            {selectedPlayer === p.id &&
              createPortal(
                <div
                  style={{
                    position: "fixed",
                    top: `${menuPosition.y}px`,
                    left: `${menuPosition.x}px`,
                    zIndex: 9999,
                  }}
                  className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl overflow-hidden"
                  onMouseLeave={() => setSelectedPlayer(null)}
                >
                  {p.name === username ? (
                    <button
                      onClick={() => {
                        handleLeaveRoom();
                        setSelectedPlayer(null);
                      }}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                      <UserX size={16} />
                      Leave Room
                    </button>
                  ) : isHost ? (
                    <button
                      onClick={() => {
                        handleKickPlayer(p.name);
                        setSelectedPlayer(null);
                      }}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                      <UserX size={16} />
                      Kick Player
                    </button>
                  ) : null}
                </div>,
                document.body
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
