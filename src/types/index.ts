// Generated types from JSON schemas
export * from './generated/match.schema';
export * from './generated/team.schema';
export * from './generated/player.schema';

// Additional application types
export interface AppConfig {
  version: string;
  environment: 'development' | 'production' | 'test';
  baseUrl: string;
}

export interface DataSyncConfig {
  version: string;
  lastUpdated: string;
  source: string;
}

export interface CharacterConfig {
  currentCharacter: string;
  characters: Record<string, CharacterProfile>;
}

export interface CharacterProfile {
  name: string;
  greeting: string;
  tone: 'casual' | 'professional' | 'enthusiastic';
  humorLevel: number; // 0-1
  emojiUsage: number; // 0-1
  formality: number; // 0-1
}

export interface DesignSystemConfig {
  theme: 'light' | 'dark' | 'arsenal_chan';
  colorPalette: Record<string, string>;
  components: Record<string, ComponentStyle>;
}

export interface ComponentStyle {
  className: string;
  styles: Record<string, string>;
}

export interface LinkConfig {
  version: string;
  pages: Record<string, PageConfig>;
}

export interface PageConfig {
  path: string;
  title: string;
  description: string;
  version: string;
}
