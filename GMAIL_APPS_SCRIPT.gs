/**
 * Script Google Apps Script à déployer comme application Web.
 * Exécution : vous-même. Accès : toute personne disposant du lien.
 * Ajoutez API_SECRET dans Paramètres du projet > Propriétés du script.
 */
function doPost(event) {
  try {
    var payload = JSON.parse(event.postData.contents || "{}");
    var expectedSecret = PropertiesService.getScriptProperties().getProperty("API_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "unauthorized" });
    }

    if (!payload.to || !payload.subject || !payload.html) {
      return jsonResponse({ ok: false, error: "missing_fields" });
    }

    var options = {
      htmlBody: payload.html,
      name: "CAO57",
    };

    if (payload.replyTo) options.replyTo = payload.replyTo;

    GmailApp.sendEmail(payload.to, payload.subject, "Consultez cet e-mail en HTML.", options);
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
