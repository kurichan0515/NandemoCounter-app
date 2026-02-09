# ビルドガイド

## 目次

1. [概要](#概要)
2. [環境の種類](#環境の種類)
3. [ビルドコマンド](#ビルドコマンド)
4. [環境変数の設定](#環境変数の設定)
5. [ビルド手順](#ビルド手順)

---

## 概要

このプロジェクトでは、以下の環境でビルドが可能です：

- **development**: 開発環境（開発クライアント）
- **preview**: プレビュー環境（内部テスト用APK）
- **staging**: ステージング環境（本番前の最終テスト）
- **production**: 本番環境（ストア配布用）

---

## 環境の種類

### development（開発環境）

- **用途**: ローカル開発
- **ビルドタイプ**: APK（Android）、シミュレータ（iOS）
- **特徴**: 
  - 開発クライアントを使用
  - ホットリロード対応
  - テスト広告を使用

### preview（プレビュー環境）

- **用途**: 内部テスト
- **ビルドタイプ**: APK（Android）
- **特徴**:
  - 実機でテスト可能
  - 内部配布用
  - テスト広告を使用

### staging（ステージング環境）

- **用途**: 本番前の最終テスト
- **ビルドタイプ**: App Bundle（Android）
- **特徴**:
  - 本番環境に近い設定
  - 実際の広告ユニットIDを使用
  - 内部テストトラックに配布

### production（本番環境）

- **用途**: ストア配布
- **ビルドタイプ**: App Bundle（Android）
- **特徴**:
  - 本番用の広告ユニットID
  - Google Play/App Storeに配布

---

## ビルドコマンド

### 開発環境

```bash
cd app
npm run android
# または
npm run ios
```

### EAS Buildを使用したビルド

#### プレビュービルド（APK）

```bash
cd app
eas build --platform android --profile preview
```

#### ステージングビルド

```bash
cd app
eas build --platform android --profile staging
```

#### 本番ビルド

```bash
cd app
eas build --platform android --profile production
```

#### iOSビルド

```bash
cd app
eas build --platform ios --profile staging
# または
eas build --platform ios --profile production
```

#### 両プラットフォーム

```bash
cd app
eas build --platform all --profile staging
# または
eas build --platform all --profile production
```

---

## 環境変数の設定

### EAS Secretsを使用（推奨）

機密情報はEAS Secretsを使用して管理します：

```bash
# ステージング環境用のシークレット設定
eas secret:create --scope project --name ADMOB_ANDROID_APP_ID_STAGING --value "ca-app-pub-6862900859746528~5817361788" --type string
eas secret:create --scope project --name ADMOB_BANNER_ANDROID_STAGING --value "ca-app-pub-6862900859746528/3358719407" --type string
eas secret:create --scope project --name ADMOB_INTERSTITIAL_ANDROID_STAGING --value "ca-app-pub-6862900859746528/5553637906" --type string

# 本番環境用のシークレット設定
eas secret:create --scope project --name ADMOB_ANDROID_APP_ID_PRODUCTION --value "ca-app-pub-6862900859746528~5817361788" --type string
eas secret:create --scope project --name ADMOB_BANNER_ANDROID_PRODUCTION --value "ca-app-pub-6862900859746528/3358719407" --type string
eas secret:create --scope project --name ADMOB_INTERSTITIAL_ANDROID_PRODUCTION --value "ca-app-pub-6862900859746528/5553637906" --type string
```

### eas.jsonでの環境変数参照

`eas.json`で環境変数を参照する場合：

```json
{
  "build": {
    "staging": {
      "env": {
        "EXPO_PUBLIC_ADMOB_ANDROID_APP_ID": "$ADMOB_ANDROID_APP_ID_STAGING",
        "EXPO_PUBLIC_ADMOB_BANNER_ANDROID": "$ADMOB_BANNER_ANDROID_STAGING",
        "EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID": "$ADMOB_INTERSTITIAL_ANDROID_STAGING"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_ADMOB_ANDROID_APP_ID": "$ADMOB_ANDROID_APP_ID_PRODUCTION",
        "EXPO_PUBLIC_ADMOB_BANNER_ANDROID": "$ADMOB_BANNER_ANDROID_PRODUCTION",
        "EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID": "$ADMOB_INTERSTITIAL_ANDROID_PRODUCTION"
      }
    }
  }
}
```

---

## ビルド手順

### ステージングビルドの手順

1. **環境変数の確認**
   ```bash
   # EAS Secretsを確認
   eas secret:list
   ```

2. **ビルドの実行**
   ```bash
   cd app
   eas build --platform android --profile staging
   ```

3. **ビルドの確認**
   - EAS Buildダッシュボードでビルド状況を確認
   - ビルドが完了したら、ダウンロードリンクを取得

4. **テスト**
   - 内部テストトラックにアップロード
   - テストユーザーに配布して動作確認

### 本番ビルドの手順

1. **バージョン番号の更新**
   ```json
   // app.json
   {
     "expo": {
       "version": "1.0.1",  // ユーザーに表示されるバージョン
       "android": {
         "versionCode": 2  // 各リリースで1ずつ増やす
       }
     }
   }
   ```

2. **環境変数の確認**
   ```bash
   eas secret:list
   ```

3. **ビルドの実行**
   ```bash
   cd app
   eas build --platform android --profile production
   ```

4. **ビルドの確認**
   - EAS Buildダッシュボードでビルド状況を確認
   - ビルドが完了したら、ダウンロードリンクを取得

5. **Google Play Consoleへのアップロード**
   - 本番環境トラックにアップロード
   - レビューを送信

---

## ビルド前チェックリスト

### ステージングビルド

- [ ] バージョン番号が正しい
- [ ] 環境変数が設定されている
- [ ] 広告ユニットIDが正しい
- [ ] テストが完了している

### 本番ビルド

- [ ] バージョン番号が更新されている
- [ ] versionCodeが増えている
- [ ] 環境変数が設定されている
- [ ] 本番用の広告ユニットIDが設定されている
- [ ] ステージング環境でのテストが完了している
- [ ] リリースノートが準備されている

---

## トラブルシューティング

### ビルドエラー

**問題**: ビルドが失敗する

**解決策**:
1. `eas.json`の設定を確認
2. `app.json`または`app.config.js`の設定を確認
3. 環境変数が正しく設定されているか確認
4. EAS CLIを最新版に更新: `npm install -g eas-cli@latest`

### 環境変数が読み込まれない

**問題**: 環境変数がビルド時に反映されない

**解決策**:
1. EAS Secretsが正しく設定されているか確認: `eas secret:list`
2. `eas.json`で環境変数が参照されているか確認
3. ビルドログで環境変数が設定されているか確認

### 広告が表示されない

**問題**: ビルド後のアプリで広告が表示されない

**解決策**:
1. 広告ユニットIDが正しく設定されているか確認
2. AdMob App IDが正しく設定されているか確認
3. AdMobダッシュボードで広告ユニットが有効になっているか確認

---

## 参考資料

- [EAS Build ドキュメント](https://docs.expo.dev/build/introduction/)
- [EAS Secrets ドキュメント](https://docs.expo.dev/build/environment-variables/)
- [app.config.js リファレンス](https://docs.expo.dev/config/app/)
