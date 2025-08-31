// 戦術タブ - チーム戦術分析と比較

import type { Fixture } from '@/types'
import { getFormationDescription } from '@/features/pitch/formation'
import { getTeamColors, getTeamEmblem, getStatsChart } from '@/ui/emblems'

/**
 * 戦術セクション描画
 */
export async function renderTactics(fixture: Fixture): Promise<HTMLElement> {
  const container = document.createElement('div')
  container.className = 'tactics-section'
  
  // セクションヘッダー
  const header = createSectionHeader()
  container.appendChild(header)
  
  // 戦術比較
  const comparison = createTacticalComparison(fixture)
  container.appendChild(comparison)
  
  // 個別チーム分析
  const analysis = createTeamAnalysis(fixture)
  container.appendChild(analysis)
  
  // 予想される展開
  const scenarios = createMatchScenarios(fixture)
  container.appendChild(scenarios)
  
  return container
}

/**
 * セクションヘッダー
 */
function createSectionHeader(): HTMLElement {
  const header = document.createElement('div')
  header.className = 'text-center mb-8'
  
  header.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">戦術分析</h2>
    <p class="text-muted">両チームの戦術的特徴と予想される展開</p>
  `
  
  return header
}

/**
 * 戦術比較セクション
 */
function createTacticalComparison(fixture: Fixture): HTMLElement {
  const section = document.createElement('div')
  section.className = 'card mb-8'
  
  section.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">戦術比較</h3>
      <div class="card-subtitle">フォーメーションとスタイルの対比</div>
    </div>
  `
  
  // 比較テーブル
  const comparison = createComparisonTable(fixture)
  section.appendChild(comparison)
  
  // チーム能力レーダーチャート
  const charts = createCapabilityCharts(fixture)
  section.appendChild(charts)
  
  return section
}

/**
 * 比較テーブル
 */
function createComparisonTable(fixture: Fixture): HTMLElement {
  const table = document.createElement('div')
  table.className = 'overflow-x-auto mb-6'
  
  const homeColors = getTeamColors(fixture.home.teamId)
  const awayColors = getTeamColors(fixture.away.teamId)
  
  table.innerHTML = `
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="text-left py-3 px-4" style="color: ${homeColors.primary}">
            ${fixture.home.name}
          </th>
          <th class="text-center py-3 px-4 text-muted">項目</th>
          <th class="text-right py-3 px-4" style="color: ${awayColors.primary}">
            ${fixture.away.name}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr>
          <td class="py-3 px-4 font-mono font-bold">${fixture.home.formation}</td>
          <td class="py-3 px-4 text-center text-muted">フォーメーション</td>
          <td class="py-3 px-4 text-right font-mono font-bold">${fixture.away.formation}</td>
        </tr>
        <tr>
          <td class="py-3 px-4">
            ${getFormationDescription(fixture.home.formation)}
          </td>
          <td class="py-3 px-4 text-center text-muted">戦術的特徴</td>
          <td class="py-3 px-4 text-right">
            ${getFormationDescription(fixture.away.formation)}
          </td>
        </tr>
        ${fixture.home.eval && fixture.away.eval ? `
          <tr>
            <td class="py-3 px-4 font-bold text-lg">${fixture.home.eval.攻撃力 || '-'}</td>
            <td class="py-3 px-4 text-center text-muted">攻撃力</td>
            <td class="py-3 px-4 text-right font-bold text-lg">${fixture.away.eval.攻撃力 || '-'}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-bold text-lg">${fixture.home.eval.守備力 || '-'}</td>
            <td class="py-3 px-4 text-center text-muted">守備力</td>
            <td class="py-3 px-4 text-right font-bold text-lg">${fixture.away.eval.守備力 || '-'}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-bold text-lg">${fixture.home.eval.総合力 || '-'}</td>
            <td class="py-3 px-4 text-center text-muted">総合力</td>
            <td class="py-3 px-4 text-right font-bold text-lg">${fixture.away.eval.総合力 || '-'}</td>
          </tr>
        ` : ''}
      </tbody>
    </table>
  `
  
  return table
}

/**
 * 能力チャート
 */
function createCapabilityCharts(fixture: Fixture): HTMLElement {
  const container = document.createElement('div')
  container.className = 'grid grid-cols-1 md:grid-cols-2 gap-6'
  
  // ホームチームチャート
  if (fixture.home.eval) {
    const homeChart = createTeamChart(fixture.home)
    container.appendChild(homeChart)
  }
  
  // アウェイチームチャート
  if (fixture.away.eval) {
    const awayChart = createTeamChart(fixture.away)
    container.appendChild(awayChart)
  }
  
  return container
}

/**
 * 個別チームチャート
 */
function createTeamChart(team: any): HTMLElement {
  const card = document.createElement('div')
  card.className = 'text-center'
  
  const colors = getTeamColors(team.teamId)
  
  // チャート用データ
  const stats = team.eval
  const values = [
    stats.攻撃力 || 5,
    stats.守備力 || 5,
    stats.総合力 || 5,
    7, // 経験値（仮）
    6  // フィジカル（仮）
  ]
  const labels = ['攻撃', '守備', '総合', '経験', 'フィジカル']
  
  const chart = getStatsChart(values, labels, 120)
  
  card.innerHTML = `
    <div class="flex items-center justify-center gap-3 mb-4">
      ${getTeamEmblem(team.teamId, 32)}
      <h4 class="font-semibold" style="color: ${colors.primary}">${team.name}</h4>
    </div>
    <div class="flex justify-center mb-3">
      ${chart}
    </div>
    <div class="text-xs text-muted">
      ${labels.join(' • ')}
    </div>
  `
  
  return card
}

