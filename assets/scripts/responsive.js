// BSix.com - Responsive and Device Detection Module
// Enhanced device detection and responsive behavior

class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        };
        
        this.currentDevice = null;
        this.currentOrientation = null;
        this.isTouch = false;
        this.isRetina = false;
        
        this.init();
    }

    init() {
        this.detectDevice();
        this.detectCapabilities();
        this.setupEventListeners();
        this.applyDeviceClasses();
        this.initializeResponsiveFeatures();
    }

    detectDevice() {
        const width = window.innerWidth;
        const userAgent = navigator.userAgent;
        
        // Device type detection
        if (width <= this.breakpoints.mobile) {
            this.currentDevice = 'mobile';
        } else if (width <= this.breakpoints.tablet) {
            this.currentDevice = 'tablet';
        } else {
            this.currentDevice = 'desktop';
        }
        
        // More specific device detection
        this.deviceInfo = {
            isIOS: /iPad|iPhone|iPod/.test(userAgent),
            isAndroid: /Android/.test(userAgent),
            isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
            isChrome: /Chrome/.test(userAgent),
            isFirefox: /Firefox/.test(userAgent),
            isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isTablet: /iPad|Android(?!.*Mobile)/i.test(userAgent)
        };
        
        // Orientation detection
        this.currentOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    detectCapabilities() {
        // Touch capability
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Retina display
        this.isRetina = window.devicePixelRatio > 1;
        
        // Network information
        if ('connection' in navigator) {
            this.networkInfo = {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                saveData: navigator.connection.saveData
            };
        }
        
        // Performance capabilities
        this.performanceInfo = {
            memory: navigator.deviceMemory || 4,
            cores: navigator.hardwareConcurrency || 4
        };
    }

    setupEventListeners() {
        // Resize listener with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });
        
        // Orientation change listener
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Network change listener
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.handleNetworkChange();
            });
        }
        
        // Visibility change for performance optimization
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    handleResize() {
        const oldDevice = this.currentDevice;
        this.detectDevice();
        
        if (oldDevice !== this.currentDevice) {
            this.applyDeviceClasses();
            this.triggerDeviceChange(oldDevice, this.currentDevice);
        }
        
        this.updateViewportUnits();
        this.adjustLayoutForDevice();
    }

    handleOrientationChange() {
        const oldOrientation = this.currentOrientation;
        this.currentOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        
        if (oldOrientation !== this.currentOrientation) {
            this.applyOrientationClasses();
            this.triggerOrientationChange(oldOrientation, this.currentOrientation);
        }
    }

    handleNetworkChange() {
        if ('connection' in navigator) {
            this.networkInfo = {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                saveData: navigator.connection.saveData
            };
            
            this.adjustForNetworkConditions();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseNonEssentialFeatures();
        } else {
            this.resumeFeatures();
        }
    }

    applyDeviceClasses() {
        const body = document.body;
        
        // Remove old device classes
        body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        body.classList.remove('touch-device', 'no-touch');
        body.classList.remove('retina', 'non-retina');
        
        // Add current device class
        body.classList.add(`device-${this.currentDevice}`);
        body.classList.add(this.isTouch ? 'touch-device' : 'no-touch');
        body.classList.add(this.isRetina ? 'retina' : 'non-retina');
        
        // Add specific device classes
        if (this.deviceInfo.isIOS) body.classList.add('ios');
        if (this.deviceInfo.isAndroid) body.classList.add('android');
        if (this.deviceInfo.isSafari) body.classList.add('safari');
        if (this.deviceInfo.isChrome) body.classList.add('chrome');
        if (this.deviceInfo.isFirefox) body.classList.add('firefox');
        
        this.applyOrientationClasses();
    }

    applyOrientationClasses() {
        const body = document.body;
        body.classList.remove('orientation-portrait', 'orientation-landscape');
        body.classList.add(`orientation-${this.currentOrientation}`);
    }

    initializeResponsiveFeatures() {
        this.initializeMobileFeatures();
        this.initializeTabletFeatures();
        this.initializeDesktopFeatures();
        this.optimizeForPerformance();
    }

    initializeMobileFeatures() {
        if (this.currentDevice === 'mobile') {
            this.enableMobileOptimizations();
            this.setupTouchGestures();
            this.setupMobileNavigation();
            this.optimizeImagesForMobile();
        }
    }

    initializeTabletFeatures() {
        if (this.currentDevice === 'tablet') {
            this.enableTabletOptimizations();
            this.setupTabletLayout();
        }
    }

    initializeDesktopFeatures() {
        if (this.currentDevice === 'desktop') {
            this.enableDesktopOptimizations();
            this.setupDesktopInteractions();
        }
    }

    enableMobileOptimizations() {
        // Add mobile-specific classes to elements
        document.querySelectorAll('.match-card').forEach(card => {
            card.classList.add('mobile-layout');
        });
        
        document.querySelectorAll('.team').forEach(team => {
            team.classList.add('mobile-layout');
        });
        
        document.querySelectorAll('.match-vs').forEach(vs => {
            vs.classList.add('mobile-layout');
        });
        
        document.querySelectorAll('.btn').forEach(btn => {
            btn.classList.add('mobile-layout');
        });
        
        document.querySelectorAll('.stat-card').forEach(card => {
            card.classList.add('mobile-layout');
        });
        
        // Enable mobile-specific features
        this.enablePullToRefresh();
        this.enableSwipeGestures();
        this.optimizeScrolling();
    }

    enableTabletOptimizations() {
        // Tablet-specific optimizations
        document.body.classList.add('tablet-layout');
        
        // Adjust grid layouts for tablet
        const matchesContainer = document.querySelector('.matches-container');
        if (matchesContainer) {
            matchesContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        }
        
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) {
            statsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        }
    }

    enableDesktopOptimizations() {
        // Desktop-specific optimizations
        document.body.classList.add('desktop-layout');
        
        // Enable hover effects
        this.enableHoverEffects();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Enable advanced animations
        this.enableAdvancedAnimations();
    }

    setupTouchGestures() {
        if (!this.isTouch) return;
        
        let startX, startY, currentX, currentY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.handleSwipeLeft();
                } else {
                    this.handleSwipeRight();
                }
            }
            
            // Vertical swipe
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
                if (diffY > 0) {
                    this.handleSwipeUp();
                } else {
                    this.handleSwipeDown();
                }
            }
            
            startX = startY = currentX = currentY = null;
        }, { passive: true });
    }

    setupMobileNavigation() {
        // Enhanced mobile navigation
        const navLinks = document.querySelectorAll('.nav-mobile-link');
        navLinks.forEach(link => {
            link.addEventListener('touchstart', () => {
                link.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.style.transform = '';
                }, 150);
            }, { passive: true });
        });
    }

    enablePullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let isPulling = false;
        
        const refreshThreshold = 80;
        const mainContent = document.querySelector('.main-content');
        
        if (!mainContent) return;
        
        // Create pull-to-refresh indicator
        const indicator = document.createElement('div');
        indicator.className = 'pull-to-refresh-indicator';
        indicator.innerHTML = '<span class="pull-to-refresh-icon">↓</span>';
        mainContent.prepend(indicator);
        
        mainContent.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        mainContent.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            currentY = e.touches[0].clientY;
            const pullDistance = currentY - startY;
            
            if (pullDistance > 0 && pullDistance < refreshThreshold * 2) {
                indicator.style.transform = `translateY(${Math.min(pullDistance - 60, refreshThreshold)}px)`;
                indicator.style.opacity = Math.min(pullDistance / refreshThreshold, 1);
                
                if (pullDistance > refreshThreshold) {
                    indicator.classList.add('active');
                    indicator.querySelector('.pull-to-refresh-icon').textContent = '↻';
                } else {
                    indicator.classList.remove('active');
                    indicator.querySelector('.pull-to-refresh-icon').textContent = '↓';
                }
            }
        }, { passive: true });
        
        mainContent.addEventListener('touchend', () => {
            if (!isPulling) return;
            
            const pullDistance = currentY - startY;
            
            if (pullDistance > refreshThreshold) {
                this.triggerRefresh();
                indicator.classList.add('loading');
                indicator.querySelector('.pull-to-refresh-icon').textContent = '↻';
            }
            
            // Reset
            setTimeout(() => {
                indicator.style.transform = '';
                indicator.style.opacity = '';
                indicator.classList.remove('active', 'loading');
                indicator.querySelector('.pull-to-refresh-icon').textContent = '↓';
            }, 300);
            
            isPulling = false;
            startY = currentY = 0;
        }, { passive: true });
    }

    enableSwipeGestures() {
        // Add swipe indicators to match cards
        document.querySelectorAll('.match-card').forEach(card => {
            const indicator = document.createElement('div');
            indicator.className = 'swipe-indicator';
            indicator.textContent = 'スワイプ';
            card.style.position = 'relative';
            card.appendChild(indicator);
        });
    }

    optimizeScrolling() {
        // Smooth scrolling for mobile
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Optimize scroll performance
        let ticking = false;
        
        const updateScrollPosition = () => {
            // Update scroll-dependent elements
            this.updateScrollEffects();
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }, { passive: true });
    }

    updateScrollEffects() {
        const scrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    enableHoverEffects() {
        if (this.isTouch) return;
        
        // Enable hover effects for non-touch devices
        document.querySelectorAll('.match-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.navigatePrevious();
                    break;
                case 'ArrowRight':
                    this.navigateNext();
                    break;
                case 'Enter':
                    this.activateCurrentItem();
                    break;
                case 'Escape':
                    this.closeModal();
                    break;
            }
        });
    }

    optimizeForPerformance() {
        // Reduce animations on low-end devices
        if (this.performanceInfo.memory < 4 || this.performanceInfo.cores < 4) {
            document.body.classList.add('reduced-motion');
        }
        
        // Optimize for slow networks
        if (this.networkInfo && (this.networkInfo.effectiveType === 'slow-2g' || this.networkInfo.effectiveType === '2g')) {
            document.body.classList.add('slow-network');
            this.enableDataSaving();
        }
        
        // Battery optimization
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2) {
                    document.body.classList.add('low-battery');
                    this.enablePowerSaving();
                }
            });
        }
    }

    adjustForNetworkConditions() {
        if (!this.networkInfo) return;
        
        const body = document.body;
        body.classList.remove('slow-network', 'fast-network');
        
        if (this.networkInfo.effectiveType === '4g' && this.networkInfo.downlink > 10) {
            body.classList.add('fast-network');
        } else if (this.networkInfo.effectiveType === 'slow-2g' || this.networkInfo.effectiveType === '2g') {
            body.classList.add('slow-network');
            this.enableDataSaving();
        }
    }

    enableDataSaving() {
        // Reduce image quality
        document.querySelectorAll('img').forEach(img => {
            if (img.dataset.lowRes) {
                img.src = img.dataset.lowRes;
            }
        });
        
        // Disable non-essential animations
        document.body.classList.add('data-saver');
    }

    enablePowerSaving() {
        // Reduce animation frequency
        document.body.classList.add('power-saver');
        
        // Pause non-essential features
        this.pauseNonEssentialFeatures();
    }

    pauseNonEssentialFeatures() {
        // Pause animations
        document.querySelectorAll('.loading-spinner').forEach(spinner => {
            spinner.style.animationPlayState = 'paused';
        });
        
        // Reduce update frequency
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    resumeFeatures() {
        // Resume animations
        document.querySelectorAll('.loading-spinner').forEach(spinner => {
            spinner.style.animationPlayState = 'running';
        });
        
        // Resume updates
        this.startPeriodicUpdates();
    }

    updateViewportUnits() {
        // Fix viewport height issues on mobile
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    adjustLayoutForDevice() {
        const app = document.getElementById('app');
        if (!app) return;
        
        switch (this.currentDevice) {
            case 'mobile':
                app.classList.add('mobile-layout');
                app.classList.remove('tablet-layout', 'desktop-layout');
                break;
            case 'tablet':
                app.classList.add('tablet-layout');
                app.classList.remove('mobile-layout', 'desktop-layout');
                break;
            case 'desktop':
                app.classList.add('desktop-layout');
                app.classList.remove('mobile-layout', 'tablet-layout');
                break;
        }
    }

    // Event handlers for gestures
    handleSwipeLeft() {
        // Navigate to next page or item
        console.log('Swipe left detected');
    }

    handleSwipeRight() {
        // Navigate to previous page or item
        console.log('Swipe right detected');
    }

    handleSwipeUp() {
        // Scroll up or show more content
        console.log('Swipe up detected');
    }

    handleSwipeDown() {
        // Scroll down or refresh
        console.log('Swipe down detected');
    }

    // Navigation methods
    navigatePrevious() {
        console.log('Navigate previous');
    }

    navigateNext() {
        console.log('Navigate next');
    }

    activateCurrentItem() {
        console.log('Activate current item');
    }

    closeModal() {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    triggerRefresh() {
        // Trigger data refresh
        if (window.bsixApp && window.bsixApp.refreshData) {
            window.bsixApp.refreshData();
        }
    }

    triggerDeviceChange(oldDevice, newDevice) {
        // Dispatch custom event
        const event = new CustomEvent('devicechange', {
            detail: { oldDevice, newDevice }
        });
        window.dispatchEvent(event);
    }

    triggerOrientationChange(oldOrientation, newOrientation) {
        // Dispatch custom event
        const event = new CustomEvent('orientationchange', {
            detail: { oldOrientation, newOrientation }
        });
        window.dispatchEvent(event);
    }

    startPeriodicUpdates() {
        this.updateInterval = setInterval(() => {
            if (!document.hidden) {
                // Perform periodic updates
                this.updateScrollEffects();
            }
        }, 1000);
    }

    // Public API
    getCurrentDevice() {
        return this.currentDevice;
    }

    getCurrentOrientation() {
        return this.currentOrientation;
    }

    isDeviceTouch() {
        return this.isTouch;
    }

    isDeviceRetina() {
        return this.isRetina;
    }

    getDeviceInfo() {
        return {
            device: this.currentDevice,
            orientation: this.currentOrientation,
            isTouch: this.isTouch,
            isRetina: this.isRetina,
            ...this.deviceInfo,
            network: this.networkInfo,
            performance: this.performanceInfo
        };
    }
}

// Initialize responsive manager
const responsiveManager = new ResponsiveManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.responsiveManager = responsiveManager;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveManager;
}
