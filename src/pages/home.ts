// 試合一覧ページ（ホーム）の機能

import { 
  loadMatches, 
  loadTeams, 
  filterBigSixMatches, 
  filterUpcomingMatches, 
  sortMatchesByDate,
  formatMatchDate,
  getTeamInfo,

} from '@/app/data'
import { 
  setMatches, 
  setTeams, 
  setSelectedMatch, 
  setLoading, 
  setError,
  subscribeToState
} from '@/app/state'
import type { MatchInfo, TeamInfo } from '@/types'

/**
 * ホームページの初期化
 */
export async function initHomePage(): Promise<void> {
  console.log('Initializing home page...')
  
  // イベントリスナーを設定
  setupEventListeners()
  
  // データを読み込み
  await loadInitialData()
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners(): void {
  // テーマ切り替えボタン
  const themeToggle = document.getElementById('theme-toggle')
  if (themeToggle) {
    themeToggle.addEventListener('click', handleThemeToggle)
  }
  
  // 再試行ボタン
  const retryButton = document.getElementById('retry-button')
  if (retryButton) {
    retryButton.addEventListener('click', handleRetry)
  }
  
  // 状態変更の監視
  subscribeToState(handleStateChange)
}

/**
 * 初期データの読み込み
 */
async function loadInitialData(): Promise<void> {
  setLoading(true)
  setError(null)
  
  try {
    console.log('Loading initial data...')
    
    // 並行してデータを読み込み
    const [matches, teams] = await Promise.all([
      loadMatches(),
      loadTeams()
    ])
    
    console.log('Loaded matches:', matches)
    console.log('Loaded teams:', teams)
    
    // 状態に保存
    setMatches(matches)
    setTeams(teams)
    
    // ビッグシックスの今後の試合をフィルタリング
    const bigSixMatches = filterBigSixMatches(matches)
    console.log('Big Six matches:', bigSixMatches)
    
    const upcomingMatches = filterUpcomingMatches(bigSixMatches)
    console.log('Upcoming matches:', upcomingMatches)
    
    const sortedMatches = sortMatchesByDate(upcomingMatches)
    console.log('Sorted matches:', sortedMatches)
    
    // 試合一覧を表示
    renderMatches(sortedMatches, teams)
    
    setLoading(false)
    
  } catch (error) {
    console.error('Failed to load initial data:', error)
    setError(error instanceof Error ? error.message : '不明なエラーが発生しました')
    setLoading(false)
  }
}

/**
 * 試合一覧の表示
 */
function renderMatches(matches: MatchInfo[], teams: Record<string, TeamInfo>): void {
  const matchesList = document.getElementById('matches-list')
  const matchesSection = document.getElementById('matches-section')
  const emptyState = document.getElementById('empty-state')
  
  if (!matchesList || !matchesSection || !emptyState) {
    console.error('Required elements not found')
    return
  }
  
  // 既存の内容をクリア
  matchesList.innerHTML = ''
  
  if (matches.length === 0) {
    // 空の状態を表示
    matchesSection.style.display = 'none'
    emptyState.style.display = 'block'
    return
  }
  
  // 試合一覧を表示
  matchesSection.style.display = 'block'
  emptyState.style.display = 'none'
  
  // 各試合のカードを作成
  matches.forEach(match => {
    const card = createMatchCard(match, teams)
    if (card) {
      matchesList.appendChild(card)
    }
  })
}

/**
 * 試合カードの作成
 */
function createMatchCard(match: MatchInfo, teams: Record<string, TeamInfo>): HTMLElement | null {
  const template = document.getElementById('match-card-template') as HTMLTemplateElement
  if (!template) {
    console.error('Match card template not found')
    return null
  }
  
  // テンプレートをクローン
  const card = template.content.cloneNode(true) as DocumentFragment
  const cardElement = card.querySelector('.match-card') as HTMLElement
  
  if (!cardElement) {
    console.error('Match card element not found in template')
    return null
  }
  
  // データ属性を設定
  cardElement.setAttribute('data-match-id', match.id)
  
  // チーム情報を取得
  const homeTeam = getTeamInfo(match.homeTeam, teams)
  const awayTeam = getTeamInfo(match.awayTeam, teams)
  
  // 日付情報
  const dateElement = card.querySelector('.match-date')
  if (dateElement) {
    dateElement.textContent = formatMatchDate(match.date)
  }
  
  // リーグ情報
  const leagueElement = card.querySelector('.match-league')
  if (leagueElement) {
    leagueElement.textContent = `${match.league} ${match.round}`
  }
  
  // ホームチーム
  const homeTeamElements = card.querySelector('.home-team')
  if (homeTeamElements && homeTeam) {
    const badge = homeTeamElements.querySelector('.team-badge')
    const name = homeTeamElements.querySelector('.team-name')
    
    if (badge) {
      badge.textContent = homeTeam.key
      ;(badge as HTMLElement).style.backgroundColor = homeTeam.colors.primary
      ;(badge as HTMLElement).style.color = homeTeam.colors.secondary
    }
    
    if (name) {
      name.textContent = homeTeam.name
    }
  }
  
  // アウェイチーム
  const awayTeamElements = card.querySelector('.away-team')
  if (awayTeamElements && awayTeam) {
    const badge = awayTeamElements.querySelector('.team-badge')
    const name = awayTeamElements.querySelector('.team-name')
    
    if (badge) {
      badge.textContent = awayTeam.key
      ;(badge as HTMLElement).style.backgroundColor = awayTeam.colors.primary
      ;(badge as HTMLElement).style.color = awayTeam.colors.secondary
    }
    
    if (name) {
      name.textContent = awayTeam.name
    }
  }
  
  // 会場情報
  const venueElement = card.querySelector('.venue-name')
  if (venueElement) {
    venueElement.textContent = match.venue
  }
  
  // ラウンド情報
  const roundElement = card.querySelector('.round-text')
  if (roundElement) {
    roundElement.textContent = match.round
  }
  
  // クリックイベント
  const previewButton = card.querySelector('.match-preview-btn')
  if (previewButton) {
    previewButton.addEventListener('click', (e) => {
      e.stopPropagation()
      handleMatchSelect(match.id)
    })
  }
  
  // カード全体のクリックイベント
  cardElement.addEventListener('click', () => {
    handleMatchSelect(match.id)
  })
  
  return cardElement
}

/**
 * 試合選択の処理
 */
function handleMatchSelect(matchId: string): void {
  console.log('Match selected:', matchId)
  setSelectedMatch(matchId)
  
  // URLを更新（ブラウザの戻るボタン対応）
  const url = new URL(window.location.href)
  url.searchParams.set('match', matchId)
  window.history.pushState({ matchId }, '', url.toString())
  
  // 試合ページに遷移
  window.location.hash = `#match/${matchId}`
}

/**
 * テーマ切り替えの処理
 */
function handleThemeToggle(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
  
  // ボタンのアイコンを更新
  const themeToggle = document.getElementById('theme-toggle')
  if (themeToggle) {
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙'
  }
}

/**
 * 再試行の処理
 */
function handleRetry(): void {
  console.log('Retrying data load...')
  loadInitialData()
}

/**
 * 状態変更の処理
 */
function handleStateChange(): void {
  // 必要に応じて状態変更に応じた処理を実装
}

/**
 * 表示状態の切り替え
 */
function showElement(elementId: string): void {
  const element = document.getElementById(elementId)
  if (element) {
    element.style.display = 'block'
  }
}

function hideElement(elementId: string): void {
  const element = document.getElementById(elementId)
  if (element) {
    element.style.display = 'none'
  }
}

/**
 * ローディング状態の表示制御
 */
export function showLoading(): void {
  showElement('loading')
  hideElement('matches-section')
  hideElement('empty-state')
  hideElement('error')
}

export function hideLoading(): void {
  hideElement('loading')
}

/**
 * エラー状態の表示制御
 */
export function showError(message: string): void {
  const errorMessage = document.getElementById('error-message')
  if (errorMessage) {
    errorMessage.textContent = message
  }
  
  showElement('error')
  hideElement('loading')
  hideElement('matches-section')
  hideElement('empty-state')
}

export function hideError(): void {
  hideElement('error')
}
