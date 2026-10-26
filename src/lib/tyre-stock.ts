import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export const seasons = { summer: "Été", winter: "Hiver", all_season: "4 saisons" } as const;
export type Season = keyof typeof seasons;
export const diameters = Array.from({ length: 11 }, (_, i) => i + 13);
export const widths = Array.from({ length: 24 }, (_, i) => 125 + i * 10);
export const ratios = Array.from({ length: 14 }, (_, i) => 20 + i * 5);
export const tyreDetailsSchema = z.object({
  season: z.enum(["summer", "winter", "all_season"]),
  width: z.coerce.number().int().min(125).max(355).multipleOf(5),
  aspect_ratio: z.coerce.number().int().min(20).max(85).multipleOf(5),
  diameter: z.coerce.number().int().min(13).max(23),
  brand: z.string().trim().min(1).max(80),
  model: z.string().trim().min(1).max(100),
  tyre_year: z.coerce.number().int().min(1980).max(new Date().getFullYear()),
});
export type TyreDetails = z.infer<typeof tyreDetailsSchema>;
export type TyreStock = TyreDetails & { id: string; pairs: number; version: number; updated_at: string; archived_at: string | null };
export type Movement = { id: string; stock_id: string; action: "add" | "adjust" | "edit" | "archive"; delta: number; balance: number; reason: string; reference: TyreStock; created_at: string };
export type Mutation = ({ action: "add"; pairs: number } & TyreDetails) | ({ action: "edit"; id: string; version: number } & TyreDetails) | { action: "adjust"; id: string; delta: number; reason: string } | { action: "archive"; id: string; version: number };
export const tyreSize = (row: Pick<TyreStock,"width" | "aspect_ratio" | "diameter">) => `${row.width}/${row.aspect_ratio} R${row.diameter}`;

// Migration-generated types can replace this boundary once the database is deployed.
const db = supabase as unknown as SupabaseClient;
export async function checkStockAccess() {
  const { data, error } = await db.rpc("is_stock_admin");
  if (error) throw new Error(stockError(error));
  return data === true;
}
export async function loadStock() {
  // Page through all rows; do not silently truncate at the Supabase default 1,000 rows.
  let rows: TyreStock[] = [];
  for (let start = 0;; start += 500) {
    const { data, error } = await db.from("tyre_stock").select("*").is("archived_at", null).order("id").range(start, start + 499);
    if (error) throw new Error(stockError(error));
    rows = rows.concat(data as TyreStock[]);
    if (data.length < 500) break;
  }
  return rows;
}
export async function loadMovements() {
  const { data, error } = await db.from("tyre_stock_movements").select("*").order("created_at",{ascending:false}).limit(100);
  if (error) throw new Error(stockError(error));
  return data as Movement[];
}
export async function changeStock(payload: Mutation, requestId: string) {
  const { data, error } = await db.rpc("mutate_tyre_stock",{p_request_id:requestId,p_payload:payload});
  if(error) throw new Error(stockError(error));
  return data as TyreStock;
}
export function stockError(error: { code?: string; message: string }) {
  if(error.code === "PGRST202" || error.code === "42P01") return "Le stock n’est pas encore activé. La mise à jour de la base de données doit être installée.";
  if(error.message.includes("STOCK_FORBIDDEN") || error.code === "42501") return "Cet espace est réservé aux administrateurs du garage.";
  if(error.message.includes("STOCK_INSUFFICIENT")) return "Stock insuffisant. Une autre personne a peut-être déjà retiré ces paires. Actualisez le stock.";
  if(error.message.includes("STOCK_CONFLICT") || error.message.includes("STOCK_NOT_FOUND")) return "Cette référence a changé sur un autre appareil. Actualisez avant de recommencer.";
  if(error.message.includes("STOCK_NOT_EMPTY")) return "Retirez les paires restantes avant d’archiver cette référence.";
  if(error.code === "23505") return "Cette référence existe déjà. Ajoutez les paires à la référence existante.";
  if(error.code === "23514" || error.code === "23502" || error.message.includes("STOCK_INVALID") || error.message.includes("STOCK_YEAR")) return "Vérifiez les dimensions, l’année et le nombre entier de paires.";
  return "Connexion interrompue ou session expirée. Réessayez la même opération pour vérifier son enregistrement, sans la compter deux fois.";
}
