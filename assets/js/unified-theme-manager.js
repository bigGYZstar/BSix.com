// Unified Theme Manager for BSix.com
// Handles theme switching between BBC Sport and NOTHING styles

class UnifiedThemeManager {
    constructor() {
        this.THEME_STORAGE_KEY = 'bsix-theme-preference';
        this.themes = {
            bbc: 'bbc-theme',
            nothing: 'nothing-theme'
        };
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.createThemeSwitcher();
        this.applyInitialTheme();
        this.bindEvents();
        this.addTransitionStyles();
    }

    addTransitionStyles() {
        // Add smooth transition styles for theme switching
        const style = document.createElement('style');
        style.textContent = `
            body, body * {
                transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                           color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                           border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                           box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            #theme-toggle-btn {
                position: relative;
                overflow: hidden;
            }
            
            #theme-toggle-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease;
            }
            
            #theme-toggle-btn.ripple::before {
                width: 300px;
                height: 300px;
            }
        `;
        document.head.appendChild(style);
    }

    createThemeSwitcher() {
        // Check if theme switcher already exists
        if (document.getElementById('theme-switcher')) {
            return;
        }

        const themeSwitcher = document.createElement('div');
        themeSwitcher.id = 'theme-switcher';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.innerHTML = `
            <span class="theme-icon">█▓▒░</span>
            <span class="theme-text">PIXEL</span>
        `;
        
        themeSwitcher.appendChild(toggleBtn);
        document.body.appendChild(themeSwitcher);
    }

    getCurrentTheme() {
        const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
        return savedTheme === 'nothing' ? 'nothing' : 'bbc';
    }

    applyTheme(theme, withAnimation = true) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const body = document.body;
        
        if (withAnimation) {
            // Add ripple effect to button
            const button = document.getElementById('theme-toggle-btn');
            if (button) {
                button.classList.add('ripple');
                setTimeout(() => button.classList.remove('ripple'), 300);
            }
            
            // Add fade effect during transition
            body.style.opacity = '0.95';
            setTimeout(() => {
                body.style.opacity = '1';
            }, 200);
        }
        
        // Remove all theme classes
        Object.values(this.themes).forEach(themeClass => {
            body.classList.remove(themeClass);
        });
        
        // Apply new theme with slight delay for smooth transition
        setTimeout(() => {
            body.classList.add(this.themes[theme]);
            
            // Save preference
            localStorage.setItem(this.THEME_STORAGE_KEY, theme);
            
            // Update button
            this.updateButton(theme);
            
            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme } 
            }));
            
            this.isTransitioning = false;
        }, withAnimation ? 100 : 0);
    }

    updateButton(theme) {
        const button = document.getElementById('theme-toggle-btn');
        if (button) {
            const icon = button.querySelector('.theme-icon');
            const text = button.querySelector('.theme-text');
            
            if (theme === 'bbc') {
                if (icon) icon.textContent = '█▓▒░';
                if (text) text.textContent = 'PIXEL';
            } else {
                if (icon) icon.textContent = '▓▒░█';
                if (text) text.textContent = 'BBC';
            }
        }
    }

    applyInitialTheme() {
        const initialTheme = this.getCurrentTheme();
        this.applyTheme(initialTheme, false);
    }

    bindEvents() {
        const button = document.getElementById('theme-toggle-btn');
        if (button) {
            // Remove any existing listeners
            button.replaceWith(button.cloneNode(true));
            const newButton = document.getElementById('theme-toggle-btn');
            
            // Click event
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isTransitioning) return;
                
                const currentTheme = this.getCurrentTheme();
                const newTheme = currentTheme === 'bbc' ? 'nothing' : 'bbc';
                this.applyTheme(newTheme);
            });

            // Touch events for mobile
            newButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.isTransitioning) return;
                
                const currentTheme = this.getCurrentTheme();
                const newTheme = currentTheme === 'bbc' ? 'nothing' : 'bbc';
                this.applyTheme(newTheme);
            });

            // Keyboard support
            newButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (this.isTransitioning) return;
                    
                    const currentTheme = this.getCurrentTheme();
                    const newTheme = currentTheme === 'bbc' ? 'nothing' : 'bbc';
                    this.applyTheme(newTheme);
                }
            });
        }
    }

    // Public method to manually switch theme
    switchTheme(theme) {
        if (this.themes[theme]) {
            this.applyTheme(theme);
        }
    }

    // Public method to get current theme
    getTheme() {
        return this.getCurrentTheme();
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bsixThemeManager = new UnifiedThemeManager();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bsixThemeManager = new UnifiedThemeManager();
    });
} else {
    window.bsixThemeManager = new UnifiedThemeManager();
}
