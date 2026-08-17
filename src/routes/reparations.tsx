import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/cao57-logo-v4.png.asset.json";
import heroWorkshop from "@/assets/garage-lifts.jpg.asset.json";
import repVidange from "@/assets/repair-vidange.jpg";
import repFreinage from "@/assets/repair-freinage.jpg";
import repDistribution from "@/assets/repair-distribution.jpg";
import repEmbrayage from "@/assets/repair-embrayage.jpg";
import repPneus from "@/assets/repair-pneus.jpg";
import repDiagnostic from "@/assets/repair-diagnostic.jpg";

export const Route = createFileRoute("/reparations")({
  head: () => ({
    meta: [
      { title: "Réparations automobiles — CAO57 Forbach" },
      {
        name: "description",
        content:
          "Entretien et réparations automobiles toutes marques à Forbach : vidange, freinage, distribution, embrayage, pneumatiques et diagnostic électronique.",
      },
      { property: "og:title", content: "Réparations automobiles — CAO57 Forbach" },
      {
        property: "og:description",
        content:
          "Un diagnostic clair, un devis avant travaux et des réparations toutes marques à Forbach.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://centreautooccasion57.com/reparations" }],
  }),
  component: ReparationsPage,
});

const TEL = "06 20 43 11 91";
const TEL_LINK = "tel:+33620431191";

const services = [
  {
    image: repVidange,
    title: "Vidange & entretien",
    description:
      "Vidange moteur, remplacement des filtres et contrôle des principaux organes de sécurité.",
    details: [
      "Huile adaptée constructeur",
      "Filtres huile, air et habitacle",
      "Remise à zéro entretien",
    ],
    price: "Dès 49 €",
  },
  {
    image: repFreinage,
    title: "Freinage",
    description:
      "Contrôle et remise en état du système de freinage pour retrouver sécurité et efficacité.",
    details: ["Plaquettes et disques", "Liquide de frein", "Contrôle étriers et flexibles"],
    price: "Dès 89 €",
  },
  {
    image: repDistribution,
    title: "Distribution",
    description:
      "Remplacement du kit de distribution selon les préconisations de votre constructeur.",
    details: ["Courroie ou chaîne", "Galets et tendeurs", "Pompe à eau si nécessaire"],
    price: "Sur devis",
  },
  {
    image: repEmbrayage,
    title: "Embrayage",
    description: "Diagnostic des symptômes et remplacement des éléments usés de la transmission.",
    details: ["Kit embrayage complet", "Butée hydraulique", "Volant moteur selon contrôle"],
    price: "Sur devis",
  },
  {
    image: repPneus,
    title: "Pneumatiques",
    description: "Montage et entretien de vos pneumatiques pour une tenue de route optimale.",
    details: ["Montage et équilibrage", "Réparation crevaison", "Contrôle usure et pression"],
    price: "Dès 15 €",
  },
  {
    image: repDiagnostic,
    title: "Diagnostic électronique",
    description:
      "Lecture des calculateurs et recherche méthodique de la cause de vos voyants ou pannes.",
    details: ["Lecture multimarques", "Analyse des codes défaut", "Compte rendu avant réparation"],
    price: "39 €",
  },
];

const interventions = [
  {
    icon: "🛢️",
    title: "Entretien courant",
    items: [
      "Vidange moteur",
      "Filtres à huile, air, carburant et habitacle",
      "Bougies d’allumage ou de préchauffage",
      "Révision constructeur",
      "Contrôle des niveaux",
    ],
  },
  {
    icon: "⚙️",
    title: "Moteur & distribution",
    items: [
      "Courroie ou chaîne de distribution",
      "Pompe à eau",
      "Courroie d’accessoires",
      "Recherche de fuite",
      "Joints et périphériques moteur",
    ],
  },
  {
    icon: "🛑",
    title: "Freinage",
    items: [
      "Plaquettes de frein",
      "Disques de frein",
      "Étriers et flexibles",
      "Purge du liquide de frein",
      "Frein à main",
    ],
  },
  {
    icon: "🛞",
    title: "Pneus & trains roulants",
    items: [
      "Montage et équilibrage",
      "Réparation de crevaison",
      "Parallélisme et géométrie",
      "Roulements de roue",
      "Cardans et soufflets",
    ],
  },
  {
    icon: "〰️",
    title: "Suspension & direction",
    items: [
      "Amortisseurs",
      "Ressorts et coupelles",
      "Rotules et biellettes",
      "Triangles et silentblocs",
      "Diagnostic de direction",
    ],
  },
  {
    icon: "❄️",
    title: "Climatisation & refroidissement",
    items: [
      "Recharge de climatisation",
      "Recherche de fuite",
      "Radiateur et durites",
      "Thermostat et calorstat",
      "Circuit de refroidissement",
    ],
  },
  {
    icon: "🔋",
    title: "Électricité & diagnostic",
    items: [
      "Lecture et effacement des défauts",
      "Recherche de panne électrique",
      "Batterie et alternateur",
      "Démarreur",
      "Éclairage et capteurs",
    ],
  },
  {
    icon: "💨",
    title: "Échappement & antipollution",
    items: [
      "Ligne d’échappement",
      "Catalyseur et filtre à particules",
      "Vanne EGR",
      "Sondes lambda",
      "Diagnostic antipollution",
    ],
  },
  {
    icon: "🚘",
    title: "Embrayage & transmission",
    items: [
      "Kit embrayage",
      "Volant moteur",
      "Butée hydraulique",
      "Vidange de boîte",
      "Diagnostic de transmission",
    ],
  },
];

function ReparationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden bg-carbon text-white">
          <img
            src={heroWorkshop.url}
            alt="Atelier mécanique CAO57 à Forbach"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/85 to-carbon/25" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="max-w-3xl">
              <div className="eyebrow mb-4 !text-white/70">Garage automobile · Forbach</div>
              <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Réparations &<br />
                <span className="text-racing">entretien.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75">
                Nous entretenons et réparons les véhicules de toutes marques. Diagnostic expliqué,
                devis validé avant intervention et pièces d&apos;origine ou équivalentes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/devis"
                  className="rounded-sm bg-racing px-7 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90"
                >
                  Demander un devis
                </Link>
                <a
                  href="#prestations"
                  className="rounded-sm border border-white/30 px-7 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-carbon"
                >
                  Voir les prestations
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-smoke">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
            {[
              ["Toutes marques", "Essence, diesel, hybride"],
              ["Devis clair", "Validé avant travaux"],
              ["Pièces garanties", "Origine ou équivalent"],
              ["Réponse rapide", "Sous 24 heures"],
            ].map(([title, text]) => (
              <div key={title} className="px-5 py-6">
                <div className="font-display text-sm font-bold uppercase tracking-wide">
                  {title}
                </div>
                <div className="mt-1 text-xs text-steel">{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="prestations" className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-2xl">
              <div className="eyebrow mb-3">Nos prestations</div>
              <h2 className="font-display text-4xl font-black leading-tight lg:text-5xl">
                Le bon entretien, au bon moment.
              </h2>
              <p className="mt-4 leading-relaxed text-steel">
                Une prise en charge complète, de l&apos;entretien courant aux réparations mécaniques
                plus importantes.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="group flex flex-col overflow-hidden rounded-md border border-border bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute right-3 top-3 rounded-sm bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                      {service.price}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-bold">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-steel">{service.description}</p>
                    <ul className="mt-5 space-y-2 border-t border-border pt-4 text-[13px]">
                      {service.details.map((detail) => (
                        <li key={detail} className="flex gap-2">
                          <span className="font-bold text-racing">✓</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/devis"
                      search={{ service: service.title }}
                      className="mt-6 inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-racing hover:gap-2"
                    >
                      Demander un devis →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-smoke">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-3xl">
              <div className="eyebrow mb-3">Catalogue atelier</div>
              <h2 className="font-display text-4xl font-black leading-tight lg:text-5xl">
                Toutes les interventions disponibles
              </h2>
              <p className="mt-4 leading-relaxed text-steel">
                Retrouvez les principales opérations réalisées dans notre atelier. Pour une
                intervention absente de cette liste, contactez-nous : nous vous confirmerons
                rapidement sa prise en charge.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {interventions.map((category) => (
                <article
                  key={category.title}
                  className="rounded-md border border-border bg-white p-6 transition hover:border-racing hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-sm bg-smoke text-xl"
                    >
                      {category.icon}
                    </span>
                    <h3 className="font-display text-lg font-bold leading-tight">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="mt-5 space-y-2.5 text-[13px] text-steel">
                    {category.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="font-bold text-racing">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/devis"
                    search={{ service: category.title }}
                    className="mt-6 inline-flex text-[11px] font-bold uppercase tracking-wider text-racing hover:underline"
                  >
                    Demander un devis →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-carbon text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 md:grid-cols-[1fr_auto]">
            <div>
              <div className="eyebrow mb-3 !text-white/60">Besoin d&apos;un diagnostic ?</div>
              <h2 className="font-display text-4xl font-black">
                Un bruit, un voyant ou une panne ?
              </h2>
              <p className="mt-3 max-w-2xl text-white/70">
                Appelez-nous pour décrire votre problème. Nous vous proposerons le créneau et la
                prise en charge adaptés.
              </p>
            </div>
            <a
              href={TEL_LINK}
              className="inline-flex justify-center rounded-sm bg-racing px-7 py-4 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90"
            >
              ☏ {TEL}
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <>
      <div className="bg-carbon text-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[11px]">
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">📍 2 Allée des Cyprès · 57600 Forbach</span>
            <span className="hidden md:inline">Ouvert lun. — sam. · 08h → 19h</span>
          </div>
          <a href={TEL_LINK} className="hover:text-white">
            ☏ {TEL}
          </a>
        </div>
      </div>

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
            <Link to="/reparations" className="text-racing">
              Réparations
            </Link>
            <Link to="/occasions" className="hover:text-racing">
              Occasions
            </Link>
            <Link to="/atelier" className="hover:text-racing">
              Atelier libre
            </Link>
            <Link to="/" hash="contact" className="hover:text-racing">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/compte"
              className="inline-flex items-center rounded-sm border border-carbon bg-carbon px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-carbon/85"
            >
              Connexion
            </Link>
            <Link
              to="/devis"
              className="hidden items-center gap-2 rounded-sm bg-racing px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90 sm:inline-flex"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 py-8 text-[11px] uppercase tracking-wider md:flex-row">
        <span>© {new Date().getFullYear()} CAO57 — Centre Auto Occasion 57 · Forbach</span>
        <div className="flex gap-5">
          <a href={TEL_LINK} className="hover:text-white">
            {TEL}
          </a>
          <Link to="/" className="hover:text-white">
            Accueil
          </Link>
        </div>
      </div>
    </footer>
  );
}
