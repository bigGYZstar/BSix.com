// JSONスキーマ検証テスト

import Ajv from 'ajv'
import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, it, expect, beforeAll } from 'vitest'

// スキーマファイルのパス
const SCHEMA_DIR = join(__dirname, '../src/data/schema')
const DATA_DIR = join(__dirname, '../src/data')

describe('JSON Schema Validation', () => {
  let ajv: Ajv

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true })
  })

  describe('Schema files', () => {
    it('should load player schema', () => {
      const schemaPath = join(SCHEMA_DIR, 'player.schema.json')
      expect(() => {
        const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'))
        ajv.addSchema(schema, 'player.schema.json')
      }).not.toThrow()
    })

    it('should load team schema', () => {
      const schemaPath = join(SCHEMA_DIR, 'team.schema.json')
      expect(() => {
        const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'))
        ajv.addSchema(schema, 'team.schema.json')
      }).not.toThrow()
    })

    it('should load fixture schema', () => {
      const schemaPath = join(SCHEMA_DIR, 'fixture.schema.json')
      expect(() => {
        const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'))
        ajv.addSchema(schema, 'fixture.schema.json')
      }).not.toThrow()
    })
  })

  describe('Sample data validation', () => {
    let playerSchema: any
    let teamSchema: any
    let fixtureSchema: any

    beforeAll(() => {
      // スキーマを読み込み
      playerSchema = JSON.parse(
        readFileSync(join(SCHEMA_DIR, 'player.schema.json'), 'utf-8')
      )
      teamSchema = JSON.parse(
        readFileSync(join(SCHEMA_DIR, 'team.schema.json'), 'utf-8')
      )
      fixtureSchema = JSON.parse(
        readFileSync(join(SCHEMA_DIR, 'fixture.schema.json'), 'utf-8')
      )

      // スキーマをAjvに追加（新しいインスタンスで重複を回避）
      const testAjv = new Ajv({ allErrors: true, strict: false })
      testAjv.addSchema(playerSchema, 'player.schema.json')
      testAjv.addSchema(teamSchema, 'team.schema.json')
      testAjv.addSchema(fixtureSchema, 'fixture.schema.json')

      // グローバルajvをtestAjvで置き換え
      ajv = testAjv
    })

    it('should validate sample fixture data', () => {
      const fixturePath = join(DATA_DIR, 'fixtures/2025-08-24-ars-lee.json')
      const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'))

      const validate = ajv.compile(fixtureSchema)
      const isValid = validate(fixture)

      if (!isValid) {
        console.error('Validation errors:', validate.errors)
      }

      expect(isValid).toBe(true)
    })

    it('should validate name override data', () => {
      const overridePath = join(DATA_DIR, 'overrides/jp-name-overrides.json')
      const overrides = JSON.parse(readFileSync(overridePath, 'utf-8'))

      // 基本的な構造チェック
      expect(overrides).toBeTypeOf('object')
      expect(overrides._meta).toBeTypeOf('object')
      expect(overrides._meta.description).toBeTypeOf('string')

      // データ形式チェック
      Object.entries(overrides).forEach(([key, value]) => {
        if (key !== '_meta') {
          expect(key).toBeTypeOf('string')
          expect(value).toBeTypeOf('string')
          expect(key.length).toBeGreaterThan(0)
          expect((value as string).length).toBeGreaterThan(0)
        }
      })
    })

    it('should validate avatar guess data', () => {
      const avatarPath = join(DATA_DIR, 'overrides/avatar-guess.json')
      const avatars = JSON.parse(readFileSync(avatarPath, 'utf-8'))

      expect(avatars).toBeTypeOf('object')
      expect(avatars._meta).toBeTypeOf('object')

      // アバターデータの形式チェック
      Object.entries(avatars).forEach(([key, value]) => {
        if (key !== '_meta') {
          expect(key).toBeTypeOf('string')
          expect(value).toBeTypeOf('object')

          const avatar = value as any
          if (avatar.skin) {
            expect(['light', 'medium', 'dark', 'tan']).toContain(avatar.skin)
          }
          if (avatar.hair) {
            expect([
              'black',
              'brown',
              'blonde',
              'red',
              'gray',
              'bald',
            ]).toContain(avatar.hair)
          }
          if (avatar.style) {
            expect(['short', 'buzz', 'curly', 'long', 'bald']).toContain(
              avatar.style
            )
          }
        }
      })
    })
  })

  describe('Player data validation', () => {
    let samplePlayers: any[]

    beforeAll(() => {
      // フィクスチャからサンプル選手データを取得
      const fixturePath = join(DATA_DIR, 'fixtures/2025-08-24-ars-lee.json')
      const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'))
      samplePlayers = [...fixture.home.lineup, ...fixture.away.lineup]
    })

    it('should validate all lineup players', () => {
      const schemaPath = join(SCHEMA_DIR, 'player.schema.json')
      const playerSchema = JSON.parse(readFileSync(schemaPath, 'utf-8'))

      // 新しいAjvインスタンスを作成してスキーマの重複を避ける
      const testAjv = new Ajv({ allErrors: true, strict: false })
      const validatePlayer = testAjv.compile(playerSchema)

      samplePlayers.forEach((player, index) => {
        const isValid = validatePlayer(player)

        if (!isValid) {
          console.error(
            `Player ${index} validation errors:`,
            validatePlayer.errors
          )
          console.error('Player data:', JSON.stringify(player, null, 2))
        }

        expect(isValid).toBe(true)
      })
    })

    it('should have required fields', () => {
      samplePlayers.forEach(player => {
        expect(player.jp).toBeTypeOf('string')
        expect(player.intl).toBeTypeOf('string')
        expect(player.jp.length).toBeGreaterThan(0)
        expect(player.intl.length).toBeGreaterThan(0)
      })
    })

    it('should have valid positions', () => {
      const validPositions = [
        'GK',
        'CB',
        'LB',
        'RB',
        'LWB',
        'RWB',
        'DM',
        'CM',
        'AM',
        'LM',
        'RM',
        'LW',
        'RW',
        'CF',
        'ST',
      ]

      samplePlayers.forEach(player => {
        if (player.pos) {
          expect(validPositions).toContain(player.pos)
        }
      })
    })

    it('should have valid stats format', () => {
      samplePlayers.forEach(player => {
        if (player.stats) {
          const stats = player.stats
          if (stats.apps !== undefined) expect(stats.apps).toBeTypeOf('number')
          if (stats.goals !== undefined)
            expect(stats.goals).toBeTypeOf('number')
          if (stats.assists !== undefined)
            expect(stats.assists).toBeTypeOf('number')

          // 負の値はない
          if (stats.apps !== undefined)
            expect(stats.apps).toBeGreaterThanOrEqual(0)
          if (stats.goals !== undefined)
            expect(stats.goals).toBeGreaterThanOrEqual(0)
          if (stats.assists !== undefined)
            expect(stats.assists).toBeGreaterThanOrEqual(0)
        }
      })
    })
  })

  describe('Formation validation', () => {
    it('should validate formation format', () => {
      const formations = ['4-3-3', '4-2-3-1', '3-5-2', '4-4-2', '5-3-2']

      formations.forEach(formation => {
        // フォーメーション形式のテスト
        expect(formation).toMatch(/^\d+(-\d+)+$/)

        // 数字の合計が10であることをテスト（GK除く）
        const numbers = formation.split('-').map(n => parseInt(n))
        const sum = numbers.reduce((acc, n) => acc + n, 0)
        expect(sum).toBe(10) // GKを除く10人
      })
    })
  })

  describe('Data consistency', () => {
    it('should have consistent team formations and player counts', () => {
      const fixturePath = join(DATA_DIR, 'fixtures/2025-08-24-ars-lee.json')
      const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'))

      // ホームチーム
      expect(fixture.home.lineup).toHaveLength(11)
      expect(fixture.home.formation).toBeTypeOf('string')

      // アウェイチーム
      expect(fixture.away.lineup).toHaveLength(11)
      expect(fixture.away.formation).toBeTypeOf('string')

      // 各チームにGKが1人ずついることを確認
      const homeGKCount = fixture.home.lineup.filter(
        (p: any) => p.pos === 'GK'
      ).length
      const awayGKCount = fixture.away.lineup.filter(
        (p: any) => p.pos === 'GK'
      ).length

      expect(homeGKCount).toBe(1)
      expect(awayGKCount).toBe(1)
    })

    it('should have valid timeline events', () => {
      const fixturePath = join(DATA_DIR, 'fixtures/2025-08-24-ars-lee.json')
      const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'))

      fixture.timeline.forEach((event: any) => {
        expect(event.time).toBeTypeOf('string')
        expect(event.phase).toBeTypeOf('string')
        expect(event.desc).toBeTypeOf('string')

        // 有効なフェーズかチェック
        const validPhases = [
          '開始',
          '前半',
          '後半',
          '延長前半',
          '延長後半',
          'PK戦',
          '終了',
        ]
        expect(validPhases).toContain(event.phase)

        // チーム指定がある場合は有効な値かチェック
        if (event.team) {
          expect(['home', 'away']).toContain(event.team)
        }
      })
    })
  })
})
