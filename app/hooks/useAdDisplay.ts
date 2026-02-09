import { useCallback } from 'react';
import { adService } from '../services/ads';
import { showInterstitialAd } from '../components/InterstitialAd';

/**
 * 広告表示のカスタムフック
 */
export function useAdDisplay() {
  const handleAdDisplay = useCallback(async () => {
    if (adService.shouldShowInterstitialAd()) {
      await showInterstitialAd();
    }
  }, []);

  return { handleAdDisplay };
}
