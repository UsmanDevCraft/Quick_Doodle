import { useQuery } from "@tanstack/react-query";
import { getRoomInfoService } from "@/service/app/room.service";
import { RoomData } from "@/types/services/app/roomService";

interface UseRoomOptions {
  enabled?: boolean;
}

export const useRoom = (
  roomId: string,
  username?: string,
  options?: UseRoomOptions
) => {
  return useQuery<RoomData, Error>({
    queryKey: ["room", roomId, username],
    queryFn: () => getRoomInfoService(roomId, username),
    enabled: Boolean(roomId) && (options?.enabled ?? true),
    staleTime: 1000 * 30,
    retry: 1,
  });
};
