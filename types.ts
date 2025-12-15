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

export type IncidentStatus = 'SIGNALÉ' | 'VÉRIFIÉ' | 'EN ATTENTE' | 'RÉSOLU';

export interface Incident {
  id: string;
  date: string;
  title: string;
  description: string;
  amount: number;
  status: IncidentStatus;
  scoreImpact: number;
}

export interface UserProfile {
  name: string;
  idRef: string;
  publicHash?: string; // L'identité "Black Mirror" visible par le public
}