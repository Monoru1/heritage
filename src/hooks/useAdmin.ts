import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllReservations,
  updateReservationStatus,
  fetchAllMenuItems,
  upsertMenuItem,
  deleteMenuItem,
  fetchAllTables,
  upsertTable,
  deleteTable,
  fetchAllGallery,
  upsertGalleryImage,
  deleteGalleryImage,
  fetchAllAvailabilitySlots,
  upsertAvailabilitySlot,
  deleteAvailabilitySlot,
  fetchReservationStats,
} from "@/services/admin";
import type { Reservation, MenuItem, TableRestaurant, GalleryImage, AvailabilitySlot } from "@/types/database";

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
  return useQuery({ queryKey: ["admin", "menu"], queryFn: fetchAllMenuItems });
}

export function useUpsertMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: Partial<MenuItem> & { name: string; price: number; category: string }) => upsertMenuItem(item),
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
  return useQuery({ queryKey: ["admin", "tables"], queryFn: fetchAllTables });
}

export function useUpsertTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (table: Partial<TableRestaurant> & { numero: number; capacite: number }) => upsertTable(table),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tables"] }),
  });
}

export function useDeleteTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTable,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tables"] }),
  });
}

export function useAdminGallery() {
  return useQuery({ queryKey: ["admin", "gallery"], queryFn: fetchAllGallery });
}

export function useUpsertGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (image: Partial<GalleryImage> & { image_url: string }) => upsertGalleryImage(image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "gallery"] }),
  });
}

export function useDeleteGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "gallery"] }),
  });
}

export function useAdminAvailability() {
  return useQuery({ queryKey: ["admin", "availability"], queryFn: fetchAllAvailabilitySlots });
}

export function useUpsertAvailabilitySlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slot: Partial<AvailabilitySlot> & { slot_date: string; slot_time: string }) => upsertAvailabilitySlot(slot),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "availability"] }),
  });
}

export function useDeleteAvailabilitySlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAvailabilitySlot,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "availability"] }),
  });
}

export function useReservationStats() {
  return useQuery({ queryKey: ["admin", "stats"], queryFn: fetchReservationStats });
}
