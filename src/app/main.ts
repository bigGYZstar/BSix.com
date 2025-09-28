
// メインアプリケーション（新バージョン）

// 状態管理とページ初期化
import { subscribeToState, setCurrentView, setSelectedMatch } from '@/app/state';
import { initHomePage } from '@/pages/home';
import { initMatchPage } from '@/pages/match';
import type { AppState } from '@/types';

// 新しいテーマ管理システムのインポート
import { initializeThemeSwitcher } from './theme';
import '../ui/themes.css';

// UIコンポーネントのインポート
import '@/ui/tokens.css';
import '@/ui/base.css';
import '@/ui/components.css';
import '@/ui/home.css';
import '@/ui/mobile.css';
import '@/ui/desktop.css';

/**
 * アプリケーション初期化
 */
async function initApp(): Promise<void> {
  console.log('Initializing application...');
  
  try {
    // 初期HTMLを生成（テーマ切り替えボタンはここから削除）
    await generateInitialHTML();
    
    // 新しいテーマ切り替え機能を初期化
    initializeThemeSwitcher();
    
    // ルーティングを初期化
    initRouting();
    
    // 状態変更の監視
    subscribeToState(handleStateChange);
    
    // 初期ページを表示
    await showHomePage();
    
    // ローディングスピナーを隠す
    hideInitialLoading();
    
    console.log('Application initialized successfully');
    
  } catch (error) {
    console.error('Failed to initialize application:', error);
    showError('アプリケーションの初期化に失敗しました');
  }
}

/**
 * 初期HTMLの生成（テーマ切り替えボタンを削除）
 */
async function generateInitialHTML(): Promise<void> {
  const body = document.body;
  
  body.innerHTML = `
    <div id="app">
      <div id="home-view" class="view active">
        <header class="header mobile-header">
          <div class="container header-content">
            <h1 class="logo">⚽ ビッグシックス</h1>
            <!-- 古いテーマボタンは削除 -->
          </div>
        </header>
        <main class="main-content">
          <div class="container">
            <section class="page-header">
              <h2 class="page-title">今後の注目試合</h2>
              <p class="page-subtitle">プレミアリーグ ビッグシックス対戦カード</p>
            </section>
            <div id="matches-section" class="matches-section">
              <div id="matches-list" class="matches-list"></div>
            </div>
          </div>
        </main>
      </div>
      <div id="match-view" class="view" style="display: none;">
        <header class="header mobile-header">
          <div class="container header-content">
            <button id="back-button" class="back-button" aria-label="戻る">← 戻る</button>
            <h1 class="logo match-title">試合プレビュー</h1>
            <!-- 古いテーマボタンは削除 -->
          </div>
        </header>
        <main class="match-content">
          <div id="match-data-container"></div>
        </main>
      </div>
    </div>
  `;
}

/**
 * ルーティングの初期化（テーマ関連のリスナーを削除）
 */
function initRouting(): void {
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', handleBackButton);
  }
  window.addEventListener('popstate', handlePopState);
  window.addEventListener('hashchange', handleHashChange);
}

// --- 以下、変更のない関数群 --- 

async function showHomePage(): Promise<void> {
  showView('home-view');
  setCurrentView('home');
  await initHomePage();
}

async function showMatchPage(matchId: string): Promise<void> {
  showView('match-view');
  setCurrentView('match');
  setSelectedMatch(matchId);
  await initMatchPage(matchId);
}

function showView(viewId: string): void {
  const views = document.querySelectorAll('.view');
  views.forEach(view => {
    (view as HTMLElement).style.display = 'none';
  });
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.style.display = 'block';
  }
}

function handleBackButton(): void {
  showHomePage();
  window.location.hash = '';
}

function handlePopState(event: PopStateEvent): void {
  const state = event.state;
  if (state && state.matchId) {
    showMatchPage(state.matchId);
  } else {
    showHomePage();
  }
}

function handleHashChange(): void {
  const hash = window.location.hash;
  if (hash.startsWith('#match/')) {
    const matchId = hash.replace('#match/', '');
    showMatchPage(matchId);
  } else {
    showHomePage();
  }
}

function handleStateChange(state: AppState): void {
  if (state.currentView === 'match' && state.selectedMatch) {
    if (document.getElementById('match-view')?.style.display === 'none') {
      showMatchPage(state.selectedMatch);
    }
  } else if (state.currentView === 'home') {
    if (document.getElementById('home-view')?.style.display === 'none') {
      showHomePage();
    }
  }
}

function hideInitialLoading(): void {
  const loading = document.getElementById('initial-loading');
  if (loading) {
    loading.style.display = 'none';
  }
  document.body.classList.add('app-loaded');
}

function showError(message: string): void {
  document.body.innerHTML = `<div style="text-align: center; padding: 2rem;"><h1>エラー</h1><p>${message}</p></div>`;
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', initApp);

