import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LiverpoolDetailManager } from '@/features/liverpoolDetail/LiverpoolDetailManager';
import { LiverpoolDetailComponent } from '@/features/liverpoolDetail/LiverpoolDetailComponent';
import { StaticDataAdapter } from '@/datasource/static';
import type { Team } from '@/types/generated/team.schema';

// Mock the data adapter
vi.mock('@/datasource/static');

describe('LiverpoolDetailManager', () => {
  let manager: LiverpoolDetailManager;
  let mockAdapter: StaticDataAdapter;
  let mockLiverpoolTeam: Team;

  beforeEach(() => {
    mockLiverpoolTeam = {
      id: 'liverpool',
      name: 'Liverpool',
      shortName: 'LIV',
      colors: { primary: '#C8102E', secondary: '#00B2A9' },
      stats: {
        position: 1,
        points: 15,
        played: 5,
        won: 5,
        drawn: 0,
        lost: 0,
        goalsFor: 12,
        goalsAgainst: 2,
        goalDifference: 10,
        form: ['W', 'W', 'W', 'W', 'W']
      },
      keyStrengths: [],
      areasForImprovement: []
    };

    mockAdapter = new StaticDataAdapter();
    vi.mocked(mockAdapter.getTeams).mockResolvedValue([mockLiverpoolTeam]);
    
    manager = new LiverpoolDetailManager(mockAdapter);
  });

  describe('initialization', () => {
    it('should initialize with default configuration', () => {
      const config = manager.getConfig();
      
      expect(config.showPlayerStats).toBe(true);
      expect(config.showTacticalAnalysis).toBe(true);
      expect(config.showRecentForm).toBe(true);
      expect(config.showUpcomingFixtures).toBe(true);
      expect(config.showTransferNews).toBe(true);
      expect(config.displayMode).toBe('detailed');
    });

    it('should load Liverpool data successfully', async () => {
      await manager.initialize();
      const liverpoolData = manager.getLiverpoolData();
      
      expect(liverpoolData).not.toBeNull();
      expect(liverpoolData!.name).toBe('Liverpool');
      expect(liverpoolData!.manager.name).toBe('Arne Slot');
    });

    it('should throw error when Liverpool team not found', async () => {
      vi.mocked(mockAdapter.getTeams).mockResolvedValue([]);
      
      await expect(manager.initialize()).rejects.toThrow('Liverpool team data not found');
    });
  });

  describe('configuration management', () => {
    it('should update configuration correctly', () => {
      const newConfig = { showPlayerStats: false, displayMode: 'summary' as const };
      manager.updateConfig(newConfig);
      
      const config = manager.getConfig();
      expect(config.showPlayerStats).toBe(false);
      expect(config.displayMode).toBe('summary');
      expect(config.showTacticalAnalysis).toBe(true); // Should remain unchanged
    });
  });

  describe('squad management', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should return all squad members when no position filter', () => {
      const squad = manager.getSquadByPosition();
      expect(squad.length).toBeGreaterThan(0);
    });

    it('should filter squad by position', () => {
      const strikers = manager.getSquadByPosition('striker');
      expect(strikers.every(player => 
        player.position?.toLowerCase().includes("striker")
      )).toBe(true);
    });

    it('should identify top performers correctly', () => {
      const topPerformers = manager.getTopPerformers();
      
      expect(topPerformers.topScorer).not.toBeNull();
      expect(topPerformers.topAssister).not.toBeNull();
      expect(topPerformers.mostMinutes).not.toBeNull();
    });
  });

  describe('form analysis', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should analyze current form correctly', () => {
      const formAnalysis = manager.getFormAnalysis();
      
      expect(formAnalysis.currentStreak).toContain('winning');
      expect(formAnalysis.streakLength).toBe(5);
      expect(formAnalysis.formDescription).toContain('5 wins');
    });
  });

  describe('fixtures and transfers', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should return next fixture', () => {
      const nextFixture = manager.getNextFixture();
      expect(nextFixture).not.toBeNull();
      expect(nextFixture!.opponent).toBeDefined();
    });

    it('should return latest transfer news', () => {
      const transferNews = manager.getLatestTransferNews(3);
      expect(transferNews.length).toBeLessThanOrEqual(3);
    });
  });

  describe('data export', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should export squad data to CSV format', () => {
      const csv = manager.exportSquadToCSV();
      
      expect(csv).toContain('Name,Position,Age,Goals,Assists,Minutes');
      expect(csv).toContain('Mohamed Salah');
    });
  });
});

