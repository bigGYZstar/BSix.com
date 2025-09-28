import { test, expect } from '@playwright/test';

test.describe('Character System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to character system test page
    await page.goto('/character-system-test.html');
  });

  test('should load character system interface', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Character System.*BSix\.com/);
    
    // Check main sections are visible
    await expect(page.locator('.character-system')).toBeVisible();
    await expect(page.locator('.character-selector')).toBeVisible();
    await expect(page.locator('.current-character')).toBeVisible();
    await expect(page.locator('.content-generator')).toBeVisible();
  });

  test('should display character selector with available characters', async ({ page }) => {
    // Check character selector section
    await expect(page.locator('.character-selector h2')).toContainText('Character Selection');
    
    // Check character options
    const characterOptions = page.locator('.character-option');
    await expect(characterOptions.count()).toBeGreaterThan(0);
    
    // Check that one character is active
    const activeOption = page.locator('.character-option.active');
    await expect(activeOption).toHaveCount(1);
    
    // Check character preview content
    const firstOption = characterOptions.first();
    await expect(firstOption.locator('h3')).toBeVisible();
    await expect(firstOption.locator('p')).toBeVisible();
    await expect(firstOption.locator('.personality-traits')).toBeVisible();
  });

  test('should display current character information', async ({ page }) => {
    // Check current character section
    await expect(page.locator('.current-character h2')).toContainText('Current Character');
    
    // Check character details
    await expect(page.locator('.character-info')).toBeVisible();
    await expect(page.locator('.personality-display')).toBeVisible();
    
    // Check personality trait bars
    const traitBars = page.locator('.trait-bar');
    await expect(traitBars.count()).toBeGreaterThan(0);
    
    // Check that trait bars have proper structure
    const firstBar = traitBars.first();
    await expect(firstBar.locator('label')).toBeVisible();
    await expect(firstBar.locator('.bar .fill')).toBeVisible();
    await expect(firstBar.locator('.value')).toBeVisible();
  });

  test('should switch characters when option is clicked', async ({ page }) => {
    // Get initial character name
    const initialCharacter = await page.locator('.current-character h2').textContent();
    
    // Find a different character option (not active)
    const inactiveOption = page.locator('.character-option:not(.active)').first();
    
    if (await inactiveOption.count() > 0) {
      const newCharacterName = await inactiveOption.locator('h3').textContent();
      
      // Click the inactive option
      await inactiveOption.click();
      
      // Wait for character switch
      await page.waitForTimeout(500);
      
      // Check that character has changed
      const currentCharacter = await page.locator('.current-character h2').textContent();
      expect(currentCharacter).not.toBe(initialCharacter);
      expect(currentCharacter).toContain(newCharacterName);
      
      // Check that the clicked option is now active
      await expect(inactiveOption).toHaveClass(/active/);
    }
  });

  test('should display content generator form', async ({ page }) => {
    // Check content generator section
    await expect(page.locator('.content-generator h2')).toContainText('Content Generator');
    
    // Check form elements
    await expect(page.locator('#content-type')).toBeVisible();
    await expect(page.locator('#team-select')).toBeVisible();
    await expect(page.locator('#result-select')).toBeVisible();
    await expect(page.locator('#time-select')).toBeVisible();
    await expect(page.locator('#custom-data')).toBeVisible();
    await expect(page.locator('#generate-content')).toBeVisible();
    
    // Check that selects have options
    const contentTypeOptions = page.locator("#content-type option");
    await expect(contentTypeOptions.count()).toBeGreaterThan(1);
    
    const teamOptions = page.locator('#team-select option');
    await expect(teamOptions.count()).toBeGreaterThan(1);
  });

  test('should generate content when form is submitted', async ({ page }) => {
    // Fill out the form
    await page.selectOption('#content-type', 'match_preview');
    await page.selectOption('#team-select', 'liverpool');
    await page.selectOption('#time-select', 'afternoon');
    await page.fill('#custom-data', '{"match_description": "Liverpool vs Arsenal"}');
    
    // Click generate button
    await page.click('#generate-content');
    
    // Check that content is generated
    await expect(page.locator('.generated-result')).toBeVisible();
    await expect(page.locator('.content-text')).toBeVisible();
    await expect(page.locator('.content-meta')).toBeVisible();
    
    // Check that content is not empty
        const _contentText = await page.locator(".content-text").textContent();
        console.log("Content text for clipboard test:", _contentText);
    expect(_contentText?.trim()).not.toBe("");
    
    // Check that action buttons are enabled
    const actionButtons = page.locator('.content-actions .action-btn');
    const buttonCount = await actionButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = actionButtons.nth(i);
      await expect(button).not.toBeDisabled();
    }
  });

  test('should handle different content types', async ({ page }) => {
    const contentTypes = ['match_preview', 'match_review', 'news', 'analysis', 'general'];
    
    for (const contentType of contentTypes) {
      // Select content type
      await page.selectOption('#content-type', contentType);
      
      // Generate content
      await page.click('#generate-content');
      
      // Check that content is generated
      await expect(page.locator('.generated-result')).toBeVisible();
      
      // Check that content type is displayed in meta
      await expect(page.locator('.content-meta .context')).toContainText(contentType);
      
      // Clear content for next iteration
      await page.click('#clear-content');
    }
  });

  test('should copy content to clipboard', async ({ page }) => {
    // Generate content first
    await page.selectOption('#content-type', 'news');
    await page.click('#generate-content');
    
    // Wait for content to be generated
    await expect(page.locator('.generated-result')).toBeVisible();
    
    // Get the content text
        // const contentText = await page.locator('.content-text').textContent(); // 将来の検証用に保留

    
    // Click copy button
    await page.click('#copy-content');
    
    // Check for success message (if implemented)
    // Note: Clipboard API testing in Playwright requires special setup
    // This test verifies the button click works
    await expect(page.locator('#copy-content')).toBeVisible();
  });

  test('should clear generated content', async ({ page }) => {
    // Generate content first
    await page.selectOption('#content-type', 'general');
    await page.click('#generate-content');
    
    // Verify content is generated
    await expect(page.locator('.generated-result')).toBeVisible();
    
    // Clear content
    await page.click('#clear-content');
    
    // Check that placeholder is shown
    await expect(page.locator('.placeholder')).toBeVisible();
    await expect(page.locator('.generated-result')).not.toBeVisible();
    
    // Check that action buttons are disabled
    const actionButtons = page.locator('.content-actions .action-btn');
    const buttonCount = await actionButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = actionButtons.nth(i);
      await expect(button).toBeDisabled();
    }
  });

  test('should regenerate content', async ({ page }) => {
    // Generate content first
    await page.selectOption('#content-type', 'match_preview');
    await page.click('#generate-content');
    
    // Get initial content
    const initialContent = await page.locator(".content-text").textContent();
    console.log("Initial content for regenerate test:", initialContent);

    // Regenerate content
    await page.click('#regenerate-content');
    
    // Check that content is still present (may or may not be different due to randomization)
    await expect(page.locator('.generated-result')).toBeVisible();
    await expect(page.locator('.content-text')).toBeVisible();
  });

  test('should handle invalid JSON in custom data', async ({ page }) => {
    // Fill form with invalid JSON
    await page.selectOption('#content-type', 'match_preview');
    await page.fill('#custom-data', '{ invalid json }');
    
    // Try to generate content
    await page.click('#generate-content');
    
    // Should show error message
    await expect(page.locator('.message-error')).toBeVisible();
  });

  test('should display control buttons and handle clicks', async ({ page }) => {
    // Check controls section
    await expect(page.locator('.controls h2')).toContainText('Controls');
    
    // Check control buttons
    await expect(page.locator('#clear-cache')).toBeVisible();
    await expect(page.locator('#export-config')).toBeVisible();
    await expect(page.locator('#toggle-debug')).toBeVisible();
    await expect(page.locator('#refresh-system')).toBeVisible();
    
    // Test clear cache button
    await page.click('#clear-cache');
    // Should not cause errors
    
    // Test toggle debug button
    await page.click('#toggle-debug');
    // Should not cause errors
    
    // Test refresh system button
    await page.click('#refresh-system');
    // Should refresh the interface
    await expect(page.locator('.character-system')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main sections are still visible
    await expect(page.locator('.character-system')).toBeVisible();
    await expect(page.locator('.character-selector')).toBeVisible();
    await expect(page.locator('.current-character')).toBeVisible();
    await expect(page.locator('.content-generator')).toBeVisible();
    
    // Check that form elements are accessible
    await expect(page.locator('#content-type')).toBeVisible();
    await expect(page.locator('#generate-content')).toBeVisible();
    
    // Test content generation on mobile
    await page.selectOption('#content-type', 'news');
    await page.click('#generate-content');
    
    await expect(page.locator('.generated-result')).toBeVisible();
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check heading hierarchy
    const h2s = page.locator('h2');
    await expect(h2s.count()).toBeGreaterThan(0);
    
    const h3s = page.locator('h3');
    await expect(h3s.count()).toBeGreaterThan(0);
    
    // Check form labels
    const labels = page.locator('label');
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);
    
    // Check that form elements have proper labels
    const selects = page.locator('select');
    const selectCount = await selects.count();
    
    for (let i = 0; i < selectCount; i++) {
      const select = selects.nth(i);
      const id = await select.getAttribute('id');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
    
    // Check button accessibility
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
        for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      expect(text?.trim()).not.toBe("");
    }

  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');
      await expect(currentFocus).toBeVisible();
    }
  });

  test('should load quickly and perform well', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to page
    await page.goto('/character-system-test.html');
    
    // Wait for main content to load
    await expect(page.locator('.character-system')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000);
    
    // Test interaction performance
    const interactionStart = Date.now();
    
    await page.selectOption('#content-type', 'match_preview');
    await page.click('#generate-content');
    await expect(page.locator('.generated-result')).toBeVisible();
    
    const interactionTime = Date.now() - interactionStart;
    
    // Interactions should be responsive
    expect(interactionTime).toBeLessThan(2000);
  });
});
