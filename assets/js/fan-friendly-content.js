/**
 * Arsenal Chan風ファンフレンドリーコンテンツ生成システム
 * BSix.com - Fan-Friendly Content Generator
 */

class FanFriendlyContentGenerator {
    constructor() {
        this.greetings = {
            match_preview: [
                "Hey! ついに来たね、今節の注目カード！",
                "お疲れさま！今度の試合、めちゃくちゃ楽しみじゃない？",
                "こんにちは〜！今週末の試合、もう準備はOK？",
                "やっほー！今度の相手、なかなか手強そうだよ〜"
            ],
            match_review: [
                "お疲れさま！今日の試合、どうだった？",
                "Hey! 試合終了〜！みんなの感想聞かせて！",
                "はい、お疲れさまでした！今日は熱い試合だったね！",
                "試合終了！いや〜、今日もドラマチックだったなぁ"
            ],
            news: [
                "おはよう！今日もニュースをチェックしていこう！",
                "Hey! 面白いニュースが入ってきたよ〜",
                "こんにちは！最新情報をお届けします！",
                "お疲れさま！今日のホットなニュースはこちら！"
            ],
            analysis: [
                "さてさて、今日は少し深く分析してみようか！",
                "個人的にはこう思うんだけど、どうかな？",
                "ちょっと戦術的な話をしてみたいと思います！",
                "データを見ながら、一緒に考えてみよう！"
            ]
        };

        this.teamNicknames = {
            liverpool: ["リヴァプール", "赤軍", "レッズ", "アンフィールドの主"],
            arsenal: ["アーセナル", "ガナーズ", "北ロンドンの雄", "エミレーツの住人"],
            chelsea: ["チェルシー", "ブルーズ", "スタンフォード・ブリッジの王者", "青軍"],
            manchester_city: ["シティ", "市民", "エティハドの支配者", "スカイブルー"],
            manchester_united: ["ユナイテッド", "赤い悪魔", "オールド・トラッフォードの伝説", "レッドデビルズ"],
            tottenham: ["トッテナム", "スパーズ", "白いハート軍団", "北ロンドンのライバル"]
        };

        this.humorElements = {
            liverpool: {
                good: ["YNWA（一人じゃない）の精神で", "アンフィールドの魔法で", "クロップ時代の遺産で"],
                bad: ["まさかの展開で", "予想外の苦戦で", "アンフィールドでも"]
            },
            arsenal: {
                good: ["アルテタ・マジックで", "エミレーツが沸いて", "ガナーズの底力で"],
                bad: ["またしても", "典型的なアーセナルで", "お馴染みの展開で"]
            },
            chelsea: {
                good: ["スタンフォード・ブリッジの歓声で", "ブルーズの意地で", "チェルシー・プライドで"],
                bad: ["まさかの失速で", "予想外の展開で", "チェルシーらしからぬ"]
            },
            manchester_city: {
                good: ["ペップ・マジックで", "エティハドの完璧さで", "シティの圧倒的な力で"],
                bad: ["まさかのシティが", "予想外にシティが", "信じられないことに"]
            },
            manchester_united: {
                good: ["オールド・トラッフォードの伝統で", "レッドデビルズの誇りで", "ユナイテッドの底力で"],
                bad: ["またしてもユナイテッドが", "お馴染みの展開で", "典型的なユナイテッドで"]
            },
            tottenham: {
                good: ["スパーズの勢いで", "ポステコグルー革命で", "攻撃サッカーの魅力で"],
                bad: ["Spursyな展開で", "またしてもスパーズが", "典型的なトッテナムで"]
            }
        };

        this.transitionPhrases = [
            "ところで、",
            "そうそう、",
            "あ、そうそう！",
            "話は変わるけど、",
            "ちなみに、",
            "実は、",
            "個人的には、",
            "みんなはどう思う？"
        ];

        this.closingPhrases = [
            "どうだった？みんなの意見も聞かせてね！",
            "さて、次はどうなるかな？楽しみ！",
            "また次回もお楽しみに〜！",
            "みんなで一緒に応援していこう！",
            "コメントで感想聞かせてください！",
            "次の試合も要注目だね！",
            "今後の展開が楽しみすぎる！",
            "ファンとして、これからも見守っていこう！"
        ];
    }

    /**
     * 記事タイプに応じた親しみやすい挨拶を生成
     */
    generateGreeting(articleType = 'news') {
        const greetingList = this.greetings[articleType] || this.greetings.news;
        return greetingList[Math.floor(Math.random() * greetingList.length)];
    }

