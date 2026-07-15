import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/cao57-logo.png.asset.json";
import heroWorkshop from "@/assets/hero-workshop.jpg";
import carGolf from "@/assets/car-golf.jpg";
import carClio from "@/assets/car-clio.jpg";
import carBmw from "@/assets/car-bmw.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const services = [
  { id: "garage", label: "Self-Garage", desc: "Ponts & outillage pro" },
  { id: "pneus", label: "Pneus", desc: "Montage & équilibrage" },
  { id: "location", label: "Location", desc: "Voitures 24h/24h" },
  { id: "vente", label: "Vente", desc: "Occasions sélectionnées" },
];

const equipements = [
  {
    n: "01",
    name: "Pont élévateur 2 colonnes",
    price: "20",
    unit: "€ / h",
    detail: "Capacité 3.6 T · éclairage LED · air comprimé inclus",
  },
  {
    n: "02",
    name: "Machine à pneus pro",
    price: "15",
    unit: "€ / h",
    detail: "Démonte-pneu auto · jantes jusqu'à 22\" · runflat OK",
  },
  {
    n: "03",
    name: "Équilibreuse de roues",
    price: "10",
    unit: "€ / roue",
    detail: "Démontage + équilibrage · plombs fournis",
  },
  {
    n: "04",
    name: "Fosse de mécanique",
    price: "15",
    unit: "€ / h",
    detail: "Accès complet châssis · éclairage antidéflagrant",
  },
  {
    n: "05",
    name: "Presse hydraulique 45 T",
    price: "10",
    unit: "€ / util.",
    detail: "Roulements, silent-blocs · kits d'extraction",
  },
  {
    n: "06",
    name: "Compresseur & outillage",
    price: "Inclus",
    unit: "",
    detail: "Servante complète + air comprimé sur chaque poste",
  },
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
            <Logo className="h-12 w-12 object-contain" />
            <span className="font-display text-xl tracking-tight">
              CAO<span className="text-primary">57</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground md:flex">
            <a href="#services" className="transition-colors hover:text-primary">
              Services
            </a>
            <a href="#equipements" className="transition-colors hover:text-primary">
              Équipements
            </a>
            <a href="#vehicules" className="transition-colors hover:text-primary">
              Véhicules
            </a>
            <a href="#contact" className="transition-colors hover:text-primary">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden border border-border bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary sm:block">
              Mon compte
            </button>
            <a
              href="#reserver"
              className="bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]"
            >
              Réserver
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Forbach · Moselle 57
            </span>
            <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              LOUE TON GARAGE
              <br />
              <span className="text-primary">À PETIT PRIX.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Répare ta voiture toi-même avec du matériel pro : pont élévateur,
              machine à pneus, fosse mécanique. Économise jusqu'à{" "}
              <span className="font-bold text-foreground">70%</span> sur tes
              réparations.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#reserver"
                className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]"
              >
                Réserver un pont
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#vehicules"
                className="inline-flex items-center gap-3 border border-border bg-secondary px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                Voir les véhicules
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div>
                <div className="font-display text-3xl">70%</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  d'économies
                </div>
              </div>
              <div>
                <div className="font-display text-3xl">6j/7</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Ouvert
                </div>
              </div>
              <div>
                <div className="font-display text-3xl">
                  4.9<span className="text-primary">/5</span>
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Avis clients
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden border border-border bg-card">
              <img
                src={heroWorkshop}
                alt="Atelier CAO57 avec pont élévateur et éclairage rouge"
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary p-6 shadow-2xl">
              <div className="font-display text-4xl leading-none">
                20€
                <span className="text-lg text-primary-foreground/70">/h</span>
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/80">
                Pont élévateur
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES / RÉSERVATION QUICK */}
      <section id="services" className="border-b border-border bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Nos 4 activités
              </div>
              <h2 className="font-display text-4xl tracking-tight lg:text-5xl">
                UN SEUL CENTRE.
                <br />
                <span className="text-primary">TOUT POUR TA VOITURE.</span>
              </h2>
            </div>
          </div>

          <div id="reserver" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <button
                key={s.id}
                className={`group flex flex-col items-start border p-6 text-left transition-all hover:border-primary hover:bg-secondary ${
                  i === 0
                    ? "border-primary bg-secondary shadow-racing"
                    : "border-border bg-card"
                }`}
              >
                <span className="mb-6 font-display text-xs tracking-widest text-primary">
                  0{i + 1}
                </span>
                <span className="font-display text-2xl tracking-tight">
                  {s.label}
                </span>
                <span className="mt-2 text-sm text-muted-foreground">
                  {s.desc}
                </span>
                <span className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Réserver
                  <span>→</span>
                </span>
              </button>
            ))}
          </div>

          {/* Booking bar */}
          <div className="mt-8 border border-border bg-card">
            <div className="border-b border-border p-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Vérifie ma disponibilité
              </span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Équipement
                </label>
                <select className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
                  <option>Pont élévateur 2 colonnes</option>
                  <option>Machine à pneus + équilibreuse</option>
                  <option>Fosse mécanique</option>
                  <option>Presse hydraulique</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Créneau
                </label>
                <select className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
                  <option>08:00 — 10:00</option>
                  <option>10:00 — 12:00</option>
                  <option>14:00 — 16:00</option>
                  <option>16:00 — 18:00</option>
                </select>
              </div>
              <button className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]">
                Réserver
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ÉQUIPEMENTS & TARIFS */}
      <section id="equipements" className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-l-2 border-primary pl-6">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Nos tarifs d'ouverture
              </div>
              <h2 className="font-display text-4xl tracking-tight lg:text-5xl">
                MATÉRIEL <span className="text-chrome">PRO</span> À TA
                DISPOSITION
              </h2>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Places limitées · Réserve dès maintenant
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {equipements.map((eq) => (
              <div
                key={eq.n}
                className="group flex flex-col justify-between bg-card p-8 transition-colors hover:bg-secondary"
              >
                <div>
                  <div className="mb-6 font-display text-xs tracking-widest text-primary">
                    #{eq.n}
                  </div>
                  <h3 className="font-display text-2xl leading-tight tracking-tight">
                    {eq.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {eq.detail}
                  </p>
                </div>
                <div className="mt-8 flex items-baseline gap-2 border-t border-border pt-6">
                  <span className="font-display text-4xl">{eq.price}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {eq.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 border border-border bg-card p-6 sm:grid-cols-3">
            {[
              "Atelier propre & sécurisé",
              "Conseils & astuces disponibles",
              "Parking gratuit",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="grid size-8 place-items-center border border-primary/30 bg-primary/10 text-primary">
                  ✓
                </div>
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VÉHICULES */}
      <section id="vehicules" className="border-b border-border bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center gap-4">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Location & vente
              </div>
              <h2 className="font-display text-4xl tracking-tight lg:text-5xl">
                OCCASIONS <span className="text-primary">SÉLECTIONNÉES</span>
              </h2>
            </div>
            <div className="ml-auto h-px flex-1 bg-border" />
            <a
              href="#"
              className="text-[10px] font-bold uppercase tracking-widest text-primary transition-transform hover:translate-x-1"
            >
              Tout le stock →
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicules.map((v) => (
              <article
                key={v.name}
                className="group overflow-hidden border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={v.img}
                    alt={v.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {v.badge && (
                    <span className="absolute left-4 top-4 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      {v.badge}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl leading-tight tracking-tight">
                      {v.name}
                    </h3>
                    <span className="whitespace-nowrap font-display text-lg text-primary">
                      {v.price}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
                    <Spec label="Année" value={v.year} />
                    <Spec label="Km" value={v.km} />
                    <Spec label="Énergie" value={v.energie} />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <button className="border border-border bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary">
                      Louer
                    </button>
                    <button className="bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-[1.02]">
                      Acheter
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-b border-border py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Nous trouver
            </div>
            <h2 className="font-display text-5xl leading-none tracking-tight lg:text-6xl">
              FORBACH
              <br />
              <span className="text-primary">57600</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Facile d'accès, parking gratuit. Réservation conseillée pour
              garantir ton créneau — les places partent vite.
            </p>

            <div className="mt-10 space-y-6">
              <ContactRow label="Adresse" value="Forbach (57) · Moselle Est" />
              <ContactRow label="Téléphone" value="06 20 43 11 91" />
              <ContactRow label="Horaires" value="Lun — Sam · 08:00 → 19:00" />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="tel:+33620431191"
                className="bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.02]"
              >
                Appeler
              </a>
              <a
                href="#reserver"
                className="border border-border bg-secondary px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                Réserver en ligne
              </a>
            </div>
          </div>

          <div className="border border-border bg-card p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Envoie un message
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Réponse &lt; 24h
              </span>
            </div>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom" placeholder="Ton nom" />
                <Field label="Téléphone" placeholder="06 XX XX XX XX" />
              </div>
              <Field label="Email" placeholder="toi@exemple.com" type="email" />
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="mt-1 w-full resize-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="Ta demande…"
                />
              </div>
              <button
                type="button"
                className="w-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-racing transition-transform hover:scale-[1.01]"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10 object-contain" />
            <span className="font-display tracking-tight">
              CAO<span className="text-primary">57</span>
            </span>
          </div>
          <div className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Centre Auto Occasion 57 · Forbach · Ouvert 6j/7
          </div>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              Mentions légales
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              CGV
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-6 border-b border-border pb-6">
      <div className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
        {label}
      </div>
      <div className="font-display text-xl tracking-tight">{value}</div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
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
        className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
