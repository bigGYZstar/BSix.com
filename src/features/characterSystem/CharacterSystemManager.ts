import { DataAdapter } from '@/datasource';
import { 
  CharacterConfig, 
  CharacterProfile, 
  ContentContext, 
  GeneratedContent,
  CharacterSystemConfig,
  PersonalityTraits,
  WritingStyle
} from './types';

/**
 * Manages character system functionality and content generation
 */
export class CharacterSystemManager {
  private config: CharacterSystemConfig;
  private characterConfig: CharacterConfig | null = null;
  private currentProfile: CharacterProfile | null = null;
  private contentCache: Map<string, GeneratedContent> = new Map();
  private dataAdapter: DataAdapter;

  constructor(dataAdapter: DataAdapter) {
    this.dataAdapter = dataAdapter;
    this.config = {
      debug: false,
      cache_content: true,
      max_cache_size: 100,
      auto_save: false
    };
  }

  /**
   * Initialize character system
   */
  async initialize(): Promise<void> {
    try {
      await this.loadCharacterConfig();
      this.setCurrentCharacter();
      
      if (this.config.debug) {
        console.log('Character system initialized:', {
          current_character: this.characterConfig?.current_character,
          profile_loaded: !!this.currentProfile
        });
      }
    } catch (error) {
      console.error('Failed to initialize character system:', error);
      await this.loadFallbackCharacter();
    }
  }

  /**
   * Load character configuration from data source
   */
  private async loadCharacterConfig(): Promise<void> {
    try {
      // In a real implementation, this would load from the data adapter
      // For now, we'll use the mock configuration
      this.characterConfig = await this.getMockCharacterConfig();
    } catch (error) {
      console.error('Failed to load character config:', error);
      throw error;
    }
  }

  /**
   * Set current character profile
   */
  private setCurrentCharacter(): void {
    if (!this.characterConfig) {
      throw new Error('Character configuration not loaded');
    }

    const characterId = this.characterConfig.current_character;
    const profile = this.characterConfig.characters[characterId];

    if (!profile) {
      throw new Error(`Character profile not found: ${characterId}`);
    }

    this.currentProfile = profile;
  }

  /**
   * Load fallback character when main character fails
   */
  private async loadFallbackCharacter(): Promise<void> {
    try {
      const fallbackConfig = await this.getMockCharacterConfig();
      const fallbackId = fallbackConfig.global_settings.fallback_character;
      
      this.characterConfig = fallbackConfig;
      this.characterConfig.current_character = fallbackId;
      this.setCurrentCharacter();
      
      console.warn('Loaded fallback character:', fallbackId);
    } catch (error) {
      console.error('Failed to load fallback character:', error);
      // Create minimal character as last resort
      this.createMinimalCharacter();
    }
  }

  /**
   * Create minimal character as last resort
   */
  private createMinimalCharacter(): void {
    this.currentProfile = {
      name: 'BSix.com',
      description: 'Default character',
      personality_traits: {
        friendliness: 0.7,
        humor: 0.3,
        professionalism: 0.8,
        enthusiasm: 0.6,
        casualness: 0.4
      },
      writing_style: {
        tone: 'professional_analytical',
        formality_level: 0.7,
        emoji_usage: 0.2,
        humor_frequency: 0.1,
        personal_opinions: false,
        direct_address: false
      },
      vocabulary: {
        greetings: {
          morning: ['Good morning'],
          afternoon: ['Good afternoon'],
          evening: ['Good evening']
        },
        transitions: ['Furthermore', 'Additionally', 'Moreover'],
        closings: ['Thank you for reading'],
        expressions: {
          excitement: ['Excellent'],
          disappointment: ['Unfortunately'],
          surprise: ['Surprisingly'],
          agreement: ['Indeed'],
          thinking: ['Considering']
        }
      },
      team_specific_reactions: {},
      content_templates: {
        match_preview: {
          intro_patterns: ['Upcoming match analysis:'],
          closing_patterns: ['Stay tuned for more updates.']
        },
        match_review: {
          intro_patterns: ['Match review:'],
          closing_patterns: ['Thank you for reading.']
        },
        news: {
          intro_patterns: ['Latest news:'],
          closing_patterns: ['More updates coming soon.']
        }
      }
    };
  }

