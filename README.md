# 試合前ガイド（プレビュー）

[![CI/CD](https://github.com/username/match-preview/actions/workflows/ci.yml/badge.svg)](https://github.com/username/match-preview/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://username.github.io/match-preview/)

試合前ガイド（プレビュー）は、サッカーの試合情報を詳細に表示する静的Webサイトです。布陣、戦術、選手情報、タイムラインなどを見やすく整理して表示します。

## ✨ 特徴

- 🎯 **直感的なUI**: 4つのタブで情報を整理（概要・戦術・布陣・タイムライン）
- ⚽ **詳細な布陣表示**: viewBox=100×140のピッチ座標に同期した正確な配置
- 👤 **選手詳細モーダル**: タップ/クリックで選手の詳細情報とSVGアバターを表示
- 🎨 **ダーク/ライトテーマ**: システム設定に対応した自動テーマ切り替え
- 📱 **完全レスポンシブ**: モバイルからデスクトップまで対応
- 🚀 **高速**: Vanilla TypeScript + Viteによる軽量な実装
- 🔄 **オフライン対応**: 単一HTMLファイルで完結

## 🚀 デモ

[Live Demo](https://username.github.io/match-preview/) でアプリケーションを体験できます。

## 🏗️ 技術スタック

### フロントエンド

- **TypeScript**: 型安全性とDX向上
- **Vite**: 高速ビルドとHMR
- **Vanilla DOM API**: フレームワーク非依存
- **CSS Custom Properties**: デザイントークンによる統一感

### 品質管理

- **ESLint + Prettier**: コード品質とフォーマット
- **JSON Schema**: データ検証
- **Vitest**: ユニットテスト
- **Playwright**: E2Eテスト

### CI/CD

- **GitHub Actions**: 自動化されたテスト・ビルド・デプロイ
- **GitHub Pages**: 静的サイトホスティング

## 🛠️ 開発環境セットアップ

### 必要条件

- Node.js 18+
- npm 8+

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/username/match-preview.git
cd match-preview

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 を開いてアプリケーションにアクセスできます。

## 📝 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果をプレビュー
npm run preview

# 型チェック
npm run typecheck

# リント実行
npm run lint

# フォーマット
npm run format

# ユニットテスト
npm run test:unit

# E2Eテスト
npm run test

# JSONデータ検証
npm run validate:data
```

## 📁 プロジェクト構造

```
├── src/
│   ├── app/                 # アプリケーションコア
│   │   ├── main.ts         # エントリポイント
│   │   ├── state.ts        # 状態管理
│   │   └── router.ts       # ルーティング
│   ├── ui/                 # UI設計システム
│   │   ├── tokens.css      # デザイントークン
│   │   ├── base.css        # ベーススタイル
│   │   ├── components.css  # コンポーネントスタイル
│   │   ├── emblems.ts      # チームエンブレム
│   │   └── avatar.ts       # アバター生成
│   ├── features/           # 機能別実装
│   │   ├── pitch/          # ピッチ描画
│   │   ├── players/        # 選手関連
│   │   └── tabs/          # タブ機能
│   ├── data/              # JSONデータ
│   │   ├── schema/        # スキーマ定義
│   │   ├── fixtures/      # 試合データ
│   │   └── overrides/     # 名前・アバター補正
│   └── index.html         # HTMLエントリポイント
├── tests/                 # テストファイル
├── docs/                  # ドキュメント
└── public/               # 静的ファイル
```

## 🎨 デザインシステム

### デザイントークン

- **色**: ライト・ダークテーマ対応のCSS変数
- **タイポグラフィ**: システムフォント中心の読みやすさ重視
- **スペーシング**: 8pxベースのコンスタントなリズム
- **コンポーネント**: 再利用可能なUIパターン

詳細は [docs/design-tokens.md](docs/design-tokens.md) を参照してください。

### コンポーネント

- **Tab Navigation**: ハッシュルーティング対応
- **Pitch Visualization**: SVG + 絶対配置による正確な布陣表示
- **Player Modal**: アクセシブルなモーダルダイアログ
- **Team Pills**: 自動縮小・折り返し防止

詳細は [docs/components.md](docs/components.md) を参照してください。

## 📊 データモデル

### JSON Schema

- **Player**: 選手の基本情報・統計・アバター設定
- **Team**: チーム情報・フォーメーション・評価
- **Fixture**: 試合情報・タイムライン・メタデータ

### データ管理

- **Fixture**: `/src/data/fixtures/` に試合別JSONファイル
- **Overrides**: 名前の日本語化・アバター推測データ
- **Validation**: JSON Schema + CI による自動検証

詳細は [docs/data-model.md](docs/data-model.md) を参照してください。

## 🧪 テスト

### ユニットテスト

```bash
# 全ユニットテスト実行
npm run test:unit

# ウォッチモード
npm run test:unit -- --watch

# カバレッジ
npm run test:unit -- --coverage
```

### E2Eテスト

```bash
# 全ブラウザでテスト
npm run test

# Chrome のみ
npm run test -- --project=chromium

# ヘッドレスモード無効
npm run test -- --headed
```

### 主要なテストケース

- ✅ 表示名ロジック（姓のみ/フル表示）
- ✅ JSONスキーマ検証
- ✅ チームピルの1行表示（no-wrap）
- ✅ モーダルのアクセシビリティ
- ✅ レスポンシブレイアウト

## 🚀 デプロイ

### 自動デプロイ

メインブランチへのプッシュで自動的にGitHub Pagesにデプロイされます。

### 手動デプロイ

```bash
# ビルド
npm run build

# ビルド成果物を確認
npm run preview

# dist/ フォルダを任意の静的ホスティングにアップロード
```

## 🤝 貢献

### 開発フロー

1. 課題をIssuesで報告・議論
2. フィーチャーブランチを作成
3. 変更を実装（テスト含む）
4. Pull Request作成
5. コードレビュー・マージ

### コーディング規約

- ESLint + Prettier設定に従う
- TypeScriptのstrictモードを使用
- 関数・クラスには型注釈を必須
- CSS Custom Propertiesでスタイル統一

詳細は [docs/contribution.md](docs/contribution.md) を参照してください。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🔄 ロードマップ

### Phase 1 ✅ (現在)

- 基本的な試合プレビュー機能
- ダーク/ライトテーマ
- レスポンシブデザイン
- JSON データ管理

### Phase 2 🚧 (予定)

- 複数試合対応
- 選手データの正規化
- リアルタイムデータ連携
- PWA対応

### Phase 3 📋 (将来)

- 実際の顔写真対応
- 詳細統計表示
- 予測・分析機能
- 多言語対応

## 💬 サポート

- 📋 [Issues](https://github.com/username/match-preview/issues): バグ報告・機能リクエスト
- 💬 [Discussions](https://github.com/username/match-preview/discussions): 質問・議論
- 📧 Email: support@example.com

---

⚽ **Happy Football Watching!** ⚽
