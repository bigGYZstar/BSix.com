import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CharacterSystemManager } from '@/features/characterSystem/CharacterSystemManager';
import { CharacterSystemComponent } from '@/features/characterSystem/CharacterSystemComponent';
// import { StaticDataAdapter } from '@/datasource/static'; // 将来の機能拡張用に保留
import { ContentContext } from '@/features/characterSystem/types';

// Mock the data adapter
vi.mock('@/datasource/static');

describe('CharacterSystemManager', () => {
  let manager: CharacterSystemManager;
  // let mockAdapter: StaticDataAdapter; // 将来の機能拡張用に保留

  beforeEach(() => {
    // mockAdapter = new StaticDataAdapter(); // 将来の機能拡張用に保留
    manager = new CharacterSystemManager();
  });

  describe('initialization', () => {
    it('should initialize with default configuration', async () => {
      await manager.initialize();
      
      const profile = manager.getCurrentProfile();
      expect(profile).not.toBeNull();
      expect(profile!.name).toBe('BSix編集部');
    });

    it('should load fallback character when main character fails', async () => {
      // Mock a failure scenario
      vi.spyOn(manager as any, 'loadCharacterConfig').mockRejectedValue(new Error('Config load failed'));
      
      await manager.initialize();
      
      const profile = manager.getCurrentProfile();
      expect(profile).not.toBeNull();
    });

    it('should create minimal character as last resort', async () => {
      // Mock complete failure
      vi.spyOn(manager as any, 'loadCharacterConfig').mockRejectedValue(new Error('Config load failed'));
      vi.spyOn(manager as any, 'getMockCharacterConfig').mockRejectedValue(new Error('Mock config failed'));
      
      await manager.initialize();
      
      const profile = manager.getCurrentProfile();
      expect(profile).not.toBeNull();
      expect(profile!.name).toBe('BSix.com');
    });
  });

  describe('character switching', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should switch to different character', async () => {
      const availableCharacters = manager.getAvailableCharacters();
      expect(availableCharacters.length).toBeGreaterThan(0);
      
      const characterId = availableCharacters[0];
      await manager.switchCharacter(characterId);
      
      const config = manager.getCharacterConfig();
      expect(config!.current_character).toBe(characterId);
    });

    it('should throw error for non-existent character', async () => {
      await expect(manager.switchCharacter('non_existent')).rejects.toThrow('Character not found');
    });
  });

  describe('content generation', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should generate match preview content', () => {
      const context: ContentContext = {
        content_type: 'match_preview',
        team: 'liverpool',
        time_of_day: 'afternoon',
        data: {
          match_description: 'Liverpool vs Arsenal',
          analysis_point: 'midfield battle'
        }
      };

      const generated = manager.generateContent(context);
      
      expect(generated.content).toBeTruthy();
      expect(generated.character).toBe('test_friendly');
      expect(generated.context).toEqual(context);
      expect(generated.generated_at).toBeTruthy();
    });

    it('should generate match review content with team reaction', () => {
      const context: ContentContext = {
        content_type: 'match_review',
        team: 'liverpool',
        result: 'win',
        time_of_day: 'evening',
        data: {
          team: 'Liverpool',
          performance_description: 'brilliantly',
          result: 'won'
        }
      };

      const generated = manager.generateContent(context);
      
      expect(generated.content).toBeTruthy();
      expect(generated.content).toContain('お疲れさまでした！'); // Evening greeting
    });

    it('should generate news content', () => {
      const context: ContentContext = {
        content_type: 'news',
        time_of_day: 'morning'
      };

      const generated = manager.generateContent(context);
      
      expect(generated.content).toBeTruthy();
      expect(generated.content).toContain('おはよう！'); // Morning greeting
    });

    it('should generate analysis content', () => {
      const context: ContentContext = {
        content_type: 'analysis',
        time_of_day: 'afternoon',
        data: {
          analysis: 'Liverpool showed great tactical discipline'
        }
      };

      const generated = manager.generateContent(context);
      
      expect(generated.content).toBeTruthy();
      expect(generated.content).toContain('Liverpool showed great tactical discipline');
    });

    it('should generate general content', () => {
      const context: ContentContext = {
        content_type: 'general',
        time_of_day: 'afternoon',
        data: {
          content: 'Latest transfer updates'
        }
      };

      const generated = manager.generateContent(context);
      
      expect(generated.content).toBeTruthy();
      expect(generated.content).toContain('Latest transfer updates');
    });
  });

  describe('content caching', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should cache generated content', () => {
      const context: ContentContext = {
        content_type: 'match_preview',
        time_of_day: 'afternoon'
      };

      // Generate content twice
      const first = manager.generateContent(context);
      const second = manager.generateContent(context);
      
      // Should return the same cached content
      expect(first.content).toBe(second.content);
      expect(first.generated_at).toBe(second.generated_at);
    });

    it('should clear cache when requested', () => {
      const context: ContentContext = {
        content_type: 'match_preview',
        time_of_day: 'afternoon'
      };

      // Generate and cache content
      const first = manager.generateContent(context);
      
      // Clear cache
      manager.clearCache();
      
      // Generate again - should be different
      const second = manager.generateContent(context);
      expect(first.generated_at).not.toBe(second.generated_at);
    });
  });

  describe('configuration management', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should update configuration', () => {
      manager.updateConfig({ debug: true, cache_content: false });
      
      const config = (manager as any).config;
      expect(config.debug).toBe(true);
      expect(config.cache_content).toBe(false);
    });

    it('should return available characters', () => {
      const characters = manager.getAvailableCharacters();
      expect(characters).toContain('test_friendly');
    });
  });

  describe('template interpolation', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should interpolate template variables', () => {
      const context: ContentContext = {
        content_type: 'match_preview',
        time_of_day: 'afternoon',
        data: {
          match_description: 'Big Derby',
          analysis_point: 'tactical setup'
        }
      };

      const generated = manager.generateContent(context);
      
      // Should contain interpolated values
      expect(generated.content).toContain('Big Derby');
      expect(generated.content).toContain('tactical setup');
    });
  });
});

