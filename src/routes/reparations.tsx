import { createFileRoute, redirect } from "@tanstack/react-router";

// Keep incoming links useful after the change of activity.
export const Route = createFileRoute("/reparations")({
  beforeLoad: () => { throw redirect({ to: "/", hash: "mecanique", statusCode: 301 }); },
});
