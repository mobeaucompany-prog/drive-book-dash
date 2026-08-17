import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import logoAsset from "@/assets/cao57-logo-v4.png.asset.json";
import { annonces, type Annonce } from "@/data/annonces";

export const Route = createFileRoute("/occasions")({
  head: () => ({
    meta: [
      { title: "Occasions auto — CAO57 Forbach · Véhicules d'occasion garantis" },
      {
        name: "description",
        content:
          "Découvrez nos véhicules d'occasion à Forbach : Volkswagen, Citroën. Photos, prix, kilométrage et entretien complet. Garantie 6 mois incluse.",
      },
      { property: "og:title", content: "Occasions auto — CAO57 Forbach" },
      {
        property: "og:description",
        content: "Véhicules d'occasion révisés et garantis à Forbach. VW Polo, Citroën C4 et plus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://centreautooccasion57.com/occasions" }],
  }),
  component: OccasionsPage,
});

const TEL = "06 20 43 11 91";
const TEL_LINK = "tel:+33620431191";

const fr = (n: number) => n.toLocaleString("fr-FR");

function OccasionsPage() {
  const [q, setQ] = useState("");
  const [energie, setEnergie] = useState("Toutes");
  const [boite, setBoite] = useState("Toutes");
  const [prixMax, setPrixMax] = useState("");
  const [anneeMin, setAnneeMin] = useState("");
  const [tri, setTri] = useState("recent");
  const [selection, setSelection] = useState<Annonce | null>(null);

  const resultats = useMemo(() => {
    let liste = annonces.filter((a) => {
      const texte = (a.titre + " " + a.marque + " " + a.description).toLowerCase();
      if (q && !texte.includes(q.toLowerCase())) return false;
      if (energie !== "Toutes" && a.energie !== energie) return false;
      if (boite !== "Toutes" && a.boite !== boite) return false;
      if (prixMax && a.prix > Number(prixMax)) return false;
      if (anneeMin && a.annee < Number(anneeMin)) return false;
      return true;
    });

    liste = [...liste].sort((a, b) => {
      if (tri === "prix-asc") return a.prix - b.prix;
      if (tri === "prix-desc") return b.prix - a.prix;
      if (tri === "km-asc") return a.km - b.km;
      return b.annee - a.annee;
    });

    return liste;
  }, [q, energie, boite, prixMax, anneeMin, tri]);

  const reset = () => {
    setQ("");
    setEnergie("Toutes");
    setBoite("Toutes");
    setPrixMax("");
    setAnneeMin("");
    setTri("recent");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="border-b border-border bg-carbon text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="eyebrow mb-3 !text-white/70">Vente · Occasions</div>
          <h1 className="font-display text-4xl font-black leading-tight lg:text-5xl">
            Nos véhicules d'occasion
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Chaque véhicule passe une révision complète dans notre atelier avant sa mise en vente.
            Factures disponibles, aucun frais à prévoir.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl gap-8 px-6 py-10 lg:grid lg:grid-cols-[280px_1fr]">
        <aside className="mb-8 lg:mb-0">
          <div className="rounded-md border border-border bg-white p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide">Filtres</h2>
              <button
                onClick={reset}
                className="text-[11px] font-semibold uppercase tracking-wider text-racing hover:underline"
              >
                Réinitialiser
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <FilterField label="Recherche">
                <input
                  className="input"
                  placeholder="Marque, modèle…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </FilterField>

              <FilterField label="Énergie">
                <select
                  className="input"
                  value={energie}
                  onChange={(e) => setEnergie(e.target.value)}
                >
                  {["Toutes", "Essence", "Diesel", "Hybride", "Électrique"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </FilterField>

              <FilterField label="Boîte de vitesses">
                <select className="input" value={boite} onChange={(e) => setBoite(e.target.value)}>
                  {["Toutes", "Manuelle", "Automatique"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </FilterField>

              <FilterField label="Prix maximum (€)">
                <input
                  type="number"
                  className="input"
                  placeholder="Ex : 10000"
                  value={prixMax}
                  onChange={(e) => setPrixMax(e.target.value)}
                />
              </FilterField>

              <FilterField label="Année minimum">
                <input
                  type="number"
                  className="input"
                  placeholder="Ex : 2010"
                  value={anneeMin}
                  onChange={(e) => setAnneeMin(e.target.value)}
                />
              </FilterField>
            </div>
          </div>
        </aside>

        <main>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-steel">
              <span className="font-bold text-ink">{resultats.length}</span>{" "}
              {resultats.length > 1 ? "annonces" : "annonce"}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-steel">Trier par</span>
              <select
                className="input !w-auto !py-2"
                value={tri}
                onChange={(e) => setTri(e.target.value)}
              >
                <option value="recent">Plus récentes</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="km-asc">Kilométrage croissant</option>
              </select>
            </label>
          </div>

          {resultats.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-smoke p-12 text-center text-steel">
              Aucune annonce ne correspond à ces critères.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {resultats.map((a) => (
                <AnnonceCard key={a.id} a={a} onOpen={() => setSelection(a)} />
              ))}
            </div>
          )}
        </main>
      </div>

      <SiteFooter />

      {selection && <FicheModal a={selection} onClose={() => setSelection(null)} />}
    </div>
  );
}

function AnnonceCard({ a, onOpen }: { a: Annonce; onOpen: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const hasGallery = a.images.length > 1;

  const showPrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setImgIndex((current) => (current - 1 + a.images.length) % a.images.length);
  };

  const showNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setImgIndex((current) => (current + 1) % a.images.length);
  };

  return (
    <article
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      className="group flex flex-col overflow-hidden rounded-md border border-border bg-white text-left transition hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-smoke">
        <CarImage
          src={a.images[imgIndex]}
          alt={a.titre}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {a.badge && (
          <span className="absolute left-3 top-3 rounded-sm bg-racing px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {a.badge}
          </span>
        )}
        {hasGallery && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-xl font-bold text-white shadow-lg transition hover:scale-105 hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={`Photo précédente de ${a.titre}`}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-xl font-bold text-white shadow-lg transition hover:scale-105 hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={`Photo suivante de ${a.titre}`}
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
              {imgIndex + 1} / {a.images.length}
            </span>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {a.images.map((_, index) => (
                <span
                  key={index}
                  className={`block size-1.5 rounded-full shadow ${
                    index === imgIndex ? "bg-white" : "bg-white/45"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="font-display text-2xl font-black">{fr(a.prix)} €</div>
        <h3 className="mt-1 font-display text-base font-bold leading-tight">{a.titre}</h3>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-steel">
          <li>{a.annee}</li>
          <li>· {fr(a.km)} km</li>
          <li>· {a.energie}</li>
          <li>· {a.boite}</li>
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px] text-steel">
          <span>
            📍 {a.ville} ({a.cp})
          </span>
          <span>{a.publieLe}</span>
        </div>
      </div>
    </article>
  );
}

function FicheModal({ a, onClose }: { a: Annonce; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const hasGallery = a.images.length > 1;

  const previousImage = () => {
    setImgIndex((current) => (current - 1 + a.images.length) % a.images.length);
  };

  const nextImage = () => {
    setImgIndex((current) => (current + 1) % a.images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-md bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-lg font-bold text-ink shadow hover:bg-white"
          aria-label="Fermer"
        >
          ✕
        </button>

        <div className="overflow-hidden rounded-t-md">
          <div className="relative aspect-[16/10] bg-smoke">
            <CarImage
              src={a.images[imgIndex]}
              alt={a.titre}
              className="h-full w-full object-cover"
            />
            {hasGallery && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-3xl font-bold text-white shadow-xl transition hover:scale-105 hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Afficher la photo précédente"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-3xl font-bold text-white shadow-xl transition hover:scale-105 hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Afficher la photo suivante"
                >
                  ›
                </button>
                <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-bold tracking-wider text-white">
                  {imgIndex + 1} / {a.images.length}
                </span>
              </>
            )}
          </div>
          {hasGallery && (
            <div className="flex gap-2 overflow-x-auto bg-carbon p-3">
              {a.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={
                    "h-16 w-24 shrink-0 overflow-hidden rounded-sm border-2 " +
                    (i === imgIndex
                      ? "border-racing"
                      : "border-transparent opacity-70 hover:opacity-100")
                  }
                >
                  <CarImage src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-black leading-tight">{a.titre}</h2>
              <p className="mt-1 text-sm text-steel">
                📍 {a.ville} ({a.cp}) · {a.publieLe}
              </p>
            </div>
            <div className="font-display text-3xl font-black text-racing">{fr(a.prix)} €</div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
            <Spec label="Année" value={String(a.annee)} />
            <Spec label="Kilométrage" value={fr(a.km) + " km"} />
            <Spec label="Énergie" value={a.energie} />
            <Spec label="Boîte" value={a.boite} />
          </div>

          <div className="mt-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide">Description</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-steel">
              {a.description}
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {a.equipements.length > 0 && (
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wide">
                  Équipements
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-steel">
                  {a.equipements.map((e) => (
                    <li key={e}>✅ {e}</li>
                  ))}
                </ul>
              </div>
            )}
            {a.entretien.length > 0 && (
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wide">
                  Entretien effectué
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-steel">
                  {a.entretien.map((e) => (
                    <li key={e}>✔️ {e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
            <a
              href={TEL_LINK}
              className="rounded-sm bg-racing px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90"
            >
              ☏ Appeler — {TEL}
            </a>
            <Link
              to="/"
              hash="contact"
              className="rounded-sm border-2 border-ink px-6 py-3 text-[12px] font-bold uppercase tracking-wider hover:bg-ink hover:text-white"
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-steel">{label}</div>
      <div className="mt-1 font-display text-base font-bold">{value}</div>
    </div>
  );
}

function CarImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className={
          (className || "") +
          " flex items-center justify-center bg-smoke text-[11px] font-semibold uppercase tracking-wider text-steel"
        }
      >
        Photo à venir
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />;
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-steel">
        {label}
      </span>
      {children}
    </label>
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
          <div className="flex items-center gap-5">
            <a href={TEL_LINK} className="hover:text-white">
              ☏ {TEL}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center">
            <img src={logoAsset.url} alt="CAO57" className="w-auto" style={{ height: "4.5rem" }} />
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-ink md:flex">
            <Link to="/reparations" className="hover:text-racing">
              Réparations
            </Link>
            <Link to="/occasions" className="text-racing">
              Occasions
            </Link>
            <Link to="/atelier" className="hover:text-racing">
              Atelier libre
            </Link>
            <a href="/#contact" className="hover:text-racing">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/atelier"
              className="inline-flex items-center rounded-sm border border-carbon bg-carbon px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-carbon/85"
            >
              Connexion
            </Link>
            <a
              href={TEL_LINK}
              className="hidden items-center gap-2 rounded-sm bg-racing px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90 sm:inline-flex"
            >
              Prendre RDV
            </a>
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
