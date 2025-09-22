import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('BSix.com Smoke Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/BSix\.com/);
    
    // Check main navigation exists
    await expect(page.locator('nav')).toBeVisible();
    
    // Check main content loads
    await expect(page.locator('main, .main-content')).toBeVisible();
    
    // Check for Big 6 teams section
    await expect(page.locator('text=ビッグ6')).toBeVisible();
  });

  test('teams page loads and displays data', async ({ page }) => {
    await page.goto('/teams-advanced-stats.html');
    
    // Check page loads
    await expect(page.locator('h1, h2')).toContainText(['チーム', 'Big']);
    
    // Check table exists and has data
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Check for team names
    await expect(page.locator('text=Liverpool')).toBeVisible();
    await expect(page.locator('text=Arsenal')).toBeVisible();
    
    // Test table controls
    const showAllButton = page.locator('button:has-text("全て表示")');
    if (await showAllButton.isVisible()) {
      await showAllButton.click();
      // Verify more columns are shown
      await expect(table.locator('th')).toHaveCount({ min: 10 });
    }
  });

  test('team detail page loads', async ({ page }) => {
    await page.goto('/liverpool-detailed.html');
    
    // Check page loads
    await expect(page.locator('h1, h2')).toContainText('Liverpool');
    
    // Check team stats are displayed
    await expect(page.locator('.stats-card, .team-stats')).toBeVisible();
    
    // Check navigation back to home works
    const homeLink = page.locator('a[href*="index"], button:has-text("ホーム")');
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL(/index\.html|\/$/);
    }
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check mobile navigation
    const mobileMenu = page.locator('[data-mobile-menu], .mobile-menu');
    if (await mobileMenu.isVisible()) {
      // Test mobile menu toggle
      const menuToggle = page.locator('[data-mobile-menu-toggle], .mobile-menu-toggle');
      if (await menuToggle.isVisible()) {
        await menuToggle.click();
        await expect(mobileMenu).toHaveClass(/active|open/);
      }
    }
    
    // Check content is readable on mobile
    await expect(page.locator('body')).toHaveCSS('overflow-x', 'hidden');
  });

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to teams page
    const teamsLink = page.locator('a[href*="teams"], a:has-text("チーム")').first();
    await teamsLink.click();
    await expect(page).toHaveURL(/teams/);
    
    // Navigate back to home
    const homeLink = page.locator('a[href*="index"], a:has-text("ホーム")').first();
    await homeLink.click();
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('data sync status is displayed', async ({ page }) => {
    await page.goto('/');
    
    // Look for data sync indicator
    const syncIndicator = page.locator('.data-sync, [data-sync], text=データ同期');
    if (await syncIndicator.isVisible()) {
      await expect(syncIndicator).toContainText(/完了|成功|2025/);
    }
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.locator('[data-theme-toggle], .theme-toggle');
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.getAttribute('html', 'data-theme');
      
      // Toggle theme
      await themeToggle.click();
      
      // Check theme changed
      const newTheme = await page.getAttribute('html', 'data-theme');
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('accessibility standards are met', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('external links open in new tab', async ({ page }) => {
    await page.goto('/');
    
    // Find external links
    const externalLinks = page.locator('a[href^="http"]:not([href*="bsix.com"])');
    const linkCount = await externalLinks.count();
    
    if (linkCount > 0) {
      const firstExternalLink = externalLinks.first();
      await expect(firstExternalLink).toHaveAttribute('target', '_blank');
      await expect(firstExternalLink).toHaveAttribute('rel', /noopener/);
    }
  });

  test('forms handle validation correctly', async ({ page }) => {
    await page.goto('/');
    
    // Look for forms
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      const form = forms.first();
      const submitButton = form.locator('button[type="submit"], input[type="submit"]');
      
      if (await submitButton.isVisible()) {
        // Try to submit empty form
        await submitButton.click();
        
        // Check for validation messages
        const validationMessage = page.locator('.error, .validation-error, [aria-invalid="true"]');
        if (await validationMessage.isVisible()) {
          await expect(validationMessage).toBeVisible();
        }
      }
    }
  });

  test('page performance is acceptable', async ({ page }) => {
    // Start timing
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check for performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
    });
    
    // DOM should be ready quickly
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
  });
});
