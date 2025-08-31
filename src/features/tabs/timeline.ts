// タイムライン タブ - 試合の流れとキーポイント

import type { Fixture, TimelineEvent } from '@/types'
import { getTeamColors } from '@/ui/emblems'

/**
 * タイムライン セクション描画
 */
export async function renderTimeline(fixture: Fixture): Promise<HTMLElement> {
  const container = document.createElement('div')
  container.className = 'timeline-section'

  // セクションヘッダー
  const header = createSectionHeader()
  container.appendChild(header)

  // キーポイント サマリー
  const keyPoints = createKeyPointsSummary(fixture)
  container.appendChild(keyPoints)

  // 試合タイムライン
  const timeline = createMatchTimeline(fixture)
  container.appendChild(timeline)

  // 統計情報
  const stats = createTimelineStats(fixture)
  container.appendChild(stats)

  return container
}

/**
 * セクションヘッダー
 */
function createSectionHeader(): HTMLElement {
  const header = document.createElement('div')
  header.className = 'text-center mb-8'

  header.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">試合の流れ</h2>
    <p class="text-muted">タイムラインとキーポイントで振り返る</p>
  `

  return header
}

/**
 * キーポイント サマリー
 */
function createKeyPointsSummary(fixture: Fixture): HTMLElement {
  const section = document.createElement('div')
  section.className = 'card mb-8'

  section.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">試合のキーポイント</h3>
      <div class="card-subtitle">注目すべき要素と展開</div>
    </div>
  `

  if (fixture.keyPoints && fixture.keyPoints.length > 0) {
    const pointsList = document.createElement('div')
    pointsList.className = 'grid grid-cols-1 md:grid-cols-2 gap-4'

    fixture.keyPoints.forEach((point, index) => {
      const pointCard = document.createElement('div')
      pointCard.className = 'flex items-start gap-3 p-4 bg-tertiary rounded-lg'

      pointCard.innerHTML = `
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
          ${index + 1}
        </div>
        <div class="text-sm">
          ${point}
        </div>
      `

      pointsList.appendChild(pointCard)
    })

    section.appendChild(pointsList)
  } else {
    const emptyMessage = document.createElement('div')
    emptyMessage.className = 'text-center py-8 text-muted'
    emptyMessage.textContent = 'キーポイント情報はありません'
    section.appendChild(emptyMessage)
  }

  return section
}

/**
 * 試合タイムライン
 */
