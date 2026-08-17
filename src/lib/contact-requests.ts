import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(5).max(3000),
  website: z.string().max(0).optional(),
});

const GARAGE_EMAIL = "jeremypreiss9@gmail.com";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const sendContactRequest = createServerFn({ method: "POST" })
  .validator(contactRequestSchema)
  .handler(async ({ data }) => {
    if (data.website) return { success: true };

    const user = process.env.GMAIL_USER;
    const appPassword = process.env.GMAIL_APP_PASSWORD?.replaceAll(" ", "");
    const to = process.env.CONTACT_ADMIN_EMAIL || GARAGE_EMAIL;

    if (!user || !appPassword) {
      throw new Error("Le service e-mail du garage n’est pas encore configuré.");
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      service: "gmail",
      auth: { user, pass: appPassword },
    });

    await transporter.sendMail({
      from: `CAO57 <${user}>`,
      to,
      replyTo: data.email,
      subject: `Nouveau message du site — ${data.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
          <div style="background:#0f1114;color:white;padding:24px;border-radius:8px 8px 0 0">
            <p style="margin:0;color:#60a5fa;font-weight:700">CAO57 · CONTACT DU SITE</p>
            <h1 style="margin:10px 0 0;font-size:26px">Nouveau message</h1>
          </div>
          <div style="border:1px solid #e5e7eb;padding:24px;border-radius:0 0 8px 8px">
            <p><strong>Nom :</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Téléphone :</strong> <a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></p>
            <p><strong>E-mail :</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
            <p><strong>Message :</strong></p>
            <div style="background:#f3f4f6;padding:16px;border-radius:6px;line-height:1.6">${escapeHtml(data.message).replaceAll("\n", "<br>")}</div>
            <p style="margin-top:22px;font-size:12px;color:#6b7280">Répondez directement à cet e-mail pour contacter le client.</p>
          </div>
        </div>`,
    });

    return { success: true };
  });
