/**
 * Character System Feature Module
 * 
 * Provides dynamic character-based content generation for BSix.com
 * Allows easy switching between different writing styles and personalities
 * 
 * Features:
 * - Multiple character profiles (friendly, professional, enthusiastic)
 * - Context-aware content generation
 * - Team-specific reactions and expressions
 * - Time-based greeting adjustments
 * - Configurable personality traits
 */

export { CharacterSystemManager } from './CharacterSystemManager';
export { CharacterSystemComponent } from './CharacterSystemComponent';
export type { 
  CharacterProfile,
  CharacterConfig,
  PersonalityTraits,
  WritingStyle,
  ContentTemplate,
  TeamReaction,
  CharacterExpression
} from './types';
