import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, MISSING } from "@/components/LegalPage";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente — Pneus du Bruch Forbach" },
      { name: "description", content: "Conditions générales de vente des prestations Pneus du Bruch." },
      { property: "og:title", content: "Conditions générales de vente — Pneus du Bruch" },
      { property: "og:description", content: "Conditions générales de vente des prestations Pneus du Bruch." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pneusdubruch.com/cgv" },
    ],
    links: [{ rel: "canonical", href: "https://pneusdubruch.com/cgv" }],
  }),
  component: () => (
    <LegalPage title="Conditions générales de vente">
      <p>Les demandes faites sur le site sont des demandes de devis ; aucun paiement en ligne n’est réalisé sur le site. La prestation est conclue et payée au garage.</p>
      <p>Prix TTC, modalités de paiement, garanties commerciales, conditions d’annulation, garantie légale de conformité et vices cachés applicables, médiateur de la consommation : {MISSING}</p>
    </LegalPage>
  ),
});
