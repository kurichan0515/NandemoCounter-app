import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useCounter } from '../../../../contexts/CounterContext';
import {
  getMonthToDate,
  getLastMonths,
  getRecordsByDateRange,
  filterRecordsByTags,
  getTotalCount,
  getAverageCount,
  getMaxCountDay,
  getRecordDays,
  getDailyCounts,
  groupRecordsByWeek,
  groupRecordsByMonth,
  compareTagStatistics,
} from '../../../../utils/analysis';
import { formatDate } from '../../../../utils/date';

const screenWidth = Dimensions.get('window').width;

export default function TagAnalysisScreen() {
  const router = useRouter();
  const { tagId, tags } = useLocalSearchParams<{ tagId: string; tags?: string }>();
  const { records, getTagById } = useCounter();

  const selectedTagIds = tags ? tags.split(',') : [tagId];
  const [period, setPeriod] = useState<'month' | '3months' | '6months' | '12months'>('month');
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  // 期間を計算
  const dateRange = useMemo(() => {
    switch (period) {
      case 'month':
        return getMonthToDate();
      case '3months':
        return getLastMonths(3);
      case '6months':
        return getLastMonths(6);
      case '12months':
        return getLastMonths(12);
      default:
        return getMonthToDate();
    }
  }, [period]);

  // 期間内の記録をフィルタ
  const filteredRecords = useMemo(() => {
    const rangeRecords = getRecordsByDateRange(records, dateRange.start, dateRange.end);
    return filterRecordsByTags(rangeRecords, selectedTagIds, false);
  }, [records, dateRange, selectedTagIds]);

  // 統計情報
  const statistics = useMemo(() => {
    return {
      totalCount: getTotalCount(filteredRecords),
      averageCount: getAverageCount(filteredRecords),
      maxCountDay: getMaxCountDay(filteredRecords),
      recordDays: getRecordDays(filteredRecords),
      recordCount: filteredRecords.length,
    };
  }, [filteredRecords]);

  // グラフデータの準備
  const chartData = useMemo(() => {
    if (period === 'month' || period === '3months') {
      // 日別集計（棒グラフ）
      const dailyCounts = getDailyCounts(filteredRecords);
      const sortedDates = Object.keys(dailyCounts).sort();
      return {
        labels: sortedDates.map((d) => formatDate(d).split('/').slice(1).join('/')),
        datasets: [
          {
            data: sortedDates.map((d) => dailyCounts[d] || 0),
          },
        ],
      };
    } else if (period === '6months') {
      // 週別集計（折れ線グラフ）
      const weeklyCounts = groupRecordsByWeek(filteredRecords);
      const sortedWeeks = Object.keys(weeklyCounts).sort();
      return {
        labels: sortedWeeks.map((w) => formatDate(w).split('/').slice(1).join('/')),
        datasets: [
          {
            data: sortedWeeks.map((w) =>
              weeklyCounts[w].reduce((sum, r) => sum + r.count, 0)
            ),
          },
        ],
      };
    } else {
      // 月別集計（折れ線グラフ）
      const monthlyCounts = groupRecordsByMonth(filteredRecords);
      const sortedMonths = Object.keys(monthlyCounts).sort();
      return {
        labels: sortedMonths,
        datasets: [
          {
            data: sortedMonths.map((m) =>
              monthlyCounts[m].reduce((sum, r) => sum + r.count, 0)
            ),
          },
        ],
      };
    }
  }, [filteredRecords, period]);

  // カレンダー用のマーキングデータ
  const markedDates = useMemo(() => {
    const dailyCounts = getDailyCounts(filteredRecords);
    const marked: any = {};
    Object.keys(dailyCounts).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: '#2196F3',
        selected: date === selectedDate,
        selectedColor: '#2196F3',
      };
    });
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#2196F3',
      };
    }
    return marked;
  }, [filteredRecords, selectedDate]);

  const selectedTags = selectedTagIds
    .map((id) => getTagById(id))
    .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← 戻る</Text>
          </TouchableOpacity>
          <Text style={styles.title}>タグ分析</Text>
          <View style={styles.selectedTags}>
            {selectedTags.map((tag) => (
              <View key={tag.id} style={[styles.tagBadge, { backgroundColor: tag.color }]}>
                <Text style={styles.tagBadgeText}>{tag.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 期間選択 */}
        <View style={styles.periodContainer}>
          <Text style={styles.sectionTitle}>期間選択</Text>
          <View style={styles.periodButtons}>
            {[
              { key: 'month', label: '月累計' },
              { key: '3months', label: '3か月' },
              { key: '6months', label: '6か月' },
              { key: '12months', label: '12か月' },
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[styles.periodButton, period === key && styles.periodButtonSelected]}
                onPress={() => setPeriod(key as any)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    period === key && styles.periodButtonTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 統計情報 */}
        <View style={styles.statisticsContainer}>
          <Text style={styles.sectionTitle}>統計情報</Text>
          <View style={styles.statisticsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{statistics.totalCount}</Text>
              <Text style={styles.statLabel}>合計カウント</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{statistics.averageCount.toFixed(1)}</Text>
              <Text style={styles.statLabel}>平均（日別）</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{statistics.recordDays}</Text>
              <Text style={styles.statLabel}>記録日数</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{statistics.recordCount}</Text>
              <Text style={styles.statLabel}>記録数</Text>
            </View>
          </View>
          {statistics.maxCountDay && (
            <View style={styles.maxDayCard}>
              <Text style={styles.maxDayLabel}>最大カウント日</Text>
              <Text style={styles.maxDayDate}>{formatDate(statistics.maxCountDay.date)}</Text>
              <Text style={styles.maxDayCount}>{statistics.maxCountDay.count}</Text>
            </View>
          )}
        </View>

        {/* カレンダー */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>カレンダー</Text>
          <Calendar
            markedDates={markedDates}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            theme={{
              selectedDayBackgroundColor: '#2196F3',
              todayTextColor: '#2196F3',
              arrowColor: '#2196F3',
            }}
          />
        </View>

        {/* グラフ */}
        {chartData.labels.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>グラフ</Text>
            {period === 'month' || period === '3months' ? (
              <BarChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={styles.chart}
              />
            ) : (
              <LineChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={styles.chart}
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  periodContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  periodButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#333',
  },
  periodButtonTextSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
  statisticsContainer: {
    marginBottom: 24,
  },
  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  maxDayCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  maxDayLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  maxDayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  maxDayCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  calendarContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
