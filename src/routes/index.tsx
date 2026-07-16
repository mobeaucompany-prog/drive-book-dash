import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/cao57-logo.png.asset.json";
import heroWorkshop from "@/assets/hero-workshop.jpg";
import carGolf from "@/assets/car-golf.jpg";
import carClio from "@/assets/car-clio.jpg";
import carBmw from "@/assets/car-bmw.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const reparations = [
  { name: "Vidange & entretien", desc: "Huile, filtres, contrôle complet", price: "Dès 49€" },
  { name: "Freinage", desc: "Plaquettes, disques, purge liquide", price: "Dès 89€" },
  { name: "Distribution", desc: "Courroie, galets, pompe à eau", price: "Sur devis" },
  { name: "Embrayage", desc: "Diagnostic et remplacement complet", price: "Sur devis" },
  { name: "Pneumatiques", desc: "Montage, équilibrage, géométrie", price: "Dès 15€" },
  { name: "Diagnostic électronique", desc: "Lecture valise multimarques", price: "39€" },
];

const vehicules = [
  { img: carGolf, name: "Volkswagen Golf VIII R", year: "2022", km: "45 000 km", energie: "Essence", price: "32 900 €", badge: "Coup de cœur" },
  { img: carClio, name: "Renault Clio V TCe 100", year: "2022", km: "18 200 km", energie: "Essence", price: "16 400 €" },
  { img: carBmw, name: "BMW X3 xDrive 30d", year: "2020", km: "65 000 km", energie: "Diesel", price: "41 200 €" },
];

const locations = [
  { name: "Pont élévateur 2 colonnes", cap: "Capacité 3.6 T · éclairage LED · air comprimé", price: "20€", unit: "/ heure" },
  { name: "Machine à pneus + équilibreuse", cap: "Jusqu'à 22\" · démonte-pneus pro", price: "15€", unit: "/ heure" },
  { name: "Fosse de mécanique", cap: "Éclairage intégré · outillage disponible", price: "15€", unit: "/ heure" },
  { name: "Presse hydraulique 45 T", cap: "Roulements, silent-blocs, rotules", price: "10€", unit: "/ utilisation" },
];

