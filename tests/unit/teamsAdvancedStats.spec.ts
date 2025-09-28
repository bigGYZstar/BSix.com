import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TeamsAdvancedStatsManager } from '@/features/teamsAdvancedStats';
import { StaticDataAdapter } from '@/datasource/static';
import type { Team } from '@/types/generated/team.schema';

// Mock the StaticDataAdapter
vi.mock('@/datasource/static');

describe('TeamsAdvancedStatsManager', () => {
  let manager: TeamsAdvancedStatsManager;
  let mockAdapter: StaticDataAdapter;
  let mockTeams: Team[];

  beforeEach(() => {
    mockTeams = [
      {
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
      },
      {
        id: 'arsenal',
        name: 'Arsenal',
        shortName: 'ARS',
        colors: { primary: '#EF0107', secondary: '#023474' },
        stats: {
          position: 2,
          points: 9,
          played: 4,
          won: 3,
          drawn: 0,
          lost: 1,
          goalsFor: 8,
          goalsAgainst: 3,
          goalDifference: 5,
          form: ['W', 'W', 'W', 'L']
        },
        keyStrengths: [],
        areasForImprovement: []
      }
    ];

    mockAdapter = new StaticDataAdapter();
    vi.mocked(mockAdapter.getTeams).mockResolvedValue(mockTeams);
    vi.mocked(mockAdapter.validateData).mockResolvedValue({
      isValid: true,
      errors: [],
      warnings: []
    });

    manager = new TeamsAdvancedStatsManager(mockAdapter);
  });

  describe('getTeamsData', () => {
    it('should return teams data from adapter', async () => {
      const teams = await manager.getTeamsData();
      expect(teams).toEqual(mockTeams);
      expect(mockAdapter.getTeams).toHaveBeenCalledOnce();
    });
  });

  describe('getBig6Teams', () => {
    it('should filter and return only Big 6 teams', async () => {
      const big6Teams = await manager.getBig6Teams();
      expect(big6Teams).toHaveLength(2);
      expect(big6Teams.map(t => t.name)).toEqual(['Liverpool', 'Arsenal']);
    });
  });

  describe('configuration management', () => {
    it('should have default configuration', () => {
      const config = manager.getConfig();
      expect(config.visibleColumns).toEqual(['position', 'name', 'points', 'played', 'won', 'drawn', 'lost']);
      expect(config.sortBy).toBe('position');
      expect(config.sortOrder).toBe('asc');
    });

    it('should update configuration', () => {
      manager.updateConfig({ sortBy: 'points', sortOrder: 'desc' });
      const config = manager.getConfig();
      expect(config.sortBy).toBe('points');
      expect(config.sortOrder).toBe('desc');
    });

    it('should toggle column visibility', () => {
      manager.toggleColumn('goalsFor');
      const config = manager.getConfig();
      expect(config.visibleColumns).toContain('goalsFor');

      manager.toggleColumn('goalsFor');
      const updatedConfig = manager.getConfig();
      expect(updatedConfig.visibleColumns).not.toContain('goalsFor');
    });

    it('should show all columns', () => {
      manager.showAllColumns();
      const config = manager.getConfig();
      expect(config.visibleColumns).toEqual([
        'position', 'name', 'points', 'played', 'won', 'drawn', 'lost',
        'goalsFor', 'goalsAgainst', 'goalDifference', 'form'
      ]);
    });

    it('should show basic columns only', () => {
      manager.showBasicColumns();
      const config = manager.getConfig();
      expect(config.visibleColumns).toEqual(['position', 'name', 'points', 'played']);
    });
  });

  describe('sortTeams', () => {
    it('should sort teams by numeric field ascending', () => {
      const sorted = manager.sortTeams(mockTeams, 'points', 'asc');
      expect(sorted[0].stats.points).toBe(9);
      expect(sorted[1].stats.points).toBe(15);
    });

    it('should sort teams by numeric field descending', () => {
      const sorted = manager.sortTeams(mockTeams, 'points', 'desc');
      expect(sorted[0].stats.points).toBe(15);
      expect(sorted[1].stats.points).toBe(9);
    });

    it('should sort teams by string field', () => {
      const sorted = manager.sortTeams(mockTeams, 'name', 'asc');
      expect(sorted[0].name).toBe('Arsenal');
      expect(sorted[1].name).toBe('Liverpool');
    });
  });

  describe('exportToCSV', () => {
    it('should generate CSV with visible columns', () => {
      manager.showBasicColumns();
      const csv = manager.exportToCSV(mockTeams);
      
      const lines = csv.split('\n');
      expect(lines[0]).toBe('position,name,points,played');
      expect(lines[1]).toBe('1,"Liverpool",15,5');
      expect(lines[2]).toBe('2,"Arsenal",9,4');
    });

    it('should handle numeric and string values correctly', () => {
      const csv = manager.exportToCSV([mockTeams[0]]);
      expect(csv).toContain('"Liverpool"');
      expect(csv).toContain('15');
      expect(csv).toContain('5');
    });
  });

  describe('validateTeamsData', () => {
    it('should return true for valid data', async () => {
      const isValid = await manager.validateTeamsData();
      expect(isValid).toBe(true);
      expect(mockAdapter.validateData).toHaveBeenCalledOnce();
    });

    it('should return false for invalid data', async () => {
      vi.mocked(mockAdapter.validateData).mockResolvedValue({
        isValid: false,
        errors: [{ type: 'data', message: 'Invalid data', path: 'teams[0]' }],
        warnings: []
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const isValid = await manager.validateTeamsData();
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Teams data validation failed:', expect.any(Array));
      
      consoleSpy.mockRestore();
    });

    it('should log warnings for data with warnings', async () => {
      vi.mocked(mockAdapter.validateData).mockResolvedValue({
        isValid: true,
        errors: [],
        warnings: [{ type: 'missing', message: 'Missing optional field', path: 'teams[0].logo' }]
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const isValid = await manager.validateTeamsData();
      expect(isValid).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('Teams data validation warnings:', expect.any(Array));
      
      consoleSpy.mockRestore();
    });
  });
});
