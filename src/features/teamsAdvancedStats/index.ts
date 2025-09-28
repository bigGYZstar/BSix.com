import type { Team } from '@/types/generated/team.schema';
import { StaticDataAdapter } from '@/datasource/static';

export interface TeamsAdvancedStatsConfig {
  visibleColumns: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filterBy: Record<string, any>;
}

export class TeamsAdvancedStatsManager {
  private adapter: StaticDataAdapter;
  private config: TeamsAdvancedStatsConfig;

  constructor(adapter: StaticDataAdapter) {
    this.adapter = adapter;
    this.config = {
      visibleColumns: ['position', 'name', 'points', 'played', 'won', 'drawn', 'lost'],
      sortBy: 'position',
      sortOrder: 'asc',
      filterBy: {}
    };
  }

  async getTeamsData(): Promise<Team[]> {
    return await this.adapter.getTeams();
  }

  async getBig6Teams(): Promise<Team[]> {
    const teams = await this.getTeamsData();
    const big6Names = ['Liverpool', 'Arsenal', 'Chelsea', 'Manchester City', 'Manchester United', 'Tottenham'];
    return teams.filter(team => 
      big6Names.some(name => team.name.includes(name))
    );
  }

  updateConfig(newConfig: Partial<TeamsAdvancedStatsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): TeamsAdvancedStatsConfig {
    return { ...this.config };
  }

  toggleColumn(columnName: string): void {
    const { visibleColumns } = this.config;
    if (visibleColumns.includes(columnName)) {
      this.config.visibleColumns = visibleColumns.filter(col => col !== columnName);
    } else {
      this.config.visibleColumns = [...visibleColumns, columnName];
    }
  }

  showAllColumns(): void {
    this.config.visibleColumns = [
      'position', 'name', 'points', 'played', 'won', 'drawn', 'lost',
      'goalsFor', 'goalsAgainst', 'goalDifference', 'form'
    ];
  }

  showBasicColumns(): void {
    this.config.visibleColumns = ['position', 'name', 'points', 'played'];
  }

  sortTeams(teams: Team[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): Team[] {
    return [...teams].sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }

  exportToCSV(teams: Team[]): string {
    const headers = this.config.visibleColumns;
    const csvContent = [
      headers.join(','),
      ...teams.map(team => 
        headers.map(header => {
          const value = (team as any)[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }

  async validateTeamsData(): Promise<boolean> {
    const result = await this.adapter.validateData();
    if (!result.isValid) {
      console.error('Teams data validation failed:', result.errors);
      return false;
    }
    
    if (result.warnings.length > 0) {
      console.warn('Teams data validation warnings:', result.warnings);
    }
    
    return true;
  }
}
