/**
 * Matches feature module
 * Handles match data and scheduling
 */

export interface Match {
  id: string;
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  competition: {
    name: string;
    season: string;
    gameweek?: number;
  };
  venue: {
    name: string;
    city: string;
  };
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
  score?: {
    home: number;
    away: number;
  };
}

export interface MatchPreview {
  matchId: string;
  headline: string;
  summary: string;
  keyPlayers: string[];
  tacticalAnalysis: string;
  prediction?: string;
}

export class MatchesManager {
  private matches: Map<string, Match> = new Map();
  private previews: Map<string, MatchPreview> = new Map();

  addMatch(match: Match): void {
    this.matches.set(match.id, match);
  }

  getMatch(id: string): Match | null {
    return this.matches.get(id) || null;
  }

  getAllMatches(): Match[] {
    return Array.from(this.matches.values());
  }

  getMatchesByTeam(teamId: string): Match[] {
    return Array.from(this.matches.values()).filter(
      match => match.homeTeamId === teamId || match.awayTeamId === teamId
    );
  }

  getMatchesByStatus(status: Match['status']): Match[] {
    return Array.from(this.matches.values()).filter(match => match.status === status);
  }

  getUpcomingMatches(limit?: number): Match[] {
    const upcoming = this.getMatchesByStatus('scheduled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return limit ? upcoming.slice(0, limit) : upcoming;
  }

  getRecentMatches(limit?: number): Match[] {
    const recent = this.getMatchesByStatus('finished')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? recent.slice(0, limit) : recent;
  }

  getBig6Matches(): Match[] {
    const big6Teams = ['liverpool', 'arsenal', 'chelsea', 'manchester-city', 'manchester-united', 'tottenham'];
    
    return Array.from(this.matches.values()).filter(match =>
      big6Teams.includes(match.homeTeamId) || big6Teams.includes(match.awayTeamId)
    );
  }

  addPreview(preview: MatchPreview): void {
    this.previews.set(preview.matchId, preview);
  }

  getPreview(matchId: string): MatchPreview | null {
    return this.previews.get(matchId) || null;
  }

  updateMatchScore(matchId: string, score: { home: number; away: number }): void {
    const match = this.getMatch(matchId);
    if (match) {
      match.score = score;
      if (match.status === 'live' || match.status === 'scheduled') {
        match.status = 'finished';
      }
    }
  }

  updateMatchStatus(matchId: string, status: Match['status']): void {
    const match = this.getMatch(matchId);
    if (match) {
      match.status = status;
    }
  }
}

export const matchesManager = new MatchesManager();
