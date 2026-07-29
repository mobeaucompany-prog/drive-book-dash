import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/cao57-logo-v4.png.asset.json";
import heroWorkshop from "@/assets/garage-lifts.jpg.asset.json";
import garageInterior from "@/assets/garage-interior.jpg.asset.json";
import repVidange from "@/assets/repair-vidange.jpg";
import repFreinage from "@/assets/repair-freinage.jpg";
import repDistribution from "@/assets/repair-distribution.jpg";
import repEmbrayage from "@/assets/repair-embrayage.jpg";
import repPneus from "@/assets/repair-pneus.jpg";
import repDiagnostic from "@/assets/repair-diagnostic.jpg";
import { annonces } from "@/data/annonces";

export const Route = createFileRoute("/")({
  component: Home,
});

const reparations = [
  { img: repVidange, name: "Vidange & entretien", desc: "Huile, filtres, contrôle multipoints.", price: "Dès 49 €" },
  { img: repFreinage, name: "Freinage", desc: "Plaquettes, disques, purge liquide de frein.", price: "Dès 89 €" },
  { img: repDistribution, name: "Distribution", desc: "Courroie, galets, pompe à eau.", price: "Sur devis" },
  { img: repEmbrayage, name: "Embrayage", desc: "Diagnostic et remplacement complet.", price: "Sur devis" },
  { img: repPneus, name: "Pneumatiques", desc: "Montage, équilibrage, géométrie 4 roues.", price: "Dès 15 €" },
  { img: repDiagnostic, name: "Diagnostic électronique", desc: "Lecture valise multimarques toutes ECU.", price: "39 €" },
];

const frNum = (n: number) => n.toLocaleString("fr-FR");
const vehicules = annonces.slice(0, 3).map((a) => ({
  id: a.id,
  img: a.images[0],
  name: a.titre,
  year: String(a.annee),
  km: frNum(a.km),
  energie: a.energie,
  bv: a.boite === "Manuelle" ? "Manuelle" : "Auto",
  price: frNum(a.prix),
  badge: a.badge as string | undefined,
}));

const locations = [
  { name: "Pont élévateur 2 colonnes", cap: "3,6 T · 20€/h · forfait 1/2 journée 60€ · journée 120€", price: "20 €", unit: "/ heure" },
  { name: "Démonte-pneus & équilibreuse", cap: "Jusqu'à 22\" · matériel professionnel", price: "15 €", unit: "/ heure" },
  { name: "Fosse mécanique", cap: "Éclairage intégré · outillage à disposition", price: "15 €", unit: "/ heure" },
  { name: "Presse hydraulique 45 T", cap: "Roulements, silent-blocs, rotules.", price: "10 €", unit: "/ utilisation" },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <Nav />
      <Hero />
      <QuickBar />
      <Repairs />
      <Vehicles />
      <PromoBanner />
      <Workshop />
      <BookingStrip />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------- Top utility bar ---------- */
function TopBar() {
  return (
    <div className="bg-carbon text-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[11px]">
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline">📍 2 Allée des Cyprès · 57600 Forbach</span>
          <span className="hidden md:inline">Ouvert lun. — sam. · 08h → 19h</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="tel:+33620431191" className="hover:text-white">☏ 06 20 43 11 91</a>
          <a href="#compte" className="hidden sm:inline hover:text-white">Mon compte</a>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sticky main nav ---------- */
function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center">
          <img src={logoAsset.url} alt="CAO57 — Centre Auto Occasion 57" className="h-18 w-auto" style={{ height: "4.5rem" }} />
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-semibold text-ink md:flex">
          <Link to="/reparations" className="hover:text-racing">Réparations</Link>
          <Link to="/occasions" className="hover:text-racing">Occasions</Link>
          <Link to="/atelier" className="hover:text-racing">Atelier libre</Link>
          <a href="#contact" className="hover:text-racing">Contact</a>
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
  );
}

/* ---------- Cinematic hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-carbon text-white">
      <img
        src={heroWorkshop.url}
        alt="Atelier CAO57 avec ponts élévateurs"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-carbon to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-12 lg:py-36">
        <div className="lg:col-span-7">
          <div className="eyebrow mb-5 !text-white/70">
            <span className="mr-3 inline-block h-[2px] w-8 translate-y-[-4px] bg-racing align-middle" />
            Garage · Vente · Atelier libre
          </div>
          <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            L'auto,{" "}
            <span className="text-racing">sans détour.</span>
            <br />
            <span className="text-white/85">Un vrai garage à Forbach.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            Réparations toutes marques, occasions contrôlées et location
            d'atelier pro à l'heure. Devis clair, travail net, prix affichés.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#reserver"
              className="inline-flex items-center gap-2 rounded-sm bg-racing px-7 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90"
            >
              Réserver un créneau →
            </a>
            <a
              href="#vehicules"
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-7 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-carbon"
            >
              Voir les occasions
            </a>
          </div>

          <div className="mt-14 grid max-w-lg grid-cols-2 gap-6 border-t border-white/15 pt-6">
            <Stat n="4,9/5" l="Avis Google" />
            <Stat n="-70%" l="vs garage classique" />
          </div>
        </div>

        {/* Rental highlight card */}
        <div className="lg:col-span-5 lg:pl-6">
          <Link
            to="/atelier"
            className="group relative block overflow-hidden rounded-sm border border-white/10 bg-gradient-to-br from-racing/95 to-racing/70 p-7 shadow-2xl transition hover:from-racing hover:to-racing/80"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #000 0 14px, transparent 14px 28px)",
              }}
            />
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-300" />
                Nouveau · Atelier libre
              </div>
              <h2 className="font-display text-4xl font-black leading-[0.95] text-white sm:text-5xl">
                Loue ton garage
                <br />
                <span className="text-yellow-300">à petit prix !</span>
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/85">
                Pont élévateur, démonte-pneus et fosse pro à l'heure.
                Répare toi-même, on t'ouvre l'atelier.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <PriceChip label="Pont" price="20€/h" />
                <PriceChip label="Pneus" price="15€/h" />
                <PriceChip label="Fosse" price="15€/h" />
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-white">
                Réserver l'atelier
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PriceChip({ label, price }: { label: string; price: string }) {
  return (
    <div className="rounded-sm border border-white/25 bg-black/25 px-2 py-2">
      <div className="font-display text-lg font-black text-yellow-300">{price}</div>
      <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/80">{label}</div>
    </div>
  );
}


