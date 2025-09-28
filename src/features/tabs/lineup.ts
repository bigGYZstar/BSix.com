// 布陣タブ - ピッチ表示とベンチメンバー

import type { Fixture } from '@/types'
import type { PlayerProfile } from '@/features/liverpoolDetail/types'
import { renderPitch } from '@/features/pitch/renderPitch'
import { normalizeBench } from '@/features/players/bench'
import { getDisplayName } from '@/features/players/displayName'
import { addPlayerModalTrigger } from '@/features/players/modal'
import { getTeamColors, getTeamEmblem } from '@/ui/emblems'

/**
 * 布陣セクション描画
 */
export async function renderLineup(
  fixture: Fixture,
  selectedTeam: 'home' | 'away'
): Promise<HTMLElement> {
  const container = document.createElement('div')
  container.className = 'lineup-section'

  // チーム切り替えピル
  const teamSwitcher = createTeamSwitcher(fixture, selectedTeam)
  container.appendChild(teamSwitcher)

  // 現在選択中のチーム
  const currentTeam = selectedTeam === 'home' ? fixture.home : fixture.away

  // チーム情報ヘッダー
  const teamHeader = createTeamHeader(currentTeam)
  container.appendChild(teamHeader)

  // ピッチ表示
  const pitchElement = document.createElement("div")
  pitchElement.className = "pitch-display"
  container.appendChild(pitchElement)

  renderPitch(
    pitchElement,
    currentTeam.lines as PlayerProfile[],
    currentTeam.formation,
    currentTeam.teamId
  )


  // ベンチメンバー
  const benchSection = await createBenchSection(currentTeam)
  container.appendChild(benchSection)

  return container
}

/**
 * チーム切り替えピル
 */
function createTeamSwitcher(
  fixture: Fixture,
  selectedTeam: 'home' | 'away'
): HTMLElement {
  const container = document.createElement('div')
  container.className = 'mb-6'

  const header = document.createElement('div')
  header.className = 'flex items-center justify-between mb-4'

  const title = document.createElement('h2')
  title.className = 'text-lg font-semibold'
  title.textContent = '予想スタメン'

  const pills = document.createElement('div')
  pills.className = 'team-pills'

  // ホームチームピル
  const homePill = createTeamPill(fixture.home, 'home', selectedTeam === 'home')
  pills.appendChild(homePill)

  // アウェイチームピル
  const awayPill = createTeamPill(fixture.away, 'away', selectedTeam === 'away')
  pills.appendChild(awayPill)

  header.appendChild(title)
  header.appendChild(pills)
  container.appendChild(header)

  return container
}

/**
 * 個別チームピル
 */
function createTeamPill(
  team: any,
  teamType: 'home' | 'away',
  isActive: boolean
): HTMLElement {
  const pill = document.createElement('button')
  pill.className = `team-pill ${team.teamId} ${isActive ? 'active' : ''}`
  pill.setAttribute('data-team', teamType)

  // チームアイコンとテキストを含む
  pill.innerHTML = `
    ${getTeamEmblem(team.teamId, 20)}
    <span class="ml-2">${team.name}</span>
  `

  // クリックイベント
  pill.addEventListener('click', () => {
    // 状態を更新（実際の実装では状態管理を通して行う）
    import('@/app/state').then(({ setActiveTeam }) => {
      setActiveTeam(teamType)
    })
  })

  return pill
}

/**
 * チーム情報ヘッダー
 */
function createTeamHeader(team: any): HTMLElement {
  const header = document.createElement('div')
  header.className = 'text-center mb-6'

  const colors = getTeamColors(team.teamId)

  header.innerHTML = `
    <div class="flex items-center justify-center gap-4 mb-2">
      ${getTeamEmblem(team.teamId, 40)}
      <div>
        <h3 class="text-xl font-bold" style="color: ${colors.primary}">${team.name}</h3>
        <div class="text-sm text-muted">フォーメーション: ${team.formation}</div>
      </div>
    </div>
  `

  return header
}

/**
 * ベンチセクション
 */
async function createBenchSection(team: any): Promise<HTMLElement> {
  const section = document.createElement('div')
  section.className = 'bench-area'

  const title = document.createElement('h3')
  title.className = 'bench-title'
  title.textContent = 'ベンチメンバー'
  section.appendChild(title)

  try {
    // ベンチメンバーを正規化
    const normalizedBench = await normalizeBench(team.bench)

    if (normalizedBench.length === 0) {
      const emptyMessage = document.createElement('div')
      emptyMessage.className = 'text-center py-8 text-muted'
      emptyMessage.textContent = 'ベンチメンバーの情報がありません'
      section.appendChild(emptyMessage)
      return section
    }

    // ベンチグリッド
    const grid = document.createElement('div')
    grid.className = 'bench-grid'

    normalizedBench.forEach(player => {
      const playerCard = createBenchPlayerCard(player, team.teamId)
      grid.appendChild(playerCard)
    })

    section.appendChild(grid)
  } catch (error) {
    console.error('Failed to create bench section:', error)
    const errorMessage = document.createElement('div')
    errorMessage.className = 'text-center py-8 text-error'
    errorMessage.textContent = 'ベンチメンバーの読み込みに失敗しました'
    section.appendChild(errorMessage)
  }

  return section
}

