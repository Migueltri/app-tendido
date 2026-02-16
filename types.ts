
export enum Category {
  ACTUALIDAD = 'Actualidad',
  CRONICAS = 'Crónicas',
  ENTREVISTAS = 'Entrevistas',
  OPINION = 'Opinión'
}

export type SystemRole = 'ADMIN' | 'EDITOR';

export interface Author {
  id: string;
  name: string;
  role: string; // Cargo visible (ej: "Redactor Jefe")
  imageUrl?: string;
  systemRole: SystemRole; // Permisos del sistema (ADMIN o EDITOR)
}

export interface BullfightResult {
  bullfighter: string;
  result: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  contentImages?: string[];
  category: Category;
  authorId: string;
  date: string;
  isPublished: boolean; // true = Publicada/Aprobada, false = Borrador/Pendiente
  
  // Campos específicos para Crónicas
  bullfightLocation?: string;
  bullfightCattle?: string;
  bullfightSummary?: string;
  bullfightResults?: BullfightResult[];
}

// Extensión para el historial
export interface ArchivedArticle extends Article {
  archivedAt: string;
  archivedBy: string; // ID del usuario que la eliminó
}

export interface DashboardStats {
  totalArticles: number;
  totalAuthors: number;
  recentArticles: Article[];
}

export interface AppSettings {
  githubToken: string;
  repoOwner: string;
  repoName: string;
  filePath: string;
  repoBranch?: string;
}
