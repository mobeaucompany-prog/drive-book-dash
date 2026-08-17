import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  adminDecideWorkshopReservation,
  createWorkshopBlock,
  deleteWorkshopBlock,
  getWorkshopAdminDashboard,
} from "@/lib/workshop-reservations";

export const Route = createFileRoute("/admin/atelier")({
  head: () => ({
    meta: [
      { title: "Administration atelier — CAO57" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: WorkshopAdminPage,
});

type EquipmentId = "pont" | "pneus" | "fosse" | "presse";

type AdminReservation = {
  id: string;
  equipment_id: EquipmentId;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle: string;
  description: string;
  status: "pending" | "confirmed" | "rejected" | "expired";
  created_at: string;
  decided_at: string | null;
  workshop_reservation_slots: { slot_start: string; status: string }[];
};

type AdminBlock = {
  id: string;
  equipment_id: EquipmentId;
  slot_start: string;
  blocked_reason: string;
  block_group_id: string;
  created_at: string;
};

const equipmentNames: Record<EquipmentId, string> = {
  pont: "Pont 2 colonnes",
  pneus: "Démonte-pneus",
  fosse: "Fosse mécanique",
  presse: "Presse 45 T",
};

const hours = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function slotDate(date: Date, hour: string) {
  const result = new Date(date);
  const [hoursValue, minutesValue] = hour.split(":").map(Number);
  result.setHours(hoursValue, minutesValue, 0, 0);
  return result;
}

function formatSlot(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status: AdminReservation["status"]) {
  if (status === "pending") return "En attente";
  if (status === "confirmed") return "Confirmée";
  if (status === "rejected") return "Refusée";
  return "Expirée";
}

function WorkshopAdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginSent, setLoginSent] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [blocks, setBlocks] = useState<AdminBlock[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [equipmentId, setEquipmentId] = useState<EquipmentId>("pont");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [blockReason, setBlockReason] = useState("");
  const [blockMessage, setBlockMessage] = useState("");

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadDashboard = useCallback(async (silent = false) => {
    if (!silent) setDashboardLoading(true);
    try {
      const data = (await getWorkshopAdminDashboard()) as {
        reservations: AdminReservation[];
        blocks: AdminBlock[];
      };
      setReservations(data.reservations);
      setBlocks(data.blocks);
      setDashboardError("");
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : "Impossible de charger l’administration.",
      );
    } finally {
      if (!silent) setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    void loadDashboard();

    const intervalId = window.setInterval(() => {
      void loadDashboard(true);
    }, 15_000);

    const onFocus = () => void loadDashboard(true);
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadDashboard, session]);

  const weekStart = useMemo(() => {
    const result = startOfWeek(new Date());
    result.setDate(result.getDate() + weekOffset * 7);
    return result;
  }, [weekOffset]);

  const days = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + index);
        return date;
      }),
    [weekStart],
  );

  const occupiedSlots = useMemo(() => {
    const occupied = new Set<string>();
    reservations
      .filter((reservation) => ["pending", "confirmed"].includes(reservation.status))
      .filter((reservation) => reservation.equipment_id === equipmentId)
      .forEach((reservation) => {
        reservation.workshop_reservation_slots.forEach((slot) => occupied.add(slot.slot_start));
      });
    blocks
      .filter((block) => block.equipment_id === equipmentId)
      .forEach((block) => occupied.add(block.slot_start));
    return occupied;
  }, [blocks, equipmentId, reservations]);

  const groupedBlocks = useMemo(() => {
    const groups = new Map<string, AdminBlock[]>();
    blocks.forEach((block) => {
      const group = groups.get(block.block_group_id) ?? [];
      group.push(block);
      groups.set(block.block_group_id, group);
    });
    return Array.from(groups.entries()).sort(
      (a, b) => new Date(a[1][0].slot_start).getTime() - new Date(b[1][0].slot_start).getTime(),
    );
  }, [blocks]);

  const pendingReservations = reservations.filter(
    (reservation) => reservation.status === "pending",
  );
  const processedReservations = reservations.filter(
    (reservation) => reservation.status !== "pending",
  );

  const sendLoginLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/atelier`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setLoginError("Le lien de connexion n’a pas pu être envoyé.");
      return;
    }
    setLoginSent(true);
  };

  const decide = async (reservationId: string, decision: "confirm" | "reject") => {
    setBusyId(reservationId);
    setDashboardError("");
    try {
      await adminDecideWorkshopReservation({ data: { reservationId, decision } });
      await loadDashboard(true);
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : "La demande n’a pas pu être traitée.",
      );
    } finally {
      setBusyId("");
    }
  };

  const toggleBlockSlot = (date: Date, hour: string) => {
    const slot = slotDate(date, hour);
    const iso = slot.toISOString();
    if (slot < new Date() || occupiedSlots.has(iso)) return;
    setSelectedSlots((current) =>
      current.includes(iso) ? current.filter((value) => value !== iso) : [...current, iso].sort(),
    );
  };

  const saveBlock = async () => {
    setBlockMessage("");
    if (!blockReason.trim() || selectedSlots.length === 0) {
      setBlockMessage("Choisissez au moins un créneau et indiquez un motif.");
      return;
    }

    setBusyId("new-block");
    try {
      await createWorkshopBlock({
        data: {
          equipmentId,
          reason: blockReason,
          slots: selectedSlots,
        },
      });
      setSelectedSlots([]);
      setBlockReason("");
      setBlockMessage("Créneaux bloqués avec succès.");
      await loadDashboard(true);
    } catch (error) {
      setBlockMessage(error instanceof Error ? error.message : "Le blocage a échoué.");
    } finally {
      setBusyId("");
    }
  };

  const removeBlock = async (blockGroupId: string) => {
    setBusyId(blockGroupId);
    try {
      await deleteWorkshopBlock({ data: { blockGroupId } });
      await loadDashboard(true);
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : "Le déblocage a échoué.");
    } finally {
      setBusyId("");
    }
  };

  if (authLoading) {
    return <div className="grid min-h-screen place-items-center bg-smoke">Chargement…</div>;
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-smoke px-6">
        <section className="w-full max-w-md rounded-md border border-border bg-white p-8 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-racing">
            CAO57 · Administration
          </p>
          <h1 className="mt-3 font-display text-3xl font-black">Gestion de l’atelier</h1>
          <p className="mt-3 text-sm leading-relaxed text-steel">
            Saisissez l’adresse e-mail administrateur. Un lien sécurisé à usage unique sera envoyé
            par Supabase.
          </p>
          {loginSent ? (
            <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Lien envoyé. Consultez votre boîte e-mail puis revenez sur cette page.
            </div>
          ) : (
            <form onSubmit={sendLoginLink} className="mt-6 space-y-4">
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                placeholder="adresse@garage.fr"
                className="w-full rounded-sm border border-border px-4 py-3"
              />
              {loginError && <p className="text-sm text-red-600">{loginError}</p>}
              <button className="w-full rounded-sm bg-racing px-5 py-3 text-sm font-bold uppercase tracking-wider text-white">
                Recevoir mon lien de connexion
              </button>
            </form>
          )}
          <Link to="/atelier" className="mt-6 inline-block text-sm font-semibold text-racing">
            ← Retour à l’agenda client
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-smoke text-ink">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-racing">
              CAO57 · Administration
            </p>
            <h1 className="font-display text-2xl font-black">Agenda atelier</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/atelier"
              className="rounded-sm border border-border px-4 py-2 text-xs font-bold"
            >
              Voir l’agenda client
            </Link>
            <button
              onClick={() => void supabase.auth.signOut()}
              className="rounded-sm bg-carbon px-4 py-2 text-xs font-bold text-white"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {dashboardError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {dashboardError}
          </div>
        )}

        <section className="rounded-md border border-border bg-white p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-racing">
                À traiter
              </p>
              <h2 className="mt-2 font-display text-3xl font-black">
                {pendingReservations.length} demande{pendingReservations.length !== 1 ? "s" : ""} en
                attente
              </h2>
            </div>
            <button
              onClick={() => void loadDashboard()}
              disabled={dashboardLoading}
              className="rounded-sm border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider"
            >
              {dashboardLoading ? "Actualisation…" : "Actualiser"}
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            {pendingReservations.length === 0 && (
              <p className="rounded-md bg-smoke p-5 text-sm text-steel">
                Aucune demande en attente.
              </p>
            )}
            {pendingReservations.map((reservation) => (
              <article
                key={reservation.id}
                className="rounded-md border border-amber-200 bg-amber-50/40 p-5"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      {equipmentNames[reservation.equipment_id]} · En attente
                    </p>
                    <h3 className="mt-2 font-display text-xl font-black">
                      {reservation.customer_name} — {reservation.vehicle}
                    </h3>
                    <p className="mt-2 text-sm text-steel">
                      <a
                        href={`tel:${reservation.customer_phone}`}
                        className="font-semibold text-ink"
                      >
                        {reservation.customer_phone}
                      </a>
                      {" · "}
                      <a
                        href={`mailto:${reservation.customer_email}`}
                        className="font-semibold text-ink"
                      >
                        {reservation.customer_email}
                      </a>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={busyId === reservation.id}
                      onClick={() => void decide(reservation.id, "confirm")}
                      className="rounded-sm bg-racing px-5 py-2 text-xs font-bold uppercase text-white disabled:opacity-50"
                    >
                      Confirmer
                    </button>
                    <button
                      disabled={busyId === reservation.id}
                      onClick={() => void decide(reservation.id, "reject")}
                      className="rounded-sm border border-red-300 bg-white px-5 py-2 text-xs font-bold uppercase text-red-700 disabled:opacity-50"
                    >
                      Refuser
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm">{reservation.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {reservation.workshop_reservation_slots.map((slot) => (
                    <span
                      key={slot.slot_start}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold"
                    >
                      {formatSlot(slot.slot_start)}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-border bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-racing">
            Indisponibilités
          </p>
          <h2 className="mt-2 font-display text-3xl font-black">Bloquer des créneaux</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {(Object.keys(equipmentNames) as EquipmentId[]).map((id) => (
              <button
                key={id}
                onClick={() => {
                  setEquipmentId(id);
                  setSelectedSlots([]);
                }}
                className={`rounded-sm border px-4 py-2 text-xs font-bold ${equipmentId === id ? "border-racing bg-racing text-white" : "border-border"}`}
              >
                {equipmentNames[id]}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold">
              Semaine du {weekStart.toLocaleDateString("fr-FR")}
            </p>
            <div className="flex gap-2">
              <button
                disabled={weekOffset === 0}
                onClick={() => setWeekOffset((value) => Math.max(0, value - 1))}
                className="rounded-sm border border-border px-3 py-2 text-xs disabled:opacity-40"
              >
                ← Précédente
              </button>
              <button
                onClick={() => setWeekOffset((value) => value + 1)}
                className="rounded-sm border border-border px-3 py-2 text-xs"
              >
                Suivante →
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-r border-border bg-smoke p-3 text-left">
                    Horaire
                  </th>
                  {days.map((day) => (
                    <th
                      key={day.toISOString()}
                      className="border-b border-r border-border bg-smoke p-3"
                    >
                      {day.toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour}>
                    <td className="border-b border-r border-border p-3 font-mono">{hour}</td>
                    {days.map((day) => {
                      const date = slotDate(day, hour);
                      const iso = date.toISOString();
                      const occupied = occupiedSlots.has(iso);
                      const selected = selectedSlots.includes(iso);
                      const disabled = occupied || date < new Date();
                      return (
                        <td key={iso} className="border-b border-r border-border p-1.5">
                          <button
                            disabled={disabled}
                            onClick={() => toggleBlockSlot(day, hour)}
                            className={`h-10 w-full rounded-sm text-xs font-bold ${disabled ? "cursor-not-allowed bg-steel/20 text-steel" : selected ? "bg-racing text-white" : "border border-border bg-white hover:bg-racing/10"}`}
                          >
                            {occupied ? "Occupé" : selected ? "À bloquer" : "Libre"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={blockReason}
              onChange={(event) => setBlockReason(event.target.value)}
              placeholder="Motif : fermeture, entretien, réservation téléphonique…"
              className="rounded-sm border border-border px-4 py-3"
            />
            <button
              disabled={busyId === "new-block" || selectedSlots.length === 0}
              onClick={() => void saveBlock()}
              className="rounded-sm bg-carbon px-6 py-3 text-xs font-bold uppercase text-white disabled:opacity-40"
            >
              Bloquer {selectedSlots.length || ""} créneau{selectedSlots.length > 1 ? "x" : ""}
            </button>
          </div>
          {blockMessage && <p className="mt-3 text-sm text-steel">{blockMessage}</p>}
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-white p-6">
            <h2 className="font-display text-2xl font-black">Blocages à venir</h2>
            <div className="mt-5 space-y-3">
              {groupedBlocks.length === 0 && (
                <p className="text-sm text-steel">Aucun blocage manuel.</p>
              )}
              {groupedBlocks.map(([groupId, group]) => (
                <article key={groupId} className="rounded-md border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-racing">
                        {equipmentNames[group[0].equipment_id]}
                      </p>
                      <p className="mt-1 font-semibold">{group[0].blocked_reason}</p>
                    </div>
                    <button
                      disabled={busyId === groupId}
                      onClick={() => void removeBlock(groupId)}
                      className="text-xs font-bold text-red-700"
                    >
                      Débloquer
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.map((block) => (
                      <span key={block.id} className="rounded-full bg-smoke px-3 py-1 text-xs">
                        {formatSlot(block.slot_start)}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-white p-6">
            <h2 className="font-display text-2xl font-black">Demandes récentes</h2>
            <div className="mt-5 space-y-3">
              {processedReservations.slice(0, 30).map((reservation) => (
                <article key={reservation.id} className="rounded-md border border-border p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {reservation.customer_name} · {reservation.vehicle}
                      </p>
                      <p className="mt-1 text-xs text-steel">
                        {equipmentNames[reservation.equipment_id]}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold ${reservation.status === "confirmed" ? "text-green-700" : "text-steel"}`}
                    >
                      {statusLabel(reservation.status)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
