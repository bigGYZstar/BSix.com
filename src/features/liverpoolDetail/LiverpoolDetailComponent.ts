import { LiverpoolDetailManager } from './LiverpoolDetailManager';
import { LiverpoolDetailConfig, PlayerProfile, MatchPreview, TransferNews } from './types';

/**
 * UI Component for Liverpool team detail page
 */
export class LiverpoolDetailComponent {
  private manager: LiverpoolDetailManager;
  private container: HTMLElement;

  constructor(manager: LiverpoolDetailManager, container: HTMLElement) {
    this.manager = manager;
    this.container = container;
  }

  /**
   * Render the complete Liverpool detail page
   */
  async render(): Promise<void> {
    try {
      await this.manager.initialize();
      const liverpoolData = this.manager.getLiverpoolData();
      
      if (!liverpoolData) {
        this.renderError('Liverpool data not available');
        return;
      }

      const config = this.manager.getConfig();
      
      this.container.innerHTML = `
        <div class="liverpool-detail-page">
          ${this.renderHeader(liverpoolData)}
          ${this.renderSeasonStats(liverpoolData.seasonStats)}
          ${config.showTacticalAnalysis ? this.renderTacticalAnalysis(liverpoolData.tactics) : ''}
          ${config.showPlayerStats ? this.renderSquadSection(liverpoolData.squad) : ''}
          ${config.showRecentForm ? this.renderFormAnalysis() : ''}
          ${config.showUpcomingFixtures ? this.renderUpcomingFixtures(liverpoolData.upcomingFixtures) : ''}
          ${config.showTransferNews ? this.renderTransferNews(liverpoolData.transferNews) : ''}
          ${this.renderControls()}
        </div>
      `;

      this.attachEventListeners();
    } catch (error) {
      console.error('Failed to render Liverpool detail page:', error);
      this.renderError('Failed to load Liverpool data');
    }
  }

  /**
   * Render page header with team information
   */
  private renderHeader(liverpoolData: any): string {
    return `
      <header class="liverpool-header">
        <div class="team-identity">
          <div class="team-badge">
            <div class="badge-placeholder" style="background: ${liverpoolData.colors.primary}">LFC</div>
          </div>
          <div class="team-info">
            <h1 class="team-name">${liverpoolData.name}</h1>
            <p class="team-nickname">The Reds</p>
            <p class="manager-info">Manager: ${liverpoolData.manager.name}</p>
          </div>
        </div>
        <div class="current-position">
          <span class="position-badge position-${liverpoolData.seasonStats.position}">
            ${liverpoolData.seasonStats.position}
          </span>
          <span class="position-label">Premier League</span>
        </div>
      </header>
    `;
  }

