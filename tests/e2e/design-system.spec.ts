import { test, expect } from '@playwright/test';

/**
 * BSix.com デザインシステム E2Eテスト
 * 
 * このテストスイートでは、デザインシステムの一貫性と
 * レスポンシブデザインの動作を検証します。
 */

// デザインシステムの基本要素テスト
test.describe('デザインシステム基本要素', () => {
  test('タイポグラフィが正しく適用されていること', async ({ page }) => {
    await page.goto('/index-improved.html');
    
    // フォントファミリーの検証
    const headerFont = await page.evaluate(() => {
      const header = document.querySelector('.header-title');
      return window.getComputedStyle(header).fontFamily;
    });
    
    expect(headerFont).toContain('Montserrat');
    
    // フォントサイズの検証
    const bodyFontSize = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontSize;
    });
    
    expect(bodyFontSize).toBe('16px');
  });
  
  test('カラーパレットが正しく適用されていること', async ({ page }) => {
    await page.goto('/index-improved.html');
    
    // プライマリカラーの検証
    const headerBg = await page.evaluate(() => {
      const header = document.querySelector('.header-primary');
      return window.getComputedStyle(header).background;
    });
    
    expect(headerBg).toContain('linear-gradient');
    expect(headerBg).toContain('rgb(26, 54, 93)'); // --primary-navy
  });
  
  test('ボタンスタイルが正しく適用されていること', async ({ page }) => {
    await page.goto('/fixtures-responsive.html');
    
    // ボタンスタイルの検証
    const buttonStyle = await page.evaluate(() => {
      const button = document.querySelector('.filter-btn');
      const style = window.getComputedStyle(button);
      return {
        borderRadius: style.borderRadius,
        padding: style.padding,
        transition: style.transition
      };
    });
    
    expect(buttonStyle.borderRadius).not.toBe('0px');
    expect(buttonStyle.padding).not.toBe('0px');
    expect(buttonStyle.transition).toContain('all');
  });
});

// レスポンシブデザインテスト
test.describe('レスポンシブデザイン', () => {
  test('デスクトップレイアウトが正しく表示されること', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/fixtures-responsive.html');
    
    // デスクトップナビゲーションが表示されていることを確認
    const desktopNavVisible = await page.isVisible('.desktop-nav');
    expect(desktopNavVisible).toBeTruthy();
    
    // モバイルメニューボタンが非表示であることを確認
    const menuToggleVisible = await page.isVisible('.menu-toggle');
    expect(menuToggleVisible).toBeFalsy();
  });
  
  test('タブレットレイアウトが正しく表示されること', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/fixtures-responsive.html');
    
    // レイアウトの変更を確認
    const containerPadding = await page.evaluate(() => {
      const container = document.querySelector('.container');
      return window.getComputedStyle(container).padding;
    });
    
    // タブレットでのパディング調整を確認
    expect(containerPadding).not.toBe('0px');
  });
  
  test('モバイルレイアウトが正しく表示されること', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/fixtures-responsive.html');
    
    // モバイルメニューボタンが表示されていることを確認
    const menuToggleVisible = await page.isVisible('.menu-toggle');
    expect(menuToggleVisible).toBeTruthy();
    
    // デスクトップナビゲーションが非表示であることを確認
    const desktopNavVisible = await page.isVisible('.desktop-nav');
    expect(desktopNavVisible).toBeFalsy();
    
    // モバイルメニューの動作確認
    await page.click('.menu-toggle');
    const mobileMenuActive = await page.evaluate(() => {
      return document.querySelector('.mobile-menu').classList.contains('active');
    });
    expect(mobileMenuActive).toBeTruthy();
  });
});

