// データ読み込み機能

import type { Fixture, MatchesData, TeamsData, MatchInfo, TeamInfo } from '@/types'

/**
 * 試合一覧データを読み込み
 */
export async function loadMatches(): Promise<MatchInfo[]> {
  try {
    const response = await fetch('/src/data/matches.json')
    if (!response.ok) {
      throw new Error(`Failed to load matches: ${response.status}`)
    }
    const data: MatchesData = await response.json()
    return data.matches
  } catch (error) {
    console.error('Error loading matches:', error)
    throw error
  }
}

/**
 * チーム情報を読み込み
 */
export async function loadTeams(): Promise<Record<string, TeamInfo>> {
  try {
    const response = await fetch('/src/data/teams.json')
    if (!response.ok) {
      throw new Error(`Failed to load teams: ${response.status}`)
    }
    const data: TeamsData = await response.json()
    return data.teams
  } catch (error) {
    console.error('Error loading teams:', error)
    throw error
  }
}

/**
 * 特定の試合データを読み込み
 */
export async function loadFixture(dataFile: string): Promise<Fixture> {
  try {
    const response = await fetch(`/src/data/${dataFile}`)
    if (!response.ok) {
      throw new Error(`Failed to load fixture: ${response.status}`)
    }
    const fixture: Fixture = await response.json()
    return fixture
  } catch (error) {
    console.error('Error loading fixture:', error)
    throw error
  }
}

/**
 * 試合IDから試合データを読み込み
 */
export async function loadFixtureById(matchId: string, matches: MatchInfo[]): Promise<Fixture | null> {
  const match = matches.find(m => m.id === matchId)
  if (!match) {
    console.error(`Match not found: ${matchId}`)
    return null
  }

  try {
    return await loadFixture(match.dataFile)
  } catch (error) {
    console.error(`Error loading fixture for match ${matchId}:`, error)
    return null
  }
}

/**
 * ビッグシックスの試合のみをフィルタリング
 */
export function filterBigSixMatches(matches: MatchInfo[]): MatchInfo[] {
  return matches.filter(match => match.isBigSix)
}

/**
 * 今後の試合をフィルタリング（現在時刻以降）
 */
export function filterUpcomingMatches(matches: MatchInfo[]): MatchInfo[] {
  const now = new Date()
  return matches.filter(match => new Date(match.date) > now)
}

/**
 * 試合を日付順にソート
 */
export function sortMatchesByDate(matches: MatchInfo[]): MatchInfo[] {
  return [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * 日付をフォーマット
 */
export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo'
  }
  return date.toLocaleDateString('ja-JP', options)
}

/**
 * 試合の短縮表示用日付フォーマット
 */
export function formatMatchDateShort(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo'
  }
  return date.toLocaleDateString('ja-JP', options)
}

/**
 * チーム情報を取得
 */
export function getTeamInfo(teamId: string, teams: Record<string, TeamInfo>): TeamInfo | null {
  return teams[teamId] || null
}

/**
 * 試合のタイトルを生成
 */
export function generateMatchTitle(match: MatchInfo, teams: Record<string, TeamInfo>): string {
  const homeTeam = getTeamInfo(match.homeTeam, teams)
  const awayTeam = getTeamInfo(match.awayTeam, teams)
  
  if (!homeTeam || !awayTeam) {
    return `${match.homeTeam} vs ${match.awayTeam}`
  }
  
  return `${homeTeam.name} vs ${awayTeam.name}`
}
