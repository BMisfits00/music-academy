// Extensión del tipo de sesión de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

export type InstrumentSlug = "piano" | "guitarra" | "bajo";

export type DifficultyLabel = "Principiante" | "Intermedio" | "Avanzado";

export interface InstrumentWithLevels {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  levels: LevelWithModules[];
}

export interface LevelWithModules {
  id: string;
  name: string;
  difficulty: string;
  order: number;
  description: string | null;
  modules: ModuleSummary[];
}

export interface ModuleSummary {
  id: string;
  title: string;
  description: string | null;
  order: number;
}

export interface ModuleWithContent {
  id: string;
  title: string;
  description: string | null;
  lessons: LessonWithResources[];
  challenges: ChallengeItem[];
}

export interface LessonWithResources {
  id: string;
  title: string;
  content: string;
  order: number;
  resources: ResourceItem[];
}

export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  url: string;
}

export interface ChallengeItem {
  id: string;
  type: string;
  question: string;
  options: string[] | null;
  audioUrl: string | null;
  order: number;
}

export interface StudentProgress {
  moduleId: string;
  completed: boolean;
  score: number | null;
  attempts: number;
  completedAt: Date | null;
}
