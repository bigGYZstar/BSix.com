// 試合詳細ページの機能

import { loadFixtureById } from '@/app/data'
import { setFixture, setLoading, setError, subscribeToState, setActiveTab } from '@/app/state'
import { renderOverview } from '@/features/tabs/overview'
import { renderTactics } from '@/features/tabs/tactics'
import { renderLineup } from '@/features/tabs/lineup'
import { renderTimeline } from '@/features/tabs/timeline'
import type { Fixture, AppState } from '@/types'

/**
 * 試合詳細ページの初期化
 */
export async function initMatchPage(matchId: string): Promise<void> {
  console.log('Initializing match page for:', matchId)
  
  try {
    setLoading(true)
    setError(null)
    
    // 試合データを読み込み
    const matches = JSON.parse(localStorage.getItem('matches') || '[]')
    const fixture = await loadFixtureById(matchId, matches)
    
    if (!fixture) {
      throw new Error(`試合データが見つかりません: ${matchId}`)
    }
    
    // 状態に保存
    setFixture(fixture)
    
    // イベントリスナーを設定
    setupMatchPageEventListeners()
    
    // 初期タブ（概要）を表示
    await renderMatchContent('overview', fixture)
    
    setLoading(false)
    
  } catch (error) {
    console.error('Failed to initialize match page:', error)
    setError(error instanceof Error ? error.message : '試合データの読み込みに失敗しました')
    setLoading(false)
  }
}

/**
 * 試合ページのイベントリスナー設定
 */
function setupMatchPageEventListeners(): void {
  // タブボタンのイベントリスナー
  const tabButtons = document.querySelectorAll('.mobile-tab-button')
  tabButtons.forEach(button => {
    button.addEventListener('click', handleTabClick)
  })
  
  // 状態変更の監視
  subscribeToState(handleMatchStateChange)
}

/**
 * タブクリックの処理
 */
function handleTabClick(event: Event): void {
  const target = event.currentTarget as HTMLElement
  const tab = target.dataset.tab
  
  if (!tab) return
  
  // アクティブタブを更新
  updateActiveTab(tab)
  setActiveTab(tab as any)
  
  // コンテンツを描画
  const state = { currentFixture: JSON.parse(localStorage.getItem('currentFixture') || 'null') }
  if (state.currentFixture) {
    renderMatchContent(tab, state.currentFixture)
  }
}

/**
 * アクティブタブの表示更新
 */
function updateActiveTab(activeTab: string): void {
  const tabButtons = document.querySelectorAll('.mobile-tab-button')
  tabButtons.forEach(button => {
    const buttonElement = button as HTMLElement
    const tab = buttonElement.dataset.tab
    
    if (tab === activeTab) {
      buttonElement.classList.add('active')
    } else {
      buttonElement.classList.remove('active')
    }
  })
}

/**
 * 試合コンテンツの描画
 */
async function renderMatchContent(tab: string, fixture: Fixture): Promise<void> {
  const container = document.getElementById('match-data-container')
  if (!container) {
    console.error('Match data container not found')
    return
  }
  
  try {
    let content: HTMLElement
    
    switch (tab) {
      case 'overview':
        content = await renderOverview(fixture)
        break
      case 'tactics':
        content = await renderTactics(fixture)
        break
      case 'lineup':
        content = await renderLineup(fixture, 'home') // デフォルトはホームチーム
        break
      case 'timeline':
        content = await renderTimeline(fixture)
        break
      default:
        throw new Error(`Unknown tab: ${tab}`)
    }
    
    // コンテンツを更新
    container.innerHTML = ''
    container.appendChild(content)
    
    // スクロール位置をリセット
    window.scrollTo(0, 0)
    
  } catch (error) {
    console.error('Failed to render match content:', error)
    container.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>コンテンツの表示に失敗しました</h3>
        <p>${error instanceof Error ? error.message : '不明なエラーが発生しました'}</p>
      </div>
    `
  }
}

/**
 * 試合ページの状態変更処理
 */
function handleMatchStateChange(state: AppState): void {
  // ローディング状態の表示制御
  if (state.loading) {
    showMatchLoading()
  } else {
    hideMatchLoading()
  }
  
  // エラー状態の表示制御
  if (state.error) {
    showMatchError(state.error)
  } else {
    hideMatchError()
  }
  
  // フィクスチャデータの更新
  if (state.currentFixture) {
    localStorage.setItem('currentFixture', JSON.stringify(state.currentFixture))
    updateMatchTitle(state.currentFixture)
  }
}

/**
 * 試合タイトルの更新
 */
function updateMatchTitle(fixture: Fixture): void {
  const titleElement = document.querySelector('.match-title')
  if (titleElement) {
    titleElement.textContent = `${fixture.home.name} vs ${fixture.away.name}`
  }
}

/**
 * ローディング表示制御
 */
function showMatchLoading(): void {
  const container = document.getElementById('match-data-container')
  if (container) {
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>試合データを読み込み中...</p>
      </div>
    `
  }
}

function hideMatchLoading(): void {
  // ローディングは自動的に隠れる（コンテンツで置き換わる）
}

/**
 * エラー表示制御
 */
function showMatchError(message: string): void {
  const container = document.getElementById('match-data-container')
  if (container) {
    container.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>エラーが発生しました</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">
          ページを再読み込み
        </button>
      </div>
    `
  }
}

function hideMatchError(): void {
  // エラーは自動的に隠れる（コンテンツで置き換わる）
}

/**
 * 試合ページのクリーンアップ
 */
export function cleanupMatchPage(): void {
  // イベントリスナーの削除などが必要であれば実装
  console.log('Cleaning up match page...')
}
