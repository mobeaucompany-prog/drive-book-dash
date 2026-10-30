import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, MISSING } from "@/components/LegalPage";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Pneus du Bruch Forbach" },
      { name: "description", content: "Mentions légales du site Pneus du Bruch à Forbach." },
      { property: "og:title", content: "Mentions légales — Pneus du Bruch" },
      { property: "og:description", content: "Mentions légales du site Pneus du Bruch à Forbach." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pneusdubruch.com/mentions-legales" },
    ],
    links: [{ rel: "canonical", href: "https://pneusdubruch.com/mentions-legales" }],
  }),
  component: () => (
    <LegalPage title="Mentions légales">
      <h2 className="text-xl font-semibold">Éditeur</h2>
      <p>Pneus du Bruch, 2 Allée des Cyprès, 57600 Forbach — Tél. 06 20 43 11 91.</p>
      <p>Forme juridique, capital, SIRET/RCS, n° TVA, directeur de la publication, e-mail de contact : {MISSING}</p>
      <h2 className="text-xl font-semibold">Hébergement</h2>
      <p>Site réalisé et hébergé via la plateforme Lovable (Lovable Labs Incorporated) ; raison sociale, adresse et téléphone exacts de l’hébergeur : {MISSING}</p>
    </LegalPage>
  ),
});
