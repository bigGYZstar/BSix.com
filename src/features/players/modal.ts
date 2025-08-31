// 選手モーダルの描画とイベント管理

import type { Player, Modal } from '@/types'
import { 
  getFullName, 
  getInternationalName, 
  getPositionDisplay, 
  getNumberDisplay 
} from './displayName'
import { getPlayerAvatar } from '@/ui/avatar'

/**
 * モーダル状態管理
 */
class PlayerModal implements Modal {
  private modalElement: HTMLElement | null = null
  private backdropElement: HTMLElement | null = null
  private isModalOpen = false
  private focusBeforeModal: HTMLElement | null = null
  
  constructor() {
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleBackdropClick = this.handleBackdropClick.bind(this)
  }

  /**
   * モーダルを開く
   */
  open(player: Player): void {
    if (this.isModalOpen) {
      this.close()
    }

    // 現在のフォーカス位置を保存
    this.focusBeforeModal = document.activeElement as HTMLElement

    // モーダル要素を作成
    this.createModal(player)
    
    // DOMに追加
    document.body.appendChild(this.backdropElement!)
    
    // イベントリスナー追加
    document.addEventListener('keydown', this.handleKeydown)
    this.backdropElement!.addEventListener('click', this.handleBackdropClick)
    
    // スクロール無効化
    document.body.style.overflow = 'hidden'
    
    // 状態更新
    this.isModalOpen = true
    
    // フォーカスをモーダルに移動
    setTimeout(() => {
      const closeButton = this.modalElement!.querySelector('.modal-close') as HTMLElement
      closeButton?.focus()
    }, 100)
  }

  /**
   * モーダルを閉じる
   */
  close(): void {
    if (!this.isModalOpen) {
      return
    }

    // イベントリスナー削除
    document.removeEventListener('keydown', this.handleKeydown)
    
    // DOM要素削除
    if (this.backdropElement) {
      this.backdropElement.remove()
    }
    
    // スクロール復元
    document.body.style.overflow = ''
    
    // フォーカス復元
    if (this.focusBeforeModal) {
      this.focusBeforeModal.focus()
    }
    
    // 状態更新
    this.isModalOpen = false
    this.modalElement = null
    this.backdropElement = null
    this.focusBeforeModal = null
  }

  /**
   * モーダルが開いているかチェック
   */
  isOpen(): boolean {
    return this.isModalOpen
  }

  /**
   * モーダル要素を作成
   */
  private createModal(player: Player): void {
    // バックドロップ作成
    this.backdropElement = document.createElement('div')
    this.backdropElement.className = 'modal-backdrop'
    this.backdropElement.setAttribute('role', 'dialog')
    this.backdropElement.setAttribute('aria-modal', 'true')
    this.backdropElement.setAttribute('aria-labelledby', 'modal-title')

    // モーダル作成
    this.modalElement = document.createElement('div')
    this.modalElement.className = 'modal'
    this.modalElement.innerHTML = this.generateModalContent(player)
    
    this.backdropElement.appendChild(this.modalElement)
    
    // 閉じるボタンのイベント
    const closeButton = this.modalElement.querySelector('.modal-close')
    closeButton?.addEventListener('click', () => this.close())
  }

