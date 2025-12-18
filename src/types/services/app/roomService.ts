export interface Player {
  id?: string;
  name: string;
  score: number;
  isHost: boolean;
}

export interface RoomData {
  roomId: string;
  role: "riddler" | "guesser";
  word?: string | null;
  wordLength: number;
  players: Player[];
  riddler?: string;
  round: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chats?: any[];
}

export interface CreateRoomPayload {
  roomId: string;
  username: string;
  mode?: "global" | "private";
}
