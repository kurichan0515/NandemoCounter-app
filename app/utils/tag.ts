import { Tag, CountRecord } from '../types';

/**
 * デフォルトのタグカラー一覧
 */
export function getDefaultTagColors(): string[] {
  return [
    '#FF6B6B', // 赤
    '#4ECDC4', // 青緑
    '#45B7D1', // 青
    '#FFA07A', // オレンジ
    '#98D8C8', // ミント
    '#F7DC6F', // 黄
    '#BB8FCE', // 紫
    '#85C1E2', // 水色
    '#F8B88B', // ピーチ
    '#82E0AA', // 緑
  ];
}

/**
 * ランダムなタグカラーを生成
 */
export function generateTagColor(): string {
  const colors = getDefaultTagColors();
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * タグの使用頻度を計算
 */
export function calculateTagFrequency(
  records: CountRecord[],
  tags: Tag[]
): Array<{ tag: Tag; count: number; lastUsed?: string }> {
  const tagFrequencyMap = new Map<string, { count: number; lastUsed?: string }>();

  // 各記録のタグをカウント
  records.forEach((record) => {
    record.tags.forEach((tagId) => {
      const existing = tagFrequencyMap.get(tagId) || { count: 0 };
      tagFrequencyMap.set(tagId, {
        count: existing.count + 1,
        lastUsed: existing.lastUsed
          ? existing.lastUsed > record.timestamp
            ? existing.lastUsed
            : record.timestamp
          : record.timestamp,
      });
    });
  });

  // タグ情報と頻度を結合
  return tags.map((tag) => {
    const frequency = tagFrequencyMap.get(tag.id) || { count: 0 };
    return {
      tag,
      count: frequency.count,
      lastUsed: frequency.lastUsed,
    };
  });
}

/**
 * タグを頻度順、名前順、作成日順でソート
 */
export function sortTagsByFrequency(
  tags: Tag[],
  records: CountRecord[],
  sortOrder: 'frequency' | 'name' | 'created'
): Tag[] {
  const frequencyData = calculateTagFrequency(records, tags);

  switch (sortOrder) {
    case 'frequency':
      return [...tags].sort((a, b) => {
        const freqA = frequencyData.find((f) => f.tag.id === a.id)?.count || 0;
        const freqB = frequencyData.find((f) => f.tag.id === b.id)?.count || 0;
        return freqB - freqA; // 降順
      });
    case 'name':
      return [...tags].sort((a, b) => a.name.localeCompare(b.name));
    case 'created':
      return [...tags].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    default:
      return tags;
  }
}
