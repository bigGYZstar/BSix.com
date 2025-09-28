import { DataAdapter } from '@/datasource/adapter';
import { 
  LiverpoolDetailConfig, 
  LiverpoolTeamData, 
  TacticalAnalysis,
  SeasonStats,
  MatchPreview,
  TransferNews
} from './types';
import type { PlayerProfile } from './types';


/**
 * Manages Liverpool team detail data and business logic
 */
export class LiverpoolDetailManager {
  private config: LiverpoolDetailConfig;
  private dataAdapter: DataAdapter;
  private liverpoolData: LiverpoolTeamData | null = null;

  constructor(dataAdapter: DataAdapter) {
    this.dataAdapter = dataAdapter;
    this.config = {
      showPlayerStats: true,
      showTacticalAnalysis: true,
      showRecentForm: true,
      showUpcomingFixtures: true,
      showTransferNews: true,
      displayMode: 'detailed'
    };
  }

  /**
   * Initialize Liverpool data
   */
  async initialize(): Promise<void> {
    try {
      const teams = await this.dataAdapter.getTeams();
      const liverpoolTeam = teams.find(team => team.id === 'liverpool');
      
      if (!liverpoolTeam) {
        throw new Error('Liverpool team data not found');
      }

      // Extend basic team data with Liverpool-specific information
      this.liverpoolData = {
        ...liverpoolTeam,
        squad: await this.loadSquadData(),
        tactics: await this.loadTacticalAnalysis(),
        seasonStats: this.convertToSeasonStats(liverpoolTeam.stats),
        upcomingFixtures: await this.loadUpcomingFixtures(),
        transferNews: await this.loadTransferNews(),
        manager: {
          name: 'Arne Slot',
          nationality: 'Netherlands',
          appointmentDate: '2024-06-01',
          previousClubs: ['Feyenoord', 'AZ Alkmaar'],
          tacticalPhilosophy: 'Possession-based football with high pressing and quick transitions'
        }
      };
    } catch (error) {
      console.error('Failed to initialize Liverpool data:', error);
      throw error;
    }
  }

  /**
   * Get Liverpool team data
   */
  getLiverpoolData(): LiverpoolTeamData | null {
    return this.liverpoolData;
  }

  /**
   * Get current configuration
   */
  getConfig(): LiverpoolDetailConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<LiverpoolDetailConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get filtered squad based on position
   */
  getSquadByPosition(position?: string): PlayerProfile[] {
    if (!this.liverpoolData) return [];
    
    if (!position) return this.liverpoolData.squad;
    
    return this.liverpoolData.squad.filter(player => 
      player.position.toLowerCase().includes(position.toLowerCase())
    );
  }

  /**
   * Get top performers this season
   */
  getTopPerformers(): {
    topScorer: PlayerProfile | null;
    topAssister: PlayerProfile | null;
    mostMinutes: PlayerProfile | null;
  } {
    if (!this.liverpoolData) {
      return { topScorer: null, topAssister: null, mostMinutes: null };
    }

    const squad = this.liverpoolData.squad;
    
    const topScorer = squad.reduce((prev, current) => 
      (current.number || 0) > (prev.number || 0) ? current : prev
    );
    
    const topAssister = squad.reduce((prev, current) => 
      (current.number || 0) > (prev.number || 0) ? current : prev
    );
    
    const mostMinutes = squad.reduce((prev, current) => 
      (current.number || 0) > (prev.number || 0) ? current : prev
    );

    return { topScorer, topAssister, mostMinutes };
  }

  /**
   * Get recent form analysis
   */
  getFormAnalysis(): {
    currentStreak: string;
    streakLength: number;
    formDescription: string;
  } {
    if (!this.liverpoolData) {
      return { currentStreak: 'Unknown', streakLength: 0, formDescription: 'No data available' };
    }

    const form = this.liverpoolData.seasonStats.form;
    if (form.length === 0) {
      return { currentStreak: 'Unknown', streakLength: 0, formDescription: 'No matches played' };
    }

    const lastResult = form[form.length - 1];
    let streakLength = 1;
    
    // Count consecutive results of the same type
    for (let i = form.length - 2; i >= 0; i--) {
      if (form[i] === lastResult) {
        streakLength++;
      } else {
        break;
      }
    }

    const streakType = lastResult === 'W' ? 'winning' : lastResult === 'L' ? 'losing' : 'drawing';
    const currentStreak = `${streakLength} ${streakType} streak`;
    
    const wins = form.filter(result => result === 'W').length;
    const formDescription = `${wins} wins in last ${form.length} matches`;

    return { currentStreak, streakLength, formDescription };
  }

  /**
   * Get next fixture
   */
  getNextFixture(): MatchPreview | null {
    if (!this.liverpoolData || this.liverpoolData.upcomingFixtures.length === 0) {
      return null;
    }

    return this.liverpoolData.upcomingFixtures[0];
  }

