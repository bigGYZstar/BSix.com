// ピッチ描画 - viewBox=100×140に同期した描画（SVG+絶対配置）

import type { Position, FormationData } from '@/types'

import type { PlayerProfile } from '@/features/liverpoolDetail/types'
import { analyzeFormation } from './formation'
import { getDisplayName } from '../players/displayName'
import { addPlayerModalTrigger } from '@/features/players/modal'
import { getTeamColors } from '@/ui/emblems'

/**
 * ピッチ全体を描画
 */
export function renderPitch(container: HTMLElement, players: PlayerProfile[], formation: string, teamId: string = ''): void {
  // フォーメーション解析
  let formationData: FormationData

  try {
    formationData = analyzeFormation(players, formation)
  } catch (error) {
    console.error('Formation analysis failed:', error)
    // フォールバック: 簡単な配置
    formationData = createFallbackFormation(players)
  }

  // ピッチコンテナのクラスを設定
  container.classList.add("pitch-container")

  // ピッチボックス作成
  const pitchBox = document.createElement('div')
  pitchBox.className = 'pitch-box'

  // SVGピッチライン描画
  const pitchSVG = createPitchSVG()
  pitchBox.appendChild(pitchSVG)

  // 選手ノード配置
  const playerNodes = createPlayerNodes(formationData, teamId)
  playerNodes.forEach(node => pitchBox.appendChild(node))

  container.appendChild(pitchBox)

}

/**
 * ピッチのSVGライン描画
 */
function createPitchSVG(): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'pitch-svg')
  svg.setAttribute('viewBox', '0 0 100 140')
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('class', 'pitch-lines')

  // ピッチ外枠（安全マージン考慮）
  const outerRect = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  )
  outerRect.setAttribute('x', '4')
  outerRect.setAttribute('y', '4')
  outerRect.setAttribute('width', '92')
  outerRect.setAttribute('height', '132')
  outerRect.setAttribute('fill', 'none')
  outerRect.setAttribute('stroke', 'currentColor')
  outerRect.setAttribute('stroke-width', '1')
  g.appendChild(outerRect)

  // センターライン
  const centerLine = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'line'
  )
  centerLine.setAttribute('x1', '4')
  centerLine.setAttribute('y1', '70')
  centerLine.setAttribute('x2', '96')
  centerLine.setAttribute('y2', '70')
  centerLine.setAttribute('stroke', 'currentColor')
  centerLine.setAttribute('stroke-width', '1')
  g.appendChild(centerLine)

  // センターサークル
  const centerCircle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
  )
  centerCircle.setAttribute('cx', '50')
  centerCircle.setAttribute('cy', '70')
  centerCircle.setAttribute('r', '10')
  centerCircle.setAttribute('fill', 'none')
  centerCircle.setAttribute('stroke', 'currentColor')
  centerCircle.setAttribute('stroke-width', '1')
  g.appendChild(centerCircle)

  // ペナルティエリア（上）
  const penaltyTop = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  )
  penaltyTop.setAttribute('x', '20')
  penaltyTop.setAttribute('y', '4')
  penaltyTop.setAttribute('width', '60')
  penaltyTop.setAttribute('height', '18')
  penaltyTop.setAttribute('fill', 'none')
  penaltyTop.setAttribute('stroke', 'currentColor')
  penaltyTop.setAttribute('stroke-width', '1')
  g.appendChild(penaltyTop)

  // ペナルティエリア（下）
  const penaltyBottom = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  )
  penaltyBottom.setAttribute('x', '20')
  penaltyBottom.setAttribute('y', '118')
  penaltyBottom.setAttribute('width', '60')
  penaltyBottom.setAttribute('height', '18')
  penaltyBottom.setAttribute('fill', 'none')
  penaltyBottom.setAttribute('stroke', 'currentColor')
  penaltyBottom.setAttribute('stroke-width', '1')
  g.appendChild(penaltyBottom)

  // ゴールエリア（上）
  const goalTop = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  goalTop.setAttribute('x', '35')
  goalTop.setAttribute('y', '4')
  goalTop.setAttribute('width', '30')
  goalTop.setAttribute('height', '8')
  goalTop.setAttribute('fill', 'none')
  goalTop.setAttribute('stroke', 'currentColor')
  goalTop.setAttribute('stroke-width', '1')
  g.appendChild(goalTop)

  // ゴールエリア（下）
  const goalBottom = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  )
  goalBottom.setAttribute('x', '35')
  goalBottom.setAttribute('y', '128')
  goalBottom.setAttribute('width', '30')
  goalBottom.setAttribute('height', '8')
  goalBottom.setAttribute('fill', 'none')
  goalBottom.setAttribute('stroke', 'currentColor')
  goalBottom.setAttribute('stroke-width', '1')
  g.appendChild(goalBottom)

  svg.appendChild(g)
  return svg
}

/**
 * 選手ノード配置
 */