function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-black text-white">{n}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">{l}</div>
    </div>
  );
}

/* ---------- Quick service bar ---------- */
function QuickBar() {
  const items = [
    { i: "🔧", t: "Réparation", s: "Devis 24h" },
    { i: "🚗", t: "Occasions", s: "Parc vérifié" },
    { i: "🛠️", t: "Atelier libre", s: "Dès 15€/h" },
    { i: "🛞", t: "Pneus", s: "Montage 15€" },
  ];
  return (
    <div className="border-b border-border bg-smoke">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
        {items.map((x) => (
          <div key={x.t} className="flex items-center gap-4 px-6 py-5">
            <span className="text-2xl">{x.i}</span>
            <div>
              <div className="font-display text-sm font-bold uppercase tracking-wide">{x.t}</div>
              <div className="text-xs text-steel">{x.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- I. Réparations ---------- */
function Repairs() {
  return (
    <section id="reparations" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead eyebrow="Notre métier" title="Réparations & entretien" desc="Mécanique toutes marques. Devis clair sous 24h, pièces d'origine ou équivalentes." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reparations.map((r) => (
            <article key={r.name} className="group overflow-hidden rounded-md border border-border bg-white transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={r.img} alt={r.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute right-3 top-3 rounded-sm bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                  {r.price}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold">{r.name}</h3>
                <p className="mt-1.5 text-sm text-steel">{r.desc}</p>
                <a href="#reserver" className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-racing hover:gap-2">
                  Réserver →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- II. Véhicules ---------- */
function Vehicles() {
  return (
    <section id="vehicules" className="border-b border-border bg-smoke">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <SectionHead eyebrow="Vente" title="Occasions sélectionnées" desc="Chaque véhicule passe une révision complète avant sa mise en vente." />
          <Link to="/occasions" className="hidden shrink-0 rounded-sm border-2 border-ink px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider hover:bg-ink hover:text-white md:inline-flex">
            Tout le parc →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicules.map((v) => (
            <article key={v.id} className="group flex flex-col overflow-hidden rounded-md border border-border bg-white transition hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-smoke">
                <img src={v.img} alt={v.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                {v.badge && (
                  <span className="absolute left-3 top-3 rounded-sm bg-racing px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {v.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold leading-tight">{v.name}</h3>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-steel">
                  <li>{v.year}</li>
                  <li>· {v.km} km</li>
                  <li>· {v.energie}</li>
                  <li>· {v.bv}</li>
                </ul>
                <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-steel">Prix TTC</div>
                    <div className="font-display text-2xl font-black">{v.price} €</div>
                  </div>
                  <Link to="/occasions" className="rounded-sm bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-racing">
                    Fiche
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Promo banner (affiche punchy) ---------- */
function PromoBanner() {
  const stripe =
    "repeating-linear-gradient(135deg,#facc15 0 22px,#0b0c0e 22px 44px)";
  return (
    <section className="relative overflow-hidden bg-carbon text-white">
      <div className="h-4 w-full" style={{ background: stripe }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-6 py-14 md:grid-cols-[1.4fr_1fr] md:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-sm bg-yellow-400 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-carbon">
            ★ Offre atelier
          </div>
          <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
            Loue ton garage
            <br />
            <span className="text-yellow-400">à petit prix</span>
            <span className="text-racing"> !</span>
          </h2>
          <p className="mt-5 max-w-xl text-white/70">
            Pont élévateur, démonte-pneus, fosse mécanique… Le matos pro à
            l'heure, sans t'endetter. À Forbach, dispo 6j/7.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#reserver" className="rounded-sm bg-yellow-400 px-6 py-3 text-[12px] font-black uppercase tracking-widest text-carbon hover:bg-yellow-300">
              Réserver mon pont →
            </a>
            <a href="tel:+33620431191" className="rounded-sm border border-white/30 px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-carbon">
              ☏ 06 20 43 11 91
            </a>
          </div>
        </div>

        <ul className="grid grid-cols-3 gap-0 border border-white/15 md:border-white/20">
          {[
            { p: "20€", u: "/h", n: "Pont élévateur", sub: "60€ 1/2 j · 120€/j" },
            { p: "15€", u: "/h", n: "Démonte-pneus", sub: "" },
            { p: "15€", u: "/h", n: "Fosse méca", sub: "" },
          ].map((x, i) => (
            <li key={x.n} className={"p-5 text-center " + (i < 2 ? "border-r border-white/15" : "")}>
              <div className="font-display text-3xl font-black text-yellow-400">{x.p}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/50">{x.u}</div>
              <div className="mt-3 text-[11px] font-bold uppercase tracking-wider">{x.n}</div>
              {x.sub && (
                <div className="mt-1 text-[10px] font-semibold text-yellow-400/90">{x.sub}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="h-4 w-full" style={{ background: stripe }} />
    </section>
  );
}

/* ---------- III. Atelier libre ---------- */
function Workshop() {
  return (
    <section id="atelier" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead eyebrow="Self-garage" title="Louez notre atelier à l'heure" desc="Vous savez faire ? Pont, fosse, démonte-pneus et outillage pro à disposition. Économisez jusqu'à 70 % vs un garage classique." />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((l) => (
            <div key={l.name} className="group relative overflow-hidden rounded-md border border-border bg-white p-6 transition hover:border-ink hover:shadow-lg">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl font-black text-racing">{l.price}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-steel">{l.unit}</span>
              </div>
              <h3 className="mt-4 font-display text-base font-bold leading-tight">{l.name}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-steel">{l.cap}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-md bg-carbon p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span>✓ Air comprimé & électricité inclus</span>
              <span>✓ Outillage pro à disposition</span>
              <span>✓ Mécanicien sur place</span>
              <span>✓ Café offert</span>
            </div>
            <a href="#reserver" className="rounded-sm bg-racing px-6 py-3 text-[12px] font-bold uppercase tracking-wider hover:bg-racing/90">
              Réserver mon créneau →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Booking strip ---------- */
function BookingStrip() {
  return (
    <section id="reserver" className="border-b border-border bg-smoke">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <SectionHead eyebrow="Réservation" title="Prendre un rendez-vous" desc="Choisissez votre prestation et votre créneau. Confirmation sous 24h." />
        <form className="mt-10 grid gap-4 rounded-md border border-border bg-white p-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
          <Field label="Prestation">
            <select className="input">
              <option>Réparation / entretien</option>
              <option>Pont élévateur (libre-service)</option>
              <option>Démonte-pneus (libre-service)</option>
              <option>Fosse mécanique (libre-service)</option>
              <option>Diagnostic électronique</option>
            </select>
          </Field>
          <Field label="Date">
            <input type="date" className="input" />
          </Field>
          <Field label="Créneau">
            <select className="input">
              <option>08:00 — 10:00</option>
              <option>10:00 — 12:00</option>
              <option>14:00 — 16:00</option>
              <option>16:00 — 18:00</option>
            </select>
          </Field>
          <button className="h-[46px] rounded-sm bg-racing px-8 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90">
            Vérifier
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---------- Reviews ---------- */
function Reviews() {
  const items = [
    { q: "Matériel nickel, ambiance pro. Plaquettes changées en une heure chrono.", a: "Karim", city: "Forbach" },
    { q: "Meilleur rapport qualité-prix du secteur. Honnêtes, francs, efficaces.", a: "Julie", city: "Sarreguemines" },
    { q: "Voiture d'occasion impeccable, prix juste, aucune mauvaise surprise.", a: "Sophie", city: "Metz" },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <SectionHead eyebrow="Avis clients" title="Ils nous font confiance" />
          <div className="hidden text-right md:block">
            <div className="font-display text-3xl font-black">4,9<span className="text-racing">/5</span></div>
            <div className="micro mt-1">Sur Google · 210+ avis</div>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.a} className="rounded-md border border-border bg-white p-6">
              <div className="text-racing">★★★★★</div>
              <blockquote className="mt-3 text-[15px] leading-relaxed">« {t.q} »</blockquote>
              <figcaption className="mt-5 border-t border-border pt-3 text-[12px] font-semibold uppercase tracking-wider text-steel">
                {t.a} — {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
function Contact() {
  return (
    <section id="contact" className="border-b border-border bg-carbon text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="eyebrow mb-3">Nous trouver</div>
          <h2 className="font-display text-4xl font-black leading-tight lg:text-5xl">
            Forbach, <span className="text-racing">57600.</span>
          </h2>
          <p className="mt-4 text-white/70">Passez à l'atelier ou appelez-nous. Réponse rapide, accueil sans blabla.</p>

          <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
            <Row label="Téléphone" value="06 20 43 11 91" />
            <Row label="Adresse" value="2 Allée des Cyprès, 57600 Forbach" />
            <Row label="Horaires" value="Lun — Sam · 08h → 19h" />
            <Row label="Diagnostic" value="Sur RDV · 39 €" />
          </dl>
        </div>

        <form className="rounded-md bg-white p-6 text-ink lg:col-span-7 lg:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom"><input className="input" placeholder="Votre nom" /></Field>
            <Field label="Téléphone"><input className="input" placeholder="06 XX XX XX XX" /></Field>
          </div>
          <div className="mt-4">
            <Field label="Email"><input type="email" className="input" placeholder="vous@exemple.com" /></Field>
          </div>
          <div className="mt-4">
            <Field label="Message">
              <textarea rows={5} className="input resize-none" placeholder="Votre demande…" />
            </Field>
          </div>
          <button type="button" className="mt-5 rounded-sm bg-racing px-8 py-3 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90">
            Envoyer
          </button>
        </form>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{label}</dt>
      <dd className="font-display text-base font-semibold">{value}</dd>
    </div>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-sm bg-white/5">
              <img src={logoAsset.url} alt="CAO57" className="h-7 w-7 object-contain" />
            </div>
            <div className="font-display text-lg font-black text-white">CAO<span className="text-racing">57</span></div>
          </div>
          <p className="mt-4 text-xs">Centre Auto Occasion 57 · Forbach. Réparation, vente, atelier libre.</p>
        </div>
        <FooterCol title="Services" items={["Réparations", "Diagnostic", "Pneumatiques", "Atelier libre"]} />
        <FooterCol title="Ventes" items={["Occasions", "Neuf-livraison", "Reprise", "Financement"]} />
        <FooterCol title="Contact" items={["06 20 43 11 91", "2 Allée des Cyprès, 57600 Forbach", "Lun–Sam 08h→19h"]} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 py-5 text-[11px] uppercase tracking-wider md:flex-row">
          <span>© {new Date().getFullYear()} CAO57 — Tous droits réservés</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Mentions légales</a>
            <a href="#" className="hover:text-white">CGV</a>
            <a href="#" className="hover:text-white">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-white">{title}</div>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i}><a href="#" className="hover:text-white">{i}</a></li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Small building blocks ---------- */
function SectionHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="eyebrow mb-3">{eyebrow}</div>
      <h2 className="font-display text-4xl font-black leading-[1.05] tracking-tight lg:text-5xl">
        {title}
      </h2>
      {desc && <p className="mt-4 text-base leading-relaxed text-steel">{desc}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-steel">{label}</span>
      {children}
    </label>
  );
}
