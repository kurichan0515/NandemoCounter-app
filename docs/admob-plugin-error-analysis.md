# AdMobプラグインエラーの原因分析

## エラーメッセージ

```
PluginError: Package "react-native-google-mobile-ads" does not contain a valid config plugin.
SyntaxError: Unexpected token 'typeof'
```

## 原因の調査結果

### 1. 環境情報

- **Node.js**: v22.19.0（⚠️ 問題の原因）
- **Expo SDK**: 51.0.39
- **react-native-google-mobile-ads**: 16.0.3

### 2. 問題の根本原因

#### 主な原因: Node.js v22とExpo SDK 51の互換性問題

**Node.js v22の問題**:
- Node.js v22はESM（ES Modules）をより厳格に扱うようになりました
- Expo SDK 51は**Node.js 18.xを推奨**しています
- Node.js v22では、CommonJSとESMの混在で問題が発生する場合があります

**プラグインの読み込みエラー**:
- `app.plugin.js`は`./plugin/build`をrequireしています
- このビルドファイルがESM形式で書かれている可能性があります
- Expoの設定読み込み処理がCommonJS形式で読み込もうとしているため、`typeof`などのESM構文がエラーになっています

#### Expo SDK 51の変更

Expo SDK 51では、プラグインの検証方法が変更され、より厳格な検証が行われるようになりました。これにより、以前は動作していたプラグインがエラーになる場合があります。

#### react-native-google-mobile-adsのプラグイン実装

`react-native-google-mobile-ads`のプラグイン実装が、Node.js v22とExpo SDK 51の組み合わせで完全に互換性がない可能性があります。

### 3. エラーの詳細

```
SyntaxError: Unexpected token 'typeof'
    at compileSourceTextModule (node:internal/modules/esm/utils:346:16)
```

このエラーは、ESM形式のコードをCommonJS形式で読み込もうとした際に発生します。`typeof`はESMでは使用可能ですが、CommonJSのコンテキストでは予期しないトークンとして扱われます。

## 解決策

### 解決策1: Node.jsのバージョンダウン（最も推奨）

**Expo SDK 51はNode.js 18.xを推奨しています**。Node.js v22が原因の可能性が高いです。

```bash
# Node.js 18.xにダウングレード
nvm install 18
nvm use 18

# プロジェクトディレクトリに移動
cd app

# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# 広告プラグインを再度有効化してテスト
# app.jsonにプラグイン設定を追加
```

**確認方法**:
```bash
node --version  # v18.x.x であることを確認
```

### 解決策2: プラグインを一時的に無効化（現在の対応）

テストを優先する場合：

```json
{
  "expo": {
    "plugins": [
      "expo-router"
    ]
  }
}
```

### 解決策3: プラグインの手動設定（上級者向け）

`app.config.js`でプラグインを手動で設定：

```javascript
module.exports = () => {
  return {
    expo: {
      plugins: [
        'expo-router',
        // 広告プラグインは手動で設定
      ],
    },
  };
};
```

### 解決策4: パッケージの更新を待つ

`react-native-google-mobile-ads`の開発者がExpo SDK 51の互換性を修正するのを待つ。

## 推奨される対応

### 短期（テスト用）

1. 広告プラグインを一時的に無効化（現在の対応）
2. アプリの基本機能をテスト
3. UI/UXの確認

### 中期（本番ビルド前）

1. Node.jsを18.xにダウングレード
2. プラグインを再度有効化
3. テストビルドで動作確認

### 長期（恒久的な解決）

1. `react-native-google-mobile-ads`の更新を確認
2. Expo SDK 51との互換性が修正されたバージョンを使用
3. または、代替の広告プラットフォームを検討

## 参考資料

- [Expo SDK 51 リリースノート](https://blog.expo.dev/expo-sdk-51-is-now-available)
- [react-native-google-mobile-ads Issue #588](https://github.com/invertase/react-native-google-mobile-ads/issues/588)
- [react-native-google-mobile-ads Issue #820](https://github.com/invertase/react-native-google-mobile-ads/issues/820)
- [Node.js ESM ドキュメント](https://nodejs.org/api/esm.html)
