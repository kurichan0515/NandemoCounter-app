import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { adConfig } from '../config/ads';

// 広告ライブラリの動的インポート（エラーハンドリング付き）
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  const adsModule = require('react-native-google-mobile-ads');
  BannerAd = adsModule.BannerAd;
  BannerAdSize = adsModule.BannerAdSize;
  TestIds = adsModule.TestIds;
} catch (error) {
  console.warn('react-native-google-mobile-ads is not available:', error);
}

// 広告ユニットID（環境変数から取得、開発環境ではテストIDを使用）
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds?.BANNER
  : adConfig.bannerAdUnitId || TestIds?.BANNER;

export default function BannerAdComponent() {
  const [adError, setAdError] = useState(false);

  // 広告ライブラリが利用できない場合は何も表示しない
  if (!BannerAd || !BannerAdSize || adError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error: any) => {
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
