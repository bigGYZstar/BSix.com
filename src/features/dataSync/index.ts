/**
 * Data Sync Feature Module
 * 
 * Provides centralized data management and synchronization for BSix.com
 * Ensures data consistency across all pages and components
 * 
 * Features:
 * - Master data loading and validation
 * - Real-time data synchronization
 * - Data integrity checks
 * - Version control and rollback
 * - Cross-page data consistency
 * - Error handling and recovery
 */

export { DataSyncManager } from './DataSyncManager';
export { DataSyncComponent } from './DataSyncComponent';
export type { 
  MasterData,
  DataSyncConfig,
  SyncStatus,
  DataValidationResult,
  TeamData,
  MatchData,
  PlayerData,
  DataVersion,
  SyncError
} from './types';
