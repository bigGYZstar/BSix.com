// チームエンブレム簡略SVG

/**
 * Arsenal エンブレム（簡略版）
 */
export function getArsenalEmblem(size: number = 40): string {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景（赤） -->
      <circle cx="50" cy="50" r="48" fill="var(--team-ars)" stroke="var(--team-ars-secondary)" stroke-width="2"/>
      
      <!-- 大砲（簡略化） -->
      <rect x="25" y="45" width="50" height="8" rx="4" fill="var(--team-ars-secondary)"/>
      <circle cx="30" cy="49" r="6" fill="var(--team-ars-secondary)"/>
      <circle cx="70" cy="49" r="4" fill="var(--team-ars-secondary)"/>
      
      <!-- 装飾線 -->
      <path d="M 20 35 Q 50 25 80 35" stroke="var(--team-ars-secondary)" stroke-width="2" fill="none"/>
      <path d="M 20 65 Q 50 75 80 65" stroke="var(--team-ars-secondary)" stroke-width="2" fill="none"/>
      
      <!-- 中央のディテール -->
      <circle cx="50" cy="49" r="3" fill="var(--team-ars)"/>
      
      <text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="var(--team-ars-secondary)">ARS</text>
    </svg>
  `.trim()
}

/**
 * Leeds United エンブレム（簡略版）
 */
export function getLeedsEmblem(size: number = 40): string {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景（白） -->
      <circle cx="50" cy="50" r="48" fill="var(--team-lee)" stroke="var(--team-lee-secondary)" stroke-width="3"/>
      
      <!-- 内側の青いサークル -->
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--team-lee-secondary)" stroke-width="2"/>
      
      <!-- ローズ（薔薇）のシンボル（簡略化） -->
      <circle cx="50" cy="40" r="8" fill="var(--team-lee-secondary)"/>
      <circle cx="45" cy="48" r="5" fill="var(--team-lee-secondary)"/>
      <circle cx="55" cy="48" r="5" fill="var(--team-lee-secondary)"/>
      <circle cx="50" cy="55" r="6" fill="var(--team-lee-secondary)"/>
      
      <!-- 茎 -->
      <rect x="48" y="55" width="4" height="15" fill="var(--team-lee-secondary)"/>
      
      <!-- 葉 -->
      <ellipse cx="42" cy="62" rx="4" ry="2" fill="var(--team-lee-secondary)" transform="rotate(-30 42 62)"/>
      <ellipse cx="58" cy="62" rx="4" ry="2" fill="var(--team-lee-secondary)" transform="rotate(30 58 62)"/>
      
      <text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="var(--team-lee-secondary)">LEE</text>
    </svg>
  `.trim()
}

/**
 * 一般的なフットボール エンブレム（デフォルト）
 */
export function getDefaultEmblem(
  size: number = 40,
  teamKey: string = 'TM'
): string {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景 -->
      <circle cx="50" cy="50" r="48" fill="var(--color-primary)" stroke="var(--color-bg)" stroke-width="2"/>
      
      <!-- サッカーボール -->
      <circle cx="50" cy="45" r="18" fill="var(--color-bg)" stroke="var(--color-text-main)" stroke-width="2"/>
      
      <!-- ボールのパターン -->
      <polygon points="50,30 58,38 54,48 46,48 42,38" fill="var(--color-text-main)"/>
      <polygon points="50,60 42,52 46,42 54,42 58,52" fill="var(--color-text-main)"/>
      
      <!-- チーム名 -->
      <text x="50" y="80" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="var(--color-bg)">${teamKey}</text>
    </svg>
  `.trim()
}

/**
 * チームIDからエンブレムを取得
 */
export function getTeamEmblem(teamId: string, size: number = 40): string {
  switch (teamId.toLowerCase()) {
    case 'ars':
    case 'arsenal':
      return getArsenalEmblem(size)

    case 'lee':
    case 'leeds':
      return getLeedsEmblem(size)

    default:
      return getDefaultEmblem(size, teamId.toUpperCase().slice(0, 3))
  }
}

/**
 * チームカラー情報を取得
 */
export function getTeamColors(teamId: string): {
  primary: string
  secondary: string
  cssClass: string
} {
  switch (teamId.toLowerCase()) {
    case 'ars':
    case 'arsenal':
      return {
        primary: 'var(--team-ars)',
        secondary: 'var(--team-ars-secondary)',
        cssClass: 'team-ars',
      }

    case 'lee':
    case 'leeds':
      return {
        primary: 'var(--team-lee)',
        secondary: 'var(--team-lee-secondary)',
        cssClass: 'team-lee',
      }

    default:
      return {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-bg)',
        cssClass: 'team-default',
      }
  }
}

/**
 * SVGエンブレムをData URLに変換
 */
export function emblemToDataUrl(svgString: string): string {
  const base64 = btoa(
    encodeURIComponent(svgString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  )
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * 小さなチームアイコン（ピル用）
 */
export function getTeamIcon(teamId: string, size: number = 20): string {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.2"/>
      <text x="10" y="14" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="currentColor">
        ${teamId.toUpperCase().slice(0, 2)}
      </text>
    </svg>
  `.trim()
}

/**
 * 勝利予測などの統計表示用チャート
 */
export function getStatsChart(
  values: number[],
  _labels: string[],
  size: number = 100
): string {
  const maxValue = Math.max(...values)
  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.35

  // レーダーチャート風の表示
  const points = values
    .map((value, index) => {
      const angle = (index * 2 * Math.PI) / values.length - Math.PI / 2
      const normalizedValue = (value / maxValue) * radius
      const x = centerX + Math.cos(angle) * normalizedValue
      const y = centerY + Math.sin(angle) * normalizedValue
      return `${x},${y}`
    })
    .join(' ')

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景グリッド -->
      <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.2}" fill="none" stroke="var(--color-border)" stroke-width="1" opacity="0.3"/>
      <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.5}" fill="none" stroke="var(--color-border)" stroke-width="1" opacity="0.3"/>
      <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.8}" fill="none" stroke="var(--color-border)" stroke-width="1" opacity="0.3"/>
      
      <!-- データエリア -->
      <polygon points="${points}" fill="var(--color-primary)" fill-opacity="0.3" stroke="var(--color-primary)" stroke-width="2"/>
      
      <!-- データポイント -->
      ${values
        .map((value, index) => {
          const angle = (index * 2 * Math.PI) / values.length - Math.PI / 2
          const normalizedValue = (value / maxValue) * radius
          const x = centerX + Math.cos(angle) * normalizedValue
          const y = centerY + Math.sin(angle) * normalizedValue
          return `<circle cx="${x}" cy="${y}" r="3" fill="var(--color-primary)"/>`
        })
        .join('')}
    </svg>
  `.trim()
}

/**
 * チーム名の表示用ロゴタイプ
 */
export function getTeamLogotype(teamName: string, size: number = 100): string {
  const fontSize = Math.min((size / teamName.length) * 1.5, size / 4)

  return `
    <svg width="${size * 3}" height="${size}" viewBox="0 0 ${size * 3} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--color-primary)"/>
          <stop offset="100%" stop-color="var(--color-secondary)"/>
        </linearGradient>
      </defs>
      
      <text 
        x="${size * 1.5}" 
        y="${size / 2 + fontSize / 3}" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="url(#textGradient)"
      >
        ${teamName}
      </text>
    </svg>
  `.trim()
}
