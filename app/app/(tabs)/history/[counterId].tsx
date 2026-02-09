import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCounter } from '../../../contexts/CounterContext';
import { formatDateTime } from '../../../utils/date';
import ErrorScreen from '../../../components/common/ErrorScreen';
import BannerAd from '../../../components/BannerAd';

export default function HistoryScreen() {
  const router = useRouter();
  const { counterId } = useLocalSearchParams<{ counterId: string }>();
  const { getCounterById, getRecordsByCounterId, getTagById } = useCounter();

  const counter = counterId ? getCounterById(counterId) : null;
  const records = counterId ? getRecordsByCounterId(counterId) : [];

  // 日付ごとにグループ化
  const groupedRecords = records.reduce((acc, record) => {
    const date = formatDateTime(record.timestamp).split(' ')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, typeof records>);

  const sortedDates = Object.keys(groupedRecords).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  if (!counter) {
    return <ErrorScreen message="カウンターが見つかりません" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{counter.name}の履歴</Text>
        <Text style={styles.subtitle}>記録数: {records.length}</Text>
      </View>
      <BannerAd />

      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>記録がありません</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {sortedDates.map((date) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateLabel}>{date}</Text>
              {groupedRecords[date].map((record) => (
                <View key={record.id} style={styles.recordItem}>
                  <View style={styles.recordHeader}>
                    <Text style={styles.recordTime}>
                      {formatDateTime(record.timestamp).split(' ')[1]}
                    </Text>
                    <Text
                      style={[
                        styles.recordCount,
                        record.count >= 0 ? styles.recordCountPositive : styles.recordCountNegative,
                      ]}
                    >
                      {record.count >= 0 ? '+' : ''}{record.count}
                    </Text>
                  </View>
                  {record.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {record.tags.map((tagId) => {
                        const tag = getTagById(tagId);
                        return tag ? (
                          <View key={tagId} style={[styles.tag, { backgroundColor: tag.color + '20' }]}>
                            <Text style={[styles.tagText, { color: tag.color }]}>{tag.name}</Text>
                          </View>
                        ) : null;
                      })}
                    </View>
                  )}
                  {record.location && (
                    <View style={styles.locationContainer}>
                      <Text style={styles.locationLabel}>📍 位置情報</Text>
                      {record.location.address && (
                        <Text style={styles.locationAddress}>{record.location.address}</Text>
                      )}
                      <Text style={styles.locationCoords}>
                        {record.location.latitude.toFixed(6)}, {record.location.longitude.toFixed(6)}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    paddingLeft: 4,
  },
  recordItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordTime: {
    fontSize: 14,
    color: '#666',
  },
  recordCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordCountPositive: {
    color: '#4CAF50',
  },
  recordCountNegative: {
    color: '#F44336',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  locationContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    gap: 4,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  locationAddress: {
    fontSize: 12,
    color: '#333',
  },
  locationCoords: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
});
