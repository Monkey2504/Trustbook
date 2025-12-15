import { Challenge, Category, ChartData } from './types';

export const PROJECT_TITLE = "Archive des Tensions Financières";
export const PROJECT_DESCRIPTION = "Dispositif de vigilance citoyenne. Analyse des coûts sociaux et humains de la transparence financière radicale.";

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    category: Category.ETHICS,
    title: "Le Paradoxe de la Transparence",
    problem: "La publicité totale des dettes génère une mécanique de honte publique (Shaming).",
    question: "Le système produit-il de la confiance ou de la stigmatisation ?",
    solution: "Limiter l'accès aux données. Refuser la transparence totale comme dogme."
  },
  {
    id: 2,
    category: Category.ETHICS,
    title: "Exclusion des Vulnérables",
    problem: "Double peine pour les précaires : dette financière + dégradation du capital social.",
    question: "L'outil automatise-t-il la ségrégation sociale ?",
    solution: "Mécanismes de 'Non-Signalement' pour les accidents de vie (chômage, maladie)."
  },
  {
    id: 3,
    category: Category.LEGAL,
    title: "Friction RGPD / Publicité",
    problem: "La donnée financière est intime. Sa publication est une violence potentielle.",
    question: "Le droit à l'oubli existe-t-il dans un registre immuable ?",
    solution: "Anonymisation par défaut. Consentement révocable à tout instant."
  },
  {
    id: 4,
    category: Category.LEGAL,
    title: "Scoring Social Sauvage",
    problem: "Émergence d'une réputation financière hors-la-loi.",
    question: "Sommes-nous en train de bâtir un crédit social déguisé ?",
    solution: "Interdiction légale d'utiliser ce score pour l'accès au logement ou à l'emploi."
  },
  {
    id: 5,
    category: Category.TECHNICAL,
    title: "Asymétrie de Validation",
    problem: "Le pouvoir de validation est unilatéral (détenu par le créancier).",
    question: "Comment empêcher le chantage à la validation ?",
    solution: "Preuve de paiement décentralisée ou tiers-témoin citoyen."
  },
  {
    id: 6,
    category: Category.TECHNICAL,
    title: "Usine à Faux",
    problem: "Création de dettes fictives pour blanchir une réputation.",
    question: "La donnée est-elle une preuve ou une performance ?",
    solution: "Analyse de graphes pour détecter les boucles de complaisance."
  },
  {
    id: 7,
    category: Category.ADOPTION,
    title: "Le Désert des Données",
    problem: "Un système de délation sans utilisateur est inutile.",
    question: "Qui a intérêt à se dénoncer ?",
    solution: "Aucune incitation gamifiée. L'usage doit venir d'une nécessité de preuve, pas d'un jeu."
  },
  {
    id: 8,
    category: Category.ADOPTION,
    title: "Redondance Systémique",
    problem: "Les banques font déjà ce travail, avec un cadre légal.",
    question: "S'agit-il d'une ubérisation du recouvrement ?",
    solution: "Focalisation uniquement sur les dettes informelles (famille, amis) invisibles à l'État."
  },
  {
    id: 9,
    category: Category.ECONOMIC,
    title: "Modèle de Rente",
    problem: "Si c'est gratuit, c'est que la donnée citoyenne est le produit.",
    question: "Qui paie pour l'infrastructure de la surveillance ?",
    solution: "Financement exclusif par dons ou fonds publics. Aucun modèle freemium."
  },
  {
    id: 10,
    category: Category.ECONOMIC,
    title: "Conflit d'Intérêt",
    problem: "La plateforme juge et arbitre sans mandat.",
    question: "Quelle légitimité pour une justice privée ?",
    solution: "Gouvernance ouverte. Jury citoyen tiré au sort pour les litiges."
  },
  {
    id: 11,
    category: Category.PHILOSOPHY,
    title: "Quantification du Lien",
    problem: "Réduire l'amitié à une transaction binaire (Remboursé / Non-Remboursé).",
    question: "La confiance est-elle une donnée calculable ?",
    solution: "Introduction de champs qualitatifs obligatoires ('Contexte du prêt')."
  },
  {
    id: 12,
    category: Category.PHILOSOPHY,
    title: "Normativité",
    problem: "Imposer une morale comptable à des relations humaines complexes.",
    question: "Le retard de paiement est-il toujours une faute morale ?",
    solution: "Accepter l'informel. Ne pas pénaliser les délais tacites."
  }
];

// Couleurs "Surligneur" et Niveaux de Gris pour l'alerte
export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ETHICS]: 'bg-[#111] text-white border-black', 
  [Category.LEGAL]: 'bg-white text-black border-black',
  [Category.TECHNICAL]: 'bg-gray-200 text-black border-black',
  [Category.ADOPTION]: 'bg-[#FFFF00] text-black border-black', // Jaune Alerte
  [Category.ECONOMIC]: 'bg-[#FF4500] text-white border-black', // Orange International
  [Category.PHILOSOPHY]: 'bg-white text-black border-black border-dashed',
};

export const RADAR_DATA: ChartData[] = [
  { subject: 'Impact Social', A: 120, fullMark: 150 },
  { subject: 'Risque Juridique', A: 98, fullMark: 150 },
  { subject: 'Complexité Tech', A: 86, fullMark: 150 },
  { subject: 'Résistance Usage', A: 65, fullMark: 150 },
  { subject: 'Coût Humain', A: 85, fullMark: 150 },
  { subject: 'Tension Éthique', A: 100, fullMark: 150 },
];