    /**
     * チーム名を親しみやすいニックネームに変換
     */
    getTeamNickname(teamKey, formal = false) {
        if (formal) return this.teamNicknames[teamKey]?.[0] || teamKey;
        
        const nicknames = this.teamNicknames[teamKey];
        if (!nicknames) return teamKey;
        
        return nicknames[Math.floor(Math.random() * nicknames.length)];
    }

    /**
     * 状況に応じたユーモア要素を追加
     */
    addHumorElement(teamKey, situation = 'good') {
        const humor = this.humorElements[teamKey];
        if (!humor || !humor[situation]) return '';
        
        const elements = humor[situation];
        return elements[Math.floor(Math.random() * elements.length)];
    }

    /**
     * 自然な文章の繋ぎ言葉を生成
     */
    getTransitionPhrase() {
        return this.transitionPhrases[Math.floor(Math.random() * this.transitionPhrases.length)];
    }

    /**
     * 記事の締めくくりフレーズを生成
     */
    getClosingPhrase() {
        return this.closingPhrases[Math.floor(Math.random() * this.closingPhrases.length)];
    }

    /**
     * 試合結果を親しみやすく表現
     */
    formatMatchResult(homeTeam, awayTeam, homeScore, awayScore) {
        const homeNick = this.getTeamNickname(homeTeam);
        const awayNick = this.getTeamNickname(awayTeam);
        
        if (homeScore > awayScore) {
            const humor = this.addHumorElement(homeTeam, 'good');
            return `${homeNick}が${humor}${homeScore}-${awayScore}で勝利！`;
        } else if (homeScore < awayScore) {
            const humor = this.addHumorElement(awayTeam, 'good');
            return `${awayNick}が${humor}${awayScore}-${homeScore}で勝利！`;
        } else {
            return `${homeNick} vs ${awayNick}は${homeScore}-${awayScore}のドロー！`;
        }
    }

    /**
     * 選手のパフォーマンスを親しみやすく表現
     */
    formatPlayerPerformance(playerName, goals, assists, rating) {
        let performance = `${playerName}`;
        
        if (goals > 0) {
            performance += `が${goals}ゴール`;
            if (goals >= 2) performance += "の大活躍";
        }
        
        if (assists > 0) {
            performance += `${goals > 0 ? '、' : 'が'}${assists}アシスト`;
        }
        
        if (rating >= 8.0) {
            performance += "で完璧なパフォーマンス！";
        } else if (rating >= 7.0) {
            performance += "で素晴らしい活躍！";
        } else if (rating >= 6.0) {
            performance += "でまずまずの出来！";
        }
        
        return performance;
    }

    /**
     * 戦術分析を親しみやすく説明
     */
    formatTacticalAnalysis(formation, style, keyPoints) {
        let analysis = `今日の戦術は${formation}で、`;
        
        switch (style) {
            case 'possession':
                analysis += "ボールをしっかり回して相手を崩していく作戦！";
                break;
            case 'counter':
                analysis += "カウンターで一気に決める作戦！";
                break;
            case 'pressing':
                analysis += "高い位置からプレッシングをかける積極的な作戦！";
                break;
            default:
                analysis += "バランスの取れた戦術で挑んだね！";
        }
        
        if (keyPoints && keyPoints.length > 0) {
            analysis += "\n\n特に注目したいのは：\n";
            keyPoints.forEach((point, index) => {
                analysis += `${index + 1}. ${point}\n`;
            });
        }
        
        return analysis;
    }

    /**
     * ファン投票用の質問を生成
     */
    generateVoteQuestion(type, context) {
        const questions = {
            mvp: [
                "今日のMVPは誰だと思う？",
                "一番活躍した選手は？",
                "今日の主役は誰だった？"
            ],
            prediction: [
                "次の試合、どうなると思う？",
                "来週の予想は？",
                "みんなの予想を聞かせて！"
            ],
            rating: [
                "今日の試合、何点だった？",
                "チームの出来は？",
                "今日のパフォーマンスをどう評価する？"
            ]
        };
        
        const questionList = questions[type] || questions.mvp;
        return questionList[Math.floor(Math.random() * questionList.length)];
    }

