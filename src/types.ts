// アプリケーション共通の型定義

import type { PlayerProfile } from '@/features/liverpoolDetail/types'

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
  formation: string,
  lines: Player[],
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

// 正規化されたチーム情報
export interface TeamInfo {
  id: string
  name: string
  nameEn: string
  key: string
  city: string
  stadium: string
  founded: number
  colors: {
    primary: string
    secondary: string
  }
  logo: string
  category: 'big6' | 'other'
}

// 試合メタデータ
export interface MatchInfo {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  league: string
  round: string
  venue: string
  status: 'scheduled' | 'live' | 'finished'
  isBigSix: boolean
  dataFile: string
}

// 試合一覧データ
export interface MatchesData {
  season: string
  matches: MatchInfo[]
}

// チーム一覧データ
export interface TeamsData {
  teams: Record<string, TeamInfo>
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
  // 新しい状態
  matches: MatchInfo[]
  teams: Record<string, TeamInfo>
  currentView: 'home' | 'match'
  selectedMatch: string | null
}

// ピッチ座標
export interface Position {
  x: number
  y: number
}

// フォーメーション解析結果
export interface FormationData {
  formation: string;
  lines: PlayerProfile[][];
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
  open: (player: PlayerProfile) => void
  close: () => void
  isOpen: () => boolean
}

// ルート定義
export type Route = 'home' | 'overview' | 'tactics' | 'lineup' | 'timeline'

// テーマ設定
export type Theme = 'light' | 'dark' | 'auto'
