/**
 * BSix.com Theme Switcher
 * Handles switching between BBC Sport and NOTHING design systems
 */

class BSixThemeSwitcher {
  constructor() {
    this.currentTheme = 'bbc'; // Default theme
    this.themes = {
      bbc: {
        name: 'BBC Sport',
        cssFiles: [
          '../assets/css/bbc-style-common.css',
          '../assets/css/design-system.css'
        ],
        jsFiles: [
          '../assets/js/bbc-header.js'
        ],
        bodyClass: 'bbc-theme'
      },
      nothing: {
        name: 'NOTHING',
        cssFiles: [
          '../assets/css/nothing-style-core.css'
        ],
        jsFiles: [
          '../assets/js/nothing-style-controller.js'
        ],
        bodyClass: 'nothing-theme'
      }
    };
    
    this.init();
  }

  /**
   * Initialize theme switcher
   */
  init() {
    this.loadSavedTheme();
    this.createThemeToggle();
    this.setupEventListeners();
    this.applyTheme(this.currentTheme);
  }

  /**
   * Load saved theme from localStorage
   */
  loadSavedTheme() {
    const savedTheme = localStorage.getItem('bsix-theme-preference');
    if (savedTheme && this.themes[savedTheme]) {
      this.currentTheme = savedTheme;
    }
  }

  /**
   * Save theme preference to localStorage
   */
  saveThemePreference() {
    localStorage.setItem('bsix-theme-preference', this.currentTheme);
  }

  /**
   * Create theme toggle button
   */
  createThemeToggle() {
    // Remove existing toggle if present
    const existingToggle = document.getElementById('theme-switcher');
    if (existingToggle) {
      existingToggle.remove();
    }

    const toggle = document.createElement('div');
    toggle.id = 'theme-switcher';
    toggle.className = 'theme-switcher';
    toggle.innerHTML = `
      <button class="theme-toggle-btn" id="theme-toggle-btn">
        <span class="theme-icon">🎨</span>
        <span class="theme-text">${this.getAlternativeThemeName()}</span>
      </button>
    `;

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
      .theme-switcher {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .theme-toggle-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
      }

      .theme-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }

      .theme-toggle-btn:active {
        transform: scale(0.95);
      }

      .theme-icon {
        font-size: 16px;
        transition: transform 0.3s ease;
      }

      .theme-toggle-btn:hover .theme-icon {
        transform: rotate(180deg);
      }

      /* BBC Theme specific styles */
      .bbc-theme .theme-toggle-btn {
        background: rgba(0, 0, 0, 0.1);
        border-color: rgba(0, 0, 0, 0.2);
        color: #000000;
      }

      .bbc-theme .theme-toggle-btn:hover {
        background: rgba(0, 0, 0, 0.2);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      }

      /* NOTHING Theme specific styles */
      .nothing-theme .theme-toggle-btn {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }

