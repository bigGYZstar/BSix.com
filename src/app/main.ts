// アプリケーションエントリポイント

import type { Fixture } from '@/types'
import {
  stateManager,
  subscribeToState,
  setFixture,
  setLoading,
  setError,
  applyInitialTheme,
} from './state'
import { initRouter, onRouteChange, getAllRoutes } from './router'

// UI Imports
import '@/ui/tokens.css'
import '@/ui/base.css'
import '@/ui/components.css'

// Feature Imports
import { renderOverview } from '@/features/tabs/overview'
import { renderTactics } from '@/features/tabs/tactics'
import { renderLineup } from '@/features/tabs/lineup'
import { renderTimeline } from '@/features/tabs/timeline'

/**
 * アプリケーション初期化
 */
export async function initApp(): Promise<void> {
  try {
    // 初期テーマを適用
    applyInitialTheme()

    // ローディング状態を設定
    setLoading(true)

    // ルーター初期化
    initRouter()

    // ヘッダーとナビゲーションを描画
    await renderHeader()
    await renderTabNavigation()

    // フィクスチャデータを読み込み
    const fixture = await loadFixtureData()
    setFixture(fixture)

    // 初期コンテンツを描画
    await renderCurrentRoute()

    // 状態変更とルート変更を監視
    setupEventListeners()

    // ローディング完了
    setLoading(false)

    // アプリケーション初期化完了
  } catch (error) {
    console.error('App initialization failed:', error)
    setError(error instanceof Error ? error.message : '初期化に失敗しました')
  }
}

/**
 * ヘッダー描画
 */
async function renderHeader(): Promise<void> {
  const header = document.createElement('header')
  header.className = 'header'

  const container = document.createElement('div')
  container.className = 'container header-content'

  // ロゴ
  const logo = document.createElement('a')
  logo.className = 'logo'
  logo.href = '#overview'
  logo.textContent = '試合プレビュー'

  // テーマ切り替えボタン
  const themeToggle = createThemeToggle()

  container.appendChild(logo)
  container.appendChild(themeToggle)
  header.appendChild(container)

  // ヘッダーを挿入
  const existingHeader = document.querySelector('header')
  if (existingHeader) {
    existingHeader.replaceWith(header)
  } else {
    document.body.insertBefore(header, document.body.firstChild)
  }
}

/**
 * タブナビゲーション描画
 */
async function renderTabNavigation(): Promise<void> {
  const nav = document.createElement('nav')
  nav.className = 'container'

  const tabNav = document.createElement('div')
  tabNav.className = 'tab-nav'

  const routes = getAllRoutes()

  routes.forEach(({ route, title, hash }) => {
    const button = document.createElement('button')
    button.className = 'tab-button'
    button.textContent = title
    button.setAttribute('data-route', route)
    button.addEventListener('click', () => {
      window.location.hash = hash
    })

    tabNav.appendChild(button)
  })

  nav.appendChild(tabNav)

  // ナビゲーションを挿入
  const header = document.querySelector('header')
  if (header) {
    header.insertAdjacentElement('afterend', nav)
  } else {
    document.body.appendChild(nav)
  }

  // アクティブタブを更新
  updateActiveTab()
}

/**
 * テーマ切り替えボタン作成
 */
function createThemeToggle(): HTMLElement {
  const button = document.createElement('button')
  button.className = 'btn btn-secondary'
  button.setAttribute('aria-label', 'テーマ切り替え')

  const icon = document.createElement('span')
  icon.textContent = '🌙'
  button.appendChild(icon)

  button.addEventListener('click', () => {
    const currentState = stateManager.getState()
    const currentTheme = currentState.theme

    let newTheme: 'light' | 'dark' | 'auto'
    if (currentTheme === 'light') {
      newTheme = 'dark'
      icon.textContent = '☀️'
    } else if (currentTheme === 'dark') {
      newTheme = 'auto'
      icon.textContent = '🌗'
    } else {
      newTheme = 'light'
      icon.textContent = '🌙'
    }

    stateManager.setTheme(newTheme)
  })

  return button
}

/**
 * フィクスチャデータ読み込み
 */
