// ハッシュベースルーティング

import type { Route } from '@/types'
import { setActiveTab, subscribeToState } from './state'

/**
 * ルート定義
 */
const ROUTES: Record<string, Route> = {
  '#overview': 'overview',
  '#tactics': 'tactics',
  '#lineup': 'lineup',
  '#timeline': 'timeline',
} as const

const ROUTE_TITLES: Record<Route, string> = {
  home: 'ホーム',
  overview: '概要',
  tactics: '戦術',
  lineup: '布陣',
  timeline: 'タイムライン',
} as const

/**
 * ルーター管理クラス
 */
class Router {
  private currentRoute: Route = 'overview'
  private listeners: Set<(route: Route) => void> = new Set()

  constructor() {
    this.init()
  }

  /**
   * ルーター初期化
   */
  private init(): void {
    // ハッシュ変更を監視
    window.addEventListener('hashchange', this.handleHashChange.bind(this))

    // ページ読み込み時の初期ルート処理
    this.handleHashChange()

    // 状態変更を監視してURLを同期
    subscribeToState(state => {
      if (state.selectedTab !== this.currentRoute) {
        this.updateURL(state.selectedTab as Route)
      }
    })
  }

  /**
   * ハッシュ変更ハンドラ
   */
  private handleHashChange(): void {
    const hash = window.location.hash || '#overview'
    const route = ROUTES[hash] as Route | undefined

    if (route && route !== this.currentRoute) {
      this.navigateTo(route, false) // URL更新はしない（既に変更済み）
    } else if (!route) {
      // 無効なハッシュの場合はデフォルトにリダイレクト
      this.navigateTo('overview', true)
    }
  }

  /**
   * 指定ルートに遷移
   */
  navigateTo(route: Route, updateURL: boolean = true): void {
    this.currentRoute = route

    // 状態を更新
    setActiveTab(route)

    // URLを更新（必要に応じて）
    if (updateURL) {
      this.updateURL(route)
    }

    // ページタイトルを更新
    this.updatePageTitle(route)

    // ルート変更をリスナーに通知
    this.notifyListeners(route)
  }

  /**
   * URLハッシュを更新
   */
  private updateURL(route: Route): void {
    const hash =
      Object.keys(ROUTES).find(key => ROUTES[key] === route) || '#overview'

    if (window.location.hash !== hash) {
      // pushState を使ってブラウザ履歴に追加
      window.history.pushState(null, '', hash)
    }
  }

  /**
   * ページタイトルを更新
   */
  private updatePageTitle(route: Route): void {
    const title = ROUTE_TITLES[route] || '試合プレビュー'
    document.title = `${title} - 試合プレビュー`
  }

  /**
   * ルート変更リスナーを登録
   */
  subscribe(listener: (route: Route, prevRoute?: Route) => void): () => void {
    this.listeners.add(listener)

    // アンサブスクライブ関数を返す
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * リスナーに通知
   */
  private notifyListeners(route: Route): void {
    this.listeners.forEach(listener => {
      try {
        listener(route)
      } catch (error) {
        console.error('Router listener error:', error)
      }
    })
  }

  /**
   * 現在のルートを取得
   */
  getCurrentRoute(): Route {
    return this.currentRoute
  }

  /**
   * ルートが有効かチェック
   */
  isValidRoute(route: string): route is Route {
    return ['overview', 'tactics', 'lineup', 'timeline'].includes(route)
  }

  /**
   * 戻る/進むナビゲーション
   */
  back(): void {
    window.history.back()
  }

  forward(): void {
    window.history.forward()
  }

  /**
   * ブラウザの戻る/進むボタン操作を処理
   */
  handlePopState(): void {
    this.handleHashChange()
  }
}

// シングルトンインスタンス
export const router = new Router()

// 便利関数

/**
 * 指定ルートに遷移
 */
export function navigateTo(route: Route): void {
  router.navigateTo(route)
}

/**
 * ルート変更を監視
 */
export function onRouteChange(
  listener: (route: Route, prevRoute?: Route) => void
): () => void {
  return router.subscribe(listener)
}

/**
 * 現在のルートを取得
 */
export function getCurrentRoute(): Route {
  return router.getCurrentRoute()
}

/**
 * ルートのタイトルを取得
 */
export function getRouteTitle(route: Route): string {
  return ROUTE_TITLES[route] || '不明'
}

/**
 * 全ルートとタイトルの一覧を取得
 */
export function getAllRoutes(): {
  route: Route
  title: string
  hash: string
}[] {
  return Object.entries(ROUTES).map(([hash, route]) => ({
    route,
    title: ROUTE_TITLES[route],
    hash,
  }))
}

/**
 * キーボードナビゲーション（左右矢印キー）
 */
export function initKeyboardNavigation(): void {
  const routes: Route[] = ['overview', 'tactics', 'lineup', 'timeline']

  document.addEventListener('keydown', event => {
    // モーダルが開いている間はキーボードナビゲーションを無効化
    if (document.querySelector('.modal-backdrop')) {
      return
    }

    // フォーカスがinput/textarea上にある場合は無効化
    const activeElement = document.activeElement
    if (
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA')
    ) {
      return
    }

    const currentRoute = router.getCurrentRoute()
    const currentIndex = routes.indexOf(currentRoute)

    if (event.key === 'ArrowLeft' && currentIndex > 0) {
      event.preventDefault()
      router.navigateTo(routes[currentIndex - 1])
    } else if (event.key === 'ArrowRight' && currentIndex < routes.length - 1) {
      event.preventDefault()
      router.navigateTo(routes[currentIndex + 1])
    }
  })
}

/**
 * ページ読み込み時の初期化
 */
export function initRouter(): void {
  // popstate イベントを監視（ブラウザの戻る/進む）
  window.addEventListener('popstate', () => {
    router.handlePopState()
  })

  // キーボードナビゲーションを初期化
  initKeyboardNavigation()
}

/**
 * パンくずリストの生成
 */
export function generateBreadcrumb(): { label: string; route?: Route }[] {
  const currentRoute = router.getCurrentRoute()

  return [
    { label: 'ホーム' },
    { label: '試合プレビュー' },
    { label: ROUTE_TITLES[currentRoute], route: currentRoute },
  ]
}

/**
 * ルート間の遷移アニメーション方向を判定
 */
export function getTransitionDirection(
  fromRoute: Route,
  toRoute: Route
): 'left' | 'right' | 'none' {
  const routes: Route[] = ['overview', 'tactics', 'lineup', 'timeline']
  const fromIndex = routes.indexOf(fromRoute)
  const toIndex = routes.indexOf(toRoute)

  if (fromIndex === -1 || toIndex === -1) {
    return 'none'
  }

  return toIndex > fromIndex ? 'right' : 'left'
}

/**
 * メタタグの更新（SEO対応）
 */
export function updateMetaTags(route: Route): void {
  const descriptions: Record<Route, string> = {
    home: 'プレミアリーグビッグシックスの試合一覧',
    overview: '試合の概要と基本情報',
    tactics: 'チームの戦術と分析',
    lineup: 'スターティングイレブンとベンチメンバー',
    timeline: '試合の流れとキーポイント',
  }

  // description meta tag
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', descriptions[route])

  // robots meta tag
  let metaRobots = document.querySelector('meta[name="robots"]')
  if (!metaRobots) {
    metaRobots = document.createElement('meta')
    metaRobots.setAttribute('name', 'robots')
    document.head.appendChild(metaRobots)
  }
  metaRobots.setAttribute('content', 'index, follow')
}
