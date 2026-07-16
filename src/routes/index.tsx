import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/cao57-logo.png.asset.json";
import heroWorkshop from "@/assets/hero-workshop.jpg";
import carGolf from "@/assets/car-golf.jpg";
import carClio from "@/assets/car-clio.jpg";
import carBmw from "@/assets/car-bmw.jpg";
import repVidange from "@/assets/repair-vidange.jpg";
import repFreinage from "@/assets/repair-freinage.jpg";
import repDistribution from "@/assets/repair-distribution.jpg";
import repEmbrayage from "@/assets/repair-embrayage.jpg";
import repPneus from "@/assets/repair-pneus.jpg";
import repDiagnostic from "@/assets/repair-diagnostic.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const reparations = [
  { img: repVidange, name: "Vidange & entretien", desc: "Huile, filtres, contrôle complet", price: "Dès 49 €" },
  { img: repFreinage, name: "Freinage", desc: "Plaquettes, disques, purge liquide", price: "Dès 89 €" },
  { img: repDistribution, name: "Distribution", desc: "Courroie, galets, pompe à eau", price: "Sur devis" },
  { img: repEmbrayage, name: "Embrayage", desc: "Diagnostic et remplacement complet", price: "Sur devis" },
  { img: repPneus, name: "Pneumatiques", desc: "Montage, équilibrage, géométrie", price: "Dès 15 €" },
  { img: repDiagnostic, name: "Diagnostic électronique", desc: "Lecture valise multimarques", price: "39 €" },
];

const vehicules = [
  { img: carGolf, name: "Volkswagen Golf VIII R", year: "2022", km: "45 000 km", energie: "Essence", price: "32 900 €", badge: "Coup de cœur" },
  { img: carClio, name: "Renault Clio V TCe 100", year: "2022", km: "18 200 km", energie: "Essence", price: "16 400 €" },
  { img: carBmw, name: "BMW X3 xDrive 30d", year: "2020", km: "65 000 km", energie: "Diesel", price: "41 200 €" },
];

const locations = [
  { name: "Pont élévateur 2 colonnes", cap: "3,6 T · éclairage LED · air comprimé", price: "20 €", unit: "/ heure" },
  { name: "Démonte-pneus & équilibreuse", cap: "Jusqu'à 22\" · matériel professionnel", price: "15 €", unit: "/ heure" },
  { name: "Fosse mécanique", cap: "Éclairage intégré · outillage à disposition", price: "15 €", unit: "/ heure" },
  { name: "Presse hydraulique 45 T", cap: "Roulements, silent-blocs, rotules", price: "10 €", unit: "/ utilisation" },
];

