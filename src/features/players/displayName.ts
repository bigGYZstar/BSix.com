// 選手名表示ロジック - 姓のみ/短い和名はフル表示

import type { PlayerProfile } from '@/features/liverpoolDetail/types'

/**
 * 選手の表示名を決定する
 * ルール:
 * 1. 日本語名が閾値以下の文字数 → フル表示
 * 2. 日本語名が閾値より長い → 姓のみ表示（最初の単語）
 * 3. 日本語名がない場合 → 英名の姓のみ
 */
export function getDisplayName(player: PlayerProfile, threshold: number = 5): string {
  const japanseName = (player.jp || "").trim()

  if (!japanseName) {
    return getLastName(player.intl || "")
  }

  // 中点や空白で区切られている場合は、最初の部分を優先
  const japaneseParts = japanseName
    .split(/[\s・]/g)
    .filter((part: string) => part.length > 0)
  if (japaneseParts.length > 1) {
    return japaneseParts[0] // 複数部分がある場合は最初の部分（姓）
  }

  // 数字が含まれる場合はフル表示（例：プレイヤー1）
  if (/\d/.test(japanseName)) {
    return japanseName
  }

  // 日本語名が閾値以下なら（短い和名）フル表示
  if (japanseName.length <= threshold) {
    return japanseName
  }

  // 分割されない場合（例：冨安健洋）は、最初の2文字を姓とする
  // 但し、全体が3文字以下なら1文字目のみ
  if (japanseName.length <= 3) {
    return japanseName.substring(0, 1)
  } else {
    return japanseName.substring(0, 2)
  }

  // 上記のルールに当てはまらない場合、または最終的なフォールバック
  return getLastName(player.intl || player.name || "")
}

/**
 * 英名から姓を抽出
 */
export function getLastName(fullName: string | undefined): string {
  const name = (fullName || '').trim()

  if (!name) {
    return 'Unknown'
  }

  const parts = name.split(/\s+/).filter(part => part.length > 0)

  if (parts.length === 0) {
    return 'Unknown'
  }

  if (parts.length === 1) {
    return parts[0]
  }

  // 最後の単語を姓とする
  return parts[parts.length - 1]
}

/**
 * フル名を取得（モーダルでの表示用）
 */
export function getFullName(player: PlayerProfile): string {
  const jp = player.jp ? player.jp.trim() : "";
  const intl = player.intl ? player.intl.trim() : "";

  if (jp) {
    return jp
  }
  if (intl) {
    return intl
  }
  return 'Unknown Player'
}

/**
 * 英語名を取得
 */
export function getInternationalName(player: PlayerProfile): string | undefined {
  return player.intl
}

/**
 * ポジション表示名を取得
 */
export function getPositionDisplay(player: PlayerProfile): string | undefined {
  return player.position;
}

/**
 * 背番号表示を取得
 */
export function getNumberDisplay(player: PlayerProfile): string {
  if (player.num === undefined || player.num === null) {
    return ''
  }
  return String(player.num)
}

/**
 * 選手の検索キーワードを生成（検索機能用）
 */
export function getSearchKeywords(player: PlayerProfile): string[] {
  const keywords: string[] = []

  if (player.jp) {
    keywords.push(player.jp.toLowerCase())
    // 日本語名の各部分も追加
    const parts = player.jp.split(/[\s・]/g).filter(part => part.length > 0)
    keywords.push(...parts.map(part => part.toLowerCase()))
  }

  if (player.intl) {
    keywords.push(player.intl.toLowerCase())
    // 英名の各部分も追加
    const parts = player.intl.split(/\s+/).filter(part => part.length > 0)
    keywords.push(...parts.map(part => part.toLowerCase()))
  }

  if (player.position) {
    keywords.push(player.position.toLowerCase());
  }

  if (player.num) {
    keywords.push(String(player.num))
  }

  return [...new Set(keywords)] // 重複除去
}

/**
 * 名前の長さをチェック（表示名決定用の補助関数）
 */
export function isShortName(name: string, threshold: number = 5): boolean {
  return name.trim().length <= threshold
}

/**
 * カタカナ名前かどうかを判定
 */
export function isKatakanaName(name: string): boolean {
  // カタカナ、中点、スペースのみで構成されているかチェック
  const katakanaRegex = /^[\u30A0-\u30FF\u30FB\s・]+$/
  return katakanaRegex.test(name)
}

/**
 * ひらがな名前かどうかを判定
 */
export function isHiraganaName(name: string): boolean {
  // ひらがな、スペースのみで構成されているかチェック
  const hiraganaRegex = /^[\u3040-\u309F\s]+$/
  return hiraganaRegex.test(name)
}

/**
 * 漢字が含まれているかを判定
 */
export function hasKanji(name: string): boolean {
  // 漢字の範囲をチェック
  const kanjiRegex = /[\u4e00-\u9faf]/
  return kanjiRegex.test(name)
}
