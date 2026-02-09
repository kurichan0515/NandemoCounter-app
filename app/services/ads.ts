// 広告ライブラリの動的インポート（エラーハンドリング付き）
let mobileAds: any = null;

try {
  mobileAds = require('react-native-google-mobile-ads').default;
} catch (error) {
  console.warn('react-native-google-mobile-ads is not available:', error);
}

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
    if (!mobileAds) {
      console.warn('AdMob is not available (plugin disabled)');
      return;
    }
    
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