function createPlayerNodes(
  formationData: FormationData,
  teamId: string
): HTMLElement[] {
  const nodes: HTMLElement[] = []
  const teamColors = getTeamColors(teamId)

  // フラット化された選手リストを作成
  const flatPlayers: PlayerProfile[] = []
  formationData.lines.forEach(line => {
    flatPlayers.push(...line)
  })

  flatPlayers.forEach((player, index) => {
    const position = formationData.positions[index]
    if (!position) {
      return
    }

    const node = createPlayerNode(player, position, teamColors.cssClass)
    nodes.push(node)
  })

  return nodes
}

/**
 * 個別選手ノード作成
 */
function createPlayerNode(
  player: PlayerProfile,
  position: Position,
  teamClass: string
): HTMLElement {
  const node = document.createElement('div')
  node.className = `pnode ${teamClass}`

  // 絶対座標で配置
  node.style.left = `${position.x}%`
  node.style.top = `${position.y}%`
  node.style.transform = 'translate(-50%, -50%)'

  // ドット（選手マーカー）
  const dot = document.createElement('div')
  dot.className = 'dot'
  node.appendChild(dot)

  // 名前ボックス
  const nameBox = document.createElement('div')
  nameBox.className = 'namebox'
  nameBox.textContent = getDisplayName(player)
  node.appendChild(nameBox)

  // ポジション表示（オプション）
  if (player.pos !== undefined) {
    const posBox = document.createElement('div')
    posBox.className = 'pos'
    posBox.textContent = player.pos as string
    node.appendChild(posBox)
  }

  // モーダルトリガー追加
  addPlayerModalTrigger(node, player as PlayerProfile)


  return node
}

/**
 * フォールバック配置（エラー時）
 */
function createFallbackFormation(players: PlayerProfile[]): FormationData {
  // 簡単な4-4-2配置にフォールバック
  const gk = players.find(p => p.pos === 'GK') || players[0]
  const fieldPlayers = players.filter(p => p !== gk).slice(0, 10)

  const lines: PlayerProfile[][] = [
    fieldPlayers.slice(0, 4), // DF
    fieldPlayers.slice(4, 8), // MF
    fieldPlayers.slice(8, 10), // FW
    [gk], // GK
  ]

  const positions: Position[] = []

  // DF ライン
  lines[0].forEach((_, i) => {
    positions.push({
      x: 15 + (i * 70) / 3,
      y: 25,
    })
  })

  // MF ライン
  lines[1].forEach((_, i) => {
    positions.push({
      x: 15 + (i * 70) / 3,
      y: 50,
    })
  })

  // FW ライン
  lines[2].forEach((_, i) => {
    positions.push({
      x: 30 + i * 40,
      y: 75,
    })
  })

  // GK
  positions.push({
    x: 50,
    y: 10,
  })

  return {
    formation: 'フォールバック',
    lines,
    positions,
  }
}

/**
 * ピッチサイズに応じた選手ノードサイズ調整
 */
export function adjustPlayerNodeSize(container: HTMLElement): void {
  const containerWidth = container.offsetWidth
  const baseSize = Math.max(12, Math.min(20, containerWidth / 20))

  const dots = container.querySelectorAll('.dot') as NodeListOf<HTMLElement>
  const nameboxes = container.querySelectorAll(
    '.namebox'
  ) as NodeListOf<HTMLElement>

  dots.forEach(dot => {
    dot.style.width = `${baseSize}px`
    dot.style.height = `${baseSize}px`
  })

  nameboxes.forEach(namebox => {
    const fontSize = Math.max(10, baseSize * 0.7)
    namebox.style.fontSize = `${fontSize}px`
  })
}

/**
 * ピッチの向きを変更（ホーム/アウェイ対応）
 */
export function flipPitch(container: HTMLElement, flip: boolean = false): void {
  if (flip) {
    container.style.transform = 'rotateX(180deg)'
  } else {
    container.style.transform = ''
  }
}

/**
 * アニメーション付きで選手を再配置
 */
export function animatePlayerPositions(
  container: HTMLElement,
  newFormationData: FormationData,
  duration: number = 300
): void {
  const nodes = container.querySelectorAll('.pnode') as NodeListOf<HTMLElement>

  // フラット化された選手リスト
  const flatPlayers: PlayerProfile[] = []
  newFormationData.lines.forEach(line => {
    flatPlayers.push(...line)
  })

  nodes.forEach((node, index) => {
    const newPosition = newFormationData.positions[index]
    if (!newPosition) {
      return
    }

    // CSS トランジション追加
    node.style.transition = `left ${duration}ms ease, top ${duration}ms ease`

    // 新しい位置に移動
    node.style.left = `${newPosition.x}%`
    node.style.top = `${newPosition.y}%`

    // トランジション終了後にリセット
    setTimeout(() => {
      node.style.transition = ''
    }, duration)
  })
}


