import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return { needsAuth: true as const, details: null };
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return { needsAuth: false as const, details: data };
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md p-8">
      <p>Impossible de charger cette demande d'autorisation : {String((error as Error)?.message ?? error)}</p>
    </main>
  ),
});

function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message);
    else onSignedIn();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-xl font-bold">Connexion requise</h1>
      <p className="text-sm text-muted-foreground">
        Connectez-vous à votre compte CAO57 pour autoriser cette application.
      </p>
      <input
        className="w-full rounded border px-3 py-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full rounded border px-3 py-2"
        type="password"
        placeholder="Mot de passe"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button className="w-full rounded bg-primary px-4 py-2 text-primary-foreground" disabled={busy}>
        Se connecter
      </button>
    </form>
  );
}

function Consent() {
  const loaded = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const router = Route.useRouteContext ? undefined : undefined;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loaded.needsAuth) {
    return (
      <main className="mx-auto max-w-md p-8">
        <SignIn onSignedIn={() => window.location.reload()} />
      </main>
    );
  }

  const details = loaded.details;

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Aucune redirection renvoyée par le serveur d'autorisation.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-8">
      <h1 className="text-xl font-bold">
        Connecter {details?.client?.name ?? "une application"} à votre compte
      </h1>
      <p className="text-sm text-muted-foreground">
        Cette application pourra utiliser les outils CAO57 en votre nom.
      </p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-3">
        <button
          className="rounded bg-primary px-4 py-2 text-primary-foreground"
          disabled={busy}
          onClick={() => decide(true)}
        >
          Autoriser
        </button>
        <button className="rounded border px-4 py-2" disabled={busy} onClick={() => decide(false)}>
          Refuser
        </button>
      </div>
    </main>
  );
}
