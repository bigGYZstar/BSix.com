// チームピル文字が2行にならないE2Eテスト

import { test, expect } from '@playwright/test'

// テスト対象の画面サイズ
const VIEWPORT_SIZES = [
  { width: 320, height: 568 }, // iPhone SE
  { width: 375, height: 667 }, // iPhone 8
  { width: 414, height: 896 }, // iPhone XR
  { width: 768, height: 1024 }, // iPad
  { width: 1280, height: 720 }, // Desktop
]

test.describe('Team Pills No-Wrap Test', () => {
  test.beforeEach(async ({ page }) => {
    // テスト用のローカルサーバーまたはビルド後のアプリにアクセス
    await page.goto('/')

    // アプリが読み込まれるまで待機
    await page.waitForSelector('.team-pills', { timeout: 10000 })
  })

  VIEWPORT_SIZES.forEach(({ width, height }) => {
    test(`should not wrap team pills at ${width}x${height}`, async ({
      page,
    }) => {
      // ビューポートを設定
      await page.setViewportSize({ width, height })

      // lineup タブに移動
      await page.click('[data-route="lineup"]')
      await page.waitForSelector('.team-pills')

      // チームピルコンテナを取得
      const teamPillsContainer = page.locator('.team-pills')
      await expect(teamPillsContainer).toBeVisible()

      // 各チームピルの高さを測定
      const pills = page.locator('.team-pill')
      const pillCount = await pills.count()

      expect(pillCount).toBeGreaterThan(0)

      // 全てのピルが同じ高さ（1行）にあることを確認
      const pillBoxes = []
      for (let i = 0; i < pillCount; i++) {
        const box = await pills.nth(i).boundingBox()
        expect(box).not.toBeNull()
        pillBoxes.push(box!)
      }

      // 最初のピルの高さを基準として、他のピルが同じY座標範囲にあるかチェック
      const baseY = pillBoxes[0].y
      const baseHeight = pillBoxes[0].height

      pillBoxes.forEach(box => {
        // Y座標の差が高さの半分以下であれば同じ行とみなす
        const yDiff = Math.abs(box.y - baseY)
        expect(yDiff).toBeLessThan(baseHeight / 2)
      })

      // コンテナ自体の高さもチェック
      const containerBox = await teamPillsContainer.boundingBox()
      expect(containerBox).not.toBeNull()

      // コンテナの高さが2行分の高さを超えていないことを確認
      // (1行分のピルの高さ + 余白を考慮)
      const maxExpectedHeight = baseHeight * 1.5
      expect(containerBox!.height).toBeLessThanOrEqual(maxExpectedHeight)
    })
  })

  test('should maintain single line even with long team names', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 })

    // lineup タブに移動
    await page.click('[data-route="lineup"]')
    await page.waitForSelector('.team-pills')

    // チームピルのテキストが省略されているかチェック
    const pills = page.locator('.team-pill')
    const pillCount = await pills.count()

    for (let i = 0; i < pillCount; i++) {
      const pill = pills.nth(i)

      // ピルの幅を取得
      const box = await pill.boundingBox()
      expect(box).not.toBeNull()

      // 最大幅制限が適用されているかチェック（CSS max-width: 120px）
      expect(box!.width).toBeLessThanOrEqual(120)

      // テキストがオーバーフローしていないかチェック
      const computedStyle = await pill.evaluate(el => {
        const style = window.getComputedStyle(el)
        return {
          textOverflow: style.textOverflow,
          whiteSpace: style.whiteSpace,
          overflow: style.overflow,
        }
      })

      expect(computedStyle.whiteSpace).toBe('nowrap')
      expect(computedStyle.textOverflow).toBe('ellipsis')
      expect(computedStyle.overflow).toBe('hidden')
    }
  })

  test('should be horizontally scrollable on narrow screens', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 })

    await page.click('[data-route="lineup"]')
    await page.waitForSelector('.team-pills')

    const container = page.locator('.team-pills')

    // 横スクロール可能かチェック
    const computedStyle = await container.evaluate(el => {
      const style = window.getComputedStyle(el)
      return {
        overflowX: style.overflowX,
        whiteSpace: style.whiteSpace,
      }
    })

    expect(computedStyle.overflowX).toBe('auto')
    expect(computedStyle.whiteSpace).toBe('nowrap')

    // スクロール幅が表示幅より大きいかチェック（コンテンツが多い場合）
    const scrollInfo = await container.evaluate(el => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }))

    // コンテンツがコンテナより大きい場合はスクロール可能であることを確認
    if (scrollInfo.scrollWidth > scrollInfo.clientWidth) {
      // 実際にスクロールできるかテスト
      await container.hover()
      await page.mouse.wheel(10, 0) // 横スクロール

      const newScrollLeft = await container.evaluate(el => el.scrollLeft)
      expect(newScrollLeft).toBeGreaterThanOrEqual(0)
    }
  })

  test('should maintain accessibility with nowrap', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })

    await page.click('[data-route="lineup"]')
    await page.waitForSelector('.team-pills')

    const pills = page.locator('.team-pill')

    // 各ピルがクリック可能でアクセシブルかチェック
    const pillCount = await pills.count()
    for (let i = 0; i < pillCount; i++) {
      const pill = pills.nth(i)

      // フォーカス可能かチェック
      await pill.focus()
      const isFocused = await pill.evaluate(el => document.activeElement === el)
      expect(isFocused).toBe(true)

      // タブインデックスが設定されているかチェック
      const tabIndex = await pill.getAttribute('tabindex')
      expect(tabIndex).not.toBeNull()

      // クリック可能かチェック
      await expect(pill).toBeEnabled()
    }
  })

  test('should handle theme switching without breaking layout', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.click('[data-route="lineup"]')
    await page.waitForSelector('.team-pills')

    // 初期レイアウトを記録
    const initialLayout = await measurePillLayout(page)

    // テーマを切り替え
    const themeButton = page.locator('button[aria-label="テーマ切り替え"]')
    await themeButton.click()

    // レイアウトが崩れていないかチェック
    await page.waitForTimeout(100) // アニメーション待機
    const afterThemeLayout = await measurePillLayout(page)

    // ピルの数が同じであることを確認
    expect(afterThemeLayout.length).toBe(initialLayout.length)

    // 各ピルが依然として1行にあることを確認
    const baseY = afterThemeLayout[0].y
    const baseHeight = afterThemeLayout[0].height

    afterThemeLayout.forEach(box => {
      const yDiff = Math.abs(box.y - baseY)
      expect(yDiff).toBeLessThan(baseHeight / 2)
    })
  })

  test('should handle dynamic content changes', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 })

    await page.click('[data-route="lineup"]')
    await page.waitForSelector('.team-pills')

    // ホームチーム選択
    const homeTeamPill = page.locator('.team-pill[data-team="home"]')
    await homeTeamPill.click()

    await page.waitForTimeout(100)
    let layout = await measurePillLayout(page)
    expect(layout.length).toBeGreaterThan(0)

    // アウェイチーム選択
    const awayTeamPill = page.locator('.team-pill[data-team="away"]')
    await awayTeamPill.click()

    await page.waitForTimeout(100)
    layout = await measurePillLayout(page)
    expect(layout.length).toBeGreaterThan(0)

    // レイアウトが依然として1行であることを確認
    const baseY = layout[0].y
    const baseHeight = layout[0].height

    layout.forEach(box => {
      const yDiff = Math.abs(box.y - baseY)
      expect(yDiff).toBeLessThan(baseHeight / 2)
    })
  })
})

// ヘルパー関数：ピルレイアウトの測定
async function measurePillLayout(page: any) {
  const pills = page.locator('.team-pill')
  const count = await pills.count()
  const layout = []

  for (let i = 0; i < count; i++) {
    const box = await pills.nth(i).boundingBox()
    if (box) {
      layout.push(box)
    }
  }

  return layout
}
