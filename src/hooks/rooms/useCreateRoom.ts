import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoomService } from "@/service/app/room.service";
import { CreateRoomPayload, RoomData } from "@/types/services/app/roomService";
import { useRouter } from "next/navigation";

export const useCreateRoom = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<RoomData, Error, CreateRoomPayload>({
    mutationFn: createRoomService,

    onSuccess: (data, variables) => {
      // Prime the cache immediately
      queryClient.setQueryData(["room", data.roomId, variables.username], data);
      router.push(`/game/${variables.roomId}`);
    },
  });
};
