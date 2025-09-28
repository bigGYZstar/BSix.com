import type { Team } from '@/types/generated/team.schema';
import { TeamsAdvancedStatsManager } from './index';
import { StaticDataAdapter } from '@/datasource/static';

export class TeamsAdvancedStatsComponent {
  private manager: TeamsAdvancedStatsManager;
  private container: HTMLElement;
  private teams: Team[] = [];

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    
    this.container = container;
    this.manager = new TeamsAdvancedStatsManager(new StaticDataAdapter());
  }

  async initialize(): Promise<void> {
    try {
      await this.loadData();
      this.render();
      this.attachEventListeners();
    } catch (error) {
      console.error('Failed to initialize TeamsAdvancedStats component:', error);
      this.renderError('Failed to load teams data');
    }
  }

  private async loadData(): Promise<void> {
    this.teams = await this.manager.getTeamsData();
    
    // Validate data
    const isValid = await this.manager.validateTeamsData();
    if (!isValid) {
      throw new Error('Teams data validation failed');
    }
  }

  private render(): void {
    const config = this.manager.getConfig();
    const sortedTeams = this.manager.sortTeams(this.teams, config.sortBy, config.sortOrder);
    
    this.container.innerHTML = `
      <div class="teams-advanced-stats">
        <div class="stats-header">
          <h2>Big 6 Teams Advanced Statistics</h2>
          <div class="controls">
            <div class="column-controls">
              <label>Show Columns:</label>
              <button id="show-all" class="btn btn-secondary">All Statistics</button>
              <button id="show-basic" class="btn btn-secondary">Basic Only</button>
            </div>
            <div class="export-controls">
              <button id="export-csv" class="btn btn-primary">Export CSV</button>
            </div>
          </div>
        </div>
        
        <div class="column-toggles">
          ${this.renderColumnToggles()}
        </div>
        
        <div class="table-container">
          <table class="teams-table">
            <thead>
              <tr>
                ${config.visibleColumns.map(col => `
                  <th class="sortable" data-column="${col}">
                    ${this.getColumnLabel(col)}
                    <span class="sort-indicator ${config.sortBy === col ? config.sortOrder : ''}"></span>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${sortedTeams.map(team => this.renderTeamRow(team, config.visibleColumns)).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="stats-footer">
          <p>Data last updated: ${new Date().toLocaleDateString()}</p>
          <p>Source: Premier League Official Data</p>
        </div>
      </div>
    `;
  }

  private renderColumnToggles(): string {
    const allColumns = [
      'position', 'name', 'points', 'played', 'won', 'drawn', 'lost',
      'goalsFor', 'goalsAgainst', 'goalDifference', 'form'
    ];
    
    const config = this.manager.getConfig();
    
    return allColumns.map(col => `
      <label class="column-toggle">
        <input type="checkbox" 
               data-column="${col}" 
               ${config.visibleColumns.includes(col) ? 'checked' : ''}>
        ${this.getColumnLabel(col)}
      </label>
    `).join('');
  }

  private renderTeamRow(team: Team, visibleColumns: string[]): string {
    return `
      <tr class="team-row" data-team-id="${team.id}">
        ${visibleColumns.map(col => `
          <td class="team-cell team-${col}">
            ${this.formatCellValue(team, col)}
          </td>
        `).join('')}
      </tr>
    `;
  }

  private formatCellValue(team: Team, column: string): string {
    let value: any;
    
    // Handle nested stats properties
    if (team.stats && ["position", "points", "played", "won", "drawn", "lost", "goalsFor", "goalsAgainst", "goalDifference", "form"].includes(column)) {
      // team.statsがundefinedの場合に備えてデフォルト値を提供
      const stats = team.stats as any; // Cast to any to allow dynamic access
      value = stats[column] ?? (team as any)[column];
    }
    
    switch (column) {
      case 'position':
        return `<span class="position-badge position-${value}">${value}</span>`;
      case 'name':
        return `<a href="team-detail.html?team=${team.id}" class="team-link">${value}</a>`;
      case 'form':
        return Array.isArray(value) 
          ? value.map(result => `<span class="form-${result.toLowerCase()}">${result}</span>`).join('')
          : '';
      case 'goalDifference':
        const diff = Number(value);
        const sign = diff > 0 ? '+' : '';
        return `<span class="goal-diff ${diff >= 0 ? 'positive' : 'negative'}">${sign}${diff}</span>`;
      default:
        return String(value || 0);
    }
  }

  private getColumnLabel(column: string): string {
    const labels: Record<string, string> = {
      position: 'Pos',
      name: 'Team',
      points: 'Pts',
      played: 'P',
      won: 'W',
      drawn: 'D',
      lost: 'L',
      goalsFor: 'GF',
      goalsAgainst: 'GA',
      goalDifference: 'GD',
      form: 'Form'
    };
    
    return labels[column] || column;
  }

  private attachEventListeners(): void {
    // Column toggles
    this.container.querySelectorAll('.column-toggle input').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const column = target.dataset.column!;
        this.manager.toggleColumn(column);
        this.render();
        this.attachEventListeners();
      });
    });

    // Show all/basic buttons
    const showAllBtn = this.container.querySelector('#show-all');
    const showBasicBtn = this.container.querySelector('#show-basic');
    
    showAllBtn?.addEventListener('click', () => {
      this.manager.showAllColumns();
      this.render();
      this.attachEventListeners();
    });
    
    showBasicBtn?.addEventListener('click', () => {
      this.manager.showBasicColumns();
      this.render();
      this.attachEventListeners();
    });

    // Export CSV
    const exportBtn = this.container.querySelector('#export-csv');
    exportBtn?.addEventListener('click', () => {
      const csv = this.manager.exportToCSV(this.teams);
      this.downloadCSV(csv, 'teams-advanced-stats.csv');
    });

    // Column sorting
    this.container.querySelectorAll('.sortable').forEach(header => {
      header.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const column = target.dataset.column!;
        const config = this.manager.getConfig();
        
        const newOrder = config.sortBy === column && config.sortOrder === 'asc' ? 'desc' : 'asc';
        this.manager.updateConfig({ sortBy: column, sortOrder: newOrder });
        
        this.render();
        this.attachEventListeners();
      });
    });
  }

  private downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private renderError(message: string): void {
    this.container.innerHTML = `
      <div class="error-container">
        <h2>Error Loading Teams Data</h2>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn btn-primary">Retry</button>
      </div>
    `;
  }
}
