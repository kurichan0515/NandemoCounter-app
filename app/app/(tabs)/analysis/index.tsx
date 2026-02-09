import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCounter } from '../../../contexts/CounterContext';
import { sortTagsByFrequency } from '../../../utils/tag';

export default function TagSelectionScreen() {
  const router = useRouter();
  const { tags, records } = useCounter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'frequency' | 'name' | 'created'>('frequency');

  // 頻度順でソート
  const sortedTags = useMemo(() => {
    return sortTagsByFrequency(tags, records, sortOrder);
  }, [tags, records, sortOrder]);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleAnalyze = () => {
    if (selectedTags.length === 0) {
      return;
    }
    // 最初のタグIDをパラメータとして渡す（複数タグは後で実装）
    router.push(`/(tabs)/analysis/tag/${selectedTags[0]}?tags=${selectedTags.join(',')}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>タグ分析</Text>
          <Text style={styles.subtitle}>分析したいタグを選択してください</Text>
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>並び順:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortButton, sortOrder === 'frequency' && styles.sortButtonSelected]}
              onPress={() => setSortOrder('frequency')}
            >
              <Text style={[styles.sortButtonText, sortOrder === 'frequency' && styles.sortButtonTextSelected]}>
                頻度順
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortOrder === 'name' && styles.sortButtonSelected]}
              onPress={() => setSortOrder('name')}
            >
              <Text style={[styles.sortButtonText, sortOrder === 'name' && styles.sortButtonTextSelected]}>
                名前順
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortOrder === 'created' && styles.sortButtonSelected]}
              onPress={() => setSortOrder('created')}
            >
              <Text style={[styles.sortButtonText, sortOrder === 'created' && styles.sortButtonTextSelected]}>
                作成日順
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {sortedTags.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>タグがありません</Text>
          </View>
        ) : (
          <View style={styles.tagsContainer}>
            {sortedTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[
                    styles.tagCard,
                    isSelected && styles.tagCardSelected,
                    { borderLeftColor: tag.color },
                  ]}
                  onPress={() => toggleTag(tag.id)}
                >
                  <View style={styles.tagContent}>
                    <View style={[styles.tagColorIndicator, { backgroundColor: tag.color }]} />
                    <View style={styles.tagInfo}>
                      <Text style={styles.tagName}>{tag.name}</Text>
                      <Text style={styles.tagMeta}>
                        {records.filter((r) => r.tags.includes(tag.id)).length}回使用
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {selectedTags.length > 0 && (
          <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
            <Text style={styles.analyzeButtonText}>
              分析開始 ({selectedTags.length}個のタグ)
            </Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  sortContainer: {
    marginBottom: 20,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  sortButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#333',
  },
  sortButtonTextSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  tagsContainer: {
    gap: 12,
  },
  tagCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tagCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagColorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  tagInfo: {
    flex: 1,
  },
  tagName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tagMeta: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analyzeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