async function loadFixtureData(): Promise<Fixture> {
  try {
    const response = await fetch('./data/fixtures/2025-08-24-ars-lee.json')
    if (!response.ok) {
      throw new Error(`Failed to load fixture data: ${response.status}`)
    }

    const fixture = await response.json()
    return fixture
  } catch (error) {
    console.error('Failed to load fixture data:', error)
    throw new Error('試合データの読み込みに失敗しました')
  }
}

/**
 * 現在のルートに応じてコンテンツを描画
 */
async function renderCurrentRoute(): Promise<void> {
  const state = stateManager.getState()
  const currentRoute = state.selectedTab

  // メインコンテンツエリアを取得または作成
  let main = document.querySelector('main')
  if (!main) {
    main = document.createElement('main')
    main.className = 'container'
    document.body.appendChild(main)
  }

  // ローディング表示
  if (state.loading) {
    main.innerHTML = `
      <div class="flex items-center justify-center py-16">
        <div class="text-lg text-muted">読み込み中...</div>
      </div>
    `
    return
  }

  // エラー表示
  if (state.error) {
    main.innerHTML = `
      <div class="card">
        <div class="text-center py-8">
          <h2 class="text-xl font-semibold mb-4 text-error">エラーが発生しました</h2>
          <p class="text-muted mb-6">${state.error}</p>
          <button class="btn btn-primary" onclick="location.reload()">
            再読み込み
          </button>
        </div>
      </div>
    `
    return
  }

  // フィクスチャデータなし
  if (!state.currentFixture) {
    main.innerHTML = `
      <div class="card">
        <div class="text-center py-8">
          <h2 class="text-xl font-semibold mb-4">試合データが見つかりません</h2>
          <p class="text-muted">試合情報を読み込めませんでした。</p>
        </div>
      </div>
    `
    return
  }

  // ルートに応じてコンテンツを描画
  try {
    let content: HTMLElement

    switch (currentRoute) {
      case 'overview':
        content = await renderOverview(state.currentFixture)
        break
      case 'tactics':
        content = await renderTactics(state.currentFixture)
        break
      case 'lineup':
        content = await renderLineup(state.currentFixture, state.selectedTeam)
        break
      case 'timeline':
        content = await renderTimeline(state.currentFixture)
        break
      default:
        throw new Error(`Unknown route: ${currentRoute}`)
    }

    // コンテンツを更新
    main.innerHTML = ''
    main.appendChild(content)
  } catch (error) {
    console.error('Failed to render route:', error)
    main.innerHTML = `
      <div class="card">
        <div class="text-center py-8">
          <h2 class="text-xl font-semibold mb-4 text-error">描画エラー</h2>
          <p class="text-muted">コンテンツの描画に失敗しました。</p>
        </div>
      </div>
    `
  }
}

/**
 * アクティブタブの表示を更新
 */
function updateActiveTab(): void {
  const state = stateManager.getState()
  const buttons = document.querySelectorAll('.tab-button')

  buttons.forEach(button => {
    const route = button.getAttribute('data-route')
    if (route === state.selectedTab) {
      button.classList.add('active')
    } else {
      button.classList.remove('active')
    }
  })
}

/**
 * イベントリスナーセットアップ
 */
function setupEventListeners(): void {
  // 状態変更を監視
  subscribeToState(() => {
    updateActiveTab()
    renderCurrentRoute()
  })

  // ルート変更を監視
  onRouteChange(() => {
    updateActiveTab()
    renderCurrentRoute()
  })

  // ウィンドウリサイズを監視（レスポンシブ対応）
  let resizeTimeout: number
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = window.setTimeout(() => {
      // ピッチサイズなどの調整が必要であれば実行
      renderCurrentRoute()
    }, 250)
  })

  // キーボードショートカット
  document.addEventListener('keydown', event => {
    // Ctrl/Cmd + R で再読み込み
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault()
      location.reload()
    }
  })
}

/**
 * アプリケーション開始
 */
export function startApp(): void {
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp)
  } else {
    initApp()
  }
}

// 未処理のエラーをキャッチ
window.addEventListener('error', event => {
  console.error('Unhandled error:', event.error)
  setError('予期しないエラーが発生しました')
})

window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason)
  setError('非同期処理でエラーが発生しました')
})

// アプリケーション開始
startApp()
