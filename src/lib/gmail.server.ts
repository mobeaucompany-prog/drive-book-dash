type GmailMessage = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendGmailMessage(message: GmailMessage) {
  const webhookUrl = process.env.GMAIL_WEBHOOK_URL;
  const webhookSecret = process.env.GMAIL_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: webhookSecret,
      ...message,
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Gmail webhook error", response.status, responseText);
    throw new Error("L’e-mail n’a pas pu être envoyé par Gmail.");
  }

  let result: { ok?: boolean; error?: string };

  try {
    result = JSON.parse(responseText) as { ok?: boolean; error?: string };
  } catch {
    console.error("Gmail webhook invalid response", responseText);
    throw new Error("La réponse du service Gmail est invalide.");
  }

  if (!result.ok) {
    console.error("Gmail webhook rejected the message", result.error);
    throw new Error("L’e-mail a été refusé par le service Gmail.");
  }

  return true;
}
