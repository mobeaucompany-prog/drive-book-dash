import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, MISSING } from "@/components/LegalPage";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Pneus du Bruch Forbach" },
      { name: "description", content: "Données personnelles et cookies sur le site Pneus du Bruch." },
      { property: "og:title", content: "Politique de confidentialité — Pneus du Bruch" },
      { property: "og:description", content: "Données personnelles et cookies sur le site Pneus du Bruch." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pneusdubruch.com/confidentialite" },
    ],
    links: [{ rel: "canonical", href: "https://pneusdubruch.com/confidentialite" }],
  }),
  component: () => (
    <LegalPage title="Politique de confidentialité">
      <h2 className="text-xl font-semibold">Responsable du traitement</h2>
      <p>Pneus du Bruch, 2 Allée des Cyprès, 57600 Forbach. Identité légale et e-mail de contact : {MISSING}</p>
      <h2 className="text-xl font-semibold">Données collectées et finalités</h2>
      <p>Formulaire de devis : nom, téléphone, e-mail, immatriculation, véhicule, kilométrage, description et dates souhaitées, pour traiter votre demande (mesures précontractuelles). Espace client : e-mail et mot de passe (chiffré) pour suivre vos demandes. Une empreinte non réversible de l’adresse IP est conservée 24 h pour limiter les envois abusifs (intérêt légitime).</p>
      <h2 className="text-xl font-semibold">Destinataires et sous-traitants</h2>
      <p>Le garage ; l’infrastructure d’hébergement et de base de données du site ; Google (Gmail) pour l’envoi des notifications e-mail ; Google Fonts (chargement des polices). Si vous utilisez le bouton WhatsApp, WhatsApp/Meta traite le message.</p>
      <h2 className="text-xl font-semibold">Durées de conservation</h2>
      <p>{MISSING}</p>
      <h2 className="text-xl font-semibold">Vos droits</h2>
      <p>Accès, rectification, effacement, limitation, opposition, portabilité : contactez le garage au 06 20 43 11 91 (adresse e-mail dédiée : {MISSING}). Réclamation possible auprès de la CNIL (cnil.fr).</p>
      <h2 className="text-xl font-semibold">Cookies et stockage local</h2>
      <p>Le site n’utilise aucun cookie publicitaire ni de mesure d’audience. Seuls des éléments strictement nécessaires sont stockés dans votre navigateur : la session de connexion à l’espace client et votre choix de langue. Aucun consentement n’est donc requis.</p>
    </LegalPage>
  ),
});
