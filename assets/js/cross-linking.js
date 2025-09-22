// 相互リンクシステム - チーム名、選手名、試合名を自動的にリンク化

class CrossLinkingSystem {
    constructor() {
        this.teamLinks = {
            // Big 6 専用ページ
            'リヴァプール': 'liverpool.html',
            'Liverpool': 'liverpool.html',
            'LIV': 'liverpool.html',
            
            'アーセナル': 'arsenal.html',
            'Arsenal': 'arsenal.html',
            'ARS': 'arsenal.html',
            
            'チェルシー': 'chelsea.html',
            'Chelsea': 'chelsea.html',
            'CHE': 'chelsea.html',
            
            // 汎用ページ
            'マンチェスター・シティ': 'team-detail-synced.html?team=manchester_city',
            'Manchester City': 'team-detail-synced.html?team=manchester_city',
            'シティ': 'team-detail-synced.html?team=manchester_city',
            'MCI': 'team-detail-synced.html?team=manchester_city',
            
            'マンチェスター・ユナイテッド': 'team-detail-synced.html?team=manchester_united',
            'Manchester United': 'team-detail-synced.html?team=manchester_united',
            'ユナイテッド': 'team-detail-synced.html?team=manchester_united',
            'MUN': 'team-detail-synced.html?team=manchester_united',
            
            'トッテナム・ホットスパー': 'team-detail-synced.html?team=tottenham',
            'Tottenham': 'team-detail-synced.html?team=tottenham',
            'スパーズ': 'team-detail-synced.html?team=tottenham',
            'TOT': 'team-detail-synced.html?team=tottenham'
        };

        this.playerLinks = {
            // リヴァプール選手
            'モハメド・サラー': 'player-detail.html?player=salah',
            'サラー': 'player-detail.html?player=salah',
            'Mohamed Salah': 'player-detail.html?player=salah',
            
            'ルイス・ディアス': 'player-detail.html?player=diaz',
            'ディアス': 'player-detail.html?player=diaz',
            'Luis Diaz': 'player-detail.html?player=diaz',
            
            'ヴィルジル・ファン・ダイク': 'player-detail.html?player=vandijk',
            'ファン・ダイク': 'player-detail.html?player=vandijk',
            'Van Dijk': 'player-detail.html?player=vandijk',
            
            // アーセナル選手
            'ブカヨ・サカ': 'player-detail.html?player=saka',
            'サカ': 'player-detail.html?player=saka',
            'Bukayo Saka': 'player-detail.html?player=saka',
            
            'マルティン・ウーデゴール': 'player-detail.html?player=odegaard',
            'ウーデゴール': 'player-detail.html?player=odegaard',
            'Odegaard': 'player-detail.html?player=odegaard',
            
            // チェルシー選手
            'ニコラス・ジャクソン': 'player-detail.html?player=jackson',
            'ジャクソン': 'player-detail.html?player=jackson',
            'Nicolas Jackson': 'player-detail.html?player=jackson',
            
            'エンツォ・フェルナンデス': 'player-detail.html?player=fernandez',
            'フェルナンデス': 'player-detail.html?player=fernandez',
            'Enzo Fernandez': 'player-detail.html?player=fernandez'
        };

        this.matchLinks = {
            'アーセナル vs マンチェスター・シティ': 'match-preview.html?match=ars_mci',
            'Arsenal vs Manchester City': 'match-preview.html?match=ars_mci',
            'リヴァプール vs チェルシー': 'match-preview.html?match=liv_che',
            'Liverpool vs Chelsea': 'match-preview.html?match=liv_che'
        };

        this.pageLinks = {
            '順位表': 'stats.html',
            '試合一覧': 'fixtures.html',
            'チーム一覧': 'teams.html',
            '試合プレビュー': 'match-preview.html'
        };

        this.init();
    }

