import { CountRecord } from '../types';

/**
 * 期間計算ユーティリティ
 */

/**
 * 月累計（現在の月の1日から今日まで）
 */
export function getMonthToDate(): { start: string; end: string } {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * 過去Nか月間
 */
export function getLastMonths(months: number): { start: string; end: string } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setMonth(start.getMonth() - months);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * カスタム期間
 */
export function getCustomPeriod(startDate: string, endDate: string): { start: string; end: string } {
  return {
    start: startDate,
    end: endDate,
  };
}

/**
 * 統計計算ユーティリティ
 */

/**
 * 合計カウントを取得
 */
export function getTotalCount(records: CountRecord[]): number {
  return records.reduce((sum, record) => sum + record.count, 0);
}

/**
 * 平均カウントを取得（日別平均）
 */
export function getAverageCount(records: CountRecord[]): number {
  if (records.length === 0) return 0;
  const total = getTotalCount(records);
  const uniqueDays = new Set(records.map((r) => r.timestamp.split('T')[0])).size;
  return uniqueDays > 0 ? total / uniqueDays : 0;
}

/**
 * 最大カウント日を取得
 */
export function getMaxCountDay(records: CountRecord[]): { date: string; count: number } | null {
  if (records.length === 0) return null;

  const dailyCounts = getDailyCounts(records);
  let maxDate = '';
  let maxCount = -Infinity;

  Object.entries(dailyCounts).forEach(([date, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxDate = date;
    }
  });

  return maxDate ? { date: maxDate, count: maxCount } : null;
}

/**
 * 記録日数を取得
 */
export function getRecordDays(records: CountRecord[]): number {
  const uniqueDays = new Set(records.map((r) => r.timestamp.split('T')[0]));
  return uniqueDays.size;
}

/**
 * データグループ化ユーティリティ
 */

/**
 * 日付ごとにグループ化
 */
export function groupRecordsByDate(records: CountRecord[]): Record<string, CountRecord[]> {
  return records.reduce((acc, record) => {
    const date = record.timestamp.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, CountRecord[]>);
}

/**
 * 週ごとにグループ化
 */
export function groupRecordsByWeek(records: CountRecord[]): Record<string, CountRecord[]> {
  return records.reduce((acc, record) => {
    const date = new Date(record.timestamp);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split('T')[0];
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(record);
    return acc;
  }, {} as Record<string, CountRecord[]>);
}

/**
 * 月ごとにグループ化
 */
export function groupRecordsByMonth(records: CountRecord[]): Record<string, CountRecord[]> {
  return records.reduce((acc, record) => {
    const date = new Date(record.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(record);
    return acc;
  }, {} as Record<string, CountRecord[]>);
}

/**
 * タグごとにグループ化
 */
export function groupRecordsByTag(records: CountRecord[]): Record<string, CountRecord[]> {
  return records.reduce((acc, record) => {
    record.tags.forEach((tagId) => {
      if (!acc[tagId]) {
        acc[tagId] = [];
      }
      acc[tagId].push(record);
    });
    return acc;
  }, {} as Record<string, CountRecord[]>);
}

/**
 * カレンダー用ユーティリティ
 */

/**
 * 日付範囲でフィルタ
 */
export function getRecordsByDateRange(
  records: CountRecord[],
  startDate: string,
  endDate: string
): CountRecord[] {
  return records.filter(
    (record) => record.timestamp >= startDate && record.timestamp <= endDate
  );
}

/**
 * 記録がある日付のリストを取得
 */
export function getDatesWithRecords(records: CountRecord[]): string[] {
  const dates = new Set(records.map((r) => r.timestamp.split('T')[0]));
  return Array.from(dates).sort();
}

/**
 * 日別カウント集計
 */
export function getDailyCounts(records: CountRecord[]): Record<string, number> {
  return records.reduce((acc, record) => {
    const date = record.timestamp.split('T')[0];
    acc[date] = (acc[date] || 0) + record.count;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * タグ分析用ユーティリティ
 */

/**
 * 指定タグの記録を取得
 */
export function getRecordsByTags(records: CountRecord[], tagIds: string[]): CountRecord[] {
  if (tagIds.length === 0) return [];
  return records.filter((record) =>
    tagIds.some((tagId) => record.tags.includes(tagId))
  );
}

/**
 * タグでフィルタ（AND/OR条件）
 */
export function filterRecordsByTags(
  records: CountRecord[],
  tagIds: string[],
  matchAll: boolean = false
): CountRecord[] {
  if (tagIds.length === 0) return records;
  if (matchAll) {
    // AND条件：すべてのタグが含まれている
    return records.filter((record) =>
      tagIds.every((tagId) => record.tags.includes(tagId))
    );
  } else {
    // OR条件：いずれかのタグが含まれている
    return getRecordsByTags(records, tagIds);
  }
}

/**
 * 複数タグの比較統計
 */
export function compareTagStatistics(
  records: CountRecord[],
  tagIds: string[],
  startDate: string,
  endDate: string
): Array<{ tagId: string; statistics: any }> {
  const filteredRecords = getRecordsByDateRange(records, startDate, endDate);
  
  return tagIds.map((tagId) => {
    const tagRecords = filteredRecords.filter((r) => r.tags.includes(tagId));
    return {
      tagId,
      statistics: {
        totalCount: getTotalCount(tagRecords),
        averageCount: getAverageCount(tagRecords),
        recordDays: getRecordDays(tagRecords),
        recordCount: tagRecords.length,
      },
    };
  });
}
