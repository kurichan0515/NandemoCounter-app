import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCounter } from '../../../contexts/CounterContext';
import { getDefaultTagColors } from '../../../utils/tag';
import { validateRequired } from '../../../utils/validation';
import ErrorScreen from '../../../components/common/ErrorScreen';

export default function EditTagScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTagById, updateTag } = useCounter();

  const tag = id ? getTagById(id) : null;
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setSelectedColor(tag.color);
    }
  }, [tag]);

  if (!tag) {
    return <ErrorScreen message="タグが見つかりません" />;
  }

  const handleUpdate = async () => {
    const validation = validateRequired(name, 'タグ名');
    if (!validation.isValid) {
      Alert.alert('エラー', validation.error);
      return;
    }

    try {
      await updateTag(tag.id, {
        name: name.trim(),
        color: selectedColor,
      });
      router.back();
    } catch (error) {
      Alert.alert('エラー', 'タグの更新に失敗しました');
      console.error(error);
    }
  };

  const colors = getDefaultTagColors();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>タグ名 *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="例: 運動"
          autoFocus
        />

        <Text style={styles.label}>色</Text>
        <View style={styles.colorContainer}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                selectedColor === color && styles.colorOptionSelected,
                { backgroundColor: color },
              ]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>更新</Text>
        </TouchableOpacity>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#333',
  },
  checkmark: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
