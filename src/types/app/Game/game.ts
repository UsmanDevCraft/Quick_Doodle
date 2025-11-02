export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
}

export interface Message {
  id: string;
  player: string;
  text: string;
  isSystem: boolean;
  timestamp: Date;
}

export interface RoomInfo {
  roomId: string;
  role: "riddler" | "guesser" | "player";
  word?: string;
  wordLength: number;
  players: Player[];
  round: number;
  riddler: string;
}

export interface SocketMessage {
  id: string;
  player: string;
  text: string;
  isSystem: boolean;
  timestamp: number;
}

export interface WinnerData {
  username: string;
  word: string;
}

export interface NewRoundData {
  wordLength: number;
  round: number;
  riddler: string;
  word?: string;
}

export interface JoinRoomResponse {
  success: boolean;
  message?: string;
}

export interface ChatBoxProps {
  messages: Message[];
  chatMessage: string;
  setChatMessage: (msg: string) => void;
  username: string;
  handleChatSubmit: () => void;
}

export interface PlayerListProps {
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

export type Point = { x: number; y: number };
export type Stroke = {
  id: string;
  color: string;
  width: number;
  mode: "draw" | "erase";
  points: Point[];
};

export type DrawBoardProps = {
  width?: number | "100%";
  height?: number;
  initialTheme?: "light" | "dark";
  penWidth?: number;
  eraserWidth?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket?: any;
  socketEventName?: string;
  roomId?: string;
  isRiddler: boolean;
};
