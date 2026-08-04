import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const quoteRequestSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(8).max(30),
  customerEmail: z.string().trim().email().max(200),
  registrationPlate: z.string().trim().min(2).max(20),
  vehicleMake: z.string().trim().min(2).max(80),
  vehicleModel: z.string().trim().min(1).max(100),
  vehicleYear: z.string().trim().max(4).optional(),
  mileage: z.number().int().min(0).max(2_000_000),
  fuelType: z.string().trim().max(40).optional(),
  transmission: z.string().trim().max(40).optional(),
  interventionType: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(3000),
  preferredDates: z
    .array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .min(1)
    .max(3),
});

const GARAGE_EMAIL = "jeremypreiss9@gmail.com";
const GARAGE_WHATSAPP = "33620431191";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function optionalValue(value?: string) {
  return value?.trim() ? escapeHtml(value.trim()) : "Non renseigné";
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function buildGarageMessage(data: z.infer<typeof quoteRequestSchema>) {
  return [
    "Nouvelle demande de devis CAO57",
    "",
    `Client : ${data.customerName}`,
    `Téléphone : ${data.customerPhone}`,
    `E-mail : ${data.customerEmail}`,
    `Plaque : ${data.registrationPlate.toUpperCase()}`,
    `Véhicule : ${data.vehicleMake} ${data.vehicleModel}${data.vehicleYear ? ` (${data.vehicleYear})` : ""}`,
    `Kilométrage : ${data.mileage.toLocaleString("fr-FR")} km`,
    `Carburant : ${data.fuelType || "Non renseigné"}`,
    `Boîte : ${data.transmission || "Non renseignée"}`,
    `Intervention : ${data.interventionType}`,
    `Dates souhaitées : ${data.preferredDates.map(formatDate).join(" · ")}`,
    "",
    `Détails : ${data.description}`,
  ].join("\n");
}

async function sendGarageEmail(data: z.infer<typeof quoteRequestSchema>) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESERVATION_FROM_EMAIL;
  const to = process.env.QUOTE_ADMIN_EMAIL || GARAGE_EMAIL;

  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "CAO57-quotes/1.0",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.customerEmail,
      subject: `Demande de devis — ${data.registrationPlate.toUpperCase()} — ${data.interventionType}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#111827">
          <div style="background:#0f1114;color:white;padding:24px;border-radius:8px 8px 0 0">
            <p style="margin:0;color:#60a5fa;font-weight:700">CAO57 · NOUVELLE DEMANDE</p>
            <h1 style="margin:10px 0 0;font-size:26px">Demande de devis automobile</h1>
          </div>
          <div style="border:1px solid #e5e7eb;padding:24px;border-radius:0 0 8px 8px">
            <h2 style="font-size:18px">Client</h2>
            <p><strong>Nom :</strong> ${escapeHtml(data.customerName)}</p>
            <p><strong>Téléphone :</strong> <a href="tel:${escapeHtml(data.customerPhone)}">${escapeHtml(data.customerPhone)}</a></p>
            <p><strong>E-mail :</strong> <a href="mailto:${escapeHtml(data.customerEmail)}">${escapeHtml(data.customerEmail)}</a></p>
            <h2 style="margin-top:24px;font-size:18px">Véhicule</h2>
            <p><strong>Plaque :</strong> ${escapeHtml(data.registrationPlate.toUpperCase())}</p>
            <p><strong>Marque / modèle :</strong> ${escapeHtml(data.vehicleMake)} ${escapeHtml(data.vehicleModel)}</p>
            <p><strong>Année :</strong> ${optionalValue(data.vehicleYear)}</p>
            <p><strong>Kilométrage :</strong> ${data.mileage.toLocaleString("fr-FR")} km</p>
            <p><strong>Carburant :</strong> ${optionalValue(data.fuelType)}</p>
            <p><strong>Boîte :</strong> ${optionalValue(data.transmission)}</p>
            <h2 style="margin-top:24px;font-size:18px">Intervention</h2>
            <p><strong>Type :</strong> ${escapeHtml(data.interventionType)}</p>
            <p><strong>Dates souhaitées :</strong></p>
            <ul>${data.preferredDates.map((date) => `<li>${escapeHtml(formatDate(date))}</li>`).join("")}</ul>
            <p><strong>Description :</strong><br>${escapeHtml(data.description).replaceAll("\n", "<br>")}</p>
          </div>
        </div>`,
    }),
  });

  if (!response.ok) {
    console.error("Resend quote error", response.status, await response.text());
    throw new Error("L’e-mail n’a pas pu être envoyé au garage.");
  }

  return true;
}

async function sendGarageWhatsapp(message: string) {
  const apiUrl = process.env.WHATSAPP_CLOUD_API_URL;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const to = process.env.WHATSAPP_ADMIN_PHONE || GARAGE_WHATSAPP;

  if (!apiUrl || !accessToken) return false;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: message },
    }),
  });

  if (!response.ok) {
    console.error("WhatsApp quote error", response.status, await response.text());
    return false;
  }

  return true;
}

export const createQuoteRequest = createServerFn({ method: "POST" })
  .validator(quoteRequestSchema)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Database types will include quote_requests after the migration is applied.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    const { data: row, error } = await db
      .from("quote_requests")
      .insert({
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail.toLowerCase(),
        registration_plate: data.registrationPlate.toUpperCase(),
        vehicle_make: data.vehicleMake,
        vehicle_model: data.vehicleModel,
        vehicle_year: data.vehicleYear || null,
        mileage: data.mileage,
        fuel_type: data.fuelType || null,
        transmission: data.transmission || null,
        intervention_type: data.interventionType,
        description: data.description,
        preferred_dates: data.preferredDates,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      throw new Error("La demande de devis n’a pas pu être enregistrée.");
    }

    const message = buildGarageMessage(data);
    const [emailSent, whatsappSent] = await Promise.all([
      sendGarageEmail(data),
      sendGarageWhatsapp(message),
    ]);

    return {
      id: row.id as string,
      emailSent,
      whatsappSent,
      whatsappUrl: whatsappSent
        ? null
        : `https://wa.me/${GARAGE_WHATSAPP}?text=${encodeURIComponent(message)}`,
    };
  });
