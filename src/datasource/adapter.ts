import type { Match, Team, Player } from '@/types';

export interface DataAdapter {
  // Team operations
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | null>;
  
  // Player operations
  getPlayers(): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | null>;
  getPlayersByTeam(teamId: string): Promise<Player[]>;
  
  // Match operations
  getMatches(): Promise<Match[]>;
  getMatch(id: string): Promise<Match | null>;
  getMatchesByTeam(teamId: string): Promise<Match[]>;
  
  // Data validation
  validateData(): Promise<ValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: 'schema' | 'data' | 'reference';
  message: string;
  path: string;
  value?: unknown;
}

export interface ValidationWarning {
  type: 'deprecated' | 'missing' | 'inconsistent';
  message: string;
  path: string;
  suggestion?: string;
}

export abstract class BaseDataAdapter implements DataAdapter {
  protected abstract loadData(): Promise<void>;
  
  abstract getTeams(): Promise<Team[]>;
  abstract getTeam(id: string): Promise<Team | null>;
  abstract getPlayers(): Promise<Player[]>;
  abstract getPlayer(id: string): Promise<Player | null>;
  abstract getPlayersByTeam(teamId: string): Promise<Player[]>;
  abstract getMatches(): Promise<Match[]>;
  abstract getMatch(id: string): Promise<Match | null>;
  abstract getMatchesByTeam(teamId: string): Promise<Match[]>;
  abstract validateData(): Promise<ValidationResult>;
}
