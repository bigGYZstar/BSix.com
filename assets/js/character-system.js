/**
 * BSix.com キャラクターシステム (モジュラー設計)
 * 後でキャラクター設定を簡単に変更できるシステム
 */

class BSixCharacterSystem {
    constructor() {
        // キャラクター設定は外部から簡単に変更可能
        this.currentCharacter = 'test_friendly'; // テスト用キャラクター
        this.characterProfiles = this.loadCharacterProfiles();
        this.activeProfile = this.characterProfiles[this.currentCharacter];
    }

    /**
     * キャラクタープロファイルの定義
     * 後で簡単に変更・追加できるように分離
     */
    loadCharacterProfiles() {
        return {
            // テスト用：Arsenal Chan風の親しみやすいキャラクター
            test_friendly: {
                name: "BSix編集部",
                personality: "friendly",
                tone: "casual",
                greetings: {
                    morning: ["おはよう！", "Good morning!", "今日も一日頑張ろう！"],
                    afternoon: ["お疲れさま！", "こんにちは〜", "午後もよろしく！"],
                    evening: ["お疲れさまでした！", "今日もありがとう！", "また明日〜！"]
                },
                expressions: {
                    excitement: ["やったー！", "すごいね！", "最高だ！", "信じられない！"],
                    disappointment: ["あ〜残念", "うーん、惜しい", "次回に期待！", "まあ、そういう日もあるよね"],
                    surprise: ["え！？", "まさか！", "びっくり！", "予想外だね"],
                    agreement: ["そうそう！", "その通り！", "激しく同意！", "わかる〜"],
                    thinking: ["うーん", "どうかな？", "個人的には", "考えてみると"]
                },
                sentence_endings: {
                    statement: ["だよ", "だね", "なんだ", "よ"],
                    question: ["かな？", "だと思う？", "どうかな？", "よね？"],
                    excitement: ["！", "〜！", "だよ！", "ね！"]
                },
                team_reactions: {
                    liverpool: {
                        good: ["YNWA！", "アンフィールドの魔法だね", "さすがレッズ！"],
                        bad: ["まさかの展開", "アンフィールドでも", "予想外だったね"]
                    },
                    arsenal: {
                        good: ["ガナーズ最高！", "アルテタ・マジック", "エミレーツが沸いた"],
                        bad: ["またしても", "典型的なアーセナル", "お馴染みの展開"]
                    },
                    chelsea: {
                        good: ["ブルーズの意地", "スタンフォード・ブリッジの歓声", "チェルシー・プライド"],
                        bad: ["まさかの失速", "予想外の展開", "チェルシーらしからぬ"]
                    },
                    manchester_city: {
                        good: ["ペップ・マジック", "エティハドの完璧さ", "シティの圧倒的な力"],
                        bad: ["まさかのシティが", "予想外にシティが", "信じられないことに"]
                    },
                    manchester_united: {
                        good: ["オールド・トラッフォードの伝統", "レッドデビルズの誇り", "ユナイテッドの底力"],
                        bad: ["またしてもユナイテッドが", "お馴染みの展開", "典型的なユナイテッド"]
                    },
                    tottenham: {
                        good: ["スパーズの勢い", "ポステコグルー革命", "攻撃サッカーの魅力"],
                        bad: ["Spursyな展開", "またしてもスパーズが", "典型的なトッテナム"]
                    }
                },
                humor_level: 0.7, // 0-1の範囲でユーモアの度合い
                formality_level: 0.3, // 0-1の範囲で丁寧さの度合い
                emoji_usage: 0.8 // 0-1の範囲で絵文字使用頻度
            },

            // 将来追加予定のキャラクター例
            professional: {
                name: "BSix分析チーム",
                personality: "analytical",
                tone: "professional",
                greetings: {
                    morning: ["おはようございます", "本日もよろしくお願いします"],
                    afternoon: ["お疲れさまです", "午後の分析をお届けします"],
                    evening: ["本日もありがとうございました", "また明日もよろしくお願いします"]
                },
                // ... 他の設定
                humor_level: 0.2,
                formality_level: 0.8,
                emoji_usage: 0.3
            },

            enthusiastic: {
                name: "BSixファン代表",
                personality: "passionate",
                tone: "energetic",
                greetings: {
                    morning: ["おはよう！今日も熱く行こう！", "朝からテンション上がってる！"],
                    afternoon: ["午後も盛り上がっていこう！", "まだまだ元気だよ〜"],
                    evening: ["今日も最高だった！", "明日も楽しみすぎる！"]
                },
                // ... 他の設定
                humor_level: 0.9,
                formality_level: 0.1,
                emoji_usage: 0.9
            }
        };
    }

