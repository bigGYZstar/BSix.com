// 概要タブ - 試合基本情報とチーム概要

import type { Fixture } from '@/types'
import { getTeamEmblem, getTeamColors } from '@/ui/emblems'

/**
 * 概要セクション描画
 */
export async function renderOverview(fixture: Fixture): Promise<HTMLElement> {
  const container = document.createElement('div')
  container.className = 'overview-section'
  
  // 試合基本情報
  const matchInfo = createMatchInfo(fixture)
  container.appendChild(matchInfo)
  
  // チーム対戦カード
  const matchupCard = createMatchupCard(fixture)
  container.appendChild(matchupCard)
  
  // チーム詳細情報
  const teamDetails = createTeamDetails(fixture)
  container.appendChild(teamDetails)
  
  return container
}

/**
 * 試合基本情報カード
 */
function createMatchInfo(fixture: Fixture): HTMLElement {
  const card = document.createElement('div')
  card.className = 'card mb-6'
  
  // 日時フォーマット
  const matchDate = new Date(fixture.dateJST)
  const dateStr = matchDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
  const timeStr = matchDate.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  card.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">試合情報</h2>
      <div class="card-subtitle">${fixture.league} ${fixture.round}</div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-secondary">日時:</span>
          <div>
            <div class="font-medium">${dateStr}</div>
            <div class="text-sm text-muted">${timeStr} キックオフ</div>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-secondary">会場:</span>
          <span class="font-medium">${fixture.venue}</span>
        </div>
      </div>
      
      ${fixture.weather ? `
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-secondary">天候:</span>
            <div>
              <div class="font-medium">${fixture.weather.condition || '不明'}</div>
              ${fixture.weather.temperature ? `<div class="text-sm text-muted">${fixture.weather.temperature}°C</div>` : ''}
            </div>
          </div>
          
          ${fixture.referee ? `
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-secondary">主審:</span>
              <span class="font-medium">${fixture.referee.main || '未定'}</span>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `
  
  return card
}

/**
 * チーム対戦カード
 */
function createMatchupCard(fixture: Fixture): HTMLElement {
  const card = document.createElement('div')
  card.className = 'card mb-6'
  
  const homeEmblem = getTeamEmblem(fixture.home.teamId, 80)
  const awayEmblem = getTeamEmblem(fixture.away.teamId, 80)
  
  card.innerHTML = `
    <div class="text-center py-8">
      <div class="flex items-center justify-center gap-8 mb-6">
        <!-- ホームチーム -->
        <div class="flex flex-col items-center flex-1">
          <div class="mb-4">${homeEmblem}</div>
          <h3 class="text-xl font-bold mb-2">${fixture.home.name}</h3>
          <div class="text-sm text-muted">${fixture.home.key}</div>
          <div class="text-xs text-muted mt-1">ホーム</div>
        </div>
        
        <!-- VS -->
        <div class="flex flex-col items-center">
          <div class="text-2xl font-bold text-primary mb-2">VS</div>
          <div class="text-xs text-muted">${fixture.league}</div>
        </div>
        
        <!-- アウェイチーム -->
        <div class="flex flex-col items-center flex-1">
          <div class="mb-4">${awayEmblem}</div>
          <h3 class="text-xl font-bold mb-2">${fixture.away.name}</h3>
          <div class="text-sm text-muted">${fixture.away.key}</div>
          <div class="text-xs text-muted mt-1">アウェイ</div>
        </div>
      </div>
      
      <!-- フォーメーション情報 -->
      <div class="flex justify-center gap-8 text-sm">
        <div class="text-center">
          <div class="font-semibold text-secondary">フォーメーション</div>
          <div class="font-mono text-lg">${fixture.home.formation}</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-secondary">フォーメーション</div>
          <div class="font-mono text-lg">${fixture.away.formation}</div>
        </div>
      </div>
    </div>
  `
  
  return card
}

/**
 * チーム詳細情報
 */
function createTeamDetails(fixture: Fixture): HTMLElement {
  const container = document.createElement('div')
  container.className = 'grid grid-cols-1 lg:grid-cols-2 gap-6'
  
  // ホームチーム詳細
  const homeCard = createTeamCard(fixture.home, 'ホーム')
  container.appendChild(homeCard)
  
  // アウェイチーム詳細
  const awayCard = createTeamCard(fixture.away, 'アウェイ')
  container.appendChild(awayCard)
  
  return container
}

/**
 * 個別チームカード
 */
function createTeamCard(team: any, label: string): HTMLElement {
  const card = document.createElement('div')
  card.className = 'card'
  
  const colors = getTeamColors(team.teamId)
  
  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title flex items-center gap-3">
        ${getTeamEmblem(team.teamId, 32)}
        ${team.name} (${label})
      </h3>
      <div class="card-subtitle">フォーメーション: ${team.formation}</div>
    </div>
    
    <!-- チーム評価 -->
    ${team.eval ? `
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-secondary mb-3">チーム評価</h4>
        <div class="grid grid-cols-3 gap-4 mb-4">
          ${team.eval.攻撃力 ? `
            <div class="text-center">
              <div class="text-lg font-bold" style="color: ${colors.primary}">${team.eval.攻撃力}</div>
              <div class="text-xs text-muted">攻撃力</div>
            </div>
          ` : ''}
          ${team.eval.守備力 ? `
            <div class="text-center">
              <div class="text-lg font-bold" style="color: ${colors.primary}">${team.eval.守備力}</div>
              <div class="text-xs text-muted">守備力</div>
            </div>
          ` : ''}
          ${team.eval.総合力 ? `
            <div class="text-center">
              <div class="text-lg font-bold" style="color: ${colors.primary}">${team.eval.総合力}</div>
              <div class="text-xs text-muted">総合力</div>
            </div>
          ` : ''}
        </div>
        ${team.eval.寸評 ? `
          <div class="text-sm text-muted italic">
            「${team.eval.寸評}」
          </div>
        ` : ''}
      </div>
    ` : ''}
    
    <!-- キーポイント -->
    ${team.keychips && team.keychips.length > 0 ? `
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-secondary mb-3">キーポイント</h4>
        <div class="flex flex-wrap gap-2">
          ${team.keychips.map((chip: string) => `
            <span class="inline-block px-3 py-1 text-xs font-medium bg-secondary text-inverse rounded-full">
              ${chip}
            </span>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    <!-- 最新ニュース -->
    ${team.news && team.news.length > 0 ? `
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-secondary mb-3">最新ニュース</h4>
        <ul class="space-y-2">
          ${team.news.map((news: string) => `
            <li class="flex items-start gap-2 text-sm">
              <span class="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>${news}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
    
    <!-- ハイライト -->
    ${team.highlights && team.highlights.length > 0 ? `
      <div>
        <h4 class="text-sm font-semibold text-secondary mb-3">注目ポイント</h4>
        <ul class="space-y-2">
          ${team.highlights.map((highlight: string) => `
            <li class="flex items-start gap-2 text-sm">
              <span class="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style="background-color: ${colors.primary}"></span>
              <span>${highlight}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
  `
  
  return card
}

/**
 * 試合予測セクション（将来拡張用）
 */
export function createPredictionSection(): HTMLElement {
  const section = document.createElement('div')
  section.className = 'card mt-6'
  
  section.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">試合予測</h3>
      <div class="card-subtitle">データ分析に基づく予測</div>
    </div>
    
    <div class="text-center py-8">
      <div class="text-muted">
        予測機能は今後のアップデートで追加予定です
      </div>
    </div>
  `
  
  return section
}