  /**
   * Get current character profile
   */
  getCurrentProfile(): CharacterProfile | null {
    return this.currentProfile;
  }

  /**
   * Get character configuration
   */
  getCharacterConfig(): CharacterConfig | null {
    return this.characterConfig;
  }

  /**
   * Switch to a different character
   */
  async switchCharacter(characterId: string): Promise<void> {
    if (!this.characterConfig) {
      throw new Error('Character configuration not loaded');
    }

    const profile = this.characterConfig.characters[characterId];
    if (!profile) {
      throw new Error(`Character not found: ${characterId}`);
    }

    this.characterConfig.current_character = characterId;
    this.currentProfile = profile;

    if (this.config.auto_save) {
      await this.saveCharacterConfig();
    }

    if (this.config.debug) {
      console.log('Switched to character:', characterId);
    }
  }

  /**
   * Generate content based on context
   */
  generateContent(context: ContentContext): GeneratedContent {
    if (!this.currentProfile) {
      throw new Error('No character profile loaded');
    }

    const cacheKey = this.getCacheKey(context);
    
    // Check cache first
    if (this.config.cache_content && this.contentCache.has(cacheKey)) {
      const cached = this.contentCache.get(cacheKey)!;
      if (this.config.debug) {
        console.log('Returning cached content for:', cacheKey);
      }
      return cached;
    }

    // Generate new content
    const content = this.generateNewContent(context);
    
    // Cache the result
    if (this.config.cache_content) {
      this.cacheContent(cacheKey, content);
    }

    return content;
  }

  /**
   * Generate new content based on context
   */
  private generateNewContent(context: ContentContext): GeneratedContent {
    if (!this.currentProfile) {
      throw new Error('No character profile loaded');
    }

    let generatedText = '';

    // Add greeting if appropriate
    if (this.characterConfig?.global_settings.auto_adjust_by_time) {
      generatedText += this.getTimeBasedGreeting(context.time_of_day) + ' ';
    }

    // Add content based on type
    switch (context.content_type) {
      case 'match_preview':
        generatedText += this.generateMatchPreview(context);
        break;
      case 'match_review':
        generatedText += this.generateMatchReview(context);
        break;
      case 'news':
        generatedText += this.generateNewsContent(context);
        break;
      case 'analysis':
        generatedText += this.generateAnalysisContent(context);
        break;
      default:
        generatedText += this.generateGeneralContent(context);
    }

    // Add closing if appropriate
    if (this.shouldAddClosing(context)) {
      generatedText += ' ' + this.getRandomClosing();
    }

    return {
      content: generatedText.trim(),
      character: this.characterConfig?.current_character || 'unknown',
      context,
      generated_at: new Date().toISOString()
    };
  }

  /**
   * Generate match preview content
   */
  private generateMatchPreview(context: ContentContext): string {
    const template = this.currentProfile!.content_templates.match_preview;
    const intro = this.getRandomFromArray(template.intro_patterns);
    
    let content = this.interpolateTemplate(intro, context.data || {});
    
    if (template.analysis_patterns && context.data) {
      const analysis = this.getRandomFromArray(template.analysis_patterns);
      content += ' ' + this.interpolateTemplate(analysis, context.data);
    }

    return content;
  }

  /**
   * Generate match review content
   */
  private generateMatchReview(context: ContentContext): string {
    const template = this.currentProfile!.content_templates.match_review;
    const intro = this.getRandomFromArray(template.intro_patterns);
    
    let content = this.interpolateTemplate(intro, context.data || {});
    
    if (template.result_patterns && context.data) {
      const result = this.getRandomFromArray(template.result_patterns);
      content += ' ' + this.interpolateTemplate(result, context.data);
    }

    // Add team-specific reaction if applicable
    if (context.team && context.result) {
      const reaction = this.getTeamReaction(context.team, context.result === 'win');
      if (reaction) {
        content += ' ' + reaction;
      }
    }

    return content;
  }

