# AppLovin MAXへの移行ガイド

## 目次

1. [移行前の準備](#移行前の準備)
2. [移行手順](#移行手順)
3. [コード変更の詳細](#コード変更の詳細)
4. [テスト手順](#テスト手順)
5. [移行後の確認事項](#移行後の確認事項)
6. [ロールバック手順](#ロールバック手順)
7. [トラブルシューティング](#トラブルシューティング)

---

## 移行前の準備

### 前提条件

- ✅ アプリのダウンロード数が1万を超えた
- ✅ AppLovin MAXアカウントを作成済み
- ✅ 移行作業に2-4時間の時間を確保できる
- ✅ テスト環境で動作確認ができる

### 移行前チェックリスト

- [ ] **AppLovin MAXアカウントの準備**
  - [ ] AppLovin MAXアカウントを作成
  - [ ] アプリをAppLovin MAXに登録
  - [ ] SDKキーを取得
  - [ ] バナー広告ユニットIDを取得（iOS/Android）
  - [ ] インタースティシャル広告ユニットIDを取得（iOS/Android）

- [ ] **現在の実装の確認**
  - [ ] AdMobの広告ユニットIDを記録（バックアップ用）
  - [ ] 現在の広告表示頻度を確認（3回に1回）
  - [ ] 広告が表示されている画面を確認

- [ ] **バックアップ**
  - [ ] 現在のコードをGitにコミット
  - [ ] ブランチを作成（例: `feature/migrate-to-applovin`）

### 必要な情報の記録

移行前に以下の情報を記録しておきます：

```
【AdMob設定（現在）】
- Android App ID: ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
- iOS App ID: ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
- Android Banner Ad Unit ID: ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
- iOS Banner Ad Unit ID: ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
- Android Interstitial Ad Unit ID: ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
- iOS Interstitial Ad Unit ID: ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy

【AppLovin MAX設定（移行後）】
- SDK Key: [取得したSDKキー]
- Android Banner Ad Unit ID: [取得したID]
- iOS Banner Ad Unit ID: [取得したID]
- Android Interstitial Ad Unit ID: [取得したID]
- iOS Interstitial Ad Unit ID: [取得したID]
```

---

## 移行手順

### Step 1: ブランチの作成

```bash
cd /home/kurichan0515/hobby/NandemoCounter-app
git checkout -b feature/migrate-to-applovin
git add .
git commit -m "Backup: Before migrating to AppLovin MAX"
```

### Step 2: AppLovin MAXパッケージのインストール

```bash
cd app
npm install react-native-applovin-max
```

### Step 3: AdMobパッケージの削除

```bash
npm uninstall react-native-google-mobile-ads
```

### Step 4: app.jsonの設定変更

**ファイル**: `app/app.json`

**変更前**:
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

**変更後**:
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "react-native-applovin-max",
        {
          "sdkKey": "your-applovin-sdk-key-here"
        }
      ]
    ]
  }
}
```

**注意**: `sdkKey`は実際のAppLovin MAX SDKキーに置き換えてください。

### Step 5: コードの変更

以下のファイルを順番に変更します：

1. `app/services/ads.ts` - 広告サービスの変更
2. `app/components/BannerAd.tsx` - バナー広告コンポーネントの変更
3. `app/components/InterstitialAd.tsx` - インタースティシャル広告コンポーネントの変更
4. `app/app/_layout.tsx` - 初期化ロジックの変更

詳細は「コード変更の詳細」セクションを参照してください。

### Step 6: ビルドとテスト

```bash
# 開発ビルドでテスト
npm run android
# または
npm run ios
```

---

## コード変更の詳細

### 1. 広告サービスの変更

**ファイル**: `app/services/ads.ts`

**変更前**:
```typescript
import mobileAds from 'react-native-google-mobile-ads';

/**
 * 広告サービス
 */
class AdService {
  private interstitialAdRequestCount = 0;
  private readonly INTERSTITIAL_AD_FREQUENCY = 3; // 3回に1回表示

  /**
   * AdMobの初期化
   */
  async initialize(): Promise<void> {
    try {
      await mobileAds().initialize();
      console.log('AdMob initialized');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  /**
   * インタースティシャル広告を表示すべきかどうかを判定
   */
  shouldShowInterstitialAd(): boolean {
    this.interstitialAdRequestCount++;
    return this.interstitialAdRequestCount % this.INTERSTITIAL_AD_FREQUENCY === 0;
  }

  /**
   * カウンターをリセット（テスト用）
   */
  resetInterstitialAdCounter(): void {
    this.interstitialAdRequestCount = 0;
  }
}

export const adService = new AdService();
```

**変更後**:
```typescript
/**
 * 広告サービス（AppLovin MAX用）
 */
class AdService {
  private interstitialAdRequestCount = 0;
  private readonly INTERSTITIAL_AD_FREQUENCY = 3; // 3回に1回表示

  /**
   * AppLovin MAXの初期化（_layout.tsxで実行されるため、ここでは何もしない）
   * 互換性のため、メソッドは残す
   */
  async initialize(): Promise<void> {
    // 初期化は_app.tsxで実行されるため、ここでは何もしない
    console.log('AdService: Initialize called (handled in _layout.tsx)');
  }

  /**
   * インタースティシャル広告を表示すべきかどうかを判定
   */
  shouldShowInterstitialAd(): boolean {
    this.interstitialAdRequestCount++;
    return this.interstitialAdRequestCount % this.INTERSTITIAL_AD_FREQUENCY === 0;
  }

  /**
   * カウンターをリセット（テスト用）
   */
  resetInterstitialAdCounter(): void {
    this.interstitialAdRequestCount = 0;
  }
}

export const adService = new AdService();
```

### 2. バナー広告コンポーネントの変更

**ファイル**: `app/components/BannerAd.tsx`

**変更前**:
```typescript
import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// テスト用広告ユニットID（実際の広告ユニットIDに置き換える）
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // iOS用の実際の広告ユニットID
      android: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // Android用の実際の広告ユニットID
    }) || TestIds.BANNER;

export default function BannerAdComponent() {
  const [adError, setAdError] = useState(false);

  if (adError) {
    return null; // エラー時は広告を表示しない
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
          setAdError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
  },
});
```

**変更後**:
```typescript
import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AppLovinMAX, { AdView } from 'react-native-applovin-max';

// 広告ユニットID（実際の広告ユニットIDに置き換える）
const BANNER_AD_UNIT_ID = Platform.select({
  ios: 'your-ios-banner-ad-unit-id', // iOS用の実際の広告ユニットID
  android: 'your-android-banner-ad-unit-id', // Android用の実際の広告ユニットID
}) || '';

export default function BannerAdComponent() {
  const [adError, setAdError] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    // コンポーネントがマウントされたときに広告をロード
    if (BANNER_AD_UNIT_ID) {
      AppLovinMAX.loadBanner(BANNER_AD_UNIT_ID);
    }
  }, []);

  if (adError || !BANNER_AD_UNIT_ID) {
    return null; // エラー時は広告を表示しない
  }

  return (
    <View style={styles.container}>
      <AdView
        adUnitId={BANNER_AD_UNIT_ID}
        adFormat={AppLovinMAX.AdFormat.BANNER}
        style={styles.adView}
        onAdLoaded={(adInfo) => {
          console.log('Banner ad loaded:', adInfo);
          setIsAdLoaded(true);
        }}
        onAdLoadFailed={(errorInfo) => {
          console.error('Banner ad failed to load:', errorInfo);
          setAdError(true);
        }}
        onAdClicked={(adInfo) => {
          console.log('Banner ad clicked:', adInfo);
        }}
        onAdExpanded={(adInfo) => {
          console.log('Banner ad expanded:', adInfo);
        }}
        onAdCollapsed={(adInfo) => {
          console.log('Banner ad collapsed:', adInfo);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
  },
  adView: {
    width: '100%',
    height: 50, // バナー広告の高さ
  },
});
```

### 3. インタースティシャル広告コンポーネントの変更

**ファイル**: `app/components/InterstitialAd.tsx`

**変更前**:
```typescript
import { useEffect, useRef } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// テスト用広告ユニットID（実際の広告ユニットIDに置き換える）
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // iOS用の実際の広告ユニットID
      android: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy', // Android用の実際の広告ユニットID
    }) || TestIds.INTERSTITIAL;