    /**
     * キャラクターを簡単に切り替える
     */
    switchCharacter(characterKey) {
        if (this.characterProfiles[characterKey]) {
            this.currentCharacter = characterKey;
            this.activeProfile = this.characterProfiles[characterKey];
            console.log(`キャラクターを ${characterKey} に変更しました`);
            return true;
        }
        console.warn(`キャラクター ${characterKey} が見つかりません`);
        return false;
    }

    /**
     * 時間帯に応じた挨拶を生成
     */
    generateGreeting(timeOfDay = null) {
        if (!timeOfDay) {
            const hour = new Date().getHours();
            if (hour < 12) timeOfDay = 'morning';
            else if (hour < 18) timeOfDay = 'afternoon';
            else timeOfDay = 'evening';
        }

        const greetings = this.activeProfile.greetings[timeOfDay] || this.activeProfile.greetings.afternoon;
        return this.getRandomElement(greetings);
    }

    /**
     * 感情に応じた表現を生成
     */
    generateExpression(emotion) {
        const expressions = this.activeProfile.expressions[emotion];
        if (!expressions) return "";
        return this.getRandomElement(expressions);
    }

    /**
     * チーム関連の反応を生成
     */
    generateTeamReaction(teamKey, situation = 'good') {
        const teamReactions = this.activeProfile.team_reactions[teamKey];
        if (!teamReactions || !teamReactions[situation]) return "";
        return this.getRandomElement(teamReactions[situation]);
    }

    /**
     * 文章の語尾を調整
     */
    adjustSentenceEnding(sentence, type = 'statement') {
        const endings = this.activeProfile.sentence_endings[type] || this.activeProfile.sentence_endings.statement;
        const ending = this.getRandomElement(endings);
        
        // 既存の語尾を置換
        return sentence.replace(/[。！？]$/, '') + ending;
    }

    /**
     * 絵文字を適度に追加
     */
    addEmojis(text) {
        if (Math.random() > this.activeProfile.emoji_usage) return text;

        const emojis = {
            positive: ['😊', '👍', '🎉', '⚽', '🔥', '✨', '💪'],
            negative: ['😅', '😰', '💦', '😢', '😔'],
            neutral: ['🤔', '📊', '⚽', '🏟️', '👀', '📈']
        };

        // 文章の感情を簡単に判定
        let emojiSet = emojis.neutral;
        if (text.includes('最高') || text.includes('素晴らしい') || text.includes('勝利')) {
            emojiSet = emojis.positive;
        } else if (text.includes('残念') || text.includes('敗北') || text.includes('失敗')) {
            emojiSet = emojis.negative;
        }

        const emoji = this.getRandomElement(emojiSet);
        return text + ' ' + emoji;
    }

    /**
     * 文章全体をキャラクターの個性に合わせて調整
     */
    processText(text, options = {}) {
        let processedText = text;

        // 丁寧語レベルの調整
        if (this.activeProfile.formality_level < 0.5) {
            processedText = processedText
                .replace(/です。/g, 'だよ。')
                .replace(/ます。/g, 'るよ。')
                .replace(/でした。/g, 'だったね。')
                .replace(/ました。/g, 'たよ。');
        }

        // ユーモアレベルに応じた調整
        if (this.activeProfile.humor_level > 0.5 && Math.random() < 0.3) {
            // 適度にユーモラスな表現を追加
            const humorPhrases = ['（笑）', 'w', '〜', '！'];
            const phrase = this.getRandomElement(humorPhrases);
            processedText = processedText.replace(/。$/, phrase + '。');
        }

        // 絵文字の追加
        if (options.addEmojis !== false) {
            processedText = this.addEmojis(processedText);
        }

        return processedText;
    }

