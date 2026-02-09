# デプロイメントガイド

## 目次

1. [認証設定](#認証設定)
2. [広告設定（AdMob）](#広告設定admob)
3. [Google Play配布準備](#google-play配布準備)
4. [ビルド設定](#ビルド設定)
5. [プライバシーポリシー](#プライバシーポリシー)
6. [リリース前チェックリスト](#リリース前チェックリスト)

---

## 認証設定

詳細は [認証設定ガイド](./authentication-guide.md) を参照してください。

### 現状の実装

現在のアプリは**会員登録なしで利用可能**な設計になっています。

- **デバイスIDベース**: デバイス固有のUUIDを自動生成してローカルに保存
- **ローカルストレージ**: AsyncStorageを使用したデータ保存
- **認証不要**: Cognito認証は実装されているが使用していない

### 将来の拡張（クラウド同期時）

クラウド同期機能を追加する場合の認証設定：

#### 1. Cognito設定の確認

**ファイル**: `terraform/cognito.tf`

```hcl
# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "${local.name_prefix}-${var.cognito_user_pool_name}"
  # ... 設定内容
}
```

#### 2. 匿名認証の実装

デバイスIDベースの匿名認証を実装する場合：

```typescript
// 匿名認証の実装例（将来の拡張用）
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

// デバイスIDを使用した匿名認証
const credentials = fromCognitoIdentityPool({
  client: new CognitoIdentityClient({ region: 'ap-northeast-1' }),
  identityPoolId: process.env.EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  logins: {
    [`cognito-idp.ap-northeast-1.amazonaws.com/${process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID}`]: deviceId,
  },
});
```

#### 3. 環境変数の設定

**ファイル**: `app/.env`

```env
# Cognito設定（クラウド同期時に使用）
EXPO_PUBLIC_COGNITO_USER_POOL_ID=ap-northeast-1_xxxxxxxxx
EXPO_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_COGNITO_DOMAIN=nandemo-counter-dev.auth.ap-northeast-1.amazoncognito.com
EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID=ap-northeast-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 広告設定（AdMob）

**注意**: 広告ネットワークの比較については [広告ネットワーク比較](./ad-network-comparison.md) を参照してください。

### 1. AdMobアカウントの作成

1. [Google AdMob](https://admob.google.com/)にアクセス
2. Googleアカウントでログイン
3. アカウントを作成（必要に応じて支払い情報を登録）

### 2. アプリの登録

#### iOS用アプリの登録

1. AdMobダッシュボードで「アプリ」→「アプリを追加」
2. プラットフォーム: iOS
3. アプリ名: 「なんでもカウンター」
4. パッケージ名: `com.nandemocounter`（app.jsonのbundleIdentifierと一致）
5. アプリストア: App Store（リリース後）

#### Android用アプリの登録

1. AdMobダッシュボードで「アプリ」→「アプリを追加」
2. プラットフォーム: Android
3. アプリ名: 「なんでもカウンター」
4. パッケージ名: `com.nandemocounter`（app.jsonのpackageと一致）
5. アプリストア: Google Play（リリース後）

### 3. 広告ユニットIDの取得

#### バナー広告ユニットID

1. AdMobダッシュボードで「広告ユニット」→「広告ユニットを作成」
2. 広告形式: バナー
3. 広告ユニット名: 「メイン画面バナー」
4. 広告ユニットIDをコピー（例: `ca-app-pub-1234567890123456/1234567890`）

#### インタースティシャル広告ユニットID

1. AdMobダッシュボードで「広告ユニット」→「広告ユニットを作成」
2. 広告形式: インタースティシャル
3. 広告ユニット名: 「記録完了時インタースティシャル」
4. 広告ユニットIDをコピー

### 4. アプリへの設定

#### バナー広告の設定

**ファイル**: `app/components/BannerAd.tsx`

```typescript
// テスト用広告ユニットIDを実際のIDに置き換え
const BANNER_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // iOS用の実際の広告ユニットID
  android: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // Android用の実際の広告ユニットID
}) || TestIds.BANNER;
```

#### インタースティシャル広告の設定

**ファイル**: `app/components/InterstitialAd.tsx`

```typescript
// テスト用広告ユニットIDを実際のIDに置き換え
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // iOS用の実際の広告ユニットID
  android: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // Android用の実際の広告ユニットID
}) || TestIds.INTERSTITIAL;
```

### 5. app.jsonへの設定

**ファイル**: `app/app.json`

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

**注意**: `androidAppId`と`iosAppId`はAdMobアプリID（広告ユニットIDではない）を使用します。

### 6. 広告のテスト

開発中はテスト用の広告ユニットIDを使用：

- iOS: `ca-app-pub-3940256099942544/2934735716`
- Android: `ca-app-pub-3940256099942544/6300978111`

本番環境では実際の広告ユニットIDに置き換えます。

---

## Google Play配布準備

### 1. Google Play Consoleアカウントの作成

1. [Google Play Console](https://play.google.com/console/)にアクセス
2. Googleアカウントでログイン
3. 開発者登録（$25の初回登録料が必要）
4. 開発者アカウント情報を入力

### 2. アプリの作成

1. Google Play Consoleで「アプリを作成」
2. アプリ名: 「なんでもカウンター」
3. デフォルト言語: 日本語
4. アプリまたはゲーム: アプリ
5. 無料または有料: 無料
6. プライバシーポリシー: 必須（後述）

### 3. アプリ署名の設定

#### アプリ署名キーの生成

```bash
cd app
npx expo build:android --type app-bundle
```

または、EAS Buildを使用：

```bash
# EAS CLIのインストール
npm install -g eas-cli

# EASにログイン
eas login

# ビルド設定の初期化
eas build:configure

# Android用のビルド
eas build --platform android --profile production
```

#### キーストアの管理

- EAS Buildを使用する場合、キーストアは自動管理されます
- 手動で管理する場合、キーストアファイルを安全に保管してください

### 4. アプリ情報の準備

#### アプリの説明

**日本語版**:
```
なんでもカウンターは、何でも数えて記録できるシンプルなカウンターアプリです。

【主な機能】
・会員登録なしで即座に利用開始
・タグ機能による柔軟な分類
・ボタン操作と直接入力の2種類の入力方法
・位置情報の記録（オプション）
・タグ別の統計とグラフ表示
・カレンダーでの記録可視化

【使い方】
1. カウンターを作成
2. カウント操作（+/-ボタンまたは直接入力）
3. タグを付けて分類
4. 分析画面で統計を確認

会員登録不要で、すぐに使い始められます。
```

#### スクリーンショット

以下のサイズのスクリーンショットを準備：

- **必須**: 2枚以上
- **推奨**: 8枚まで
- **サイズ**: 
  - 電話: 16:9または9:16（最小320px、最大3840px）
  - 7インチタブレット: 16:9または9:16
  - 10インチタブレット: 16:9または9:16

**推奨スクリーンショット**:
1. メイン画面（カウンター一覧）
2. カウント登録画面
3. カウンター詳細画面
4. タグ分析画面（カレンダー）
5. タグ分析画面（グラフ）
6. 履歴画面

#### アプリアイコン

**ファイル**: `app/assets/icon.png`

- **サイズ**: 1024x1024px
- **形式**: PNG（透明背景可）
- **内容**: アプリを表すアイコン

#### 機能グラフィック（オプション）

- **サイズ**: 1024x500px
- **形式**: PNGまたはJPG
- **内容**: アプリの主要機能を紹介

### 5. コンテンツレーティング

Google Play Consoleでコンテンツレーティングを設定：

1. 「コンテンツレーティング」セクションに移動
2. 質問に回答（位置情報の使用、広告の表示など）
3. レーティングを取得

### 6. プライバシーポリシー

プライバシーポリシーページを公開し、URLを設定（後述の「プライバシーポリシー」セクション参照）

### 7. データの安全性

Google Play Consoleで「データの安全性」セクションを記入：

- **データの収集**: 
  - 位置情報（オプション、ユーザーが許可した場合のみ）
  - デバイスID（匿名、ローカルのみ）
- **データの共有**: なし（ローカルストレージのみ）
- **データのセキュリティ**: ローカルストレージに暗号化なしで保存

### 8. ターゲットオーディエンスとコンテンツ

- **ターゲットオーディエンス**: すべての年齢
- **コンテンツレーティング**: 取得したレーティングを設定

### 9. 価格と配布

- **価格**: 無料
- **国・地域**: 配布する国を選択

### 10. リリースの作成

#### 内部テスト

1. 「リリース」→「内部テスト」→「リリースを作成」
2. アプリバンドル（.aab）をアップロード
3. テストユーザーを追加

#### クローズドテスト

1. 「リリース」→「クローズドテスト」→「リリースを作成」
2. テストユーザーを招待

#### オープンテスト

1. 「リリース」→「オープンテスト」→「リリースを作成」
2. 一般ユーザーが参加可能

#### 本番リリース

1. 「リリース」→「本番環境」→「リリースを作成」
2. アプリバンドルをアップロード
3. リリースノートを記入
4. レビューを送信

---

## ビルド設定

### 1. app.jsonの設定

**ファイル**: `app/app.json`

```json
{
  "expo": {
    "name": "なんでもカウンター",
    "slug": "nandemo-counter",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.nandemocounter",
      "buildNumber": "1",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "このアプリは記録時の位置情報を保存するために位置情報へのアクセスが必要です。"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.nandemocounter",
      "versionCode": 1,
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy",
          "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
        }
      ]
    ],
    "scheme": "nandemo-counter",
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 2. EAS Buildの設定

**ファイル**: `app/eas.json`

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "bundleIdentifier": "com.nandemocounter"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

### 3. ビルドコマンド

#### 開発ビルド

```bash
cd app
eas build --platform android --profile development
```

#### プレビュービルド（APK）

```bash
eas build --platform android --profile preview
```

#### 本番ビルド（App Bundle）

```bash
eas build --platform android --profile production
```

### 4. ビルド後の確認事項

- [ ] アプリが正常に起動する
- [ ] 広告が表示される（テスト広告でOK）
- [ ] 位置情報の許可リクエストが表示される
- [ ] データが正しく保存される
- [ ] すべての画面が正常に動作する

---

## プライバシーポリシー

### プライバシーポリシーの作成

以下の内容を含むプライバシーポリシーを作成し、Webサイトに公開する必要があります。

**推奨**: GitHub Pages、Netlify、Vercelなどで無料ホスティング

### プライバシーポリシーのテンプレート

```markdown
# なんでもカウンター プライバシーポリシー

最終更新日: 2026年2月9日

## はじめに

「なんでもカウンター」（以下「本アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。

## 収集する情報

### 自動的に収集される情報

- **デバイスID**: アプリが自動生成するデバイス固有の識別子（UUID形式）
  - 用途: データの管理と識別
  - 保存場所: デバイス内のローカルストレージのみ
  - 共有: 第三者と共有しません

### ユーザーが提供する情報

- **カウント記録**: カウンター名、カウント値、日時、タグ
- **位置情報**: ユーザーが明示的に許可した場合のみ（オプション）
  - 用途: 記録時の位置情報の保存
  - 保存場所: デバイス内のローカルストレージのみ

## データの保存と管理

- すべてのデータはデバイス内のローカルストレージに保存されます
- データはクラウドサーバーに送信されません
- データはデバイスを変更した場合、引き継がれません

## 広告について

本アプリはGoogle AdMobを使用して広告を表示します。

- **バナー広告**: アプリ内の適切な位置に表示
- **インタースティシャル広告**: 記録完了時に表示（頻度制御あり）

Google AdMobのプライバシーポリシー:
https://policies.google.com/privacy

## データの削除

ユーザーはアプリをアンインストールすることで、すべてのデータを削除できます。

## お問い合わせ

プライバシーに関するご質問は、以下までお問い合わせください。

[連絡先情報を記載]

## 変更通知

本プライバシーポリシーは、予告なく変更される場合があります。
重要な変更がある場合は、アプリ内で通知します。
```

### プライバシーポリシーの公開

1. 上記のテンプレートをカスタマイズ
2. GitHub Pages、Netlify、Vercelなどで公開
3. URLをGoogle Play Consoleに設定

---

## リリース前チェックリスト

### アプリの機能確認

- [ ] カウンターの作成・編集・削除が正常に動作する
- [ ] カウント操作（ボタン操作・直接入力）が正常に動作する
- [ ] 記録の保存・表示が正常に動作する
- [ ] タグの作成・編集・削除が正常に動作する
- [ ] タグ分析機能が正常に動作する
- [ ] カレンダー表示が正常に動作する
- [ ] グラフ表示が正常に動作する
- [ ] 位置情報の取得が正常に動作する（許可時）
- [ ] 広告が表示される（テスト広告でOK）

### 設定の確認

- [ ] app.jsonの設定が正しい
- [ ] 広告ユニットIDが設定されている（本番用）
- [ ] アプリアイコンが設定されている
- [ ] スプラッシュスクリーンが設定されている
- [ ] バージョン番号が正しい

### Google Play Consoleの準備

- [ ] 開発者アカウントが作成されている
- [ ] アプリが作成されている
- [ ] アプリ情報が入力されている
- [ ] スクリーンショットがアップロードされている
- [ ] アプリアイコンがアップロードされている
- [ ] プライバシーポリシーが公開されている
- [ ] コンテンツレーティングが取得されている
- [ ] データの安全性が記入されている

### ビルドと配布

- [ ] 本番ビルドが成功している
- [ ] アプリバンドル（.aab）が生成されている
- [ ] 内部テストで動作確認が完了している
- [ ] リリースノートが作成されている
- [ ] レビューが送信されている

### その他

- [ ] エラーハンドリングが適切に実装されている
- [ ] ログ出力が適切に設定されている（本番環境では削除推奨）
- [ ] パフォーマンステストが完了している
- [ ] メモリリークがないことを確認

---

## トラブルシューティング

### ビルドエラー

**問題**: EAS Buildでエラーが発生する

**解決策**:
1. `eas.json`の設定を確認
2. `app.json`の設定を確認
3. 依存パッケージのバージョンを確認
4. EAS CLIを最新版に更新: `npm install -g eas-cli@latest`

### 広告が表示されない

**問題**: 広告が表示されない

**解決策**:
1. 広告ユニットIDが正しく設定されているか確認
2. AdMobアプリIDが`app.json`に設定されているか確認
3. テスト用の広告ユニットIDで動作確認
4. AdMobアカウントで広告ユニットが有効になっているか確認

### 位置情報が取得できない

**問題**: 位置情報の取得に失敗する

**解決策**:
1. `app.json`の権限設定を確認
2. デバイスの位置情報設定を確認
3. エミュレータではなく実機でテスト

---

## 参考資料

- [Expo 公式ドキュメント](https://docs.expo.dev/)
- [EAS Build ドキュメント](https://docs.expo.dev/build/introduction/)
- [Google Play Console ヘルプ](https://support.google.com/googleplay/android-developer)
- [Google AdMob ドキュメント](https://developers.google.com/admob)
- [React Native Google Mobile Ads](https://github.com/react-native-google-mobile-ads/react-native-google-mobile-ads)
