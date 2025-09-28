// 似顔絵SVGジェネレーター

import type { Player } from '@/types/generated/player.schema'

export interface AvatarConfig {
  skin?: 'light' | 'medium' | 'dark' | 'tan';
  hair?: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'bald';
  style?: 'short' | 'buzz' | 'curly' | 'long' | 'bald';

  size?: number;
}

/**
 * 肌色の定義
 */
const SKIN_COLORS = {
  light: '#fdbcb4',
  medium: '#e8ae82',
  dark: '#d08b5b',
  tan: '#c68642',
} as const

/**
 * 髪色の定義
 */
const HAIR_COLORS = {
  black: '#2c1810',
  brown: '#8b4513',
  blonde: '#daa520',
  red: '#a0522d',
  gray: '#808080',
  bald: 'none',
} as const

/**
 * 選手からアバター設定を取得（デフォルト値付き）
 */
export function getAvatarConfig(player: Player): AvatarConfig {
  const deterministicAvatar = generateDeterministicAvatar(player.name);
  return {
    skin: deterministicAvatar.skin,
    hair: deterministicAvatar.hair,
    style: deterministicAvatar.style,
    size: 80,
  }
}

/**
 * 似顔絵SVGを生成
 */
export function generateFaceSVG(config: AvatarConfig): string {
  const size = config.size || 80
  const skinColor = SKIN_COLORS[config.skin || 'medium']
  const hairColor = HAIR_COLORS[config.hair || 'brown']
  const hairStyle = config.style || 'short'

  const centerX = size / 2
  const centerY = size / 2

  // 顔の基本サイズ
  const faceRadius = size * 0.35
  const eyeY = centerY - size * 0.1
  const eyeSize = size * 0.06
  const eyeSpacing = size * 0.12

  return `
    <svg 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 ${size} ${size}" 
      xmlns="http://www.w3.org/2000/svg"
      style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe)"
    >
      <!-- 顔の輪郭 -->
      <ellipse 
        cx="${centerX}" 
        cy="${centerY}" 
        rx="${faceRadius}" 
        ry="${faceRadius * 1.1}" 
        fill="${skinColor}" 
        stroke="#d4a574" 
        stroke-width="1"
      />
      
      <!-- 髪 -->
      ${generateHairSVG(centerX, centerY, size, hairColor, hairStyle)}
      
      <!-- 目 -->
      <ellipse 
        cx="${centerX - eyeSpacing}" 
        cy="${eyeY}" 
        rx="${eyeSize}" 
        ry="${eyeSize * 0.7}" 
        fill="white"
      />
      <ellipse 
        cx="${centerX + eyeSpacing}" 
        cy="${eyeY}" 
        rx="${eyeSize}" 
        ry="${eyeSize * 0.7}" 
        fill="white"
      />
      
      <!-- 瞳 -->
      <circle 
        cx="${centerX - eyeSpacing}" 
        cy="${eyeY}" 
        r="${eyeSize * 0.5}" 
        fill="#2563eb"
      />
      <circle 
        cx="${centerX + eyeSpacing}" 
        cy="${eyeY}" 
        r="${eyeSize * 0.5}" 
        fill="#2563eb"
      />
      
      <!-- ハイライト -->
      <circle 
        cx="${centerX - eyeSpacing - eyeSize * 0.2}" 
        cy="${eyeY - eyeSize * 0.2}" 
        r="${eyeSize * 0.2}" 
        fill="white"
      />
      <circle 
        cx="${centerX + eyeSpacing - eyeSize * 0.2}" 
        cy="${eyeY - eyeSize * 0.2}" 
        r="${eyeSize * 0.2}" 
        fill="white"
      />
      
      <!-- 鼻 -->
      <ellipse 
        cx="${centerX}" 
        cy="${centerY + size * 0.05}" 
        rx="${size * 0.02}" 
        ry="${size * 0.04}" 
        fill="${adjustBrightness(skinColor, -0.1)}"
      />
      
      <!-- 口 -->
      <path 
        d="M ${centerX - size * 0.08} ${centerY + size * 0.15} 
           Q ${centerX} ${centerY + size * 0.18} 
           ${centerX + size * 0.08} ${centerY + size * 0.15}"
        stroke="#8b4513" 
        stroke-width="2" 
        fill="none"
        stroke-linecap="round"
      />
      
      <!-- 眉毛 -->
      <path 
        d="M ${centerX - eyeSpacing - eyeSize} ${eyeY - size * 0.08} 
           L ${centerX - eyeSpacing + eyeSize} ${eyeY - size * 0.06}"
        stroke="${hairColor === 'none' ? '#8b4513' : hairColor}" 
        stroke-width="3" 
        stroke-linecap="round"
      />
      <path 
        d="M ${centerX + eyeSpacing - eyeSize} ${eyeY - size * 0.06} 
           L ${centerX + eyeSpacing + eyeSize} ${eyeY - size * 0.08}"
        stroke="${hairColor === 'none' ? '#8b4513' : hairColor}" 
        stroke-width="3" 
        stroke-linecap="round"
      />
    </svg>
  `.trim()
}

