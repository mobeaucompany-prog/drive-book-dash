import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/cao57-logo.png.asset.json";
import heroWorkshop from "@/assets/hero-workshop.jpg";
import carGolf from "@/assets/car-golf.jpg";
import carClio from "@/assets/car-clio.jpg";
import carBmw from "@/assets/car-bmw.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const equipements = [
  { n: "01", name: "Pont élévateur 2 colonnes", price: "20", unit: "€ / h" },
  { n: "02", name: "Machine à pneus pro", price: "15", unit: "€ / h" },
  { n: "03", name: "Équilibreuse de roues", price: "10", unit: "€ / roue" },
  { n: "04", name: "Fosse de mécanique", price: "15", unit: "€ / h" },
  { n: "05", name: "Presse hydraulique 45 T", price: "10", unit: "€ / util." },
  { n: "06", name: "Compresseur & outillage", price: "Inc.", unit: "" },
];

const vehicules = [
  {
    img: carGolf,
    name: "Volkswagen Golf VIII R",
    year: "2022",
    km: "45 000 km",
    energie: "Essence",
    price: "32 900 €",
    badge: "Coup de cœur",
  },
  {
    img: carClio,
    name: "Renault Clio V TCe 100",
    year: "2022",
    km: "18 200 km",
    energie: "Essence",
    price: "16 400 €",
  },
  {
    img: carBmw,
    name: "BMW X3 xDrive 30d",
    year: "2020",
    km: "65 000 km",
    energie: "Diesel",
    price: "41 200 €",
  },
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-md bg-ink">
              <Logo className="h-9 w-9 object-contain" />
            </div>
            <span className="font-display text-2xl tracking-wide">
              CAO<span className="text-primary">57</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:flex">
            <a href="#services" className="transition-colors hover:text-primary">Services</a>
            <a href="#equipements" className="transition-colors hover:text-primary">Équipements</a>
            <a href="#vehicules" className="transition-colors hover:text-primary">Véhicules</a>
            <a href="#contact" className="transition-colors hover:text-primary">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary sm:block">
              Mon compte
            </button>
            <a
              href="#reserver"
              className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]"
            >
              Réserver
            </a>
          </div>
        </div>
      </header>

      {/* HERO BENTO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
          <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
            {/* Big hero card */}
            <div className="relative overflow-hidden rounded-2xl bg-ink text-white lg:col-span-8 lg:row-span-2">
              <img
                src={heroWorkshop}
                alt="Atelier CAO57 avec pont élévateur"
                width={1200}
                height={1200}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/70 to-transparent" />
              <div className="relative flex h-full flex-col justify-between p-8 lg:min-h-[520px] lg:p-12">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] backdrop-blur">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Forbach · Moselle 57
                  </span>
                </div>
                <div>
                  <h1 className="font-display text-5xl leading-[0.9] tracking-wide sm:text-6xl lg:text-8xl">
                    LOUE TON GARAGE
                    <br />
                    <span className="text-primary">À PETIT PRIX.</span>
                  </h1>
                  <p className="mt-6 max-w-lg text-base text-white/70 lg:text-lg">
                    Répare ta voiture toi-même avec du matériel pro et
                    économise jusqu'à <strong className="text-white">70%</strong>.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#reserver"
                      className="rounded-sm bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]"
                    >
                      Réserver un pont
                    </a>
                    <a
                      href="#vehicules"
                      className="rounded-sm border border-white/25 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-widest backdrop-blur transition-colors hover:bg-white/10"
                    >
                      Voir véhicules
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Économise 70% card */}
            <div className="flex flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground shadow-racing lg:col-span-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">
                Économise
              </div>
              <div>
                <div className="font-display text-7xl leading-none tracking-wide lg:text-8xl">
                  70<span className="text-4xl">%</span>
                </div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-widest opacity-90">
                  sur tes réparations
                </div>
              </div>
            </div>

            {/* Rating card */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Avis clients
              </div>
              <div>
                <div className="font-display text-6xl leading-none tracking-wide">
                  4.9<span className="text-3xl text-primary">/5</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-primary">★★★★★</span>
                  <span>Basé sur les retours locaux</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services quick-reserve bento row */}
          <div id="services" className="mt-4 grid gap-4 lg:grid-cols-4">
            {[
              { n: "01", label: "Self-Garage", desc: "Ponts & outillage pro", tag: "Dès 20€/h" },
              { n: "02", label: "Pneus", desc: "Montage & équilibrage", tag: "Dès 15€/h" },
              { n: "03", label: "Location", desc: "Voitures à la journée", tag: "Dès 39€" },
              { n: "04", label: "Vente", desc: "Occasions sélectionnées", tag: "Stock certifié" },
            ].map((s) => (
              <button
                key={s.n}
                className="group flex flex-col items-start rounded-2xl border border-border bg-card p-6 text-left shadow-card transition-all hover:-translate-y-1 hover:border-primary hover:shadow-racing"
              >
                <span className="font-display text-xs tracking-widest text-primary">
                  #{s.n}
                </span>
                <span className="mt-6 font-display text-3xl tracking-wide">
                  {s.label}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">{s.desc}</span>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground">
                  {s.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Booking bar */}
          <div
            id="reserver"
            className="mt-4 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-card lg:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <SelectField label="Équipement">
              <option>Pont élévateur 2 colonnes</option>
              <option>Machine à pneus + équilibreuse</option>
              <option>Fosse mécanique</option>
              <option>Presse hydraulique</option>
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

      {/* ÉQUIPEMENTS — BENTO TARIFS */}
      <section id="equipements" className="border-b border-border bg-secondary/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Nos tarifs d'ouverture
              </div>
              <h2 className="font-display text-5xl tracking-wide lg:text-6xl">
                MATÉRIEL PRO À TA DISPOSITION
              </h2>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Places limitées · Réserve dès maintenant
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            {/* Featured hero equipment */}
            <div className="relative overflow-hidden rounded-2xl bg-ink p-8 text-white lg:col-span-6 lg:row-span-2">
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    #01 · Star de l'atelier
                  </div>
                  <h3 className="mt-4 font-display text-5xl tracking-wide lg:text-6xl">
                    Pont élévateur
                    <br />2 colonnes 3.6 T
                  </h3>
                  <p className="mt-4 max-w-md text-white/70">
                    Capacité 3.6 tonnes, éclairage LED intégré et air comprimé
                    inclus. Idéal pour vidanges, freins, embrayage, distribution.
                  </p>
                </div>
                <div className="flex items-end justify-between border-t border-white/10 pt-6">
                  <div>
                    <div className="font-display text-7xl leading-none">
                      20€<span className="text-2xl text-white/60">/h</span>
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                      Au lieu de 25€/h
                    </div>
                  </div>
                  <a
                    href="#reserver"
                    className="rounded-sm bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-racing transition-transform hover:scale-[1.02]"
                  >
                    Réserver
                  </a>
                </div>
              </div>
            </div>

            {/* Bento equipment cards */}
            {equipements.slice(1).map((eq) => (
              <div
                key={eq.n}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary lg:col-span-3"
              >
                <div>
                  <div className="font-display text-xs tracking-widest text-primary">
                    #{eq.n}
                  </div>
                  <div className="mt-4 font-display text-2xl leading-tight tracking-wide">
                    {eq.name}
                  </div>
                </div>
                <div className="mt-6 flex items-baseline gap-2 border-t border-border pt-4">
                  <span className="font-display text-4xl">{eq.price}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {eq.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:grid-cols-4">
            {[
              "Atelier propre & sécurisé",
              "Outillage professionnel",
              "Conseils & astuces",
              "Parking gratuit",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                  ✓
                </div>
                <span className="text-sm font-semibold">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VÉHICULES BENTO */}
      <section id="vehicules" className="border-b border-border py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Location & vente
              </div>
              <h2 className="font-display text-5xl tracking-wide lg:text-6xl">
                OCCASIONS SÉLECTIONNÉES
              </h2>
            </div>
            <a
              href="#"
              className="hidden text-[10px] font-bold uppercase tracking-widest text-primary transition-transform hover:translate-x-1 md:block"
            >
              Tout le stock →
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            {/* Featured car */}
            <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:col-span-7 lg:row-span-2">
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary lg:aspect-auto lg:h-[440px]">
                <img
                  src={vehicules[0].img}
                  alt={vehicules[0].name}
                  loading="lazy"
                  width={1000}
                  height={700}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-sm bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  {vehicules[0].badge}
                </span>
              </div>
              <div className="flex items-center justify-between gap-6 p-6">
                <div>
                  <h3 className="font-display text-3xl tracking-wide">
                    {vehicules[0].name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <span>{vehicules[0].year}</span>·<span>{vehicules[0].km}</span>·<span>{vehicules[0].energie}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl text-primary">
                    {vehicules[0].price}
                  </div>
                  <button className="mt-2 rounded-sm bg-ink px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.02]">
                    Détails
                  </button>
                </div>
              </div>
            </article>

            {vehicules.slice(1).map((v) => (
              <article
                key={v.name}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-primary lg:col-span-5"
              >
                <div className="grid grid-cols-[140px_1fr] gap-0">
                  <div className="aspect-square overflow-hidden bg-secondary sm:aspect-auto">
                    <img
                      src={v.img}
                      alt={v.name}
                      loading="lazy"
                      width={280}
                      height={280}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-5">
                    <div>
                      <h3 className="font-display text-xl leading-tight tracking-wide">
                        {v.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        <span>{v.year}</span>·<span>{v.km}</span>·<span>{v.energie}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="font-display text-2xl text-primary">
                        {v.price}
                      </div>
                      <button className="rounded-sm border border-border bg-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary">
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT BENTO */}
      <section id="contact" className="border-b border-border bg-secondary/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 lg:grid-cols-12">
            {/* Big call-out */}
            <div className="relative overflow-hidden rounded-2xl bg-ink p-8 text-white shadow-card lg:col-span-7 lg:p-12">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Nous trouver
              </div>
              <h2 className="mt-4 font-display text-6xl leading-none tracking-wide lg:text-7xl">
                FORBACH<br />
                <span className="text-primary">57600</span>
              </h2>
              <p className="mt-6 max-w-md text-white/70">
                Facile d'accès, parking gratuit. Réservation conseillée pour
                garantir ton créneau — les places partent vite.
              </p>
              <div className="mt-10 space-y-4">
                <ContactRow label="Adresse" value="Forbach (57)" />
                <ContactRow label="Téléphone" value="06 20 43 11 91" />
                <ContactRow label="Horaires" value="Lun — Sam · 08h → 19h" />
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
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

            {/* Form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-5 lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Envoie un message
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  &lt; 24h
                </span>
              </div>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Nom" placeholder="Ton nom" />
                  <InputField label="Téléphone" placeholder="06 XX XX XX XX" />
                </div>
                <InputField label="Email" placeholder="toi@exemple.com" type="email" />
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="mt-1 w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="Ta demande…"
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
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-ink">
              <Logo className="h-7 w-7 object-contain" />
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
