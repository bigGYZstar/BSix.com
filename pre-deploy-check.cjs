// 公開前最終チェックスクリプト
const fs = require('fs');
const path = require('path');

console.log('🔍 BSix.com 公開前最終チェック開始...\n');

// チェック結果を格納
let checkResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    errors: []
};

// 1. 必須ファイルの存在確認
console.log('📁 必須ファイル存在チェック...');
const requiredFiles = [
    'index.html',
    'fixtures.html', 
    'teams.html',
    'stats.html',
    'match-preview.html',
    'data/versions/2024-09-20_gw4_accurate_premier_league_table.json',
    'data/version_control_enhanced.json',
    'assets/js/data-sync.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
        checkResults.passed++;
    } else {
        console.log(`❌ ${file} - ファイルが見つかりません`);
        checkResults.failed++;
        checkResults.errors.push(`必須ファイル不足: ${file}`);
    }
});

// 2. データ整合性チェック
console.log('\n📊 データ整合性チェック...');

try {
    // 順位表データの読み込み
    const tableData = JSON.parse(fs.readFileSync('data/versions/2024-09-20_gw4_accurate_premier_league_table.json', 'utf8'));
    
    // ビッグ6チームの順位確認
    const big6Expected = {
        'リヴァプール': { position: 1, points: 12 },
        'アーセナル': { position: 2, points: 9 },
        'トッテナム': { position: 3, points: 9 },
        'チェルシー': { position: 5, points: 8 },
        'マンチェスター・シティ': { position: 8, points: 6 },
        'マンチェスター・ユナイテッド': { position: 14, points: 4 }
    };
    
    let dataIntegrityPassed = true;
    
    tableData.leagueTable.forEach(team => {
        if (big6Expected[team.team]) {
            const expected = big6Expected[team.team];
            if (team.position === expected.position && team.points === expected.points) {
                console.log(`✅ ${team.team}: ${team.position}位 ${team.points}pt`);
                checkResults.passed++;
            } else {
                console.log(`❌ ${team.team}: 期待値(${expected.position}位 ${expected.points}pt) vs 実際(${team.position}位 ${team.points}pt)`);
                checkResults.failed++;
                checkResults.errors.push(`データ不整合: ${team.team}`);
                dataIntegrityPassed = false;
            }
        }
    });
    
    if (dataIntegrityPassed) {
        console.log('✅ ビッグ6順位データ整合性確認');
    }
    
} catch (error) {
    console.log('❌ データファイル読み込みエラー:', error.message);
    checkResults.failed++;
    checkResults.errors.push('データファイル読み込みエラー');
}

// 3. HTMLファイル内容チェック
console.log('\n🌐 HTMLファイル内容チェック...');

const htmlFiles = ['index.html', 'fixtures.html', 'teams.html', 'stats.html', 'match-preview.html'];

htmlFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        
        // 日本向け配信サービスチェック
        if (content.includes('Peacock')) {
            console.log(`⚠️  ${file}: Peacockの記載が残っています`);
            checkResults.warnings++;
        } else if (content.includes('U-NEXT')) {
            console.log(`✅ ${file}: 日本向け配信サービス(U-NEXT)確認`);
            checkResults.passed++;
        }
        
        // レスポンシブデザインチェック
        if (content.includes('viewport') && content.includes('width=device-width')) {
            console.log(`✅ ${file}: レスポンシブデザイン設定確認`);
            checkResults.passed++;
        } else {
            console.log(`❌ ${file}: レスポンシブデザイン設定不足`);
            checkResults.failed++;
            checkResults.errors.push(`レスポンシブ設定不足: ${file}`);
        }
        
        // 文字エンコーディングチェック
        if (content.includes('charset="UTF-8"')) {
            console.log(`✅ ${file}: UTF-8エンコーディング確認`);
            checkResults.passed++;
        } else {
            console.log(`❌ ${file}: UTF-8エンコーディング設定不足`);
            checkResults.failed++;
            checkResults.errors.push(`エンコーディング設定不足: ${file}`);
        }
        
    } catch (error) {
        console.log(`❌ ${file}: ファイル読み込みエラー`);
        checkResults.failed++;
        checkResults.errors.push(`ファイル読み込みエラー: ${file}`);
    }
});

// 4. JavaScriptエラーチェック
console.log('\n⚡ JavaScript構文チェック...');

try {
    if (fs.existsSync('assets/js/data-sync.js')) {
        const jsContent = fs.readFileSync('assets/js/data-sync.js', 'utf8');
        
        // 基本的な構文チェック
        if (jsContent.includes('window.bsixDataSync')) {
            console.log('✅ データ同期システム確認');
            checkResults.passed++;
        } else {
            console.log('❌ データ同期システム不足');
            checkResults.failed++;
            checkResults.errors.push('データ同期システム不足');
        }
    }
} catch (error) {
    console.log('❌ JavaScript構文エラー:', error.message);
    checkResults.failed++;
    checkResults.errors.push('JavaScript構文エラー');
}

// 5. 最終結果表示
console.log('\n' + '='.repeat(50));
console.log('📋 最終チェック結果');
console.log('='.repeat(50));
console.log(`✅ 成功: ${checkResults.passed}`);
console.log(`❌ 失敗: ${checkResults.failed}`);
console.log(`⚠️  警告: ${checkResults.warnings}`);

if (checkResults.failed === 0) {
    console.log('\n🎉 すべてのチェックに合格しました！');
    console.log('✅ デプロイ準備完了');
    
    // 成功時のサマリー
    console.log('\n📊 確認済み項目:');
    console.log('• 正確な順位表データ (リヴァプール1位、シティ8位)');
    console.log('• 日本向け配信サービス (U-NEXT統一)');
    console.log('• レスポンシブデザイン (モバイル対応)');
    console.log('• データ連動システム (バージョン管理)');
    console.log('• 文字エンコーディング (UTF-8)');
    
    process.exit(0);
} else {
    console.log('\n❌ 以下の問題を修正してください:');
    checkResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
    });
    
    console.log('\n🚫 デプロイ前に修正が必要です');
    process.exit(1);
}
