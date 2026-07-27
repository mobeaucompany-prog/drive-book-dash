import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { decideWorkshopReservation } from "@/lib/workshop-reservations";

export const Route = createFileRoute("/reservation/$token")({
  validateSearch: (search: Record<string, unknown>) => ({
    action: search.action === "reject" ? ("reject" as const) : ("confirm" as const),
  }),
  component: ReservationDecisionPage,
});

function ReservationDecisionPage() {
  const { token } = Route.useParams();
  const { action } = Route.useSearch();
  const [state, setState] = useState<"ready" | "loading" | "confirmed" | "rejected" | "error">(
    "ready",
  );
  const [message, setMessage] = useState("");

  const decide = () => {
    setState("loading");
    setMessage("");
    decideWorkshopReservation({ data: { token, decision: action } })
      .then((result) => {
        setState(result.status === "confirmed" ? "confirmed" : "rejected");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Impossible de traiter cette demande.");
        setState("error");
      });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-smoke px-6 py-16 text-ink">
      <section className="w-full max-w-xl rounded-md border border-border bg-white p-8 text-center shadow-xl sm:p-12">
        {state === "ready" && (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-blue-100 text-2xl text-racing">
              {action === "confirm" ? "✓" : "×"}
            </div>
            <h1 className="mt-6 font-display text-3xl font-black">
              {action === "confirm" ? "Confirmer cette réservation ?" : "Refuser cette demande ?"}
            </h1>
            <p className="mt-3 text-steel">
              {action === "confirm"
                ? "Après confirmation, les créneaux seront marqués comme occupés et le client recevra un e-mail."
                : "Les créneaux seront libérés et le client sera informé par e-mail."}
            </p>
            <button
              type="button"
              onClick={decide}
              className={`mt-8 rounded-sm px-7 py-3 text-[12px] font-bold uppercase tracking-wider text-white ${
                action === "confirm" ? "bg-racing" : "bg-red-600"
              }`}
            >
              {action === "confirm" ? "Confirmer définitivement" : "Refuser définitivement"}
            </button>
          </>
        )}

        {state === "loading" && (
          <>
            <div className="mx-auto size-10 animate-spin rounded-full border-4 border-racing/20 border-t-racing" />
            <h1 className="mt-6 font-display text-2xl font-black">Traitement en cours…</h1>
            <p className="mt-2 text-steel">Ne fermez pas cette page.</p>
          </>
        )}

        {state === "confirmed" && (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-green-100 text-2xl text-green-700">
              ✓
            </div>
            <h1 className="mt-6 font-display text-3xl font-black">Réservation confirmée</h1>
            <p className="mt-3 text-steel">
              Les créneaux sont maintenant occupés dans l’agenda et le client a reçu sa
              confirmation.
            </p>
          </>
        )}

        {state === "rejected" && (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-slate-100 text-2xl">
              ×
            </div>
            <h1 className="mt-6 font-display text-3xl font-black">Demande refusée</h1>
            <p className="mt-3 text-steel">
              Les créneaux ont été libérés et le client a été informé par e-mail.
            </p>
          </>
        )}

        {state === "error" && (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-100 text-2xl text-red-700">
              !
            </div>
            <h1 className="mt-6 font-display text-3xl font-black">Action impossible</h1>
            <p className="mt-3 text-steel">{message}</p>
          </>
        )}

        {state !== "loading" && state !== "ready" && (
          <Link
            to="/atelier"
            className="mt-8 inline-flex rounded-sm bg-racing px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-white"
          >
            Retour à l’agenda
          </Link>
        )}
      </section>
    </main>
  );
}