let interstitialAd: InterstitialAd | null = null;

/**
 * インタースティシャル広告を表示
 */
export function showInterstitialAd(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // 広告インスタンスを取得または作成
      if (!interstitialAd) {
        interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
          requestNonPersonalizedAdsOnly: true,
        });
      }

      const unsubscribe = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        unsubscribe();
        interstitialAd?.show();
      });

      const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        unsubscribeError();
        console.error('Interstitial ad error:', error);
        resolve(); // エラーでも処理を続行
      });

      const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        unsubscribeClosed();
        // 広告を閉じた後、新しい広告をロード
        interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
          requestNonPersonalizedAdsOnly: true,
        });
        resolve();
      });

      // 広告をロード
      interstitialAd.load();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      resolve(); // エラーでも処理を続行
    }
  });
}

/**
 * インタースティシャル広告を事前ロード
 */
export function preloadInterstitialAd(): void {
  try {
    if (!interstitialAd) {
      interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });
    }
    interstitialAd.load();
  } catch (error) {
    console.error('Failed to preload interstitial ad:', error);
  }
}
```

**変更後**:
```typescript
import { Platform } from 'react-native';
import AppLovinMAX from 'react-native-applovin-max';

// 広告ユニットID（実際の広告ユニットIDに置き換える）
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'your-ios-interstitial-ad-unit-id', // iOS用の実際の広告ユニットID
  android: 'your-android-interstitial-ad-unit-id', // Android用の実際の広告ユニットID
}) || '';

