# AdMobプラグインのトラブルシューティング

## 問題

Expo SDK 51で`react-native-google-mobile-ads`のプラグイン設定時に以下のエラーが発生：

```
PluginError: Package "react-native-google-mobile-ads" does not contain a valid config plugin.
SyntaxError: Unexpected token 'typeof'
```

## 原因

詳細な原因分析は [AdMobプラグインエラー原因分析](./admob-plugin-error-analysis.md) を参照してください。

### 主な原因

**Node.js v22とExpo SDK 51の互換性問題**:
- 現在のNode.jsバージョン: **v22.19.0**
- Expo SDK 51の推奨バージョン: **Node.js 18.x**
- Node.js v22はESMをより厳格に扱うため、プラグインの読み込み時にエラーが発生

## 一時的な解決策（テスト用）

テストを優先する場合、広告プラグインを一時的に無効化：

### 1. app.config.jsをバックアップ

```bash
cd app
mv app.config.js app.config.js.backup
```

### 2. app.jsonから広告プラグインを削除

```json
{
  "expo": {
    "plugins": [
      "expo-router"
    ]
  }
}
```

### 3. 広告コンポーネントのエラーハンドリング

広告コンポーネントは既にエラーハンドリングが実装されているため、プラグインが無効でもアプリは動作します（広告は表示されません）。

## 恒久的な解決策

### 方法1: プラグインの再インストール

```bash
cd app
npm uninstall react-native-google-mobile-ads
npx expo install react-native-google-mobile-ads
```

### 方法2: Expo SDKの互換性確認

Expo SDK 51と`react-native-google-mobile-ads`の互換性を確認：

```bash
cd app
npx expo install --check
```

### 方法3: プラグイン設定の見直し

`app.json`での設定を確認：

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy",
          "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
        }
      ]
    ]
  }
}
```

### 方法4: カスタムプラグインの作成（上級者向け）

必要に応じて、カスタムプラグインを作成してAdMobを設定することも可能です。

## テスト時の注意

広告プラグインを無効化している場合：

- ✅ アプリの基本機能は動作します
- ✅ UI/UXのテストが可能です
- ❌ 広告は表示されません
- ❌ 広告関連の機能はテストできません

## 本番ビルド前の対応

本番ビルド前に、広告プラグインの問題を解決する必要があります：

1. プラグインの再インストール
2. 設定の確認
3. テストビルドでの動作確認

## 参考資料

- [react-native-google-mobile-ads GitHub Issues](https://github.com/invertase/react-native-google-mobile-ads/issues)
- [Expo Config Plugins](https://docs.expo.dev/guides/config-plugins/)
