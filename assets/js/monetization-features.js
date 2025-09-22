/**
 * BSix.com 収益化機能
 * 広告最適化、ユーザーエンゲージメント、収益向上のための機能群
 */

class MonetizationFeatures {
    constructor() {
        this.adViewability = new Map();
        this.userSegment = 'default';
        this.sessionValue = 0;
        this.conversionTracking = [];
        this.init();
    }

    init() {
        this.initAdOptimization();
        this.initUserSegmentation();
        this.initNewsletterSignup();
        this.initSocialSharing();
        this.initPushNotifications();
        this.initAffiliateLinks();
        this.initPremiumContent();
        this.initAnalytics();
    }

    // 広告最適化
    initAdOptimization() {
        // 広告の視認性追跡
        const adContainers = document.querySelectorAll('.ad-container');
        
        const adObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const adId = entry.target.id || 'ad-' + Math.random().toString(36).substr(2, 9);
                
                if (entry.isIntersecting) {
                    this.adViewability.set(adId, {
                        viewStart: Date.now(),
                        viewable: true
                    });
                    
                    // 実際の広告を読み込み（遅延読み込み）
                    this.loadRealAd(entry.target);
                } else {
                    const adData = this.adViewability.get(adId);
                    if (adData && adData.viewable) {
                        adData.viewDuration = Date.now() - adData.viewStart;
                        adData.viewable = false;
                        this.adViewability.set(adId, adData);
                    }
                }
            });
        }, {
            threshold: 0.5 // 50%以上表示された場合
        });

        adContainers.forEach(ad => {
            adObserver.observe(ad);
            
            // 広告クリック追跡
            ad.addEventListener('click', () => {
                this.trackAdClick(ad);
            });
        });

        // 広告ブロッカー検出
        this.detectAdBlocker();
    }

    // 実際の広告を読み込み
    loadRealAd(container) {
        // 実際の実装では Google AdSense, Amazon Associates などの広告コードを挿入
        const adType = container.classList.contains('ad-header') ? 'header' :
                      container.classList.contains('ad-sidebar') ? 'sidebar' :
                      container.classList.contains('ad-inline') ? 'inline' : 'footer';
        
        // デモ用の広告コンテンツ
        const adContent = this.generateAdContent(adType);
        container.innerHTML = adContent;
        
        // 実際の実装例:
        // if (window.googletag) {
        //     googletag.cmd.push(() => {
        //         googletag.display(container.id);
        //     });
        // }
    }

    // 広告コンテンツ生成（デモ用）
    generateAdContent(type) {
        const adTemplates = {
            header: `
                <div class="real-ad-content" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px;">
                    <h3>⚽ プレミアリーグ公式グッズ</h3>
                    <p>お気に入りチームのユニフォームを今すぐチェック！</p>
                    <button style="background: white; color: #667eea; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">詳細を見る</button>
                </div>
            `,
            sidebar: `
                <div class="real-ad-content" style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; text-align: center; border-radius: 8px;">
                    <h4>📱 BSix.com アプリ</h4>
                    <p>最新情報をプッシュ通知で受け取ろう</p>
                    <button style="background: #667eea; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">ダウンロード</button>
                </div>
            `,
            inline: `
                <div class="real-ad-content" style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4); color: white; padding: 15px; text-align: center; border-radius: 8px;">
                    <h4>🎯 スポーツベッティング</h4>
                    <p>プレミアリーグの試合予想で楽しもう</p>
                    <small>※18歳以上、責任を持ってお楽しみください</small>
                </div>
            `,
            footer: `
                <div class="real-ad-content" style="background: #343a40; color: white; padding: 15px; text-align: center; border-radius: 8px;">
                    <h4>📺 DAZN でプレミアリーグを観戦</h4>
                    <p>全試合ライブ配信・見逃し配信対応</p>
                </div>
            `
        };
        
        return adTemplates[type] || adTemplates.sidebar;
    }

    // 広告ブロッカー検出
    detectAdBlocker() {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        testAd.style.position = 'absolute';
        testAd.style.left = '-10000px';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
            if (testAd.offsetHeight === 0) {
                this.showAdBlockerMessage();
            }
            document.body.removeChild(testAd);
        }, 100);
    }

    // 広告ブロッカーメッセージ表示
    showAdBlockerMessage() {
        const message = document.createElement('div');
        message.className = 'adblocker-message';
        message.innerHTML = `
            <div style="background: rgba(255, 193, 7, 0.9); color: #333; padding: 15px; text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 10000;">
                <p><strong>📢 広告ブロッカーが検出されました</strong></p>
                <p>BSix.comは広告収入によって運営されています。広告ブロッカーを無効にしていただけると助かります。</p>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #333; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">閉じる</button>
            </div>
        `;
        document.body.appendChild(message);
    }

    // ユーザーセグメンテーション
    initUserSegmentation() {
        // ユーザーの行動パターンに基づいてセグメント化
        const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
        localStorage.setItem('visitCount', visitCount.toString());
        
        const favoriteTeam = localStorage.getItem('favoriteTeam');
        const readingHistory = JSON.parse(localStorage.getItem('readingHistory') || '[]');
        
        // セグメント決定
        if (visitCount >= 10) {
            this.userSegment = 'loyal';
        } else if (favoriteTeam) {
            this.userSegment = 'engaged';
        } else if (visitCount >= 3) {
            this.userSegment = 'returning';
        } else {
            this.userSegment = 'new';
        }
        
        // セグメント別のコンテンツ最適化
        this.optimizeContentForSegment();
    }

    // セグメント別コンテンツ最適化
    optimizeContentForSegment() {
        const body = document.body;
        body.setAttribute('data-user-segment', this.userSegment);
        
        switch (this.userSegment) {
            case 'loyal':
                this.showPremiumUpgrade();
                break;
            case 'engaged':
                this.showPersonalizedContent();
                break;
            case 'returning':
                this.showNewsletterSignup();
                break;
            case 'new':
                this.showWelcomeMessage();
                break;
        }
    }

    // ニュースレター登録
    initNewsletterSignup() {
        // ページ滞在時間が30秒を超えたらニュースレター登録を促す
        setTimeout(() => {
            if (!localStorage.getItem('newsletterSignup') && this.userSegment !== 'loyal') {
                this.showNewsletterModal();
            }
        }, 30000);
    }

    showNewsletterModal() {
        const modal = document.createElement('div');
        modal.className = 'newsletter-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()" style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; margin: 50px auto; position: relative;">
                    <button onclick="this.closest('.newsletter-modal').remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                    <h3 style="color: #667eea; margin-bottom: 15px;">📧 最新情報をお届け</h3>
                    <p style="margin-bottom: 20px; color: #666;">プレミアリーグの最新ニュース、移籍情報、試合分析を週2回お届けします。</p>
                    <form onsubmit="window.monetizationFeatures.subscribeNewsletter(event)">
                        <input type="email" placeholder="メールアドレス" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px;">
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                                <input type="checkbox" name="favorite-team" value="liverpool"> リヴァプール
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                                <input type="checkbox" name="favorite-team" value="arsenal"> アーセナル
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                                <input type="checkbox" name="favorite-team" value="chelsea"> チェルシー
                            </label>
                        </div>
                        <button type="submit" style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">登録する</button>
                    </form>
                </div>
            </div>
        `;
        
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .newsletter-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
            }
            .modal-overlay {
                background: rgba(0, 0, 0, 0.5);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(modalStyle);
        document.body.appendChild(modal);
    }

    subscribeNewsletter(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const favoriteTeams = formData.getAll('favorite-team');
        
        // 実際の実装では メール配信サービス（Mailchimp, SendGrid等）のAPIを呼び出し
        console.log('ニュースレター登録:', { email, favoriteTeams });
        
        localStorage.setItem('newsletterSignup', 'true');
        localStorage.setItem('favoriteTeam', favoriteTeams[0] || '');
        
        // 成功メッセージ
        event.target.innerHTML = `
            <div style="text-align: center; color: #27ae60;">
                <h3>✅ 登録完了！</h3>
                <p>ありがとうございます。最新情報をお届けします。</p>
            </div>
        `;
        
        setTimeout(() => {
            document.querySelector('.newsletter-modal').remove();
        }, 2000);
    }

    // ソーシャルシェア機能
    initSocialSharing() {
        // シェアボタンを動的に追加
        const shareButtons = document.createElement('div');
        shareButtons.className = 'social-share-buttons';
        shareButtons.innerHTML = `
            <div class="share-container" style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 1000;">
                <button onclick="window.monetizationFeatures.shareOnTwitter()" class="share-btn twitter" style="display: block; margin-bottom: 10px; width: 50px; height: 50px; border-radius: 50%; border: none; background: #1DA1F2; color: white; cursor: pointer; font-size: 1.2rem;">🐦</button>
                <button onclick="window.monetizationFeatures.shareOnFacebook()" class="share-btn facebook" style="display: block; margin-bottom: 10px; width: 50px; height: 50px; border-radius: 50%; border: none; background: #4267B2; color: white; cursor: pointer; font-size: 1.2rem;">📘</button>
                <button onclick="window.monetizationFeatures.shareOnLine()" class="share-btn line" style="display: block; margin-bottom: 10px; width: 50px; height: 50px; border-radius: 50%; border: none; background: #00B900; color: white; cursor: pointer; font-size: 1.2rem;">💬</button>
                <button onclick="window.monetizationFeatures.copyLink()" class="share-btn copy" style="display: block; width: 50px; height: 50px; border-radius: 50%; border: none; background: #6c757d; color: white; cursor: pointer; font-size: 1.2rem;">🔗</button>
            </div>
        `;
        document.body.appendChild(shareButtons);
    }

    shareOnTwitter() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.title + ' - BSix.com');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        this.trackSocialShare('twitter');
    }

    shareOnFacebook() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        this.trackSocialShare('facebook');
    }

    shareOnLine() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.title);
        window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank');
        this.trackSocialShare('line');
    }

    copyLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            this.showToast('リンクをコピーしました！');
            this.trackSocialShare('copy');
        });
    }

    // プッシュ通知
    initPushNotifications() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            // サービスワーカー登録は実際の実装で行う
            // navigator.serviceWorker.register('/sw.js');
        }
    }

    // アフィリエイトリンク
    initAffiliateLinks() {
        // 外部リンクにアフィリエイトタグを追加
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
        
        externalLinks.forEach(link => {
            const originalHref = link.href;
            
            // Amazon商品リンクの場合
            if (originalHref.includes('amazon.')) {
                link.href = this.addAmazonAffiliateTag(originalHref);
            }
            
            // クリック追跡
            link.addEventListener('click', () => {
                this.trackAffiliateClick(originalHref);
            });
        });
    }

    addAmazonAffiliateTag(url) {
        // 実際のアフィリエイトタグを追加
        const affiliateTag = 'bsixcom-22'; // 実際のアフィリエイトIDに置き換え
        return url + (url.includes('?') ? '&' : '?') + `tag=${affiliateTag}`;
    }

    // プレミアムコンテンツ
    initPremiumContent() {
        if (this.userSegment === 'loyal') {
            this.showPremiumFeatures();
        }
    }

    showPremiumFeatures() {
        // プレミアム機能のUI要素を表示
        const premiumBadge = document.createElement('div');
        premiumBadge.innerHTML = `
            <div style="position: fixed; top: 80px; right: 20px; background: linear-gradient(135deg, #FFD700, #FFA500); color: #333; padding: 8px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; z-index: 1000;">
                ⭐ プレミアム会員
            </div>
        `;
        document.body.appendChild(premiumBadge);
    }

    // 分析・追跡
    initAnalytics() {
        // ページビュー追跡
        this.trackPageView();
        
        // ユーザー行動追跡
        this.trackUserBehavior();
    }

    trackPageView() {
        // 実際の実装では Google Analytics, Adobe Analytics等を使用
        console.log('ページビュー:', {
            page: window.location.pathname,
            title: document.title,
            userSegment: this.userSegment,
            timestamp: new Date().toISOString()
        });
    }

    trackUserBehavior() {
        // スクロール深度追跡
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
            }
        });
        
        // ページ離脱時に統計送信
        window.addEventListener('beforeunload', () => {
            this.sendAnalytics({
                maxScrollDepth: maxScroll,
                timeOnPage: Date.now() - this.startTime,
                userSegment: this.userSegment,
                adViews: Array.from(this.adViewability.values())
            });
        });
    }

    trackAdClick(adElement) {
        console.log('広告クリック:', {
            adType: adElement.className,
            timestamp: new Date().toISOString(),
            userSegment: this.userSegment
        });
    }

    trackSocialShare(platform) {
        console.log('ソーシャルシェア:', {
            platform: platform,
            page: window.location.pathname,
            userSegment: this.userSegment
        });
    }

    trackAffiliateClick(url) {
        console.log('アフィリエイトクリック:', {
            url: url,
            userSegment: this.userSegment
        });
    }

    sendAnalytics(data) {
        // 実際の実装では分析サービスのAPIに送信
        console.log('分析データ送信:', data);
    }

    // ユーティリティ
    showToast(message) {
        const toast = document.createElement('div');
        toast.innerHTML = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translateY(20px); }
                10%, 90% { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 3000);
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showToast('BSix.comへようこそ！プレミアリーグの最新情報をお楽しみください。');
        }, 2000);
    }

    showPersonalizedContent() {
        const favoriteTeam = localStorage.getItem('favoriteTeam');
        if (favoriteTeam) {
            setTimeout(() => {
                this.showToast(`${favoriteTeam}の最新情報をチェックしましょう！`);
            }, 1000);
        }
    }

    showPremiumUpgrade() {
        // ロイヤルユーザー向けのプレミアム機能案内
        setTimeout(() => {
            this.showToast('⭐ プレミアム会員限定コンテンツが利用可能です！');
        }, 1500);
    }
}

// グローバルに初期化
window.monetizationFeatures = new MonetizationFeatures();
