import { DataAdapter } from '@/datasource';
import { 
  MasterData, 
  DataSyncConfig, 
  SyncStatus, 
  DataValidationResult,
  TeamData,
  MatchData,
  PlayerData,
  SyncError,
  DataQueryOptions,
  DataUpdateEvent,
  SyncEventListener,
  DataIntegrityResult
} from './types';

/**
 * Manages data synchronization and consistency across the application
 */
export class DataSyncManager {
  private config: DataSyncConfig;
  private masterData: MasterData | null = null;
  private syncStatus: SyncStatus;
  private dataAdapter: DataAdapter;
  private syncInterval: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, SyncEventListener[]> = new Map();
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor(dataAdapter: DataAdapter) {
    this.dataAdapter = dataAdapter;
    this.config = this.getDefaultConfig();
    this.syncStatus = {
      status: 'idle',
      progress: 0,
      errors: []
    };
  }

  /**
   * Initialize data sync manager
   */
  async initialize(): Promise<void> {
    try {
      await this.loadMasterData();
      
      if (this.config.autoSync) {
        this.startAutoSync();
      }

      if (this.config.debug) {
        console.log('DataSyncManager initialized:', {
          version: this.masterData?.metadata.version,
          autoSync: this.config.autoSync,
          teams: this.masterData?.teams.length,
          players: this.masterData?.players.length
        });
      }
    } catch (error) {
      console.error('Failed to initialize DataSyncManager:', error);
      this.addError('INIT_FAILED', `Initialization failed: ${error.message}`, 'critical');
      throw error;
    }
  }

  /**
   * Load master data from source
   */
  async loadMasterData(forceRefresh = false): Promise<MasterData> {
    this.updateSyncStatus('syncing', 0);

    try {
      // Check cache first
      if (!forceRefresh && this.config.cache.enabled) {
        const cached = this.getFromCache('master_data');
        if (cached) {
          this.masterData = cached;
          this.updateSyncStatus('success', 100);
          return cached;
        }
      }

      // Load from data adapter
      this.updateSyncStatus('syncing', 25);
      const data = await this.loadDataFromAdapter();
      
      this.updateSyncStatus('syncing', 50);
      
      // Validate data
      if (this.config.validation.enabled) {
        const validation = this.validateData(data);
        if (!validation.valid && this.config.validation.strict) {
          throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
        }
      }

      this.updateSyncStatus('syncing', 75);

      // Store in cache
      if (this.config.cache.enabled) {
        this.setCache('master_data', data, this.config.cache.ttl);
      }

      this.masterData = data;
      this.updateSyncStatus('success', 100);

      // Emit update event
      this.emitEvent('full_sync', data);

      if (this.config.debug) {
        console.log('Master data loaded successfully:', {
          version: data.metadata.version,
          teams: data.teams.length,
          players: data.players.length,
          matches: data.matches.length
        });
      }

      return data;
    } catch (error) {
      console.error('Failed to load master data:', error);
      this.addError('LOAD_FAILED', `Data loading failed: ${error.message}`, 'high');
      this.updateSyncStatus('error', 0);
      
      // Try fallback to cache
      if (this.config.errorHandling.fallbackToCache) {
        const cached = this.getFromCache('master_data');
        if (cached) {
          console.warn('Using cached data as fallback');
          this.masterData = cached;
          return cached;
        }
      }
      
      throw error;
    }
  }

  /**
   * Load data from adapter (mock implementation)
   */
  private async loadDataFromAdapter(): Promise<MasterData> {
    // In a real implementation, this would use the data adapter
    // For now, return mock data structure
    return {
      metadata: {
        version: '2025-09-22',
        collectionDate: new Date().toISOString(),
        source: 'BSix.com Data API',
        validated: true,
        checksum: 'mock_checksum'
      },
      siteInfo: {
        name: 'BSix.com',
        title: 'プレミアリーグ ビッグ6 試合プレビュー',
        description: 'プレミアリーグBig 6チームの試合を詳細分析',
        version: '2.0',
        lastUpdated: new Date().toISOString()
      },
      currentSeason: {
        season: '2025-26',
        currentGameweek: 5,
        nextGameweek: 6,
        bigSixTeams: ['Arsenal', 'Manchester City', 'Liverpool', 'Chelsea', 'Manchester United', 'Tottenham']
      },
      teams: await this.loadTeamsData(),
      players: await this.loadPlayersData(),
      matches: await this.loadMatchesData(),
      featuredMatches: []
    };
  }

