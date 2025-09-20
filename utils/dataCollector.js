/**
 * データ収集アルゴリズム
 * プレミアリーグビッグ6の試合データを管理
 */

class DataCollector {
    constructor() {
        this.big6Teams = [
            'arsenal',
            'chelsea', 
            'liverpool',
            'manchester_city',
            'manchester_united',
            'tottenham'
        ];
        
        this.teamDisplayNames = {
            'arsenal': 'アーセナル',
            'chelsea': 'チェルシー',
            'liverpool': 'リバプール',
            'manchester_city': 'マンチェスター・シティ',
            'manchester_united': 'マンチェスター・ユナイテッド',
            'tottenham': 'トッテナム'
        };

        this.teamColors = {
            'arsenal': { primary: '#EF0107', secondary: '#9C824A' },
            'chelsea': { primary: '#034694', secondary: '#ffffff' },
            'liverpool': { primary: '#C8102E', secondary: '#F6EB61' },
            'manchester_city': { primary: '#6CABDD', secondary: '#ffffff' },
            'manchester_united': { primary: '#DA020E', secondary: '#FBE122' },
            'tottenham': { primary: '#132257', secondary: '#ffffff' }
        };

        this.venues = {
            'arsenal': 'エミレーツ・スタジアム',
            'chelsea': 'スタンフォード・ブリッジ',
            'liverpool': 'アンフィールド',
            'manchester_city': 'エティハド・スタジアム',
            'manchester_united': 'オールド・トラッフォード',
            'tottenham': 'トッテナム・ホットスパー・スタジアム',
            'brighton': 'アメックス・スタジアム',
            'everton': 'グディソン・パーク'
        };
    }

    /**
     * 現在のゲームウィークのビッグ6試合を取得
     */
    async getCurrentGameweekMatches() {
        try {
            const response = await fetch('/data/current-gameweek.json');
            const data = await response.json();
            return this.processMatchData(data);
        } catch (error) {
            console.error('データ取得エラー:', error);
            return this.getFallbackData();
        }
    }

    /**
     * 試合データを処理して表示用に変換
     */
    processMatchData(gameweekData) {
        return gameweekData.big6_matches.map(match => ({
            id: match.id,
            date: match.date,
            time: match.time,
            timezone: match.timezone,
            homeTeam: {
                id: match.home_team,
                name: this.teamDisplayNames[match.home_team] || this.capitalizeTeamName(match.home_team),
                colors: this.teamColors[match.home_team] || { primary: '#333333', secondary: '#ffffff' },
                venue: this.venues[match.home_team] || 'スタジアム未定'
            },
            awayTeam: {
                id: match.away_team,
                name: this.teamDisplayNames[match.away_team] || this.capitalizeTeamName(match.away_team),
                colors: this.teamColors[match.away_team] || { primary: '#333333', secondary: '#ffffff' }
            },
            venue: this.venues[match.home_team] || match.venue,
            competition: match.competition,
            matchweek: match.matchweek,
            tvCoverage: match.tv_coverage,
            significance: match.significance,
            big6Involvement: match.big6_involvement,
            previewNotes: match.preview_notes,
            isBig6Clash: match.big6_involvement.length === 2,
            priority: this.calculateMatchPriority(match)
        }));
    }

    /**
     * 試合の優先度を計算
     */
    calculateMatchPriority(match) {
        let priority = 0;
        
        // ビッグ6同士の対戦は最高優先度
        if (match.big6_involvement.length === 2) {
            priority += 100;
        }
        
        // ダービーマッチは高優先度
        if (match.significance.includes('Derby')) {
            priority += 50;
        }
        
        // タイトル争いに関わる試合
        if (match.significance.includes('Title') || match.significance.includes('Contenders')) {
            priority += 75;
        }
        
        // ビッグ6チームが関わる試合
        priority += match.big6_involvement.length * 25;
        
        return priority;
    }

    /**
     * チーム名を適切に大文字化
     */
    capitalizeTeamName(teamName) {
        return teamName.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * フォールバックデータ（データ取得失敗時）
     */
    getFallbackData() {
        return [
            {
                id: 'fallback-1',
                date: '2025-09-21',
                time: '11:30',
                timezone: 'ET',
                homeTeam: {
                    id: 'arsenal',
                    name: 'アーセナル',
                    colors: { primary: '#EF0107', secondary: '#9C824A' },
                    venue: 'エミレーツ・スタジアム'
                },
                awayTeam: {
                    id: 'manchester_city',
                    name: 'マンチェスター・シティ',
                    colors: { primary: '#6CABDD', secondary: '#ffffff' }
                },
                venue: 'エミレーツ・スタジアム',
                competition: 'Premier League',
                matchweek: 5,
                tvCoverage: 'Peacock',
                significance: 'Title Contenders Clash',
                big6Involvement: ['arsenal', 'manchester_city'],
                previewNotes: 'タイトル争いの重要な一戦',
                isBig6Clash: true,
                priority: 175
            }
        ];
    }

    /**
     * 特定の試合の詳細データを取得
     */
    async getMatchDetails(matchId) {
        try {
            const response = await fetch(`/data/matches/${matchId}.json`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('試合詳細データ取得エラー:', error);
            return this.generateFallbackMatchDetails(matchId);
        }
    }

    /**
     * フォールバック試合詳細データ
     */
    generateFallbackMatchDetails(matchId) {
        return {
            id: matchId,
            basicInfo: {
                competition: 'Premier League',
                matchweek: 5,
                season: '2025-26'
            },
            teams: {
                home: { name: 'ホームチーム', formation: '4-3-3' },
                away: { name: 'アウェイチーム', formation: '4-2-3-1' }
            },
            predictions: {
                ai: { home: 45, draw: 30, away: 25 },
                experts: []
            },
            statistics: {
                head_to_head: { total: 10, home_wins: 6, draws: 2, away_wins: 2 }
            }
        };
    }

    /**
     * チーム統計データを取得
     */
    async getTeamStats(teamId) {
        const defaultStats = {
            league_position: 'N/A',
            points: 0,
            goals_for: 0,
            goals_against: 0,
            recent_form: 'N/A'
        };

        try {
            const response = await fetch(`/data/teams/${teamId}.json`);
            const data = await response.json();
            return { ...defaultStats, ...data.current_season_stats };
        } catch (error) {
            console.error('チーム統計取得エラー:', error);
            return defaultStats;
        }
    }
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataCollector;
} else {
    window.DataCollector = DataCollector;
}