describe('LiverpoolDetailComponent', () => {
  let component: LiverpoolDetailComponent;
  let manager: LiverpoolDetailManager;
  let container: HTMLElement;
  let mockAdapter: StaticDataAdapter;

  beforeEach(() => {
    // Create container element
    container = document.createElement('div');
    document.body.appendChild(container);

    // Setup mocks
    mockAdapter = new StaticDataAdapter();
    vi.mocked(mockAdapter.getTeams).mockResolvedValue([{
      id: 'liverpool',
      name: 'Liverpool',
      shortName: 'LIV',
      colors: { primary: '#C8102E', secondary: '#00B2A9' },
      stats: {
        position: 1,
        points: 15,
        played: 5,
        won: 5,
        drawn: 0,
        lost: 0,
        goalsFor: 12,
        goalsAgainst: 2,
        goalDifference: 10,
        form: ['W', 'W', 'W', 'W', 'W'] as ("W" | "D" | "L")[]
      }
    }]);

    manager = new LiverpoolDetailManager(mockAdapter);
    component = new LiverpoolDetailComponent(manager, container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering', () => {
    it('should render Liverpool detail page successfully', async () => {
      await component.render();
      
      expect(container.querySelector('.liverpool-detail-page')).not.toBeNull();
      expect(container.querySelector('.liverpool-header')).not.toBeNull();
      expect(container.querySelector('.season-stats')).not.toBeNull();
    });

    it('should render team header with correct information', async () => {
      await component.render();
      
      const teamName = container.querySelector('.team-name');
      expect(teamName?.textContent).toBe('Liverpool');
      
      const managerInfo = container.querySelector('.manager-info');
      expect(managerInfo?.textContent).toContain('Arne Slot');
    });

    it('should render season statistics', async () => {
      await component.render();
      
      const statsGrid = container.querySelector('.stats-grid');
      expect(statsGrid).not.toBeNull();
      
      const statCards = container.querySelectorAll('.stat-card');
      expect(statCards.length).toBeGreaterThan(0);
    });

    it('should render squad section with player cards', async () => {
      await component.render();
      
      const squadSection = container.querySelector('.squad-section');
      expect(squadSection).not.toBeNull();
      
      const playerCards = container.querySelectorAll('.player-card');
      expect(playerCards.length).toBeGreaterThan(0);
    });

    it('should render error message when data loading fails', async () => {
      vi.mocked(mockAdapter.getTeams).mockRejectedValue(new Error('Network error'));
      
      await component.render();
      
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).not.toBeNull();
    });
  });

  describe('interactions', () => {
    beforeEach(async () => {
      await component.render();
    });

    it('should filter squad by position when filter button clicked', () => {
      const filterBtn = container.querySelector('[data-position="midfielder"]') as HTMLElement;
      filterBtn?.click();
      
      const activeBtn = container.querySelector('.filter-btn.active');
      expect(activeBtn?.textContent).toContain('Midfielders');
    });

    it('should toggle detailed view when toggle button clicked', () => {
      const toggleBtn = container.querySelector('#toggle-detailed') as HTMLElement;
      const initialConfig = manager.getConfig();
      
      toggleBtn?.click();
      
      const newConfig = manager.getConfig();
      expect(newConfig.displayMode).not.toBe(initialConfig.displayMode);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', async () => {
      await component.render();
      
      const h1 = container.querySelector('h1');
      const h2s = container.querySelectorAll('h2');
      
      expect(h1).not.toBeNull();
      expect(h2s.length).toBeGreaterThan(0);
    });

    it('should have proper button labels', async () => {
      await component.render();
      
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button.textContent?.trim()).not.toBe('');
      });
    });
  });
});