  /**
   * Generate news content
   */
  private generateNewsContent(context: ContentContext): string {
    const template = this.currentProfile!.content_templates.news;
    const intro = this.getRandomFromArray(template.intro_patterns);
    
    return this.interpolateTemplate(intro, context.data || {});
  }

  /**
   * Generate analysis content
   */
  private generateAnalysisContent(context: ContentContext): string {
    const expressions = this.currentProfile!.vocabulary.expressions.thinking;
    const thinking = this.getRandomFromArray(expressions);
    
    return `${thinking} ${context.data?.analysis || 'Here is our analysis.'}`;
  }

  /**
   * Generate general content
   */
  private generateGeneralContent(context: ContentContext): string {
    const transitions = this.currentProfile!.vocabulary.transitions;
    const transition = this.getRandomFromArray(transitions);
    
    return `${transition} ${context.data?.content || 'Here is the latest update.'}`;
  }

  /**
   * Get time-based greeting
   */
  private getTimeBasedGreeting(timeOfDay: string): string {
    const greetings = this.currentProfile!.vocabulary.greetings;
    const timeGreetings = greetings[timeOfDay as keyof typeof greetings] || greetings.afternoon;
    
    return this.getRandomFromArray(timeGreetings);
  }

  /**
   * Get team-specific reaction
   */
  private getTeamReaction(team: string, isPositive: boolean): string | null {
    const reactions = this.currentProfile!.team_specific_reactions[team];
    if (!reactions) return null;
    
    const reactionArray = isPositive ? reactions.positive : reactions.negative;
    return this.getRandomFromArray(reactionArray);
  }

  /**
   * Get random closing phrase
   */
  private getRandomClosing(): string {
    const closings = this.currentProfile!.vocabulary.closings;
    return this.getRandomFromArray(closings);
  }

  /**
   * Determine if closing should be added
   */
  private shouldAddClosing(context: ContentContext): boolean {
    const style = this.currentProfile!.writing_style;
    
    // Add closing for friendly characters or long content
    return style.direct_address || context.content_type === 'match_preview';
  }

  /**
   * Interpolate template with data
   */
  private interpolateTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  /**
   * Get random item from array
   */
  private getRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate cache key for content
   */
  private getCacheKey(context: ContentContext): string {
    return `${context.content_type}_${context.team || 'general'}_${context.result || 'none'}_${context.time_of_day}`;
  }

  /**
   * Cache generated content
   */
  private cacheContent(key: string, content: GeneratedContent): void {
    // Remove oldest entries if cache is full
    if (this.contentCache.size >= this.config.max_cache_size) {
      const firstKey = this.contentCache.keys().next().value;
      this.contentCache.delete(firstKey);
    }
    
    this.contentCache.set(key, content);
  }

  /**
   * Clear content cache
   */
  clearCache(): void {
    this.contentCache.clear();
    
    if (this.config.debug) {
      console.log('Content cache cleared');
    }
  }

  /**
   * Get available characters
   */
  getAvailableCharacters(): string[] {
    if (!this.characterConfig) return [];
    
    return Object.keys(this.characterConfig.characters);
  }