      .nothing-theme .theme-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }

      /* Animation for theme switching */
      .theme-switching {
        pointer-events: none;
        opacity: 0.7;
      }

      .theme-switching .theme-icon {
        animation: theme-switch-spin 0.5s ease-in-out;
      }

      @keyframes theme-switch-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(toggle);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle-btn')) {
        this.switchTheme();
      }
    });

    // Listen for keyboard shortcut (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.switchTheme();
      }
    });
  }

  /**
   * Switch to alternative theme
   */
  switchTheme() {
    const newTheme = this.currentTheme === 'bbc' ? 'nothing' : 'bbc';
    this.applyTheme(newTheme);
  }

  /**
   * Apply specific theme
   */
  applyTheme(themeName) {
    if (!this.themes[themeName]) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }

    // Add switching animation
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.classList.add('theme-switching');
    }

    // Remove current theme classes
    Object.values(this.themes).forEach(theme => {
      document.body.classList.remove(theme.bodyClass);
    });

    // Apply new theme
    this.currentTheme = themeName;
    const theme = this.themes[themeName];
    
    // Add new theme class
    document.body.classList.add(theme.bodyClass);

    // Update CSS files
    this.updateStylesheets(theme.cssFiles);

    // Update JavaScript files
    this.updateScripts(theme.jsFiles);

    // Update toggle button text
    this.updateToggleButton();

    // Save preference
    this.saveThemePreference();

    // Dispatch theme change event
    this.dispatchThemeChangeEvent();

    // Remove switching animation
    setTimeout(() => {
      if (toggleBtn) {
        toggleBtn.classList.remove('theme-switching');
      }
    }, 500);
  }

  /**
   * Update stylesheets for current theme
   */
  updateStylesheets(cssFiles) {
    // Remove existing theme stylesheets
    const existingThemeStyles = document.querySelectorAll('link[data-theme-css]');
    existingThemeStyles.forEach(link => link.remove());

    // Add new theme stylesheets
    cssFiles.forEach(cssFile => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssFile;
      link.setAttribute('data-theme-css', 'true');
      document.head.appendChild(link);
    });
  }

  /**
   * Update scripts for current theme
   */
  updateScripts(jsFiles) {
    // Remove existing theme scripts
    const existingThemeScripts = document.querySelectorAll('script[data-theme-js]');
    existingThemeScripts.forEach(script => script.remove());

    // Add new theme scripts
    jsFiles.forEach(jsFile => {
      const script = document.createElement('script');
      script.src = jsFile;
      script.setAttribute('data-theme-js', 'true');
      document.head.appendChild(script);
    });
  }

  /**
   * Update toggle button text
   */
  updateToggleButton() {
    const toggleText = document.querySelector('.theme-text');
    if (toggleText) {
      toggleText.textContent = this.getAlternativeThemeName();
    }
  }

  /**
   * Get alternative theme name for toggle button
   */
  getAlternativeThemeName() {
    const alternativeTheme = this.currentTheme === 'bbc' ? 'nothing' : 'bbc';
    return this.themes[alternativeTheme].name;
  }

  /**
   * Dispatch theme change event
   */
  dispatchThemeChangeEvent() {
    const event = new CustomEvent('bsixThemeChanged', {
      detail: {
        theme: this.currentTheme,
        themeName: this.themes[this.currentTheme].name,
        timestamp: Date.now()
      }
    });

    document.dispatchEvent(event);
  }

  /**
   * Get current theme info
   */
  getCurrentTheme() {
    return {
      name: this.currentTheme,
      displayName: this.themes[this.currentTheme].name,
      config: this.themes[this.currentTheme]
    };
  }

  /**
   * Check if specific theme is active
   */
  isThemeActive(themeName) {
    return this.currentTheme === themeName;
  }

  /**
   * Get available themes
   */
  getAvailableThemes() {
    return Object.keys(this.themes).map(key => ({
      name: key,
      displayName: this.themes[key].name
    }));
  }

  /**
   * Force theme without animation
   */
  forceTheme(themeName) {
    if (!this.themes[themeName]) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }

    // Remove all theme classes
    Object.values(this.themes).forEach(theme => {
      document.body.classList.remove(theme.bodyClass);
    });

    // Apply new theme immediately
    this.currentTheme = themeName;
    const theme = this.themes[themeName];
    document.body.classList.add(theme.bodyClass);

    // Update stylesheets and scripts
    this.updateStylesheets(theme.cssFiles);
    this.updateScripts(theme.jsFiles);

    // Update toggle button
    this.updateToggleButton();

    // Save preference
    this.saveThemePreference();

    // Dispatch event
    this.dispatchThemeChangeEvent();
  }
}

// Initialize theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize global theme switcher
  window.bsixThemeSwitcher = new BSixThemeSwitcher();

  // Add global keyboard shortcut info
  console.log('BSix Theme Switcher initialized. Press Ctrl/Cmd + Shift + T to switch themes.');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BSixThemeSwitcher;
}
