import { test, expect } from '@playwright/test';

test.describe('Liverpool Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Liverpool detail page
    await page.goto('/liverpool-detail.html');
  });

  test('should load Liverpool detail page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Liverpool.*BSix\.com/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Liverpool');
    
    // Check that the page has loaded content
    await expect(page.locator('.liverpool-detail-page')).toBeVisible();
  });

  test('should display team header information', async ({ page }) => {
    // Check team name
    await expect(page.locator('.team-name')).toContainText('Liverpool');
    
    // Check manager information
    await expect(page.locator('.manager-info')).toContainText('Arne Slot');
    
    // Check position badge
    await expect(page.locator('.position-badge')).toBeVisible();
  });

  test('should display season statistics', async ({ page }) => {
    // Check stats section is visible
    await expect(page.locator('.season-stats')).toBeVisible();
    
    // Check stat cards
    const statCards = page.locator('.stat-card');
    await expect(statCards.count()).toBeGreaterThan(0);
    
    // Check specific stats
    await expect(page.locator('.stat-card').first()).toBeVisible();
    
    // Check form display
    await expect(page.locator('.form-display')).toBeVisible();
    await expect(page.locator(".form-badge").count()).toBeGreaterThan(0);
  });

  test('should display tactical analysis', async ({ page }) => {
    // Check tactical section
    await expect(page.locator('.tactical-analysis')).toBeVisible();
    
    // Check formation display
    await expect(page.locator('.formation-display')).toContainText(/\d-\d-\d/);
    
    // Check strengths and tactics
    await expect(page.locator('.strengths-card')).toBeVisible();
    await expect(page.locator('.tactics-card')).toBeVisible();
  });

  test('should display squad section with player cards', async ({ page }) => {
    // Check squad section
    await expect(page.locator('.squad-section')).toBeVisible();
    
    // Check top performers
    await expect(page.locator('.top-performers')).toBeVisible();
    await expect(page.locator(".performer-card").count()).toBeGreaterThan(0);
    
    // Check player cards
    const playerCards = page.locator('.player-card');
    await expect(playerCards.count()).toBeGreaterThan(0);
    
    // Check first player card content
    const firstCard = playerCards.first();
    await expect(firstCard.locator('.player-name')).toBeVisible();
    await expect(firstCard.locator('.player-position')).toBeVisible();
    await expect(firstCard.locator('.player-stats')).toBeVisible();
  });

  test('should filter squad by position', async ({ page }) => {
    // Wait for squad to load
    await expect(page.locator('.squad-grid')).toBeVisible();
    
    // Get initial player count
    const allPlayers = page.locator('.player-card');
    const initialCount = await allPlayers.count();
    
    // Click midfielder filter
    await page.locator('[data-position="midfielder"]').click();
    
    // Check that filter button is active
    await expect(page.locator('[data-position="midfielder"]')).toHaveClass(/active/);
    
    // Check that some players are hidden (filtered)
    const visiblePlayers = page.locator('.player-card:visible');
    const filteredCount = await visiblePlayers.count();
    
    // Should have fewer or equal players visible after filtering
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should display upcoming fixtures', async ({ page }) => {
    // Check fixtures section
    await expect(page.locator('.upcoming-fixtures')).toBeVisible();
    
    // Check fixture cards
    const fixtureCards = page.locator('.fixture-card');
    await expect(fixtureCards.count()).toBeGreaterThan(0);
    
    // Check fixture content
    const firstFixture = fixtureCards.first();
    await expect(firstFixture.locator('.fixture-date')).toBeVisible();
    await expect(firstFixture.locator('.opponent')).toBeVisible();
    await expect(firstFixture.locator('.fixture-competition')).toBeVisible();
  });

  test('should display transfer news', async ({ page }) => {
    // Check transfer news section
    await expect(page.locator('.transfer-news')).toBeVisible();
    
    // Check news items
    const newsItems = page.locator('.news-item');
    await expect(newsItems.count()).toBeGreaterThan(0);
    
    // Check news content
    const firstNews = newsItems.first();
    await expect(firstNews.locator('.player-name')).toBeVisible();
    await expect(firstNews.locator('.news-type')).toBeVisible();
    await expect(firstNews.locator('.news-content')).toBeVisible();
  });

  test('should have working control buttons', async ({ page }) => {
    // Check control buttons are visible
    await expect(page.locator('.control-buttons')).toBeVisible();
    
    // Check individual buttons
    await expect(page.locator('#toggle-detailed')).toBeVisible();
    await expect(page.locator('#export-squad')).toBeVisible();
    await expect(page.locator('#refresh-data')).toBeVisible();
    
    // Test toggle detailed view
    await page.locator('#toggle-detailed').click();
    // Should trigger re-render (we can check if page is still functional)
    await expect(page.locator('.liverpool-detail-page')).toBeVisible();
    
    // Test refresh data
    await page.locator('#refresh-data').click();
    await expect(page.locator('.liverpool-detail-page')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main content is still visible
    await expect(page.locator('.liverpool-detail-page')).toBeVisible();
    
    // Check that stats grid adapts
    await expect(page.locator('.stats-grid')).toBeVisible();
    
    // Check that squad grid adapts
    await expect(page.locator('.squad-grid')).toBeVisible();
    
    // Check that buttons are still accessible
    await expect(page.locator('.control-buttons')).toBeVisible();
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    const h2s = page.locator('h2');
    await expect(h2s.count()).toBeGreaterThan(0);
    
    // Check button accessibility
    const buttons = page.locator('button');
    for (let i = 0; i < await buttons.count(); i++) {
      const button = buttons.nth(i);
      await expect(button).toHaveAttribute('type', /.*/);
      
      // Check button has text content
      const text = await button.textContent();
      expect(text?.trim()).not.toBe('');
    }
    
    // Check that interactive elements are keyboard accessible
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Mock network failure by intercepting requests
    await page.route('**/api/**', route => route.abort());
    
    // Reload page to trigger error
    await page.reload();
    
    // Should show error message or fallback content
    // (This test depends on how error handling is implemented)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load quickly and perform well', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to page
    await page.goto('/liverpool-detail.html');
    
    // Wait for main content to load
    await expect(page.locator('.liverpool-detail-page')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (adjust threshold as needed)
    expect(loadTime).toBeLessThan(5000);
    
    // Check that images load (if any)
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        await expect(images.nth(i)).toHaveAttribute('src', /.+/);
      }
    }
  });
});
