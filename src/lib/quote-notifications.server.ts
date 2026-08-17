import { sendGmailMessage } from "@/lib/gmail.server";

type QuoteNotificationData = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  registrationPlate: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear?: string;
  mileage: number;
  fuelType?: string;
  transmission?: string;
  interventionType: string;
  description: string;
  preferredDates: string[];
};

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

function buildGarageMessage(data: QuoteNotificationData) {
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

async function sendGarageEmail(data: QuoteNotificationData) {
  return sendGmailMessage({
    to: process.env.QUOTE_ADMIN_EMAIL || GARAGE_EMAIL,
    replyTo: data.customerEmail,
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
          <p><strong>Téléphone :</strong> ${escapeHtml(data.customerPhone)}</p>
          <p><strong>E-mail :</strong> ${escapeHtml(data.customerEmail)}</p>
          <h2 style="margin-top:24px;font-size:18px">Véhicule</h2>
          <p><strong>Plaque :</strong> ${escapeHtml(data.registrationPlate.toUpperCase())}</p>
          <p><strong>Marque / modèle :</strong> ${escapeHtml(data.vehicleMake)} ${escapeHtml(data.vehicleModel)}</p>
          <p><strong>Année :</strong> ${optionalValue(data.vehicleYear)}</p>
          <p><strong>Kilométrage :</strong> ${data.mileage.toLocaleString("fr-FR")} km</p>
          <p><strong>Carburant :</strong> ${optionalValue(data.fuelType)}</p>
          <p><strong>Boîte :</strong> ${optionalValue(data.transmission)}</p>
          <h2 style="margin-top:24px;font-size:18px">Intervention</h2>
          <p><strong>Type :</strong> ${escapeHtml(data.interventionType)}</p>
          <ul>${data.preferredDates.map((date) => `<li>${escapeHtml(formatDate(date))}</li>`).join("")}</ul>
          <p><strong>Description :</strong><br>${escapeHtml(data.description).replaceAll("\n", "<br>")}</p>
        </div>
      </div>`,
  });
}

async function sendGarageWhatsapp(message: string) {
  const apiUrl = process.env.WHATSAPP_CLOUD_API_URL;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const to = process.env.WHATSAPP_ADMIN_PHONE || GARAGE_WHATSAPP;
  if (!apiUrl || !accessToken) return false;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
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

export async function sendQuoteNotifications(data: QuoteNotificationData) {
  const message = buildGarageMessage(data);
  const [emailSent, whatsappSent] = await Promise.all([
    sendGarageEmail(data),
    sendGarageWhatsapp(message),
  ]);

  return {
    emailSent,
    whatsappSent,
    whatsappUrl: whatsappSent
      ? null
      : `https://wa.me/${GARAGE_WHATSAPP}?text=${encodeURIComponent(message)}`,
  };
}
