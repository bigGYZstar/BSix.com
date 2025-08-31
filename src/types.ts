// アプリケーション共通の型定義

export interface Player {
  playerId?: string
  jp: string
  intl: string
  pos?: string
  num?: number | string
  stats?: {
    apps?: number
    goals?: number
    assists?: number
    cleanSheets?: number
    saves?: number
  }
  avatar?: {
    skin?: 'light' | 'medium' | 'dark' | 'tan'
    hair?: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'bald'
    style?: 'short' | 'buzz' | 'curly' | 'long' | 'bald'
  }
  photoUrl?: string
}

export interface Team {
  teamId: string
  name: string
  key: string
  formation: string
  lineup: Player[]
  bench: (string | Player)[]
  news?: string[]
  highlights?: string[]
  eval?: {
    寸評?: string
    攻撃力?: number
    守備力?: number
    総合力?: number
  }
  keychips?: string[]
}

export interface TimelineEvent {
  time: string
  phase: '開始' | '前半' | '後半' | '延長前半' | '延長後半' | 'PK戦' | '終了'
  desc: string
  team?: 'home' | 'away'
  player?: string
  type?: 'goal' | 'assist' | 'card' | 'substitution' | 'other'
}

export interface Weather {
  condition?: '晴れ' | '曇り' | '雨' | '雪' | '霧'
  temperature?: number
  humidity?: number
}

export interface Referee {
  main?: string
  assistants?: string[]
}

export interface Fixture {
  _meta?: {
    source?: string
    lastUpdated?: string
    version?: string
  }
  fixtureId: string
  league: string
  round: string
  dateJST: string
  venue: string
  home: Team
  away: Team
  timeline: TimelineEvent[]
  keyPoints: string[]
  weather?: Weather
  referee?: Referee
}

// アプリケーション状態
export interface AppState {
  currentFixture: Fixture | null
  selectedTab: string
  selectedTeam: 'home' | 'away'
  theme: 'light' | 'dark' | 'auto'
  modalPlayer: Player | null
  loading: boolean
  error: string | null
}

// ピッチ座標
export interface Position {
  x: number
  y: number
}

// フォーメーション解析結果
export interface FormationData {
  formation: string
  lines: Player[][]
  positions: Position[]
}

// 名前オーバーライド
export interface NameOverrides {
  [englishName: string]: string
}

// アバター推測データ
export interface AvatarGuess {
  [playerName: string]: {
    skin?: 'light' | 'medium' | 'dark' | 'tan'
    hair?: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'bald'
    style?: 'short' | 'buzz' | 'curly' | 'long' | 'bald'
  }
}

// イベントリスナー用の型
export type EventCallback = (event: Event) => void

// モーダル操作
export interface Modal {
  open: (player: Player) => void
  close: () => void
  isOpen: () => boolean
}

// ルート定義
export type Route = 'overview' | 'tactics' | 'lineup' | 'timeline'

// テーマ設定
export type Theme = 'light' | 'dark' | 'auto'