function createMatchTimeline(fixture: Fixture): HTMLElement {
  const section = document.createElement('div')
  section.className = 'card mb-8'

  section.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">試合タイムライン</h3>
      <div class="card-subtitle">時系列で見る試合展開</div>
    </div>
  `

  if (fixture.timeline && fixture.timeline.length > 0) {
    const timeline = createTimelineComponent(fixture.timeline, fixture)
    section.appendChild(timeline)
  } else {
    const emptyMessage = document.createElement('div')
    emptyMessage.className = 'text-center py-8 text-muted'
    emptyMessage.textContent = 'タイムライン情報はありません'
    section.appendChild(emptyMessage)
  }

  return section
}

/**
 * タイムラインコンポーネント
 */
function createTimelineComponent(
  events: TimelineEvent[],
  fixture: Fixture
): HTMLElement {
  const timeline = document.createElement('div')
  timeline.className = 'relative'

  // タイムライン軸
  const axis = document.createElement('div')
  axis.className = 'absolute left-8 top-0 bottom-0 w-0.5 bg-border'
  timeline.appendChild(axis)

  // イベントリスト
  const eventsList = document.createElement('div')
  eventsList.className = 'space-y-6'

  events.forEach(event => {
    const eventItem = createTimelineEvent(event, fixture)
    eventsList.appendChild(eventItem)
  })

  timeline.appendChild(eventsList)

  return timeline
}

/**
 * 個別タイムラインイベント
 */
function createTimelineEvent(
  event: TimelineEvent,
  fixture: Fixture
): HTMLElement {
  const item = document.createElement('div')
  item.className = 'relative flex items-start gap-4'

  // イベントアイコン
  const icon = createEventIcon(event)

  // イベント詳細
  const details = document.createElement('div')
  details.className = 'flex-1 min-w-0'

  // チーム色を取得
  let teamColor = 'var(--color-primary)'
  if (event.team === 'home') {
    teamColor = getTeamColors(fixture.home.teamId).primary
  } else if (event.team === 'away') {
    teamColor = getTeamColors(fixture.away.teamId).primary
  }

  details.innerHTML = `
    <div class="flex items-center gap-3 mb-2">
      <div class="text-sm font-mono font-bold text-secondary">${event.time}</div>
      <div class="px-2 py-1 text-xs rounded-full bg-tertiary text-secondary">
        ${getPhaseText(event.phase)}
      </div>
      ${
        event.type
          ? `
        <div class="px-2 py-1 text-xs rounded-full text-white" style="background-color: ${getEventTypeColor(event.type)}">
          ${getEventTypeText(event.type)}
        </div>
      `
          : ''
      }
    </div>
    
    <div class="text-sm mb-1" ${event.team ? `style="color: ${teamColor}"` : ''}>
      ${event.desc}
    </div>
    
    ${
      event.player
        ? `
      <div class="text-xs text-muted">
        関連選手: <span class="font-medium">${event.player}</span>
      </div>
    `
        : ''
    }
  `

  item.appendChild(icon)
  item.appendChild(details)

  return item
}

/**
 * イベントアイコン
 */
function createEventIcon(event: TimelineEvent): HTMLElement {
  const icon = document.createElement('div')
  icon.className =
    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold z-10'

  // イベントタイプに応じたアイコンと色
  const { color, symbol } = getEventIconStyle(event)
  icon.style.backgroundColor = color
  icon.textContent = symbol

  return icon
}

/**
 * イベントアイコンスタイル
 */
function getEventIconStyle(event: TimelineEvent): {
  color: string
  symbol: string
} {
  if (event.type) {
    const styles = {
      goal: { color: '#10b981', symbol: '⚽' },
      assist: { color: '#3b82f6', symbol: '🅰' },
      card: { color: '#f59e0b', symbol: '📋' },
      substitution: { color: '#8b5cf6', symbol: '🔄' },
      other: { color: '#6b7280', symbol: 'ℹ' },
    }
    return styles[event.type] || styles.other
  }

  // フェーズに応じたスタイル
  const phaseStyles = {
    開始: { color: '#10b981', symbol: '▶' },
    前半: { color: '#3b82f6', symbol: '1' },
    後半: { color: '#f59e0b', symbol: '2' },
    延長前半: { color: '#ef4444', symbol: 'E1' },
    延長後半: { color: '#ef4444', symbol: 'E2' },
    PK戦: { color: '#8b5cf6', symbol: 'PK' },
    終了: { color: '#6b7280', symbol: '■' },
  }

  return phaseStyles[event.phase] || { color: '#6b7280', symbol: '●' }
}

/**
 * タイムライン統計
 */
function createTimelineStats(fixture: Fixture): HTMLElement {
  const section = document.createElement('div')
  section.className = 'card'

  section.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">試合統計</h3>
      <div class="card-subtitle">タイムライン分析</div>
    </div>
  `

  const stats = analyzeTimelineStats(fixture.timeline)
  const statsGrid = createStatsGrid(stats)
  section.appendChild(statsGrid)

  return section
}

/**
 * 統計グリッド
 */
function createStatsGrid(stats: any): HTMLElement {
  const grid = document.createElement('div')
  grid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4'

  const statItems = [
    { label: '総イベント数', value: stats.totalEvents },
    { label: 'ゴール', value: stats.goals },
    { label: '交代', value: stats.substitutions },
    { label: 'カード', value: stats.cards },
  ]

  statItems.forEach(item => {
    const statCard = document.createElement('div')
    statCard.className = 'text-center p-4 bg-secondary rounded-lg'

    statCard.innerHTML = `
      <div class="text-2xl font-bold mb-1">${item.value}</div>
      <div class="text-sm text-muted">${item.label}</div>
    `

    grid.appendChild(statCard)
  })

  return grid
}

