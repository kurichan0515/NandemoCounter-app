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
