import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * 位置情報サービス
 */
class LocationService {
  /**
   * 位置情報の取得許可をリクエスト
   */
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request location permission:', error);
      return false;
    }
  }

  /**
   * 位置情報の取得許可状態を確認
   */
  async checkPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to check location permission:', error);
      return false;
    }
  }

  /**
   * 現在位置を取得
   */
  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        const granted = await this.requestPermission();
        if (!granted) {
          return null;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // 逆ジオコーディング（オプション）
      let address: string | undefined;
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (addresses.length > 0) {
          const addr = addresses[0];
          const parts = [
            addr.country,
            addr.region,
            addr.city,
            addr.street,
            addr.name,
          ].filter(Boolean);
          address = parts.join(', ');
        }
      } catch (error) {
        console.warn('Failed to reverse geocode:', error);
        // 逆ジオコーディングに失敗しても位置情報は返す
      }

      return {
        latitude,
        longitude,
        address,
      };
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }
}

export const locationService = new LocationService();