    init() {
        // ページ読み込み完了後に自動リンク化を実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.autoLinkContent());
        } else {
            this.autoLinkContent();
        }
    }

    autoLinkContent() {
        // リンク化対象の要素を取得（広告エリアは除外）
        const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, .content-text');
        
        contentElements.forEach(element => {
            // 既にリンクが含まれている場合はスキップ
            if (element.querySelector('a') || element.closest('.ad-container')) {
                return;
            }
            
            this.processElement(element);
        });
    }

    processElement(element) {
        let html = element.innerHTML;
        let hasChanges = false;

        // チーム名のリンク化
        Object.entries(this.teamLinks).forEach(([teamName, url]) => {
            const regex = new RegExp(`\\b${this.escapeRegex(teamName)}\\b`, 'gi');
            const replacement = `<a href="${url}" class="auto-link team-link" title="${teamName}の詳細ページ">${teamName}</a>`;
            
            if (regex.test(html) && !html.includes(`href="${url}"`)) {
                html = html.replace(regex, replacement);
                hasChanges = true;
            }
        });

        // 選手名のリンク化
        Object.entries(this.playerLinks).forEach(([playerName, url]) => {
            const regex = new RegExp(`\\b${this.escapeRegex(playerName)}\\b`, 'gi');
            const replacement = `<a href="${url}" class="auto-link player-link" title="${playerName}の詳細ページ">${playerName}</a>`;
            
            if (regex.test(html) && !html.includes(`href="${url}"`)) {
                html = html.replace(regex, replacement);
                hasChanges = true;
            }
        });

        // 試合名のリンク化
        Object.entries(this.matchLinks).forEach(([matchName, url]) => {
            const regex = new RegExp(this.escapeRegex(matchName), 'gi');
            const replacement = `<a href="${url}" class="auto-link match-link" title="${matchName}のプレビュー">${matchName}</a>`;
            
            if (regex.test(html) && !html.includes(`href="${url}"`)) {
                html = html.replace(regex, replacement);
                hasChanges = true;
            }
        });

        // ページリンクの自動化
        Object.entries(this.pageLinks).forEach(([pageName, url]) => {
            const regex = new RegExp(`\\b${this.escapeRegex(pageName)}\\b`, 'gi');
            const replacement = `<a href="${url}" class="auto-link page-link" title="${pageName}ページ">${pageName}</a>`;
            
            if (regex.test(html) && !html.includes(`href="${url}"`)) {
                html = html.replace(regex, replacement);
                hasChanges = true;
            }
        });

        if (hasChanges) {
            element.innerHTML = html;
        }
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 動的にリンクを追加する機能
    addTeamLink(teamName, url) {
        this.teamLinks[teamName] = url;
    }

    addPlayerLink(playerName, url) {
        this.playerLinks[playerName] = url;
    }

    addMatchLink(matchName, url) {
        this.matchLinks[matchName] = url;
    }

    // 特定の要素のみを再処理
    refreshElement(element) {
        this.processElement(element);
    }

    // 全体を再処理
    refreshAll() {
        this.autoLinkContent();
    }
}

// 関連記事推薦システム
class RelatedContentSystem {
    constructor() {
        this.relatedContent = {
            'liverpool.html': [
                { title: 'アーセナル vs リヴァプール 過去の対戦成績', url: 'match-history.html?teams=ars_liv', type: 'match' },
                { title: 'モハメド・サラーの今シーズン成績', url: 'player-detail.html?player=salah', type: 'player' },
                { title: 'プレミアリーグ順位表', url: 'stats.html', type: 'stats' }
            ],
            'arsenal.html': [
                { title: 'アーセナル vs マンチェスター・シティ プレビュー', url: 'match-preview.html?match=ars_mci', type: 'match' },
                { title: 'ブカヨ・サカの怪我情報', url: 'player-detail.html?player=saka', type: 'player' },
                { title: 'Big 6 比較分析', url: 'stats.html#big6', type: 'stats' }
            ],
            'chelsea.html': [
                { title: 'チェルシー vs リヴァプール 次回対戦', url: 'match-preview.html?match=che_liv', type: 'match' },
                { title: 'エンツォ・フェルナンデスの移籍後成績', url: 'player-detail.html?player=fernandez', type: 'player' },
                { title: '今節の試合一覧', url: 'fixtures.html', type: 'fixtures' }
            ]
        };
    }

