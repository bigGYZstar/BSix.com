/**
 * Teams feature module
 * Handles team data and statistics
 */

export interface TeamStats {
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
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  stats: TeamStats;
}

export class TeamsManager {
  private teams: Map<string, Team> = new Map();

  addTeam(team: Team): void {
    this.teams.set(team.id, team);
  }

  getTeam(id: string): Team | null {
    return this.teams.get(id) || null;
  }

  getAllTeams(): Team[] {
    return Array.from(this.teams.values());
  }

  getBig6Teams(): Team[] {
    const big6Ids = ['liverpool', 'arsenal', 'chelsea', 'manchester-city', 'manchester-united', 'tottenham'];
    return big6Ids
      .map(id => this.getTeam(id))
      .filter((team): team is Team => team !== null);
  }

  getTeamsByPosition(): Team[] {
    return this.getAllTeams().sort((a, b) => a.stats.position - b.stats.position);
  }

  updateTeamStats(teamId: string, stats: Partial<TeamStats>): void {
    const team = this.getTeam(teamId);
    if (team) {
      team.stats = { ...team.stats, ...stats };
    }
  }

  compareTeams(teamId1: string, teamId2: string): {
    team1: Team;
    team2: Team;
    comparison: Record<string, 'team1' | 'team2' | 'equal'>;
  } | null {
    const team1 = this.getTeam(teamId1);
    const team2 = this.getTeam(teamId2);

    if (!team1 || !team2) return null;

    const comparison: Record<string, 'team1' | 'team2' | 'equal'> = {
      position: team1.stats.position < team2.stats.position ? 'team1' : 
                team1.stats.position > team2.stats.position ? 'team2' : 'equal',
      points: team1.stats.points > team2.stats.points ? 'team1' :
              team1.stats.points < team2.stats.points ? 'team2' : 'equal',
      goalDifference: team1.stats.goalDifference > team2.stats.goalDifference ? 'team1' :
                      team1.stats.goalDifference < team2.stats.goalDifference ? 'team2' : 'equal'
    };

    return { team1, team2, comparison };
  }
}

export const teamsManager = new TeamsManager();
