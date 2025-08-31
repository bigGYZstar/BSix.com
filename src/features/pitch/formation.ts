// フォーメーション解析 - "4-3-3" → 行分割/ポジション並び替え/座標計算

import type { Player, Position, FormationData } from '@/types'

/**
 * フォーメーション文字列を解析して行ごとの選手数を取得
 * 例: "4-3-3" → [4, 3, 3]
 */
export function parseFormation(formation: string): number[] {
  return formation
    .split('-')
    .map(num => parseInt(num.trim(), 10))
    .filter(num => !isNaN(num))
}

/**
 * 選手をフォーメーションに基づいて行分割
 * GKは常に最後尾、フィールドプレーヤーを前から配置
 */
export function distributePlayersToLines(
  players: Player[],
  formation: string
): Player[][] {
  const formationNumbers = parseFormation(formation)
  const lines: Player[][] = []
  
  // GK を分離
  const gk = players.find(p => p.pos === 'GK')
  const fieldPlayers = players.filter(p => p.pos !== 'GK')
  
  if (!gk) {
    throw new Error('GK not found in lineup')
  }
  
  // 必要な選手数チェック
  const totalFieldPlayers = formationNumbers.reduce((sum, num) => sum + num, 0)
  if (fieldPlayers.length < totalFieldPlayers) {
    throw new Error(
      `Not enough field players. Need ${totalFieldPlayers}, got ${fieldPlayers.length}`
    )
  }
  
  // フィールドプレーヤーをフォーメーションに配置
  let playerIndex = 0
  for (const lineSize of formationNumbers) {
    const line: Player[] = []
    for (let i = 0; i < lineSize; i++) {
      if (playerIndex < fieldPlayers.length) {
        line.push(fieldPlayers[playerIndex])
        playerIndex++
      }
    }
    lines.push(line)
  }
  
  // GK を最後尾に追加
  lines.push([gk])
  
  return lines
}

/**
 * 各行の選手をポジションに基づいて並び替え
 */
export function sortPlayersInLine(players: Player[]): Player[] {
  // ポジションの優先順位定義
  const positionOrder: { [key: string]: number } = {
    // DF ライン
    LB: 1,
    LCB: 2,
    CB: 3,
    RCB: 4,
    RB: 5,
    LWB: 1,
    RWB: 5,
    
    // MF ライン
    LM: 1,
    LCM: 2,
    DM: 3,
    CM: 4,
    RCM: 5,
    RM: 6,
    AM: 7,
    
    // FW ライン
    LW: 1,
    LF: 2,
    CF: 3,
    ST: 4,
    RF: 5,
    RW: 6,
    
    // GK
    GK: 1
  }
  
  return [...players].sort((a, b) => {
    const orderA = positionOrder[a.pos || ''] || 999
    const orderB = positionOrder[b.pos || ''] || 999
    
    if (orderA === orderB) {
      // ポジションが同じまたは不明な場合、名前でソート
      return (a.jp || a.intl).localeCompare(b.jp || b.intl)
    }
    
    return orderA - orderB
  })
}

/**
 * ピッチ座標を計算（viewBox: 100x140）
 */
export function calculatePositions(lines: Player[][]): Position[] {
  const positions: Position[] = []
  
  // ピッチ設定（トークンから）
  const PITCH_WIDTH = 100
  const PITCH_HEIGHT = 140
  const SAFE_MARGIN = 4
  const INNER_WIDTH = PITCH_WIDTH - SAFE_MARGIN * 2
  const INNER_HEIGHT = PITCH_HEIGHT - SAFE_MARGIN * 2
  
  const totalLines = lines.length
  
  lines.forEach((line, lineIndex) => {
    // Y座標計算（上から下へ）
    const lineY = SAFE_MARGIN + (INNER_HEIGHT * (lineIndex + 0.5)) / totalLines
    
    // 各行で選手を横方向に配置
    line.forEach((_, playerIndex) => {
      let lineX: number
      
      if (line.length === 1) {
        // 1人の場合は中央
        lineX = PITCH_WIDTH / 2
      } else {
        // 複数の場合は均等配置
        const spacing = INNER_WIDTH / (line.length + 1)
        lineX = SAFE_MARGIN + spacing * (playerIndex + 1)
      }
      
      positions.push({
        x: lineX,
        y: lineY
      })
    })
  })
  
  return positions
}

/**
 * フォーメーション全体を解析してデータを返す
 */
export function analyzeFormation(
  players: Player[],
  formation: string
): FormationData {
  // 選手を行に分割
  const rawLines = distributePlayersToLines(players, formation)
  
  // 各行をソート
  const sortedLines = rawLines.map(line => sortPlayersInLine(line))
  
  // 座標を計算
  const positions = calculatePositions(sortedLines)
  
  // フラット化して位置と対応させる
  const flatPlayers: Player[] = []
  sortedLines.forEach(line => {
    flatPlayers.push(...line)
  })
  
  return {
    formation,
    lines: sortedLines,
    positions
  }
}

/**
 * 特定の選手の座標を取得
 */
export function getPlayerPosition(
  player: Player,
  formationData: FormationData
): Position | null {
  // フラット化された選手リストから該当選手を検索
  const flatPlayers: Player[] = []
  formationData.lines.forEach(line => {
    flatPlayers.push(...line)
  })
  
  const playerIndex = flatPlayers.findIndex(p => 
    p.jp === player.jp && p.intl === player.intl
  )
  
  if (playerIndex === -1) {
    return null
  }
  
  return formationData.positions[playerIndex] || null
}

/**
 * フォーメーションの妥当性をチェック
 */
export function validateFormation(
  players: Player[],
  formation: string
): { valid: boolean; error?: string } {
  try {
    const formationNumbers = parseFormation(formation)
    
    if (formationNumbers.length === 0) {
      return { valid: false, error: 'Invalid formation format' }
    }
    
    const totalFieldPlayers = formationNumbers.reduce((sum, num) => sum + num, 0)
    const gkCount = players.filter(p => p.pos === 'GK').length
    const fieldPlayerCount = players.filter(p => p.pos !== 'GK').length
    
    if (gkCount !== 1) {
      return { valid: false, error: `Need exactly 1 GK, found ${gkCount}` }
    }
    
    if (fieldPlayerCount < totalFieldPlayers) {
      return { 
        valid: false, 
        error: `Need ${totalFieldPlayers} field players, found ${fieldPlayerCount}` 
      }
    }
    
    return { valid: true }
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * よく使われるフォーメーションのプリセット
 */
export const COMMON_FORMATIONS: { [key: string]: string } = {
  '4-4-2': '4-4-2',
  '4-3-3': '4-3-3',
  '3-5-2': '3-5-2',
  '4-5-1': '4-5-1',
  '4-2-3-1': '4-2-3-1',
  '3-4-3': '3-4-3',
  '5-3-2': '5-3-2',
  '4-1-4-1': '4-1-4-1'
}

/**
 * フォーメーションの説明を取得
 */
export function getFormationDescription(formation: string): string {
  const descriptions: { [key: string]: string } = {
    '4-4-2': '伝統的なバランス型。攻守のバランスが良い',
    '4-3-3': '攻撃的フォーメーション。サイドからの攻撃が特徴',
    '3-5-2': 'ウィングバック活用型。サイドの上下動が重要',
    '4-5-1': '守備的フォーメーション。中盤で数的優位を作る',
    '4-2-3-1': '現代的バランス型。中盤の厚みと攻撃性を両立',
    '3-4-3': '攻撃重視。ハイプレスとポゼッションが特徴'
  }
  
  return descriptions[formation] || 'カスタムフォーメーション'
}