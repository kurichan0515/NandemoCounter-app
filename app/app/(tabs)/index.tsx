import React from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useCounter } from '../../contexts/CounterContext';
import { formatDate, isToday } from '../../utils/date';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT } from '../../constants/theme';
import { CounterCard } from '../../components/common/CounterCard';
import { Button } from '../../components/common/Button';
import BannerAd from '../../components/BannerAd';

export default function MainScreen() {
  const router = useRouter();
  const { counters, records, loading, calculateCounterCurrentCount } = useCounter();
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary.main} />
        </View>
      </SafeAreaView>
    );
  }

  const todayRecords = records.filter((r) => isToday(r.timestamp));

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>なんでもカウンター</Text>
        <Text style={styles.headerDate}>{today}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* コンテンツエリア */}
        {counters.length > 0 ? (
          counters.map((counter) => {
            const currentCount = calculateCounterCurrentCount(counter.id);
            const todayCount = todayRecords
              .filter((r) => r.counterId === counter.id)
              .reduce((sum, r) => sum + r.count, 0);

            return (
              <CounterCard
                key={counter.id}
                name={counter.name}
                count={currentCount}
                todayCount={todayCount}
                description={counter.description}
                onPress={() => router.push(`/(tabs)/counter/${counter.id}`)}
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>カウンターがありません</Text>
            <Text style={styles.emptySubText}>新しいカウンターを作成してください</Text>
          </View>
        )}

        {/* 広告エリア */}
        <View style={styles.adContainer}>
          <BannerAd />
        </View>
      </ScrollView>

      {/* フッター（アクションボタンエリア） */}
      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title="カウンター作成"
              onPress={() => router.push('/(tabs)/counter/new')}
              variant="primary"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="記録を追加"
              onPress={() => router.push('/(tabs)/record/new')}
              variant="primary"
            />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title="タグ分析"
              onPress={() => router.push('/(tabs)/analysis')}
              variant="secondary"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="タグ管理"
              onPress={() => router.push('/(tabs)/tags')}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.main,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    color: COLORS.primary.main,
    marginBottom: SPACING.xs,
  },
  headerDate: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 100, // フッター分の余白
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.placeholder,
    marginTop: SPACING.sm,
  },
  adContainer: {
    marginVertical: SPACING.lg,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
});