/**
 * タイムライン統計分析
 */
function analyzeTimelineStats(timeline: TimelineEvent[]): {
  totalEvents: number
  goals: number
  substitutions: number
  cards: number
  phases: { [key: string]: number }
} {
  const stats = {
    totalEvents: timeline.length,
    goals: 0,
    substitutions: 0,
    cards: 0,
    phases: {} as { [key: string]: number },
  }

  timeline.forEach(event => {
    // フェーズ別カウント
    stats.phases[event.phase] = (stats.phases[event.phase] || 0) + 1

    // イベントタイプ別カウント
    if (event.type === 'goal') {
      stats.goals++
    }
    if (event.type === 'substitution') {
      stats.substitutions++
    }
    if (event.type === 'card') {
      stats.cards++
    }
  })

  return stats
}

// ヘルパー関数

function getPhaseText(phase: string): string {
  const phaseMap: { [key: string]: string } = {
    開始: 'キックオフ',
    前半: '前半',
    後半: '後半',
    延長前半: '延長前半',
    延長後半: '延長後半',
    PK戦: 'PK戦',
    終了: '試合終了',
  }

  return phaseMap[phase] || phase
}

function getEventTypeText(type: string): string {
  const typeMap: { [key: string]: string } = {
    goal: 'ゴール',
    assist: 'アシスト',
    card: 'カード',
    substitution: '交代',
    other: 'その他',
  }

  return typeMap[type] || type
}

function getEventTypeColor(type: string): string {
  const colorMap: { [key: string]: string } = {
    goal: '#10b981',
    assist: '#3b82f6',
    card: '#f59e0b',
    substitution: '#8b5cf6',
    other: '#6b7280',
  }

  return colorMap[type] || '#6b7280'
}

/**
 * タイムライン フィルタリング機能
 */
export function addTimelineFilters(
  container: HTMLElement,
  fixture: Fixture
): void {
  const filterContainer = document.createElement('div')
  filterContainer.className = 'flex flex-wrap gap-2 mb-6'

  // フィルターボタンを作成
  const filters = ['all', 'goal', 'substitution', 'card']

  filters.forEach(filter => {
    const button = document.createElement('button')
    button.className = `btn btn-secondary btn-sm ${filter === 'all' ? 'active' : ''}`
    button.textContent = getFilterLabel(filter)

    button.addEventListener('click', () => {
      // アクティブフィルターを更新
      filterContainer
        .querySelectorAll('.btn')
        .forEach(btn => btn.classList.remove('active'))
      button.classList.add('active')

      // タイムラインを再描画
      const timelineContainer = container.querySelector('.card:last-child')
      if (timelineContainer) {
        const filteredEvents = filterEvents(fixture.timeline, filter)
        const newTimeline = createTimelineComponent(filteredEvents, fixture)

        const oldTimeline = timelineContainer.querySelector('.relative')
        if (oldTimeline) {
          oldTimeline.replaceWith(newTimeline)
        }
      }
    })

    filterContainer.appendChild(button)
  })

  // タイムラインカードの前に挿入
  const timelineCard = container.querySelector('.card:last-child')
  if (timelineCard) {
    timelineCard.parentElement?.insertBefore(filterContainer, timelineCard)
  }
}

function getFilterLabel(filter: string): string {
  const labels: { [key: string]: string } = {
    all: '全て',
    goal: 'ゴール',
    substitution: '交代',
    card: 'カード',
  }

  return labels[filter] || filter
}

function filterEvents(
  events: TimelineEvent[],
  filter: string
): TimelineEvent[] {
  if (filter === 'all') {
    return events
  }

  return events.filter(event => event.type === filter)
}
