import { createFileRoute, redirect } from "@tanstack/react-router";

// Keep incoming links useful after the change of activity.
export const Route = createFileRoute("/atelier")({
  beforeLoad: () => { throw redirect({ to: "/", hash: "contact", statusCode: 301 }); },
});
