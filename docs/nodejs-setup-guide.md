# Node.jsセットアップガイド

## 概要

Expo SDK 51は**Node.js 18.xを推奨**しています。Node.js v22を使用している場合、広告プラグインなどの互換性問題が発生する可能性があります。

## 現在の環境確認

```bash
node --version
# 出力例: v22.19.0（問題の原因）
```

## Node.js 18.xへのダウングレード手順

### 1. nvmのインストール（未インストールの場合）

```bash
# nvmのインストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# シェルを再起動または
source ~/.bashrc
```

### 2. Node.js 18.xのインストール

```bash
# Node.js 18の最新LTS版をインストール
nvm install 18

# 18.xを使用
nvm use 18

# 確認
node --version  # v18.x.x であることを確認
```

### 3. デフォルトバージョンの設定（オプション）

```bash
# Node.js 18をデフォルトに設定
nvm alias default 18
```

### 4. プロジェクトの依存関係を再インストール

```bash
cd /home/kurichan0515/hobby/NandemoCounter-app/app

# 既存のnode_modulesとpackage-lock.jsonを削除
rm -rf node_modules package-lock.json

# 依存関係を再インストール
npm install
```

### 5. 広告プラグインを再度有効化

`app.json`に広告プラグインの設定を追加：

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-6862900859746528~5817361788",
          "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
        }
      ]
    ]
  }
}
```

### 6. 動作確認

```bash
# Expo設定の確認
npx expo config --type public

# エラーが発生しないことを確認
npm start
```

## トラブルシューティング

### nvmがインストールされていない

**解決策**: 上記の手順1を実行

### Node.js 18がインストールできない

**解決策**: 
```bash
# 利用可能なバージョンを確認
nvm list-remote | grep "v18"

# 特定のバージョンをインストール
nvm install 18.20.0
```

### プロジェクトでNode.jsバージョンが切り替わらない

**解決策**:
```bash
# 現在のバージョンを確認
node --version

# 正しいバージョンに切り替え
nvm use 18

# プロジェクトディレクトリで再度確認
cd app
node --version
```

## バージョン管理のベストプラクティス

### .nvmrcファイルの作成（推奨）

プロジェクトルートに`.nvmrc`ファイルを作成：

```bash
cd /home/kurichan0515/hobby/NandemoCounter-app
echo "18" > .nvmrc
```

これにより、`nvm use`を実行するだけで自動的にNode.js 18に切り替わります。

### package.jsonでのエンジン指定

`app/package.json`に以下を追加（オプション）：

```json
{
  "engines": {
    "node": ">=18.0.0 <19.0.0",
    "npm": ">=9.0.0"
  }
}
```

## 参考資料

- [nvm GitHub](https://github.com/nvm-sh/nvm)
- [Expo SDK 51 リリースノート](https://blog.expo.dev/expo-sdk-51-is-now-available)
- [Node.js 18.x ドキュメント](https://nodejs.org/docs/latest-v18.x/api/)
