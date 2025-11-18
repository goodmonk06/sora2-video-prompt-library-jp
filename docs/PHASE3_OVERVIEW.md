# Phase 3 Overview

## Purpose Statement

このリポジトリは、**AI動画生成ツール「Sora2」向けのプロンプトライブラリ管理システム**です。クリエイター、チーム、組織が動画生成プロンプトを体系的に管理・共有・再利用できる基盤を提供します。単なるCRUDアプリではなく、プロンプトエンジニアリングのベストプラクティスを蓄積し、AI動画制作ワークフローを加速させるためのナレッジベースとして機能します。

より大きなエコシステム（AIコミュニティプラットフォーム、コンテンツ制作ツール群、マーケットプレイス等）の中核コンポーネントとして、他のサービスと連携できる設計を目指します。

## Current Features (Phase 2完了時点)

### 実装済み機能
- ✅ **PromptPreset CRUD**: 完全な垂直スライス（Create/List/Read/Update/Delete）
- ✅ **検索・フィルタリング**: タイトル、説明、プロンプト内容での全文検索、タグフィルタ
- ✅ **Zodバリデーション**: すべてのAPI入力の型安全なバリデーション
- ✅ **集中エラーハンドリング**: 統一されたAPIレスポンス形式
- ✅ **テスト**: Vitest + 13テスト（100%パス）
- ✅ **Docker対応**: Dockerfile + docker-compose.yml
- ✅ **Seedデータ**: 10個の現実的なサンプルプロンプト
- ✅ **包括的README**: セットアップ、ドメインモデル、APIドキュメント

### 現在の制限
- ❌ **単一エンティティのみ**: PromptPresetのみで、関連エンティティがない
- ❌ **バージョン管理なし**: プロンプトの変更履歴が追跡できない
- ❌ **コレクション機能なし**: プロンプトをグループ化・整理できない
- ❌ **お気に入り機能なし**: 頻繁に使うプロンプトを素早くアクセスできない
- ❌ **エクスポート/インポートなし**: データの移行・バックアップが困難
- ❌ **メトリクス不足**: 利用状況、人気度などのデータがない
- ❌ **拡張ポイント未整備**: プラグインやアダプターの仕組みがない
- ❌ **イベントシステムなし**: ドメインイベントによる疎結合な拡張ができない

## Phase 3 Implementation Plan

### 1. ドメインモデルの深化 (Domain Deepening)

#### 新規エンティティ
- **Collection**: プロンプトをフォルダ/カテゴリに整理
  - fields: id, name, description, createdAt, updatedAt
  - relations: Collection → PromptPreset (many-to-many)

- **PromptHistory**: プロンプトの変更履歴を自動追跡
  - fields: id, promptPresetId, snapshot (JSON), changeType, changedAt
  - relations: PromptHistory → PromptPreset (many-to-one)

- **Favorite**: ユーザーお気に入り（将来のマルチユーザー対応準備）
  - fields: id, promptPresetId, userId (将来用), createdAt
  - relations: Favorite → PromptPreset (many-to-one)

- **Tag**: タグの正規化（現在はJSON配列）
  - fields: id, name, slug, usageCount, createdAt
  - relations: Tag ← PromptPreset (many-to-many via PromptTag)

#### 既存エンティティの拡張
- **PromptPreset**に追加フィールド:
  - `viewCount`: 閲覧回数
  - `usageCount`: 使用回数
  - `lastUsedAt`: 最終使用日時
  - `isArchived`: アーカイブフラグ
  - `quality`: 品質評価（1-5）
  - `collectionId`: 所属コレクション（nullable）

### 2. 複数の垂直スライス実装 (Multiple Vertical Slices)

#### スライス1: コレクション管理
- Create collection → Add prompts → List collections → View collection detail → Remove prompts
- API: `/api/collections` (CRUD)
- UI: `/collections`, `/collections/new`, `/collections/[id]`

#### スライス2: 変更履歴追跡
- Automatic history on prompt updates → View history → Compare versions → Restore from history
- API: `/api/prompts/[id]/history`
- UI: `/prompts/[id]` に履歴タブ追加

#### スライス3: お気に入りシステム
- Toggle favorite → List favorites → Quick access
- API: `/api/favorites`
- UI: `/favorites` ページ、一覧にお気に入りアイコン

#### スライス4: エクスポート/インポート
- Export to JSON/CSV → Import from file → Bulk operations
- API: `/api/export`, `/api/import`
- UI: エクスポート/インポートボタン

### 3. 拡張性とプラグインポイント (Extensibility)

#### アダプターインターフェース
- **IExportAdapter**: 異なる形式へのエクスポート
  - implementations: JsonExportAdapter, CsvExportAdapter, MarkdownExportAdapter
- **INotificationAdapter**: 通知送信（将来の外部システム連携用）
  - implementations: ConsoleNotificationAdapter (stub)
- **IMetricsAdapter**: メトリクス収集
  - implementations: InMemoryMetricsAdapter, LogMetricsAdapter
- **IStorageAdapter**: 画像・ファイル保存（将来用）
  - implementations: LocalStorageAdapter, S3Adapter (stub)

#### イベントシステム
- **Domain Events**: `PromptCreated`, `PromptUpdated`, `PromptDeleted`, `CollectionCreated`, etc.
- **Event Bus**: シンプルなin-memoryイベントバス
- **Event Handlers**: 拡張可能なハンドラー登録機構

### 4. DX強化 (Developer Experience)

#### CLI ツール
- `npm run cli:seed` - カスタムシードオプション
- `npm run cli:export` - データエクスポート
- `npm run cli:stats` - 統計情報表示
- `npm run cli:cleanup` - データクリーンアップ

#### 開発ツール
- Hot reload最適化
- より詳細なログ出力
- デバッグモード

### 5. 品質向上 (Quality Hardening)

#### ロギング
- 構造化ログ (`lib/logger.ts`)
- コンテキスト付きログ
- ログレベル管理

#### メトリクス
- API呼び出しカウント
- レスポンスタイム計測
- エラー率追跡

#### テスト拡充
- 統合テスト: 各垂直スライスのE2Eテスト
- テストフィクスチャ: 再利用可能なテストデータファクトリー
- 目標: 50+テスト

### 6. ドキュメント強化 (Documentation)

- **docs/ARCHITECTURE.md**: システムアーキテクチャ詳細
- **docs/DOMAIN_MODEL.md**: ドメインモデル詳細（ER図含む）
- **docs/API_REFERENCE.md**: 完全なAPIリファレンス
- **docs/INTEGRATION_RECIPES.md**: 他システムとの連携例
- **docs/DEVELOPMENT.md**: 開発者ガイド
- **CHANGELOG.md**: 変更履歴

### 7. デモ・サンプル強化

- **50+サンプルプロンプト**: 多様なカテゴリ
- **5+コレクション**: テーマ別分類
- **複数ペルソナ**: 異なる使用パターン

## Success Criteria

Phase 3完了時、このリポジトリは:
1. ✅ 単独で価値のあるプロダクトとして機能する
2. ✅ 他のサービスと容易に統合できる
3. ✅ 50+テストがすべてパスする
4. ✅ 包括的なドキュメントを持つ
5. ✅ プラグイン・拡張が容易
6. ✅ 本番環境にデプロイ可能な品質