let interstitialAd: any = null;

/**
 * インタースティシャル広告を表示
 */
export function showInterstitialAd(): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (!INTERSTITIAL_AD_UNIT_ID) {
        console.warn('Interstitial ad unit ID is not set');
        resolve();
        return;
      }

      // 広告インスタンスを取得または作成
      if (!interstitialAd) {
        interstitialAd = AppLovinMAX.createInterstitialAd(INTERSTITIAL_AD_UNIT_ID);
      }

      // 広告ロードリスナーを設定
      interstitialAd.setAdLoadListener({
        onAdLoaded: () => {
          console.log('Interstitial ad loaded');
          interstitialAd.show();
        },
        onAdLoadFailed: (errorInfo: any) => {
          console.error('Interstitial ad failed to load:', errorInfo);
          resolve(); // エラーでも処理を続行
        },
      });

      // 広告表示リスナーを設定
      interstitialAd.setAdDisplayListener({
        onAdDisplayed: (adInfo: any) => {
          console.log('Interstitial ad displayed:', adInfo);
        },
        onAdHidden: () => {
          console.log('Interstitial ad hidden');
          // 広告を閉じた後、新しい広告をロード
          interstitialAd = AppLovinMAX.createInterstitialAd(INTERSTITIAL_AD_UNIT_ID);
          resolve();
        },
        onAdClicked: (adInfo: any) => {
          console.log('Interstitial ad clicked:', adInfo);
        },
        onAdDisplayFailed: (errorInfo: any) => {
          console.error('Interstitial ad display failed:', errorInfo);
          resolve(); // エラーでも処理を続行
        },
      });

      // 広告をロード
      interstitialAd.load();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      resolve(); // エラーでも処理を続行
    }
  });
}

/**
 * インタースティシャル広告を事前ロード
 */