/**
 * ベンチ選手カード
 */
function createBenchPlayerCard(player: any, teamId: string): HTMLElement {
  const card = document.createElement('div')
  card.className = 'bench-player cursor-pointer'

  const colors = getTeamColors(teamId)

  // ドット（チーム色）
  const dot = document.createElement('div')
  dot.className = 'dot'
  dot.style.backgroundColor = colors.primary
  dot.style.borderColor = colors.secondary

  // 名前ボックス
  const nameBox = document.createElement('div')
  nameBox.className = 'namebox'
  nameBox.textContent = getDisplayName(player)

  // ポジション表示
  const posBox = document.createElement('div')
  posBox.className = 'text-xs text-muted mt-1'
  posBox.textContent = player.position || 'SUB'

  // 背番号表示（ある場合）
  if (player.num) {
    const numBox = document.createElement('div')
    numBox.className = 'text-xs font-mono text-muted'
    numBox.textContent = `#${player.num}`
    card.appendChild(numBox)
  }

  card.appendChild(dot)
  card.appendChild(nameBox)
  card.appendChild(posBox)

  // モーダルトリガーを追加
  addPlayerModalTrigger(card, player)

  return card
}

/**
 * フォーメーション詳細情報
 */
export function createFormationDetails(team: any): HTMLElement {
  const section = document.createElement('div')
  section.className = 'card mt-6'

  section.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">フォーメーション詳細</h3>
      <div class="card-subtitle">${team.formation} システム</div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 戦術的特徴 -->
      <div>
        <h4 class="text-sm font-semibold text-secondary mb-3">戦術的特徴</h4>
        <div class="space-y-2 text-sm">
          ${getTacticalFeatures(team.formation)
            .map(
              feature => `
            <div class="flex items-start gap-2">
              <span class="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>${feature}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      
      <!-- キープレイヤー -->
      <div>
        <h4 class="text-sm font-semibold text-secondary mb-3">キープレイヤー</h4>
        <div class="space-y-2">
          ${getKeyPlayers(team.lineup)
            .slice(0, 3)
            .map(
              player => `
            <div class="flex items-center gap-3 text-sm">
              <div class="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-mono">
                ${player.num || '?'}
              </div>
              <div>
                <div class="font-medium">${getDisplayName(player)}</div>
                <div class="text-xs text-muted">${player.position}</div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `

  return section
}

/**
 * フォーメーション別の戦術的特徴を取得
 */
function getTacticalFeatures(formation: string): string[] {
  const features: { [key: string]: string[] } = {
    '4-3-3': [
      '攻撃的なウィングプレー',
      '高い位置でのプレス',
      '中盤でのポゼッション',
      'サイドバックの積極的な上がり',
    ],
    '4-2-3-1': [
      '中盤の数的優位',
      'トップ下の創造性',
      '守備的な安定性',
      'ボールホルダーへのサポート',
    ],
    '3-5-2': [
      'ウィングバックの重要性',
      '中盤でのマンパワー',
      '3センターバックの安定性',
      'コンパクトな守備ブロック',
    ],
    '4-4-2': [
      'バランスの取れた配置',
      'サイドからの攻撃',
      '2トップの連携',
      '守備時の4-4-2ブロック',
    ],
  }

  return (
    features[formation] || [
      'カスタムフォーメーションの特徴',
      'チーム独自の戦術',
    ]
  )
}

/**
 * キープレイヤーを特定
 */
function getKeyPlayers(lineup: any[]): any[] {
  // キャプテンやスター選手を特定するロジック
  // ここでは簡易的に背番号や統計から判定
  return [...lineup].sort((a, b) => {
    const scoreA = (a.stats?.goals || 0) + (a.stats?.assists || 0) * 0.5
    const scoreB = (b.stats?.goals || 0) + (b.stats?.assists || 0) * 0.5
    return scoreB - scoreA
  })
}

/**
 * ピッチビューの切り替え機能
 */
export function addPitchViewToggle(container: HTMLElement): void {
  const toggleButton = document.createElement('button')
  toggleButton.className = 'btn btn-secondary mb-4'
  toggleButton.textContent = 'ピッチ向きを反転'

  let isFlipped = false

  toggleButton.addEventListener('click', () => {
    const pitchContainer = container.querySelector(
      '.pitch-container'
    ) as HTMLElement
    if (pitchContainer) {
      isFlipped = !isFlipped
      if (isFlipped) {
        pitchContainer.style.transform = 'rotateX(180deg)'
        toggleButton.textContent = '元の向きに戻す'
      } else {
        pitchContainer.style.transform = ''
        toggleButton.textContent = 'ピッチ向きを反転'
      }
    }
  })

  // ピッチの前に挿入
  const pitchContainer = container.querySelector('.pitch-container')
  if (pitchContainer) {
    pitchContainer.parentElement?.insertBefore(toggleButton, pitchContainer)
  }
}