    /**
     * 記事タイプに応じたコンテンツを生成
     */
    generateContent(type, context = {}) {
        const templates = {
            match_preview: {
                intro: () => `${this.generateGreeting()} 今度の試合、${this.generateExpression('excitement')}`,
                analysis: () => `個人的には${this.generateExpression('thinking')}、どうかな？`,
                prediction: () => `予想は難しいけど、${this.generateExpression('thinking')}`,
                closing: () => `みんなの予想も聞かせてね${this.generateExpression('agreement')}`
            },
            match_review: {
                intro: () => `${this.generateGreeting()} 今日の試合、どうだった？`,
                analysis: () => `今日のポイントは${this.generateExpression('thinking')}`,
                result: (team, situation) => `${this.generateTeamReaction(team, situation)}`,
                closing: () => `次の試合も楽しみ${this.generateExpression('excitement')}`
            },
            news: {
                intro: () => `${this.generateGreeting()} 面白いニュースが入ってきたよ`,
                analysis: () => `これについて${this.generateExpression('thinking')}`,
                closing: () => `続報も要チェックだね${this.generateExpression('agreement')}`
            }
        };

        const template = templates[type];
        if (!template) return "";

        return template;
    }

    /**
     * 配列からランダムに要素を選択
     */
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * 現在のキャラクター設定を取得
     */
    getCurrentProfile() {
        return {
            character: this.currentCharacter,
            profile: this.activeProfile
        };
    }

    /**
     * 新しいキャラクタープロファイルを追加
     */
    addCharacterProfile(key, profile) {
        this.characterProfiles[key] = profile;
        console.log(`新しいキャラクター ${key} を追加しました`);
    }

    /**
     * キャラクター設定をJSONで出力（バックアップ用）
     */
    exportCharacterSettings() {
        return JSON.stringify({
            currentCharacter: this.currentCharacter,
            profiles: this.characterProfiles
        }, null, 2);
    }

    /**
     * キャラクター設定をJSONから読み込み
     */
    importCharacterSettings(jsonString) {
        try {
            const settings = JSON.parse(jsonString);
            this.characterProfiles = settings.profiles;
            this.switchCharacter(settings.currentCharacter);
            console.log('キャラクター設定を読み込みました');
            return true;
        } catch (error) {
            console.error('キャラクター設定の読み込みに失敗:', error);
            return false;
        }
    }
}

// グローバルインスタンスの作成
const bsixCharacter = new BSixCharacterSystem();

// 簡単に使えるヘルパー関数
window.BSixCharacter = {
    system: bsixCharacter,
    
    // 簡単アクセス用のヘルパー
    switch: (character) => bsixCharacter.switchCharacter(character),
    greet: (time) => bsixCharacter.generateGreeting(time),
    express: (emotion) => bsixCharacter.generateExpression(emotion),
    teamReact: (team, situation) => bsixCharacter.generateTeamReaction(team, situation),
    process: (text, options) => bsixCharacter.processText(text, options),
    generate: (type, context) => bsixCharacter.generateContent(type, context),
    profile: () => bsixCharacter.getCurrentProfile(),
    export: () => bsixCharacter.exportCharacterSettings(),
    import: (json) => bsixCharacter.importCharacterSettings(json),
    
    // テスト用の簡単な文章生成
    testSentence: (team, situation) => {
        const greeting = bsixCharacter.generateGreeting();
        const reaction = bsixCharacter.generateTeamReaction(team, situation);
        const expression = bsixCharacter.generateExpression(situation === 'good' ? 'excitement' : 'disappointment');
        return bsixCharacter.processText(`${greeting} ${reaction} ${expression}`);
    }
};

console.log('🎭 BSix.com キャラクターシステム読み込み完了！');
console.log('現在のキャラクター:', bsixCharacter.currentCharacter);
console.log('使用例: BSixCharacter.testSentence("liverpool", "good")');

// 使用例のデモ
if (typeof window !== 'undefined') {
    // ブラウザ環境でのデモ
    setTimeout(() => {
        console.log('=== キャラクターシステム デモ ===');
        console.log('挨拶:', BSixCharacter.greet());
        console.log('リヴァプール勝利:', BSixCharacter.testSentence('liverpool', 'good'));
        console.log('シティ敗北:', BSixCharacter.testSentence('manchester_city', 'bad'));
        console.log('現在の設定:', BSixCharacter.profile());
    }, 1000);
}
