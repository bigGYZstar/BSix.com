/**
 * BSix.com データ同期・整合性チェックシステム
 * 全ページでマスターデータを参照し、データの一貫性を保証
 */

class BSixDataSync {
    constructor() {
        this.masterData = null;
        this.dataVersion = null;
        this.lastUpdate = null;
        this.errors = [];
        this.warnings = [];
    }

    /**
     * マスターデータを読み込み
     */
    async loadMasterData() {
        try {
            // 正確な順位表データを読み込み
            const response = await fetch('/data/versions/2025-09-20_current_premier_league_table.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.masterData = data;
            this.dataVersion = data.metadata.version;
            this.lastUpdate = data.metadata.collectionDate;
            
            console.log(`✅ マスターデータ読み込み完了: ${this.dataVersion}`);
            return data;
        } catch (error) {
            console.error('❌ マスターデータ読み込みエラー:', error);
            this.errors.push(`マスターデータ読み込み失敗: ${error.message}`);
            return null;
        }
    }

    /**
     * チーム情報を取得（順位、勝点、フォーム等）
     */
    getTeamData(teamName) {
        if (!this.masterData) {
            this.errors.push('マスターデータが読み込まれていません');
            return null;
        }

        // チーム名の正規化（英語名・日本語名両対応）
        const normalizedName = this.normalizeTeamName(teamName);
        
        const team = this.masterData.leagueTable.find(t => 
            this.normalizeTeamName(t.team) === normalizedName ||
            this.normalizeTeamName(t.teamEn) === normalizedName ||
            this.normalizeTeamName(t.short) === normalizedName
        );

        if (!team) {
            this.warnings.push(`チーム "${teamName}" が見つかりません`);
            return null;
        }

        return {
            position: team.position,
            team: team.team,
            teamEn: team.teamEn,
            short: team.short,
            played: team.played,
            won: team.won,
            drawn: team.drawn,
            lost: team.lost,
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst,
            goalDifference: team.goalDifference,
            points: team.points,
            form: team.form,
            formColor: team.formColor,
            nextOpponent: team.nextOpponent,
            status: team.status
        };
    }

    /**
     * チーム名を正規化
     */
    normalizeTeamName(name) {
        if (!name) return '';
        
        const nameMap = {
            'arsenal': 'アーセナル',
            'アーセナル': 'アーセナル',
            'ars': 'アーセナル',
            'manchester city': 'マンチェスター・シティ',
            'マンチェスター・シティ': 'マンチェスター・シティ',
            'man city': 'マンチェスター・シティ',
            'mci': 'マンチェスター・シティ',
            'liverpool': 'リヴァプール',
            'リヴァプール': 'リヴァプール',
            'liv': 'リヴァプール',
            'chelsea': 'チェルシー',
            'チェルシー': 'チェルシー',
            'che': 'チェルシー',
            'tottenham': 'トッテナム・ホットスパー',
            'tottenham hotspur': 'トッテナム・ホットスパー',
            'トッテナム': 'トッテナム・ホットスパー',
            'トッテナム・ホットスパー': 'トッテナム・ホットスパー',
            'tot': 'トッテナム・ホットスパー',
            'manchester united': 'マンチェスター・ユナイテッド',
            'マンチェスター・ユナイテッド': 'マンチェスター・ユナイテッド',
            'man united': 'マンチェスター・ユナイテッド',
            'mun': 'マンチェスター・ユナイテッド'
        };

        const normalized = name.toLowerCase().trim();
        return nameMap[normalized] || name;
    }

    /**
     * ビッグ6チームの現在順位を取得
     */
    getBigSixPositions() {
        if (!this.masterData) return null;

        const bigSixTeams = ['アーセナル', 'マンチェスター・シティ', 'リヴァプール', 'チェルシー', 'トッテナム・ホットスパー', 'マンチェスター・ユナイテッド'];
        const positions = {};

        bigSixTeams.forEach(teamName => {
            const teamData = this.getTeamData(teamName);
            if (teamData) {
                positions[teamName] = {
                    position: teamData.position,
                    points: teamData.points,
                    form: teamData.form,
                    status: this.getFormStatus(teamData.form)
                };
            }
        });

        return positions;
    }

    /**
     * フォームから状態を判定
     */
    getFormStatus(form) {
        if (!form || form.length === 0) return '不明';
        
        const wins = form.filter(result => result === 'W').length;
        const draws = form.filter(result => result === 'D').length;
        const losses = form.filter(result => result === 'L').length;

        if (wins === 4) return '完璧';
        if (wins >= 3) return '好調';
        if (wins >= 2) return '安定';
        if (wins >= 1) return '普通';
        if (draws >= 2) return '停滞';
        return '苦戦';
    }

    /**
     * データ整合性チェック
     */
    validateData() {
        this.errors = [];
        this.warnings = [];

        if (!this.masterData) {
            this.errors.push('マスターデータが読み込まれていません');
            return false;
        }

        console.log('🔍 データ整合性チェック開始...');

        // 順位表の整合性チェック
        this.validateLeagueTable();
        
        // ビッグ6データの整合性チェック
        this.validateBigSixData();

        // 試合データの整合性チェック
        this.validateMatchData();

        const isValid = this.errors.length === 0;
        
        if (isValid) {
            console.log('✅ データ整合性チェック完了: 問題なし');
        } else {
            console.error('❌ データ整合性チェック失敗:', this.errors);
        }

        if (this.warnings.length > 0) {
            console.warn('⚠️ 警告:', this.warnings);
        }

        return isValid;
    }

    /**
     * 順位表の整合性チェック
     */
    validateLeagueTable() {
        const table = this.masterData.leagueTable;
        
        table.forEach((team, index) => {
            // 順位の連続性チェック
            if (team.position !== index + 1) {
                this.errors.push(`順位エラー: ${team.team} の順位が ${team.position} ですが、期待値は ${index + 1}`);
            }

            // 勝点計算チェック
            const expectedPoints = team.won * 3 + team.drawn * 1;
            if (team.points !== expectedPoints) {
                this.errors.push(`勝点エラー: ${team.team} の勝点が ${team.points} ですが、計算値は ${expectedPoints}`);
            }

            // 試合数チェック
            const totalGames = team.won + team.drawn + team.lost;
            if (team.played !== totalGames) {
                this.errors.push(`試合数エラー: ${team.team} の試合数が ${team.played} ですが、計算値は ${totalGames}`);
            }

            // 得失点差チェック
            const expectedGD = team.goalsFor - team.goalsAgainst;
            if (team.goalDifference !== expectedGD) {
                this.errors.push(`得失点差エラー: ${team.team} の得失点差が ${team.goalDifference} ですが、計算値は ${expectedGD}`);
            }

            // フォームデータチェック
            if (!team.form || team.form.length !== 4) {
                this.warnings.push(`フォームデータ不完全: ${team.team} のフォームデータが不足`);
            }
        });
    }

    /**
     * ビッグ6データの整合性チェック
     */
    validateBigSixData() {
        const bigSixPositions = this.masterData.bigSixCurrentPositions;
        
        Object.entries(bigSixPositions).forEach(([teamKey, data]) => {
            const teamData = this.getTeamData(teamKey);
            if (teamData) {
                if (data.position !== teamData.position) {
                    this.errors.push(`ビッグ6順位エラー: ${teamKey} の順位が不一致`);
                }
                if (data.points !== teamData.points) {
                    this.errors.push(`ビッグ6勝点エラー: ${teamKey} の勝点が不一致`);
                }
            }
        });
    }

    /**
     * 試合データの整合性チェック
     */
    validateMatchData() {
        // 今後の試合データチェック機能を実装予定
        console.log('📅 試合データチェック: 実装予定');
    }

    /**
     * エラーレポートを生成
     */
    generateErrorReport() {
        const report = {
            timestamp: new Date().toISOString(),
            dataVersion: this.dataVersion,
            lastUpdate: this.lastUpdate,
            errors: this.errors,
            warnings: this.warnings,
            isValid: this.errors.length === 0
        };

        return report;
    }

    /**
     * 公開前チェック実行
     */
    async prePublishCheck() {
        console.log('🚀 公開前チェック開始...');
        
        await this.loadMasterData();
        const isValid = this.validateData();
        
        const report = this.generateErrorReport();
        
        if (isValid) {
            console.log('✅ 公開前チェック完了: サイト公開可能');
            return { success: true, report };
        } else {
            console.error('❌ 公開前チェック失敗: 修正が必要');
            return { success: false, report };
        }
    }

    /**
     * ページ固有のデータ更新
     */
    updatePageData(pageType, elementSelectors) {
        if (!this.masterData) {
            console.error('マスターデータが読み込まれていません');
            return;
        }

        switch (pageType) {
            case 'fixtures':
                this.updateFixturesPage(elementSelectors);
                break;
            case 'teams':
                this.updateTeamsPage(elementSelectors);
                break;
            case 'match-preview':
                this.updateMatchPreviewPage(elementSelectors);
                break;
            default:
                console.warn(`未対応のページタイプ: ${pageType}`);
        }
    }

    /**
     * 試合一覧ページのデータ更新
     */
    updateFixturesPage(selectors) {
        // 各試合カードの順位情報を更新
        document.querySelectorAll('.match-card').forEach(card => {
            const homeTeam = card.dataset.homeTeam;
            const awayTeam = card.dataset.awayTeam;

            if (homeTeam) {
                const homeData = this.getTeamData(homeTeam);
                if (homeData) {
                    const homePositionEl = card.querySelector('.home-position');
                    const homePointsEl = card.querySelector('.home-points');
                    if (homePositionEl) homePositionEl.textContent = `${homeData.position}位`;
                    if (homePointsEl) homePointsEl.textContent = `${homeData.points}pt`;
                }
            }

            if (awayTeam) {
                const awayData = this.getTeamData(awayTeam);
                if (awayData) {
                    const awayPositionEl = card.querySelector('.away-position');
                    const awayPointsEl = card.querySelector('.away-points');
                    if (awayPositionEl) awayPositionEl.textContent = `${awayData.position}位`;
                    if (awayPointsEl) awayPointsEl.textContent = `${awayData.points}pt`;
                }
            }
        });
    }

    /**
     * チーム詳細ページのデータ更新
     */
    updateTeamsPage(selectors) {
        // ビッグ6チームの順位・勝点情報を更新
        const bigSixPositions = this.getBigSixPositions();
        
        Object.entries(bigSixPositions).forEach(([teamName, data]) => {
            const teamCard = document.querySelector(`[data-team="${teamName}"]`);
            if (teamCard) {
                const positionEl = teamCard.querySelector('.team-position');
                const pointsEl = teamCard.querySelector('.team-points');
                const statusEl = teamCard.querySelector('.team-status');
                
                if (positionEl) positionEl.textContent = `${data.position}位`;
                if (pointsEl) pointsEl.textContent = `${data.points}pt`;
                if (statusEl) statusEl.textContent = data.status;
            }
        });
    }

    /**
     * 試合プレビューページのデータ更新
     */
    updateMatchPreviewPage(selectors) {
        // URL パラメータから試合情報を取得
        const urlParams = new URLSearchParams(window.location.search);
        const matchId = urlParams.get('match');
        
        if (matchId) {
            // 試合IDから対戦チームを特定
            const [homeTeam, awayTeam] = this.parseMatchId(matchId);
            
            if (homeTeam && awayTeam) {
                const homeData = this.getTeamData(homeTeam);
                const awayData = this.getTeamData(awayTeam);
                
                this.updateTeamStats('home', homeData);
                this.updateTeamStats('away', awayData);
            }
        }
    }

    /**
     * 試合IDを解析してチーム名を取得
     */
    parseMatchId(matchId) {
        const matchMap = {
            'arsenal-city': ['アーセナル', 'マンチェスター・シティ'],
            'liverpool-everton': ['リヴァプール', 'エヴァートン'],
            'chelsea-brighton': ['チェルシー', 'ブライトン・アンド・ホーヴ・アルビオン'],
            'united-tottenham': ['マンチェスター・ユナイテッド', 'トッテナム・ホットスパー']
        };

        return matchMap[matchId] || [null, null];
    }

    /**
     * チーム統計を更新
     */
    updateTeamStats(side, teamData) {
        if (!teamData) return;

        const prefix = side === 'home' ? '.home-' : '.away-';
        
        const positionEl = document.querySelector(`${prefix}position`);
        const pointsEl = document.querySelector(`${prefix}points`);
        const formEl = document.querySelector(`${prefix}form`);
        
        if (positionEl) positionEl.textContent = `${teamData.position}位`;
        if (pointsEl) pointsEl.textContent = `${teamData.points}pt`;
        if (formEl) {
            formEl.innerHTML = teamData.form.map((result, index) => {
                const className = result === 'W' ? 'win' : result === 'D' ? 'draw' : 'loss';
                return `<span class="form-result ${className}">${result}</span>`;
            }).join('');
        }
    }
}

// グローバルインスタンス
window.bsixDataSync = new BSixDataSync();

// ページ読み込み時の自動初期化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔄 BSix データ同期システム初期化中...');
    
    await window.bsixDataSync.loadMasterData();
    
    // ページタイプを自動判定
    const path = window.location.pathname;
    let pageType = null;
    
    if (path.includes('fixtures')) pageType = 'fixtures';
    else if (path.includes('teams')) pageType = 'teams';
    else if (path.includes('match-preview')) pageType = 'match-preview';
    
    if (pageType) {
        window.bsixDataSync.updatePageData(pageType);
        console.log(`✅ ${pageType} ページのデータ更新完了`);
    }
    
    // 開発環境では公開前チェックを実行
    if (window.location.hostname.includes('localhost') || window.location.hostname.includes('manusvm')) {
        const checkResult = await window.bsixDataSync.prePublishCheck();
        if (!checkResult.success) {
            console.error('⚠️ 公開前チェックで問題が検出されました:', checkResult.report);
        }
    }
});

// 公開前チェック用のグローバル関数
window.runPrePublishCheck = async function() {
    return await window.bsixDataSync.prePublishCheck();
};
