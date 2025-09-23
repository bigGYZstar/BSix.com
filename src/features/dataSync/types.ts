/**
 * Type definitions for Data Sync system
 */

/**
 * Data version information
 */
export interface DataVersion {
  /** Version identifier */
  version: string;
  /** Collection date */
  collectionDate: string;
  /** Data source */
  source: string;
  /** Validation status */
  validated: boolean;
  /** Checksum for integrity */
  checksum?: string;
}

/**
 * Team data structure
 */
export interface TeamData {
  /** Team identifier */
  id: string;
  /** Team name */
  name: string;
  /** Short name/abbreviation */
  shortName: string;
  /** Team colors */
  colors: {
    primary: string;
    secondary: string;
  };
  /** Current season statistics */
  stats: {
    position: number;
    points: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    form: ('W' | 'D' | 'L')[];
  };
  /** Manager information */
  manager?: {
    name: string;
    nationality: string;
    appointed: string;
  };
  /** Stadium information */
  stadium?: {
    name: string;
    capacity: number;
    location: string;
  };
}

/**
 * Player data structure
 */
export interface PlayerData {
  /** Player identifier */
  id: string;
  /** Player name */
  name: string;
  /** Position */
  position: string;
  /** Jersey number */
  number: number;
  /** Age */
  age: number;
  /** Nationality */
  nationality: string;
  /** Team ID */
  teamId: string;
  /** Season statistics */
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    minutes: number;
    yellowCards: number;
    redCards: number;
  };
  /** Market value */
  marketValue?: number;
  /** Contract information */
  contract?: {
    expires: string;
    salary?: number;
  };
}

/**
 * Match data structure
 */
export interface MatchData {
  /** Match identifier */
  id: string;
  /** Gameweek number */
  gameweek: number;
  /** Home team ID */
  homeTeam: string;
  /** Away team ID */
  awayTeam: string;
  /** Match date */
  date: string;
  /** Match time */
  time: string;
  /** Venue */
  venue: string;
  /** Competition */
  competition: string;
  /** Match status */
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  /** Score (if finished) */
  score?: {
    home: number;
    away: number;
  };
  /** Match events */
  events?: Array<{
    type: 'goal' | 'card' | 'substitution';
    minute: number;
    player: string;
    team: string;
    details?: string;
  }>;
}

/**
 * Master data structure
 */
export interface MasterData {
  /** Metadata */
  metadata: DataVersion;
  /** Site information */
  siteInfo: {
    name: string;
    title: string;
    description: string;
    version: string;
    lastUpdated: string;
  };
  /** Current season info */
  currentSeason: {
    season: string;
    currentGameweek: number;
    nextGameweek: number;
    bigSixTeams: string[];
  };
  /** Teams data */
  teams: TeamData[];
  /** Players data */
  players: PlayerData[];
  /** Matches data */
  matches: MatchData[];
  /** Featured matches */
  featuredMatches: Array<{
    id: string;
    priority: 'highest' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    significance: string;
    previewAvailable: boolean;
  }>;
}

/**
 * Data validation result
 */
export interface DataValidationResult {
  /** Validation success */
  valid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Validated data count */
  validatedCount: {
    teams: number;
    players: number;
    matches: number;
  };
  /** Validation timestamp */
  timestamp: string;
}

/**
 * Sync error information
 */
export interface SyncError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Error details */
  details?: any;
  /** Timestamp */
  timestamp: string;
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Sync status information
 */
export interface SyncStatus {
  /** Sync state */
  status: 'idle' | 'syncing' | 'success' | 'error';
  /** Last sync timestamp */
  lastSync?: string;
  /** Next sync timestamp */
  nextSync?: string;
  /** Current data version */
  currentVersion?: string;
  /** Available data version */
  availableVersion?: string;
  /** Sync progress (0-100) */
  progress: number;
  /** Active errors */
  errors: SyncError[];
  /** Performance metrics */
  metrics?: {
    syncDuration: number;
    dataSize: number;
    networkLatency: number;
  };
}

/**
 * Data sync configuration
 */
export interface DataSyncConfig {
  /** Auto-sync enabled */
  autoSync: boolean;
  /** Sync interval in milliseconds */
  syncInterval: number;
  /** Data source URLs */
  dataSources: {
    master: string;
    teams: string;
    players: string;
    matches: string;
  };
  /** Validation settings */
  validation: {
    enabled: boolean;
    strict: boolean;
    requiredFields: string[];
  };
  /** Cache settings */
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  /** Error handling */
  errorHandling: {
    retryAttempts: number;
    retryDelay: number;
    fallbackToCache: boolean;
  };
  /** Debug settings */
  debug: boolean;
}

/**
 * Data query options
 */
export interface DataQueryOptions {
  /** Include related data */
  include?: string[];
  /** Filter criteria */
  filter?: Record<string, any>;
  /** Sort options */
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  /** Pagination */
  pagination?: {
    page: number;
    limit: number;
  };
  /** Force refresh from source */
  forceRefresh?: boolean;
}

/**
 * Data update event
 */
export interface DataUpdateEvent {
  /** Event type */
  type: 'team_update' | 'player_update' | 'match_update' | 'full_sync';
  /** Updated data */
  data: any;
  /** Previous data (for comparison) */
  previousData?: any;
  /** Update timestamp */
  timestamp: string;
  /** Update source */
  source: string;
}

/**
 * Sync event listener
 */
export type SyncEventListener = (event: DataUpdateEvent) => void;

/**
 * Data integrity check result
 */
export interface DataIntegrityResult {
  /** Check passed */
  passed: boolean;
  /** Issues found */
  issues: Array<{
    type: 'missing_data' | 'invalid_data' | 'inconsistent_data' | 'outdated_data';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedItems: string[];
  }>;
  /** Check timestamp */
  timestamp: string;
  /** Recommendations */
  recommendations: string[];
}
