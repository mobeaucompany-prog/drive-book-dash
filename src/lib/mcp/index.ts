import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "cao57-mcp",
  title: "Pneus du Bruch",
  version: "0.1.0",
  instructions:
    "Outils pour le garage Pneus du Bruch (Forbach) : consulter les pneus neufs et d’occasion, les tarifs de montage et les prestations mécaniques.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listServicesTool],
});
