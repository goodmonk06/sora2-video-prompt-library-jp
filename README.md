# Sora2 動画プロンプトライブラリ

Sora2用の動画プロンプトを構造化して管理するWebアプリケーション。タグ、スタイルキーワード、動画長などの詳細情報を付与し、効率的にプロンプトを管理・再利用できます。

## 特徴

- 📝 **プロンプト管理**: メインプロンプト、ネガティブプロンプト、タグ、スタイルキーワードを一元管理
- 🔍 **検索・フィルタ**: タイトル、説明、プロンプト内容での検索、タグによるフィルタリング
- 📋 **ワンクリックコピー**: プロンプトをクリップボードに簡単コピー
- 🏷️ **日本語対応**: タグや説明は日本語で管理、プロンプトは英語で記述
- 🎬 **動画情報**: 動画の長さやスタイルキーワードを記録

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: Prisma + SQLite（開発環境）/ PostgreSQL（本番環境）
- **UI**: シンプルなフォームベースのインターフェース

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール手順

1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/sora2-video-prompt-library-jp.git
cd sora2-video-prompt-library-jp
```

2. 依存関係をインストール

```bash
npm install
```

3. データベースをセットアップ

```bash
npm run db:push
```

4. 開発サーバーを起動

```bash
npm run dev
```

5. ブラウザで `http://localhost:3000` にアクセス

## データモデル

### PromptPreset

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | String | 一意のID |
| title | String | プロンプトのタイトル |
| description | String | 説明（日本語） |
| mainPrompt | String | メインプロンプト（英語） |
| negativePrompt | String | ネガティブプロンプト（英語） |
| tags | JSON | タグの配列（日本語） |
| lengthSeconds | Int | 動画の長さ（秒） |
| styleKeywords | JSON | スタイルキーワードの配列 |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

## 主な機能

### プロンプト一覧 (`/prompts`)
- すべてのプロンプトをカード形式で表示
- 検索バーでタイトル、説明、プロンプト内容を検索
- タグでフィルタリング
- 作成日時順にソート

### 新規作成 (`/prompts/new`)
- タイトル、説明、メインプロンプト、ネガティブプロンプトの入力
- タグとスタイルキーワードの追加（カンマ区切り）
- 動画の長さ（秒数）の指定

### 詳細表示 (`/prompts/[id]`)
- プロンプトの全詳細を表示
- メインプロンプト、ネガティブプロンプトの個別コピーボタン
- フルプロンプト（統合版）のコピー機能
- プロンプトの削除

## 将来の拡張計画

### 短期（Phase 1）
- [ ] プロンプトの編集機能
- [ ] お気に入り機能
- [ ] プロンプトの複製機能
- [ ] サンプルデータのインポート

### 中期（Phase 2）
- [ ] **エクスポート機能**
  - JSON形式でのエクスポート
  - CSV形式でのエクスポート
  - プロンプトの一括エクスポート
- [ ] **インポート機能**
  - JSON/CSVからのインポート
  - 既存データとのマージ機能

### 長期（Phase 3）
- [ ] **API連携**
  - RESTful API の公開
  - 外部ツールとの連携
  - Webhook サポート
- [ ] **コミュニティ機能**
  - プロンプトの共有
  - 評価・レビュー機能
  - コレクション機能
- [ ] **高度な管理機能**
  - カテゴリー管理
  - バージョン管理
  - 履歴機能
  - AI による自動タグ付け

### その他の検討事項
- [ ] PostgreSQL への移行（本番環境）
- [ ] 認証機能（マルチユーザー対応）
- [ ] 画像プレビュー機能
- [ ] プロンプトテンプレート機能
- [ ] ダークモード対応

## 開発

### スクリプト

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# データベーススキーマを更新
npm run db:push

# Prisma Studio（データベースGUI）を起動
npm run db:studio
```

### ディレクトリ構造

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── prompts/       # プロンプト CRUD API
│   ├── prompts/           # プロンプト関連ページ
│   ├── layout.tsx         # ルートレイアウト
│   └── globals.css        # グローバルスタイル
├── lib/                   # ユーティリティ
│   ├── prisma.ts          # Prisma クライアント
│   └── types.ts           # TypeScript型定義
├── prisma/                # Prisma設定
│   └── schema.prisma      # データベーススキーマ
└── package.json           # 依存関係
```

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## ライセンス

MIT