  /**
   * Load teams data
   */
  private async loadTeamsData(): Promise<TeamData[]> {
    return [
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
        manager: {
          name: 'Arne Slot',
          nationality: 'Netherlands',
          appointed: '2024-06-01'
        },
        stadium: {
          name: 'Anfield',
          capacity: 53394,
          location: 'Liverpool'
        }
      },
      {
        id: 'arsenal',
        name: 'Arsenal',
        shortName: 'ARS',
        colors: { primary: '#EF0107', secondary: '#023474' },
        stats: {
          position: 2,
          points: 13,
          played: 5,
          won: 4,
          drawn: 1,
          lost: 0,
          goalsFor: 11,
          goalsAgainst: 3,
          goalDifference: 8,
          form: ['W', 'W', 'D', 'W', 'W']
        },
        manager: {
          name: 'Mikel Arteta',
          nationality: 'Spain',
          appointed: '2019-12-20'
        },
        stadium: {
          name: 'Emirates Stadium',
          capacity: 60260,
          location: 'London'
        }
      }
    ];
  }

  /**
   * Load players data
   */
  private async loadPlayersData(): Promise<PlayerData[]> {
    return [
      {
        id: 'salah',
        name: 'Mohamed Salah',
        position: 'Right Winger',
        number: 11,
        age: 32,
        nationality: 'Egypt',
        teamId: 'liverpool',
        stats: {
          appearances: 5,
          goals: 4,
          assists: 2,
          minutes: 450,
          yellowCards: 0,
          redCards: 0
        },
        marketValue: 55000000,
        contract: {
          expires: '2025-06-30'
        }
      }
    ];
  }

  /**
   * Load matches data
   */
  private async loadMatchesData(): Promise<MatchData[]> {
    return [
      {
        id: 'gw6-liv-che',
        gameweek: 6,
        homeTeam: 'liverpool',
        awayTeam: 'chelsea',
        date: '2025-09-28',
        time: '16:30',
        venue: 'Anfield',
        competition: 'Premier League',
        status: 'scheduled'
      }
    ];
  }

  /**
   * Get team data by ID or name
   */
  getTeamData(identifier: string, options?: DataQueryOptions): TeamData | null {
    if (!this.masterData) {
      this.addError('NO_DATA', 'Master data not loaded', 'medium');
      return null;
    }

    const team = this.masterData.teams.find(t => 
      t.id === identifier || 
      t.name.toLowerCase() === identifier.toLowerCase() ||
      t.shortName.toLowerCase() === identifier.toLowerCase()
    );

    if (!team) {
      if (this.config.debug) {
        console.warn(`Team not found: ${identifier}`);
      }
      return null;
    }

    return team;
  }

  /**
   * Get all teams data
   */
  getTeamsData(options?: DataQueryOptions): TeamData[] {
    if (!this.masterData) {
      this.addError('NO_DATA', 'Master data not loaded', 'medium');
      return [];
    }

    let teams = [...this.masterData.teams];

    // Apply filtering
    if (options?.filter) {
      teams = teams.filter(team => {
        return Object.entries(options.filter!).every(([key, value]) => {
          return (team as any)[key] === value;
        });
      });
    }

    // Apply sorting
    if (options?.sort) {
      teams.sort((a, b) => {
        const aValue = (a as any)[options.sort!.field];
        const bValue = (b as any)[options.sort!.field];
        
        if (options.sort!.direction === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      });
    }

    // Apply pagination
    if (options?.pagination) {
      const start = (options.pagination.page - 1) * options.pagination.limit;
      const end = start + options.pagination.limit;
      teams = teams.slice(start, end);
    }

    return teams;
  }

  /**
   * Get player data by ID
   */
  getPlayerData(playerId: string): PlayerData | null {
    if (!this.masterData) {
      return null;
    }

    return this.masterData.players.find(p => p.id === playerId) || null;
  }

  /**
   * Get players by team
   */
  getPlayersByTeam(teamId: string): PlayerData[] {
    if (!this.masterData) {
      return [];
    }

    return this.masterData.players.filter(p => p.teamId === teamId);
  }

  /**
   * Get match data
   */
  getMatchData(matchId: string): MatchData | null {
    if (!this.masterData) {
      return null;
    }

    return this.masterData.matches.find(m => m.id === matchId) || null;
  }

  /**
   * Get matches by team
   */
  getMatchesByTeam(teamId: string): MatchData[] {
    if (!this.masterData) {
      return [];
    }

    return this.masterData.matches.filter(m => 
      m.homeTeam === teamId || m.awayTeam === teamId
    );
  }

  /**
   * Validate data integrity
   */
  validateData(data: MasterData): DataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate teams
    if (!data.teams || data.teams.length === 0) {
      errors.push('No teams data found');
    } else {
      data.teams.forEach((team, index) => {
        if (!team.id) errors.push(`Team ${index}: Missing ID`);
        if (!team.name) errors.push(`Team ${index}: Missing name`);
        if (!team.stats) errors.push(`Team ${index}: Missing stats`);
      });
    }

    // Validate players
    if (!data.players || data.players.length === 0) {
      warnings.push('No players data found');
    } else {
      data.players.forEach((player, index) => {
        if (!player.id) errors.push(`Player ${index}: Missing ID`);
        if (!player.name) errors.push(`Player ${index}: Missing name`);
        if (!player.teamId) errors.push(`Player ${index}: Missing team ID`);
      });
    }

    // Validate matches
    if (!data.matches || data.matches.length === 0) {
      warnings.push('No matches data found');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      validatedCount: {
        teams: data.teams?.length || 0,
        players: data.players?.length || 0,
        matches: data.matches?.length || 0
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check data integrity
   */
  checkDataIntegrity(): DataIntegrityResult {
    const issues: DataIntegrityResult['issues'] = [];
    const recommendations: string[] = [];

    if (!this.masterData) {
      issues.push({
        type: 'missing_data',
        description: 'Master data not loaded',
        severity: 'critical',
        affectedItems: ['all']
      });
      recommendations.push('Load master data before checking integrity');
      
      return {
        passed: false,
        issues,
        timestamp: new Date().toISOString(),
        recommendations
      };
    }

    // Check for missing team data
    const bigSixTeams = this.masterData.currentSeason.bigSixTeams;
    const loadedTeams = this.masterData.teams.map(t => t.name);
    const missingTeams = bigSixTeams.filter(team => !loadedTeams.includes(team));
    
    if (missingTeams.length > 0) {
      issues.push({
        type: 'missing_data',
        description: 'Missing Big Six teams data',
        severity: 'high',
        affectedItems: missingTeams
      });
      recommendations.push('Load data for all Big Six teams');
    }

    // Check for outdated data
    const dataAge = Date.now() - new Date(this.masterData.metadata.collectionDate).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (dataAge > maxAge) {
      issues.push({
        type: 'outdated_data',
        description: 'Data is older than 24 hours',
        severity: 'medium',
        affectedItems: ['master_data']
      });
      recommendations.push('Refresh data from source');
    }

    return {
      passed: issues.length === 0,
      issues,
      timestamp: new Date().toISOString(),
      recommendations
    };
  }

  /**
   * Start auto-sync
   */
  startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      try {
        await this.loadMasterData(true);
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, this.config.syncInterval);

    if (this.config.debug) {
      console.log(`Auto-sync started with interval: ${this.config.syncInterval}ms`);
    }
  }

  /**
   * Stop auto-sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    if (this.config.debug) {
      console.log('Auto-sync stopped');
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Get master data
   */
  getMasterData(): MasterData | null {
    return this.masterData;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<DataSyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart auto-sync if interval changed
    if (newConfig.autoSync !== undefined || newConfig.syncInterval !== undefined) {
      if (this.config.autoSync) {
        this.startAutoSync();
      } else {
        this.stopAutoSync();
      }
    }
  }

  /**
   * Add event listener
   */
  addEventListener(eventType: string, listener: SyncEventListener): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(eventType: string, listener: SyncEventListener): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   */
  private emitEvent(type: DataUpdateEvent['type'], data: any, previousData?: any): void {
    const event: DataUpdateEvent = {
      type,
      data,
      previousData,
      timestamp: new Date().toISOString(),
      source: 'DataSyncManager'
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Event listener error:', error);
      }
    });
  }

  /**
   * Update sync status
   */
  private updateSyncStatus(status: SyncStatus['status'], progress: number): void {
    this.syncStatus = {
      ...this.syncStatus,
      status,
      progress,
      lastSync: status === 'success' ? new Date().toISOString() : this.syncStatus.lastSync
    };
  }

  /**
   * Add error to sync status
   */
  private addError(code: string, message: string, severity: SyncError['severity']): void {
    const error: SyncError = {
      code,
      message,
      timestamp: new Date().toISOString(),
      severity
    };

    this.syncStatus.errors.push(error);
    
    // Keep only recent errors (last 10)
    if (this.syncStatus.errors.length > 10) {
      this.syncStatus.errors = this.syncStatus.errors.slice(-10);
    }
  }

  /**
   * Cache management
   */
  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    if (this.config.debug) {
      console.log('Cache cleared');
    }
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): DataSyncConfig {
    return {
      autoSync: true,
      syncInterval: 5 * 60 * 1000, // 5 minutes
      dataSources: {
        master: '/data/main-data.json',
        teams: '/data/teams.json',
        players: '/data/players.json',
        matches: '/data/matches.json'
      },
      validation: {
        enabled: true,
        strict: false,
        requiredFields: ['id', 'name']
      },
      cache: {
        enabled: true,
        ttl: 10 * 60 * 1000, // 10 minutes
        maxSize: 100
      },
      errorHandling: {
        retryAttempts: 3,
        retryDelay: 1000,
        fallbackToCache: true
      },
      debug: false
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopAutoSync();
    this.clearCache();
    this.eventListeners.clear();
    
    if (this.config.debug) {
      console.log('DataSyncManager destroyed');
    }
  }
}