  /**
   * Render season statistics
   */
  private renderSeasonStats(stats: any): string {
    return `
      <section class="season-stats">
        <h2>📊 2025/26 Season Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">${stats.position}</span>
            <span class="stat-label">Position</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${stats.points}</span>
            <span class="stat-label">Points</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${stats.won}</span>
            <span class="stat-label">Wins</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${stats.goalsFor}</span>
            <span class="stat-label">Goals For</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${stats.goalsAgainst}</span>
            <span class="stat-label">Goals Against</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${stats.cleanSheets || 0}</span>
            <span class="stat-label">Clean Sheets</span>
          </div>
        </div>
        <div class="form-display">
          <h3>Recent Form</h3>
          <div class="form-badges">
            ${stats.form.map((result: string) => 
              `<span class="form-badge form-${result.toLowerCase()}">${result}</span>`
            ).join('')}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render tactical analysis
   */
  private renderTacticalAnalysis(tactics: any): string {
    return `
      <section class="tactical-analysis">
        <h2>⚽ Tactical Analysis</h2>
        <div class="tactics-grid">
          <div class="formation-card">
            <h3>Formation</h3>
            <div class="formation-display">${tactics.formation}</div>
            <p>${tactics.playingStyle}</p>
          </div>
          <div class="strengths-card">
            <h3>Key Strengths</h3>
            <ul>
              ${tactics.strengths.map((strength: string) => `<li>${strength}</li>`).join('')}
            </ul>
          </div>
          <div class="tactics-card">
            <h3>Key Tactics</h3>
            <ul>
              ${tactics.keyTactics.map((tactic: string) => `<li>${tactic}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render squad section
   */
  private renderSquadSection(squad: PlayerProfile[]): string {
    const topPerformers = this.manager.getTopPerformers();
    
    return `
      <section class="squad-section">
        <h2>👥 Squad Overview</h2>
        
        <div class="top-performers">
          <h3>Top Performers This Season</h3>
          <div class="performers-grid">
            <div class="performer-card">
              <h4>Top Scorer</h4>
              <p>${topPerformers.topScorer?.name || 'N/A'}</p>
              <span class="stat">${topPerformers.topScorer?.goalsThisSeason || 0} goals</span>
            </div>
            <div class="performer-card">
              <h4>Top Assister</h4>
              <p>${topPerformers.topAssister?.name || 'N/A'}</p>
              <span class="stat">${topPerformers.topAssister?.assistsThisSeason || 0} assists</span>
            </div>
            <div class="performer-card">
              <h4>Most Minutes</h4>
              <p>${topPerformers.mostMinutes?.name || 'N/A'}</p>
              <span class="stat">${topPerformers.mostMinutes?.minutesPlayed || 0} mins</span>
            </div>
          </div>
        </div>

        <div class="squad-filters">
          <button class="filter-btn active" data-position="all">All Players</button>
          <button class="filter-btn" data-position="goalkeeper">Goalkeepers</button>
          <button class="filter-btn" data-position="defender">Defenders</button>
          <button class="filter-btn" data-position="midfielder">Midfielders</button>
          <button class="filter-btn" data-position="forward">Forwards</button>
        </div>

        <div class="squad-grid" id="squad-grid">
          ${this.renderSquadGrid(squad)}
        </div>
      </section>
    `;
  }

  /**
   * Render squad grid
   */
  private renderSquadGrid(squad: PlayerProfile[]): string {
    return squad.map(player => `
      <div class="player-card" data-position="${player.position.toLowerCase()}">
        <div class="player-header">
          <span class="player-number">${player.number || '?'}</span>
          <span class="player-name">${player.name}</span>
        </div>
        <div class="player-position">${player.position}</div>
        <div class="player-stats">
          <div class="stat-item">
            <span class="stat-value">${player.goalsThisSeason || 0}</span>
            <span class="stat-label">Goals</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${player.assistsThisSeason || 0}</span>
            <span class="stat-label">Assists</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${player.minutesPlayed || 0}</span>
            <span class="stat-label">Minutes</span>
          </div>
        </div>
        <div class="player-meta">
          <span class="age">Age: ${player.age || 'N/A'}</span>
          <span class="nationality">${player.nationality || 'N/A'}</span>
        </div>
        <div class="injury-status status-${player.injuryStatus || 'fit'}">
          ${player.injuryStatus || 'fit'}
        </div>
      </div>
    `).join('');
  }

  /**
   * Render form analysis
   */
  private renderFormAnalysis(): string {
    const formAnalysis = this.manager.getFormAnalysis();
    
    return `
      <section class="form-analysis">
        <h2>📈 Form Analysis</h2>
        <div class="form-summary">
          <div class="current-streak">
            <h3>Current Streak</h3>
            <p class="streak-text">${formAnalysis.currentStreak}</p>
          </div>
          <div class="form-description">
            <h3>Recent Performance</h3>
            <p>${formAnalysis.formDescription}</p>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render upcoming fixtures
   */
  private renderUpcomingFixtures(fixtures: MatchPreview[]): string {
    return `
      <section class="upcoming-fixtures">
        <h2>📅 Upcoming Fixtures</h2>
        <div class="fixtures-list">
          ${fixtures.map(fixture => `
            <div class="fixture-card">
              <div class="fixture-date">${new Date(fixture.date).toLocaleDateString('ja-JP')}</div>
              <div class="fixture-match">
                <span class="venue-indicator ${fixture.venue}">${fixture.venue === 'home' ? 'vs' : '@'}</span>
                <span class="opponent">${fixture.opponent}</span>
              </div>
              <div class="fixture-competition">${fixture.competition}</div>
              ${fixture.prediction ? `
                <div class="prediction">
                  <span class="prediction-result">${fixture.prediction.result}</span>
                  <span class="prediction-score">${fixture.prediction.scorePrediction || ''}</span>
                  <span class="confidence">${fixture.prediction.confidence}% confidence</span>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Render transfer news
   */
  private renderTransferNews(transferNews: TransferNews[]): string {
    const latestNews = this.manager.getLatestTransferNews(3);
    
    return `
      <section class="transfer-news">
        <h2>📰 Transfer News</h2>
        <div class="news-list">
          ${latestNews.map(news => `
            <div class="news-item">
              <div class="news-header">
                <span class="player-name">${news.playerName}</span>
                <span class="news-type type-${news.type}">${news.type}</span>
                <span class="news-status status-${news.status}">${news.status}</span>
              </div>
              <div class="news-content">
                <p>${news.summary}</p>
                ${news.fee ? `<span class="transfer-fee">Fee: ${news.fee}</span>` : ''}
              </div>
              <div class="news-date">${new Date(news.date).toLocaleDateString('ja-JP')}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Render control buttons
   */
  private renderControls(): string {
    return `
      <section class="controls">
        <div class="control-buttons">
          <button id="toggle-detailed" class="control-btn">Toggle Detailed View</button>
          <button id="export-squad" class="control-btn">Export Squad Data</button>
          <button id="refresh-data" class="control-btn">Refresh Data</button>
        </div>
      </section>
    `;
  }

  /**
   * Render error message
   */
  private renderError(message: string): void {
    this.container.innerHTML = `
      <div class="error-message">
        <h2>Error</h2>
        <p>${message}</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    // Squad position filters
    const filterButtons = this.container.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const position = target.dataset.position!;
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        
        // Filter squad
        this.filterSquad(position);
      });
    });

    // Control buttons
    const toggleDetailedBtn = this.container.querySelector('#toggle-detailed');
    toggleDetailedBtn?.addEventListener('click', () => {
      const config = this.manager.getConfig();
      this.manager.updateConfig({ 
        displayMode: config.displayMode === 'detailed' ? 'summary' : 'detailed' 
      });
      this.render();
    });

    const exportBtn = this.container.querySelector('#export-squad');
    exportBtn?.addEventListener('click', () => {
      const csv = this.manager.exportSquadToCSV();
      this.downloadCSV(csv, 'liverpool-squad.csv');
    });

    const refreshBtn = this.container.querySelector('#refresh-data');
    refreshBtn?.addEventListener('click', () => {
      this.render();
    });
  }

  /**
   * Filter squad by position
   */
  private filterSquad(position: string): void {
    const playerCards = this.container.querySelectorAll('.player-card');
    
    playerCards.forEach(card => {
      const cardElement = card as HTMLElement;
      const playerPosition = cardElement.dataset.position!;
      
      if (position === 'all' || playerPosition.includes(position)) {
        cardElement.style.display = 'block';
      } else {
        cardElement.style.display = 'none';
      }
    });
  }

  /**
   * Download CSV file
   */
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
}
