import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";

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
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESERVATION_FROM_EMAIL;

  if (!apiKey || !from) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "CAO57-reservations/1.0",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend error", response.status, detail);
    throw new Error("L’e-mail de réservation n’a pas pu être envoyé.");
  }

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
      .in("status", ["pending", "confirmed"])
      .gte("slot_start", data.from)
      .lt("slot_start", data.to);

    if (error) throw new Error("Impossible de charger les disponibilités.");

    return (rows ?? []).map((row: { slot_start: string; status: string }) => ({
      startsAt: row.slot_start,
      status: row.status as "pending" | "confirmed",
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
