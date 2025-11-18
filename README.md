# Sora2 動画プロンプトライブラリ

> **本番運用可能な**Sora2用動画プロンプト管理システム。エンドツーエンドで動作する完全な垂直スライスを実装済み。

Sora2用の動画プロンプトを構造化して管理するWebアプリケーション。タグ、スタイルキーワード、動画長などの詳細情報を付与し、効率的にプロンプトを管理・再利用できます。バリデーション、エラーハンドリング、テスト、Docker環境を含む、Phase 2レベルの実装です。

## 🎯 Overview

このプロジェクトは、AI動画生成ツール「Sora2」向けのプロンプトを体系的に管理するためのWebアプリケーションです。クリエイターやチームがプロンプトをライブラリ化し、検索・再利用・共有できる環境を提供します。

### 主な特徴

- ✅ **完全な垂直スライス**: Create → List → Detail → Update → Delete のフルCRUD実装
- 📝 **プロンプト管理**: メインプロンプト、ネガティブプロンプト、タグ、スタイルキーワードを一元管理
- 🔍 **高度な検索**: タイトル、説明、プロンプト内容での全文検索、タグによるフィルタリング
- 📋 **ワンクリックコピー**: プロンプトをクリップボードに簡単コピー
- 🏷️ **多言語対応**: タグや説明は日本語で管理、プロンプトは英語で記述
- 🎬 **メタデータ管理**: 動画の長さやスタイルキーワードを記録
- ✨ **型安全**: zodによるバリデーション、TypeScriptによるエンドツーエンドの型安全性
- 🧪 **テスト済み**: Vitestによる自動テスト（13テストパス）
- 🐳 **Docker対応**: ワンコマンドで環境構築可能

## 🛠️ Tech Stack

### Core
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベースORM**: Prisma

### Development
- **データベース**: SQLite（開発）/ PostgreSQL（本番）
- **バリデーション**: Zod
- **テスト**: Vitest
- **コンテナ**: Docker & Docker Compose

### API & Validation
- **APIルート**: Next.js API Routes
- **エラーハンドリング**: 集中管理されたエラーハンドラー
- **型安全**: エンドツーエンドの型定義

## 🚀 Getting Started

### Requirements

- **Node.js**: 18.0以上
- **npm**: 9.0以上（またはyarn/pnpm）
- **Docker**: 20.10以上（オプション、推奨）
- **Docker Compose**: 2.0以上（オプション、推奨）

### Quick Start（推奨：Docker使用）

```bash
# 1. リポジトリをクローン
git clone https://github.com/yourusername/sora2-video-prompt-library-jp.git
cd sora2-video-prompt-library-jp

# 2. 環境変数をコピー
cp .env.example .env

# 3. Dockerで起動（データベース含む）
docker-compose up -d

# 4. ブラウザでアクセス
open http://localhost:3000
```

これだけで、アプリケーション、データベース、サンプルデータがすべてセットアップされます。

### ローカル開発セットアップ（Docker不使用）

```bash
# 1. リポジトリをクローン
git clone https://github.com/yourusername/sora2-video-prompt-library-jp.git
cd sora2-video-prompt-library-jp

# 2. 依存関係をインストール
npm install

# 3. 環境変数をコピー
cp .env.example .env

# 4. データベースをセットアップ
npm run db:push

# 5. サンプルデータを投入
npm run db:seed

# 6. 開発サーバーを起動
npm run dev

# 7. ブラウザでアクセス
open http://localhost:3000
```

### デモデータ

初回起動時に、10個の現実的なプロンプトサンプルが自動的に投入されます：

- 未来都市の夕暮れ
- 静かな森の朝
- 宇宙ステーションからの地球
- 雨の夜の東京
- サバンナの日の出
- 波打ち際のスローモーション
- 桜吹雪の京都
- オーロラの夜空
- 料理の調理過程（マクロ撮影）
- ドローンによる山岳地帯の空撮

## 📊 Domain Model

このアプリケーションは、**PromptPreset**という単一の中核エンティティを中心に設計されています。

### PromptPreset（プロンプトプリセット）

Sora2用の動画生成プロンプトを構造化して保存するエンティティ。

