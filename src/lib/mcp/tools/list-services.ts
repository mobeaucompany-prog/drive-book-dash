import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const services = {
  reparations: [
    { nom: "Vidange", description: "Vidange moteur et remplacement des filtres." },
    { nom: "Freinage", description: "Disques, plaquettes, purge et contrôle du système de freinage." },
    { nom: "Distribution", description: "Kit distribution + pompe à eau." },
    { nom: "Embrayage", description: "Remplacement d'embrayage complet." },
    { nom: "Pneumatiques", description: "Montage, équilibrage et parallélisme." },
    { nom: "Diagnostic", description: "Diagnostic électronique toutes marques." },
  ],
  atelierLibre: {
    description:
      "Location d'équipements professionnels à l'heure au CAO57 Forbach : ponts élévateurs, démonte-pneus et fosse mécanique.",
    tarifs: [
      { equipement: "Pont élévateur", prixParHeure: 20, devise: "EUR" },
      { equipement: "Démonte-pneus", prixParHeure: 15, devise: "EUR" },
      { equipement: "Fosse mécanique", prixParHeure: 15, devise: "EUR" },
    ],
  },
  ventesOccasions: {
    description:
      "Vente de véhicules d'occasion révisés, garantis 6 mois. Utiliser list_vehicles pour consulter le catalogue.",
  },
  contact: {
    entreprise: "CAO57 — Centre Auto Occasion 57",
    adresse: "2 Allée des Cyprès",
    ville: "Forbach",
    codePostal: "57600",
  },
};

export default defineTool({
  name: "list_services",
  title: "Services et tarifs CAO57",
  description:
    "Retourne le catalogue des services proposés par le garage CAO57 : réparations, atelier libre (avec tarifs horaires) et vente d'occasions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
    structuredContent: services,
  }),
});
