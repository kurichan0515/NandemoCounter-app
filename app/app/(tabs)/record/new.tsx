import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCounter } from '../../../contexts/CounterContext';
import { InputMethod } from '../../../types';
import { useCountRecord } from '../../../hooks/useCountRecord';
import InputMethodSelector from '../../../components/common/InputMethodSelector';
import CountInput from '../../../components/common/CountInput';
import TagSelector from '../../../components/common/TagSelector';
import DateTimeSelector from '../../../components/common/DateTimeSelector';
import LocationSelector from '../../../components/common/LocationSelector';

export default function NewRecordScreen() {
  const router = useRouter();
  const { counters, tags } = useCounter();
  const { createRecord } = useCountRecord();

  const [selectedCounterId, setSelectedCounterId] = useState('');
  const [inputMethod, setInputMethod] = useState<InputMethod>('button');
  const [count, setCount] = useState(1);
  const [directInputValue, setDirectInputValue] = useState('');
  const [selectedTags, setSelectedTagIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const [useLocation, setUseLocation] = useState(false);

  const handleCreate = async () => {
    const success = await createRecord({
      counterId: selectedCounterId,
      count,
      directValue: directInputValue,
      tags: selectedTags,
      timestamp: useCustomDate ? selectedDate.toISOString() : undefined,
      inputMethod,
      location: useLocation && location ? location : undefined,
    });

    if (success) {
      router.back();
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>カウンター *</Text>
        {counters.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>カウンターがありません</Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push('/(tabs)/counter/new')}
            >
              <Text style={styles.linkButtonText}>カウンターを作成</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.pickerContainer}>
            {counters.map((counter) => (
              <TouchableOpacity
                key={counter.id}
                style={[
                  styles.counterOption,
                  selectedCounterId === counter.id && styles.counterOptionSelected,
                ]}
                onPress={() => setSelectedCounterId(counter.id)}
              >
                <Text
                  style={[
                    styles.counterOptionText,
                    selectedCounterId === counter.id && styles.counterOptionTextSelected,
                  ]}
                >
                  {counter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>入力方法</Text>
        <InputMethodSelector value={inputMethod} onChange={setInputMethod} />

        <Text style={styles.label}>カウント値</Text>
        <CountInput
          method={inputMethod}
          count={count}
          directValue={directInputValue}
          onCountChange={setCount}
          onDirectValueChange={setDirectInputValue}
          onIncrement={() => setCount((prev) => prev + 1)}
          onDecrement={() => setCount((prev) => Math.max(0, prev - 1))}
        />

        <Text style={styles.label}>日時</Text>
        <DateTimeSelector
          value={selectedDate}
          onChange={setSelectedDate}
          useCustomDate={useCustomDate}
          onToggleCustomDate={() => setUseCustomDate(!useCustomDate)}
          maxDate={new Date()}
        />

        <Text style={styles.label}>位置情報（オプション）</Text>
        <LocationSelector
          value={location}
          enabled={useLocation}
          onChange={setLocation}
          onEnabledChange={setUseLocation}
        />

        <Text style={styles.label}>タグ（オプション）</Text>
        <TagSelector tags={tags} selectedTagIds={selectedTags} onToggle={toggleTag} />

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>記録を追加</Text>
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  linkButton: {
    padding: 8,
  },
  linkButtonText: {
    color: '#2196F3',
    fontSize: 14,
  },
  pickerContainer: {
    gap: 8,
  },
  counterOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  counterOptionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  counterOptionText: {
    fontSize: 16,
    color: '#333',
  },
  counterOptionTextSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
