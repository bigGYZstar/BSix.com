// 表示名ロジックのユニットテスト

import { describe, it, expect } from 'vitest'
import {
  getDisplayName,
  getLastName,
  getFullName,
  isShortName,
  isKatakanaName,
  hasKanji,
} from '../src/features/players/displayName'
import type { Player } from '../src/types'

describe('displayName', () => {
  describe('getDisplayName', () => {
    it('should return full name for short Japanese names', () => {
      const player: Player = {
        jp: '田中太郎',
        intl: 'Taro Tanaka',
      }

      expect(getDisplayName(player, 5)).toBe('田中太郎')
    })

    it('should return surname only for long Japanese names', () => {
      const player: Player = {
        jp: 'デクラン・ライス',
        intl: 'Declan Rice',
      }

      expect(getDisplayName(player, 5)).toBe('デクラン')
    })

    it('should handle names with middle dots', () => {
      const player: Player = {
        jp: 'ダビド・ラヤ',
        intl: 'David Raya',
      }

      expect(getDisplayName(player, 5)).toBe('ダビド')
    })

    it('should fallback to English surname when Japanese name is missing', () => {
      const player: Player = {
        jp: '',
        intl: 'Martin Odegaard',
      }

      expect(getDisplayName(player, 5)).toBe('Odegaard')
    })

    it('should respect custom threshold', () => {
      const player: Player = {
        jp: '冨安健洋',
        intl: 'Takehiro Tomiyasu',
      }

      expect(getDisplayName(player, 3)).toBe('冨安')
      expect(getDisplayName(player, 5)).toBe('冨安健洋')
    })
  })

  describe('getLastName', () => {
    it('should extract last name from full English name', () => {
      expect(getLastName('Martin Odegaard')).toBe('Odegaard')
      expect(getLastName('Gabriel Jesus')).toBe('Jesus')
      expect(getLastName('William Saliba')).toBe('Saliba')
    })

    it('should handle single names', () => {
      expect(getLastName('Jorginho')).toBe('Jorginho')
    })

    it('should handle empty names', () => {
      expect(getLastName('')).toBe('Unknown')
      expect(getLastName('   ')).toBe('Unknown')
    })

    it('should handle names with multiple spaces', () => {
      expect(getLastName('Thomas  Partey  Jr')).toBe('Jr')
    })
  })

  describe('getFullName', () => {
    it('should prefer Japanese name', () => {
      const player: Player = {
        jp: '冨安健洋',
        intl: 'Takehiro Tomiyasu',
      }

      expect(getFullName(player)).toBe('冨安健洋')
    })

    it('should fallback to international name', () => {
      const player: Player = {
        jp: '',
        intl: 'Bukayo Saka',
      }

      expect(getFullName(player)).toBe('Bukayo Saka')
    })

    it('should handle missing names', () => {
      const player: Player = {
        jp: '',
        intl: '',
      }

      expect(getFullName(player)).toBe('Unknown Player')
    })
  })

  describe('isShortName', () => {
    it('should correctly identify short names', () => {
      expect(isShortName('田中', 5)).toBe(true)
      expect(isShortName('冨安健洋', 5)).toBe(true)
      expect(isShortName('ウィリアム・サリバ', 5)).toBe(false)
    })

    it('should respect custom threshold', () => {
      expect(isShortName('田中太郎', 3)).toBe(false)
      expect(isShortName('田中太郎', 4)).toBe(true)
    })

    it('should handle empty strings', () => {
      expect(isShortName('', 5)).toBe(true)
      expect(isShortName('   ', 5)).toBe(true)
    })
  })

  describe('isKatakanaName', () => {
    it('should identify katakana names', () => {
      expect(isKatakanaName('サカ')).toBe(true)
      expect(isKatakanaName('デクラン・ライス')).toBe(true)
      expect(isKatakanaName('ダビド ラヤ')).toBe(true)
    })

    it('should reject non-katakana names', () => {
      expect(isKatakanaName('田中太郎')).toBe(false)
      expect(isKatakanaName('Bukayo Saka')).toBe(false)
      expect(isKatakanaName('123')).toBe(false)
    })

    it('should handle mixed content', () => {
      expect(isKatakanaName('サカ123')).toBe(false)
      expect(isKatakanaName('Saka サカ')).toBe(false)
    })
  })

  describe('hasKanji', () => {
    it('should detect kanji characters', () => {
      expect(hasKanji('田中太郎')).toBe(true)
      expect(hasKanji('冨安健洋')).toBe(true)
      expect(hasKanji('田中abc')).toBe(true)
    })

    it('should reject non-kanji text', () => {
      expect(hasKanji('サカ')).toBe(false)
      expect(hasKanji('Bukayo Saka')).toBe(false)
      expect(hasKanji('ひらがな')).toBe(false)
      expect(hasKanji('123')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle players with only position', () => {
      const player: Player = {
        jp: '',
        intl: '',
        pos: 'GK',
      }

      expect(getDisplayName(player)).toBe('Unknown')
      expect(getFullName(player)).toBe('Unknown Player')
    })

    it('should handle numbers in names', () => {
      const player: Player = {
        jp: 'プレイヤー1',
        intl: 'Player 1',
      }

      expect(getDisplayName(player)).toBe('プレイヤー1')
    })

    it('should handle special characters', () => {
      const player: Player = {
        jp: 'オ・マリー',
        intl: "O'Malley",
      }

      expect(getDisplayName(player, 5)).toBe('オ')
      expect(getLastName(player.intl)).toBe("O'Malley")
    })
  })
})