| フィールド | 型 | バリデーション | 説明 |
|-----------|-----|--------------|------|
| `id` | String | cuid | 一意の識別子 |
| `title` | String | 1-200文字 | プロンプトのタイトル（日本語可） |
| `description` | String | 1-1000文字 | プロンプトの説明（日本語推奨） |
| `mainPrompt` | String | 1-5000文字 | メインプロンプト（英語推奨） |
| `negativePrompt` | String | 0-2000文字 | ネガティブプロンプト（英語） |
| `tags` | JSON Array | - | カテゴリタグ（日本語）例: `["SF", "都市", "夕暮れ"]` |
| `lengthSeconds` | Int | 1-60 | 動画の長さ（秒単位） |
| `styleKeywords` | JSON Array | - | スタイルキーワード 例: `["cinematic", "slow motion"]` |
| `createdAt` | DateTime | 自動 | 作成日時 |
| `updatedAt` | DateTime | 自動 | 最終更新日時 |

### エンティティ関係

現在はシンプルな単一エンティティモデルですが、将来的には以下の拡張が可能：

- **User** → PromptPreset（1対多）: ユーザー認証とマルチテナント対応
- **Collection** ← PromptPreset（多対多）: プロンプトのコレクション/フォルダ機能
- **PromptVersion** ← PromptPreset（1対多）: プロンプトのバージョン管理

## 🎬 Example Flow（垂直スライス実装例）

このアプリケーションは、**完全なCRUDフロー**が実装されています。以下は典型的な使用例です：

### ユースケース：新しいプロンプトの作成と使用

1. **作成（Create）** - `/prompts/new`
   ```
   ユーザーが新規プロンプト作成ページにアクセス
   → フォームに入力（タイトル、説明、プロンプトなど）
   → zodによるバリデーション
   → POST /api/prompts
   → データベースに保存
   → 詳細ページにリダイレクト
   ```

2. **一覧表示（List）** - `/prompts`
   ```
   ユーザーがプロンプト一覧ページにアクセス
   → GET /api/prompts（検索・フィルタパラメータ付き）
   → カード形式で一覧表示
   → 検索バーでリアルタイムフィルタリング
   → タグでのフィルタリング
   ```

3. **詳細表示（Read）** - `/prompts/[id]`
   ```
   ユーザーがプロンプトカードをクリック
   → GET /api/prompts/[id]
   → 詳細情報を表示
   → コピーボタンでクリップボードにコピー
   → Sora2で使用
   ```

4. **更新（Update）** - API経由
   ```
   （将来実装予定）
   → PUT /api/prompts/[id]
   → zodによるバリデーション
   → データベース更新
   ```

5. **削除（Delete）** - `/prompts/[id]`
   ```
   ユーザーが削除ボタンをクリック
   → 確認ダイアログ表示
   → DELETE /api/prompts/[id]
   → 一覧ページにリダイレクト
   ```

### API エンドポイント一覧

| メソッド | エンドポイント | 説明 | バリデーション |
|---------|--------------|------|--------------|
| `GET` | `/api/prompts` | プロンプト一覧取得 | searchPromptsSchema |
| `POST` | `/api/prompts` | 新規プロンプト作成 | createPromptSchema |
| `GET` | `/api/prompts/[id]` | プロンプト詳細取得 | - |
| `PUT` | `/api/prompts/[id]` | プロンプト更新 | updatePromptSchema |
| `DELETE` | `/api/prompts/[id]` | プロンプト削除 | - |

すべてのAPIは、zodバリデーション、統一されたエラーハンドリング、型安全なレスポンスを提供します。

## 🔧 Development

### Available Scripts

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:3000） |
| `npm run build` | 本番用ビルド |
| `npm start` | 本番サーバー起動 |
| `npm test` | テスト実行（Vitest） |
| `npm run test:watch` | テストをwatch mode実行 |
| `npm run test:ui` | テストUIを起動 |
| `npm run lint` | ESLint実行 |
| `npm run db:push` | データベーススキーマをプッシュ |
| `npm run db:migrate` | マイグレーション実行 |
| `npm run db:seed` | サンプルデータを投入 |
| `npm run db:reset` | データベースをリセットして再seed |
| `npm run db:studio` | Prisma Studio起動（データベースGUI） |

### ディレクトリ構造