describe('CharacterSystemComponent', () => {
  let component: CharacterSystemComponent;
  let manager: CharacterSystemManager;
  let container: HTMLElement;
  // let mockAdapter: StaticDataAdapter; // 将来の機能拡張用に保留

  beforeEach(() => {
    // Create container element
    container = document.createElement('div');
    document.body.appendChild(container);

    // Setup mocks
    // mockAdapter = new StaticDataAdapter(); // 将来の機能拡張用に保留
    manager = new CharacterSystemManager();
    component = new CharacterSystemComponent(manager, container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering', () => {
    it('should render character system interface', async () => {
      await component.render();
      
      expect(container.querySelector('.character-system')).not.toBeNull();
      expect(container.querySelector('.character-selector')).not.toBeNull();
      expect(container.querySelector('.current-character')).not.toBeNull();
      expect(container.querySelector('.content-generator')).not.toBeNull();
    });

    it('should render character selector with available characters', async () => {
      await component.render();
      
      const characterOptions = container.querySelectorAll('.character-option');
      expect(characterOptions.length).toBeGreaterThan(0);
      
      const activeOption = container.querySelector('.character-option.active');
      expect(activeOption).not.toBeNull();
    });

    it('should render current character details', async () => {
      await component.render();
      
      const characterDetails = container.querySelector('.character-details');
      expect(characterDetails).not.toBeNull();
      
      const personalityDisplay = container.querySelector('.personality-display');
      expect(personalityDisplay).not.toBeNull();
      
      const traitBars = container.querySelectorAll('.trait-bar');
      expect(traitBars.length).toBeGreaterThan(0);
    });

    it('should render content generator form', async () => {
      await component.render();
      
      const generatorForm = container.querySelector('.generator-form');
      expect(generatorForm).not.toBeNull();
      
      const contentTypeSelect = container.querySelector('#content-type');
      expect(contentTypeSelect).not.toBeNull();
      
      const generateBtn = container.querySelector('#generate-content');
      expect(generateBtn).not.toBeNull();
    });

    it('should render error message when initialization fails', async () => {
      vi.spyOn(manager, 'initialize').mockRejectedValue(new Error('Init failed'));
      
      await component.render();
      
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).not.toBeNull();
    });
  });

  describe('interactions', () => {
    beforeEach(async () => {
      await component.render();
    });

    it('should switch character when option is clicked', async () => {
      const characterOption = container.querySelector('.character-option:not(.active)') as HTMLElement;
      if (characterOption) {
        const characterId = characterOption.dataset.character!;
        
        characterOption.click();
        
        // Wait for async operation
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Should have switched character
        const config = manager.getCharacterConfig();
        expect(config?.current_character).toBe(characterId);
      }
    });

    it('should generate content when generate button is clicked', async () => {
      const generateBtn = container.querySelector('#generate-content') as HTMLButtonElement;
      const contentOutput = container.querySelector('#content-output');
      
      generateBtn.click();
      
      // Should show generated content
      expect(contentOutput?.querySelector('.generated-result')).not.toBeNull();
      
      // Action buttons should be enabled
      const actionButtons = container.querySelectorAll('.content-actions .action-btn');
      actionButtons.forEach(btn => {
        expect((btn as HTMLButtonElement).disabled).toBe(false);
      });
    });

    it('should copy content to clipboard', async () => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined)
        }
      });

      // Generate content first
      const generateBtn = container.querySelector('#generate-content') as HTMLButtonElement;
      generateBtn.click();
      
      // Click copy button
      const copyBtn = container.querySelector('#copy-content') as HTMLButtonElement;
      copyBtn.click();
      
      // Should have called clipboard API
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    it('should clear content when clear button is clicked', async () => {
      // Generate content first
      const generateBtn = container.querySelector('#generate-content') as HTMLButtonElement;
      generateBtn.click();
      
      // Click clear button
      const clearBtn = container.querySelector('#clear-content') as HTMLButtonElement;
      clearBtn.click();
      
      // Should show placeholder
      const placeholder = container.querySelector('.placeholder');
      expect(placeholder).not.toBeNull();
      
      // Action buttons should be disabled
      const actionButtons = container.querySelectorAll('.content-actions .action-btn');
      actionButtons.forEach(btn => {
        expect((btn as HTMLButtonElement).disabled).toBe(true);
      });
    });

    it('should clear cache when clear cache button is clicked', async () => {
      const clearCacheBtn = container.querySelector('#clear-cache') as HTMLButtonElement;
      const clearCacheSpy = vi.spyOn(manager, 'clearCache');
      
      clearCacheBtn.click();
      
      expect(clearCacheSpy).toHaveBeenCalled();
    });

    it('should export configuration when export button is clicked', async () => {
      // Mock URL.createObjectURL
      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:url');
      global.URL.revokeObjectURL = vi.fn();
      
      const exportBtn = container.querySelector('#export-config') as HTMLButtonElement;
      exportBtn.click();
      
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('form validation', () => {
    beforeEach(async () => {
      await component.render();
    });

    it('should handle invalid JSON in custom data', async () => {
      const customDataTextarea = container.querySelector('#custom-data') as HTMLTextAreaElement;
      const generateBtn = container.querySelector('#generate-content') as HTMLButtonElement;
      
      // Set invalid JSON
      customDataTextarea.value = '{ invalid json }';
      
      generateBtn.click();
      
      // Should show error message
      const errorMessage = container.querySelector('.message-error');
      expect(errorMessage).not.toBeNull();
    });

    it('should handle valid JSON in custom data', async () => {
      const customDataTextarea = container.querySelector('#custom-data') as HTMLTextAreaElement;
      const generateBtn = container.querySelector('#generate-content') as HTMLButtonElement;
      
      // Set valid JSON
      customDataTextarea.value = '{"test": "value"}';
      
      generateBtn.click();
      
      // Should generate content successfully
      const contentOutput = container.querySelector('#content-output .generated-result');
      expect(contentOutput).not.toBeNull();
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      await component.render();
    });

    it('should have proper form labels', () => {
      const labels = container.querySelectorAll('label');
      const inputs = container.querySelectorAll('select, textarea');
      
      expect(labels.length).toBeGreaterThan(0);
      expect(inputs.length).toBeGreaterThan(0);
      
      // Each input should have a corresponding label
      inputs.forEach(input => {
        const id = input.getAttribute('id');
        if (id) {
          const label = container.querySelector(`label[for="${id}"]`);
          expect(label).not.toBeNull();
        }
      });
    });

    it('should have proper button labels', () => {
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach(button => {
        const text = button.textContent?.trim();
        expect(text).not.toBe('');
      });
    });

    it('should have proper heading hierarchy', () => {
      const h2s = container.querySelectorAll('h2');
      const h3s = container.querySelectorAll('h3');
      
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });
  });
});
