import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AccountContext = {
  claims?: Record<string, unknown>;
  userId?: string;
};

function getAccountIdentity(context: AccountContext) {
  const email =
    typeof context.claims?.email === "string" ? context.claims.email.trim().toLowerCase() : "";
  if (!context.userId || !email) throw new Error("Votre session est invalide. Reconnectez-vous.");
  return { email, userId: context.userId };
}

export const getClientDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const account = getAccountIdentity(context as AccountContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Database types are generated after migrations are applied.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    await db.rpc("cleanup_expired_workshop_reservations");

    const [reservationsResult, quotesResult, adminResult] = await Promise.all([
      db
        .from("workshop_reservations")
        .select(
          "id,equipment_id,vehicle,description,status,created_at,decided_at,workshop_reservation_slots(slot_start,status)",
        )
        .ilike("customer_email", account.email)
        .order("created_at", { ascending: false })
        .limit(100),
      db
        .from("quote_requests")
        .select(
          "id,registration_plate,vehicle_make,vehicle_model,intervention_type,description,preferred_dates,status,quoted_amount,admin_response,responded_at,created_at",
        )
        .ilike("customer_email", account.email)
        .order("created_at", { ascending: false })
        .limit(100),
      db.rpc("has_role", { p_user_id: account.userId, p_role: "admin" }),
    ]);

    if (reservationsResult.error || quotesResult.error) {
      console.error(reservationsResult.error ?? quotesResult.error);
      throw new Error("Impossible de charger le suivi de vos demandes.");
    }

    return {
      email: account.email,
      isAdmin: !adminResult.error && adminResult.data === true,
      reservations: reservationsResult.data ?? [],
      quotes: quotesResult.data ?? [],
    };
  });
