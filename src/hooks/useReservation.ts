import { useMutation } from "@tanstack/react-query";
import { createReservation } from "@/services/reservations";
import type { ReservationInsert } from "@/types/database";

export function useCreateReservation() {
  return useMutation({
    mutationFn: (data: ReservationInsert) => createReservation(data),
  });
}
