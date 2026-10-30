import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, MISSING } from "@/components/LegalPage";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions générales d’utilisation — Pneus du Bruch Forbach" },
      { name: "description", content: "Conditions d’utilisation du site Pneus du Bruch." },
      { property: "og:title", content: "Conditions générales d’utilisation — Pneus du Bruch" },
      { property: "og:description", content: "Conditions d’utilisation du site Pneus du Bruch." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pneusdubruch.com/cgu" },
    ],
    links: [{ rel: "canonical", href: "https://pneusdubruch.com/cgu" }],
  }),
  component: () => (
    <LegalPage title="Conditions générales d’utilisation">
      <p>Le site présente les services de Pneus du Bruch (pneus, montage, mécanique) et permet de demander un devis et de créer un espace client.</p>
      <p>L’utilisateur s’engage à fournir des informations exactes et à ne pas utiliser les formulaires de manière abusive. Le compte est personnel ; l’utilisateur protège son mot de passe.</p>
      <p>Les prix affichés sont indicatifs ; seul le devis ou la facture du garage fait foi. Le garage peut suspendre un compte en cas d’usage abusif.</p>
      <p>Droit applicable : droit français. Tribunal compétent et contact : {MISSING}</p>
    </LegalPage>
  ),
});
