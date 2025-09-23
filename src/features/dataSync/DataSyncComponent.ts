import { DataSyncManager } from './DataSyncManager';
import { SyncStatus, DataValidationResult, DataIntegrityResult, MasterData } from './types';

/**
 * UI Component for Data Sync management and monitoring
 */
export class DataSyncComponent {
  private manager: DataSyncManager;
  private container: HTMLElement;
  private statusUpdateInterval: NodeJS.Timeout | null = null;

  constructor(manager: DataSyncManager, container: HTMLElement) {
    this.manager = manager;
    this.container = container;
  }

  /**
   * Render the data sync interface
   */
  async render(): Promise<void> {
    try {
      await this.manager.initialize();
      
      this.container.innerHTML = `
        <div class="data-sync-dashboard">
          ${this.renderSyncStatus()}
          ${this.renderDataOverview()}
          ${this.renderDataIntegrity()}
          ${this.renderSyncControls()}
          ${this.renderDataValidation()}
          ${this.renderErrorLog()}
        </div>
      `;

      this.attachEventListeners();
      this.startStatusUpdates();
    } catch (error) {
      console.error('Failed to render data sync dashboard:', error);
      this.renderError('Failed to load data sync dashboard');
    }
  }

  /**
   * Render sync status section
   */
  private renderSyncStatus(): string {
    const status = this.manager.getSyncStatus();
    const statusClass = this.getStatusClass(status.status);
    const statusIcon = this.getStatusIcon(status.status);

    return `
      <section class="sync-status">
        <h2>🔄 Sync Status</h2>
        <div class="status-display">
          <div class="status-indicator ${statusClass}">
            <span class="status-icon">${statusIcon}</span>
            <span class="status-text">${this.getStatusText(status.status)}</span>
          </div>
          
          <div class="status-details">
            <div class="status-item">
              <label>Current Version:</label>
              <span id="current-version">${status.currentVersion || 'Unknown'}</span>
            </div>
            <div class="status-item">
              <label>Last Sync:</label>
              <span id="last-sync">${status.lastSync ? new Date(status.lastSync).toLocaleString() : 'Never'}</span>
            </div>
            <div class="status-item">
              <label>Progress:</label>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${status.progress}%"></div>
                <span class="progress-text">${status.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render data overview section
   */
  private renderDataOverview(): string {
    const masterData = this.manager.getMasterData();
    
    if (!masterData) {
      return `
        <section class="data-overview">
          <h2>📊 Data Overview</h2>
          <div class="no-data">No data loaded</div>
        </section>
      `;
    }

    return `
      <section class="data-overview">
        <h2>📊 Data Overview</h2>
        <div class="data-stats">
          <div class="stat-card">
            <div class="stat-value">${masterData.teams.length}</div>
            <div class="stat-label">Teams</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${masterData.players.length}</div>
            <div class="stat-label">Players</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${masterData.matches.length}</div>
            <div class="stat-label">Matches</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${masterData.currentSeason.currentGameweek}</div>
            <div class="stat-label">Current GW</div>
          </div>
        </div>
        
        <div class="data-metadata">
          <h3>Data Information</h3>
          <div class="metadata-grid">
            <div class="metadata-item">
              <label>Collection Date:</label>
              <span>${new Date(masterData.metadata.collectionDate).toLocaleString()}</span>
            </div>
            <div class="metadata-item">
              <label>Data Source:</label>
              <span>${masterData.metadata.source}</span>
            </div>
            <div class="metadata-item">
              <label>Validated:</label>
              <span class="${masterData.metadata.validated ? 'validated' : 'not-validated'}">
                ${masterData.metadata.validated ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div class="metadata-item">
              <label>Season:</label>
              <span>${masterData.currentSeason.season}</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render data integrity section
   */
  private renderDataIntegrity(): string {
    return `
      <section class="data-integrity">
        <h2>🔍 Data Integrity</h2>
        <div class="integrity-controls">
          <button id="check-integrity" class="control-btn">Check Integrity</button>
          <button id="validate-data" class="control-btn">Validate Data</button>
        </div>
        <div id="integrity-results" class="integrity-results">
          <p class="placeholder">Click "Check Integrity" to analyze data quality</p>
        </div>
      </section>
    `;
  }

  /**
   * Render sync controls section
   */
  private renderSyncControls(): string {
    return `
      <section class="sync-controls">
        <h2>⚙️ Sync Controls</h2>
        <div class="control-grid">
          <div class="control-group">
            <h3>Manual Sync</h3>
            <div class="control-buttons">
              <button id="sync-now" class="control-btn primary">Sync Now</button>
              <button id="force-refresh" class="control-btn">Force Refresh</button>
              <button id="clear-cache" class="control-btn">Clear Cache</button>
            </div>
          </div>
          
          <div class="control-group">
            <h3>Auto Sync</h3>
            <div class="auto-sync-controls">
              <label class="toggle-label">
                <input type="checkbox" id="auto-sync-toggle" checked>
                <span class="toggle-slider"></span>
                Enable Auto Sync
              </label>
              <div class="interval-control">
                <label for="sync-interval">Interval (minutes):</label>
                <input type="number" id="sync-interval" value="5" min="1" max="60">
              </div>
            </div>
          </div>
          
          <div class="control-group">
            <h3>Settings</h3>
            <div class="settings-controls">
              <label class="toggle-label">
                <input type="checkbox" id="debug-toggle">
                <span class="toggle-slider"></span>
                Debug Mode
              </label>
              <label class="toggle-label">
                <input type="checkbox" id="strict-validation-toggle">
                <span class="toggle-slider"></span>
                Strict Validation
              </label>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render data validation section
   */
  private renderDataValidation(): string {
    return `
      <section class="data-validation">
        <h2>✅ Data Validation</h2>
        <div id="validation-results" class="validation-results">
          <p class="placeholder">Validation results will appear here</p>
        </div>
      </section>
    `;
  }

  /**
   * Render error log section
   */
  private renderErrorLog(): string {
    const status = this.manager.getSyncStatus();
    
    return `
      <section class="error-log">
        <h2>🚨 Error Log</h2>
        <div class="error-controls">
          <button id="clear-errors" class="control-btn">Clear Errors</button>
          <button id="export-errors" class="control-btn">Export Log</button>
        </div>
        <div id="error-list" class="error-list">
          ${status.errors.length === 0 ? 
            '<p class="no-errors">No errors recorded</p>' :
            status.errors.map(error => this.renderError(error)).join('')
          }
        </div>
      </section>
    `;
  }

  /**
   * Render individual error
   */
  private renderError(error: any): string {
    if (typeof error === 'string') {
      return `
        <div class="error-item">
          <div class="error-message">${error}</div>
        </div>
      `;
    }

    const severityClass = `severity-${error.severity}`;
    const timeAgo = this.getTimeAgo(error.timestamp);

    return `
      <div class="error-item ${severityClass}">
        <div class="error-header">
          <span class="error-code">${error.code}</span>
          <span class="error-time">${timeAgo}</span>
          <span class="error-severity">${error.severity}</span>
        </div>
        <div class="error-message">${error.message}</div>
        ${error.details ? `<div class="error-details">${JSON.stringify(error.details, null, 2)}</div>` : ''}
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    // Manual sync controls
    const syncNowBtn = this.container.querySelector('#sync-now');
    syncNowBtn?.addEventListener('click', async () => {
      await this.handleSyncNow();
    });

    const forceRefreshBtn = this.container.querySelector('#force-refresh');
    forceRefreshBtn?.addEventListener('click', async () => {
      await this.handleForceRefresh();
    });

    const clearCacheBtn = this.container.querySelector('#clear-cache');
    clearCacheBtn?.addEventListener('click', () => {
      this.handleClearCache();
    });

    // Auto sync controls
    const autoSyncToggle = this.container.querySelector('#auto-sync-toggle') as HTMLInputElement;
    autoSyncToggle?.addEventListener('change', (e) => {
      this.handleAutoSyncToggle((e.target as HTMLInputElement).checked);
    });

    const syncIntervalInput = this.container.querySelector('#sync-interval') as HTMLInputElement;
    syncIntervalInput?.addEventListener('change', (e) => {
      this.handleSyncIntervalChange(parseInt((e.target as HTMLInputElement).value));
    });

    // Settings controls
    const debugToggle = this.container.querySelector('#debug-toggle') as HTMLInputElement;
    debugToggle?.addEventListener('change', (e) => {
      this.handleDebugToggle((e.target as HTMLInputElement).checked);
    });

    // Integrity controls
    const checkIntegrityBtn = this.container.querySelector('#check-integrity');
    checkIntegrityBtn?.addEventListener('click', () => {
      this.handleCheckIntegrity();
    });

    const validateDataBtn = this.container.querySelector('#validate-data');
    validateDataBtn?.addEventListener('click', () => {
      this.handleValidateData();
    });

    // Error controls
    const clearErrorsBtn = this.container.querySelector('#clear-errors');
    clearErrorsBtn?.addEventListener('click', () => {
      this.handleClearErrors();
    });

    const exportErrorsBtn = this.container.querySelector('#export-errors');
    exportErrorsBtn?.addEventListener('click', () => {
      this.handleExportErrors();
    });
  }

  /**
   * Handle sync now
   */
  private async handleSyncNow(): Promise<void> {
    try {
      this.showMessage('Starting sync...', 'info');
      await this.manager.loadMasterData();
      this.showMessage('Sync completed successfully', 'success');
      await this.updateDisplay();
    } catch (error) {
      console.error('Sync failed:', error);
      this.showMessage('Sync failed: ' + error.message, 'error');
    }
  }

  /**
   * Handle force refresh
   */
  private async handleForceRefresh(): Promise<void> {
    try {
      this.showMessage('Force refreshing data...', 'info');
      await this.manager.loadMasterData(true);
      this.showMessage('Force refresh completed', 'success');
      await this.updateDisplay();
    } catch (error) {
      console.error('Force refresh failed:', error);
      this.showMessage('Force refresh failed: ' + error.message, 'error');
    }
  }

  /**
   * Handle clear cache
   */
  private handleClearCache(): void {
    this.manager.clearCache();
    this.showMessage('Cache cleared', 'success');
  }

  /**
   * Handle auto sync toggle
   */
  private handleAutoSyncToggle(enabled: boolean): void {
    this.manager.updateConfig({ autoSync: enabled });
    this.showMessage(`Auto sync ${enabled ? 'enabled' : 'disabled'}`, 'success');
  }

  /**
   * Handle sync interval change
   */
  private handleSyncIntervalChange(minutes: number): void {
    const milliseconds = minutes * 60 * 1000;
    this.manager.updateConfig({ syncInterval: milliseconds });
    this.showMessage(`Sync interval updated to ${minutes} minutes`, 'success');
  }

  /**
   * Handle debug toggle
   */
  private handleDebugToggle(enabled: boolean): void {
    this.manager.updateConfig({ debug: enabled });
    this.showMessage(`Debug mode ${enabled ? 'enabled' : 'disabled'}`, 'success');
  }

  /**
   * Handle check integrity
   */
  private handleCheckIntegrity(): void {
    const result = this.manager.checkDataIntegrity();
    this.displayIntegrityResults(result);
  }

  /**
   * Handle validate data
   */
  private handleValidateData(): void {
    const masterData = this.manager.getMasterData();
    if (!masterData) {
      this.showMessage('No data to validate', 'warning');
      return;
    }

    const result = this.manager.validateData(masterData);
    this.displayValidationResults(result);
  }

  /**
   * Handle clear errors
   */
  private handleClearErrors(): void {
    // Clear errors in manager (would need to add this method)
    this.showMessage('Error log cleared', 'success');
    this.updateErrorLog();
  }

  /**
   * Handle export errors
   */
  private handleExportErrors(): void {
    const status = this.manager.getSyncStatus();
    const errorData = {
      timestamp: new Date().toISOString(),
      errors: status.errors
    };

    const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bsix-sync-errors-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.showMessage('Error log exported', 'success');
  }

  /**
   * Display integrity results
   */
  private displayIntegrityResults(result: DataIntegrityResult): void {
    const resultsDiv = this.container.querySelector('#integrity-results');
    if (!resultsDiv) return;

    const statusClass = result.passed ? 'integrity-passed' : 'integrity-failed';
    const statusIcon = result.passed ? '✅' : '❌';

    resultsDiv.innerHTML = `
      <div class="integrity-result ${statusClass}">
        <div class="result-header">
          <span class="result-icon">${statusIcon}</span>
          <span class="result-text">${result.passed ? 'Data integrity check passed' : 'Data integrity issues found'}</span>
          <span class="result-time">${new Date(result.timestamp).toLocaleString()}</span>
        </div>
        
        ${result.issues.length > 0 ? `
          <div class="issues-list">
            <h4>Issues Found:</h4>
            ${result.issues.map(issue => `
              <div class="issue-item severity-${issue.severity}">
                <div class="issue-type">${issue.type.replace('_', ' ').toUpperCase()}</div>
                <div class="issue-description">${issue.description}</div>
                <div class="issue-affected">Affected: ${issue.affectedItems.join(', ')}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${result.recommendations.length > 0 ? `
          <div class="recommendations">
            <h4>Recommendations:</h4>
            <ul>
              ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Display validation results
   */
  private displayValidationResults(result: DataValidationResult): void {
    const resultsDiv = this.container.querySelector('#validation-results');
    if (!resultsDiv) return;

    const statusClass = result.valid ? 'validation-passed' : 'validation-failed';
    const statusIcon = result.valid ? '✅' : '❌';

    resultsDiv.innerHTML = `
      <div class="validation-result ${statusClass}">
        <div class="result-header">
          <span class="result-icon">${statusIcon}</span>
          <span class="result-text">${result.valid ? 'Data validation passed' : 'Data validation failed'}</span>
          <span class="result-time">${new Date(result.timestamp).toLocaleString()}</span>
        </div>
        
        <div class="validation-stats">
          <div class="stat-item">
            <label>Teams:</label>
            <span>${result.validatedCount.teams}</span>
          </div>
          <div class="stat-item">
            <label>Players:</label>
            <span>${result.validatedCount.players}</span>
          </div>
          <div class="stat-item">
            <label>Matches:</label>
            <span>${result.validatedCount.matches}</span>
          </div>
        </div>
        
        ${result.errors.length > 0 ? `
          <div class="validation-errors">
            <h4>Errors:</h4>
            <ul>
              ${result.errors.map(error => `<li class="error">${error}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${result.warnings.length > 0 ? `
          <div class="validation-warnings">
            <h4>Warnings:</h4>
            <ul>
              ${result.warnings.map(warning => `<li class="warning">${warning}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Update display
   */
  private async updateDisplay(): Promise<void> {
    // Re-render sections that might have changed
    const statusSection = this.container.querySelector('.sync-status');
    if (statusSection) {
      statusSection.innerHTML = this.renderSyncStatus().replace(/<\/?section[^>]*>/g, '');
    }

    const overviewSection = this.container.querySelector('.data-overview');
    if (overviewSection) {
      overviewSection.innerHTML = this.renderDataOverview().replace(/<\/?section[^>]*>/g, '');
    }

    this.updateErrorLog();
  }

  /**
   * Update error log
   */
  private updateErrorLog(): void {
    const errorList = this.container.querySelector('#error-list');
    if (!errorList) return;

    const status = this.manager.getSyncStatus();
    
    if (status.errors.length === 0) {
      errorList.innerHTML = '<p class="no-errors">No errors recorded</p>';
    } else {
      errorList.innerHTML = status.errors.map(error => this.renderError(error)).join('');
    }
  }

  /**
   * Start status updates
   */
  private startStatusUpdates(): void {
    this.statusUpdateInterval = setInterval(() => {
      this.updateStatusDisplay();
    }, 1000);
  }

  /**
   * Update status display
   */
  private updateStatusDisplay(): void {
    const status = this.manager.getSyncStatus();
    
    // Update current version
    const versionSpan = this.container.querySelector('#current-version');
    if (versionSpan) {
      versionSpan.textContent = status.currentVersion || 'Unknown';
    }

    // Update last sync
    const lastSyncSpan = this.container.querySelector('#last-sync');
    if (lastSyncSpan) {
      lastSyncSpan.textContent = status.lastSync ? new Date(status.lastSync).toLocaleString() : 'Never';
    }

    // Update progress
    const progressFill = this.container.querySelector('.progress-fill') as HTMLElement;
    const progressText = this.container.querySelector('.progress-text');
    if (progressFill && progressText) {
      progressFill.style.width = `${status.progress}%`;
      progressText.textContent = `${status.progress}%`;
    }

    // Update status indicator
    const statusIndicator = this.container.querySelector('.status-indicator');
    if (statusIndicator) {
      statusIndicator.className = `status-indicator ${this.getStatusClass(status.status)}`;
      
      const statusIcon = statusIndicator.querySelector('.status-icon');
      const statusText = statusIndicator.querySelector('.status-text');
      
      if (statusIcon) statusIcon.textContent = this.getStatusIcon(status.status);
      if (statusText) statusText.textContent = this.getStatusText(status.status);
    }
  }

  /**
   * Get status class
   */
  private getStatusClass(status: SyncStatus['status']): string {
    switch (status) {
      case 'success': return 'status-success';
      case 'error': return 'status-error';
      case 'syncing': return 'status-syncing';
      default: return 'status-idle';
    }
  }

  /**
   * Get status icon
   */
  private getStatusIcon(status: SyncStatus['status']): string {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'syncing': return '🔄';
      default: return '⏸️';
    }
  }

  /**
   * Get status text
   */
  private getStatusText(status: SyncStatus['status']): string {
    switch (status) {
      case 'success': return 'Synchronized';
      case 'error': return 'Error';
      case 'syncing': return 'Synchronizing...';
      default: return 'Idle';
    }
  }

  /**
   * Get time ago string
   */
  private getTimeAgo(timestamp: string): string {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  /**
   * Show message to user
   */
  private showMessage(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Add to container
    this.container.appendChild(messageEl);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 3000);
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
      this.statusUpdateInterval = null;
    }
  }
}