export function preloadInterstitialAd(): void {
  try {
    if (!INTERSTITIAL_AD_UNIT_ID) {
      console.warn('Interstitial ad unit ID is not set');
      return;
    }

    if (!interstitialAd) {
      interstitialAd = AppLovinMAX.createInterstitialAd(INTERSTITIAL_AD_UNIT_ID);
    }

    interstitialAd.setAdLoadListener({
      onAdLoaded: () => {
        console.log('Interstitial ad preloaded');
      },
      onAdLoadFailed: (errorInfo: any) => {
        console.error('Interstitial ad preload failed:', errorInfo);
      },
    });

    interstitialAd.load();
  } catch (error) {
    console.error('Failed to preload interstitial ad:', error);
  }
}
```

### 4. 初期化ロジックの変更

**ファイル**: `app/app/_layout.tsx`

**変更前**:
```typescript
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { CounterProvider } from '../contexts/CounterContext';
import { adService } from '../services/ads';
import { preloadInterstitialAd } from '../components/InterstitialAd';

export default function RootLayout() {
  useEffect(() => {
    // AdMobの初期化
    adService.initialize().then(() => {
      // インタースティシャル広告を事前ロード
      preloadInterstitialAd();
    });
  }, []);

  return (
    <CounterProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </CounterProvider>
  );
}
```

**変更後**:
```typescript
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { CounterProvider } from '../contexts/CounterContext';
import AppLovinMAX from 'react-native-applovin-max';
import { preloadInterstitialAd } from '../components/InterstitialAd';

// AppLovin MAX SDKキー（実際のSDKキーに置き換える）
const APPLOVIN_SDK_KEY = 'your-applovin-sdk-key-here';

