import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listVehiclesTool from "./tools/list-vehicles";
import getVehicleTool from "./tools/get-vehicle";
import listServicesTool from "./tools/list-services";

export default defineMcp({
  name: "cao57-mcp",
  title: "CAO57 — Centre Auto Occasion 57",
  version: "0.1.0",
  instructions:
    "Outils publics pour le garage CAO57 (Forbach) : consulter le catalogue de véhicules d'occasion, lire une fiche véhicule complète, et obtenir la liste des services et tarifs (réparations, atelier libre).",
  tools: [listVehiclesTool, getVehicleTool, listServicesTool],
});
