import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllReservations,
  updateReservationStatus,
  fetchAllMenuItems,
  upsertMenuItem,
  deleteMenuItem,
  fetchAllTables,
  fetchAllGallery,
  deleteGalleryImage,
  fetchReservationStats,
} from "@/services/admin";
import type { Reservation, MenuItem } from "@/types/database";

export function useAdminReservations() {
  return useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: fetchAllReservations,
    refetchInterval: 30_000,
  });
}

export function useUpdateReservationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Reservation["status"] }) =>
      updateReservationStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reservations"] }),
  });
}

export function useAdminMenu() {
  return useQuery({
    queryKey: ["admin", "menu"],
    queryFn: fetchAllMenuItems,
  });
}

export function useUpsertMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: Partial<MenuItem> & { name: string; price: number; category: string }) =>
      upsertMenuItem(item),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menu"] }),
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menu"] }),
  });
}

export function useAdminTables() {
  return useQuery({
    queryKey: ["admin", "tables"],
    queryFn: fetchAllTables,
  });
}

export function useAdminGallery() {
  return useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: fetchAllGallery,
  });
}

export function useDeleteGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "gallery"] }),
  });
}

export function useReservationStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchReservationStats,
  });
}
