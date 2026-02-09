/**
 * Expo設定ファイル（動的設定用）
 * 環境変数に基づいて設定を変更可能
 * 
 * 注意: app.jsonとapp.config.jsの両方がある場合、app.config.jsが優先されます
 */
const baseConfig = require('./app.json');

module.exports = () => {
  const env = process.env.EXPO_PUBLIC_ENV || 'development';

  // 環境に応じたAdMob App ID
  const androidAppId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || 'ca-app-pub-6862900859746528~5817361788';
  const iosAppId = process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy';

  return {
    ...baseConfig,
    expo: {
      ...baseConfig.expo,
      name: env === 'production' ? 'なんでもカウンター' : env === 'staging' ? 'なんでもカウンター (ステージング)' : baseConfig.expo.name,
      plugins: [
        [
          'expo-build-properties',
          {
            ios: {
              useFrameworks: 'static',
            },
          },
        ],
        'expo-router',
        '@react-native-community/datetimepicker',
        [
          'react-native-google-mobile-ads',
          {
            androidAppId: androidAppId,
            iosAppId: iosAppId,
          },
        ],
      ],
      extra: {
        ...baseConfig.expo.extra,
        env: env,
        'react-native-google-mobile-ads': {
          android_app_id: androidAppId,
          ios_app_id: iosAppId,
        },
      },
    },
  };
};
