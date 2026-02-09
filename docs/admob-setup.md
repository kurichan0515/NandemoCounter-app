# AdMob設定ガイド

## 1. AdMobアカウントの作成

### ステップ1: AdMobにアクセス

1. [Google AdMob](https://admob.google.com/)にアクセス
2. Googleアカウントでログイン

### ステップ2: アカウント作成

1. 「今すぐ始める」をクリック
2. 国・地域を選択
3. 支払い情報を登録（$1の認証料が発生する場合があります）
4. 利用規約に同意

## 2. アプリの登録

### iOS用アプリの登録

1. AdMobダッシュボードで「アプリ」→「アプリを追加」をクリック
2. プラットフォーム: **iOS**を選択
3. アプリ名: **なんでもカウンター**
4. パッケージ名: `com.nandemocounter`
5. アプリストア: **App Store**（リリース後は選択）
6. 「アプリを追加」をクリック

### Android用アプリの登録

1. AdMobダッシュボードで「アプリ」→「アプリを追加」をクリック
2. プラットフォーム: **Android**を選択
3. アプリ名: **なんでもカウンター**
4. パッケージ名: `com.nandemocounter`
5. アプリストア: **Google Play**（リリース後は選択）
6. 「アプリを追加」をクリック

**重要**: アプリを追加すると、**アプリID**が発行されます。これは`app.json`の設定で使用します。

## 3. 広告ユニットの作成

### バナー広告ユニット

1. 登録したアプリを選択
2. 「広告ユニット」タブをクリック
3. 「広告ユニットを作成」をクリック
4. 広告形式: **バナー**を選択
5. 広告ユニット名: **メイン画面バナー**
6. 「広告ユニットを作成」をクリック
7. **広告ユニットID**をコピー（例: `ca-app-pub-1234567890123456/1234567890`）

### インタースティシャル広告ユニット

1. 同じアプリで「広告ユニットを作成」をクリック
2. 広告形式: **インタースティシャル**を選択
3. 広告ユニット名: **記録完了時インタースティシャル**
4. 「広告ユニットを作成」をクリック
5. **広告ユニットID**をコピー

## 4. アプリへの設定

### app.jsonの設定

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

**注意**: 
- `androidAppId`と`iosAppId`は**アプリID**（広告ユニットIDではない）
- アプリIDは`ca-app-pub-`で始まり、`~`で区切られた形式

### 広告コンポーネントの設定

#### バナー広告

**ファイル**: `app/components/BannerAd.tsx`

```typescript
const BANNER_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // iOS用の実際の広告ユニットID
  android: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // Android用の実際の広告ユニットID
}) || TestIds.BANNER;
```

#### インタースティシャル広告

**ファイル**: `app/components/InterstitialAd.tsx`

```typescript
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // iOS用の実際の広告ユニットID
  android: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // Android用の実際の広告ユニットID
}) || TestIds.INTERSTITIAL;
```

## 5. テスト用広告ユニットID

開発中は以下のテスト用広告ユニットIDを使用できます：

### バナー広告（テスト用）

- **iOS**: `ca-app-pub-3940256099942544/2934735716`
- **Android**: `ca-app-pub-3940256099942544/6300978111`

### インタースティシャル広告（テスト用）

- **iOS**: `ca-app-pub-3940256099942544/4411468910`
- **Android**: `ca-app-pub-3940256099942544/1033173712`

**注意**: テスト用広告ユニットIDは実際の収益にはなりません。

## 6. 広告の実装確認

### チェックリスト

- [ ] AdMobアカウントが作成されている
- [ ] iOS用アプリが登録されている
- [ ] Android用アプリが登録されている
- [ ] バナー広告ユニットが作成されている
- [ ] インタースティシャル広告ユニットが作成されている
- [ ] `app.json`にアプリIDが設定されている
- [ ] 広告コンポーネントに広告ユニットIDが設定されている
- [ ] テスト用広告で動作確認が完了している

## 7. 本番環境への移行

本番環境に移行する際は：

1. テスト用広告ユニットIDを実際のIDに置き換える
2. 広告が正しく表示されることを確認
3. AdMobダッシュボードで広告の表示状況を確認

## 8. トラブルシューティング

### 広告が表示されない

**原因と解決策**:

1. **アプリIDが設定されていない**
   - `app.json`の`androidAppId`と`iosAppId`を確認

2. **広告ユニットIDが間違っている**
   - 広告コンポーネントのIDを確認

3. **広告ユニットが無効**
   - AdMobダッシュボードで広告ユニットの状態を確認

4. **ネットワーク接続の問題**
   - インターネット接続を確認

5. **アプリがまだレビュー中**
   - 新規アプリは24時間程度かかる場合があります

### エラーメッセージ

**"Ad failed to load"**
- 広告ユニットIDが正しいか確認
- ネットワーク接続を確認
- AdMobアカウントの状態を確認

**"Invalid ad unit ID"**
- 広告ユニットIDの形式を確認（`ca-app-pub-`で始まる）
- プラットフォーム（iOS/Android）が正しいか確認

## 9. ベストプラクティス

1. **広告の頻度制御**: 過度な広告表示は避ける（現在は3回に1回）
2. **ユーザー体験**: 広告がアプリの使用を妨げないようにする
3. **テスト**: 本番環境に移行前に十分にテストする
4. **モニタリング**: AdMobダッシュボードで広告のパフォーマンスを確認

## 10. 参考資料

- [Google AdMob 公式ドキュメント](https://developers.google.com/admob)
- [React Native Google Mobile Ads](https://github.com/react-native-google-mobile-ads/react-native-google-mobile-ads)
- [AdMob ポリシー](https://support.google.com/admob/answer/6128543)
