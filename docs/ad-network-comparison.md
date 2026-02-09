# 広告ネットワーク比較: Google AdMob vs AppLovin MAX

## 目次

1. [概要](#概要)
2. [実装の難易度比較](#実装の難易度比較)
3. [収益化の比較](#収益化の比較)
4. [推奨事項](#推奨事項)
5. [AppLovinへの移行手順](#applovinへの移行手順)

---

## 概要

### Google AdMob（現在の実装）

- **プラットフォーム**: Googleが提供するモバイル広告プラットフォーム
- **特徴**: 
  - Google広告ネットワークへの直接アクセス
  - シンプルな実装
  - 広く使われている
- **収益モデル**: CPM（インプレッション単価）、CPC（クリック単価）

### AppLovin MAX

- **プラットフォーム**: AppLovinが提供するメディエーションプラットフォーム
- **特徴**:
  - **複数の広告ネットワークを統合**（AdMob、Unity Ads、Facebook Audience Networkなど）
  - **ウォーターフォール方式**で最高単価の広告を自動選択
  - より高い収益化の可能性
- **収益モデル**: eCPM（有効インプレッション単価）の最適化

---

## 実装の難易度比較

### Google AdMob（現在）

**難易度**: ⭐⭐☆☆☆（簡単）

**実装済み**:
- ✅ `react-native-google-mobile-ads`パッケージを使用
- ✅ バナー広告とインタースティシャル広告を実装
- ✅ 初期化と広告表示のロジックが完成

**必要な作業**:
- AdMobアカウント作成
- 広告ユニットIDの設定
- `app.json`への設定追加

**実装ファイル数**: 3ファイル
- `app/components/BannerAd.tsx`
- `app/components/InterstitialAd.tsx`
- `app/services/ads.ts`

### AppLovin MAX（移行時）

**難易度**: ⭐⭐⭐☆☆（中程度）

**必要な作業**:

1. **パッケージのインストール**
   ```bash
   npm install react-native-applovin-max
   ```

2. **SDKキーの取得**
   - AppLovinダッシュボードでアプリを登録
   - SDKキーを取得

3. **実装の変更**
   - 広告コンポーネントの書き換え（2ファイル）
   - 初期化ロジックの変更（1ファイル）
   - `app.json`の設定変更

4. **設定ファイルの追加**
   - Android: `build.gradle`の設定
   - iOS: `Info.plist`の設定

**実装ファイル数**: 3-4ファイル（既存ファイルの変更）

**推定作業時間**: 2-4時間

---

## 収益化の比較

### Google AdMob

**メリット**:
- ✅ **安定した広告在庫**: Google広告ネットワークへの直接アクセス
- ✅ **シンプルな管理**: 1つのダッシュボードで管理
- ✅ **低い実装コスト**: 簡単な実装で開始可能
- ✅ **信頼性**: Googleの安定したインフラ

**デメリット**:
- ❌ **単一ネットワーク**: 他のネットワークと比較できない
- ❌ **収益の上限**: 単一ネットワークのため、最適化の余地が限定的

**収益化の特徴**:
- 中小規模アプリに適している
- 実装が簡単で、すぐに収益化を開始できる
- 安定した広告在庫で一定の収益が見込める

### AppLovin MAX

**メリット**:
- ✅ **複数ネットワークの統合**: AdMob、Unity Ads、Facebook Audience Networkなど
- ✅ **ウォーターフォール最適化**: 最高単価の広告を自動選択
- ✅ **高い収益化の可能性**: 複数ネットワークの競争により、eCPMが向上する可能性
- ✅ **詳細な分析**: ネットワーク別のパフォーマンス分析

**デメリット**:
- ❌ **実装が複雑**: 複数ネットワークの設定が必要
- ❌ **初期設定の手間**: 各ネットワークのアカウント作成が必要な場合がある
- ❌ **学習曲線**: 最適化には時間がかかる

**収益化の特徴**:
- **大規模アプリやゲームに適している**
- **複数ネットワークの競争により、eCPMが10-30%向上する可能性**
- 最適化に時間をかけることで、より高い収益が見込める

### 収益化の比較（一般的な傾向）

| 項目 | Google AdMob | AppLovin MAX |
|------|--------------|--------------|
| **初期収益化** | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ |
| **最適化後の収益** | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐☆ |
| **実装の簡単さ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆☆ |
| **管理の簡単さ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆☆ |
| **収益の上限** | 中 | 高 |

**注意**: 収益はアプリの種類、ユーザー層、地域、広告の表示頻度などによって大きく異なります。

---

## 推奨事項

### 現時点での推奨: Google AdMobを継続

**理由**:

1. **実装が完了している**: すでに実装済みで、すぐに収益化を開始できる
2. **シンプルな管理**: 1つのダッシュボードで管理でき、運用が簡単
3. **安定性**: Googleの安定したインフラで、広告在庫が豊富
4. **学習コスト**: AppLovin MAXの学習や最適化に時間をかける必要がない

### AppLovin MAXへの移行を検討するタイミング

以下の条件を満たす場合、AppLovin MAXへの移行を検討：

1. **アプリが一定のユーザー数を獲得した後**
   - 月間アクティブユーザー（MAU）が1万人以上
   - 広告表示回数が安定している

2. **収益化の最適化が必要な場合**
   - AdMobでの収益が頭打ちになった
   - より高い収益を目指したい

3. **時間的余裕がある場合**
   - 実装と最適化に時間をかけられる
   - 複数ネットワークの管理が可能

### ハイブリッドアプローチ（推奨）

**段階的な移行**:

1. **Phase 1**: Google AdMobで開始（現在）
   - 実装が簡単
   - すぐに収益化を開始

2. **Phase 2**: アプリが成長したらAppLovin MAXを検討
   - ユーザー数が増えたら移行を検討
   - 収益化の最適化が必要になったら移行

3. **Phase 3**: AppLovin MAXで複数ネットワークを統合
   - AdMobもAppLovin MAXのメディエーションネットワークとして統合可能
   - 最高単価の広告を自動選択

---

## AppLovinへの移行手順

### 1. AppLovinアカウントの作成

1. [AppLovin MAX](https://www.applovin.com/max/)にアクセス
2. アカウントを作成
3. アプリを登録
4. SDKキーを取得

### 2. パッケージのインストール

```bash
cd app
npm install react-native-applovin-max
```

### 3. app.jsonの設定変更

**変更前**（AdMob）:
```json
{
  "expo": {
    "plugins": [
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

**変更後**（AppLovin MAX）:
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-applovin-max",
        {
          "sdkKey": "your-applovin-sdk-key"
        }
      ]
    ]
  }
}
```

### 4. 広告コンポーネントの変更

#### BannerAd.tsxの変更例

```typescript
import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AppLovinMAX from 'react-native-applovin-max';

const BANNER_AD_UNIT_ID = Platform.select({
  ios: 'your-ios-banner-ad-unit-id',
  android: 'your-android-banner-ad-unit-id',
}) || '';

export default function BannerAdComponent() {
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // バナー広告をロード
    AppLovinMAX.loadBanner(BANNER_AD_UNIT_ID);
  }, []);

  if (adError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppLovinMAX.AdView
        adUnitId={BANNER_AD_UNIT_ID}
        adFormat={AppLovinMAX.AdFormat.BANNER}
        onAdLoaded={(adInfo) => {
          console.log('Banner ad loaded:', adInfo);
        }}
        onAdLoadFailed={(errorInfo) => {
          console.error('Banner ad failed to load:', errorInfo);
          setAdError(true);
        }}
      />
    </View>
  );
}
```

#### InterstitialAd.tsxの変更例

```typescript
import { useRef } from 'react';
import AppLovinMAX from 'react-native-applovin-max';
import { Platform } from 'react-native';

const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'your-ios-interstitial-ad-unit-id',
  android: 'your-android-interstitial-ad-unit-id',
}) || '';

let interstitialAd: any = null;

export function showInterstitialAd(): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (!interstitialAd) {
        interstitialAd = AppLovinMAX.createInterstitialAd(INTERSTITIAL_AD_UNIT_ID);
      }

      interstitialAd.setAdLoadListener({
        onAdLoaded: () => {
          interstitialAd.show();
        },
        onAdLoadFailed: (errorInfo: any) => {
          console.error('Interstitial ad failed to load:', errorInfo);
          resolve();
        },
      });

      interstitialAd.setAdDisplayListener({
        onAdHidden: () => {
          resolve();
        },
      });

      interstitialAd.load();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      resolve();
    }
  });
}

export function preloadInterstitialAd(): void {
  try {
    if (!interstitialAd) {
      interstitialAd = AppLovinMAX.createInterstitialAd(INTERSTITIAL_AD_UNIT_ID);
    }
    interstitialAd.load();
  } catch (error) {
    console.error('Failed to preload interstitial ad:', error);
  }
}
```

### 5. 初期化ロジックの変更

**app/_layout.tsxの変更**:

```typescript
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { CounterProvider } from '../contexts/CounterContext';
import AppLovinMAX from 'react-native-applovin-max';
import { preloadInterstitialAd } from '../components/InterstitialAd';

export default function RootLayout() {
  useEffect(() => {
    // AppLovin MAXの初期化
    AppLovinMAX.initialize('your-applovin-sdk-key')
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

### 6. サービスファイルの変更

**services/ads.tsの変更**:

```typescript
/**
 * 広告サービス（AppLovin MAX用）
 */
class AdService {
  private interstitialAdRequestCount = 0;
  private readonly INTERSTITIAL_AD_FREQUENCY = 3; // 3回に1回表示

  /**
   * AppLovin MAXの初期化（_layout.tsxで実行）
   */
  async initialize(): Promise<void> {
    // 初期化は_app.tsxで実行されるため、ここでは何もしない
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

### 7. パッケージの削除

```bash
cd app
npm uninstall react-native-google-mobile-ads
```

---

## まとめ

### 現時点での推奨

**Google AdMobを継続**することを推奨します。

**理由**:
- ✅ 実装が完了している
- ✅ すぐに収益化を開始できる
- ✅ 管理が簡単
- ✅ 安定した広告在庫

### 将来の移行

アプリが成長し、収益化の最適化が必要になったら、**AppLovin MAXへの移行を検討**してください。

**移行のタイミング**:
- 月間アクティブユーザー（MAU）が1万人以上
- AdMobでの収益が頭打ちになった
- より高い収益を目指したい

**移行の難易度**: 中程度（2-4時間の作業）

**期待される収益向上**: 10-30%（最適化後）

---

## 参考資料

- [AppLovin MAX React Native ドキュメント](https://developers.applovin.com/en/max/react-native/overview/integration/)
- [Google AdMob ドキュメント](https://developers.google.com/admob)
- [AppLovin MAX GitHub](https://github.com/AppLovin/AppLovin-MAX-React-Native)
- [AppLovin MAX移行ガイド](./migration-to-applovin.md) - 詳細な移行手順
