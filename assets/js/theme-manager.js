/**
 * BSix.com Simplified Theme Manager
 * A robust, simple, and reliable theme switcher.
 */
document.addEventListener("DOMContentLoaded", () => {
    const THEME_STORAGE_KEY = 'bsix-theme-preference-v2';
    const THEMES = ['bbc-theme', 'nothing-theme'];

    // Use existing button from HTML instead of creating new one
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    
    if (!themeToggleButton) {
        console.error('Theme toggle button not found');
        return;
    }

    let currentThemeIndex = 0;

    // 1. Load saved theme or use default
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && THEMES.includes(savedTheme)) {
        currentThemeIndex = THEMES.indexOf(savedTheme);
    } else {
        // Default to BBC theme if nothing is saved
        currentThemeIndex = 0; 
    }

    // 2. Apply the loaded theme
    applyTheme(THEMES[currentThemeIndex]);

    // 3. Setup event listener
    themeToggleButton.addEventListener('click', () => {
        // Cycle to the next theme
        currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
        const newTheme = THEMES[currentThemeIndex];
        applyTheme(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    });

    /**
     * Applies the selected theme to the body.
     * @param {string} themeClass The class name of the theme to apply.
     */
    function applyTheme(themeClass) {
        // Remove all possible theme classes
        THEMES.forEach(t => document.body.classList.remove(t));
        // Add the new theme class
        document.body.classList.add(themeClass);
        updateButtonText(themeClass);
        console.log(`Theme applied: ${themeClass}`);
    }

    /**
     * Updates the button text based on the current theme.
     * @param {string} activeThemeClass The currently active theme class.
     */
    function updateButtonText(activeThemeClass) {
        if (activeThemeClass === 'bbc-theme') {
            themeToggleButton.textContent = 'Switch to NOTHING';
        } else {
            themeToggleButton.textContent = 'Switch to BBC';
        }
    }
});
