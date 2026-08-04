import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listVehiclesTool from "./tools/list-vehicles";
import getVehicleTool from "./tools/get-vehicle";
import listServicesTool from "./tools/list-services";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "cao57-mcp",
  title: "CAO57 — Centre Auto Occasion 57",
  version: "0.1.0",
  instructions:
    "Outils pour le garage CAO57 (Forbach) : consulter le catalogue de véhicules d'occasion, lire une fiche véhicule complète, et obtenir la liste des services et tarifs (réparations, atelier libre).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listVehiclesTool, getVehicleTool, listServicesTool],
});
