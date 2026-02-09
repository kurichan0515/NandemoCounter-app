import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { locationService } from '../../services/location';

interface LocationSelectorProps {
  value: { latitude: number; longitude: number; address?: string } | null;
  enabled: boolean;
  onChange: (location: { latitude: number; longitude: number; address?: string } | null) => void;
  onEnabledChange: (enabled: boolean) => void;
}

export default function LocationSelector({
  value,
  enabled,
  onChange,
  onEnabledChange,
}: LocationSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!enabled) {
      // 位置情報を取得
      setIsLoading(true);
      const location = await locationService.getCurrentLocation();
      setIsLoading(false);

      if (location) {
        onChange(location);
        onEnabledChange(true);
      } else {
        Alert.alert(
          '位置情報',
          '位置情報の取得に失敗しました。設定で位置情報の許可を確認してください。'
        );
      }
    } else {
      onChange(null);
      onEnabledChange(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggle} onPress={handleToggle} disabled={isLoading}>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.toggleText}>位置情報を取得中...</Text>
          </View>
        ) : (
          <Text style={styles.toggleText}>
            {enabled ? '✓ 位置情報を記録' : '○ 位置情報を記録しない'}
          </Text>
        )}
      </TouchableOpacity>
      {enabled && value && (
        <View style={styles.info}>
          <Text style={styles.infoText}>緯度: {value.latitude.toFixed(6)}</Text>
          <Text style={styles.infoText}>経度: {value.longitude.toFixed(6)}</Text>
          {value.address && <Text style={styles.address}>{value.address}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  toggle: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleText: {
    fontSize: 14,
    color: '#333',
  },
  info: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  address: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 4,
  },
});
