import { CharacterSystemManager } from './CharacterSystemManager';
import { CharacterProfile, ContentContext, GeneratedContent } from './types';

/**
 * UI Component for Character System management and content generation
 */
export class CharacterSystemComponent {
  private manager: CharacterSystemManager;
  private container: HTMLElement;

  constructor(manager: CharacterSystemManager, container: HTMLElement) {
    this.manager = manager;
    this.container = container;
  }

  /**
   * Render the character system interface
   */
  async render(): Promise<void> {
    try {
      await this.manager.initialize();
      
      this.container.innerHTML = `
        <div class="character-system">
          ${this.renderCharacterSelector()}
          ${this.renderCurrentCharacter()}
          ${this.renderContentGenerator()}
          ${this.renderGeneratedContent()}
          ${this.renderControls()}
        </div>
      `;

      this.attachEventListeners();
    } catch (error) {
      console.error('Failed to render character system:', error);
      this.renderError('Failed to load character system');
    }
  }

  /**
   * Render character selector
   */
  private renderCharacterSelector(): string {
    const availableCharacters = this.manager.getAvailableCharacters();
    const currentCharacter = this.manager.getCharacterConfig()?.current_character;

    return `
      <section class="character-selector">
        <h2>🎭 Character Selection</h2>
        <div class="character-options">
          ${availableCharacters.map(characterId => `
            <div class="character-option ${characterId === currentCharacter ? 'active' : ''}" 
                 data-character="${characterId}">
              <div class="character-preview">
                <h3>${this.getCharacterName(characterId)}</h3>
                <p>${this.getCharacterDescription(characterId)}</p>
                <div class="personality-traits">
                  ${this.renderPersonalityTraits(characterId)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Render current character information
   */
  private renderCurrentCharacter(): string {
    const profile = this.manager.getCurrentProfile();
    if (!profile) {
      return '<div class="no-character">No character loaded</div>';
    }

    return `
      <section class="current-character">
        <h2>👤 Current Character: ${profile.name}</h2>
        <div class="character-details">
          <div class="character-info">
            <h3>Profile</h3>
            <p><strong>Description:</strong> ${profile.description}</p>
            <p><strong>Tone:</strong> ${profile.writing_style.tone}</p>
            <p><strong>Formality:</strong> ${Math.round(profile.writing_style.formality_level * 100)}%</p>
            <p><strong>Emoji Usage:</strong> ${Math.round(profile.writing_style.emoji_usage * 100)}%</p>
          </div>
          
          <div class="personality-display">
            <h3>Personality Traits</h3>
            <div class="trait-bars">
              ${Object.entries(profile.personality_traits).map(([trait, value]) => `
                <div class="trait-bar">
                  <label>${trait.charAt(0).toUpperCase() + trait.slice(1)}</label>
                  <div class="bar">
                    <div class="fill" style="width: ${value * 100}%"></div>
                  </div>
                  <span class="value">${Math.round(value * 100)}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render content generator interface
   */
  private renderContentGenerator(): string {
    return `
      <section class="content-generator">
        <h2>✨ Content Generator</h2>
        <div class="generator-form">
          <div class="form-group">
            <label for="content-type">Content Type:</label>
            <select id="content-type">
              <option value="match_preview">Match Preview</option>
              <option value="match_review">Match Review</option>
              <option value="news">News</option>
              <option value="analysis">Analysis</option>
              <option value="general">General</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="team-select">Team (optional):</label>
            <select id="team-select">
              <option value="">Select team...</option>
              <option value="liverpool">Liverpool</option>
              <option value="arsenal">Arsenal</option>
              <option value="chelsea">Chelsea</option>
              <option value="manchester_city">Manchester City</option>
              <option value="manchester_united">Manchester United</option>
              <option value="tottenham">Tottenham</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="result-select">Result (for match review):</label>
            <select id="result-select">
              <option value="">Select result...</option>
              <option value="win">Win</option>
              <option value="draw">Draw</option>
              <option value="loss">Loss</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="time-select">Time of Day:</label>
            <select id="time-select">
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="custom-data">Custom Data (JSON):</label>
            <textarea id="custom-data" placeholder='{"match_description": "Liverpool vs Arsenal", "key_factor": "midfield battle"}'></textarea>
          </div>
          
          <button id="generate-content" class="generate-btn">Generate Content</button>
        </div>
      </section>
    `;
  }

  /**
   * Render generated content display
   */
  private renderGeneratedContent(): string {
    return `
      <section class="generated-content">
        <h2>📝 Generated Content</h2>
        <div id="content-output" class="content-output">
          <p class="placeholder">Generated content will appear here...</p>
        </div>
        <div class="content-actions">
          <button id="copy-content" class="action-btn" disabled>Copy Content</button>
          <button id="regenerate-content" class="action-btn" disabled>Regenerate</button>
          <button id="clear-content" class="action-btn" disabled>Clear</button>
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
        <h2>⚙️ Controls</h2>
        <div class="control-buttons">
          <button id="clear-cache" class="control-btn">Clear Cache</button>
          <button id="export-config" class="control-btn">Export Config</button>
          <button id="toggle-debug" class="control-btn">Toggle Debug</button>
          <button id="refresh-system" class="control-btn">Refresh System</button>
        </div>
      </section>
    `;
  }

  /**
   * Render personality traits for character preview
   */
  private renderPersonalityTraits(characterId: string): string {
    const config = this.manager.getCharacterConfig();
    if (!config) return '';

    const character = config.characters[characterId];
    if (!character) return '';

    const traits = character.personality_traits;
    const topTraits = Object.entries(traits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return topTraits.map(([trait, value]) => 
      `<span class="trait-tag">${trait}: ${Math.round(value * 100)}%</span>`
    ).join('');
  }

  /**
   * Get character name by ID
   */
  private getCharacterName(characterId: string): string {
    const config = this.manager.getCharacterConfig();
    return config?.characters[characterId]?.name || characterId;
  }

  /**
   * Get character description by ID
   */
  private getCharacterDescription(characterId: string): string {
    const config = this.manager.getCharacterConfig();
    return config?.characters[characterId]?.description || 'No description available';
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    // Character selection
    const characterOptions = this.container.querySelectorAll('.character-option');
    characterOptions.forEach(option => {
      option.addEventListener('click', async (e) => {
        const target = e.currentTarget as HTMLElement;
        const characterId = target.dataset.character!;
        
        try {
          await this.manager.switchCharacter(characterId);
          await this.render(); // Re-render to show new character
        } catch (error) {
          console.error('Failed to switch character:', error);
          this.showError('Failed to switch character');
        }
      });
    });

    // Content generation
    const generateBtn = this.container.querySelector('#generate-content');
    generateBtn?.addEventListener('click', () => {
      this.generateContent();
    });

    // Content actions
    const copyBtn = this.container.querySelector('#copy-content');
    copyBtn?.addEventListener('click', () => {
      this.copyContent();
    });

    const regenerateBtn = this.container.querySelector('#regenerate-content');
    regenerateBtn?.addEventListener('click', () => {
      this.generateContent();
    });

    const clearBtn = this.container.querySelector('#clear-content');
    clearBtn?.addEventListener('click', () => {
      this.clearContent();
    });

    // Control buttons
    const clearCacheBtn = this.container.querySelector('#clear-cache');
    clearCacheBtn?.addEventListener('click', () => {
      this.manager.clearCache();
      this.showSuccess('Cache cleared');
    });

    const exportBtn = this.container.querySelector('#export-config');
    exportBtn?.addEventListener('click', () => {
      this.exportConfig();
    });

    const debugBtn = this.container.querySelector('#toggle-debug');
    debugBtn?.addEventListener('click', () => {
      this.toggleDebug();
    });

    const refreshBtn = this.container.querySelector('#refresh-system');
    refreshBtn?.addEventListener('click', () => {
      this.render();
    });
  }

  /**
   * Generate content based on form inputs
   */
  private generateContent(): void {
    try {
      const contentType = (this.container.querySelector('#content-type') as HTMLSelectElement).value;
      const team = (this.container.querySelector('#team-select') as HTMLSelectElement).value;
      const result = (this.container.querySelector('#result-select') as HTMLSelectElement).value;
      const timeOfDay = (this.container.querySelector('#time-select') as HTMLSelectElement).value;
      const customDataText = (this.container.querySelector('#custom-data') as HTMLTextAreaElement).value;

      let customData = {};
      if (customDataText.trim()) {
        try {
          customData = JSON.parse(customDataText);
        } catch (error) {
          this.showError('Invalid JSON in custom data');
          return;
        }
      }

      const context: ContentContext = {
        content_type: contentType as any,
        team: team || undefined,
        result: result as any || undefined,
        time_of_day: timeOfDay as any,
        data: customData
      };

      const generated = this.manager.generateContent(context);
      this.displayGeneratedContent(generated);
      
    } catch (error) {
      console.error('Failed to generate content:', error);
      this.showError('Failed to generate content');
    }
  }

  /**
   * Display generated content
   */
  private displayGeneratedContent(generated: GeneratedContent): void {
    const outputDiv = this.container.querySelector('#content-output');
    if (!outputDiv) return;

    outputDiv.innerHTML = `
      <div class="generated-result">
        <div class="content-text">${generated.content}</div>
        <div class="content-meta">
          <span class="character">Character: ${generated.character}</span>
          <span class="timestamp">Generated: ${new Date(generated.generated_at).toLocaleString()}</span>
          <span class="context">Type: ${generated.context.content_type}</span>
        </div>
      </div>
    `;

    // Enable action buttons
    const actionButtons = this.container.querySelectorAll('.content-actions .action-btn');
    actionButtons.forEach(btn => {
      (btn as HTMLButtonElement).disabled = false;
    });
  }

  /**
   * Copy content to clipboard
   */
  private async copyContent(): Promise<void> {
    const contentText = this.container.querySelector('.content-text')?.textContent;
    if (!contentText) return;

    try {
      await navigator.clipboard.writeText(contentText);
      this.showSuccess('Content copied to clipboard');
    } catch (error) {
      console.error('Failed to copy content:', error);
      this.showError('Failed to copy content');
    }
  }

  /**
   * Clear generated content
   */
  private clearContent(): void {
    const outputDiv = this.container.querySelector('#content-output');
    if (!outputDiv) return;

    outputDiv.innerHTML = '<p class="placeholder">Generated content will appear here...</p>';

    // Disable action buttons
    const actionButtons = this.container.querySelectorAll('.content-actions .action-btn');
    actionButtons.forEach(btn => {
      (btn as HTMLButtonElement).disabled = true;
    });
  }

  /**
   * Export character configuration
   */
  private exportConfig(): void {
    const config = this.manager.getCharacterConfig();
    if (!config) {
      this.showError('No configuration to export');
      return;
    }

    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'character-config.json';
    link.click();
    
    URL.revokeObjectURL(url);
    this.showSuccess('Configuration exported');
  }

  /**
   * Toggle debug mode
   */
  private toggleDebug(): void {
    this.manager.updateConfig({ debug: !this.manager['config'].debug });
    const isDebug = this.manager['config'].debug;
    this.showSuccess(`Debug mode ${isDebug ? 'enabled' : 'disabled'}`);
  }

  /**
   * Show success message
   */
  private showSuccess(message: string): void {
    this.showMessage(message, 'success');
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    this.showMessage(message, 'error');
  }

  /**
   * Show message to user
   */
  private showMessage(message: string, type: 'success' | 'error'): void {
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
}
