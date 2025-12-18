import { fetcher } from "@/lib/fetcher";
import { RoomData, CreateRoomPayload } from "@/types/services/app/roomService";

// Create a new room
export const createRoomService = (payload: CreateRoomPayload) => {
  return fetcher<RoomData>("/api/createroom", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// Fetch room info
export const getRoomInfoService = (roomId: string, username?: string) => {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";

  return fetcher<RoomData>(`/api/rooms/${roomId}${query}`);
};
