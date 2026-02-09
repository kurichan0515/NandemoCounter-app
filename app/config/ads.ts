import { Platform } from 'react-native';

/**
 * 広告設定
 * 環境変数から広告ユニットIDを取得
 */
export const adConfig = {
  // AdMob App ID
  androidAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || 'ca-app-pub-6862900859746528~5817361788',
  iosAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy',

  // バナー広告ユニットID
  bannerAdUnitId: Platform.select({
    ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS || 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID || 'ca-app-pub-6862900859746528/3358719407',
  }) || '',

  // インタースティシャル広告ユニットID
  interstitialAdUnitId: Platform.select({
    ios: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS || 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    android: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID || 'ca-app-pub-6862900859746528/5553637906',
  }) || '',

  // 環境情報
  env: process.env.EXPO_PUBLIC_ENV || 'development',
};