function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="CAO57"
      className={className}
      width={64}
      height={64}
    />
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* MASTHEAD */}
      <header className="border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between gap-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-steel">
            <span>Forbach · Moselle · 57</span>
            <span className="hidden md:inline">Vol. I — Édition {new Date().getFullYear()}</span>
            <a href="tel:+33620431191" className="hover:text-ink">06 20 43 11 91</a>
          </div>
        </div>
        <div className="border-t border-ink/15">
          <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-6 py-8">
            <Link to="/" className="flex items-end gap-4">
              <div className="grid size-14 place-items-center bg-ink">
                <Logo className="h-11 w-11 object-contain" />
              </div>
              <div className="leading-none">
                <div className="font-display text-6xl font-black leading-[0.85] tracking-tight">
                  CAO<span className="italic font-normal text-primary">57</span>
                </div>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-steel">
                  Centre Auto Occasion · Depuis 2009
                </div>
              </div>
            </Link>
            <nav className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink md:flex">
              <a href="#reparations" className="border-b border-transparent pb-1 hover:border-primary">Réparations</a>
              <a href="#vehicules" className="border-b border-transparent pb-1 hover:border-primary">Occasions</a>
              <a href="#atelier" className="border-b border-transparent pb-1 hover:border-primary">Atelier libre</a>
              <a href="#contact" className="border-b border-transparent pb-1 hover:border-primary">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO — feature story */}
      <section className="border-b border-ink/15">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="kicker mb-6">Édito · L'atelier</div>
              <h1 className="font-display text-5xl font-black leading-[0.9] tracking-tight sm:text-6xl lg:text-[5.5rem]">
                Un vrai garage,
                <br />
                <span className="italic font-normal">tenu par des mécaniciens.</span>
              </h1>
              <div className="mt-8 grid gap-6 border-t border-ink/15 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="max-w-xl text-[15px] leading-relaxed text-steel">
                  À Forbach depuis quinze ans, nous entretenons vos voitures,
                  vendons des occasions triées sur le volet, et nous prêtons
                  l'atelier — pont, fosse, démonte-pneus — à celles et ceux
                  qui préfèrent mettre les mains dedans.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#reserver"
                    className="inline-flex items-center justify-center border-2 border-ink bg-ink px-6 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-background hover:bg-background hover:text-ink"
                  >
                    Prendre rendez-vous
                  </a>
                  <a
                    href="tel:+33620431191"
                    className="hidden items-center justify-center border-2 border-ink px-6 py-3 text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-ink hover:text-background sm:inline-flex"
                  >
                    Appeler
                  </a>
                </div>
              </div>
            </div>

            <figure className="lg:col-span-5">
              <div className="overflow-hidden">
                <img
                  src={heroWorkshop}
                  alt="Atelier CAO57 à Forbach"
                  width={900}
                  height={1200}
                  className="aspect-[4/5] w-full grayscale-[15%] object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-start justify-between gap-4 border-t border-ink pt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-steel">
                <span>Photo · Atelier, rue de l'Artisanat, Forbach.</span>
                <span className="text-primary">01</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* SOMMAIRE — three pillars */}
      <section className="border-b border-ink/15 bg-paper/60">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 flex items-baseline justify-between border-b border-ink pb-4">
            <div className="kicker">Sommaire</div>
            <div className="font-display italic text-steel">Trois métiers, un même garage</div>
          </div>
          <ol className="grid gap-0 md:grid-cols-3">
            <SummaryItem
              n="I."
              title="Réparations"
              text="Mécanique toutes marques, entretien, diagnostic."
              href="#reparations"
              page="p. 02"
            />
            <SummaryItem
              n="II."
              title="Véhicules d'occasion"
              text="Sélection contrôlée, historique vérifié, garantie."
              href="#vehicules"
              page="p. 03"
              border
            />
            <SummaryItem
              n="III."
              title="Atelier libre"
              text="Pont, fosse et outillage pro à louer à l'heure."
              href="#atelier"
              page="p. 04"
              border
            />
          </ol>
        </div>
      </section>

      {/* I. RÉPARATIONS */}
      <section id="reparations" className="border-b border-ink/15">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <SectionHeader index="I" kicker="Notre métier premier" title="Réparations & entretien" pull="Devis clair sous 24 h. Toutes marques, pièces d'origine ou équivalentes." />

          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {reparations.map((r, i) => (
              <article key={r.name} className="group flex flex-col">
                <div className="overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="aspect-[4/3] w-full object-cover grayscale-[20%] transition-[filter] duration-500 group-hover:grayscale-0"
                  />
                </div>
                <div className="mt-4 flex items-baseline gap-3 border-b border-ink pb-2">
                  <span className="font-display text-sm italic text-primary">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <h3 className="font-display text-2xl font-bold leading-tight">{r.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-steel">{r.desc}</p>
                <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.22em]">
                  {r.price}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* II. OCCASIONS */}
      <section id="vehicules" className="border-b border-ink/15 bg-paper/60">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <SectionHeader index="II" kicker="Vente" title="Occasions sélectionnées" pull="Chaque véhicule passe une révision complète avant sa mise en vente." />

          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {vehicules.map((v, i) => (
              <article key={v.name} className="flex flex-col">
                <div className="relative overflow-hidden">
                  <img
                    src={v.img}
                    alt={v.name}
                    loading="lazy"
                    width={600}
                    height={450}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {v.badge && (
                    <span className="absolute left-0 top-0 bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-primary-foreground">
                      {v.badge}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-3 border-b border-ink pb-2">
                  <span className="font-display text-sm italic text-primary">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <h3 className="font-display text-xl font-bold leading-tight">{v.name}</h3>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-steel">
                  <div><dt className="text-ink/60">Année</dt><dd className="mt-1">{v.year}</dd></div>
                  <div><dt className="text-ink/60">Km</dt><dd className="mt-1">{v.km}</dd></div>
                  <div><dt className="text-ink/60">Énergie</dt><dd className="mt-1">{v.energie}</dd></div>
                </dl>
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="font-display text-3xl font-bold">{v.price}</div>
                  <a href="#" className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary hover:underline">
                    Fiche →
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 flex items-center justify-between border-t border-ink pt-4">
            <span className="kicker">Tout le parc</span>
            <a href="#" className="font-display italic text-lg hover:text-primary">
              Consulter l'inventaire complet →
            </a>
          </div>
        </div>
      </section>

      {/* III. ATELIER LIBRE */}
      <section id="atelier" className="border-b border-ink/15">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <SectionHeader index="III" kicker="Self-garage" title="L'atelier, à vous." pull="Vous savez faire ? Louez notre équipement à l'heure. Vous économisez jusqu'à 70 % vs un garage classique." />

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <blockquote className="font-display text-3xl italic leading-tight lg:text-4xl">
                « Le pont est libre, l'air comprimé est branché, le café est
                sur la table. Vous n'avez plus qu'à ouvrir votre capot. »
              </blockquote>
              <div className="mt-6 kicker">— Karim, gérant</div>

              <ul className="mt-10 divide-y divide-ink/20 border-y border-ink/20">
                {[
                  "Air comprimé & électricité inclus",
                  "Outillage professionnel à disposition",
                  "Conseils d'un mécanicien sur place",
                  "Parking gratuit, atelier chauffé",
                ].map((f) => (
                  <li key={f} className="flex items-baseline gap-4 py-3 text-sm">
                    <span className="font-display italic text-primary">✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-0 sm:grid-cols-2">
                {locations.map((l, i) => (
                  <div
                    key={l.name}
                    className={
                      "flex flex-col justify-between border-ink/20 p-6 " +
                      (i % 2 === 0 ? "sm:border-r " : "") +
                      (i < 2 ? "border-b " : "sm:border-b-0 border-b")
                    }
                  >
                    <div>
                      <div className="font-display text-sm italic text-primary">
                        № {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="mt-2 font-display text-xl font-bold leading-tight">
                        {l.name}
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-steel">
                        {l.cap}
                      </p>
                    </div>
                    <div className="mt-6 flex items-baseline gap-2 border-t border-ink pt-3">
                      <span className="font-display text-3xl font-bold">{l.price}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-steel">
                        {l.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking */}
          <div id="reserver" className="mt-14 border-t-2 border-ink pt-8">
            <div className="mb-6 flex items-baseline justify-between">
              <div className="kicker">Réservation</div>
              <div className="font-display italic text-steel">Réponse sous 24 h</div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
              <SelectField label="Prestation">
                <option>Réparation / entretien</option>
                <option>Pont élévateur (libre)</option>
                <option>Démonte-pneus (libre)</option>
                <option>Fosse mécanique (libre)</option>
              </SelectField>
              <InputField label="Date" type="date" />
              <SelectField label="Créneau">
                <option>08:00 — 10:00</option>
                <option>10:00 — 12:00</option>
                <option>14:00 — 16:00</option>
                <option>16:00 — 18:00</option>
              </SelectField>
              <button className="self-end border-2 border-ink bg-ink px-8 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-background hover:bg-background hover:text-ink">
                Vérifier
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CHRONIQUES / AVIS */}
      <section className="border-b border-ink/15 bg-paper/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 flex items-baseline justify-between border-b border-ink pb-4">
            <div>
              <div className="kicker">Courrier des lecteurs</div>
              <h2 className="mt-2 font-display text-3xl font-bold">Ce qu'ils en disent</h2>
            </div>
            <div className="font-display text-2xl italic">
              4,9<span className="text-primary">/5</span> · Google
            </div>
          </div>
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
            {[
              { q: "Matériel nickel, ambiance pro. Plaquettes changées en une heure chrono.", a: "Karim", city: "Forbach" },
              { q: "Meilleur rapport qualité-prix du secteur. Honnêtes, francs, efficaces.", a: "Julie", city: "Sarreguemines" },
              { q: "Voiture d'occasion impeccable, prix juste, aucune mauvaise surprise.", a: "Sophie", city: "Metz" },
            ].map((t, i) => (
              <figure key={t.a} className="flex flex-col">
                <span className="font-display text-5xl leading-none italic text-primary">“</span>
                <blockquote className="mt-2 font-display text-lg leading-snug">
                  {t.q}
                </blockquote>
                <figcaption className="mt-6 flex items-baseline justify-between border-t border-ink pt-2 text-[10px] font-semibold uppercase tracking-[0.22em]">
                  <span>{t.a} — {t.city}</span>
                  <span className="text-steel">{String(i + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-b border-ink/15">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <SectionHeader index="IV" kicker="Nous trouver" title="Forbach, 57600." />

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <dl className="divide-y divide-ink/20 border-y border-ink/20">
                <ContactRow label="Adresse" value="Forbach (57), Moselle" />
                <ContactRow label="Téléphone" value="06 20 43 11 91" />
                <ContactRow label="Horaires" value="Lun — Sam · 08h → 19h" />
                <ContactRow label="Diagnostic" value="Sur rendez-vous · 39 €" />
              </dl>

              <a
                href="tel:+33620431191"
                className="mt-8 inline-flex items-center gap-3 border-b-2 border-ink pb-1 font-display text-2xl italic hover:text-primary"
              >
                Appeler l'atelier →
              </a>
            </div>

            <form className="lg:col-span-7">
              <div className="grid gap-6 sm:grid-cols-2">
                <InputField label="Nom" placeholder="Votre nom" />
                <InputField label="Téléphone" placeholder="06 XX XX XX XX" />
              </div>
              <div className="mt-6">
                <InputField label="Email" placeholder="vous@exemple.com" type="email" />
              </div>
              <div className="mt-6">
                <label className="kicker">Message</label>
                <textarea
                  rows={5}
                  className="mt-2 w-full resize-none border-b-2 border-ink bg-transparent px-1 py-2 text-sm outline-none focus:border-primary"
                  placeholder="Votre demande…"
                />
              </div>
              <button
                type="button"
                className="mt-6 border-2 border-ink bg-ink px-8 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-background hover:bg-background hover:text-ink"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* COLOPHON */}
      <footer className="border-t-2 border-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center bg-ink">
              <Logo className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="font-display text-xl font-black leading-none">
                CAO<span className="italic font-normal text-primary">57</span>
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-steel">
                Centre Auto Occasion · Forbach
              </div>
            </div>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-steel">
            © {new Date().getFullYear()} — Ouvert 6 jours sur 7
          </div>
          <div className="flex gap-6 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <a href="#" className="hover:text-primary">Mentions</a>
            <a href="#" className="hover:text-primary">CGV</a>
            <a href="#" className="hover:text-primary">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  index,
  kicker,
  title,
  pull,
}: {
  index: string;
  kicker: string;
  title: string;
  pull?: string;
}) {
  return (
    <div className="grid gap-6 border-b border-ink pb-4 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-1">
        <div className="font-display text-4xl italic text-primary">{index}.</div>
      </div>
      <div className="lg:col-span-6">
        <div className="kicker mb-3">{kicker}</div>
        <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-tight lg:text-5xl">
          {title}
        </h2>
      </div>
      {pull && (
        <p className="max-w-md text-[15px] leading-relaxed text-steel lg:col-span-5 lg:text-right">
          {pull}
        </p>
      )}
    </div>
  );
}

function SummaryItem({
  n,
  title,
  text,
  href,
  page,
  border = false,
}: {
  n: string;
  title: string;
  text: string;
  href: string;
  page: string;
  border?: boolean;
}) {
  return (
    <li className={"flex items-start gap-5 py-6 md:py-2 " + (border ? "md:border-l md:border-ink/20 md:pl-6" : "")}>
      <span className="font-display text-3xl italic text-primary">{n}</span>
      <a href={href} className="group flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-primary">
            {title}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-steel">{page}</span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-steel">{text}</p>
      </a>
    </li>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-4">
      <dt className="kicker">{label}</dt>
      <dd className="font-display text-xl">{value}</dd>
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
      <label className="kicker">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full border-b-2 border-ink bg-transparent px-1 py-2 text-sm outline-none placeholder:text-ink/40 focus:border-primary"
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
      <label className="kicker">{label}</label>
      <select className="mt-2 w-full appearance-none border-b-2 border-ink bg-transparent px-1 py-2 text-sm outline-none focus:border-primary">
        {children}
      </select>
    </div>
  );
}
