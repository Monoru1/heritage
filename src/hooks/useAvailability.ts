import { useQuery } from "@tanstack/react-query";
import { fetchAvailableDates, fetchSlotsForDate } from "@/services/availability";

export function useAvailableDates() {
  return useQuery({
    queryKey: ["available-dates"],
    queryFn: fetchAvailableDates,
    staleTime: 60 * 1000,
  });
}

export function useTimeSlots(date: string | null) {
  return useQuery({
    queryKey: ["time-slots", date],
    queryFn: () => fetchSlotsForDate(date!),
    enabled: !!date,
    staleTime: 60 * 1000,
  });
}