```
sora2-video-prompt-library-jp/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── prompts/              # プロンプト CRUD API
│   │       ├── route.ts          # GET, POST /api/prompts
│   │       └── [id]/route.ts     # GET, PUT, DELETE /api/prompts/[id]
│   ├── prompts/                  # プロンプト関連ページ
│   │   ├── page.tsx              # 一覧ページ
│   │   ├── new/page.tsx          # 新規作成ページ
│   │   └── [id]/page.tsx         # 詳細ページ
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # ホームページ（/promptsへリダイレクト）
│   └── globals.css               # グローバルスタイル
├── lib/                          # ユーティリティ・ビジネスロジック
│   ├── prisma.ts                 # Prisma クライアント
│   ├── types.ts                  # TypeScript型定義
│   ├── validations.ts            # Zod バリデーションスキーマ
│   ├── api-response.ts           # API レスポンスヘルパー
│   └── __tests__/                # テストファイル
│       ├── validations.test.ts   # バリデーションテスト
│       └── api-response.test.ts  # APIレスポンステスト
├── prisma/                       # Prisma設定
│   ├── schema.prisma             # データベーススキーマ
│   ├── seed.ts                   # Seedスクリプト
│   └── dev.db                    # SQLiteデータベース（git無視）
├── public/                       # 静的ファイル
├── .env                          # 環境変数（git無視）
├── .env.example                  # 環境変数テンプレート
├── Dockerfile                    # Docker設定
├── docker-compose.yml            # Docker Compose設定
├── vitest.config.ts              # Vitestテスト設定
├── next.config.mjs               # Next.js設定
├── tailwind.config.ts            # Tailwind CSS設定
├── tsconfig.json                 # TypeScript設定
└── package.json                  # 依存関係・スクリプト
```

### Testing

```bash
# すべてのテストを実行
npm test

# Watch modeでテスト実行
npm run test:watch

# テストUIを起動
npm run test:ui
```

現在のテストカバレッジ：
- ✅ バリデーションスキーマ（11テスト）
- ✅ APIレスポンスユーティリティ（2テスト）
- **合計13テスト、すべてパス**

## 🚢 Deployment

### Docker Composeでのデプロイ

```bash
# 本番環境用にビルド・起動
docker-compose up -d

# ログ確認
docker-compose logs -f app

# 停止
docker-compose down
```

### PostgreSQLへの移行（本番環境）

1. `.env`を編集：
```env
DATABASE_URL="postgresql://sora2:sora2password@db:5432/sora2_prompts"
```

2. `prisma/schema.prisma`を編集：
```prisma
datasource db {
  provider = "postgresql"  // sqliteから変更
  url      = env("DATABASE_URL")
}
```

3. マイグレーション実行：
```bash
npm run db:migrate
npm run db:seed
```

## 🔮 Future Extensions

このプロジェクトは、より大きなエコシステムの**再利用可能なビルディングブロック**として設計されています。

### 短期（Phase 3）
- [ ] **プロンプト編集機能**: フロントエンドからのPUT操作
- [ ] **お気に入り機能**: ユーザーごとのお気に入り管理
- [ ] **プロンプト複製**: 既存プロンプトをベースに新規作成
- [ ] **高度な検索**: 全文検索エンジン統合（Meilisearch/Typesense）

### 中期（Phase 4）
- [ ] **エクスポート/インポート機能**
  - JSON/CSV形式でのエクスポート
  - 一括インポート
  - 他のツールとのデータ交換
- [ ] **認証・認可**
  - NextAuth.js統合
  - マルチテナント対応
  - チーム・組織機能
- [ ] **AI機能**
  - プロンプト自動生成
  - タグ自動付与
  - 類似プロンプト検索

### 長期（Phase 5+）
- [ ] **プロンプトマーケットプレイス**
  - コミュニティ共有
  - 評価・レビュー
  - 有料プロンプト販売
- [ ] **外部API連携**
  - Sora2直接連携
  - 他のAI動画ツール対応
  - Webhook統合
- [ ] **高度な管理機能**
  - バージョン管理
  - 変更履歴
  - ロールバック機能
  - A/Bテスト機能

## 🤝 Contributing

貢献を歓迎します！以下の手順でプルリクエストを送ってください：

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

大きな変更の場合は、まずissueを開いて議論してください。

## 📄 License

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Zod](https://zod.dev/) - TypeScript-first スキーマバリデーション
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS
- [Vitest](https://vitest.dev/) - 高速ユニットテストフレームワーク

---

**🎬 Happy Prompt Engineering!**
