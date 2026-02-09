import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { adConfig } from '../config/ads';

// 広告ライブラリの動的インポート（エラーハンドリング付き）
let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;

try {
  const adsModule = require('react-native-google-mobile-ads');
  InterstitialAd = adsModule.InterstitialAd;
  AdEventType = adsModule.AdEventType;
  TestIds = adsModule.TestIds;
} catch (error) {
  console.warn('react-native-google-mobile-ads is not available:', error);
}

// 広告ユニットID（環境変数から取得、開発環境ではテストIDを使用）
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds?.INTERSTITIAL
  : adConfig.interstitialAdUnitId || TestIds?.INTERSTITIAL;

let interstitialAd: any = null;

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

      const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
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
