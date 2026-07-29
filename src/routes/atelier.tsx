import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import logoAsset from "@/assets/cao57-logo-v4.png.asset.json";
import { createWorkshopReservation, getWorkshopAvailability } from "@/lib/workshop-reservations";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: "Atelier libre — CAO57 Forbach · Pont, fosse, démonte-pneus à l'heure" },
      {
        name: "description",
        content:
          "Louez un pont élévateur, une fosse mécanique ou un démonte-pneus à l'heure chez CAO57 Forbach. Atelier pro, tarifs clairs, réservation en ligne.",
      },
      { property: "og:title", content: "Atelier libre — CAO57 Forbach" },
      {
        property: "og:description",
        content: "Pont 20€/h, fosse 15€/h, démonte-pneus 15€/h. Réservez votre créneau en ligne.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AtelierPage,
});

/* Photos servies depuis le dossier /public :
   public/atelier/atelier-ponts.jpg  (vue ponts + fosse)
   public/atelier/atelier-espace.jpg (espace de travail) */
const PHOTO_PONTS = "/atelier/atelier-ponts.jpg";
const PHOTO_ESPACE = "/atelier/atelier-espace.jpg";
const GARAGE_WHATSAPP_NUMBER = "33783226379";

type Forfait = { label: string; price: string };

type Equipment = {
  id: string;
  name: string;
  short: string;
  price: string;
  unit: string;
  cap: string;
  includes: string[];
  forfaits?: Forfait[];
};

const equipments: Equipment[] = [
  {
    id: "pont",
    name: "Pont élévateur 2 colonnes",
    short: "Pont 2 colonnes",
    price: "20 €",
    unit: "/ heure",
    cap: "Capacité 3,6 T · éclairage LED · air comprimé intégré",
    includes: ["Air comprimé", "Éclairage LED", "Prises 230V/400V", "Chandelles de sécurité"],
    forfaits: [
      { label: "Demi-journée", price: "60 €" },
      { label: "Journée", price: "120 €" },
    ],
  },
  {
    id: "pneus",
    name: "Démonte-pneus & équilibreuse",
    short: "Démonte-pneus",
    price: "15 €",
    unit: "/ heure",
    cap: "Jusqu'à 22\" · machine et équilibreuse pro",
    includes: ["Démonte-pneus auto", "Équilibreuse", "Masses adhésives", "Valves standard"],
  },
  {
    id: "fosse",
    name: "Fosse mécanique",
    short: "Fosse",
    price: "15 €",
    unit: "/ heure",
    cap: "Fosse éclairée · outillage à disposition",
    includes: ["Éclairage intégré", "Outillage standard", "Bac de vidange", "Air comprimé"],
  },
  {
    id: "presse",
    name: "Presse hydraulique 45 T",
    short: "Presse 45 T",
    price: "10 €",
    unit: "/ utilisation",
    cap: "Roulements, silent-blocs, rotules — sur créneau court",
    includes: ["Cales & mandrins", "Assistance ponctuelle"],
  },
];

const hours = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // lundi = 0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDay(d: Date) {
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function slotDate(date: Date, hour: string) {
  const result = new Date(date);
  const [hoursValue, minutesValue] = hour.split(":").map(Number);
  result.setHours(hoursValue, minutesValue, 0, 0);
  return result;
}

type PickedSlot = {
  timestamp: number;
  iso: string;
  label: string;
};

