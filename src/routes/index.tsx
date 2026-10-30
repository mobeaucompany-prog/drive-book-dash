import { useLanguage, LanguageSwitch } from "@/lib/i18n/context";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  MapPin,
  Clock3,
  Menu,
  X,
  Check,
  CircleDot,
  Wrench,
  Snowflake,
  Coffee,
  Wifi,
  ShieldCheck,
  CarFront,
} from "lucide-react";
import tyreImage from "@/assets/repair-pneus.jpg";
import { TyreAvailability } from "@/components/TyreAvailability";
import { Brand } from "@/components/Brand";
import { LegalLinks } from "@/components/LegalLinks";

const phone = "tel:+33620431191";
const directions =
  "https://www.google.com/maps/dir/?api=1&destination=2+All%C3%A9e+des+Cypr%C3%A8s+57600+Forbach";
const prices = [50, 60, 70, 80, 100, 120, 130, 150];
const description =
  "Pneus neufs et d’occasion, montage, équilibrage et mécanique à Forbach. Dès 50 € la paire montée et équilibrée. Ouvert 7j/7 de 8h à 20h.";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pneus du Bruch — Pneus & mécanique à Forbach" },
      { name: "description", content: description },
      { property: "og:title", content: "Pneus du Bruch · Forbach" },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://pneusdubruch.com/" },
      { property: "og:image", content: "https://pneusdubruch.com/images/atelier-forbach-og.jpg" },
      { name: "twitter:image", content: "https://pneusdubruch.com/images/atelier-forbach-og.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://pneusdubruch.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          name: "Pneus du Bruch",
          telephone: "+33620431191",
          url: "https://pneusdubruch.com",
          image: "https://pneusdubruch.com/images/atelier-forbach.jpg",
          address: {
            "@type": "PostalAddress",
            streetAddress: "2 Allée des Cyprès",
            postalCode: "57600",
            addressLocality: "Forbach",
            addressCountry: "FR",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "08:00",
              closes: "20:00",
            },
          ],
          availableLanguage: ["French", "German"],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, locale } = useLanguage();
  const [menu, setMenu] = useState(false);
  const [diameter, setDiameter] = useState(16);
  const links = [
    ["#pneus", "Nos pneus"],
    ["#tarifs", "Les tarifs"],
    ["#mecanique", "Mécanique"],
    ["#contact", "Nous trouver"],
  ];
  return (
    <div className="bruch-site">
      <a className="skip-link" href="#contenu">{t(" Aller au contenu ")}</a>
      <div className="utility">
        <div className="wrap utility-inner">
          <span>
            <MapPin size={13} /> Forbach · 2 Allée des Cyprès
          </span>
          <span>
            <span className="status-dot" />{t(" 7j/7 · 8h–20h")}{" "}
            <b className="utility-language" lang="de">
              Wir sprechen Deutsch
            </b>
          </span>
        </div>
      </div>
      <header className="bruch-header">
        <div className="wrap nav-inner">
          <Link to="/" aria-label={t("Pneus du Bruch, accueil")}>
            <Brand />
          </Link>
          <nav className="desktop-nav" aria-label={t("Navigation principale")}>
            {links.map(([href, label]) => (
              <a href={href} key={href}>
                {t(label)}
              </a>
            ))}
          </nav>
          <LanguageSwitch />
          <a className="nav-phone" aria-label={t("Appeler le 06 20 43 11 91")} href={phone}>
            <Phone size={16} /> <span>06 20 43 11 91</span>
          </a>
          <button
            className="menu-toggle"
            aria-label={menu ? t("Fermer le menu") : t("Ouvrir le menu")}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <nav id="mobile-nav" className="mobile-nav" aria-label={t("Navigation mobile")}>
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenu(false)}>
                {t(label)}
                <ArrowUpRight size={16} />
              </a>
            ))}
            <Link to="/devis" onClick={() => setMenu(false)}>{t(" Demander un devis ")}</Link>
          </nav>
        )}
      </header>
      <main id="contenu">
        <section className="bruch-hero">
          <div className="hero-photo">
            <img
              src="/images/atelier-forbach.webp"
              width={1206}
              height={1589}
              alt={t("L’atelier à Forbach et ses stocks de pneus")}
              fetchPriority="high"
            />
            <div className="photo-caption">
              <span className="status-dot" />{t(" VOTRE ATELIER À FORBACH ")}<span>57 / MOSELLE</span>
            </div>
          </div>
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <p className="kicker">
                <span />{t(" PNEUS · MONTAGE · MÉCANIQUE ")}</p>
              <h1>{t(" La bonne route. ")}<br />{t(" Au ")}<em>{t("bon prix.")}</em>
              </h1>
              <p className="hero-description">{t(" Neufs ou d’occasion, trouvez les pneus qu’il vous faut. Le montage, l’équilibrage et le conseil en plus. À Forbach, tout simplement. ")}</p>
              <div className="hero-actions">
                <a href="#tarifs" className="bruch-button blue">{t(" Découvrir nos tarifs ")}<ArrowUpRight size={18} />
                </a>
                <Link to="/devis" search={{ service: "Pneus d’occasion" }} className="text-link">{t(" Demander un devis ")}<ArrowRight size={17} />
                </Link>
              </div>
              <div className="hero-proof">
                <span>
                  <Check />{t(" Montage & équilibrage compris* ")}</span>
                <span>
                  <Check />{t(" Avec ou sans rendez-vous ")}</span>
              </div>
            </div>
          </div>
          <a className="hero-price" href="#tarifs">
            <span>{t("PNEUS D’OCCASION")}</span>
            <div>
              <small>{t("dès")}</small> 50<sup>€</sup>
            </div>
            <p>{t(" la paire montée & équilibrée ")}<ArrowUpRight size={20} />
            </p>
          </a>
        </section>
        <div className="service-strip">
          <div className="wrap strip-inner">
            <span>
              <CircleDot />{t(" Neufs & occasion ")}</span>
            <span>
              <CarFront />{t(" Toutes marques ")}</span>
            <span>
              <Clock3 />{t(" Ouvert 7 jours sur 7 ")}</span>
            <span lang="de">
              DE <b>Wir sprechen Deutsch</b>
            </span>
          </div>
        </div>
        <section id="pneus" className="section wrap">
          <div className="section-heading">
            <div>
              <p className="kicker">{t("01 / VOTRE ROUTE, VOTRE CHOIX")}</p>
              <h2>{t(" De bons pneus. ")}<br />
                <span>{t("Pour chaque budget.")}</span>
              </h2>
            </div>
            <p>{t(" Voitures, SUV, 4×4 ou utilitaires : une solution adaptée à votre véhicule, à votre usage et à votre budget. ")}</p>
          </div>
          <div className="tyre-grid">
            <article className="used-card">
              <span className="pill">{t("LE CHOIX MALIN")}</span>
              <h3>{t(" L’occasion. ")}<br />{t(" La qualité d’abord. ")}</h3>
              <p>{t(" Des pneus testés et contrôlés, disponibles à l’unité ou par paire, selon les stocks. ")}</p>
              <ul>
                {[
                  "Toutes tailles, toutes marques",
                  "Été, hiver et 4 saisons",
                  "Plusieurs états et profils disponibles",
                  "Montage & équilibrage compris",
                ].map((benefit) => (
                  <li key={benefit}>
                    <Check />
                    {t(benefit)}
                  </li>
                ))}
              </ul>
              <a href="#tarifs" className="text-link">{t(" Voir les prix par dimension ")}<ArrowUpRight size={18} />
              </a>
              <CircleDot className="tyre-watermark" aria-hidden="true" />
            </article>
            <article className="new-card">
              <img src={tyreImage} alt={t("Montage de pneumatiques en atelier")} loading="lazy" width={800} height={600} />
              <div>
                <span className="pill">{t("UN GRAND CHOIX")}</span>
                <h3>{t(" Le neuf. ")}<br />{t("À votre mesure. ")}</h3>
                <p>{t("Été, hiver, 4 saisons, runflat ou renforcés. Toutes marques, montage compris.")}</p>
                <Link to="/devis" search={{ service: "Pneus neufs" }} className="text-link">{t(" Trouver mes pneus ")}<ArrowUpRight size={18} />
                </Link>
              </div>
            </article>
          </div>
          <div className="brands">
            <span>{t("LES MARQUES QUE VOUS CONNAISSEZ")}</span>
            <div>
              <b>MICHELIN</b>
              <b>Continental</b>
              <b>GOODYEAR</b>
              <b>BRIDGESTONE</b>
              <b>PIRELLI</b>
              <b>Hankook</b>
            </div>
            <p>{t("Et aussi Vredestein, Uniroyal et bien d’autres.")}</p>
          </div>
        </section>
        <section id="tarifs" className="pricing-section">
          <div className="wrap section">
            <div className="section-heading">
              <div>
                <p className="kicker">{t("02 / LES PRIX, EN CLAIR")}</p>
                <h2>{t(" Petit budget. ")}<br />
                  <span>{t("Grande tranquillité.")}</span>
                </h2>
              </div>
              <p>{t(" Pneus d’occasion montés et équilibrés : choisissez votre diamètre pour retrouver le tarif affiché sur notre offre. ")}</p>
            </div>
            <div className="pricing-grid">
              <div className="price-selector">
                <div className="selector-title">
                  <h3>{t("Quelle est votre dimension ?")}</h3>
                  <span>{t("DIAMÈTRE EN POUCES")}</span>
                </div>
                <div className="diameters" role="group" aria-label={t("Diamètre de vos pneus")}>
                  {Array.from({length:11}, (_, i) => (
                    <button
                      key={i}
                      aria-pressed={diameter === i + 13}
                      onClick={() => setDiameter(i + 13)}
                    >
                      {i + 13}″
                    </button>
                  ))}
                </div>
                <div className="selected-price" aria-live="polite">
                  <div>
                    <span>{t("PNEUS D’OCCASION · ")}{diameter}{t(" POUCES")}</span>
                    <p>
                      {prices[diameter - 13] ?? t("Sur devis")}
                      <small>
                        {" "}
                        {prices[diameter - 13] ? "€" : ""} <span>{t("/ la paire")}</span>
                      </small>
                    </p>
                  </div>
                  <ShieldCheck size={48} />
                </div>
                <p className="price-includes">
                  <Check size={16} />{t(" Montage & équilibrage compris ")}</p>
                <p className="price-note">{t(" *Prix selon l’état et la marque. Disponibilité à confirmer auprès du garage. Tarif dès 50 € pour la paire en 13″. ")}</p>
                <TyreAvailability key={diameter} diameter={diameter} />
                <details className="all-prices">
                  <summary>{t("Voir tous les tarifs")}</summary>
                  <table>
                    <caption>{t("Pneus d’occasion — la paire montée et équilibrée")}</caption>
                    <thead>
                      <tr>
                        <th>{t("Diamètre")}</th>
                        <th>{t("Prix")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((p, i) => (
                        <tr key={i}>
                          <td>{i + 13}{t(" pouces")}</td>
                          <td>{p} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              </div>
              <aside className="fitting">
                <p className="kicker">{t("VOUS AVEZ DÉJÀ VOS PNEUS ?")}</p>
                <h3>{t(" On s’occupe ")}<br />{t(" du montage. ")}</h3>
                <p>{t("Montage & équilibrage seuls")}</p>
                <div className="fitting-row">
                  <span>{t("Jante tôle")}</span>
                  <b>
                    15 € <small>{t("/ roue")}</small>
                  </b>
                </div>
                <div className="fitting-row">
                  <span>{t("Jante alu")}</span>
                  <b>
                    15 € <small>{t("/ roue")}</small>
                  </b>
                </div>
                <div className="fitting-row">
                  <span>{t(" Pneu renforcé ")}<br />
                    <small>{t("Type camionnette")}</small>
                  </span>
                  <b>
                    30 € <small>{t("/ roue")}</small>
                  </b>
                </div>
                <p className="recycling">{t("Recyclage des pneus : 5 € / roue")}</p>
                <Link
                  to="/devis"
                  search={{ service: "Montage & équilibrage" }}
                  className="text-link"
                >{t(" Demander un montage ")}<ArrowUpRight size={18} />
                </Link>
              </aside>
            </div>
          </div>
        </section>
        <section className="winter wrap">
          <div className="winter-symbol">
            <Snowflake size={65} strokeWidth={1} />
          </div>
          <div>
            <p className="kicker">{t("PRÊTS POUR LES JOURS FROIDS ?")}</p>
            <h2>{t(" L’hiver se prépare. ")}<br />{t(" Vos pneus aussi. ")}</h2>
            <p>{t(" Pluie, froid, neige : faites contrôler l’état de vos pneus et découvrez nos pneus hiver et 4 saisons. ")}</p>
          </div>
          <a
            className="bruch-button outline"
            href="/images/offre-pneus.webp"
            target="_blank"
            rel="noreferrer"
          >{t(" Voir notre offre hiver ")}<ArrowUpRight size={18} />
          </a>
        </section>
        <section id="mecanique" className="section wrap mechanics">
          <div className="section-heading">
            <div>
              <p className="kicker">{t("03 / AU-DELÀ DES PNEUS")}</p>
              <h2>{t(" Votre auto. ")}<br />
                <span>{t("Entre de bonnes mains.")}</span>
              </h2>
            </div>
            <Link to="/devis" search={{ service: "Entretien / vidange" }} className="text-link">{t(" Demander un devis mécanique ")}<ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="mechanic-grid">
            {[
              ["Vidange & entretien", "Huile, filtres et entretien général."],
              ["Freinage", "Plaquettes et disques de frein."],
              [
                "Suspension & échappement",
                "Pour le confort et le bon fonctionnement de votre véhicule.",
              ],
              ["Batterie & diagnostic", "Contrôle et recherche de panne."],
              ["Climatisation", "Pour votre confort à bord."],
            ].map(([title, text], i) => (
              <Link to="/devis" search={{ service: title }} key={title} className="mechanic-item">
                <span className="service-number">0{i + 1}</span>
                <div>
                  <h3>{t(title)}</h3>
                  <p>{t(text)}</p>
                </div>
                <ArrowUpRight size={19} />
              </Link>
            ))}
            <div className="mechanic-note">
              <Wrench size={28} />
              <p>{t(" Toutes marques. ")}<br />{t(" Prestations sur devis. ")}</p>
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="wrap contact-grid">
            <div>
              <p className="kicker">{t("04 / ON VOUS ATTEND À FORBACH")}</p>
              <h2>{t(" Un garage proche. ")}<br />
                <span>{t("Et disponible.")}</span>
              </h2>
              <p>{t(" Avec ou sans rendez-vous, 7 jours sur 7. ")}<br />{t("À proximité de Großrosseln et de Saarbrücken. ")}</p>
              <a className="big-phone" href={phone}>
                06 20 43 11 91 <ArrowUpRight />
              </a>
              <div className="contact-details">
                <div>
                  <MapPin />
                  <p>
                    2 Allée des Cyprès
                    <br />
                    <b>57600 Forbach</b>
                  </p>
                </div>
                <div>
                  <Clock3 />
                  <p>{t(" Du lundi au dimanche ")}<br />
                    <b>{t("8h00 — 20h00")}</b>
                  </p>
                </div>
              </div>
              <div className="contact-actions">
                <a className="bruch-button blue" href={directions} target="_blank" rel="noreferrer">{t(" Calculer mon itinéraire ")}<ArrowUpRight size={18} />
                </a>
                <Link className="text-link" to="/devis">{t(" Demander un devis ")}<ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <aside className="welcome-card">
              <span className="welcome-label">{t("INSTALLEZ-VOUS, ON S’OCCUPE DU RESTE.")}</span>
              <Coffee size={48} strokeWidth={1} />
              <h3>{t("Le temps d’un café.")}</h3>
              <p>{t("Une salle d’attente confortable pour patienter pendant l’intervention.")}</p>
              <ul>
                <li>
                  <Coffee />{t(" Café & boissons fraîches offerts ")}</li>
                <li>
                  <Wifi />{t(" Wi-Fi gratuit & TV ")}</li>
                <li>
                  <CarFront />{t(" Voitures, SUV, 4×4 & utilitaires ")}</li>
              </ul>
              <div className="german" lang="de">
                <span>DE</span>
                <p>
                  Wir sprechen Deutsch.<small>{t("Nous parlons allemand.")}</small>
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <footer className="bruch-footer wrap">
        <Brand />
        <span>© {new Date().getFullYear()} Pneus du Bruch · Forbach</span>
        <Link to="/admin/stock">{t("Gestion du stock")}</Link>
        <Link to="/compte">{t(" Espace client ")}<ArrowUpRight size={14} />
        </Link>
        <LegalLinks className="bruch-legal-links" />
      </footer>
      <div className="mobile-contact">
        <a href={phone}>
          <Phone size={18} />{t(" Appeler le garage ")}</a>
        <a href={directions} target="_blank" rel="noreferrer">
          <MapPin size={18} />{t(" Itinéraire ")}</a>
      </div>
    </div>
  );
}