    getRelatedContent(currentPage) {
        const pageName = currentPage.split('/').pop() || currentPage;
        return this.relatedContent[pageName] || [];
    }

    renderRelatedContent(container, currentPage) {
        const related = this.getRelatedContent(currentPage);
        
        if (related.length === 0) return;

        const html = `
            <div class="related-content">
                <h3>関連記事</h3>
                <div class="related-grid">
                    ${related.map(item => `
                        <a href="${item.url}" class="related-item ${item.type}">
                            <div class="related-icon">${this.getTypeIcon(item.type)}</div>
                            <div class="related-title">${item.title}</div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    getTypeIcon(type) {
        const icons = {
            'match': '⚽',
            'player': '👤',
            'stats': '📊',
            'fixtures': '📅',
            'news': '📰'
        };
        return icons[type] || '🔗';
    }
}

// 滞在時間向上システム
class EngagementSystem {
    constructor() {
        this.readingProgress = 0;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        this.trackScrollProgress();
        this.addReadingTimeEstimate();
        this.addProgressBar();
    }

    trackScrollProgress() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            this.readingProgress = Math.max(this.readingProgress, scrollPercent);
            this.updateProgressBar(scrollPercent);
        });
    }

    addReadingTimeEstimate() {
        const content = document.querySelector('.main-content, .container');
        if (!content) return;

        const wordCount = content.textContent.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // 200語/分

        const estimateElement = document.createElement('div');
        estimateElement.className = 'reading-time';
        estimateElement.innerHTML = `📖 読了時間: 約${readingTime}分`;
        
        const header = document.querySelector('h1, .team-header');
        if (header) {
            header.parentNode.insertBefore(estimateElement, header.nextSibling);
        }
    }

    addProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
        document.body.appendChild(progressBar);
    }

    updateProgressBar(percent) {
        const bar = document.querySelector('.reading-progress-bar');
        if (bar) {
            bar.style.width = `${percent}%`;
        }
    }

    getEngagementData() {
        return {
            timeSpent: Date.now() - this.startTime,
            readingProgress: this.readingProgress,
            timestamp: new Date().toISOString()
        };
    }
}

// グローバル初期化
window.crossLinkingSystem = new CrossLinkingSystem();
window.relatedContentSystem = new RelatedContentSystem();
window.engagementSystem = new EngagementSystem();

// 関連コンテンツを表示する関数
window.showRelatedContent = function(containerId) {
    const container = document.getElementById(containerId);
    const currentPage = window.location.pathname;
    
    if (container) {
        window.relatedContentSystem.renderRelatedContent(container, currentPage);
    }
};

// CSS スタイルを動的に追加
const linkingStyles = `
<style>
.auto-link {
    color: #4CAF50;
    text-decoration: none;
    border-bottom: 1px dotted #4CAF50;
    transition: all 0.3s ease;
}

.auto-link:hover {
    color: #45a049;
    border-bottom-style: solid;
    background: rgba(76, 175, 80, 0.1);
    padding: 2px 4px;
    border-radius: 3px;
}

.team-link { color: #2196F3; border-bottom-color: #2196F3; }
.player-link { color: #FF9800; border-bottom-color: #FF9800; }
.match-link { color: #9C27B0; border-bottom-color: #9C27B0; }
.page-link { color: #607D8B; border-bottom-color: #607D8B; }

.related-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 25px;
    margin: 30px 0;
}

.related-content h3 {
    color: #fff;
    margin-bottom: 20px;
    text-align: center;
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
}

.related-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    text-decoration: none;
    color: #fff;
    transition: all 0.3s ease;
}

.related-item:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.related-icon {
    font-size: 1.5rem;
}

.related-title {
    font-weight: 500;
}

.reading-time {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
    padding: 8px 16px;
    border-radius: 20px;
    display: inline-block;
    margin: 15px 0;
    font-size: 0.9rem;
    font-weight: 500;
}

.reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 9999;
}

.reading-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #45a049);
    width: 0%;
    transition: width 0.3s ease;
}

@media (max-width: 768px) {
    .related-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', linkingStyles);
