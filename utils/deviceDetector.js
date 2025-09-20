/**
 * デバイス検出とレスポンシブ対応ユーティリティ
 * スマホ版・PC版の自動切り替えを管理
 */

class DeviceDetector {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        };
        
        this.currentDevice = this.detectDevice();
        this.setupEventListeners();
    }

    /**
     * デバイスタイプを検出
     */
    detectDevice() {
        const width = window.innerWidth;
        const userAgent = navigator.userAgent.toLowerCase();
        
        // ユーザーエージェントベースの検出
        const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isTabletUA = /ipad|android(?!.*mobile)/i.test(userAgent);
        
        // 画面サイズベースの検出
        if (width < this.breakpoints.mobile) {
            return 'mobile';
        } else if (width < this.breakpoints.tablet) {
            return isMobileUA ? 'mobile' : 'tablet';
        } else if (width < this.breakpoints.desktop) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    /**
     * モバイルデバイスかどうか判定
     */
    isMobile() {
        return this.currentDevice === 'mobile';
    }

    /**
     * タブレットデバイスかどうか判定
     */
    isTablet() {
        return this.currentDevice === 'tablet';
    }

    /**
     * デスクトップデバイスかどうか判定
     */
    isDesktop() {
        return this.currentDevice === 'desktop';
    }

    /**
     * タッチデバイスかどうか判定
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * 現在のデバイスタイプを取得
     */
    getCurrentDevice() {
        return this.currentDevice;
    }

    /**
     * 画面の向きを取得
     */
    getOrientation() {
        if (window.innerHeight > window.innerWidth) {
            return 'portrait';
        } else {
            return 'landscape';
        }
    }

    /**
     * ビューポートサイズを取得
     */
    getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    /**
     * デバイス固有のCSSクラスを適用
     */
    applyDeviceClasses() {
        const body = document.body;
        
        // 既存のデバイスクラスを削除
        body.classList.remove('device-mobile', 'device-tablet', 'device-desktop', 'touch-device', 'no-touch');
        
        // 新しいクラスを追加
        body.classList.add(`device-${this.currentDevice}`);
        
        if (this.isTouchDevice()) {
            body.classList.add('touch-device');
        } else {
            body.classList.add('no-touch');
        }
        
        // 向きのクラスを追加
        body.classList.add(`orientation-${this.getOrientation()}`);
    }

    /**
     * レスポンシブ画像のソースを選択
     */
    getResponsiveImageSrc(imageSources) {
        if (this.isMobile()) {
            return imageSources.mobile || imageSources.default;
        } else if (this.isTablet()) {
            return imageSources.tablet || imageSources.default;
        } else {
            return imageSources.desktop || imageSources.default;
        }
    }

    /**
     * デバイス固有の設定を取得
     */
    getDeviceConfig() {
        const baseConfig = {
            mobile: {
                itemsPerPage: 3,
                cardLayout: 'vertical',
                showSidebar: false,
                useBottomTabs: true,
                touchOptimized: true,
                fontSize: 'small'
            },
            tablet: {
                itemsPerPage: 6,
                cardLayout: 'grid',
                showSidebar: true,
                useBottomTabs: false,
                touchOptimized: true,
                fontSize: 'medium'
            },
            desktop: {
                itemsPerPage: 9,
                cardLayout: 'grid',
                showSidebar: true,
                useBottomTabs: false,
                touchOptimized: false,
                fontSize: 'large'
            }
        };

        return baseConfig[this.currentDevice] || baseConfig.desktop;
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newDevice = this.detectDevice();
                if (newDevice !== this.currentDevice) {
                    this.currentDevice = newDevice;
                    this.applyDeviceClasses();
                    this.onDeviceChange(newDevice);
                }
            }, 250);
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.applyDeviceClasses();
                this.onOrientationChange(this.getOrientation());
            }, 100);
        });
    }

    /**
     * デバイス変更時のコールバック
     */
    onDeviceChange(newDevice) {
        // カスタムイベントを発火
        const event = new CustomEvent('devicechange', {
            detail: {
                oldDevice: this.currentDevice,
                newDevice: newDevice,
                config: this.getDeviceConfig()
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * 画面向き変更時のコールバック
     */
    onOrientationChange(orientation) {
        // カスタムイベントを発火
        const event = new CustomEvent('orientationchange', {
            detail: {
                orientation: orientation,
                viewport: this.getViewportSize()
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * パフォーマンス最適化のためのプリロード判定
     */
    shouldPreloadImages() {
        // モバイルデバイスでは画像のプリロードを制限
        return !this.isMobile() || navigator.connection?.effectiveType === '4g';
    }

    /**
     * アニメーション使用可否の判定
     */
    shouldUseAnimations() {
        // パフォーマンスやユーザー設定を考慮
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return !prefersReducedMotion && (this.isDesktop() || this.isTablet());
    }

    /**
     * 初期化
     */
    init() {
        this.applyDeviceClasses();
        
        // デバイス情報をコンソールに出力（デバッグ用）
        console.log('Device Detection:', {
            device: this.currentDevice,
            viewport: this.getViewportSize(),
            orientation: this.getOrientation(),
            touchDevice: this.isTouchDevice(),
            config: this.getDeviceConfig()
        });
    }
}

// グローバルインスタンスを作成
const deviceDetector = new DeviceDetector();

// DOMContentLoaded時に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => deviceDetector.init());
} else {
    deviceDetector.init();
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceDetector;
} else {
    window.DeviceDetector = DeviceDetector;
    window.deviceDetector = deviceDetector;
}
