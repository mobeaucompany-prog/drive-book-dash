import { defineTool } from "@lovable.dev/mcp-js";
const services = {
  pneusOccasion: {
    tarifsParPaire: [50, 60, 70, 80, 100, 120, 130, 150].map((prix, i) => ({
      pouces: i + 13,
      prix,
      devise: "EUR",
    })),
    conditions:
      "Montage et équilibrage compris. Prix selon état et marque, sous réserve de disponibilité.",
  },
  pneusNeufs:
    "Toutes marques, été, hiver, 4 saisons, runflat, renforcés. Sur devis, montage compris.",
  montageEquilibrage: {
    janteTole: 15,
    janteAlu: 15,
    pneuRenforceCamionnette: 30,
    recyclage: 5,
    unite: "EUR par roue",
  },
  mecanique: [
    "Vidange et filtres",
    "Freins",
    "Échappement",
    "Entretien général",
    "Suspension",
    "Batterie",
    "Climatisation",
    "Diagnostic",
  ],
  contact: {
    entreprise: "Pneus du Bruch",
    adresse: "2 Allée des Cyprès, 57600 Forbach",
    telephone: "+33620431191",
    horaires: "7j/7 de 8h à 20h",
    langues: ["français", "allemand"],
  },
};
export default defineTool({
  name: "list_services",
  title: "Services et tarifs Pneus du Bruch",
  description: "Pneus neufs et d’occasion, montage, équilibrage et mécanique à Forbach.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
    structuredContent: services,
  }),
});
