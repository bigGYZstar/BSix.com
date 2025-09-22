/**
 * Data source adapters
 * Handles data fetching from various sources (static JSON, APIs, etc.)
 */

export interface DataSource<T> {
  fetch(): Promise<T>;
  validate(data: unknown): data is T;
}

export class StaticJSONDataSource<T> implements DataSource<T> {
  constructor(
    private url: string,
    private validator: (data: unknown) => data is T
  ) {}

  async fetch(): Promise<T> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!this.validate(data)) {
        throw new Error('Data validation failed');
      }
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch data from ${this.url}:`, error);
      throw error;
    }
  }

  validate(data: unknown): data is T {
    return this.validator(data);
  }
}

export class APIDataSource<T> implements DataSource<T> {
  constructor(
    private baseUrl: string,
    private endpoint: string,
    private validator: (data: unknown) => data is T,
    private options: RequestInit = {}
  ) {}

  async fetch(): Promise<T> {
    const url = `${this.baseUrl}${this.endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...this.options,
        headers: {
          'Content-Type': 'application/json',
          ...this.options.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!this.validate(data)) {
        throw new Error('API data validation failed');
      }
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch data from API ${url}:`, error);
      throw error;
    }
  }

  validate(data: unknown): data is T {
    return this.validator(data);
  }
}

export class CachedDataSource<T> implements DataSource<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();
  
  constructor(
    private source: DataSource<T>,
    private cacheKey: string,
    private ttl: number = 5 * 60 * 1000 // 5 minutes default
  ) {}

  async fetch(): Promise<T> {
    const cached = this.cache.get(this.cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < this.ttl) {
      return cached.data;
    }
    
    try {
      const data = await this.source.fetch();
      this.cache.set(this.cacheKey, { data, timestamp: now });
      return data;
    } catch (error) {
      // If fetch fails and we have cached data, return it even if stale
      if (cached) {
        console.warn('Using stale cached data due to fetch failure');
        return cached.data;
      }
      throw error;
    }
  }

  validate(data: unknown): data is T {
    return this.source.validate(data);
  }

  clearCache(): void {
    this.cache.delete(this.cacheKey);
  }

  clearAllCache(): void {
    this.cache.clear();
  }
}

// Type guards for data validation
export const isTeamData = (data: unknown): data is any => {
  return typeof data === 'object' && 
         data !== null && 
         'id' in data && 
         'name' in data && 
         'shortName' in data;
};

export const isMatchData = (data: unknown): data is any => {
  return typeof data === 'object' && 
         data !== null && 
         'id' in data && 
         'date' in data && 
         'homeTeamId' in data && 
         'awayTeamId' in data;
};

export const isPlayerData = (data: unknown): data is any => {
  return typeof data === 'object' && 
         data !== null && 
         'id' in data && 
         'name' in data && 
         'position' in data;
};

// Data source factory
export class DataSourceFactory {
  static createTeamsDataSource(url: string): DataSource<any[]> {
    return new StaticJSONDataSource(url, (data): data is any[] => 
      Array.isArray(data) && data.every(isTeamData)
    );
  }

  static createMatchesDataSource(url: string): DataSource<any[]> {
    return new StaticJSONDataSource(url, (data): data is any[] => 
      Array.isArray(data) && data.every(isMatchData)
    );
  }

  static createPlayersDataSource(url: string): DataSource<any[]> {
    return new StaticJSONDataSource(url, (data): data is any[] => 
      Array.isArray(data) && data.every(isPlayerData)
    );
  }

  static createCachedDataSource<T>(
    source: DataSource<T>, 
    cacheKey: string, 
    ttl?: number
  ): DataSource<T> {
    return new CachedDataSource(source, cacheKey, ttl);
  }
}

// Data manager for coordinating multiple data sources
export class DataManager {
  private sources: Map<string, DataSource<any>> = new Map();
  private loadingStates: Map<string, boolean> = new Map();
  private errors: Map<string, Error> = new Map();

  registerSource<T>(key: string, source: DataSource<T>): void {
    this.sources.set(key, source);
  }

  async loadData<T>(key: string): Promise<T> {
    const source = this.sources.get(key);
    if (!source) {
      throw new Error(`Data source '${key}' not found`);
    }

    this.loadingStates.set(key, true);
    this.errors.delete(key);

    try {
      const data = await source.fetch();
      this.loadingStates.set(key, false);
      return data;
    } catch (error) {
      this.loadingStates.set(key, false);
      this.errors.set(key, error as Error);
      throw error;
    }
  }

  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  getError(key: string): Error | null {
    return this.errors.get(key) || null;
  }

  async loadAllData(): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    const promises = Array.from(this.sources.keys()).map(async (key) => {
      try {
        results[key] = await this.loadData(key);
      } catch (error) {
        console.error(`Failed to load data for '${key}':`, error);
        results[key] = null;
      }
    });

    await Promise.all(promises);
    return results;
  }
}

export const dataManager = new DataManager();
