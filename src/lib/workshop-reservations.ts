import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const equipmentNames: Record<string, string> = {
  pont: "Pont élévateur 2 colonnes",
  pneus: "Démonte-pneus & équilibreuse",
  fosse: "Fosse mécanique",
  presse: "Presse hydraulique 45 T",
};

const availabilitySchema = z.object({
  equipmentId: z.enum(["pont", "pneus", "fosse", "presse"]),
  from: z.string().datetime(),
  to: z.string().datetime(),
});

const requestSchema = z.object({
  equipmentId: z.enum(["pont", "pneus", "fosse", "presse"]),
  customerName: z.string().trim().min(2).max(100),
  customerEmail: z.string().trim().email().max(200),
  customerPhone: z.string().trim().min(8).max(30),
  vehicle: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(2000),
  slots: z.array(z.string().datetime()).min(1).max(24),
});

const decisionSchema = z.object({
  token: z.string().min(32).max(200),
  decision: z.enum(["confirm", "reject"]),
});

const adminDecisionSchema = z.object({
  reservationId: z.string().uuid(),
  decision: z.enum(["confirm", "reject"]),
});

const adminBlockSchema = z.object({
  equipmentId: z.enum(["pont", "pneus", "fosse", "presse"]),
  reason: z.string().trim().min(2).max(250),
  slots: z.array(z.string().datetime()).min(1).max(48),
});

const adminDeleteBlockSchema = z.object({
  blockGroupId: z.string().uuid(),
});