  /**
   * モーダルコンテンツHTML生成
   */
  private generateModalContent(player: Player): string {
    const fullName = getFullName(player)
    const intlName = getInternationalName(player)
    const position = getPositionDisplay(player)
    const number = getNumberDisplay(player)
    const avatar = getPlayerAvatar(player, 80)
    
    return `
      <div class="modal-header">
        <h2 id="modal-title" class="modal-title">${fullName}</h2>
        <button class="modal-close" aria-label="閉じる">×</button>
      </div>
      
      <div class="modal-body">
        <!-- プレイヤー情報 -->
        <div class="modal-section">
          <div class="player-info">
            <img src="${avatar}" alt="${fullName}のアバター" class="player-avatar" />
            <h3 class="player-name">${fullName}</h3>
            <div class="player-details">
              <span><strong>英名:</strong> ${intlName}</span>
              <span><strong>ポジション:</strong> ${position}</span>
              ${number ? `<span><strong>背番号:</strong> ${number}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- 今季スタッツ -->
        ${this.generateStatsSection(player)}
        
        <!-- 詳細情報 -->
        ${this.generateDetailsSection(player)}
      </div>
    `
  }

  /**
   * スタッツセクション生成
   */
  private generateStatsSection(player: Player): string {
    if (!player.stats) {
      return `
        <div class="modal-section">
          <h4>今季スタッツ</h4>
          <p class="text-muted">データなし</p>
        </div>
      `
    }

    const { apps = 0, goals = 0, assists = 0, cleanSheets, saves } = player.stats
    
    // GK用スタッツ
    if (player.pos === 'GK') {
      return `
        <div class="modal-section">
          <h4>今季スタッツ</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${apps}</div>
              <div class="stat-label">出場</div>
            </div>
            ${cleanSheets !== undefined ? `
              <div class="stat-item">
                <div class="stat-value">${cleanSheets}</div>
                <div class="stat-label">CS</div>
              </div>
            ` : ''}
            ${saves !== undefined ? `
              <div class="stat-item">
                <div class="stat-value">${saves}</div>
                <div class="stat-label">セーブ</div>
              </div>
            ` : ''}
          </div>
        </div>
      `
    }
    
    // フィールドプレーヤー用スタッツ
    return `
      <div class="modal-section">
        <h4>今季スタッツ</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${apps}</div>
            <div class="stat-label">出場</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${goals}</div>
            <div class="stat-label">ゴール</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${assists}</div>
            <div class="stat-label">アシスト</div>
          </div>
        </div>
      </div>
    `
  }

  /**
   * 詳細情報セクション生成
   */
  private generateDetailsSection(player: Player): string {
    const details: string[] = []
    
    if (player.avatar) {
      const { skin, hair, style } = player.avatar
      details.push(`外見: ${this.translateAvatarFeature('skin', skin)} / ${this.translateAvatarFeature('hair', hair)} / ${this.translateAvatarFeature('style', style)}`)
    }
    
    if (player.playerId) {
      details.push(`ID: ${player.playerId}`)
    }

    if (details.length === 0) {
      return ''
    }

    return `
      <div class="modal-section">
        <h4>詳細情報</h4>
        <ul class="list-unstyled">
          ${details.map(detail => `<li class="text-sm text-muted">${detail}</li>`).join('')}
        </ul>
      </div>
    `
  }

  /**
   * アバター特徴を日本語に翻訳
   */
  private translateAvatarFeature(type: string, value?: string): string {
    if (!value) return '不明'
    
    const translations: { [key: string]: { [key: string]: string } } = {
      skin: {
        light: '明るい肌',
        medium: '普通の肌',
        dark: '濃い肌', 
        tan: '日焼けした肌'
      },
      hair: {
        black: '黒髪',
        brown: '茶髪',
        blonde: '金髪',
        red: '赤毛',
        gray: '白髪',
        bald: 'ハゲ'
      },
      style: {
        short: 'ショート',
        buzz: '坊主',
        curly: 'カーリー',
        long: 'ロング',
        bald: 'ハゲ'
      }
    }
    
    return translations[type]?.[value] || value
  }

  /**
   * キーボードイベントハンドラ
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault()
      this.close()
    }
    
    // Tab トラップ（モーダル内でのフォーカス循環）
    if (event.key === 'Tab' && this.modalElement) {
      this.trapFocus(event)
    }
  }

  /**
   * バックドロップクリックハンドラ
   */
  private handleBackdropClick(event: MouseEvent): void {
    if (event.target === this.backdropElement) {
      this.close()
    }
  }

  /**
   * フォーカストラップ（アクセシビリティ）
   */
  private trapFocus(event: KeyboardEvent): void {
    if (!this.modalElement) return

    const focusableElements = this.modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
}

// シングルトンインスタンス
export const playerModal = new PlayerModal()

/**
 * 選手要素にモーダル機能を追加
 */
export function addPlayerModalTrigger(
  element: HTMLElement, 
  player: Player
): void {
  // クリックイベント
  element.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    playerModal.open(player)
  })
  
  // キーボードアクセシビリティ
  element.setAttribute('role', 'button')
  element.setAttribute('tabindex', '0')
  element.setAttribute('aria-label', `${getFullName(player)}の詳細を表示`)
  
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      playerModal.open(player)
    }
  })
}

/**
 * 複数要素にモーダルトリガーを一括追加
 */
export function addModalTriggersToElements(
  elements: NodeListOf<HTMLElement>,
  players: Player[]
): void {
  elements.forEach((element, index) => {
    if (players[index]) {
      addPlayerModalTrigger(element, players[index])
    }
  })
}