  /**
   * Update character configuration
   */
  updateConfig(newConfig: Partial<CharacterSystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Save character configuration (mock implementation)
   */
  private async saveCharacterConfig(): Promise<void> {
    // In a real implementation, this would save to the data adapter
    if (this.config.debug) {
      console.log('Character configuration saved');
    }
  }

  /**
   * Get mock character configuration
   */
  private async getMockCharacterConfig(): Promise<CharacterConfig> {
    // This would normally load from the data adapter
    // For now, return a simplified version of the configuration
    return {
      version: '1.0.0',
      last_updated: new Date().toISOString(),
      note: 'Character system configuration',
      current_character: 'test_friendly',
      characters: {
        test_friendly: {
          name: 'BSix編集部',
          description: 'Arsenal Chan風の親しみやすいキャラクター',
          personality_traits: {
            friendliness: 0.9,
            humor: 0.7,
            professionalism: 0.4,
            enthusiasm: 0.8,
            casualness: 0.8
          },
          writing_style: {
            tone: 'casual_friendly',
            formality_level: 0.3,
            emoji_usage: 0.8,
            humor_frequency: 0.6,
            personal_opinions: true,
            direct_address: true
          },
          vocabulary: {
            greetings: {
              morning: ['おはよう！', 'Good morning!', '今日も一日頑張ろう！'],
              afternoon: ['お疲れさま！', 'こんにちは〜', '午後もよろしく！'],
              evening: ['お疲れさまでした！', '今日もありがとう！', 'また明日〜！']
            },
            transitions: ['ところで、', 'そうそう、', 'あ、そうそう！', '話は変わるけど、'],
            closings: ['どうだった？みんなの意見も聞かせてね！', 'また次回もお楽しみに〜！'],
            expressions: {
              excitement: ['やったー！', 'すごいね！', '最高だ！', '信じられない！'],
              disappointment: ['あ〜残念', 'うーん、惜しい', '次回に期待！'],
              surprise: ['え！？', 'まさか！', 'びっくり！', '予想外だね'],
              agreement: ['そうそう！', 'その通り！', '激しく同意！', 'わかる〜'],
              thinking: ['うーん', 'どうかな？', '個人的には', '考えてみると']
            }
          },
          team_specific_reactions: {
            liverpool: {
              positive: ['YNWA！', 'アンフィールドの魔法だね', 'さすがレッズ！'],
              negative: ['まさかの展開', 'アンフィールドでも', '予想外だったね']
            },
            arsenal: {
              positive: ['ガナーズ最高！', 'アルテタ・マジック', 'エミレーツが沸いた'],
              negative: ['またしても', '典型的なアーセナル', 'お馴染みの展開']
            }
          },
          content_templates: {
            match_preview: {
              intro_patterns: [
                'Hey! ついに来たね、{match_description}！',
                'お疲れさま！今度の試合、めちゃくちゃ楽しみじゃない？'
              ],
              analysis_patterns: [
                '個人的には、{analysis_point}が一番の注目ポイントだと思うんだ。',
                '特に気になるのは{key_factor}だよね。'
              ],
              closing_patterns: [
                'みんなの予想も聞かせてね！',
                'どう思う？コメントで語り合おう！'
              ]
            },
            match_review: {
              intro_patterns: [
                'お疲れさま！今日の試合、どうだった？',
                'Hey! 試合終了〜！みんなの感想聞かせて！'
              ],
              result_patterns: [
                '{team}が{performance_description}で{result}！',
                '今日の{team}は{evaluation}だったね。'
              ],
              closing_patterns: [
                'みんなの感想も聞かせてね！',
                '次の試合も楽しみ！'
              ]
            },
            news: {
              intro_patterns: [
                'おはよう！今日もニュースをチェックしていこう！',
                'Hey! 面白いニュースが入ってきたよ〜'
              ],
              closing_patterns: [
                'また新しいニュースがあったら教えるね！',
                '続報を待とう！'
              ]
            }
          }
        }
      },
      global_settings: {
        enable_character_system: true,
        fallback_character: 'test_friendly',
        auto_adjust_by_time: true,
        context_awareness: true,
        team_specific_reactions: true
      },
      customization_notes: {
        how_to_change_character: 'current_characterの値を変更するだけで、サイト全体のキャラクターが切り替わります',
        how_to_add_new_character: 'charactersオブジェクトに新しいキャラクター設定を追加してください'
      }
    };
  }
}
