import { createFileRoute, redirect } from "@tanstack/react-router";

// Keep incoming links useful after the change of activity.
export const Route = createFileRoute("/occasions")({
  beforeLoad: () => { throw redirect({ to: "/", hash: "pneus", statusCode: 301 }); },
});