export default function RootLayout() {
  useEffect(() => {
    // AppLovin MAXの初期化
    AppLovinMAX.initialize(APPLOVIN_SDK_KEY)
      .then((configuration) => {
        console.log('AppLovin MAX initialized:', configuration);
        // インタースティシャル広告を事前ロード
        preloadInterstitialAd();
      })
      .catch((error) => {
        console.error('Failed to initialize AppLovin MAX:', error);
      });
  }, []);

  return (
    <CounterProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </CounterProvider>
  );
}
```

**注意**: `APPLOVIN_SDK_KEY`は実際のAppLovin MAX SDKキーに置き換えてください。環境変数を使用する場合は、`.env`ファイルに設定してください。

---

## テスト手順

### 1. 開発環境でのテスト

```bash
cd app
npm run android
# または
npm run ios
```

### 2. テストチェックリスト

- [ ] **アプリの起動**
  - [ ] アプリが正常に起動する
  - [ ] エラーが発生しない

- [ ] **バナー広告**
  - [ ] メイン画面にバナー広告が表示される
  - [ ] 履歴画面にバナー広告が表示される
  - [ ] 広告が正常にロードされる
  - [ ] 広告をクリックできる（テスト広告）

- [ ] **インタースティシャル広告**
  - [ ] 記録完了時にインタースティシャル広告が表示される（3回に1回）
  - [ ] 広告が正常にロードされる
  - [ ] 広告を閉じることができる
  - [ ] 広告を閉じた後、アプリが正常に動作する

- [ ] **エラーハンドリング**
  - [ ] 広告のロードに失敗した場合、アプリがクラッシュしない
  - [ ] エラーログが適切に出力される

### 3. 本番環境でのテスト

内部テストビルドを作成してテスト：

```bash
cd app
eas build --platform android --profile preview
```

テストユーザーに配布して、以下を確認：

- [ ] 広告が表示される
- [ ] 広告のクリック率が適切
- [ ] アプリのパフォーマンスに問題がない

---

## 移行後の確認事項

### 1. AppLovin MAXダッシュボードでの確認

- [ ] **広告の表示状況**
  - [ ] バナー広告のインプレッション数が記録されている
  - [ ] インタースティシャル広告のインプレッション数が記録されている
  - [ ] クリック数が記録されている

- [ ] **収益の確認**
  - [ ] eCPMが表示されている
  - [ ] 収益が記録されている
  - [ ] AdMobと比較して収益が向上しているか確認

### 2. アプリのパフォーマンス確認

- [ ] **起動時間**
  - [ ] アプリの起動時間に影響がない
  - [ ] 広告のロード時間が適切

- [ ] **メモリ使用量**
  - [ ] メモリリークがない
  - [ ] メモリ使用量が適切

- [ ] **クラッシュレポート**
  - [ ] クラッシュが発生していない
  - [ ] エラーが発生していない

### 3. ユーザーフィードバック

- [ ] **レビュー**
  - [ ] ユーザーレビューを確認
  - [ ] 広告に関する苦情がないか確認

- [ ] **アンインストール率**
  - [ ] アンインストール率が急激に上がっていないか確認

---

## ロールバック手順

万が一、問題が発生した場合のロールバック手順です。

### 1. Gitでロールバック

```bash
cd /home/kurichan0515/hobby/NandemoCounter-app
git checkout main
git branch -D feature/migrate-to-applovin
```

### 2. パッケージの復元

```bash
cd app
npm uninstall react-native-applovin-max
npm install react-native-google-mobile-ads@^16.0.3
```

### 3. app.jsonの復元

`app.json`を元のAdMob設定に戻します。

### 4. コードの復元

変更したファイルを元に戻します：

- `app/services/ads.ts`
- `app/components/BannerAd.tsx`
- `app/components/InterstitialAd.tsx`
- `app/app/_layout.tsx`

### 5. ビルドとデプロイ

```bash
cd app
eas build --platform android --profile production
```

---

## トラブルシューティング

### 問題1: アプリが起動しない

**原因**: SDKキーが正しく設定されていない

**解決策**:
1. `app.json`の`sdkKey`を確認
2. AppLovin MAXダッシュボードでSDKキーを確認
3. 環境変数を使用している場合、`.env`ファイルを確認

### 問題2: 広告が表示されない

**原因**: 広告ユニットIDが正しく設定されていない

**解決策**:
1. `BannerAd.tsx`と`InterstitialAd.tsx`の広告ユニットIDを確認
2. AppLovin MAXダッシュボードで広告ユニットIDを確認
3. プラットフォーム（iOS/Android）が正しいか確認

### 問題3: インタースティシャル広告が表示されない

**原因**: 広告がロードされていない、または頻度制御の問題

**解決策**:
1. `preloadInterstitialAd()`が呼ばれているか確認
2. `shouldShowInterstitialAd()`のロジックを確認
3. 広告のロードエラーを確認（コンソールログ）

### 問題4: ビルドエラー

**原因**: パッケージの依存関係の問題

**解決策**:
```bash
cd app
rm -rf node_modules package-lock.json
npm install
```

### 問題5: 収益が下がった

**原因**: メディエーションネットワークの設定が不適切

**解決策**:
1. AppLovin MAXダッシュボードでメディエーションネットワークを確認
2. AdMobをメディエーションネットワークとして追加
3. ウォーターフォール設定を最適化

---

## 移行完了チェックリスト

- [ ] AppLovin MAXパッケージがインストールされている
- [ ] AdMobパッケージが削除されている
- [ ] `app.json`が更新されている
- [ ] すべてのコード変更が完了している
- [ ] テストが完了している
- [ ] 本番環境で動作確認が完了している
- [ ] AppLovin MAXダッシュボードで広告が記録されている
- [ ] 収益が記録されている
- [ ] ユーザーフィードバックを確認した
- [ ] 移行をGitにコミットした

---

## 参考資料

- [AppLovin MAX React Native ドキュメント](https://developers.applovin.com/en/max/react-native/overview/integration/)
- [AppLovin MAX GitHub](https://github.com/AppLovin/AppLovin-MAX-React-Native)
- [広告ネットワーク比較](./ad-network-comparison.md)

---

## 移行後の最適化

移行が完了したら、以下の最適化を検討してください：

1. **メディエーションネットワークの追加**
   - AdMobをメディエーションネットワークとして追加
   - Unity Ads、Facebook Audience Networkなどを追加

2. **ウォーターフォールの最適化**
   - 各ネットワークのパフォーマンスを分析
   - ウォーターフォールの順序を最適化

3. **A/Bテスト**
   - 広告の表示頻度をテスト
   - 広告の配置をテスト

4. **収益の監視**
   - 日次で収益を確認
   - パフォーマンスの変化を監視