/**
 * 髪型別のSVGを生成
 */
function generateHairSVG(
  centerX: number,
  centerY: number,
  size: number,
  hairColor: string,
  style: string
): string {
  if (hairColor === 'none' || style === 'bald') {
    return '' // ハゲの場合は髪なし
  }

  const faceRadius = size * 0.35

  switch (style) {
    case 'buzz':
      return `
        <ellipse 
          cx="${centerX}" 
          cy="${centerY - size * 0.05}" 
          rx="${faceRadius * 0.9}" 
          ry="${faceRadius * 0.8}" 
          fill="${hairColor}"
        />
      `

    case 'curly':
      return `
        <ellipse 
          cx="${centerX}" 
          cy="${centerY - size * 0.1}" 
          rx="${faceRadius * 1.1}" 
          ry="${faceRadius * 0.9}" 
          fill="${hairColor}"
        />
        <circle cx="${centerX - faceRadius * 0.7}" cy="${centerY - size * 0.15}" r="${size * 0.08}" fill="${hairColor}" />
        <circle cx="${centerX + faceRadius * 0.7}" cy="${centerY - size * 0.15}" r="${size * 0.08}" fill="${hairColor}" />
        <circle cx="${centerX - faceRadius * 0.4}" cy="${centerY - size * 0.2}" r="${size * 0.06}" fill="${hairColor}" />
        <circle cx="${centerX + faceRadius * 0.4}" cy="${centerY - size * 0.2}" r="${size * 0.06}" fill="${hairColor}" />
      `

    case 'long':
      return `
        <ellipse 
          cx="${centerX}" 
          cy="${centerY - size * 0.08}" 
          rx="${faceRadius * 1.2}" 
          ry="${faceRadius * 1.1}" 
          fill="${hairColor}"
        />
        <ellipse 
          cx="${centerX - faceRadius}" 
          cy="${centerY + size * 0.1}" 
          rx="${size * 0.15}" 
          ry="${size * 0.3}" 
          fill="${hairColor}"
        />
        <ellipse 
          cx="${centerX + faceRadius}" 
          cy="${centerY + size * 0.1}" 
          rx="${size * 0.15}" 
          ry="${size * 0.3}" 
          fill="${hairColor}"
        />
      `

    case 'short':
    default:
      return `
        <ellipse 
          cx="${centerX}" 
          cy="${centerY - size * 0.08}" 
          rx="${faceRadius}" 
          ry="${faceRadius * 0.85}" 
          fill="${hairColor}"
        />
      `
  }
}

/**
 * 色の明度を調整
 */
function adjustBrightness(color: string, factor: number): string {
  // 16進数カラーコードから RGB に変換
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // 明度調整
  const adjustedR = Math.max(0, Math.min(255, r + r * factor))
  const adjustedG = Math.max(0, Math.min(255, g + g * factor))
  const adjustedB = Math.max(0, Math.min(255, b + b * factor))

  // 16進数に戻す
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`
}

/**
 * ランダムなアバター設定を生成
 */
export function generateRandomAvatar(): AvatarConfig {
  const skins: AvatarConfig['skin'][] = ['light', 'medium', 'dark', 'tan']
  const hairs: AvatarConfig['hair'][] = [
    'black',
    'brown',
    'blonde',
    'red',
    'gray',
  ]
  const styles: AvatarConfig['style'][] = ['short', 'buzz', 'curly', 'long']

  return {
    skin: skins[Math.floor(Math.random() * skins.length)],
    hair: hairs[Math.floor(Math.random() * hairs.length)],
    style: styles[Math.floor(Math.random() * styles.length)],
  }
}

/**
 * 選手名から決定論的にアバターを生成（同じ名前なら同じアバター）
 */
export function generateDeterministicAvatar(playerName: string): AvatarConfig {
  // 名前から簡単なハッシュを生成
  let hash = 0
  for (let i = 0; i < playerName.length; i++) {
    const char = playerName.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 32bit integer
  }

  const skins: AvatarConfig['skin'][] = ['light', 'medium', 'dark', 'tan']
  const hairs: AvatarConfig['hair'][] = [
    'black',
    'brown',
    'blonde',
    'red',
    'gray',
  ]
  const styles: AvatarConfig['style'][] = ['short', 'buzz', 'curly', 'long']

  return {
    skin: skins[Math.abs(hash) % skins.length],
    hair: hairs[Math.abs(hash >> 8) % hairs.length],
    style: styles[Math.abs(hash >> 16) % styles.length],
  }
}

/**
 * SVG文字列をData URLに変換
 */
export function svgToDataUrl(svgString: string): string {
  const base64 = btoa(
    encodeURIComponent(svgString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  )
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * 選手のアバターを取得（実画像優先、なければ生成）
 */
export function getPlayerAvatar(player: Player, size: number = 80): string {
  // 実画像がある場合はそれを使用
  if (player.photoUrl && typeof player.photoUrl === 'string') {
    return player.photoUrl
  }

  // アバター設定から生成
  const config = { ...getAvatarConfig(player), size }
  return svgToDataUrl(generateFaceSVG(config))
}