/**
 * 個別チーム分析
 */
function createTeamAnalysis(fixture: Fixture): HTMLElement {
  const section = document.createElement('div')
  section.className = 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'
  
  // ホームチーム分析
  const homeAnalysis = createTeamAnalysisCard(fixture.home, 'ホーム')
  section.appendChild(homeAnalysis)
  
  // アウェイチーム分析
  const awayAnalysis = createTeamAnalysisCard(fixture.away, 'アウェイ')
  section.appendChild(awayAnalysis)
  
  return section
}

/**
 * 個別チーム分析カード
 */
function createTeamAnalysisCard(team: any, label: string): HTMLElement {
  const card = document.createElement('div')
  card.className = 'card'
  
  const colors = getTeamColors(team.teamId)
  
  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title flex items-center gap-3">
        ${getTeamEmblem(team.teamId, 32)}
        ${team.name} 戦術分析
      </h3>
      <div class="card-subtitle">${label} / ${team.formation}</div>
    </div>
    
    <!-- 戦術的強み -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-secondary mb-3">戦術的強み</h4>
      <div class="space-y-2">
        ${getTacticalStrengths(team).map(strength => `
          <div class="flex items-start gap-2 text-sm">
            <span class="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style="background-color: ${colors.primary}"></span>
            <span>${strength}</span>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- キープレイヤーの役割 -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-secondary mb-3">キープレイヤー</h4>
      <div class="space-y-3">
        ${getKeyPlayerRoles(team).map(role => `
          <div class="flex items-start gap-3 text-sm">
            <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style="background-color: ${colors.primary}">
              ${role.num}
            </div>
            <div>
              <div class="font-medium">${role.name}</div>
              <div class="text-xs text-muted">${role.role}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- 戦術的課題 -->
    ${team.eval?.寸評 ? `
      <div>
        <h4 class="text-sm font-semibold text-secondary mb-3">分析コメント</h4>
        <p class="text-sm text-muted italic">
          「${team.eval.寸評}」
        </p>
      </div>
    ` : ''}
  `
  
  return card
}

/**
 * 予想される試合展開
 */
function createMatchScenarios(fixture: Fixture): HTMLElement {
  const section = document.createElement('div')
  section.className = 'card'
  
  section.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">予想される試合展開</h3>
      <div class="card-subtitle">戦術的分析に基づく展開予想</div>
    </div>
  `
  
  const scenarios = createScenarioList(fixture)
  section.appendChild(scenarios)
  
  return section
}

/**
 * シナリオリスト
 */
function createScenarioList(fixture: Fixture): HTMLElement {
  const container = document.createElement('div')
  container.className = 'space-y-4'
  
  const scenarios = generateMatchScenarios(fixture)
  
  scenarios.forEach((scenario, index) => {
    const card = document.createElement('div')
    card.className = 'border border-border rounded-lg p-4'
    
    card.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
          ${index + 1}
        </div>
        <div>
          <h4 class="font-semibold mb-2">${scenario.title}</h4>
          <p class="text-sm text-muted mb-2">${scenario.description}</p>
          <div class="text-xs text-secondary">
            確率: <span class="font-medium">${scenario.probability}%</span>
          </div>
        </div>
      </div>
    `
    
    container.appendChild(card)
  })
  
  return container
}

// ヘルパー関数

function getTacticalStrengths(team: any): string[] {
  const formations: { [key: string]: string[] } = {
    '4-3-3': [
      'ウィングの幅を活かした攻撃',
      '高い位置からのプレッシング',
      'サイドバックのオーバーラップ'
    ],
    '4-2-3-1': [
      '中盤でのボール保持',
      'トップ下の創造性',
      '守備的な安定感'
    ],
    '3-5-2': [
      'ウィングバックの攻撃参加',
      '中盤での数的優位',
      '柔軟なフォーメーション変化'
    ]
  }
  
  return formations[team.formation] || ['チーム独自の戦術', 'バランスの取れたプレー']
}

function getKeyPlayerRoles(team: any): Array<{num: string, name: string, role: string}> {
  // 実際の実装では選手データから動的に生成
  const lineup = team.lineup || []
  
  return lineup.slice(0, 3).map((player: any) => ({
    num: player.num || '?',
    name: player.jp || player.intl,
    role: getPlayerRole(player)
  }))
}

function getPlayerRole(player: any): string {
  const roles: { [key: string]: string } = {
    'GK': 'ラストライン',
    'CB': 'ディフェンスリーダー',
    'LB': '攻撃的サイドバック',
    'RB': '攻撃的サイドバック',
    'DM': 'ゲームメーカー',
    'CM': '中盤の軸',
    'AM': '創造性の源',
    'LW': 'サイドアタッカー',
    'RW': 'サイドアタッカー',
    'ST': 'フィニッシャー'
  }
  
  return roles[player.pos] || 'キープレイヤー'
}

function generateMatchScenarios(fixture: Fixture): Array<{
  title: string,
  description: string,
  probability: number
}> {
  return [
    {
      title: 'ポゼッション主体の展開',
      description: `${fixture.home.name}がボールを握り、じっくりと攻撃を組み立てる展開。サイドチェンジを駆使してチャンスを作る。`,
      probability: 65
    },
    {
      title: 'カウンター合戦',
      description: `両チームが激しくプレスをかけ合い、ボールの奪い合いからカウンターを狙う激しい試合展開。`,
      probability: 45
    },
    {
      title: '後半の選手交代が鍵',
      description: `前半は膠着状態が続き、後半の選手交代とフォーメーション変更が勝負の分かれ目となる。`,
      probability: 70
    }
  ]
}