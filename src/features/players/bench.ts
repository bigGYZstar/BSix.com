// ベンチの正規化 - 文字→オブジェクト、JP表記/仮ポジ/アバター付与

import type { Player, NameOverrides, AvatarGuess } from '@/types'
import { generateDeterministicAvatar } from '@/ui/avatar'

/**
 * ベンチの文字列選手を正規化してPlayerオブジェクトに変換
 */
export function normalizeBenchPlayers(
  bench: (string | Player)[],
  nameOverrides?: NameOverrides,
  avatarGuess?: AvatarGuess
): Player[] {
  return bench.map(item => {
    if (typeof item === 'string') {
      return normalizeStringPlayer(item, nameOverrides, avatarGuess)
    }
    return item // すでにPlayerオブジェクト
  })
}

/**
 * 文字列選手名をPlayerオブジェクトに変換
 */
function normalizeStringPlayer(
  playerName: string,
  nameOverrides?: NameOverrides,
  avatarGuess?: AvatarGuess
): Player {
  const trimmedName = playerName.trim()

  // 日本語名を取得（オーバーライドから）
  const japanseName = nameOverrides?.[trimmedName] || trimmedName

  // ポジションを推測
  const guessedPosition = guessPosition(trimmedName)

  // アバターを推測
  const guessedAvatar =
    avatarGuess?.[trimmedName] || generateDeterministicAvatar(trimmedName)

  return {
    jp: japanseName,
    intl: trimmedName,
    pos: guessedPosition,
    avatar: guessedAvatar,
    stats: {
      apps: 0,
      goals: 0,
      assists: 0,
    },
  }
}

/**
 * 選手名からポジションを推測
 * 簡単なヒューリスティック（完璧ではない）
 */
function guessPosition(playerName: string): string {
  const name = playerName.toLowerCase()

  // GK の判定
  if (
    name.includes('keeper') ||
    name.includes('ramsdale') ||
    name.includes('meslier') ||
    name.includes('leno') ||
    name.includes('turner')
  ) {
    return 'GK'
  }

  // 既知の選手名からの推測
  const positionMap: { [key: string]: string } = {
    // Arsenal
    'aaron ramsdale': 'GK',
    'takehiro tomiyasu': 'RB',
    'jakub kiwior': 'CB',
    'kieran tierney': 'LB',
    jorginho: 'CM',
    'fabio vieira': 'AM',
    'leandro trossard': 'LW',
    'gabriel jesus': 'ST',
    'eddie nketiah': 'ST',
    'emile smith rowe': 'AM',
    'mohamed elneny': 'CM',

    // Leeds
    'sam byram': 'RB',
    'archie gray': 'CM',
    'charlie cresswell': 'CB',
    'wilfried gnonto': 'LW',
    'joel piroe': 'ST',
    'georginio rutter': 'AM',
    'mateo joseph': 'ST',
    'max wober': 'CB',
    'tyler adams': 'DM',
  }

  const knownPosition = positionMap[name]
  if (knownPosition) {
    return knownPosition
  }

  // デフォルト推測（名前の特徴から）
  if (name.includes('son') || name.includes('joseph')) {
    return 'ST' // よくある名前のパターン
  }

  if (name.includes('gray') || name.includes('smith')) {
    return 'CM' // 中盤っぽい名前
  }

  // フォールバック
  return 'SUB' // 控え選手の汎用ポジション
}

/**
 * ベンチの表示順序を調整（ポジション別）
 */
export function sortBenchByPosition(players: Player[]): Player[] {
  const positionOrder: { [key: string]: number } = {
    GK: 1,
    CB: 2,
    LB: 3,
    RB: 4,
    DM: 5,
    CM: 6,
    AM: 7,
    LW: 8,
    RW: 9,
    ST: 10,
    SUB: 11,
  }

  return [...players].sort((a, b) => {
    const orderA = positionOrder[a.pos || 'SUB'] || 999
    const orderB = positionOrder[b.pos || 'SUB'] || 999

    if (orderA === orderB) {
      // 同じポジションなら名前順
      return (a.jp || a.intl).localeCompare(b.jp || b.intl)
    }

    return orderA - orderB
  })
}

/**
 * ベンチ選手のスタッツを推測（簡易版）
 */
export function guessPlayerStats(player: Player): Player {
  if (player.stats && Object.keys(player.stats).length > 0) {
    return player // すでにスタッツがある
  }

  // ポジションベースの基本スタッツ
  let baseStats = { apps: 0, goals: 0, assists: 0 }

  switch (player.pos) {
    case 'GK':
      baseStats = { apps: 10, goals: 0, assists: 0 }
      break
    case 'CB':
    case 'LB':
    case 'RB':
      baseStats = { apps: 15, goals: 1, assists: 2 }
      break
    case 'DM':
    case 'CM':
      baseStats = { apps: 20, goals: 2, assists: 3 }
      break
    case 'AM':
    case 'LW':
    case 'RW':
      baseStats = { apps: 18, goals: 4, assists: 6 }
      break
    case 'ST':
      baseStats = { apps: 16, goals: 6, assists: 2 }
      break
    default:
      baseStats = { apps: 8, goals: 1, assists: 1 }
  }

  return {
    ...player,
    stats: baseStats,
  }
}

/**
 * オーバーライドデータを読み込み
 */
export async function loadOverrides(): Promise<{
  nameOverrides: NameOverrides
  avatarGuess: AvatarGuess
}> {
  try {
    const [nameResponse, avatarResponse] = await Promise.all([
      fetch('/src/data/overrides/jp-name-overrides.json'),
      fetch('/src/data/overrides/avatar-guess.json'),
    ])

    const nameOverrides = await nameResponse.json()
    const avatarGuess = await avatarResponse.json()

    return { nameOverrides, avatarGuess }
  } catch (error) {
    console.warn('Failed to load overrides:', error)
    return { nameOverrides: {}, avatarGuess: {} }
  }
}

/**
 * チーム全体のベンチを正規化（外部APIとして使用）
 */
export async function normalizeBench(
  bench: (string | Player)[]
): Promise<Player[]> {
  const { nameOverrides, avatarGuess } = await loadOverrides()

  const normalizedPlayers = normalizeBenchPlayers(
    bench,
    nameOverrides,
    avatarGuess
  )

  // スタッツ推測を適用
  const playersWithStats = normalizedPlayers.map(player =>
    guessPlayerStats(player)
  )

  // ポジション順でソート
  return sortBenchByPosition(playersWithStats)
}

/**
 * ベンチ選手の検索・フィルタリング
 */
export function filterBenchPlayers(players: Player[], query: string): Player[] {
  if (!query.trim()) {
    return players
  }

  const searchQuery = query.toLowerCase().trim()

  return players.filter(player => {
    const searchableText = [player.jp, player.intl, player.pos]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(searchQuery)
  })
}

/**
 * ベンチ選手の統計情報を取得
 */
export function getBenchStats(players: Player[]): {
  totalPlayers: number
  byPosition: { [position: string]: number }
  averageApps: number
  totalGoals: number
} {
  const byPosition: { [position: string]: number } = {}
  let totalApps = 0
  let totalGoals = 0

  players.forEach(player => {
    const pos = player.pos || 'Unknown'
    byPosition[pos] = (byPosition[pos] || 0) + 1

    totalApps += player.stats?.apps || 0
    totalGoals += player.stats?.goals || 0
  })

  return {
    totalPlayers: players.length,
    byPosition,
    averageApps:
      players.length > 0 ? Math.round(totalApps / players.length) : 0,
    totalGoals,
  }
}
