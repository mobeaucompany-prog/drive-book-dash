import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import logoAsset from "@/assets/cao57-logo-v4.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { getClientDashboard } from "@/lib/client-account";

export const Route = createFileRoute("/compte")({
  head: () => ({
    meta: [
      { title: "Mon compte — Suivi de mes demandes CAO57" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ClientAccountPage,
});

type AuthMode = "login" | "register" | "forgot";

type ClientReservation = {
  id: string;
  equipment_id: "pont" | "pneus" | "fosse" | "presse";
  vehicle: string;
  description: string;
  status: "pending" | "confirmed" | "rejected" | "expired";
  created_at: string;
  decided_at: string | null;
  workshop_reservation_slots: { slot_start: string; status: string }[];
};

type ClientQuote = {
  id: string;
  registration_plate: string;
  vehicle_make: string;
  vehicle_model: string;
  intervention_type: string;
  description: string;
  preferred_dates: string[];
  status: "new" | "contacted" | "quoted" | "closed";
  quoted_amount: number | null;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
};

const equipmentNames: Record<ClientReservation["equipment_id"], string> = {
  pont: "Pont 2 colonnes",
  pneus: "Démonte-pneus",
  fosse: "Fosse mécanique",
  presse: "Presse 45 T",
};

function formatDate(value: string, withTime = false) {
  return new Date(value).toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function reservationStatus(status: ClientReservation["status"]) {
  if (status === "confirmed") return { label: "Confirmée", color: "bg-green-100 text-green-800" };
  if (status === "rejected") return { label: "Refusée", color: "bg-red-100 text-red-700" };
  if (status === "expired") return { label: "Expirée", color: "bg-steel/15 text-steel" };
  return { label: "En attente du garage", color: "bg-amber-100 text-amber-800" };
}

function quoteStatus(status: ClientQuote["status"]) {
  if (status === "quoted")
    return { label: "Devis disponible", color: "bg-green-100 text-green-800" };
  if (status === "contacted")
    return { label: "Pris en charge", color: "bg-blue-100 text-blue-800" };
  if (status === "closed") return { label: "Clôturée", color: "bg-steel/15 text-steel" };
  return { label: "Envoyée", color: "bg-amber-100 text-amber-800" };
}

function ClientAccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState<ClientReservation[]>([]);
  const [quotes, setQuotes] = useState<ClientQuote[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      setSession(nextSession);
      setAuthLoading(false);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadDashboard = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = (await getClientDashboard()) as {
        reservations: ClientReservation[];
        quotes: ClientQuote[];
        isAdmin: boolean;
      };
      setReservations(data.reservations);
      setQuotes(data.quotes);
      setIsAdmin(data.isAdmin);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Impossible de charger votre compte.",
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    void loadDashboard();
    const intervalId = window.setInterval(() => void loadDashboard(true), 15_000);
    const onFocus = () => void loadDashboard(true);
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadDashboard, session]);

  const authenticate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");
    setAuthBusy(true);
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email") ?? "").trim();
    const password = String(values.get("password") ?? "");

    if (authMode === "forgot") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/compte`,
      });
      setAuthBusy(false);
      if (resetError) setAuthError("Le lien de réinitialisation n’a pas pu être envoyé.");
      else setAuthMessage("Lien envoyé. Consultez votre boîte e-mail.");
      return;
    }

    if (password.length < 8) {
      setAuthBusy(false);
      setAuthError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    const result =
      authMode === "register"
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/compte` },
          })
        : await supabase.auth.signInWithPassword({ email, password });
    setAuthBusy(false);

    if (result.error) {
      setAuthError(
        authMode === "register"
          ? "Le compte n’a pas pu être créé. Cette adresse est peut-être déjà utilisée."
          : "Adresse e-mail ou mot de passe incorrect.",
      );
      return;
    }
    if (authMode === "register" && !result.data.session) {
      setAuthMessage("Compte créé. Confirmez votre adresse depuis l’e-mail reçu.");
    }
  };

  const saveNewPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    if (password.length < 8) {
      setAuthError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setAuthBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setAuthBusy(false);
    if (updateError) setAuthError("Le mot de passe n’a pas pu être modifié.");
    else setPasswordRecovery(false);
  };

  if (authLoading) {
    return <div className="grid min-h-screen place-items-center bg-smoke">Chargement…</div>;
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-smoke px-6 py-10">
        <section className="w-full max-w-md rounded-md border border-border bg-white p-8 shadow-sm">
          <Link to="/" className="inline-flex">
            <img src={logoAsset.url} alt="CAO57" className="h-16 w-auto" />
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-racing">
            Espace client
          </p>
          <h1 className="mt-2 font-display text-3xl font-black">
            {authMode === "register"
              ? "Créer mon compte"
              : authMode === "forgot"
                ? "Mot de passe oublié"
                : "Connexion"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-steel">
            Retrouvez vos devis et réservations envoyés avec la même adresse e-mail.
          </p>
          {authMessage && (
            <div className="mt-5 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              {authMessage}
            </div>
          )}
          <form onSubmit={authenticate} className="mt-6 space-y-4">
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="votre@email.fr"
              className="w-full rounded-sm border border-border px-4 py-3"
            />
            {authMode !== "forgot" && (
              <input
                required
                minLength={8}
                name="password"
                type="password"
                autoComplete={authMode === "register" ? "new-password" : "current-password"}
                placeholder="Mot de passe"
                className="w-full rounded-sm border border-border px-4 py-3"
              />
            )}
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <button
              disabled={authBusy}
              className="w-full rounded-sm bg-racing px-5 py-3 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-50"
            >
              {authBusy
                ? "Veuillez patienter…"
                : authMode === "register"
                  ? "Créer mon compte"
                  : authMode === "forgot"
                    ? "Envoyer le lien"
                    : "Se connecter"}
            </button>
          </form>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {authMode !== "login" && (
              <button onClick={() => setAuthMode("login")} className="font-semibold text-racing">
                Se connecter
              </button>
            )}
            {authMode !== "register" && (
              <button onClick={() => setAuthMode("register")} className="font-semibold text-racing">
                Créer un compte
              </button>
            )}
            {authMode !== "forgot" && (
              <button onClick={() => setAuthMode("forgot")} className="text-steel">
                Mot de passe oublié
              </button>
            )}
          </div>
        </section>
      </main>
    );
  }

  if (passwordRecovery) {
    return (
      <main className="grid min-h-screen place-items-center bg-smoke px-6">
        <form
          onSubmit={saveNewPassword}
          className="w-full max-w-md space-y-4 rounded-md border border-border bg-white p-8"
        >
          <h1 className="font-display text-3xl font-black">Nouveau mot de passe</h1>
          <input
            required
            minLength={8}
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="8 caractères minimum"
            className="w-full rounded-sm border border-border px-4 py-3"
          />
          {authError && <p className="text-sm text-red-600">{authError}</p>}
          <button className="w-full rounded-sm bg-racing px-5 py-3 font-bold text-white">
            Enregistrer
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-smoke text-ink">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/">
            <img src={logoAsset.url} alt="CAO57" className="h-16 w-auto" />
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin/atelier"
                className="rounded-sm bg-racing px-4 py-2 text-xs font-bold uppercase text-white"
              >
                Administration garage
              </Link>
            )}
            <button
              onClick={() => void supabase.auth.signOut()}
              className="rounded-sm bg-carbon px-4 py-2 text-xs font-bold uppercase text-white"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-racing">
            Espace client · {session.user.email}
          </p>
          <h1 className="mt-2 font-display text-4xl font-black">Suivi de mes demandes</h1>
          <p className="mt-3 text-sm text-steel">
            Les changements sont actualisés automatiquement toutes les 15 secondes.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-md border border-border bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-black">Mes réservations atelier</h2>
            <Link to="/atelier" className="text-sm font-bold text-racing">
              Nouvelle réservation →
            </Link>
          </div>
          <div className="mt-6 grid gap-4">
            {!loading && reservations.length === 0 && (
              <p className="rounded-md bg-smoke p-5 text-sm text-steel">
                Aucune réservation trouvée pour cette adresse e-mail.
              </p>
            )}
            {reservations.map((reservation) => {
              const status = reservationStatus(reservation.status);
              return (
                <article key={reservation.id} className="rounded-md border border-border p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-racing">
                        {equipmentNames[reservation.equipment_id]}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-black">
                        {reservation.vehicle}
                      </h3>
                      <p className="mt-1 text-xs text-steel">
                        Demande du {formatDate(reservation.created_at)}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-4 text-sm">{reservation.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {reservation.workshop_reservation_slots.map((slot) => (
                      <span
                        key={slot.slot_start}
                        className="rounded-full bg-smoke px-3 py-1 text-xs"
                      >
                        {formatDate(slot.slot_start, true)}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-md border border-border bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-black">Mes demandes de devis</h2>
            <Link to="/devis" className="text-sm font-bold text-racing">
              Nouvelle demande →
            </Link>
          </div>
          <div className="mt-6 grid gap-4">
            {!loading && quotes.length === 0 && (
              <p className="rounded-md bg-smoke p-5 text-sm text-steel">
                Aucun devis trouvé pour cette adresse e-mail.
              </p>
            )}
            {quotes.map((quote) => {
              const status = quoteStatus(quote.status);
              return (
                <article key={quote.id} className="rounded-md border border-border p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-racing">
                        {quote.registration_plate} · {quote.intervention_type}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-black">
                        {quote.vehicle_make} {quote.vehicle_model}
                      </h3>
                      <p className="mt-1 text-xs text-steel">
                        Envoyée le {formatDate(quote.created_at)}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-4 text-sm">{quote.description}</p>
                  {(quote.admin_response || quote.quoted_amount !== null) && (
                    <div className="mt-5 rounded-md border border-green-200 bg-green-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-green-800">
                        Réponse du garage
                      </p>
                      {quote.quoted_amount !== null && (
                        <p className="mt-2 font-display text-3xl font-black">
                          {Number(quote.quoted_amount).toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </p>
                      )}
                      {quote.admin_response && (
                        <p className="mt-3 text-sm">{quote.admin_response}</p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
