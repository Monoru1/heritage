/* ============================================================
   Supabase Database Types — HÉRITAGE
   Matches migration 20260614175349
   ============================================================ */

export type UserRole = "admin" | "manager" | "staff";
export type ReservationStatus = "pending" | "confirmed" | "seated" | "cancelled" | "no_show";
export type MenuCategory = "entrees" | "plats" | "desserts" | "vins" | "cocktails";
export type TableLocation = "interieur" | "terrasse";
export type ReservationLocationPreference = TableLocation | "indifferent";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface TableRestaurant {
  id: string;
  numero: number;
  capacite: number;
  position_x: number;
  position_y: number;
  active: boolean;
  location: TableLocation;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: MenuCategory;
  image_url: string | null;
  is_specialty: boolean;
  region: string | null;
  sort_order: number;
  is_available: boolean;
  created_at: string;
}

export interface Reservation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  location_preference: ReservationLocationPreference;
  status: ReservationStatus;
  notes: string | null;
  table_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReservationInsert {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  location_preference?: ReservationLocationPreference;
  notes?: string;
}

export interface AvailabilitySlot {
  id: string;
  slot_date: string;
  slot_time: string;
  available_tables: number;
  is_open: boolean;
}

export interface GalleryImage {
  id: string;
  title: string | null;
  image_url: string;
  category: string | null;
  sort_order: number;
  created_at: string;
}

export const MENU_CATEGORY_LABELS: Record<MenuCategory, string> = {
  entrees: "Entrées",
  plats: "Plats",
  desserts: "Desserts",
  vins: "Vins",
  cocktails: "Cocktails",
};

export const MENU_CATEGORIES: MenuCategory[] = [
  "entrees",
  "plats",
  "desserts",
  "vins",
  "cocktails",
];