type ReservationResult = {
  id: string;
  equipment_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle: string;
  description: string;
  status: "confirmed" | "rejected";
  slots: string[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function formatSlot(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function slotsHtml(slots: string[]) {
  return slots
    .map((slot) => `<li style="margin:6px 0">${escapeHtml(formatSlot(slot))}</li>`)
    .join("");
}

async function sendEmail(input: { to: string; subject: string; html: string }) {
  const user = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replaceAll(" ", "");

  if (!user || !appPassword) {
    return false;
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    service: "gmail",
    auth: {
      user,
      pass: appPassword,
    },
  });

  await transporter.sendMail({
    from: `CAO57 <${user}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });

  return true;
}

export const getWorkshopAvailability = createServerFn({ method: "GET" })
  .validator(availabilitySchema)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Database types are generated after the migration is applied.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    await db.rpc("cleanup_expired_workshop_reservations");
    const { data: rows, error } = await db
      .from("workshop_reservation_slots")
      .select("slot_start,status")
      .eq("equipment_id", data.equipmentId)
      .in("status", ["pending", "confirmed", "blocked"])
      .gte("slot_start", data.from)
      .lt("slot_start", data.to);

    if (error) throw new Error("Impossible de charger les disponibilités.");

    return (rows ?? []).map((row: { slot_start: string; status: string }) => ({
      startsAt: row.slot_start,
      status: row.status as "pending" | "confirmed" | "blocked",
    }));
  });

export const createWorkshopReservation = createServerFn({ method: "POST" })
  .validator(requestSchema)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Database types are generated after the migration is applied.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const token = createToken();
    const tokenHash = await hashToken(token);

    const { data: reservationId, error } = await db.rpc("create_workshop_reservation", {
      p_equipment_id: data.equipmentId,
      p_customer_name: data.customerName,
      p_customer_email: data.customerEmail,
      p_customer_phone: data.customerPhone,
      p_vehicle: data.vehicle,
      p_description: data.description,
      p_token_hash: tokenHash,
      p_slots: data.slots,
    });

    if (error) {
      if (error.code === "23505") {
        throw new Error(
          "Un des créneaux vient d’être demandé. Actualisez l’agenda et choisissez-en un autre.",
        );
      }
      console.error(error);
      throw new Error("La demande n’a pas pu être enregistrée.");
    }

    const origin = getRequestUrl({ xForwardedHost: true }).origin;
    const confirmUrl = `${origin}/reservation/${token}?action=confirm`;
    const rejectUrl = `${origin}/reservation/${token}?action=reject`;
    const safeDescription = escapeHtml(data.description).replaceAll("\n", "<br>");

    try {
      await sendEmail({
        to: data.customerEmail,
        subject: "Votre demande atelier CAO57 a bien été reçue",
        html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
          <div style="background:#0f1114;color:white;padding:24px;border-radius:8px 8px 0 0">
            <p style="margin:0;color:#60a5fa;font-weight:700">CAO57 · DEMANDE REÇUE</p>
            <h1 style="margin:10px 0 0;font-size:26px">Votre demande est en attente</h1>
          </div>
          <div style="border:1px solid #e5e7eb;padding:24px;border-radius:0 0 8px 8px">
            <p>Bonjour ${escapeHtml(data.customerName)},</p>
            <p>Nous avons bien reçu votre demande. Le garage va vérifier les créneaux puis vous enverra un second e-mail de confirmation ou de refus.</p>
            <p><strong>Équipement :</strong> ${escapeHtml(equipmentNames[data.equipmentId])}</p>
            <p><strong>Créneaux demandés :</strong></p>
            <ul>${slotsHtml(data.slots)}</ul>
            <p style="margin-top:24px"><strong>CAO57</strong><br>2 Allée des Cyprès, 57600 Forbach<br>06 20 43 11 91</p>
          </div>
        </div>`,
      });
    } catch (emailError) {
      console.error("Customer acknowledgement email could not be sent", emailError);
    }

    const adminEmail = process.env.RESERVATION_ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await sendEmail({
          to: adminEmail,
          subject: `Nouvelle demande atelier — ${equipmentNames[data.equipmentId]}`,
          html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#111827">
            <div style="background:#0f1114;color:white;padding:24px;border-radius:8px 8px 0 0">
              <p style="margin:0;color:#60a5fa;font-weight:700">CAO57 · DEMANDE EN ATTENTE</p>
              <h1 style="margin:10px 0 0;font-size:26px">Nouvelle réservation atelier</h1>
            </div>
            <div style="border:1px solid #e5e7eb;padding:24px;border-radius:0 0 8px 8px">
              <p><strong>Client :</strong> ${escapeHtml(data.customerName)}</p>
              <p><strong>E-mail :</strong> ${escapeHtml(data.customerEmail)}</p>
              <p><strong>Téléphone :</strong> ${escapeHtml(data.customerPhone)}</p>
              <p><strong>Véhicule :</strong> ${escapeHtml(data.vehicle)}</p>
              <p><strong>Équipement :</strong> ${escapeHtml(equipmentNames[data.equipmentId])}</p>
              <p><strong>Description :</strong><br>${safeDescription}</p>
              <p><strong>Créneaux demandés :</strong></p>
              <ul>${slotsHtml(data.slots)}</ul>
              <div style="margin-top:28px">
                <a href="${confirmUrl}" style="display:inline-block;background:#1e5fbf;color:white;text-decoration:none;padding:14px 20px;border-radius:5px;font-weight:700;margin-right:10px">Confirmer la réservation</a>
                <a href="${rejectUrl}" style="display:inline-block;background:#e5e7eb;color:#111827;text-decoration:none;padding:14px 20px;border-radius:5px;font-weight:700">Refuser</a>
              </div>
              <p style="margin-top:24px;font-size:12px;color:#6b7280">Ces liens expirent automatiquement après 24 heures.</p>
            </div>
          </div>`,
        });
      } catch (emailError) {
        console.error("Admin reservation email could not be sent", emailError);
      }
    }

    return { success: true, reservationId: reservationId as string };
  });

export const decideWorkshopReservation = createServerFn({ method: "POST" })
  .validator(decisionSchema)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Database types are generated after the migration is applied.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const tokenHash = await hashToken(data.token);

    const { data: result, error } = await db.rpc("decide_workshop_reservation", {
      p_token_hash: tokenHash,
      p_decision: data.decision,
    });

    if (error) {
      console.error(error);
      throw new Error(
        error.message.includes("déjà")
          ? "Cette demande a déjà été traitée."
          : "Ce lien est invalide ou a expiré.",
      );
    }

    const reservation = result as ReservationResult;
    const confirmed = reservation.status === "confirmed";

    try {
      await sendEmail({
        to: reservation.customer_email,
        subject: confirmed
          ? "Votre réservation atelier CAO57 est confirmée"
          : "Réponse à votre demande atelier CAO57",
        html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
          <div style="background:#0f1114;color:white;padding:24px;border-radius:8px 8px 0 0">
            <p style="margin:0;color:#60a5fa;font-weight:700">CAO57 · FORBACH</p>
            <h1 style="margin:10px 0 0;font-size:26px">${confirmed ? "Réservation confirmée" : "Demande non retenue"}</h1>
          </div>
          <div style="border:1px solid #e5e7eb;padding:24px;border-radius:0 0 8px 8px">
            <p>Bonjour ${escapeHtml(reservation.customer_name)},</p>
            <p>${
              confirmed
                ? "Le garage a confirmé votre réservation. Vos créneaux sont désormais bloqués dans l’agenda."
                : "Le garage ne peut malheureusement pas confirmer les créneaux demandés. Contactez-nous pour trouver une autre disponibilité."
            }</p>
            <p><strong>Équipement :</strong> ${escapeHtml(equipmentNames[reservation.equipment_id])}</p>
            <ul>${slotsHtml(reservation.slots)}</ul>
            <p style="margin-top:24px"><strong>CAO57</strong><br>2 Allée des Cyprès, 57600 Forbach<br>06 20 43 11 91</p>
          </div>
        </div>`,
      });
    } catch (emailError) {
      console.error("Customer reservation email could not be sent", emailError);
    }

    return { status: reservation.status };
  });

type AdminContext = {
  claims?: Record<string, unknown>;
  userId?: string;
};

