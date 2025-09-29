/**
 * BSix.com Smooth Theme Manager
 * Optimized for fast, smooth theme switching with minimal lag
 */

class SmoothThemeManager {
    constructor() {
        this.THEME_STORAGE_KEY = 'bsix-theme-v3';
        this.themes = ['bbc-theme', 'nothing-theme'];
        this.currentThemeIndex = 0;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupExistingButtons();
        this.addOptimizedStyles();
        this.applyTheme(this.themes[this.currentThemeIndex], false);
    }

    addOptimizedStyles() {
        // Add minimal, optimized transition styles
        const style = document.createElement('style');
        style.id = 'smooth-theme-styles';
        style.textContent = `
            /* Optimized theme transitions - only for essential elements */
            body {
                transition: background-color 0.2s ease, color 0.2s ease !important;
            }
            
            .main-header, .main-content, .card {
                transition: background-color 0.2s ease, border-color 0.2s ease !important;
            }
            
            /* Button hover effects */
            .theme-toggle-btn {
                transition: transform 0.1s ease, box-shadow 0.1s ease !important;
                cursor: pointer;
            }
            
            .theme-toggle-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            
            .theme-toggle-btn:active {
                transform: translateY(0);
                transition: transform 0.05s ease !important;
            }
            
            /* Disable transitions during theme switch to prevent lag */
            body.theme-switching * {
                transition: none !important;
            }
        `;
        
        // Remove existing style if present
        const existingStyle = document.getElementById('smooth-theme-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.currentThemeIndex = this.themes.indexOf(savedTheme);
        } else {
            this.currentThemeIndex = 0; // Default to BBC theme
        }
    }

    setupExistingButtons() {
        // Find all existing theme toggle buttons
        const buttons = document.querySelectorAll('#theme-toggle-btn, button[class*="theme"]');
        
        buttons.forEach(button => {
            // Remove existing event listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add optimized event listener
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTheme();
            }, { passive: false });
            
            // Add keyboard support
            newButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.switchTheme();
                }
            }, { passive: false });
        });
    }

    switchTheme() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Cycle to next theme
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        const newTheme = this.themes[this.currentThemeIndex];
        
        this.applyTheme(newTheme, true);
        
        // Reset transition flag quickly
        setTimeout(() => {
            this.isTransitioning = false;
        }, 250);
    }

    applyTheme(themeClass, withTransition = true) {
        const body = document.body;
        
        if (withTransition) {
            // Temporarily disable all transitions for instant switch
            body.classList.add('theme-switching');
        }
        
        // Remove all theme classes instantly
        this.themes.forEach(theme => body.classList.remove(theme));
        
        // Apply new theme instantly
        body.classList.add(themeClass);
        
        // Update button text
        this.updateButtonText(themeClass);
        
        // Save preference
        localStorage.setItem(this.THEME_STORAGE_KEY, themeClass);
        
        if (withTransition) {
            // Re-enable transitions after a minimal delay
            requestAnimationFrame(() => {
                body.classList.remove('theme-switching');
            });
        }
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeClass }
        }));
    }

    updateButtonText(themeClass) {
        const buttons = document.querySelectorAll('#theme-toggle-btn');
        buttons.forEach(button => {
            if (themeClass === 'bbc-theme') {
                button.textContent = 'Switch to NOTHING';
            } else {
                button.textContent = 'Switch to BBC';
            }
        });
    }

    // Public API
    getCurrentTheme() {
        return this.themes[this.currentThemeIndex];
    }

    setTheme(themeName) {
        const themeIndex = this.themes.indexOf(themeName);
        if (themeIndex !== -1) {
            this.currentThemeIndex = themeIndex;
            this.applyTheme(themeName, true);
        }
    }
}

// Initialize immediately when script loads
let themeManager;

function initThemeManager() {
    if (!themeManager) {
        themeManager = new SmoothThemeManager();
        window.bsixThemeManager = themeManager;
    }
}

// Initialize based on document state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeManager);
} else {
    initThemeManager();
}

// Export for global access
window.SmoothThemeManager = SmoothThemeManager;