  /**
   * Get latest transfer news
   */
  getLatestTransferNews(limit: number = 5): TransferNews[] {
    if (!this.liverpoolData) return [];
    
    return this.liverpoolData.transferNews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  /**
   * Export data to CSV format
   */
  exportSquadToCSV(): string {
    if (!this.liverpoolData) return '';

    const headers = ['Name', 'Position', 'Age', 'Goals', 'Assists', 'Minutes'];
    const rows = this.liverpoolData.squad.map(player => [
      player.name,
      player.position,
      player.age?.toString() || 'N/A',
      player.goalsThisSeason?.toString() || '0',
      player.assistsThisSeason?.toString() || '0',
      player.minutesPlayed?.toString() || '0'
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Load squad data (mock implementation)
   */
  private async loadSquadData(): Promise<PlayerProfile[]> {
    // In a real implementation, this would fetch from an API or database
    return [
      {
        id: 'salah',
        name: 'Mohamed Salah',
        teamId: 'liverpool',
        position: 'Forward',
        number: 11,
        age: 32,
        nationality: 'Egypt',


      },
      {
        id: 'van-dijk',
        name: 'Virgil van Dijk',
        teamId: 'liverpool',
        position: 'Defender',
        number: 4,
        age: 33,
        nationality: 'Netherlands',

        marketValue: 45,
        contractExpiry: '2025-06-30',
        preferredFoot: 'right',
        injuryStatus: 'fit'
      },
      {
        id: 'nunez',
        name: 'Darwin Núñez',
        teamId: 'liverpool',
        position: 'Forward',
        number: 9,
        age: 25,
        nationality: 'Uruguay',

        marketValue: 75,
        contractExpiry: '2028-06-30',
        preferredFoot: 'right',
        injuryStatus: 'fit'
      }
    ];
  }

  /**
   * Load tactical analysis (mock implementation)
   */
  private async loadTacticalAnalysis(): Promise<TacticalAnalysis> {
    return {
      formation: '4-3-3',
      playingStyle: 'Possession-based with high pressing',
      keyTactics: [
        'High defensive line',
        'Quick transitions',
        'Wide attacking play',
        'Pressing triggers'
      ],
      strengths: [
        'Clinical finishing',
        'Solid defensive structure',
        'Pace on the counter',
        'Set piece threat'
      ],
      weaknesses: [
        'Vulnerability to pace in behind',
        'Occasional lapses in concentration',
        'Dependency on key players'
      ],
      comparisonWithPrevious: {
        formation: '4-3-3',
        keyChanges: [
          'More controlled possession',
          'Less gegenpressing',
          'More patient build-up play'
        ]
      }
    };
  }

  /**
   * Convert team stats to season stats format
   */
  private convertToSeasonStats(teamStats: any): SeasonStats {
    return {
      position: teamStats.position,
      points: teamStats.points,
      played: teamStats.played,
      won: teamStats.won,
      drawn: teamStats.drawn,
      lost: teamStats.lost,
      goalsFor: teamStats.goalsFor,
      goalsAgainst: teamStats.goalsAgainst,
      goalDifference: teamStats.goalDifference,
      form: teamStats.form,
      cleanSheets: Math.floor(teamStats.played * 0.6), // Mock calculation
      avgPossession: 62.5,
      avgGoalsPerGame: teamStats.goalsFor / teamStats.played
    };
  }

  /**
   * Load upcoming fixtures (mock implementation)
   */
  private async loadUpcomingFixtures(): Promise<MatchPreview[]> {
    return [
      {
        id: 'liv-che-next',
        opponent: 'Chelsea',
        date: '2025-09-29',
        venue: 'home',
        competition: 'Premier League',
        prediction: {
          result: 'win',
          confidence: 75,
          scorePrediction: '2-1'
        }
      },
      {
        id: 'liv-ars-next',
        opponent: 'Arsenal',
        date: '2025-10-06',
        venue: 'away',
        competition: 'Premier League',
        prediction: {
          result: 'draw',
          confidence: 60,
          scorePrediction: '1-1'
        }
      }
    ];
  }

  /**
   * Load transfer news (mock implementation)
   */
  private async loadTransferNews(): Promise<TransferNews[]> {
    return [
      {
        id: 'salah-contract',
        playerName: 'Mohamed Salah',
        type: 'rumor',
        status: 'rumored',
        date: '2025-09-20',
        summary: 'Contract extension talks ongoing with Liverpool'
      },
      {
        id: 'new-midfielder',
        playerName: 'Ryan Gravenberch',
        type: 'incoming',
        status: 'completed',
        fromClub: 'Bayern Munich',
        toClub: 'Liverpool',
        fee: '40M',
        date: '2025-08-15',
        summary: 'Dutch midfielder joins from Bayern Munich'
      }
    ];
  }
}
