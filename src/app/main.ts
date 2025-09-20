// メインアプリケーション（新バージョン）

import { applyInitialTheme, subscribeToState, setCurrentView, setSelectedMatch } from '@/app/state'
import { initHomePage } from '@/pages/home'
import { initMatchPage } from '@/pages/match'
import type { AppState } from '@/types'

// UI Imports
import '@/ui/tokens.css'
import '@/ui/base.css'
import '@/ui/components.css'
import '@/ui/home.css'
import '@/ui/mobile.css'
import '@/ui/desktop.css'

/**
 * アプリケーション初期化
 */
async function initApp(): Promise<void> {
  console.log('Initializing application...')
  
  try {
    // 初期テーマを適用
    applyInitialTheme()
    
    // 初期HTMLを生成
    await generateInitialHTML()
    
    // ルーティングを初期化
    initRouting()
    
    // 状態変更の監視
    subscribeToState(handleStateChange)
    
    // 初期ページを表示
    await showHomePage()
    
    // ローディングスピナーを隠す
    hideInitialLoading()
    
    console.log('Application initialized successfully')
    
  } catch (error) {
    console.error('Failed to initialize application:', error)
    showError('アプリケーションの初期化に失敗しました')
  }
}

/**
 * 初期HTMLの生成
 */
async function generateInitialHTML(): Promise<void> {
  const body = document.body
  
  body.innerHTML = `
    <!-- アプリケーションルート -->
    <div id="app">
      <!-- ホームページ -->
      <div id="home-view" class="view active">
        <!-- ヘッダー -->
        <header class="header mobile-header">
          <div class="container header-content">
            <h1 class="logo">⚽ ビッグシックス</h1>
            <button id="theme-toggle" class="theme-toggle" aria-label="テーマ切り替え">
              🌙
            </button>
          </div>
        </header>

        <!-- メインコンテンツ -->
        <main class="main-content">
          <div class="container">
            <!-- ページタイトル -->
            <section class="page-header">
              <h2 class="page-title">今後の注目試合</h2>
              <p class="page-subtitle">プレミアリーグ ビッグシックス対戦カード</p>
            </section>

            <!-- ローディング表示 -->
            <div id="loading" class="loading-container" style="display: none;">
              <div class="loading-spinner"></div>
              <p>試合データを読み込み中...</p>
            </div>

            <!-- エラー表示 -->
            <div id="error" class="error-container" style="display: none;">
              <div class="error-icon">⚠️</div>
              <h3>データの読み込みに失敗しました</h3>
              <p id="error-message"></p>
              <button id="retry-button" class="btn btn-primary">再試行</button>
            </div>

            <!-- 試合一覧 -->
            <section id="matches-section" class="matches-section" style="display: none;">
              <div id="matches-list" class="matches-list">
                <!-- 試合カードがここに動的に挿入される -->
              </div>
            </section>

            <!-- 空の状態 -->
            <div id="empty-state" class="empty-state" style="display: none;">
              <div class="empty-icon">📅</div>
              <h3>今後の試合がありません</h3>
              <p>新しい試合が追加されるまでお待ちください。</p>
            </div>
          </div>
        </main>
      </div>

      <!-- 試合詳細ページ -->
      <div id="match-view" class="view" style="display: none;">
        <!-- 試合詳細のヘッダー -->
        <header class="header mobile-header">
          <div class="container header-content">
            <button id="back-button" class="back-button" aria-label="戻る">
              ← 戻る
            </button>
            <h1 class="logo match-title">試合プレビュー</h1>
            <button id="theme-toggle-match" class="theme-toggle" aria-label="テーマ切り替え">
              🌙
            </button>
          </div>
        </header>

        <!-- タブナビゲーション（モバイル最適化） -->
        <nav class="mobile-tab-nav">
          <div class="tab-nav-container">
            <button class="mobile-tab-button active" data-tab="overview">
              <span class="tab-icon">📊</span>
              <span class="tab-label">概要</span>
            </button>
            <button class="mobile-tab-button" data-tab="tactics">
              <span class="tab-icon">🎯</span>
              <span class="tab-label">戦術</span>
            </button>
            <button class="mobile-tab-button" data-tab="lineup">
              <span class="tab-icon">⚽</span>
              <span class="tab-label">布陣</span>
            </button>
            <button class="mobile-tab-button" data-tab="timeline">
              <span class="tab-icon">⏱️</span>
              <span class="tab-label">経過</span>
            </button>
          </div>
        </nav>

        <!-- 試合詳細コンテンツ -->
        <main class="match-content">
          <div id="match-data-container">
            <!-- 試合データがここに動的に挿入される -->
          </div>
        </main>
      </div>

      <!-- 下部タブバー（モバイル） -->
      <nav class="bottom-tab-bar">
        <button class="bottom-tab active" data-view="home">
          <span class="tab-icon">🏠</span>
          <span class="tab-label">ホーム</span>
        </button>
        <button class="bottom-tab" data-view="favorites">
          <span class="tab-icon">⭐</span>
          <span class="tab-label">お気に入り</span>
        </button>
        <button class="bottom-tab" data-view="settings">
          <span class="tab-icon">⚙️</span>
          <span class="tab-label">設定</span>
        </button>
      </nav>

      <!-- 試合カードテンプレート -->
      <template id="match-card-template">
        <article class="match-card mobile-optimized" data-match-id="">
          <div class="match-card-header">
            <div class="match-date"></div>
            <div class="match-league"></div>
          </div>
          
          <div class="match-card-body">
            <div class="teams-container">
              <div class="team home-team">
                <div class="team-logo">
                  <div class="team-badge"></div>
                </div>
                <div class="team-info">
                  <h3 class="team-name"></h3>
                  <p class="team-venue">ホーム</p>
                </div>
              </div>
              
              <div class="vs-divider">
                <span>VS</span>
              </div>
              
              <div class="team away-team">
                <div class="team-logo">
                  <div class="team-badge"></div>
                </div>
                <div class="team-info">
                  <h3 class="team-name"></h3>
                  <p class="team-venue">アウェイ</p>
                </div>
              </div>
            </div>
            
            <div class="match-details">
              <div class="venue-info">
                <span class="venue-icon">🏟️</span>
                <span class="venue-name"></span>
              </div>
              <div class="round-info">
                <span class="round-text"></span>
              </div>
            </div>
          </div>
          
          <div class="match-card-footer">
            <button class="btn btn-primary match-preview-btn mobile-touch">
              試合プレビューを見る
              <span class="btn-icon">→</span>
            </button>
          </div>
        </article>
      </template>

      <!-- プレイヤーモーダル -->
      <div id="player-modal" class="modal" style="display: none;">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modal-player-name"></h3>
            <button id="modal-close" class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <div id="modal-player-info"></div>
          </div>
        </div>
      </div>
    </div>
  `
}

