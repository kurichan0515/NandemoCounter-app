# AdMobプラグインの現在の状態

## 実施した対応

### ✅ Node.js 18.xへのダウングレード（完了）

- Node.js v22.19.0 → v18.20.8にダウングレード
- `.nvmrc`ファイルを作成（Node.js 18を指定）
- `package.json`に`engines`フィールドを追加
- 依存関係を再インストール

### ⚠️ プラグインの互換性問題（未解決）

Node.js 18.xにダウングレード後も、`react-native-google-mobile-ads`プラグインで以下のエラーが発生：

```
PluginError: Package "react-native-google-mobile-ads" does not contain a valid config plugin.
Cannot use import statement outside a module
```

## エラーの原因

プラグインがReact Nativeのモジュールを読み込む際に、ESM/CommonJSの互換性問題が発生しています。これは、プラグイン自体がExpo SDK 51との完全な互換性を持っていないことが原因です。

## 現在の対応状況

### プラグイン設定

`app.json`に以下の設定を追加済み：

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
    ],
    "extra": {
      "react-native-google-mobile-ads": {
        "android_app_id": "ca-app-pub-6862900859746528~5817361788",
        "ios_app_id": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
      }
    }
  }
}
```

### 動的インポートによる回避策

広告コンポーネント（`BannerAd.tsx`、`InterstitialAd.tsx`）とサービス（`services/ads.ts`）で、動的インポートとエラーハンドリングを実装済み。これにより、プラグインが無効な場合でもアプリはクラッシュしません。

## 推奨される対応

### 短期対応（テスト用）

1. **プラグインを一時的に無効化**
   - `app.json`から`react-native-google-mobile-ads`プラグインを削除
   - アプリの基本機能をテスト
   - UI/UXの確認

2. **動的インポートの活用**
   - 既に実装済みの動的インポートにより、プラグインが無効でもアプリは動作します
   - 広告は表示されませんが、他の機能は正常に動作します

### 中期対応（本番ビルド前）

1. **プラグインのバージョン確認**
   - `react-native-google-mobile-ads`の最新バージョンを確認
   - Expo SDK 51との互換性が修正されたバージョンがあるか確認

2. **代替手段の検討**
   - Expo SDK 52+へのアップグレード（推奨）
   - 他の広告プラットフォーム（AppLovin MAXなど）の検討

### 長期対応（恒久的な解決）

1. **Expo SDK 52+へのアップグレード**
   - 検索結果によると、Expo SDK 52+では互換性が改善されています
   - React Native 0.76+が必要

2. **プラグインの更新を待つ**
   - `react-native-google-mobile-ads`の開発者がExpo SDK 51の互換性を修正するのを待つ

## 参考資料

- [react-native-google-mobile-ads Issue #588](https://github.com/invertase/react-native-google-mobile-ads/issues/588) - Expo SDK 51の設定について
- [react-native-google-mobile-ads Issue #678](https://github.com/invertase/react-native-google-mobile-ads/issues/678) - EASビルドエラーとExpo SDK 52+への推奨
- [AdMobプラグインエラー分析](./admob-plugin-error-analysis.md) - 詳細なエラー分析

## 次のステップ

1. プラグインを一時的に無効化してアプリをテスト
2. Expo SDK 52+へのアップグレードを検討
3. または、プラグインの更新を待つ
