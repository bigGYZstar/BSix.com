/**
 * BSix.com インタラクティブ要素とレスポンシブ機能
 * BBC SportとArsenal-chanのデザインパターンを参考にした要素を実装
 */

document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションの初期化
    initNavigation();
    
    // アニメーション要素の初期化
    initAnimations();
    
    // インタラクティブカードの初期化
    initInteractiveCards();
    
    // モバイルメニューの初期化
    initMobileMenu();
    
    // スムーズスクロールの初期化
    initSmoothScroll();
    
    // ローディングアニメーションの終了
    setTimeout(function() {
        document.body.classList.add('loaded');
    }, 300);
});

/**
 * ナビゲーション機能の初期化
 */
function initNavigation() {
    // アクティブなナビゲーションアイテムをハイライト
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a, .nav-tabs a, .nav-card a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.classList.add('active');
            
            // 親要素にもアクティブクラスを追加
            if (link.parentElement.classList.contains('nav-tab')) {
                link.parentElement.classList.add('active');
            }
        }
    });
    
    // タブナビゲーションの処理
    const tabButtons = document.querySelectorAll('.nav-tab, .gameweek-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // データ属性からターゲットを取得
            const target = this.getAttribute('data-target');
            if (target) {
                e.preventDefault();
                
                // 同じグループの全てのボタンからアクティブクラスを削除
                const group = this.getAttribute('data-group') || 'default';
                document.querySelectorAll(`[data-group="${group}"]`).forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // クリックされたボタンにアクティブクラスを追加
                this.classList.add('active');
                
                // ターゲットコンテンツを表示
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(target).classList.add('active');
            }
        });
    });
}

/**
 * アニメーション要素の初期化
 */
function initAnimations() {
    // スクロールアニメーションの設定
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    
    // Intersection Observerの設定
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 監視対象の要素を登録
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // ホバーアニメーションの設定
    const hoverElements = document.querySelectorAll('.hover-effect');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });
}

/**
 * インタラクティブカードの初期化
 */
function initInteractiveCards() {
    // マッチカードのインタラクション
    const matchCards = document.querySelectorAll('.match-card');
    matchCards.forEach(card => {
        card.addEventListener('click', function() {
            const matchId = this.getAttribute('data-match-id');
            if (matchId) {
                window.location.href = `match-preview.html?match=${matchId}`;
            }
        });
        
        // タッチデバイス用のインタラクション
        card.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
    
    // チームカードのインタラクション
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('click', function() {
            const teamId = this.getAttribute('data-team-id');
            if (teamId) {
                window.location.href = `team-detail.html?team=${teamId}`;
            }
        });
    });
    
    // ニュースカードのインタラクション
    const newsCards = document.querySelectorAll('.latest-card');
    newsCards.forEach(card => {
        card.addEventListener('click', function() {
            const articleId = this.getAttribute('data-article-id');
            if (articleId) {
                window.location.href = `article.html?id=${articleId}`;
            }
        });
    });
}

/**
 * モバイルメニューの初期化
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // アクセシビリティのためのaria属性を更新
            const expanded = mobileMenu.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
            
            // スクロール制御
            if (expanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // モバイルメニュー内のリンククリック時に自動的に閉じる
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * スムーズスクロールの初期化
 */
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * ウィンドウサイズ変更時の処理
 */
window.addEventListener('resize', function() {
    // レスポンシブ対応の追加処理
    adjustResponsiveElements();
});

/**
 * レスポンシブ要素の調整
 */
function adjustResponsiveElements() {
    // モバイル表示時のテーブル調整
    const tables = document.querySelectorAll('.responsive-table');
    tables.forEach(table => {
        if (window.innerWidth < 768) {
            table.classList.add('mobile-view');
        } else {
            table.classList.remove('mobile-view');
        }
    });
    
    // モバイル表示時のカード調整
    const cardGrids = document.querySelectorAll('.card-grid');
    cardGrids.forEach(grid => {
        if (window.innerWidth < 480) {
            grid.classList.add('mobile-stack');
        } else {
            grid.classList.remove('mobile-stack');
        }
    });
}

/**
 * 試合カードのフィルタリング機能
 * @param {string} filter - フィルタリングの条件
 */
function filterMatches(filter) {
    const matchCards = document.querySelectorAll('.match-card');
    
    matchCards.forEach(card => {
        const status = card.getAttribute('data-status');
        
        if (filter === 'all' || status === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // フィルターボタンのアクティブ状態を更新
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * 試合日程の表示切替
 * @param {number} gameweek - 表示する節
 */
function showGameweek(gameweek) {
    // ローディング状態を表示
    const container = document.getElementById('fixtures-container');
    if (container) {
        container.classList.add('loading');
        
        // ボタンのアクティブ状態を更新
        document.querySelectorAll('.gameweek-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`.gameweek-btn[data-gameweek="${gameweek}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // 少し遅延を入れてスムーズな遷移を演出
        setTimeout(() => {
            // データの取得と表示処理
            const data = window.fixturesData ? window.fixturesData[gameweek] : null;
            
            if (data) {
                container.innerHTML = `
                    <div class="fixtures-section fade-in">
                        <h2 class="section-title">${data.title}</h2>
                        ${data.matches.map(match => createMatchCard(match)).join('')}
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="fixtures-section fade-in">
                        <h2 class="section-title">第${gameweek}節</h2>
                        <div class="no-data">データが見つかりません</div>
                    </div>
                `;
            }
            
            container.classList.remove('loading');
            
            // 新しく追加された要素にイベントリスナーを設定
            initInteractiveCards();
        }, 300);
    }
}

/**
 * 試合カードのHTML生成
 * @param {Object} match - 試合データ
 * @returns {string} 試合カードのHTML
 */
function createMatchCard(match) {
    const statusClass = `status-${match.status}`;
    const statusText = {
        'upcoming': '予定',
        'live': 'ライブ',
        'finished': '終了'
    }[match.status];

    const scoreSection = match.status === 'upcoming' 
        ? '<div class="vs">vs</div>'
        : `
            <div class="score">${match.homeScore}</div>
            <div class="vs">-</div>
            <div class="score">${match.awayScore}</div>
        `;

    const matchId = `${match.homeTeam.toLowerCase().replace(/\s+/g, '-')}-${match.awayTeam.toLowerCase().replace(/\s+/g, '-')}`;

    return `
        <div class="match-card hover-effect" data-match-id="${matchId}" data-status="${match.status}">
            <div class="match-header">
                <div class="match-date">${match.date}</div>
                <div class="match-status ${statusClass}">${statusText}</div>
            </div>
            <div class="match-teams">
                <div class="team home">
                    <div class="team-logo">${match.homeTeam.charAt(0)}</div>
                    <div class="team-name">${match.homeTeam}</div>
                </div>
                <div class="score-section">
                    ${scoreSection}
                </div>
                <div class="team away">
                    <div class="team-logo">${match.awayTeam.charAt(0)}</div>
                    <div class="team-name">${match.awayTeam}</div>
                </div>
            </div>
            <div class="match-info">
                <div class="venue">📍 ${match.venue}</div>
                <div class="competition">${match.competition}</div>
            </div>
        </div>
    `;
}
