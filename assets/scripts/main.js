// BSix.com - Premier League Big 6 Preview Site
// Main JavaScript Application

class BSixApp {
    constructor() {
        this.currentPage = 'home';
        this.isMobile = this.detectMobile();
        this.data = null;
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.renderPage();
            this.hideLoadingScreen();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('アプリケーションの初期化に失敗しました');
        }
    }

    async loadData() {
        try {
            const response = await fetch('/data/main-data.json');
            this.data = await response.json();
            
            // Load additional data
            const fixturesResponse = await fetch('/data/gameweek5-fixtures.json');
            const fixtures = await fixturesResponse.json();
            this.data.fixtures = fixtures;

            const tableResponse = await fetch('/data/current-table.json');
            const table = await tableResponse.json();
            this.data.table = table;

        } catch (error) {
            console.error('Failed to load data:', error);
            throw error;
        }
    }

    detectMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    setupEventListeners() {
        // Navigation listeners
        document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Menu toggle for mobile
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            this.isMobile = this.detectMobile();
            this.updateLayout();
        });

        // Match card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.match-preview-btn')) {
                const matchId = e.target.closest('.match-card').dataset.matchId;
                this.showMatchPreview(matchId);
            }
            
            if (e.target.closest('.match-favorite-btn')) {
                const matchId = e.target.closest('.match-card').dataset.matchId;
                this.toggleFavorite(matchId);
            }
        });
    }

    navigateTo(page) {
        this.currentPage = page;
        this.updateNavigation();
        this.renderPage();
    }

    updateNavigation() {
        // Update desktop navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === this.currentPage);
        });

        // Update mobile navigation
        document.querySelectorAll('.nav-mobile-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === this.currentPage);
        });
    }

    renderPage() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        switch (this.currentPage) {
            case 'home':
                this.renderHomePage();
                break;
            case 'fixtures':
                this.renderFixturesPage();
                break;
            case 'teams':
                this.renderTeamsPage();
                break;
            case 'stats':
                this.renderStatsPage();
                break;
            default:
                this.renderHomePage();
        }
    }

    renderHomePage() {
        if (!this.data) return;

        // Update hero stats
        this.updateHeroStats();
        
        // Render featured matches
        this.renderFeaturedMatches();
        
        // Update quick stats
        this.updateQuickStats();
    }

    updateHeroStats() {
        const totalMatches = document.getElementById('total-matches');
        const big6Clashes = document.getElementById('big6-clashes');
        
        if (totalMatches && this.data.fixtures) {
            const big6Matches = this.data.fixtures.matches.filter(match => match.is_big_six);
            totalMatches.textContent = big6Matches.length;
        }
        
        if (big6Clashes && this.data.fixtures) {
            const clashes = this.data.fixtures.matches.filter(match => match.big_six_clash);
            big6Clashes.textContent = clashes.length;
        }
    }

    renderFeaturedMatches() {
        const container = document.getElementById('matches-container');
        if (!container || !this.data.fixtures) return;

        const big6Matches = this.data.fixtures.matches.filter(match => match.is_big_six);
        
        container.innerHTML = big6Matches.map(match => this.createMatchCard(match)).join('');
    }

    createMatchCard(match) {
        const homeTeamClass = this.getTeamClass(match.home_team);
        const awayTeamClass = this.getTeamClass(match.away_team);
        const priorityClass = this.getMatchPriorityClass(match);
        const statusBadge = this.getStatusBadge(match);

        return `
            <div class="match-card ${priorityClass}" data-match-id="${match.id}">
                <div class="match-card-header">
                    <div class="match-date">
                        <span class="match-day">${this.formatDate(match.date)}</span>
                        <span class="match-time">${match.time}</span>
                    </div>
                    <div class="match-competition">
                        <span class="competition-name">プレミアリーグ</span>
                        <span class="matchweek">第${match.gameweek}節</span>
                    </div>
                </div>
                
                ${statusBadge}
                
                <div class="match-teams">
                    <div class="team home-team">
                        <div class="team-logo ${homeTeamClass}">
                            <span class="team-logo-text">${this.getTeamAbbr(match.home_team)}</span>
                        </div>
                        <div class="team-info">
                            <h3 class="team-name">${this.getTeamNameJP(match.home_team)}</h3>
                            <span class="team-label">ホーム</span>
                        </div>
                    </div>
                    
                    <div class="match-vs">
                        <span class="vs-text">VS</span>
                        ${match.significance ? `<div class="match-significance">${this.getSignificanceText(match.significance)}</div>` : ''}
                    </div>
                    
                    <div class="team away-team">
                        <div class="team-logo ${awayTeamClass}">
                            <span class="team-logo-text">${this.getTeamAbbr(match.away_team)}</span>
                        </div>
                        <div class="team-info">
                            <h3 class="team-name">${this.getTeamNameJP(match.away_team)}</h3>
                            <span class="team-label">アウェイ</span>
                        </div>
                    </div>
                </div>
                
                <div class="match-details">
                    <div class="match-venue">
                        <span class="venue-icon">🏟️</span>
                        <span class="venue-name">${match.venue}</span>
                    </div>
                    <div class="match-tv">
                        <span class="tv-icon">📺</span>
                        <span class="tv-coverage">${match.tv_coverage || 'TBA'}</span>
                    </div>
                </div>
                
                <div class="match-actions">
                    <button class="btn btn-primary match-preview-btn">
                        <span class="btn-icon">📊</span>
                        <span class="btn-text">詳細プレビュー</span>
                    </button>
                    <button class="btn btn-secondary match-favorite-btn">
                        <span class="btn-icon">⭐</span>
                    </button>
                </div>
            </div>
        `;
    }

    getTeamClass(teamName) {
        const teamClasses = {
            'Arsenal': 'arsenal',
            'Manchester City': 'manchester-city',
            'Liverpool': 'liverpool',
            'Chelsea': 'chelsea',
            'Manchester United': 'manchester-united',
            'Tottenham': 'tottenham',
            'Brighton': 'brighton',
            'Everton': 'everton'
        };
        return teamClasses[teamName] || 'default-team';
    }

    getTeamAbbr(teamName) {
        const abbrs = {
            'Arsenal': 'ARS',
            'Manchester City': 'MCI',
            'Liverpool': 'LIV',
            'Chelsea': 'CHE',
            'Manchester United': 'MUN',
            'Tottenham': 'TOT',
            'Brighton': 'BRI',
            'Everton': 'EVE'
        };
        return abbrs[teamName] || teamName.substring(0, 3).toUpperCase();
    }

    getTeamNameJP(teamName) {
        const jpNames = {
            'Arsenal': 'アーセナル',
            'Manchester City': 'マンチェスター・シティ',
            'Liverpool': 'リバプール',
            'Chelsea': 'チェルシー',
            'Manchester United': 'マンチェスター・ユナイテッド',
            'Tottenham': 'トッテナム',
            'Brighton': 'ブライトン',
            'Everton': 'エバートン'
        };
        return jpNames[teamName] || teamName;
    }

    getMatchPriorityClass(match) {
        if (match.big_six_clash) return 'big-six-clash';
        if (match.derby) return 'derby-match';
        if (match.title_race) return 'title-race';
        return 'regular-match';
    }

    getStatusBadge(match) {
        let badgeClass = 'status-upcoming';
        let badgeText = '予定';
        
        if (match.big_six_clash) {
            badgeClass = 'status-big-six';
            badgeText = 'ビッグ6対決';
        } else if (match.derby) {
            badgeClass = 'status-derby';
            badgeText = 'ダービー';
        } else if (match.title_race) {
            badgeClass = 'status-title-race';
            badgeText = 'タイトル争い';
        }

        return `<div class="match-status ${badgeClass}">${badgeText}</div>`;
    }

    getSignificanceText(significance) {
        const texts = {
            'title_race': 'タイトル争い',
            'big_six_clash': 'ビッグ6対決',
            'derby': 'ダービー',
            'away_fixture': 'アウェイ戦'
        };
        return texts[significance] || '';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', weekday: 'short' };
        return date.toLocaleDateString('ja-JP', options);
    }

    updateQuickStats() {
        if (!this.data.quick_stats) return;
        
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid) return;

        statsGrid.innerHTML = this.data.quick_stats.map(stat => `
            <div class="stat-card ${stat.highlight ? 'highlight' : ''}">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-content">
                    <h3 class="stat-title">${stat.title}</h3>
                    <p class="stat-description">${stat.description}</p>
                </div>
            </div>
        `).join('');
    }

    showMatchPreview(matchId) {
        // Navigate to match preview page or show modal
        console.log('Show match preview for:', matchId);
        // Implementation for match preview display
    }

    toggleFavorite(matchId) {
        // Toggle favorite status
        console.log('Toggle favorite for:', matchId);
        // Implementation for favorite functionality
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        }
    }

    toggleMobileMenu() {
        const navDesktop = document.querySelector('.nav-desktop');
        if (navDesktop) {
            navDesktop.classList.toggle('mobile-open');
        }
    }

    updateLayout() {
        // Update layout based on screen size
        document.body.classList.toggle('mobile-layout', this.isMobile);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showError(message) {
        console.error(message);
        // Show error message to user
    }

    renderFixturesPage() {
        // Implementation for fixtures page
        console.log('Rendering fixtures page');
    }

    renderTeamsPage() {
        // Implementation for teams page
        console.log('Rendering teams page');
    }

    renderStatsPage() {
        // Implementation for stats page
        console.log('Rendering stats page');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bsixApp = new BSixApp();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BSixApp;
}
