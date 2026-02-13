export interface LearnModule {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  order: number;
}

// Track-specific aliases for backward compatibility
export type BuilderModule = LearnModule;
export type ExplorerModule = LearnModule;
export type FounderModule = LearnModule;
export type HackerModule = LearnModule;
