# なんでもカウンターアプリ (Nandemo Counter)

なんでもカウンターアプリは、Expo/React NativeとAWS Serverlessアーキテクチャを使用したモバイルアプリケーションです。

## 📋 目次

- [アプリ概要](#アプリ概要)
- [技術スタック](#技術スタック)
- [プロジェクト構造](#プロジェクト構造)
- [セットアップ手順](#セットアップ手順)
- [開発ガイド](#開発ガイド)
- [デプロイ](#デプロイ)

## アプリ概要

### コンセプト
会員登録なしで、何でも数えて記録できるシンプルなカウンターアプリ。

### 主要機能
- ✅ **会員登録なしで利用可能**: デバイスIDベースの匿名利用
- ✅ **カウント操作**: 増減・リセット機能
- ✅ **記録機能**: 何を、いつ、どこで数えたかを記録
- ✅ **履歴閲覧**: 記録の一覧表示と詳細確認
- ✅ **複数カウンター管理**: 複数のカウンターを作成・管理可能

### 記録する情報
- **何を数えたか**: カウンター名
- **いつ数えたか**: カウント操作の日時
- **どこで数えたか**: GPS位置情報（オプション、許可時のみ）

### データ保存
- **Phase 1（MVP）**: ローカルストレージ（AsyncStorage）のみ
- **将来の拡張**: クラウド同期機能を検討中

詳細な要件は [要件定義書](./docs/requirements.md) を参照してください。

## 技術スタック

### フロントエンド
- **フレームワーク**: Expo（React Native）
- **言語**: TypeScript
- **ルーティング**: Expo Router
- **状態管理**: React Context API

### バックエンド（AWS）
- **API**: API Gateway (REST API) - 将来の拡張用
- **サーバーレス**: AWS Lambda (Node.js) - 将来の拡張用
- **データベース**: Amazon DynamoDB - 将来の拡張用
- **認証**: Amazon Cognito - 将来の拡張用（Phase 1では未使用）
- **ストレージ**: Amazon S3 - 将来の拡張用
- **インフラ**: Terraform (IaC)

**注意**: Phase 1（MVP）ではローカルストレージのみを使用し、AWSリソースは使用しません。詳細は [実装計画書](./docs/implementation-plan.md) を参照してください。

## プロジェクト構造

```
nandemo-counter/
├── app/                    # Expoアプリ（フロントエンド）
│   ├── app/                # Expo Router ルーティング
│   ├── components/         # 共通コンポーネント
│   ├── services/           # API呼び出し
│   ├── contexts/           # Context API
│   ├── hooks/              # カスタムフック
│   ├── types/              # TypeScript型定義
│   ├── constants/          # 定数
│   ├── config/             # 設定ファイル
│   ├── utils/              # ユーティリティ
│   ├── package.json        # 依存パッケージ
│   └── env.example         # 環境変数テンプレート
├── terraform/              # AWSインフラ（Terraform）
│   ├── lambda_functions/   # Lambda関数実装
│   ├── docs/               # Terraformドキュメント
│   ├── *.tf               # Terraform設定ファイル
│   └── terraform.tfvars.example  # 変数テンプレート
├── .github/
│   └── workflows/          # CI/CD設定
│       └── terraform-deploy.yml
└── docs/                   # プロジェクトドキュメント
```

## セットアップ手順

### 前提条件

- **Node.js 18.x（推奨）** - Expo SDK 51との互換性のため
- npm または yarn
- AWS CLI（バックエンド開発用）
- Terraform 1.6.0以上（バックエンド開発用）

**重要**: Node.js 18.xを使用してください。Node.js v22では広告プラグインなどの互換性問題が発生する可能性があります。詳細は [Node.jsセットアップガイド](./docs/nodejs-setup-guide.md) を参照してください。

### 1. リポジトリのクローン

```bash
git clone https://github.com/YOUR_USERNAME/nandemo-counter.git
cd nandemo-counter
```

### 2. 依存パッケージのインストール

```bash
# ルートとアプリの両方の依存パッケージをインストール
npm run install:all
```

### 3. AWS設定

**重要**: このプロジェクトでは、**HIMAJINSアプリと同じAWSアカウントを使用**します。新しいAWSアカウントを作成する必要はありません。

詳細は [reservation-app/docs](./docs/) を参照してください。

1. IAMユーザーの作成（予約管理アプリ用に新規作成）
2. AWS CLIの設定

### 4. Terraform設定

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvarsを編集して設定をカスタマイズ
```

### 5. インフラの構築

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 6. 環境変数の設定

```bash
cd ../app
cp env.example .env
# .envファイルを編集してTerraformの出力値を設定
```

Terraformの出力値を自動設定する場合：

```bash
cat >> .env << EOF
EXPO_PUBLIC_API_URL=$(cd ../terraform && terraform output -raw api_gateway_deployment_url)
EXPO_PUBLIC_COGNITO_USER_POOL_ID=$(cd ../terraform && terraform output -raw cognito_user_pool_id)
EXPO_PUBLIC_COGNITO_CLIENT_ID=$(cd ../terraform && terraform output -raw cognito_client_id)
EXPO_PUBLIC_COGNITO_DOMAIN=$(cd ../terraform && terraform output -raw cognito_domain)
EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID=$(cd ../terraform && terraform output -raw cognito_identity_pool_id)
EXPO_PUBLIC_S3_BUCKET=$(cd ../terraform && terraform output -raw s3_bucket_name)
EOF
```

### 7. 開発サーバーの起動

```bash
cd app
npm start
```

起動オプション:
- `npm start` - 開発サーバー起動（デフォルト）
- `npm run android` - Androidエミュレータで起動
- `npm run ios` - iOSシミュレータで起動（macOSのみ）
- `npm run web` - Webブラウザで起動

## 開発ガイド

### フロントエンド開発

```bash
cd app
npm start
```

### バックエンド開発

Lambda関数の実装は `terraform/lambda_functions/` に配置します。

### コードフォーマット

```bash
# Terraform
cd terraform
terraform fmt

# TypeScript/React Native
cd app
npm run lint  # 設定後
```

## デプロイ

### CI/CD

GitHub Actionsを使用した自動デプロイが設定されています。

1. OIDCプロバイダーとIAMロールを作成（Terraformで）
2. GitHub SecretsにIAMロールARNを設定
3. ブランチにプッシュすると自動デプロイ

### 手動デプロイ

```bash
# Staging環境
cd terraform
AWS_PROFILE=staging terraform apply -var="environment=staging"

# Production環境
AWS_PROFILE=prod terraform apply -var="environment=prod"
```

## コスト最適化

AWS無料枠を活用するための設定が含まれています。

## トラブルシューティング

### AWS認証エラー

```bash
aws sts get-caller-identity
aws configure
```

### Terraformエラー

```bash
cd terraform
terraform state list
terraform state show <resource_name>
```

### 環境変数が読み込まれない

- `.env`ファイルが`app/`ディレクトリに存在するか確認
- 環境変数名が`EXPO_PUBLIC_`で始まっているか確認
- 開発サーバーを再起動

## ドキュメント

### 開発ドキュメント
- [要件定義書](./docs/requirements.md) - アプリの詳細な要件定義
- [実装計画書](./docs/implementation-plan.md) - Phase別の実装計画
- [要件定義書（整理版）](./docs/requirements-refined.md) - 整理された要件定義
- [実装計画書（整理版）](./docs/implementation-plan-refined.md) - 整理された実装計画

### デプロイメントドキュメント
- [デプロイメントガイド](./docs/deployment-guide.md) - 認証・広告・配布の包括的ガイド
- [AdMob設定ガイド](./docs/admob-setup.md) - AdMobの詳細な設定手順
- [Google Play配布ガイド](./docs/google-play-deployment.md) - Google Playへの配布手順
- [ビルド設定ガイド](./docs/build-configuration.md) - ビルド設定の詳細
- [プライバシーポリシーテンプレート](./docs/privacy-policy-template.md) - プライバシーポリシーのテンプレート
- [リリース前チェックリスト](./docs/release-checklist.md) - リリース前の確認項目
- [Node.jsセットアップガイド](./docs/nodejs-setup-guide.md) - Node.js 18.xへのダウングレード手順
- [AdMobプラグインエラー分析](./docs/admob-plugin-error-analysis.md) - エラーの根本原因と解決策
- [AdMobプラグインの現在の状態](./docs/admob-plugin-status.md) - プラグインの互換性問題と対応状況
- [Expo SDK 52へのアップグレード](./docs/expo-sdk52-upgrade.md) - SDK 52へのアップグレード完了報告

## 参考資料

- [reservation-app/docs](../reservation-app/docs/) - 詳細なセットアップガイド
- [Expo 公式](https://expo.dev/)
- [React Native 公式](https://reactnative.dev/)
- [Terraform 公式](https://www.terraform.io/)
- [AWS 公式](https://aws.amazon.com/)

## ライセンス

MIT