function assertWorkshopAdmin(context: AdminContext) {
  const configuredEmail = process.env.RESERVATION_ADMIN_EMAIL?.trim().toLowerCase();
  const claimEmail =
    typeof context.claims?.email === "string" ? context.claims.email.trim().toLowerCase() : "";

  if (!configuredEmail) {
    throw new Error("Accès admin non configuré : ajoutez RESERVATION_ADMIN_EMAIL.");
  }

  if (!claimEmail || claimEmail !== configuredEmail) {
    throw new Error("Accès refusé : ce compte n’est pas autorisé à gérer l’atelier.");
  }

  return {
    email: claimEmail,
    userId: context.userId,
  };
}

export const getWorkshopAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertWorkshopAdmin(context as AdminContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    await db.rpc("cleanup_expired_workshop_reservations");

    const [reservationsResult, blocksResult] = await Promise.all([
      db
        .from("workshop_reservations")
        .select(
          "id,equipment_id,customer_name,customer_email,customer_phone,vehicle,description,status,created_at,decided_at,workshop_reservation_slots(slot_start,status)",
        )
        .order("created_at", { ascending: false })
        .limit(200),
      db
        .from("workshop_reservation_slots")
        .select("id,equipment_id,slot_start,blocked_reason,block_group_id,created_at")
        .eq("status", "blocked")
        .gte("slot_start", new Date().toISOString())
        .order("slot_start", { ascending: true })
        .limit(500),
    ]);

    if (reservationsResult.error || blocksResult.error) {
      console.error(reservationsResult.error ?? blocksResult.error);
      throw new Error("Impossible de charger l’administration de l’atelier.");
    }

    return {
      reservations: reservationsResult.data ?? [],
      blocks: blocksResult.data ?? [],
    };
  });

export const adminDecideWorkshopReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(adminDecisionSchema)
  .handler(async ({ data, context }) => {
    assertWorkshopAdmin(context as AdminContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    const { data: result, error } = await db.rpc("admin_decide_workshop_reservation", {
      p_reservation_id: data.reservationId,
      p_decision: data.decision,
    });

    if (error) {
      console.error(error);
      throw new Error(
        error.message.includes("déjà")
          ? "Cette demande a déjà été traitée."
          : "La demande n’a pas pu être mise à jour.",
      );
    }

    const reservation = result as ReservationResult;
    const confirmed = reservation.status === "confirmed";

    try {
      await sendEmail({
        to: reservation.customer_email,
        subject: confirmed
          ? "Votre réservation atelier CAO57 est confirmée"
          : "Réponse à votre demande atelier CAO57",
        html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
          <div style="background:#0f1114;color:white;padding:24px;border-radius:8px 8px 0 0">
            <p style="margin:0;color:#60a5fa;font-weight:700">CAO57 · FORBACH</p>
            <h1 style="margin:10px 0 0;font-size:26px">${confirmed ? "Réservation confirmée" : "Demande non retenue"}</h1>
          </div>
          <div style="border:1px solid #e5e7eb;padding:24px;border-radius:0 0 8px 8px">
            <p>Bonjour ${escapeHtml(reservation.customer_name)},</p>
            <p>${
              confirmed
                ? "Le garage a confirmé votre réservation. Vos créneaux sont désormais bloqués dans l’agenda."
                : "Le garage ne peut malheureusement pas confirmer les créneaux demandés. Contactez-nous pour trouver une autre disponibilité."
            }</p>
            <p><strong>Équipement :</strong> ${escapeHtml(equipmentNames[reservation.equipment_id])}</p>
            <ul>${slotsHtml(reservation.slots)}</ul>
            <p style="margin-top:24px"><strong>CAO57</strong><br>2 Allée des Cyprès, 57600 Forbach<br>06 20 43 11 91</p>
          </div>
        </div>`,
      });
    } catch (emailError) {
      console.error("Customer admin decision email could not be sent", emailError);
    }

    return { status: reservation.status };
  });

export const createWorkshopBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(adminBlockSchema)
  .handler(async ({ data, context }) => {
    const admin = assertWorkshopAdmin(context as AdminContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    const { data: blockGroupId, error } = await db.rpc("create_workshop_block", {
      p_equipment_id: data.equipmentId,
      p_slots: data.slots,
      p_reason: data.reason,
      p_blocked_by: admin.userId ?? null,
    });

    if (error) {
      if (error.code === "23505") {
        throw new Error("Un créneau sélectionné est déjà réservé ou bloqué.");
      }
      console.error(error);
      throw new Error("Les créneaux n’ont pas pu être bloqués.");
    }

    return { success: true, blockGroupId: blockGroupId as string };
  });

export const deleteWorkshopBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(adminDeleteBlockSchema)
  .handler(async ({ data, context }) => {
    assertWorkshopAdmin(context as AdminContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    const { error } = await db.rpc("delete_workshop_block_group", {
      p_block_group_id: data.blockGroupId,
    });

    if (error) {
      console.error(error);
      throw new Error("Le blocage n’a pas pu être supprimé.");
    }

    return { success: true };
  });
