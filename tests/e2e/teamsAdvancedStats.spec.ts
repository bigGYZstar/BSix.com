import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Teams Advanced Stats Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teams-advanced-stats.html');
    await injectAxe(page);
  });

  test('should load page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/BSix\.com.*Teams/);
    await expect(page.locator('h2')).toContainText('Big 6 Teams Advanced Statistics');
  });

  test('should display teams table with data', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('.teams-table tbody tr', { timeout: 10000 });
    
    // Check table structure
    await expect(page.locator('.teams-table')).toBeVisible();
    await expect(page.locator('.teams-table thead th')).toHaveCount(7); // Default columns
    
    // Check for team data
    const teamRows = page.locator('.teams-table tbody tr');
    await expect(teamRows.count()).toBeGreaterThan(0);
    
    // Check for team links
    const teamLinks = page.locator('.team-link');
    await expect(teamLinks.first()).toBeVisible();
  });

  test('should toggle column visibility', async ({ page }) => {
    await page.waitForSelector('.teams-table', { timeout: 10000 });
    
    // Initially should have default columns
    const initialColumns = await page.locator('.teams-table thead th').count();
    expect(initialColumns).toBe(7);
    
    // Toggle a column off
    await page.locator('input[data-column="drawn"]').uncheck();
    await page.waitForTimeout(500); // Wait for re-render
    
    const columnsAfterToggle = await page.locator('.teams-table thead th').count();
    expect(columnsAfterToggle).toBe(6);
    
    // Toggle it back on
    await page.locator('input[data-column="drawn"]').check();
    await page.waitForTimeout(500);
    
    const columnsAfterReToggle = await page.locator('.teams-table thead th').count();
    expect(columnsAfterReToggle).toBe(7);
  });

  test('should show all columns when clicking "All Statistics"', async ({ page }) => {
    await page.waitForSelector('.teams-table', { timeout: 10000 });
    
    await page.click('#show-all');
    await page.waitForTimeout(500);
    
    const allColumns = await page.locator('.teams-table thead th').count();
    expect(allColumns).toBeGreaterThan(7); // Should show more than default
    
    // Check that form column is visible (only in "all" mode)
    await expect(page.locator('th:has-text("Form")')).toBeVisible();
  });

  test('should show basic columns when clicking "Basic Only"', async ({ page }) => {
    await page.waitForSelector('.teams-table', { timeout: 10000 });
    
    // First show all columns
    await page.click('#show-all');
    await page.waitForTimeout(500);
    
    // Then show basic only
    await page.click('#show-basic');
    await page.waitForTimeout(500);
    
    const basicColumns = await page.locator('.teams-table thead th').count();
    expect(basicColumns).toBe(4); // Position, Team, Points, Played
    
    await expect(page.locator('th:has-text("Pos")')).toBeVisible();
    await expect(page.locator('th:has-text("Team")')).toBeVisible();
    await expect(page.locator('th:has-text("Pts")')).toBeVisible();
    await expect(page.locator('th:has-text("P")')).toBeVisible();
  });

  test('should sort columns when clicking headers', async ({ page }) => {
    await page.waitForSelector('.teams-table', { timeout: 10000 });
    
    // Click on Points header to sort
    await page.click('th[data-column="points"]');
    await page.waitForTimeout(500);
    
    // Check sort indicator
    await expect(page.locator('th[data-column="points"] .sort-indicator')).toHaveClass(/asc|desc/);
    
    // Click again to reverse sort
    await page.click('th[data-column="points"]');
    await page.waitForTimeout(500);
    
    // Sort indicator should change
    await expect(page.locator('th[data-column="points"] .sort-indicator')).toHaveClass(/asc|desc/);
  });

  test('should export CSV when clicking export button', async ({ page }) => {
    await page.waitForSelector('.teams-table', { timeout: 10000 });
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download');
    
    await page.click('#export-csv');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('teams-advanced-stats.csv');
  });

  test('should navigate to team detail when clicking team link', async ({ page }) => {
    await page.waitForSelector('.teams-table', { timeout: 10000 });
    
    // Click on first team link
    const firstTeamLink = page.locator('.team-link').first();
    await expect(firstTeamLink).toBeVisible();
    
    // const teamName = await firstTeamLink.textContent();
    await firstTeamLink.click();
    
    // Should navigate to team detail page
    await expect(page).toHaveURL(/team-detail\.html\?team=/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await page.waitForSelector('.teams-table', { timeout: 10000 });
    
    // Table should be scrollable horizontally on mobile
    const tableContainer = page.locator('.table-container');
    await expect(tableContainer).toBeVisible();
    
    // Controls should be stacked vertically
    const controls = page.locator('.controls');
    await expect(controls).toBeVisible();
  });

  test('should meet accessibility standards', async ({ page }) => {
    await page.waitForSelector('.teams-table', { timeout: 10000 });
    
    // Run accessibility checks
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('should handle data loading errors gracefully', async ({ page }) => {
    // Intercept data requests and return error
    await page.route('**/data/**/*.json', route => {
      route.abort('failed');
    });
    
    await page.goto('/teams-advanced-stats.html');
    
    // Should show error message
    await expect(page.locator('.error-container')).toBeVisible();
    await expect(page.locator('.error-container h2')).toContainText('Error Loading Teams Data');
    
    // Should have retry button
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();
  });

  test('should display data source information', async ({ page }) => {
    await page.waitForSelector('.teams-table', { timeout: 10000 });
    
    // Check footer information
    await expect(page.locator('.stats-footer')).toBeVisible();
    await expect(page.locator('.stats-footer')).toContainText('Data last updated');
    await expect(page.locator('.stats-footer')).toContainText('Premier League Official Data');
  });
});