function calculateSelectionPrice(equipmentId: string, selectedSlots: PickedSlot[]) {
  if (selectedSlots.length === 0) return 0;

  const hourlyPrices: Record<string, number> = {
    pneus: 15,
    fosse: 15,
    presse: 10,
  };

  if (equipmentId !== "pont") {
    return (hourlyPrices[equipmentId] ?? 0) * selectedSlots.length;
  }

  const slotsByDay = new Map<string, Set<number>>();
  selectedSlots.forEach((slot) => {
    const date = new Date(slot.timestamp);
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const dayHours = slotsByDay.get(dayKey) ?? new Set<number>();
    dayHours.add(date.getHours());
    slotsByDay.set(dayKey, dayHours);
  });

  const morningHours = [8, 9, 10, 11];
  const afternoonHours = [14, 15, 16, 17];

  return Array.from(slotsByDay.values()).reduce((total, selectedHours) => {
    const fullMorning = morningHours.every((hour) => selectedHours.has(hour));
    const fullAfternoon = afternoonHours.every((hour) => selectedHours.has(hour));

    if (fullMorning && fullAfternoon) return total + 120;

    let dayTotal = total;
    const forfaitHours = new Set<number>();

    if (fullMorning) {
      dayTotal += 60;
      morningHours.forEach((hour) => forfaitHours.add(hour));
    }

    if (fullAfternoon) {
      dayTotal += 60;
      afternoonHours.forEach((hour) => forfaitHours.add(hour));
    }

    const remainingHours = Array.from(selectedHours).filter((hour) => !forfaitHours.has(hour));
    return dayTotal + remainingHours.length * 20;
  }, 0);
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function AtelierPage() {
  const [selectedEquip, setSelectedEquip] = useState<string>(equipments[0].id);
  const [weekOffset, setWeekOffset] = useState(0);
  const [picks, setPicks] = useState<PickedSlot[]>([]);
  const [availability, setAvailability] = useState<Map<number, "pending" | "confirmed">>(new Map());
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [requestAccepted, setRequestAccepted] = useState(false);
  const [requestWhatsappUrl, setRequestWhatsappUrl] = useState("");

  const weekStart = useMemo(() => {
    const d = startOfWeek(new Date());
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const days = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const current = equipments.find((e) => e.id === selectedEquip)!;
  const selectionPrice = useMemo(
    () => calculateSelectionPrice(selectedEquip, picks),
    [selectedEquip, picks],
  );

  useEffect(() => {
    let active = true;
    const from = new Date(weekStart);
    const to = new Date(weekStart);
    to.setDate(to.getDate() + 7);

    setCalendarLoading(true);
    setCalendarError("");
    getWorkshopAvailability({
      data: {
        equipmentId: selectedEquip as "pont" | "pneus" | "fosse" | "presse",
        from: from.toISOString(),
        to: to.toISOString(),
      },
    })
      .then((slots: { startsAt: string; status: "pending" | "confirmed" }[]) => {
        if (!active) return;
        setAvailability(
          new Map(slots.map((slot) => [new Date(slot.startsAt).getTime(), slot.status])),
        );
      })
      .catch(() => {
        if (!active) return;
        setCalendarError("Impossible de charger les réservations. Réessayez dans un instant.");
      })
      .finally(() => {
        if (active) setCalendarLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedEquip, weekStart]);

  const selectEquipment = (equipmentId: string) => {
    setSelectedEquip(equipmentId);
    setPicks([]);
    setFormError("");
  };

  const toggleSlot = (date: Date, hour: string) => {
    const value = slotDate(date, hour);
    const timestamp = value.getTime();
    if (availability.has(timestamp) || value < new Date()) return;

    setPicks((currentPicks) => {
      if (currentPicks.some((slot) => slot.timestamp === timestamp)) {
        return currentPicks.filter((slot) => slot.timestamp !== timestamp);
      }
      return [
        ...currentPicks,
        {
          timestamp,
          iso: value.toISOString(),
          label: value.toLocaleString("fr-FR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ].sort((a, b) => a.timestamp - b.timestamp);
    });
  };

  const submitReservation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (picks.length === 0) {
      setFormError("Sélectionnez au moins un créneau dans l’agenda.");
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSubmitting(true);
    setRequestWhatsappUrl("");
    try {
      await createWorkshopReservation({
        data: {
          equipmentId: selectedEquip as "pont" | "pneus" | "fosse" | "presse",
          customerName: String(form.get("customerName") ?? ""),
          customerEmail: String(form.get("customerEmail") ?? ""),
          customerPhone: String(form.get("customerPhone") ?? ""),
          vehicle: String(form.get("vehicle") ?? ""),
          description: String(form.get("description") ?? ""),
          slots: picks.map((slot) => slot.iso),
        },
      });
      const whatsappMessage = [
        "Bonjour, une nouvelle demande de réservation vient d’être enregistrée sur le site CAO57.",
        "",
        `Client : ${String(form.get("customerName") ?? "")}`,
        `Téléphone : ${String(form.get("customerPhone") ?? "")}`,
        `E-mail : ${String(form.get("customerEmail") ?? "")}`,
        `Véhicule : ${String(form.get("vehicle") ?? "")}`,
        `Équipement : ${current.name}`,
        `Tarif indicatif : ${formatPrice(selectionPrice)}`,
        "",
        "Créneaux demandés :",
        ...picks.map((slot) => `• ${slot.label}`),
        "",
        `Intervention prévue : ${String(form.get("description") ?? "")}`,
      ].join("\n");

      setRequestWhatsappUrl(
        `https://wa.me/${GARAGE_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`,
      );
      formElement.reset();
      setPicks([]);
      setRequestAccepted(true);

      const from = new Date(weekStart);
      const to = new Date(weekStart);
      to.setDate(to.getDate() + 7);
      const slots = await getWorkshopAvailability({
        data: {
          equipmentId: selectedEquip as "pont" | "pneus" | "fosse" | "presse",
          from: from.toISOString(),
          to: to.toISOString(),
        },
      });
      setAvailability(
        new Map(
          (slots as { startsAt: string; status: "pending" | "confirmed" }[]).map((slot) => [
            new Date(slot.startsAt).getTime(),
            slot.status,
          ]),
        ),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "La demande n’a pas pu être envoyée.";

      if (message.includes("créneaux vient d’être demandé")) {
        try {
          const from = new Date(weekStart);
          const to = new Date(weekStart);
          to.setDate(to.getDate() + 7);
          const refreshedSlots = (await getWorkshopAvailability({
            data: {
              equipmentId: selectedEquip as "pont" | "pneus" | "fosse" | "presse",
              from: from.toISOString(),
              to: to.toISOString(),
            },
          })) as { startsAt: string; status: "pending" | "confirmed" }[];

          const refreshedAvailability = new Map(
            refreshedSlots.map((slot) => [new Date(slot.startsAt).getTime(), slot.status] as const),
          );
          setAvailability(refreshedAvailability);
          setPicks((currentPicks) =>
            currentPicks.filter((slot) => !refreshedAvailability.has(slot.timestamp)),
          );
          setFormError(
            "L’agenda a été actualisé : les créneaux devenus indisponibles ont été retirés. Vérifiez votre sélection puis réessayez.",
          );
        } catch {
          setFormError(
            "Un créneau n’est plus disponible. Actualisez la page puis choisissez un autre horaire.",
          );
        }
      } else {
        setFormError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header simple */}
      {/* Top utility bar */}
      <div className="bg-carbon text-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[11px]">
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">📍 2 Allée des Cyprès · 57600 Forbach</span>
            <span className="hidden md:inline">Ouvert lun. — sam. · 08h → 19h</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+33620431191" className="hover:text-white">
              ☏ 06 20 43 11 91
            </a>
            <a href="/#compte" className="hidden sm:inline hover:text-white">
              Mon compte
            </a>
          </div>
        </div>
      </div>

      {/* Sticky main nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center">
            <img
              src={logoAsset.url}
              alt="CAO57 — Centre Auto Occasion 57"
              className="w-auto"
              style={{ height: "4.5rem" }}
            />
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-ink md:flex">
            <Link to="/reparations" className="hover:text-racing">
              Réparations
            </Link>
            <Link to="/occasions" className="hover:text-racing">
              Occasions
            </Link>
            <Link to="/atelier" className="text-racing">
              Atelier libre
            </Link>
            <a href="/#contact" className="hover:text-racing">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#reserver"
              className="inline-flex items-center gap-2 rounded-sm bg-racing px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90"
            >
              Prendre RDV
            </a>
          </div>
        </div>
      </header>

      {/* Hero cinématique avec photo réelle de l'atelier */}
      <section className="relative overflow-hidden bg-carbon text-white">
        <img
          src={PHOTO_PONTS}
          alt="Atelier CAO57 — ponts élévateurs et fosse mécanique à Forbach"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/80 to-carbon/30" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-carbon to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4 !text-white/70">
              <span className="mr-3 inline-block h-[2px] w-8 translate-y-[-4px] bg-racing align-middle" />
              Self-garage · Forbach (57)
            </div>
            <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Louez notre atelier
              <br />
              <span className="text-racing">à l'heure.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
              Pont élévateur, fosse mécanique, démonte-pneus et outillage pro à disposition. Vous
              faites le boulot, on met le matériel et l'espace. Économisez jusqu'à 70 % vs un garage
              classique.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#reserver"
                className="inline-flex items-center gap-2 rounded-sm bg-racing px-7 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90"
              >
                Réserver un créneau →
              </a>
              <a
                href="#tarifs"
                className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-7 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-carbon"
              >
                Voir les tarifs
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-[13px] text-white/80">
              <span>✓ Air comprimé & électricité inclus</span>
              <span>✓ Outillage pro à disposition</span>
              <span>✓ Mécanicien sur place</span>
              <span>✓ Café offert</span>
            </div>
          </div>
        </div>
      </section>

      {/* Immersion — les deux photos qui donnent envie */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3">L'atelier</div>
            <h2 className="font-display text-4xl font-black leading-[1.05] tracking-tight lg:text-5xl">
              Un vrai atelier pro,
              <br />
              rien que pour vous.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel">
              Espace propre, bien éclairé, équipé comme un garage professionnel. Vous travaillez
              dans de bonnes conditions, avec le bon matériel sous la main.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Grande photo : ponts + fosse */}
            <figure className="group relative overflow-hidden rounded-md border border-border">
              <img
                src={PHOTO_PONTS}
                alt="Ponts élévateurs 2 colonnes et fosse mécanique de l'atelier CAO57"
                className="h-full min-h-[320px] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon/90 to-transparent p-6">
                <div className="font-display text-lg font-bold text-white">
                  Ponts 2 colonnes & fosse mécanique
                </div>
                <p className="mt-1 text-sm text-white/75">
                  Levage 3,6 T, éclairage LED, air comprimé et outillage à portée de main.
                </p>
              </figcaption>
            </figure>

            {/* Photo portrait : espace de travail */}
            <figure className="group relative overflow-hidden rounded-md border border-border">
              <img
                src={PHOTO_ESPACE}
                alt="Espace de travail équipé de l'atelier CAO57 avec établi et démonte-pneus"
                className="h-full min-h-[320px] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon/90 to-transparent p-6">
                <div className="font-display text-lg font-bold text-white">
                  Espace équipé & propre
                </div>
                <p className="mt-1 text-sm text-white/75">
                  Établi, servante d'outils, démonte-pneus : tout est là.
                </p>
              </figcaption>
            </figure>
          </div>

          {/* Bandeau points forts */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Matériel pro", d: "Ponts, fosse, démonte-pneus, presse 45 T." },
              { t: "Espace éclairé", d: "Sol propre, LED, prises 230V / 400V." },
              { t: "Conseil sur place", d: "Un mécanicien vous donne un coup de main." },
              { t: "Prix affichés", d: "Pas de surprise, vous payez à l'heure." },
            ].map((x) => (
              <div key={x.t} className="rounded-md border border-border bg-white p-5">
                <div className="font-display text-base font-bold">{x.t}</div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-steel">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok — immersion vidéo */}
      <section className="relative overflow-hidden border-b border-border bg-carbon text-white">
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">
              <span className="relative grid size-5 place-items-center font-black">
                <span className="absolute translate-x-[-1px] text-cyan-300">♪</span>
                <span className="absolute translate-x-[1px] text-pink-400">♪</span>
                <span className="relative">♪</span>
              </span>
              Sur TikTok
            </div>

            <h2 className="font-display text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
              Retrouvez-nous
              <br />
              <span className="text-racing">sur TikTok.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
              Découvrez l&apos;atelier en vidéo, le matériel disponible et les retours de ceux qui
              ont déjà loué leur pont chez CAO57.
            </p>

            <div className="mt-7 space-y-3 text-sm text-white/80">
              <p className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-white/10 text-racing">
                  ✓
                </span>
                Visites et coulisses de l&apos;atelier
              </p>
              <p className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-white/10 text-racing">
                  ✓
                </span>
                Conseils et démonstrations du matériel
              </p>
              <p className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-white/10 text-racing">
                  ✓
                </span>
                Retours d&apos;expérience de nos clients
              </p>
            </div>

            <a
              href="https://www.tiktok.com/@jeremy.preiss"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-sm bg-white px-6 py-3.5 text-[12px] font-black uppercase tracking-wider text-carbon transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Suivre @jeremy.preiss
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <article className="group relative mx-auto w-full max-w-[330px] overflow-hidden rounded-[1.5rem] border border-white/15 bg-black p-2 shadow-2xl">
              <div className="absolute left-1/2 top-4 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/70" />
              <video
                controls
                playsInline
                preload="metadata"
                poster="/atelier/tiktok-visite-atelier.jpg"
                className="aspect-[9/16] w-full rounded-[1.1rem] bg-black object-cover"
                aria-label="Visite vidéo de l'atelier libre CAO57"
              >
                <source src="/atelier/tiktok-visite-atelier.mp4" type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
              <div className="pointer-events-none absolute inset-x-2 bottom-2 rounded-b-[1.1rem] bg-gradient-to-t from-black/90 via-black/30 to-transparent px-4 pb-12 pt-20">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                  Dans les coulisses
                </div>
                <h3 className="mt-1 font-display text-lg font-black text-white">
                  Visite de l&apos;atelier
                </h3>
              </div>
            </article>

            <article className="group relative mx-auto w-full max-w-[330px] overflow-hidden rounded-[1.5rem] border border-white/15 bg-black p-2 shadow-2xl sm:translate-y-10">
              <div className="absolute left-1/2 top-4 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/70" />
              <video
                controls
                playsInline
                preload="metadata"
                poster="/atelier/tiktok-retour-client.jpg"
                className="aspect-[9/16] w-full rounded-[1.1rem] bg-black object-cover"
                aria-label="Retour d'un client après la location d'un pont CAO57"
              >
                <source src="/atelier/tiktok-retour-client.mp4" type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
              <div className="pointer-events-none absolute inset-x-2 bottom-2 rounded-b-[1.1rem] bg-gradient-to-t from-black/90 via-black/30 to-transparent px-4 pb-12 pt-20">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                  Ils ont testé
                </div>
                <h3 className="mt-1 font-display text-lg font-black text-white">Retour client</h3>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="border-b border-border bg-smoke">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3">Tarifs</div>
            <h2 className="font-display text-4xl font-black leading-[1.05] tracking-tight lg:text-5xl">
              Nos équipements à l'heure
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel">
              Cliquez sur un équipement pour voir ses disponibilités et réserver votre créneau.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {equipments.map((e) => {
              const active = e.id === selectedEquip;
              return (
                <button
                  key={e.id}
                  onClick={() => selectEquipment(e.id)}
                  className={`group relative overflow-hidden rounded-md border p-6 text-left transition ${
                    active
                      ? "border-ink bg-carbon text-white shadow-lg"
                      : "border-border bg-white hover:border-ink hover:shadow-md"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-3xl font-black text-racing">{e.price}</span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${active ? "text-white/60" : "text-steel"}`}
                    >
                      {e.unit}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold leading-tight">{e.name}</h3>
                  <p
                    className={`mt-2 text-[13px] leading-relaxed ${active ? "text-white/70" : "text-steel"}`}
                  >
                    {e.cap}
                  </p>
                  {e.forfaits && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {e.forfaits.map((f) => (
                        <span
                          key={f.label}
                          className={`rounded-sm border px-2 py-1 text-[11px] font-semibold ${
                            active
                              ? "border-white/25 bg-white/10 text-white"
                              : "border-border bg-smoke text-ink"
                          }`}
                        >
                          {f.label} · <span className="text-racing">{f.price}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  <p
                    className={`mt-4 text-[11px] font-semibold uppercase tracking-wider ${active ? "text-racing" : "text-steel"}`}
                  >
                    {active ? "▸ Sélectionné" : "Voir disponibilités"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calendrier */}
      <section id="calendrier" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-steel">
                Disponibilités
              </p>
              <h2 className="mt-2 font-display text-3xl font-black">{current.short}</h2>
              <p className="mt-2 text-sm text-steel">
                Semaine du{" "}
                <strong className="text-ink">
                  {weekStart.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                disabled={weekOffset === 0}
                className="rounded-sm border border-border bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-wider hover:border-ink disabled:opacity-40"
              >
                ← Semaine précédente
              </button>
              <button
                onClick={() => setWeekOffset(0)}
                className="rounded-sm border border-border bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-wider hover:border-ink"
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setWeekOffset((w) => w + 1)}
                className="rounded-sm border border-border bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-wider hover:border-ink"
              >
                Semaine suivante →
              </button>
            </div>
          </div>

          {/* Légende */}
          <div className="mt-6 flex flex-wrap gap-4 text-[12px]">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-3 rounded-sm border border-border bg-white" />{" "}
              Libre
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-3 rounded-sm bg-racing" /> Sélectionné
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-3 rounded-sm bg-amber-400" /> En attente
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-3 rounded-sm bg-steel/50" /> Occupé
            </span>
          </div>

          {calendarError && (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {calendarError}
            </div>
          )}

          {/* Grille */}
          <div className="mt-6 overflow-x-auto rounded-md border border-border bg-white">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-24 border-b border-r border-border bg-smoke p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-steel">
                    Horaire
                  </th>
                  {days.map((d, i) => (
                    <th
                      key={i}
                      className="border-b border-r border-border bg-smoke p-3 text-center text-[11px] font-semibold uppercase tracking-wider text-steel last:border-r-0"
                    >
                      {formatDay(d)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((h) => (
                  <tr key={h}>
                    <td className="border-b border-r border-border p-3 font-mono text-[12px] font-semibold text-ink">
                      {h}
                    </td>
                    {days.map((day, i) => {
                      const timestamp = slotDate(day, h).getTime();
                      const slotStatus = availability.get(timestamp);
                      const inPast = timestamp < Date.now();
                      const unavailable = Boolean(slotStatus) || inPast;
                      const selected = picks.some((slot) => slot.timestamp === timestamp);
                      return (
                        <td
                          key={i}
                          className="border-b border-r border-border p-1.5 last:border-r-0"
                        >
                          <button
                            disabled={unavailable || calendarLoading || Boolean(calendarError)}
                            onClick={() => toggleSlot(day, h)}
                            className={`h-10 w-full rounded-sm text-[11px] font-semibold uppercase tracking-wider transition ${
                              slotStatus === "pending"
                                ? "cursor-not-allowed bg-amber-400 text-amber-950"
                                : slotStatus === "confirmed" || inPast
                                  ? "cursor-not-allowed bg-steel/25 text-white/70"
                                  : selected
                                    ? "bg-racing text-white shadow"
                                    : "bg-white text-ink hover:bg-racing/10 hover:text-racing border border-border"
                            }`}
                          >
                            {calendarLoading
                              ? "…"
                              : slotStatus === "pending"
                                ? "En attente"
                                : slotStatus === "confirmed" || inPast
                                  ? "Occupé"
                                  : selected
                                    ? "Choisi"
                                    : "Libre"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Résumé sélection */}
          <div className="mt-6 grid gap-4 rounded-md border border-border bg-white p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-steel">
                Votre sélection
              </p>
              <p className="mt-2 font-display text-lg font-bold">
                {current.name}
                {picks.length > 0 ? (
                  <span className="text-racing">
                    {" "}
                    · {picks.length} créneau{picks.length > 1 ? "x" : ""}
                  </span>
                ) : (
                  <span className="text-steel"> — choisissez un ou plusieurs créneaux</span>
                )}
              </p>
              {picks.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {picks.map((slot) => (
                    <li
                      key={slot.timestamp}
                      className="rounded-full bg-racing/10 px-3 py-1 text-xs font-semibold text-racing"
                    >
                      {slot.label}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-sm text-steel">
                {picks.length > 0 ? (
                  <>
                    Tarif calculé :{" "}
                    <strong className="text-xl text-racing">{formatPrice(selectionPrice)}</strong>
                  </>
                ) : (
                  <>
                    Tarif : <strong className="text-ink">{current.price}</strong> {current.unit}
                  </>
                )}
              </p>
            </div>
            <a
              href="#reserver"
              className={`rounded-sm px-6 py-3 text-center text-[12px] font-bold uppercase tracking-wider transition ${
                picks.length > 0
                  ? "bg-racing text-white hover:bg-racing/90"
                  : "cursor-not-allowed bg-steel/30 text-white/70"
              }`}
              aria-disabled={picks.length === 0}
              onClick={(e) => {
                if (picks.length === 0) e.preventDefault();
              }}
            >
              Continuer la demande →
            </a>
          </div>
        </div>
      </section>

      {/* Inclus */}
      <section className="border-b border-border bg-smoke">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-steel">
            Inclus avec {current.short.toLowerCase()}
          </p>
          <h2 className="mt-2 font-display text-3xl font-black">Ce que vous trouvez sur place</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {current.includes.map((it) => (
              <li key={it} className="rounded-md border border-border bg-white p-4 text-sm">
                <span className="mr-2 text-racing">✓</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Formulaire réservation */}
      <section id="reserver" className="border-b border-border bg-carbon text-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-racing">
            Réservation atelier
          </p>
          <h2 className="mt-2 font-display text-3xl font-black">Envoyez votre demande</h2>
          <p className="mt-3 text-white/70">
            Les créneaux restent en attente jusqu’à la validation du garage. Vous recevrez ensuite
            la confirmation par e-mail.
          </p>
          <div className="mt-6 rounded-md border border-white/15 bg-white/5 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Votre sélection
            </div>
            <div className="mt-2 font-display text-lg font-bold">{current.name}</div>
            {picks.length > 0 ? (
              <>
                <ul className="mt-3 space-y-1.5 text-sm text-white/75">
                  {picks.map((slot) => (
                    <li key={slot.timestamp}>✓ {slot.label}</li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-white/15 pt-4">
                  <span className="text-sm text-white/60">Tarif calculé</span>
                  <strong className="ml-3 font-display text-2xl text-racing">
                    {formatPrice(selectionPrice)}
                  </strong>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-amber-300">
                Aucun créneau sélectionné dans l’agenda.
              </p>
            )}
          </div>

          <form onSubmit={submitReservation} className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Nom complet
              </span>
              <input
                required
                name="customerName"
                type="text"
                autoComplete="name"
                placeholder="Prénom Nom"
                className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/40"
              />
            </label>
            <label className="text-sm">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Téléphone
              </span>
              <input
                required
                name="customerPhone"
                type="tel"
                autoComplete="tel"
                placeholder="06 XX XX XX XX"
                className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/40"
              />
            </label>
            <label className="text-sm">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                E-mail
              </span>
              <input
                required
                name="customerEmail"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.fr"
                className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/40"
              />
            </label>
            <label className="text-sm">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Véhicule
              </span>
              <input
                required
                name="vehicle"
                type="text"
                placeholder="Ex : Golf VII 1.6 TDI"
                className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/40"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Intervention prévue
              </span>
              <textarea
                required
                name="description"
                rows={4}
                placeholder="Décrivez précisément les travaux prévus et votre besoin éventuel d’assistance…"
                className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/40"
              />
            </label>
            {formError && (
              <div className="sm:col-span-2 rounded-md border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
                {formError}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting || picks.length === 0}
              className="sm:col-span-2 rounded-sm bg-racing px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Envoi en cours…" : "Valider ma demande →"}
            </button>
          </form>
        </div>
      </section>

      {requestAccepted && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/65 px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-success-title"
        >
          <div className="w-full max-w-lg rounded-md bg-white p-8 text-center text-ink shadow-2xl sm:p-10">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
              ✓
            </div>
            <h2 id="request-success-title" className="mt-5 font-display text-3xl font-black">
              Demande prise en compte
            </h2>
            <p className="mt-3 leading-relaxed text-steel">
              Votre demande a bien été transmise au garage. Elle vous sera confirmée au plus vite
              par e-mail.
            </p>
            <p className="mt-3 text-sm text-steel">
              Les créneaux sélectionnés apparaissent temporairement « En attente » dans l’agenda.
            </p>
            {requestWhatsappUrl && (
              <a
                href={requestWhatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center rounded-sm bg-[#25D366] px-7 py-3 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-[#20bd5a]"
              >
                Envoyer la demande sur WhatsApp
              </a>
            )}
            <button
              type="button"
              onClick={() => setRequestAccepted(false)}
              className="mt-3 rounded-sm border border-border px-7 py-3 text-[12px] font-bold uppercase tracking-wider text-ink hover:bg-smoke"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-xs text-steel">
          CAO57 · Centre Auto Occasion 57 · Forbach
        </div>
      </footer>
    </div>
  );
}
