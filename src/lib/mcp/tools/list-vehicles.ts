import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { annonces } from "@/data/annonces";

export default defineTool({
  name: "list_vehicles",
  title: "Lister les véhicules d'occasion",
  description:
    "Retourne la liste des véhicules d'occasion publiés au catalogue CAO57 (Forbach). Filtres optionnels par marque, énergie, prix max et kilométrage max.",
  inputSchema: {
    marque: z.string().optional().describe("Filtrer par marque (ex : Volkswagen, Citroën)."),
    energie: z
      .enum(["Essence", "Diesel", "Hybride", "Électrique"])
      .optional()
      .describe("Filtrer par type d'énergie."),
    prixMax: z.number().positive().optional().describe("Prix maximum en euros."),
    kmMax: z.number().positive().optional().describe("Kilométrage maximum."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ marque, energie, prixMax, kmMax }) => {
    const filtered = annonces
      .filter((a) => (marque ? a.marque.toLowerCase() === marque.toLowerCase() : true))
      .filter((a) => (energie ? a.energie === energie : true))
      .filter((a) => (prixMax ? a.prix <= prixMax : true))
      .filter((a) => (kmMax ? a.km <= kmMax : true))
      .map((a) => ({
        id: a.id,
        titre: a.titre,
        marque: a.marque,
        prix: a.prix,
        annee: a.annee,
        km: a.km,
        energie: a.energie,
        boite: a.boite,
        ville: a.ville,
        badge: a.badge,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify({ count: filtered.length, vehicles: filtered }, null, 2) }],
      structuredContent: { count: filtered.length, vehicles: filtered },
    };
  },
});
