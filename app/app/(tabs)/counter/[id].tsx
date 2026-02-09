import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCounter } from '../../../contexts/CounterContext';
import { InputMethod } from '../../../types';
import { useCountRecord } from '../../../hooks/useCountRecord';
import ErrorScreen from '../../../components/common/ErrorScreen';
import InputMethodSelector from '../../../components/common/InputMethodSelector';
import CountInput from '../../../components/common/CountInput';

export default function CounterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getCounterById,
    calculateCounterCurrentCount,
    deleteCounter,
    getRecordsByCounterId,
  } = useCounter();
  const { createRecord } = useCountRecord();

  const counter = getCounterById(id);
  const currentCount = counter ? calculateCounterCurrentCount(counter.id) : 0;
  const records = counter ? getRecordsByCounterId(counter.id) : [];

  const [inputMethod, setInputMethod] = useState<InputMethod>('button');
  const [count, setCount] = useState(1);
  const [directInputValue, setDirectInputValue] = useState('');

  if (!counter) {
    return <ErrorScreen message="カウンターが見つかりません" />;
  }

  const handleIncrement = async () => {
    const success = await createRecord({
      counterId: counter.id,
      count: 1,
      inputMethod: 'button',
    });
    if (success) {
      setCount(1);
    }
  };

  const handleDecrement = async () => {
    const success = await createRecord({
      counterId: counter.id,
      count: -1,
      inputMethod: 'button',
    });
    if (success) {
      setCount(1);
    }
  };

  const handleReset = async () => {
    Alert.alert(
      'リセット',
      'カウントを0にリセットしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセット',
          style: 'destructive',
          onPress: async () => {
            await createRecord({
              counterId: counter.id,
              count: -currentCount,
              inputMethod: 'button',
            });
          },
        },
      ]
    );
  };

  const handleDirectInput = async () => {
    const success = await createRecord({
      counterId: counter.id,
      directValue: directInputValue,
      inputMethod: 'direct',
    });
    if (success) {
      setDirectInputValue('');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      '削除',
      'このカウンターを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCounter(counter.id);
              router.back();
            } catch (error) {
              Alert.alert('エラー', '削除に失敗しました');
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
          <Text style={styles.counterName}>{counter.name}</Text>
          {counter.description && (
            <Text style={styles.counterDescription}>{counter.description}</Text>
          )}
          <Text style={styles.currentCount}>{currentCount}</Text>
        </View>

        <Text style={styles.label}>入力方法</Text>
        <InputMethodSelector value={inputMethod} onChange={setInputMethod} />

        {inputMethod === 'button' ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.decrementButton]} onPress={handleDecrement}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
              <Text style={styles.buttonText}>リセット</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.incrementButton]} onPress={handleIncrement}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.directInputContainer}>
            <CountInput
              method="direct"
              count={0}
              directValue={directInputValue}
              onCountChange={() => {}}
              onDirectValueChange={setDirectInputValue}
              onIncrement={() => {}}
              onDecrement={() => {}}
            />
            <TouchableOpacity style={styles.directInputButton} onPress={handleDirectInput}>
              <Text style={styles.directInputButtonText}>確定</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>記録数: {records.length}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/(tabs)/history/${counter.id}`)}
          >
            <Text style={styles.actionButtonText}>履歴を見る</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>削除</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    paddingVertical: 40,
  },
  counterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  counterDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  currentCount: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 32,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incrementButton: {
    backgroundColor: '#4CAF50',
  },
  decrementButton: {
    backgroundColor: '#F44336',
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  directInputContainer: {
    gap: 12,
    marginVertical: 32,
  },
  directInputButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  directInputButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  deleteButtonText: {
    color: '#F44336',
  },
});
