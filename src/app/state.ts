// アプリケーション状態管理

import type { AppState, Fixture, Player, Route, Theme } from '@/types'

/**
 * アプリケーション状態のデフォルト値
 */
const defaultState: AppState = {
  currentFixture: null,
  selectedTab: 'overview',
  selectedTeam: 'home',
  theme: 'auto',
  modalPlayer: null,
  loading: false,
  error: null
}

/**
 * 状態管理クラス
 */
class StateManager {
  private state: AppState = { ...defaultState }
  private listeners: Set<(state: AppState) => void> = new Set()

  constructor() {
    this.loadPersistedState()
  }

  /**
   * 現在の状態を取得
   */
  getState(): Readonly<AppState> {
    return { ...this.state }
  }

  /**
   * 状態を更新
   */
  setState(partialState: Partial<AppState>): void {
    const prevState = { ...this.state }
    this.state = { ...this.state, ...partialState }
    
    // 変更があった場合のみリスナーに通知
    if (this.hasStateChanged(prevState, this.state)) {
      this.persistState()
      this.notifyListeners()
    }
  }

  /**
   * 状態変更リスナーを登録
   */
  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener)
    
    // アンサブスクライブ関数を返す
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * すべてのリスナーに状態変更を通知
   */
  private notifyListeners(): void {
    const currentState = this.getState()
    this.listeners.forEach(listener => {
      try {
        listener(currentState)
      } catch (error) {
        console.error('State listener error:', error)
      }
    })
  }

  /**
   * 状態が変更されたかチェック
   */
  private hasStateChanged(prevState: AppState, currentState: AppState): boolean {
    // 簡単な浅い比較（より厳密にはdeep equalが必要）
    return JSON.stringify(prevState) !== JSON.stringify(currentState)
  }

  /**
   * 永続化された状態を読み込み
   */
  private loadPersistedState(): void {
    try {
      // テーマ設定を読み込み
      const savedTheme = localStorage.getItem('match-preview-theme') as Theme
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        this.state.theme = savedTheme
      }

      // タブ設定を読み込み
      const savedTab = localStorage.getItem('match-preview-tab') as Route
      if (savedTab && ['overview', 'tactics', 'lineup', 'timeline'].includes(savedTab)) {
        this.state.selectedTab = savedTab
      }

      // チーム選択を読み込み
      const savedTeam = localStorage.getItem('match-preview-team')
      if (savedTeam && ['home', 'away'].includes(savedTeam)) {
        this.state.selectedTeam = savedTeam as 'home' | 'away'
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error)
    }
  }

  /**
   * 状態を永続化
   */
  private persistState(): void {
    try {
      localStorage.setItem('match-preview-theme', this.state.theme)
      localStorage.setItem('match-preview-tab', this.state.selectedTab)
      localStorage.setItem('match-preview-team', this.state.selectedTeam)
    } catch (error) {
      console.warn('Failed to persist state:', error)
    }
  }

  // 便利メソッド群

  /**
   * フィクスチャを設定
   */
  setFixture(fixture: Fixture): void {
    this.setState({ currentFixture: fixture, error: null })
  }

  /**
   * タブを変更
   */
  setTab(tab: Route): void {
    this.setState({ selectedTab: tab })
  }

  /**
   * チームを選択
   */
  setTeam(team: 'home' | 'away'): void {
    this.setState({ selectedTeam: team })
  }

  /**
   * テーマを設定
   */
  setTheme(theme: Theme): void {
    this.setState({ theme })
    this.applyThemeToDOM(theme)
  }

  /**
   * ローディング状態を設定
   */
  setLoading(loading: boolean): void {
    this.setState({ loading })
  }

  /**
   * エラーを設定
   */
  setError(error: string | null): void {
    this.setState({ error, loading: false })
  }

  /**
   * モーダルプレイヤーを設定
   */
  setModalPlayer(player: Player | null): void {
    this.setState({ modalPlayer: player })
  }

  /**
   * 状態をリセット
   */
  reset(): void {
    this.state = { ...defaultState }
    this.persistState()
    this.notifyListeners()
  }

  /**
   * 現在選択中のチームオブジェクトを取得
   */
  getCurrentTeam() {
    const fixture = this.state.currentFixture
    if (!fixture) return null
    
    return this.state.selectedTeam === 'home' ? fixture.home : fixture.away
  }

  /**
   * 対戦相手チームを取得
   */
  getOpponentTeam() {
    const fixture = this.state.currentFixture
    if (!fixture) return null
    
    return this.state.selectedTeam === 'home' ? fixture.away : fixture.home
  }

  /**
   * DOMにテーマを適用
   */
  private applyThemeToDOM(theme: Theme): void {
    const root = document.documentElement
    
    // 既存のテーマクラスを削除
    root.removeAttribute('data-theme')
    
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light')
    } else if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
    }
    // 'auto' の場合は属性を設定せず、CSS の @media (prefers-color-scheme) に任せる
  }

  /**
   * 初期テーマを適用（アプリ起動時）
   */
  applyInitialTheme(): void {
    this.applyThemeToDOM(this.state.theme)
  }
}

// シングルトンインスタンス
export const stateManager = new StateManager()

// 便利なヘルパー関数

/**
 * 現在の状態を取得
 */
export function getAppState(): Readonly<AppState> {
  return stateManager.getState()
}

/**
 * 状態変更を購読
 */
export function subscribeToState(listener: (state: AppState) => void): () => void {
  return stateManager.subscribe(listener)
}

/**
 * フィクスチャデータを設定
 */
export function setFixture(fixture: Fixture): void {
  stateManager.setFixture(fixture)
}

/**
 * タブを変更
 */
export function setActiveTab(tab: Route): void {
  stateManager.setTab(tab)
}

/**
 * チームを選択
 */
export function setActiveTeam(team: 'home' | 'away'): void {
  stateManager.setTeam(team)
}

/**
 * テーマを変更
 */
export function setTheme(theme: Theme): void {
  stateManager.setTheme(theme)
}

/**
 * ローディング状態を制御
 */
export function setLoading(loading: boolean): void {
  stateManager.setLoading(loading)
}

/**
 * エラー状態を制御
 */
export function setError(error: string | null): void {
  stateManager.setError(error)
}

/**
 * 現在選択中のチームを取得
 */
export function getCurrentTeam() {
  return stateManager.getCurrentTeam()
}

/**
 * 対戦相手チームを取得
 */
export function getOpponentTeam() {
  return stateManager.getOpponentTeam()
}

/**
 * 初期テーマを適用
 */
export function applyInitialTheme(): void {
  stateManager.applyInitialTheme()
}