function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="CAO57 — Centre Auto Occasion 57"
      className={className}
      width={80}
      height={80}
    />
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-md bg-ink">
              <Logo className="h-10 w-10 object-contain" />
            </div>
            <div className="leading-none">
              <div className="font-display text-2xl tracking-wide">
                CAO<span className="text-primary">57</span>
              </div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Centre Auto · Forbach
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:flex">
            <a href="#reparations" className="transition-colors hover:text-primary">Réparations</a>
            <a href="#vehicules" className="transition-colors hover:text-primary">Véhicules</a>
            <a href="#atelier" className="transition-colors hover:text-primary">Louer l'atelier</a>
            <a href="#contact" className="transition-colors hover:text-primary">Contact</a>
          </nav>
          <a
            href="#reserver"
            className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]"
          >
            Réserver
          </a>
        </div>
      </header>

      {/* HERO — simple, direct */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Forbach · Moselle
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-wide sm:text-6xl lg:text-7xl">
              VOTRE GARAGE
              <br />
              <span className="text-primary">DE CONFIANCE.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground lg:text-lg">
              Réparation, entretien et vente de véhicules d'occasion.
              Et si vous préférez faire vous-même, louez notre atelier
              équipé de matériel professionnel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#reserver"
                className="rounded-sm bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]"
              >
                Prendre rendez-vous
              </a>
              <a
                href="tel:+33620431191"
                className="rounded-sm border border-border bg-card px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                06 20 43 11 91
              </a>
            </div>
            <div className="mt-10 flex gap-8 border-t border-border pt-6">
              <Stat n="15+" l="Ans d'expérience" />
              <Stat n="6j/7" l="Ouvert" />
              <Stat n="4.9/5" l="Avis clients" />
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-ink shadow-card">
              <img
                src={heroWorkshop}
                alt="Atelier CAO57"
                width={900}
                height={900}
                className="aspect-[4/5] h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/60 to-transparent p-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Atelier</div>
                <div className="mt-1 font-display text-2xl tracking-wide text-white">
                  Équipement professionnel
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border bg-card p-4 shadow-card sm:block">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Certifié</div>
              <div className="mt-1 font-display text-lg tracking-wide">Toutes marques</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PÔLES — hiérarchie claire */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="mb-10 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Trois pôles · Un seul endroit
            </div>
            <h2 className="mt-3 font-display text-4xl tracking-wide lg:text-5xl">
              CE QUE NOUS FAISONS POUR VOUS
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Pole
              n="01"
              title="Réparation"
              featured
              desc="Entretien, mécanique, diagnostic. Toutes marques, devis clair."
              href="#reparations"
              cta="Voir les prestations"
            />
            <Pole
              n="02"
              title="Vente d'occasion"
              desc="Véhicules sélectionnés, contrôlés, garantis."
              href="#vehicules"
              cta="Voir le catalogue"
            />
            <Pole
              n="03"
              title="Location d'atelier"
              desc="Ponts et outillage pro à disposition, dès 15€/h."
              href="#atelier"
              cta="Réserver un pont"
            />
          </div>
        </div>
      </section>

      {/* RÉPARATIONS — activité primaire */}
      <section id="reparations" className="border-b border-border py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Notre métier
              </div>
              <h2 className="font-display text-4xl tracking-wide lg:text-5xl">
                RÉPARATION & ENTRETIEN
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Mécaniciens expérimentés, tarifs transparents.
                Devis gratuit sous 24h.
              </p>
            </div>
            <a
              href="#reserver"
              className="rounded-sm bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]"
            >
              Prendre RDV
            </a>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {reparations.map((r, i) => (
              <div
                key={r.name}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary"
              >
                <div>
                  <div className="font-display text-xs tracking-widest text-primary">
                    #{String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-3 font-display text-2xl tracking-wide">{r.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                    {r.price}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Réserver →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VÉHICULES — vente d'occasion */}
      <section id="vehicules" className="border-b border-border bg-secondary/40 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Occasions sélectionnées
              </div>
              <h2 className="font-display text-4xl tracking-wide lg:text-5xl">
                NOTRE CATALOGUE
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Véhicules contrôlés, historique vérifié, garantie incluse.
              </p>
            </div>
            <a
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-primary transition-transform hover:translate-x-1"
            >
              Tout le stock →
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicules.map((v) => (
              <article
                key={v.name}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-primary"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={v.img}
                    alt={v.name}
                    loading="lazy"
                    width={600}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {v.badge && (
                    <span className="absolute left-3 top-3 rounded-sm bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      {v.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-display text-xl leading-tight tracking-wide">{v.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <span>{v.year}</span>·<span>{v.km}</span>·<span>{v.energie}</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div className="font-display text-2xl text-primary">{v.price}</div>
                    <button className="rounded-sm border border-border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary">
                      Détails
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION ATELIER */}
      <section id="atelier" className="border-b border-border py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Faites-le vous-même
              </div>
              <h2 className="mt-3 font-display text-4xl leading-[0.95] tracking-wide lg:text-5xl">
                LOUEZ NOTRE ATELIER
              </h2>
              <p className="mt-4 text-muted-foreground">
                Pont élévateur, machine à pneus, fosse et outillage pro
                mis à disposition. Vous économisez jusqu'à
                <strong className="text-foreground"> 70 %</strong> par
                rapport à un garage classique.
              </p>
              <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Inclus
                </div>
                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    "Air comprimé & électricité",
                    "Outillage professionnel",
                    "Conseils d'un pro sur place",
                    "Parking gratuit & atelier propre",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">✓</span>
                      <span className="font-semibold">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {locations.map((l, i) => (
                <div
                  key={l.name}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary"
                >
                  <div>
                    <div className="font-display text-xs tracking-widest text-primary">
                      #{String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-3 font-display text-xl leading-tight tracking-wide">
                      {l.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{l.cap}</p>
                  </div>
                  <div className="mt-6 flex items-baseline gap-2 border-t border-border pt-4">
                    <span className="font-display text-3xl">{l.price}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {l.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking bar */}
          <div
            id="reserver"
            className="mt-10 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-card lg:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <SelectField label="Prestation">
              <option>Réparation / entretien</option>
              <option>Pont élévateur (self)</option>
              <option>Machine à pneus (self)</option>
              <option>Fosse mécanique (self)</option>
            </SelectField>
            <InputField label="Date" type="date" />
            <SelectField label="Créneau">
              <option>08:00 — 10:00</option>
              <option>10:00 — 12:00</option>
              <option>14:00 — 16:00</option>
              <option>16:00 — 18:00</option>
            </SelectField>
            <button className="self-end rounded-sm bg-primary px-8 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]">
              Vérifier
            </button>
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="border-b border-border bg-secondary/40 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Ils nous font confiance
              </div>
              <h2 className="font-display text-4xl tracking-wide lg:text-5xl">AVIS CLIENTS</h2>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2 shadow-card">
              <span className="font-display text-2xl">4.9<span className="text-primary">/5</span></span>
              <span className="text-primary">★★★★★</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { q: "Matériel nickel, ambiance pro. J'ai fait mes plaquettes en 1h chrono.", a: "Karim · Forbach" },
              { q: "Le meilleur rapport qualité / prix du secteur. Je recommande à 100%.", a: "Julie · Sarreguemines" },
              { q: "Voiture d'occasion impeccable, prix juste. Aucune mauvaise surprise.", a: "Sophie · Metz" },
            ].map((t) => (
              <div key={t.a} className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="text-primary">★★★★★</div>
                <p className="mt-4 text-sm leading-relaxed">"{t.q}"</p>
                <div className="mt-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-b border-border py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-ink p-8 text-white shadow-card lg:p-12">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Nous trouver</div>
            <h2 className="mt-4 font-display text-5xl leading-none tracking-wide lg:text-6xl">
              FORBACH<br />
              <span className="text-primary">57600</span>
            </h2>
            <div className="mt-8 space-y-4">
              <ContactRow label="Adresse" value="Forbach (57)" />
              <ContactRow label="Téléphone" value="06 20 43 11 91" />
              <ContactRow label="Horaires" value="Lun — Sam · 08h → 19h" />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:+33620431191"
                className="rounded-sm bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-racing transition-transform hover:scale-[1.02]"
              >
                Appeler
              </a>
              <a
                href="#reserver"
                className="rounded-sm border border-white/25 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest backdrop-blur transition-colors hover:bg-white/10"
              >
                Réserver
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Envoyer un message</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">&lt; 24h</span>
            </div>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Nom" placeholder="Votre nom" />
                <InputField label="Téléphone" placeholder="06 XX XX XX XX" />
              </div>
              <InputField label="Email" placeholder="vous@exemple.com" type="email" />
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="mt-1 w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="Votre demande…"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-sm bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.01]"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md bg-ink">
              <Logo className="h-8 w-8 object-contain" />
            </div>
            <span className="font-display text-xl tracking-wide">
              CAO<span className="text-primary">57</span>
            </span>
          </div>
          <div className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Centre Auto Occasion 57 · Forbach · Ouvert 6j/7
          </div>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">Mentions</a>
            <a href="#" className="transition-colors hover:text-primary">CGV</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-3xl tracking-wide">{n}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {l}
      </div>
    </div>
  );
}

function Pole({
  n,
  title,
  desc,
  href,
  cta,
  featured = false,
}: {
  n: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  featured?: boolean;
}) {
  return (
    <a
      href={href}
      className={
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 shadow-card transition-all hover:-translate-y-1 " +
        (featured
          ? "bg-ink text-white hover:shadow-racing"
          : "border border-border bg-card hover:border-primary")
      }
    >
      <div>
        <div className={"font-display text-xs tracking-widest " + (featured ? "text-primary" : "text-primary")}>
          #{n}
        </div>
        <h3 className="mt-6 font-display text-3xl tracking-wide lg:text-4xl">{title}</h3>
        <p className={"mt-3 text-sm " + (featured ? "text-white/70" : "text-muted-foreground")}>
          {desc}
        </p>
      </div>
      <div className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary transition-transform group-hover:translate-x-1">
        {cta} →
      </div>
      {featured && (
        <div className="pointer-events-none absolute -right-6 -top-6 rounded-full bg-primary/20 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
          Activité principale
        </div>
      )}
    </a>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-6 border-b border-white/10 pb-3">
      <div className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
        {label}
      </div>
      <div className="font-display text-2xl tracking-wide">{value}</div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function SelectField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <select className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
        {children}
      </select>
    </div>
  );
}