    /**
     * コメント促進メッセージを生成
     */
    generateCommentPrompt() {
        const prompts = [
            "みんなの感想をコメントで聞かせてね！",
            "どう思った？コメント欄で語り合おう！",
            "ファンのみんな、意見を聞かせて！",
            "コメントで盛り上がろう〜！",
            "みんなの熱い想いをコメントで！",
            "感想や予想、なんでもコメントしてね！"
        ];
        
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

    /**
     * 記事全体を親しみやすいトーンに変換
     */
    convertToFanFriendlyTone(originalText, articleType = 'news', teamKey = null) {
        let friendlyText = this.generateGreeting(articleType) + "\n\n";
        
        // 硬い表現を親しみやすく変換
        let convertedText = originalText
            .replace(/である。/g, 'だよ。')
            .replace(/であった。/g, 'だったね。')
            .replace(/について述べた。/g, 'って言ってたよ！')
            .replace(/と発表した。/g, 'と発表されたね。')
            .replace(/が判明した。/g, 'がわかったよ。')
            .replace(/することが決定した。/g, 'することになったんだって！')
            .replace(/と報告されている。/g, 'らしいよ。')
            .replace(/と予想される。/g, 'と思うんだけど、どうかな？');
        
        friendlyText += convertedText;
        
        // 適度な位置に繋ぎ言葉を追加
        const sentences = friendlyText.split('。');
        if (sentences.length > 3) {
            const midPoint = Math.floor(sentences.length / 2);
            sentences[midPoint] = sentences[midPoint] + '。\n\n' + this.getTransitionPhrase();
        }
        
        friendlyText = sentences.join('。');
        friendlyText += "\n\n" + this.getClosingPhrase();
        
        return friendlyText;
    }

    /**
     * ソーシャルシェア用のメッセージを生成
     */
    generateShareMessage(articleTitle, teamKey = null) {
        const shareTemplates = [
            `${articleTitle} | BSix.comで詳しくチェック！`,
            `気になる記事発見！${articleTitle} #BSixcom #プレミアリーグ`,
            `これは見逃せない！${articleTitle} みんなも読んでみて〜`,
            `${articleTitle} ファン必見の内容だよ！`
        ];
        
        if (teamKey) {
            const teamTag = `#${this.getTeamNickname(teamKey, true)}`;
            shareTemplates.forEach((template, index) => {
                shareTemplates[index] = template + ` ${teamTag}`;
            });
        }
        
        return shareTemplates[Math.floor(Math.random() * shareTemplates.length)];
    }

    /**
     * 関連記事の紹介文を生成
     */
    generateRelatedArticleIntro() {
        const intros = [
            "こちらの記事も合わせてどうぞ！",
            "関連記事もチェックしてみてね〜",
            "こんな記事も読んでみる？",
            "ついでにこちらもおすすめ！",
            "もっと詳しく知りたい人はこちら！",
            "こちらの記事も面白いよ！"
        ];
        
        return intros[Math.floor(Math.random() * intros.length)];
    }
}

// Arsenal Chan風コンテンツ生成システムの初期化
const fanContentGenerator = new FanFriendlyContentGenerator();

// 使用例とヘルパー関数
window.BSixFanContent = {
    generator: fanContentGenerator,
    
    // 簡単に使えるヘルパー関数
    greet: (type) => fanContentGenerator.generateGreeting(type),
    teamName: (key, formal = false) => fanContentGenerator.getTeamNickname(key, formal),
    humor: (team, situation) => fanContentGenerator.addHumorElement(team, situation),
    transition: () => fanContentGenerator.getTransitionPhrase(),
    close: () => fanContentGenerator.getClosingPhrase(),
    matchResult: (home, away, homeScore, awayScore) => 
        fanContentGenerator.formatMatchResult(home, away, homeScore, awayScore),
    playerPerf: (name, goals, assists, rating) => 
        fanContentGenerator.formatPlayerPerformance(name, goals, assists, rating),
    tactics: (formation, style, points) => 
        fanContentGenerator.formatTacticalAnalysis(formation, style, points),
    vote: (type, context) => fanContentGenerator.generateVoteQuestion(type, context),
    commentPrompt: () => fanContentGenerator.generateCommentPrompt(),
    convert: (text, type, team) => 
        fanContentGenerator.convertToFanFriendlyTone(text, type, team),
    share: (title, team) => fanContentGenerator.generateShareMessage(title, team),
    related: () => fanContentGenerator.generateRelatedArticleIntro()
};

console.log('🎪 Arsenal Chan風ファンフレンドリーコンテンツシステム読み込み完了！');
