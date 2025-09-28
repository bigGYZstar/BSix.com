import type { Player } from '@/types/generated/player.schema';
import type { Team } from '@/types/generated/team.schema';

/**
 * Configuration for Liverpool detail page display
 */
export interface LiverpoolDetailConfig {
  showPlayerStats: boolean;
  showTacticalAnalysis: boolean;
  showRecentForm: boolean;
  showUpcomingFixtures: boolean;
  showTransferNews: boolean;
  displayMode: 'detailed' | 'summary';
}

/**
 * Extended player profile for Liverpool players
 */


export interface PlayerStats {
  appearances?: number;
  goals?: number;
  assists?: number;
  passAccuracy?: number;
  tackles?: number;
  cleanSheets?: number;
}

export interface PlayerProfile extends Player {
  jp?: string;
  intl?: string;
  /** Player's market value in millions */
  marketValue?: number;
  /** Contract expiry date */
  contractExpiry?: string;
  /** Player's preferred foot */
  preferredFoot?: 'left' | 'right' | 'both';
  /** Previous clubs */
  previousClubs?: string[];
  /** Injury status */
  injuryStatus?: 'fit' | 'injured' | 'doubtful';
  /** Player's season stats */
  stats?: PlayerStats;


}

/**
 * Tactical analysis data
 */
export interface TacticalAnalysis {
  /** Formation used */
  formation: string;
  /** Playing style description */
  playingStyle: string;
  /** Key tactical points */
  keyTactics: string[];
  /** Strengths */
  strengths: string[];
  /** Areas for improvement */
  weaknesses: string[];
  /** Comparison with previous season */
  comparisonWithPrevious?: {
    formation: string;
    keyChanges: string[];
  };
}

/**
 * Season statistics for Liverpool
 */
export interface SeasonStats {
  /** League position */
  position: number;
  /** Points earned */
  points: number;
  /** Matches played */
  played: number;
  /** Wins */
  won: number;
  /** Draws */
  drawn: number;
  /** Losses */
  lost: number;
  /** Goals scored */
  goalsFor: number;
  /** Goals conceded */
  goalsAgainst: number;
  /** Goal difference */
  goalDifference: number;
  /** Recent form (last 5 matches) */
  form: ('W' | 'D' | 'L')[];
  /** Clean sheets */
  cleanSheets: number;
  /** Average possession percentage */
  avgPossession?: number;
  /** Average goals per game */
  avgGoalsPerGame?: number;
}

/**
 * Match preview information
 */
export interface MatchPreview {
  /** Match ID */
  id: string;
  /** Opponent team */
  opponent: string;
  /** Match date */
  date: string;
  /** Venue (home/away) */
  venue: 'home' | 'away';
  /** Competition */
  competition: 'Premier League' | 'Champions League' | 'FA Cup' | 'League Cup';
  /** Predicted lineup */
  predictedLineup?: PlayerProfile[];
  /** Key battles */
  keyBattles?: string[];
  /** Prediction */
  prediction?: {
    result: 'win' | 'draw' | 'loss';
    confidence: number;
    scorePrediction?: string;
  };
}

/**
 * Transfer news item
 */
export interface TransferNews {
  /** News ID */
  id: string;
  /** Player name */
  playerName: string;
  /** Transfer type */
  type: 'incoming' | 'outgoing' | 'rumor';
  /** Transfer status */
  status: 'completed' | 'in_progress' | 'rumored';
  /** Transfer fee */
  fee?: string;
  /** Source club */
  fromClub?: string;
  /** Destination club */
  toClub?: string;
  /** News date */
  date: string;
  /** News summary */
  summary: string;
}

/**
 * Liverpool team data with extended information
 */
export interface LiverpoolTeamData extends Team {
  /** Current squad */
  squad: PlayerProfile[];
  /** Tactical analysis */
  tactics: TacticalAnalysis;
  /** Season statistics */
  seasonStats: SeasonStats;
  /** Upcoming fixtures */
  upcomingFixtures: MatchPreview[];
  /** Recent transfer news */
  transferNews: TransferNews[];
  /** Manager information */
  manager: {
    name: string;
    nationality: string;
    appointmentDate: string;
    previousClubs: string[];
    tacticalPhilosophy: string;
  };
}

