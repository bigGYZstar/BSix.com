const fs = require('fs');
const path = require('path');

// ホームリンクのHTML
const homeLinkHTML = '<a href="index.html" class="home-link">ホーム</a>';

// ホームリンクのCSS
const homeLinkCSS = `
        .home-link {
            display: inline-flex;
            align-items: center;
            background: #667eea;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .home-link:hover {
            background: #5a67d8;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            color: white;
        }

        .home-link::before {
            content: "🏠";
            margin-right: 6px;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .page-header h1 {
            margin: 0;
            flex: 1;
        }

        @media (max-width: 768px) {
            .home-link {
                padding: 6px 12px;
                font-size: 0.8rem;
            }
            
            .page-header {
                flex-direction: column;
                gap: 15px;
                align-items: flex-start;
            }
            
            .page-header .home-link {
                align-self: flex-end;
            }
        }`;

// 処理対象のHTMLファイル
const htmlFiles = [
    'fixtures.html',
    'teams.html', 
    'match-preview.html',
    'liverpool.html',
    'arsenal.html',
    'chelsea.html',
    'liverpool-enhanced.html',
    'team-detail-synced.html',
    'player-detail.html',
    'news.html'
];

htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // CSSを追加（まだ追加されていない場合）
        if (!content.includes('.home-link {')) {
            content = content.replace('</style>', homeLinkCSS + '\n    </style>');
        }
        
        // ページタイトルをpage-headerクラスで囲む
        content = content.replace(
            /<h1 class="page-title">([^<]+)<\/h1>/g,
            '<div class="page-header"><h1 class="page-title">$1</h1>' + homeLinkHTML + '</div>'
        );
        
        // 既存のpage-headerがある場合はホームリンクを追加
        if (content.includes('class="page-header"') && !content.includes('class="home-link"')) {
            content = content.replace(
                /<div class="page-header">([^<]+)<\/div>/g,
                '<div class="page-header">$1' + homeLinkHTML + '</div>'
            );
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ ${filename} にホームリンクを追加しました`);
    } else {
        console.log(`⚠️ ${filename} が見つかりません`);
    }
});

console.log('🎉 全ページへのホームリンク追加が完了しました！');
