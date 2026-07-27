import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import logoAsset from "@/assets/cao57-logo-v4.png.asset.json";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: "Atelier libre — CAO57 Forbach · Pont, fosse, démonte-pneus à l'heure" },
      { name: "description", content: "Louez un pont élévateur, une fosse mécanique ou un démonte-pneus à l'heure chez CAO57 Forbach. Atelier pro, tarifs clairs, réservation en ligne." },
      { property: "og:title", content: "Atelier libre — CAO57 Forbach" },
      { property: "og:description", content: "Pont 20€/h, fosse 15€/h, démonte-pneus 15€/h. Réservez votre créneau en ligne." },
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

type Equipment = {
  id: string;
  name: string;
  short: string;
  price: string;
  unit: string;
  cap: string;
  includes: string[];
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

// Disponibilité fictive déterministe pour garder l'UI cohérente entre les rendus.
function isBooked(equipId: string, dayIndex: number, hour: string) {
  const seed =
    equipId.charCodeAt(0) * 7 +
    equipId.charCodeAt(1) * 3 +
    dayIndex * 13 +
    parseInt(hour, 10) * 5;
  return seed % 7 < 2; // ~28% des créneaux occupés
}

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

function AtelierPage() {
  const [selectedEquip, setSelectedEquip] = useState<string>(equipments[0].id);
  const [weekOffset, setWeekOffset] = useState(0);
  const [pick, setPick] = useState<{ day: number; hour: string } | null>(null);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header simple */}
      {/* Top utility bar */}
      <div className="bg-carbon text-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[11px]">
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">📍 Forbach · Moselle · 57</span>
            <span className="hidden md:inline">Ouvert lun. — sam. · 08h → 19h</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+33620431191" className="hover:text-white">☏ 06 20 43 11 91</a>
            <a href="/#compte" className="hidden sm:inline hover:text-white">Mon compte</a>
          </div>
        </div>
      </div>

      {/* Sticky main nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center">
            <img src={logoAsset.url} alt="CAO57 — Centre Auto Occasion 57" className="w-auto" style={{ height: "4.5rem" }} />
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-ink md:flex">
            <Link to="/reparations" className="hover:text-racing">Réparations</Link>
            <Link to="/occasions" className="hover:text-racing">Occasions</Link>
            <Link to="/atelier" className="text-racing">Atelier libre</Link>
            <a href="/#contact" className="hover:text-racing">Contact</a>
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
              Pont élévateur, fosse mécanique, démonte-pneus et outillage pro à
              disposition. Vous faites le boulot, on met le matériel et l'espace.
              Économisez jusqu'à 70 % vs un garage classique.
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
              Un vrai atelier pro,<br />rien que pour vous.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel">
              Espace propre, bien éclairé, équipé comme un garage professionnel.
              Vous travaillez dans de bonnes conditions, avec le bon matériel sous la main.
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
                  onClick={() => { setSelectedEquip(e.id); setPick(null); }}
                  className={`group relative overflow-hidden rounded-md border p-6 text-left transition ${
                    active
                      ? "border-ink bg-carbon text-white shadow-lg"
                      : "border-border bg-white hover:border-ink hover:shadow-md"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-3xl font-black text-racing">
                      {e.price}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${active ? "text-white/60" : "text-steel"}`}>
                      {e.unit}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold leading-tight">{e.name}</h3>
                  <p className={`mt-2 text-[13px] leading-relaxed ${active ? "text-white/70" : "text-steel"}`}>
                    {e.cap}
                  </p>
                  <p className={`mt-4 text-[11px] font-semibold uppercase tracking-wider ${active ? "text-racing" : "text-steel"}`}>
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
              <h2 className="mt-2 font-display text-3xl font-black">
                {current.short}
              </h2>
              <p className="mt-2 text-sm text-steel">
                Semaine du{" "}
                <strong className="text-ink">
                  {weekStart.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
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
              <span className="inline-block size-3 rounded-sm border border-border bg-white" /> Libre
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-3 rounded-sm bg-racing" /> Sélectionné
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-3 rounded-sm bg-steel/40" /> Occupé
            </span>
          </div>

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
                    {days.map((_, i) => {
                      const booked = isBooked(current.id, i + weekOffset * 6, h);
                      const selected = pick && pick.day === i && pick.hour === h;
                      return (
                        <td key={i} className="border-b border-r border-border p-1.5 last:border-r-0">
                          <button
                            disabled={booked}
                            onClick={() => setPick({ day: i, hour: h })}
                            className={`h-10 w-full rounded-sm text-[11px] font-semibold uppercase tracking-wider transition ${
                              booked
                                ? "cursor-not-allowed bg-steel/25 text-white/70"
                                : selected
                                ? "bg-racing text-white shadow"
                                : "bg-white text-ink hover:bg-racing/10 hover:text-racing border border-border"
                            }`}
                          >
                            {booked ? "Occupé" : selected ? "Choisi" : "Libre"}
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
                {pick ? (
                  <>
                    {" · "}
                    {formatDay(days[pick.day])} à {pick.hour}
                  </>
                ) : (
                  <span className="text-steel"> — choisissez un créneau libre</span>
                )}
              </p>
              <p className="mt-1 text-sm text-steel">
                Tarif : <strong className="text-ink">{current.price}</strong> {current.unit}
              </p>
            </div>
            <a
              href={
                pick
                  ? `#reserver?equip=${current.id}&day=${pick.day}&h=${pick.hour}`
                  : "#reserver"
              }
              className={`rounded-sm px-6 py-3 text-center text-[12px] font-bold uppercase tracking-wider transition ${
                pick
                  ? "bg-racing text-white hover:bg-racing/90"
                  : "cursor-not-allowed bg-steel/30 text-white/70"
              }`}
              aria-disabled={!pick}
              onClick={(e) => { if (!pick) e.preventDefault(); }}
            >
              Confirmer la réservation →
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
          <h2 className="mt-2 font-display text-3xl font-black">Confirmez votre créneau</h2>
          <p className="mt-3 text-white/70">
            Un membre de l'équipe valide votre demande sous 24h. Paiement sur place.
          </p>
          <form className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">Équipement</span>
              <select defaultValue={current.id} className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white">
                {equipments.map((e) => (
                  <option key={e.id} value={e.id} className="text-ink">{e.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">Date</span>
              <input
                type="date"
                defaultValue={pick ? days[pick.day].toISOString().slice(0, 10) : undefined}
                className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white"
              />
            </label>
            <label className="text-sm">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">Créneau</span>
              <select defaultValue={pick?.hour} className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white">
                {hours.map((h) => <option key={h} value={h} className="text-ink">{h}</option>)}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">Durée</span>
              <select className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white">
                <option className="text-ink">1 heure</option>
                <option className="text-ink">2 heures</option>
                <option className="text-ink">3 heures</option>
                <option className="text-ink">Demi-journée</option>
              </select>
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">Nom & téléphone</span>
              <input type="text" placeholder="Prénom Nom · 06 XX XX XX XX" className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/40" />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">Intervention prévue</span>
              <textarea rows={3} placeholder="Ex : vidange + filtres sur Golf VII" className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/40" />
            </label>
            <button type="submit" className="sm:col-span-2 rounded-sm bg-racing px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90">
              Envoyer la demande →
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-xs text-steel">
          CAO57 · Centre Auto Occasion 57 · Forbach
        </div>
      </footer>
    </div>
  );
}