/**
 * ルーティングの初期化
 */
function initRouting(): void {
  // 下部タブバーのイベントリスナー
  const bottomTabs = document.querySelectorAll('.bottom-tab')
  bottomTabs.forEach(tab => {
    tab.addEventListener('click', handleBottomTabClick)
  })
  
  // 戻るボタンのイベントリスナー
  const backButton = document.getElementById('back-button')
  if (backButton) {
    backButton.addEventListener('click', handleBackButton)
  }
  
  // テーマ切り替えボタンのイベントリスナー
  const themeToggles = document.querySelectorAll('.theme-toggle')
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', handleThemeToggle)
  })
  
  // ブラウザの戻る/進むボタン対応
  window.addEventListener('popstate', handlePopState)
  
  // ハッシュ変更の監視
  window.addEventListener('hashchange', handleHashChange)
}

/**
 * ホームページの表示
 */
async function showHomePage(): Promise<void> {
  console.log('Showing home page...')
  
  // ビューを切り替え
  showView('home-view')
  setCurrentView('home')
  
  // ホームページを初期化
  await initHomePage()
  
  // 下部タブバーの状態を更新
  updateBottomTabBar('home')
}

/**
 * 試合詳細ページの表示
 */
async function showMatchPage(matchId: string): Promise<void> {
  console.log('Showing match page:', matchId)
  
  // ビューを切り替え
  showView('match-view')
  setCurrentView('match')
  setSelectedMatch(matchId)
  
  // 試合詳細ページを初期化
  await initMatchPage(matchId)
  
  // 下部タブバーを隠す（試合詳細では不要）
  hideBottomTabBar()
}

