import type { Match, Team, Player } from '@/types';
import { BaseDataAdapter, type ValidationResult } from './adapter';

export class StaticDataAdapter extends BaseDataAdapter {
  private teams: Team[] = [];
  private players: Player[] = [];
  private matches: Match[] = [];
  private loaded = false;

  protected async loadData(): Promise<void> {
    if (this.loaded) return;

    try {
      // Load teams data
      const teamsResponse = await fetch(`${import.meta.env.BASE_URL}data/versions/2025-09-20_current_premier_league_table.json`);
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        this.teams = this.transformTeamsData(teamsData);
      }

      // Load players data
      const playersResponse = await fetch(`${import.meta.env.BASE_URL}data/versions/2024-09-20_team_detailed_stats.json`);
      if (playersResponse.ok) {
        const playersData = await playersResponse.json();
        this.players = this.transformPlayersData(playersData);
      }

      // Load matches data
      const matchesResponse = await fetch(`${import.meta.env.BASE_URL}data/current-schedule.json`);
      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        this.matches = this.transformMatchesData(matchesData);
      }

      this.loaded = true;
    } catch (error) {
      console.error('Failed to load static data:', error);
      throw new Error('Data loading failed');
    }
  }

  async getTeams(): Promise<Team[]> {
    await this.loadData();
    return this.teams;
  }

  async getTeam(id: string): Promise<Team | null> {
    await this.loadData();
    return this.teams.find(team => team.id === id) || null;
  }

  async getPlayers(): Promise<Player[]> {
    await this.loadData();
    return this.players;
  }

  async getPlayer(id: string): Promise<Player | null> {
    await this.loadData();
    return this.players.find(player => player.id === id) || null;
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    await this.loadData();
    return this.players.filter(player => player.teamId === teamId);
  }

  async getMatches(): Promise<Match[]> {
    await this.loadData();
    return this.matches;
  }

  async getMatch(id: string): Promise<Match | null> {
    await this.loadData();
    return this.matches.find(match => match.id === id) || null;
  }

  async getMatchesByTeam(teamId: string): Promise<Match[]> {
    await this.loadData();
    return this.matches.filter(match => 
      match.homeTeam.id === teamId || match.awayTeam.id === teamId
    );
  }

  async validateData(): Promise<ValidationResult> {
    await this.loadData();
    
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Validate teams
    this.teams.forEach((team, index) => {
      if (!team.id) {
        errors.push({
          type: 'data',
          message: 'Team missing required id field',
          path: `teams[${index}]`
        });
      }
      if (!team.name) {
        errors.push({
          type: 'data',
          message: 'Team missing required name field',
          path: `teams[${index}]`
        });
      }
    });

    // Validate players
    this.players.forEach((player, index) => {
      if (!player.id) {
        errors.push({
          type: 'data',
          message: 'Player missing required id field',
          path: `players[${index}]`
        });
      }
      if (!this.teams.find(team => team.id === player.teamId)) {
        errors.push({
          type: 'reference',
          message: `Player references non-existent team: ${player.teamId}`,
          path: `players[${index}].teamId`
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private transformTeamsData(data: any): Team[] {
    // Transform the current data structure to match Team schema
    if (data.teams) {
      return data.teams.map((team: any) => ({
        id: team.id || team.name?.toLowerCase().replace(/\s+/g, '_'),
        name: team.name,
        shortName: team.shortName || team.name,
        position: team.position || 0,
        points: team.points || 0,
        played: team.played || 0,
        won: team.won || 0,
        drawn: team.drawn || 0,
        lost: team.lost || 0,
        goalsFor: team.goalsFor || 0,
        goalsAgainst: team.goalsAgainst || 0,
        goalDifference: team.goalDifference || 0,
        form: team.form || [],
        logo: team.logo || '',
        colors: team.colors || { primary: '#000000', secondary: '#ffffff' }
      }));
    }
    return [];
  }

  private transformPlayersData(data: any): Player[] {
    // Transform player data structure
    const players: Player[] = [];
    if (data.teams) {
      Object.entries(data.teams).forEach(([teamId, teamData]: [string, any]) => {
        if (teamData.players) {
          teamData.players.forEach((player: any) => {
            players.push({
              id: player.id || `${teamId}_${player.name?.toLowerCase().replace(/\s+/g, '_')}`,
              name: player.name,
              teamId,
              position: player.position || 'Unknown',
              number: player.number || 0,
              age: player.age || 0,
              nationality: player.nationality || 'Unknown',
              stats: player.stats || {}
            });
          });
        }
      });
    }
    return players;
  }

  private transformMatchesData(data: any): Match[] {
    // Transform match data structure
    if (data.fixtures) {
      return data.fixtures.map((match: any) => ({
        id: match.id || `${match.homeTeam}_vs_${match.awayTeam}_${match.date}`,
        homeTeam: {
          id: match.homeTeam?.toLowerCase().replace(/\s+/g, '_'),
          name: match.homeTeam
        },
        awayTeam: {
          id: match.awayTeam?.toLowerCase().replace(/\s+/g, '_'),
          name: match.awayTeam
        },
        date: match.date,
        time: match.time,
        venue: match.venue || '',
        status: match.status || 'scheduled',
        score: match.score || null
      }));
    }
    return [];
  }
}
