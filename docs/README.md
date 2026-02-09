# ドキュメント一覧

## 開発ドキュメント

### 要件定義
- [要件定義書](./requirements.md) - アプリの詳細な要件定義
- [要件定義書（整理版）](./requirements-refined.md) - 整理された要件定義（推奨）

### 実装計画
- [実装計画書](./implementation-plan.md) - Phase別の実装計画
- [実装計画書（整理版）](./implementation-plan-refined.md) - 整理された実装計画（推奨）

### UI/UX
- [画面・ボタン一覧](./screen-inventory.md) - 実装済みの画面とボタンの詳細一覧
- [画面遷移フロー](./navigation-flow.md) - アプリ全体の画面遷移フロー図
- [デザインガイドライン](./design-guidelines.md) - マーケティング要件に基づくデザインシステム
- [テーマ実装ガイド](./theme-implementation.md) - テーマシステムの使用方法と実装例
- [スプラッシュスクリーンデザイン](./splash-screen-design.md) - タイトル画面のデザイン仕様
- [スプラッシュスクリーン実装ガイド](./splash-screen-implementation.md) - スプラッシュスクリーンの実装方法

### マーケティング
- [マーケティング調査](./marketing-research.md) - 市場分析、ターゲットオーディエンス、ブランディング戦略

## デプロイメントドキュメント

### 総合ガイド
- [デプロイメントガイド](./deployment-guide.md) - 認証・広告・配布の包括的ガイド

### 個別ガイド
- [認証設定ガイド](./authentication-guide.md) - 認証設定の詳細（現状と将来の拡張）
- [広告ネットワーク比較](./ad-network-comparison.md) - Google AdMob vs AppLovin MAXの比較
- [AppLovin MAX移行ガイド](./migration-to-applovin.md) - AppLovin MAXへの移行手順（DL1万超えたら）
- [AdMob設定ガイド](./admob-setup.md) - AdMobの詳細な設定手順
- [Google Play配布ガイド](./google-play-deployment.md) - Google Playへの配布手順
- [ビルド設定ガイド](./build-configuration.md) - ビルド設定の詳細
- [ビルドガイド](./build-guide.md) - ステージングと本番ビルドの手順

### テンプレートとチェックリスト
- [プライバシーポリシーテンプレート](./privacy-policy-template.md) - プライバシーポリシーのテンプレート
- [リリース前チェックリスト](./release-checklist.md) - リリース前の確認項目

## ドキュメントの使い方

### 開発を始める場合

1. [要件定義書（整理版）](./requirements-refined.md)を読む
2. [実装計画書（整理版）](./implementation-plan-refined.md)を読む
3. 開発を開始

### リリース準備をする場合

1. [デプロイメントガイド](./deployment-guide.md)を読む
2. [AdMob設定ガイド](./admob-setup.md)で広告を設定
3. [Google Play配布ガイド](./google-play-deployment.md)で配布準備
4. [リリース前チェックリスト](./release-checklist.md)で最終確認

### プライバシーポリシーを作成する場合

1. [プライバシーポリシーテンプレート](./privacy-policy-template.md)をカスタマイズ
2. Webサイトに公開
3. Google Play ConsoleにURLを設定