// インタラクティブ要素テスト
test.describe('インタラクティブ要素', () => {
  test('タブ切り替えが正しく機能すること', async ({ page }) => {
    await page.goto('/fixtures-responsive.html');
    
    // 第2節タブをクリック
    await page.click('.nav-tab:nth-child(2)');
    
    // 第2節のコンテンツが表示されることを確認
    await page.waitForFunction(() => {
      return document.querySelector('#fixtures-container')?.textContent?.includes('第2節');
    });
    
    const containsGameweek2 = await page.evaluate(() => {
      return document.querySelector('#fixtures-container').textContent.includes('第2節');
    });
    
    expect(containsGameweek2).toBeTruthy();
  });
  
  test('フィルタリングが正しく機能すること', async ({ page }) => {
    await page.goto('/fixtures-responsive.html');
    
    // 「終了」フィルターをクリック
    await page.click('.filter-btn[data-filter="finished"]');
    
    // フィルターボタンがアクティブになることを確認
    const isActive = await page.evaluate(() => {
      return document.querySelector('.filter-btn[data-filter="finished"]').classList.contains('active');
    });
    
    expect(isActive).toBeTruthy();
  });
  
  test('ホバーエフェクトが正しく適用されること', async ({ page }) => {
    await page.goto('/fixtures-responsive.html');
    
    // カードのホバー前後のスタイル変化を確認
    const beforeHover = await page.evaluate(() => {
      const card = document.querySelector('.match-card');
      return window.getComputedStyle(card).transform;
    });
    
    await page.hover('.match-card');
    
    const afterHover = await page.evaluate(() => {
      const card = document.querySelector('.match-card');
      return window.getComputedStyle(card).transform;
    });
    
    // ホバー時に何らかの変化があることを確認
    expect(beforeHover).not.toBe(afterHover);
  });
});

// アクセシビリティテスト
test.describe('アクセシビリティ', () => {
  test('キーボードナビゲーションが機能すること', async ({ page }) => {
    await page.goto('/fixtures-responsive.html');
    
    // Tabキーでナビゲーション
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // フォーカスされた要素を確認
    const focusedElement = await page.evaluate(() => {
      return document.activeElement.textContent;
    });
    
    expect(focusedElement).not.toBe('');
  });
  
  test('コントラスト比が適切であること', async ({ page }) => {
    await page.goto('/fixtures-responsive.html');
    
    // ヘッダーテキストのコントラスト比を確認
    const headerContrast = await page.evaluate(() => {
      const header = document.querySelector('.header-title');
      const headerColor = window.getComputedStyle(header).color;
      const headerBg = window.getComputedStyle(document.querySelector('.header-primary')).backgroundColor;
      
      // 簡易的なコントラスト比チェック（実際はもっと複雑）
      function getLuminance(color) {
        // RGBから輝度を計算する簡易関数
        const rgb = color.match(/\d+/g).map(Number);
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      }
      
      const textLum = getLuminance(headerColor);
      const bgLum = getLuminance(headerBg);
      
      return Math.abs(textLum - bgLum) > 100; // 簡易的な閾値
    });
    
    expect(headerContrast).toBeTruthy();
  });
});

// クロスページ一貫性テスト
test.describe('クロスページ一貫性', () => {
  test('複数ページでデザインが一貫していること', async ({ page }) => {
    // index-improvedページのスタイル取得
    await page.goto('/index-improved.html');
    const indexHeaderStyle = await page.evaluate(() => {
      const header = document.querySelector('.header-primary');
      return header ? window.getComputedStyle(header).background : '';
    });
    
    // fixtures-responsiveページのスタイル取得
    await page.goto('/fixtures-responsive.html');
    const fixturesHeaderStyle = await page.evaluate(() => {
      const header = document.querySelector('.header-primary');
      return header ? window.getComputedStyle(header).background : '';
    });
    
    // ヘッダースタイルが一貫していることを確認
    expect(indexHeaderStyle).toBe(fixturesHeaderStyle);
  });
});

// パフォーマンステスト
test.describe('パフォーマンス', () => {
  test('ページが適切な時間で読み込まれること', async ({ page }) => {
    // パフォーマンスタイミングAPIを使用して読み込み時間を測定
    const loadTime = await page.goto('/fixtures-responsive.html').then(async () => {
      return page.evaluate(() => {
        return window.performance.timing.domContentLoadedEventEnd - 
               window.performance.timing.navigationStart;
      });
    });
    
    // 5秒以内に読み込まれることを期待
    expect(loadTime).toBeLessThan(5000);
  });
});
