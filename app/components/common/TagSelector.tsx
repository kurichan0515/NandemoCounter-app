import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tag } from '../../types';

interface TagSelectorProps {
  tags: Tag[];
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
}

export default function TagSelector({ tags, selectedTagIds, onToggle }: TagSelectorProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tagsContainer}>
        {tags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagButton,
                isSelected && styles.tagButtonSelected,
                { backgroundColor: isSelected ? tag.color : '#fff' },
              ]}
              onPress={() => onToggle(tag.id)}
            >
              <Text
                style={[
                  styles.tagButtonText,
                  isSelected && styles.tagButtonTextSelected,
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tagButtonSelected: {
    borderColor: '#333',
  },
  tagButtonText: {
    fontSize: 14,
    color: '#333',
  },
  tagButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
