/**
 * BSix.com エンゲージメント機能
 * 滞在時間向上とユーザー体験改善のための機能群
 */

class EngagementFeatures {
    constructor() {
        this.readingTime = 0;
        this.scrollDepth = 0;
        this.interactions = 0;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        this.trackScrollDepth();
        this.trackReadingTime();
        this.initRelatedContent();
        this.initStickyNavigation();
        this.initProgressBar();
        this.initTooltips();
        this.initLazyLoading();
    }

    // スクロール深度追跡
    trackScrollDepth() {
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.scrollDepth = maxScroll;
            }
        });
    }

    // 読書時間追跡
    trackReadingTime() {
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.readingTime += 1;
            }
        }, 1000);
    }

    // 関連コンテンツ表示
    initRelatedContent() {
        const relatedContentData = {
            'liverpool': [
                {
                    title: 'アーセナル vs リヴァプール 試合プレビュー',
                    url: 'match-preview.html?match=arsenal-liverpool',
                    type: '試合プレビュー',
                    readTime: '5分'
                },
                {
                    title: 'プレミアリーグ順位表',
                    url: 'stats.html',
                    type: '順位表',
                    readTime: '3分'
                },
                {
                    title: 'モハメド・サラー 選手詳細',
                    url: 'player-detail.html?player=salah',
                    type: '選手情報',
                    readTime: '4分'
                }
            ],
            'arsenal': [
                {
                    title: 'アーセナル vs マンチェスター・シティ プレビュー',
                    url: 'match-preview.html?match=arsenal-city',
                    type: '試合プレビュー',
                    readTime: '5分'
                },
                {
                    title: 'ブカヨ・サカ 選手詳細',
                    url: 'player-detail.html?player=saka',
                    type: '選手情報',
                    readTime: '4分'
                },
                {
                    title: 'Big 6 チーム比較',
                    url: 'stats.html#big6-comparison',
                    type: '統計',
                    readTime: '6分'
                }
            ],
            'chelsea': [
                {
                    title: 'チェルシー 移籍情報まとめ',
                    url: 'transfer-news.html?team=chelsea',
                    type: '移籍情報',
                    readTime: '7分'
                },
                {
                    title: 'ニコラス・ジャクソン 選手詳細',
                    url: 'player-detail.html?player=jackson',
                    type: '選手情報',
                    readTime: '4分'
                },
                {
                    title: 'プレミアリーグ得点ランキング',
                    url: 'stats.html#top-scorers',
                    type: '統計',
                    readTime: '3分'
                }
            ],
            'default': [
                {
                    title: 'プレミアリーグ最新ニュース',
                    url: 'news.html',
                    type: 'ニュース',
                    readTime: '8分'
                },
                {
                    title: '今週の注目試合',
                    url: 'fixtures.html',
                    type: '試合情報',
                    readTime: '5分'
                },
                {
                    title: 'Big 6 チーム詳細',
                    url: 'teams.html',
                    type: 'チーム情報',
                    readTime: '10分'
                }
            ]
        };

        window.showRelatedContent = (containerId, teamKey = 'default') => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const content = relatedContentData[teamKey] || relatedContentData.default;
            
            container.innerHTML = `
                <div class="related-content-section">
                    <h3 style="color: #667eea; margin-bottom: 20px; text-align: center;">
                        📚 関連コンテンツ
                    </h3>
                    <div class="related-content-grid">
                        ${content.map(item => `
                            <div class="related-content-item" onclick="navigateToContent('${item.url}')">
                                <div class="content-type">${item.type}</div>
                                <h4>${item.title}</h4>
                                <div class="read-time">📖 読了時間: ${item.readTime}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // CSS スタイルを追加
            if (!document.getElementById('related-content-styles')) {
                const style = document.createElement('style');
                style.id = 'related-content-styles';
                style.textContent = `
                    .related-content-section {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border-radius: 20px;
                        padding: 25px;
                        margin-bottom: 30px;
                        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    }
                    
                    .related-content-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 20px;
                    }
                    
                    .related-content-item {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 15px;
                        cursor: pointer;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .related-content-item:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
                    }
                    
                    .related-content-item::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                        transition: left 0.5s;
                    }
                    
                    .related-content-item:hover::before {
                        left: 100%;
                    }
                    
                    .content-type {
                        background: rgba(255, 255, 255, 0.2);
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-size: 0.8rem;
                        display: inline-block;
                        margin-bottom: 10px;
                    }
                    
                    .related-content-item h4 {
                        font-size: 1.1rem;
                        margin-bottom: 10px;
                        line-height: 1.4;
                    }
                    
                    .read-time {
                        font-size: 0.9rem;
                        opacity: 0.8;
                    }
                    
                    @media (max-width: 768px) {
                        .related-content-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        };

        window.navigateToContent = (url) => {
            this.interactions++;
            window.location.href = url;
        };
    }

    // スティッキーナビゲーション
    initStickyNavigation() {
        const stickyNav = document.createElement('div');
        stickyNav.className = 'sticky-navigation';
        stickyNav.innerHTML = `
            <div class="sticky-nav-content">
                <button onclick="window.location.href='index.html'" class="nav-item">
                    🏠 ホーム
                </button>
                <button onclick="window.location.href='stats.html'" class="nav-item">
                    📊 順位表
                </button>
                <button onclick="window.location.href='fixtures.html'" class="nav-item">
                    ⚽ 試合
                </button>
                <button onclick="window.location.href='teams.html'" class="nav-item">
                    👥 チーム
                </button>
            </div>
        `;

        // スティッキーナビのスタイル
        const stickyStyle = document.createElement('style');
        stickyStyle.textContent = `
            .sticky-navigation {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 25px;
                padding: 10px 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .sticky-navigation.visible {
                opacity: 1;
            }
            
            .sticky-nav-content {
                display: flex;
                gap: 15px;
            }
            
            .nav-item {
                background: none;
                border: none;
                padding: 8px 12px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: background 0.3s ease;
            }
            
            .nav-item:hover {
                background: rgba(102, 126, 234, 0.1);
            }
            
            @media (max-width: 768px) {
                .sticky-navigation {
                    bottom: 10px;
                    left: 10px;
                    right: 10px;
                    transform: none;
                }
                
                .sticky-nav-content {
                    justify-content: space-around;
                }
                
                .nav-item {
                    font-size: 0.8rem;
                    padding: 6px 8px;
                }
            }
        `;
        document.head.appendChild(stickyStyle);
        document.body.appendChild(stickyNav);

        // スクロールで表示/非表示
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                stickyNav.classList.add('visible');
            } else {
                stickyNav.classList.remove('visible');
            }
            lastScrollY = window.scrollY;
        });
    }

    // 読書進捗バー
    initProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';

        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .reading-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                z-index: 9999;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 0%;
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(progressStyle);
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.querySelector('.progress-fill').style.width = `${Math.min(scrollPercent, 100)}%`;
        });
    }

    // ツールチップ機能
    initTooltips() {
        // チーム名や選手名にホバーでツールチップを表示
        const tooltipData = {
            'リヴァプール': 'プレミアリーグ現在1位。アルネ・スロット監督のもと4戦全勝の完璧なスタート。',
            'アーセナル': 'プレミアリーグ現在2位。ミケル・アルテタ監督率いる若い才能あふれるチーム。',
            'チェルシー': 'プレミアリーグ現在11位。エンツォ・マレスカ監督のもと再建中。',
            'マンチェスター・シティ': 'プレミアリーグ現在8位。ペップ・グアルディオラ監督の戦術的マスターピース。',
            'モハメド・サラー': 'リヴァプールの右ウィンガー。プレミアリーグ得点王候補の一人。',
            'ブカヨ・サカ': 'アーセナルの右ウィンガー。イングランド代表の若きスター。'
        };

        // ツールチップスタイル
        const tooltipStyle = document.createElement('style');
        tooltipStyle.textContent = `
            .tooltip {
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 0.8rem;
                max-width: 200px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .tooltip.visible {
                opacity: 1;
            }
            
            .tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
            }
        `;
        document.head.appendChild(tooltipStyle);

        // ツールチップ要素を作成
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);

        // コンテンツテキストにツールチップを追加
        document.addEventListener('DOMContentLoaded', () => {
            const contentElements = document.querySelectorAll('.content-text, .stat-label, .player-name, h1, h2, h3');
            
            contentElements.forEach(element => {
                const text = element.textContent;
                Object.keys(tooltipData).forEach(key => {
                    if (text.includes(key)) {
                        element.style.cursor = 'help';
                        element.addEventListener('mouseenter', (e) => {
                            tooltip.textContent = tooltipData[key];
                            tooltip.style.left = e.pageX + 'px';
                            tooltip.style.top = (e.pageY - 40) + 'px';
                            tooltip.classList.add('visible');
                        });
                        
                        element.addEventListener('mouseleave', () => {
                            tooltip.classList.remove('visible');
                        });
                    }
                });
            });
        });
    }

    // 遅延読み込み
    initLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const src = element.dataset.lazy;
                    
                    if (element.tagName === 'IMG') {
                        element.src = src;
                    } else {
                        element.style.backgroundImage = `url(${src})`;
                    }
                    
                    element.classList.add('loaded');
                    observer.unobserve(element);
                }
            });
        });
        
        lazyElements.forEach(element => observer.observe(element));
    }

    // エンゲージメント統計を取得
    getEngagementStats() {
        return {
            readingTime: this.readingTime,
            scrollDepth: this.scrollDepth,
            interactions: this.interactions,
            sessionDuration: Math.round((Date.now() - this.startTime) / 1000)
        };
    }
}

// グローバルに初期化
window.engagementFeatures = new EngagementFeatures();

// ページ離脱時に統計を送信（実際の実装では分析サービスに送信）
window.addEventListener('beforeunload', () => {
    const stats = window.engagementFeatures.getEngagementStats();
    console.log('エンゲージメント統計:', stats);
    
    // 実際の実装では Google Analytics や他の分析サービスに送信
    // gtag('event', 'engagement', {
    //     reading_time: stats.readingTime,
    //     scroll_depth: stats.scrollDepth,
    //     interactions: stats.interactions,
    //     session_duration: stats.sessionDuration
    // });
});
