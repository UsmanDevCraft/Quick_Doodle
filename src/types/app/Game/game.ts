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
  timestamp: Date;
  isSystem?: boolean;
}
