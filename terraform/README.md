# Terraform設定

このディレクトリには、AWSインフラストラクチャを定義するTerraform設定ファイルが含まれています。

## ファイル構成

- `main.tf` - プロバイダー設定とローカル変数
- `variables.tf` - 変数定義
- `outputs.tf` - 出力値定義
- `cognito.tf` - Cognito設定（認証）
- `dynamodb.tf` - DynamoDBテーブル定義
- `s3.tf` - S3バケット設定
- `api_gateway.tf` - API Gateway設定
- `lambda.tf` - Lambda関数とIAMロール設定
- `terraform.tfvars.example` - 変数テンプレート

## セットアップ

1. `terraform.tfvars.example`をコピーして`terraform.tfvars`を作成
2. `terraform.tfvars`を編集して設定をカスタマイズ
3. `terraform init`で初期化
4. `terraform plan`で実行計画を確認
5. `terraform apply`でインフラを構築

## Lambda関数の追加

1. `lambda_functions/`ディレクトリに新しい関数を追加
2. `lambda.tf`に新しいLambda関数リソースを追加
3. `api_gateway.tf`にAPI Gatewayの統合を追加

## 注意事項

- `terraform.tfvars`は`.gitignore`に含まれているため、Gitにコミットされません
- 本番環境では、IAMロールに最小権限の原則を適用してください
- DynamoDBのキャパシティは無料枠内（合計25ユニット）に設定されています
