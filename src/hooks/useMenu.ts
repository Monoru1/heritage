import { useQuery } from "@tanstack/react-query";
import { fetchMenuItems, fetchSpecialties } from "@/services/menu";

export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenuItems,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpecialties() {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: fetchSpecialties,
    staleTime: 5 * 60 * 1000,
  });
}
