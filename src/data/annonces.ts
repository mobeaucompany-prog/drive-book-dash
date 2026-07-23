export type Annonce = {
  id: string;
  titre: string;
  marque: string;
  prix: number;
  annee: number;
  km: number;
  energie: "Essence" | "Diesel" | "Hybride" | "Électrique";
  boite: "Manuelle" | "Automatique";
  ville: string;
  cp: string;
  publieLe: string;
  badge?: string;
  images: string[];
  description: string;
  equipements: string[];
  entretien: string[];
};

export const annonces: Annonce[] = [
  {
    id: "vw-polo-12-united-2008",
    titre: "Volkswagen Polo 1.2 United 5 portes",
    marque: "Volkswagen",
    prix: 3200,
    annee: 2008,
    km: 210000,
    energie: "Essence",
    boite: "Manuelle",
    ville: "Forbach",
    cp: "57600",
    publieLe: "Aujourd'hui",
    badge: "Idéal jeune conducteur",
    images: [
      "/occasions/polo-avant.jpg",
      "/occasions/polo-arriere.jpg",
      "/occasions/polo-interieur.jpg",
    ],
    description:
      "Volkswagen Polo 1.2 essence — 2008 — 210 000 km — 5 portes.\n\n" +
      "Nous proposons à la vente cette Volkswagen Polo 1.2 essence de 2008, un véhicule très bien entretenu avec carnet d'entretien complet. Fiable grâce à sa distribution par chaîne, elle est idéale pour un jeune conducteur ou pour un usage quotidien.\n\n" +
      "La mécanique du véhicule est entièrement saine. Le véhicule roule parfaitement et ne nécessite aucun frais à prévoir. Contrôle technique OK.\n\n" +
      "Formalités administratives : nous nous occupons de l'ensemble des démarches, de la plaque provisoire jusqu'à l'obtention de votre carte grise définitive.\n\n" +
      "Les plus :\n✔ Garantie 6 mois incluse\n✔ Aucun frais à prévoir\n✔ Faible consommation, entretien et assurance économiques\n✔ Véhicule prêt à prendre la route\n\n" +
      "Visible sur rendez-vous au Centre Auto Occasion 57 (CAO57) — Forbach.",
    equipements: [
      "5 portes",
      "Climatisation",
      "Sièges chauffants",
      "Régulateur de vitesse",
      "4 vitres électriques",
      "Rétroviseurs électriques",
      "Lunette arrière dégivrante",
      "Vitres arrière et lunette teintées",
      "Jantes aluminium d'origine Volkswagen",
      "Radars de stationnement avant et arrière",
      "Autoradio CarPlay (compatible caméra de recul)",
      "Installation audio avec amplificateur et caisson de basses",
      "ABS / ESP",
      "Pack jantes tôles + pneus hiver fourni",
    ],
    entretien: [
      "Vidange moteur + tous les filtres (05/07/2026)",
      "Disques et plaquettes de frein récemment remplacés",
      "Embrayage récemment remplacé",
      "Ligne d'échappement récemment remplacée",
      "Pneus récemment remplacés",
      "Moteur à chaîne (pas de courroie de distribution)",
      "Contrôle technique OK",
    ],
  },
  {
    id: "citroen-c4-hdi-2007",
    titre: "Citroën C4 1.6 HDi 110 ch",
    marque: "Citroën",
    prix: 3000,
    annee: 2007,
    km: 153000,
    energie: "Diesel",
    boite: "Manuelle",
    ville: "Forbach",
    cp: "57600",
    publieLe: "Aujourd'hui",
    badge: "Importé d'Allemagne",
    images: [
      "/occasions/c4-avant.jpg",
      "/occasions/c4-arriere.jpg",
      "/occasions/c4-interieur.jpg",
    ],
    description:
      "Citroën C4 1.6 HDi 110 ch — Entretien complet, aucun frais à prévoir. Véhicule garanti.\n\n" +
      "Nous vous proposons cette Citroën C4 1.6 HDi 110 ch, un véhicule fiable, économique et idéal aussi bien pour les trajets quotidiens que pour les longues distances.\n\n" +
      "Le véhicule est importé d'Allemagne. Le dossier administratif est complet et prêt pour l'immatriculation française. Nous nous occupons de l'ensemble des démarches (carte grise et formalités) afin que vous repartiez le jour de l'achat directement au volant de votre véhicule.\n\n" +
      "Toutes les factures des travaux sont disponibles. Véhicule entièrement contrôlé dans notre atelier, sain, fiable et prêt à prendre la route.\n\n" +
      "Visible sur rendez-vous au Centre Auto Occasion 57 (CAO57) — Forbach.",
    equipements: [
      "ABS / ESP",
      "Climatisation",
      "Régulateur et limiteur de vitesse",
      "Vitres électriques avant",
      "Rétroviseurs électriques",
      "Ordinateur de bord",
      "Autoradio d'origine",
    ],
    entretien: [
      "Courroie de distribution + pompe à eau neuves",
      "Kit chaîne d'arbre à cames neuf",
      "Courroie d'accessoires neuve",
      "Kit joints d'injecteurs neuf",
      "Vidange de boîte de vitesses",
      "Vidange moteur + tous les filtres",
      "Liquide de refroidissement remplacé + purge complète du circuit",
      "4 pneus neufs",
    ],
  },
  {
    id: "vw-polo-14-tdi-2006",
    titre: "Volkswagen Polo 1.4 TDi 80 ch 3 portes",
    marque: "Volkswagen",
    prix: 3300,
    annee: 2006,
    km: 191000,
    energie: "Diesel",
    boite: "Manuelle",
    ville: "Forbach",
    cp: "57600",
    publieLe: "Aujourd'hui",
    badge: "Garantie 6 mois",
    images: [],
    description:
      "Volkswagen Polo 1.4 Diesel — 2006 — 190 000 km — 3 portes.\n\n" +
      "Nous proposons à la vente cette Volkswagen Polo 1.4 diesel de 2006, un véhicule très bien entretenu avec carnet d'entretien complet.\n\n" +
      "La mécanique du véhicule est entièrement saine. Le véhicule roule parfaitement et ne nécessite aucun frais à prévoir.\n\n" +
      "Les plus :\n✔ Garantie 6 mois incluse\n✔ Aucun frais à prévoir\n✔ Véhicule idéal pour un jeune conducteur ou une jeune conductrice grâce à sa faible consommation et son faible coût d'entretien et d'assurance\n✔ Véhicule prêt à prendre la route\n\n" +
      "Pour plus d'informations ou pour convenir d'un rendez-vous, n'hésitez pas à nous contacter.\n\n" +
      "Visible sur rendez-vous au Centre Auto Occasion 57 (CAO57) — Forbach.",
    equipements: [
      "3 portes",
      "Climatisation",
      "Régulateur de vitesse",
      "Vitres électriques",
      "Rétroviseurs électriques",
      "Lunette arrière dégivrante",
      "Radars de stationnement avant et arrière",
      "Autoradio CarPlay",
      "Possibilité de raccorder une caméra de recul directement sur le poste",
      "ABS / ESP",
    ],
    entretien: [
      "Vidange moteur + tous les filtres (13/07/2026)",
      "Kit distribution + pompe à eau (13/07/2026)",
    ],
  },
];
