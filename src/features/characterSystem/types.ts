/**
 * Type definitions for Character System
 */

/**
 * Personality traits that define character behavior
 */
export interface PersonalityTraits {
  /** How friendly and approachable the character is (0-1) */
  friendliness: number;
  /** How much humor the character uses (0-1) */
  humor: number;
  /** How professional and formal the character is (0-1) */
  professionalism: number;
  /** How enthusiastic and energetic the character is (0-1) */
  enthusiasm: number;
  /** How casual and informal the character is (0-1) */
  casualness: number;
}

/**
 * Writing style configuration
 */
export interface WritingStyle {
  /** Overall tone of the character */
  tone: 'casual_friendly' | 'professional_analytical' | 'passionate_energetic';
  /** Level of formality (0-1) */
  formality_level: number;
  /** How often emojis are used (0-1) */
  emoji_usage: number;
  /** Frequency of humor in content (0-1) */
  humor_frequency: number;
  /** Whether character expresses personal opinions */
  personal_opinions: boolean;
  /** Whether character directly addresses the reader */
  direct_address: boolean;
}

/**
 * Character expressions for different emotions
 */
export interface CharacterExpression {
  /** Expressions of excitement */
  excitement: string[];
  /** Expressions of disappointment */
  disappointment: string[];
  /** Expressions of surprise */
  surprise: string[];
  /** Expressions of agreement */
  agreement: string[];
  /** Expressions when thinking */
  thinking: string[];
}

/**
 * Team-specific reactions
 */
export interface TeamReaction {
  /** Positive reactions for the team */
  positive: string[];
  /** Negative reactions for the team */
  negative: string[];
}

/**
 * Content templates for different types of content
 */
export interface ContentTemplate {
  /** Introduction patterns */
  intro_patterns: string[];
  /** Analysis patterns */
  analysis_patterns?: string[];
  /** Closing patterns */
  closing_patterns: string[];
  /** Result patterns for match reviews */
  result_patterns?: string[];
}

/**
 * Vocabulary and expressions used by the character
 */
export interface CharacterVocabulary {
  /** Greetings for different times of day */
  greetings: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  /** Transition phrases */
  transitions: string[];
  /** Closing phrases */
  closings: string[];
  /** Emotional expressions */
  expressions: CharacterExpression;
}

/**
 * Complete character profile
 */
export interface CharacterProfile {
  /** Character name */
  name: string;
  /** Character description */
  description: string;
  /** Personality traits */
  personality_traits: PersonalityTraits;
  /** Writing style */
  writing_style: WritingStyle;
  /** Vocabulary and expressions */
  vocabulary: CharacterVocabulary;
  /** Team-specific reactions */
  team_specific_reactions: Record<string, TeamReaction>;
  /** Content templates */
  content_templates: {
    match_preview: ContentTemplate;
    match_review: ContentTemplate;
    news: ContentTemplate;
  };
}

/**
 * Global character system settings
 */
export interface GlobalSettings {
  /** Whether character system is enabled */
  enable_character_system: boolean;
  /** Fallback character if current one fails */
  fallback_character: string;
  /** Auto-adjust greetings by time of day */
  auto_adjust_by_time: boolean;
  /** Enable context-aware responses */
  context_awareness: boolean;
  /** Enable team-specific reactions */
  team_specific_reactions: boolean;
}

/**
 * Character system configuration
 */
export interface CharacterConfig {
  /** Configuration version */
  version: string;
  /** Last updated timestamp */
  last_updated: string;
  /** Configuration notes */
  note: string;
  /** Currently active character */
  current_character: string;
  /** Available character profiles */
  characters: Record<string, CharacterProfile>;
  /** Global settings */
  global_settings: GlobalSettings;
  /** Customization notes */
  customization_notes: Record<string, string>;
}

/**
 * Content generation context
 */
export interface ContentContext {
  /** Type of content being generated */
  content_type: 'match_preview' | 'match_review' | 'news' | 'analysis' | 'general';
  /** Team involved (if applicable) */
  team?: string;
  /** Match result (if applicable) */
  result?: 'win' | 'draw' | 'loss';
  /** Time of day */
  time_of_day: 'morning' | 'afternoon' | 'evening';
  /** Additional context data */
  data?: Record<string, any>;
}

/**
 * Generated content result
 */
export interface GeneratedContent {
  /** Generated text content */
  content: string;
  /** Character used for generation */
  character: string;
  /** Context used for generation */
  context: ContentContext;
  /** Timestamp of generation */
  generated_at: string;
}

/**
 * Character system manager configuration
 */
export interface CharacterSystemConfig {
  /** Enable debug logging */
  debug: boolean;
  /** Cache generated content */
  cache_content: boolean;
  /** Maximum cache size */
  max_cache_size: number;
  /** Auto-save character changes */
  auto_save: boolean;
}
