/**
 * Enhanced BSix.com Theme Switcher with Mobile Support
 * Handles switching between BBC Sport and NOTHING design systems
 * Optimized for mobile devices and touch interactions
 */

class EnhancedBSixThemeSwitcher {
  constructor() {
    this.currentTheme = 'bbc'; // Default theme
    this.isInitialized = false;
    this.touchStartTime = 0;
    this.themes = {
      bbc: {
        name: 'BBC Sport',
        displayName: 'BBC Sport',
        bodyClass: 'bbc-theme',
        toggleText: 'NOTHING'
      },
      nothing: {
        name: 'NOTHING',
        displayName: 'NOTHING',
        bodyClass: 'nothing-theme',
        toggleText: 'BBC Sport'
      }
    };
    
    this.init();
  }

  /**
   * Initialize theme switcher
   */
  init() {
    if (this.isInitialized) return;
    
    this.loadSavedTheme();
    this.createThemeToggle();
    this.setupEventListeners();
    this.applyTheme(this.currentTheme, false);
    this.isInitialized = true;
    
    console.log('Enhanced BSix Theme Switcher initialized');
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
   * Create enhanced theme toggle button
   */
  createThemeToggle() {
    // Remove existing toggle if present
    const existingToggle = document.getElementById('theme-switcher');
    if (existingToggle) {
      existingToggle.remove();
    }

    const toggle = document.createElement('div');
    toggle.id = 'theme-switcher';
    toggle.className = 'enhanced-theme-switcher';
    toggle.innerHTML = `
      <button class="enhanced-theme-toggle-btn" id="enhanced-theme-toggle-btn" 
              aria-label="テーマを切り替え" 
              role="button" 
              tabindex="0">
        <span class="theme-icon" aria-hidden="true">🎨</span>
        <span class="theme-text">${this.getToggleText()}</span>
      </button>
    `;

    // Add enhanced CSS styles
    this.addEnhancedStyles();
    
    document.body.appendChild(toggle);
  }

  /**
   * Add enhanced CSS styles for mobile optimization
   */
  addEnhancedStyles() {
    const existingStyle = document.getElementById('enhanced-theme-switcher-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'enhanced-theme-switcher-styles';
    style.textContent = `
      .enhanced-theme-switcher {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .enhanced-theme-toggle-btn {
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
        outline: none;
        
        /* Enhanced mobile touch support */
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        touch-action: manipulation;
        
        /* Minimum touch target size for accessibility */
        min-height: 44px;
        min-width: 44px;
        
        /* Prevent text selection */
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
      }

      .enhanced-theme-toggle-btn:hover,
      .enhanced-theme-toggle-btn:focus {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }

      .enhanced-theme-toggle-btn:active {
        transform: scale(0.95);
        transition: transform 0.1s ease;
      }

      .enhanced-theme-toggle-btn.switching {
        pointer-events: none;
        opacity: 0.7;
      }

      .theme-icon {
        font-size: 16px;
        transition: transform 0.3s ease;
        display: inline-block;
      }

      .enhanced-theme-toggle-btn:hover .theme-icon {
        transform: rotate(180deg);
      }

      .enhanced-theme-toggle-btn.switching .theme-icon {
        animation: theme-switch-spin 0.5s ease-in-out;
      }

      /* BBC Theme specific styles */
      .bbc-theme .enhanced-theme-toggle-btn {
        background: rgba(0, 0, 0, 0.1);
        border-color: rgba(0, 0, 0, 0.2);
        color: #000000;
      }

      .bbc-theme .enhanced-theme-toggle-btn:hover,
      .bbc-theme .enhanced-theme-toggle-btn:focus {
        background: rgba(0, 0, 0, 0.2);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      }

      /* NOTHING Theme specific styles */
      .nothing-theme .enhanced-theme-toggle-btn {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }

      .nothing-theme .enhanced-theme-toggle-btn:hover,
      .nothing-theme .enhanced-theme-toggle-btn:focus {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }

      /* Mobile responsive adjustments */
      @media (max-width: 768px) {
        .enhanced-theme-switcher {
          top: 15px;
          right: 15px;
        }
        
        .enhanced-theme-toggle-btn {
          padding: 10px 14px;
          font-size: 13px;
          min-height: 48px; /* Larger touch target for mobile */
          min-width: 48px;
        }
        
        .theme-icon {
          font-size: 18px;
        }
      }

      /* Animations */
      @keyframes theme-switch-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Loading overlay */
      .theme-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .theme-loading-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .theme-loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid #ffffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Setup enhanced event listeners with mobile support
   */
  setupEventListeners() {
    const toggleBtn = document.getElementById('enhanced-theme-toggle-btn');
    if (!toggleBtn) return;

    // Enhanced click handler with debouncing
    let clickTimeout = null;
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
      
      clickTimeout = setTimeout(() => {
        this.switchTheme();
      }, 50);
    };

    // Mouse events
    toggleBtn.addEventListener('click', handleClick);

    // Enhanced touch events for mobile
    let touchStarted = false;
    
    toggleBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      touchStarted = true;
      this.touchStartTime = Date.now();
      toggleBtn.style.transform = 'scale(0.95)';
    }, { passive: false });

    toggleBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (touchStarted) {
        const touchDuration = Date.now() - this.touchStartTime;
        
        // Only trigger if touch was quick (not a long press)
        if (touchDuration < 500) {
          this.switchTheme();
        }
        
        toggleBtn.style.transform = '';
        touchStarted = false;
      }
    }, { passive: false });

    toggleBtn.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      toggleBtn.style.transform = '';
      touchStarted = false;
    }, { passive: false });

    // Keyboard support
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.switchTheme();
      }
    });

    // Global keyboard shortcut (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.switchTheme();
      }
    });

    // Prevent context menu on long press (mobile)
    toggleBtn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  /**
   * Switch to alternative theme
   */
  switchTheme() {
    const toggleBtn = document.getElementById('enhanced-theme-toggle-btn');
    if (toggleBtn && toggleBtn.classList.contains('switching')) {
      return; // Prevent multiple rapid switches
    }

    const newTheme = this.currentTheme === 'bbc' ? 'nothing' : 'bbc';
    this.applyTheme(newTheme, true);
  }

  /**
   * Apply specific theme with enhanced animations
   */
  applyTheme(themeName, showLoading = true) {
    if (!this.themes[themeName]) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }

    const toggleBtn = document.getElementById('enhanced-theme-toggle-btn');
    
    if (showLoading && toggleBtn) {
      toggleBtn.classList.add('switching');
      this.showLoading();
    }

    // Remove current theme classes
    Object.values(this.themes).forEach(theme => {
      document.body.classList.remove(theme.bodyClass);
    });

    // Apply new theme
    this.currentTheme = themeName;
    const theme = this.themes[themeName];
    document.body.classList.add(theme.bodyClass);

    // Update toggle button text
    this.updateToggleButton();

    // Save preference
    this.saveThemePreference();

    // Dispatch theme change event
    this.dispatchThemeChangeEvent();

    // Remove loading state
    if (showLoading) {
      setTimeout(() => {
        this.hideLoading();
        if (toggleBtn) {
          toggleBtn.classList.remove('switching');
        }
      }, 500);
    }
  }

  /**
   * Update toggle button text
   */
  updateToggleButton() {
    const toggleText = document.querySelector('.theme-text');
    if (toggleText) {
      toggleText.textContent = this.getToggleText();
    }
  }

  /**
   * Get toggle button text for current theme
   */
  getToggleText() {
    return this.themes[this.currentTheme].toggleText;
  }

  /**
   * Show loading overlay
   */
  showLoading() {
    let loadingOverlay = document.getElementById('theme-loading-overlay');
    
    if (!loadingOverlay) {
      loadingOverlay = document.createElement('div');
      loadingOverlay.id = 'theme-loading-overlay';
      loadingOverlay.className = 'theme-loading-overlay';
      loadingOverlay.innerHTML = '<div class="theme-loading-spinner"></div>';
      document.body.appendChild(loadingOverlay);
    }
    
    loadingOverlay.classList.add('active');
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    const loadingOverlay = document.getElementById('theme-loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('active');
    }
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
   * Force theme without animation (for initialization)
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

    // Update toggle button
    this.updateToggleButton();

    // Save preference
    this.saveThemePreference();

    // Dispatch event
    this.dispatchThemeChangeEvent();
  }

  /**
   * Destroy theme switcher
   */
  destroy() {
    const toggle = document.getElementById('theme-switcher');
    const styles = document.getElementById('enhanced-theme-switcher-styles');
    const loading = document.getElementById('theme-loading-overlay');
    
    if (toggle) toggle.remove();
    if (styles) styles.remove();
    if (loading) loading.remove();
    
    this.isInitialized = false;
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize enhanced theme switcher
  if (!window.enhancedBsixThemeSwitcher) {
    window.enhancedBsixThemeSwitcher = new EnhancedBSixThemeSwitcher();
  }

  // Add global keyboard shortcut info
  console.log('Enhanced BSix Theme Switcher initialized. Press Ctrl/Cmd + Shift + T to switch themes.');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedBSixThemeSwitcher;
}
