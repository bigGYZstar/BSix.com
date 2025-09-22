/**
 * Players feature module
 * Handles player data and statistics
 */

export interface PlayerStats {
  season: string;
  appearances: number;
  starts: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  passAccuracy?: number;
  shotsOnTarget?: number;
  tackles?: number;
  interceptions?: number;
}

export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'CF' | 'ST';
  number?: number;
  nationality: string;
  age: number;
  teamId: string;
  stats: PlayerStats;
  injury?: {
    status: 'fit' | 'doubt' | 'injured' | 'suspended';
    description?: string;
    expectedReturn?: string;
  };
}

export class PlayersManager {
  private players: Map<string, Player> = new Map();

  addPlayer(player: Player): void {
    this.players.set(player.id, player);
  }

  getPlayer(id: string): Player | null {
    return this.players.get(id) || null;
  }

  getPlayersByTeam(teamId: string): Player[] {
    return Array.from(this.players.values()).filter(player => player.teamId === teamId);
  }

  getPlayersByPosition(position: Player['position']): Player[] {
    return Array.from(this.players.values()).filter(player => player.position === position);
  }

  getTopScorers(limit: number = 10): Player[] {
    return Array.from(this.players.values())
      .sort((a, b) => b.stats.goals - a.stats.goals)
      .slice(0, limit);
  }

  getTopAssists(limit: number = 10): Player[] {
    return Array.from(this.players.values())
      .sort((a, b) => b.stats.assists - a.stats.assists)
      .slice(0, limit);
  }

  getInjuredPlayers(): Player[] {
    return Array.from(this.players.values()).filter(
      player => player.injury && player.injury.status !== 'fit'
    );
  }

  updatePlayerStats(playerId: string, stats: Partial<PlayerStats>): void {
    const player = this.getPlayer(playerId);
    if (player) {
      player.stats = { ...player.stats, ...stats };
    }
  }

  updatePlayerInjury(playerId: string, injury: Player['injury']): void {
    const player = this.getPlayer(playerId);
    if (player) {
      player.injury = injury;
    }
  }

  searchPlayers(query: string): Player[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.players.values()).filter(player =>
      player.name.toLowerCase().includes(lowercaseQuery) ||
      player.position.toLowerCase().includes(lowercaseQuery) ||
      player.nationality.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const playersManager = new PlayersManager();
