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
