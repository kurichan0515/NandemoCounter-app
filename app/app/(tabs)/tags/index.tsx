import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCounter } from '../../../contexts/CounterContext';
import { generateTagColor } from '../../../utils/tag';
import ErrorScreen from '../../../components/common/ErrorScreen';

export default function TagsScreen() {
  const router = useRouter();
  const { tags, createTag, deleteTag } = useCounter();
  const [sortOrder, setSortOrder] = useState<'name' | 'created'>('name');

  const sortedTags = [...tags].sort((a, b) => {
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  const handleCreateTag = async () => {
    router.push('/(tabs)/tags/new');
  };

  const handleDeleteTag = (tagId: string, tagName: string) => {
    Alert.alert(
      '削除',
      `タグ「${tagName}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTag(tagId);
            } catch (error) {
              Alert.alert('エラー', 'タグの削除に失敗しました');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>タグ管理</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateTag}>
            <Text style={styles.createButtonText}>タグを作成</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>並び順:</Text>
          <View style={styles.sortButtons}>
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
            <Text style={styles.emptySubText}>新しいタグを作成してください</Text>
          </View>
        ) : (
          <View style={styles.tagsContainer}>
            {sortedTags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={styles.tagCard}
                onPress={() => router.push(`/(tabs)/tags/${tag.id}`)}
              >
                <View style={styles.tagContent}>
                  <View style={[styles.tagColorIndicator, { backgroundColor: tag.color }]} />
                  <View style={styles.tagInfo}>
                    <Text style={styles.tagName}>{tag.name}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTag(tag.id, tag.name)}
                  >
                    <Text style={styles.deleteButtonText}>削除</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
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
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 14,
  },
});
