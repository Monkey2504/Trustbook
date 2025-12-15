export enum Category {
  ETHICS = 'Éthique & Social',
  LEGAL = 'Juridique & Réglementaire',
  TECHNICAL = 'Technique & Sécurité',
  ADOPTION = 'Adoption & Utilité',
  ECONOMIC = 'Modèle Économique',
  PHILOSOPHY = 'Philosophie & Culture',
}

export interface Challenge {
  id: number;
  category: Category;
  title: string;
  problem: string;
  question: string;
  solution: string;
}

export interface ChartData {
  subject: string;
  A: number;
  fullMark: number;
}