/**
 * ビューの切り替え
 */
function showView(viewId: string): void {
  // すべてのビューを隠す
  const views = document.querySelectorAll('.view')
  views.forEach(view => {
    view.classList.remove('active')
    ;(view as HTMLElement).style.display = 'none'
  })
  
  // 指定されたビューを表示
  const targetView = document.getElementById(viewId)
  if (targetView) {
    targetView.classList.add('active')
    targetView.style.display = 'block'
  }
}

/**
 * 下部タブバーの状態更新
 */
function updateBottomTabBar(activeTab: string): void {
  const tabs = document.querySelectorAll('.bottom-tab')
  tabs.forEach(tab => {
    const tabElement = tab as HTMLElement
    const tabView = tabElement.dataset.view
    
    if (tabView === activeTab) {
      tabElement.classList.add('active')
    } else {
      tabElement.classList.remove('active')
    }
  })
  
  // タブバーを表示
  const tabBar = document.querySelector('.bottom-tab-bar') as HTMLElement
  if (tabBar) {
    tabBar.style.display = 'flex'
  }
}

/**
 * 下部タブバーを隠す
 */
function hideBottomTabBar(): void {
  const tabBar = document.querySelector('.bottom-tab-bar') as HTMLElement
  if (tabBar) {
    tabBar.style.display = 'none'
  }
}

/**
 * イベントハンドラー
 */
function handleBottomTabClick(event: Event): void {
  const target = event.currentTarget as HTMLElement
  const view = target.dataset.view
  
  if (view === 'home') {
    showHomePage()
    window.location.hash = ''
  } else if (view === 'favorites') {
    // お気に入りページ（未実装）
    console.log('Favorites page not implemented yet')
  } else if (view === 'settings') {
    // 設定ページ（未実装）
    console.log('Settings page not implemented yet')
  }
}

function handleBackButton(): void {
  showHomePage()
  window.location.hash = ''
}

function handleThemeToggle(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
  
  // すべてのテーマ切り替えボタンのアイコンを更新
  const themeToggles = document.querySelectorAll('.theme-toggle')
  themeToggles.forEach(toggle => {
    toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙'
  })
}

function handlePopState(event: PopStateEvent): void {
  const state = event.state
  if (state && state.matchId) {
    showMatchPage(state.matchId)
  } else {
    showHomePage()
  }
}

function handleHashChange(): void {
  const hash = window.location.hash
  
  if (hash.startsWith('#match/')) {
    const matchId = hash.replace('#match/', '')
    showMatchPage(matchId)
  } else {
    showHomePage()
  }
}

function handleStateChange(state: AppState): void {
  // 状態変更に応じた処理
  if (state.currentView === 'match' && state.selectedMatch) {
    // 試合ページの表示
    if (document.getElementById('match-view')?.style.display === 'none') {
      showMatchPage(state.selectedMatch)
    }
  } else if (state.currentView === 'home') {
    // ホームページの表示
    if (document.getElementById('home-view')?.style.display === 'none') {
      showHomePage()
    }
  }
}

/**
 * ユーティリティ関数
 */
function hideInitialLoading(): void {
  const loading = document.getElementById('initial-loading')
  if (loading) {
    loading.style.display = 'none'
  }
  
  document.body.classList.add('app-loaded')
}

function showError(message: string): void {
  const body = document.body
  body.innerHTML = `
    <div style="text-align: center; padding: 2rem; max-width: 600px; margin: 0 auto;">
      <h1>エラーが発生しました</h1>
      <p>${message}</p>
      <button onclick="location.reload()" class="btn btn-primary">
        ページを再読み込み
      </button>
    </div>
  `
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', initApp)

// エラーハンドリング
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})
