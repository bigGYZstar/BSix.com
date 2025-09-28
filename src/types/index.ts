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

// DataAdapterの型定義
export interface DataAdapter {
  fetchData<T>(endpoint: string): Promise<T>;
  postData<T>(endpoint: string, data: any): Promise<T>;
}

// SyncStatusの型定義
export interface SyncStatus {
  status: 'idle' | 'syncing' | 'success' | 'error';
  progress: number;
  lastSync?: string; // lastSyncをオプションにする
  nextSync?: string;
  currentVersion?: string;
  availableVersion?: string;
  errors: SyncError[];
  metrics?: { syncDuration: number; dataSize: number; networkLatency: number; };
}

export interface SyncError {
  code: string;
  message: string;
}

// ContentContextの型定義
export interface ContentContext {
  content_type: string;
  team?: string; // teamをオプションにする
  result: any;
  time_of_day?: string;
  data: any;
}

export * from './generated/player.schema';
// AvatarConfigの型定義



