import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { annonces } from "@/data/annonces";

export default defineTool({
  name: "get_vehicle",
  title: "Détails d'un véhicule",
  description:
    "Retourne la fiche complète d'un véhicule d'occasion CAO57 (description, équipements, entretien, photos) à partir de son identifiant.",
  inputSchema: {
    id: z.string().min(1).describe("Identifiant de l'annonce, ex : 'vw-polo-12-united-2008'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const vehicle = annonces.find((a) => a.id === id);
    if (!vehicle) {
      return {
        content: [{ type: "text", text: `Aucun véhicule trouvé pour l'identifiant "${id}".` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(vehicle, null, 2) }],
      structuredContent: { vehicle },
    };
  },
});
