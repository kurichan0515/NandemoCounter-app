import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { InputMethod } from '../../types';

interface CountInputProps {
  method: InputMethod;
  count: number;
  directValue: string;
  onCountChange: (count: number) => void;
  onDirectValueChange: (value: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function CountInput({
  method,
  count,
  directValue,
  onCountChange,
  onDirectValueChange,
  onIncrement,
  onDecrement,
}: CountInputProps) {
  if (method === 'button') {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onDecrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{count}</Text>
        <TouchableOpacity style={styles.button} onPress={onIncrement}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.directContainer}>
      <TextInput
        style={styles.input}
        value={directValue}
        onChangeText={onDirectValueChange}
        placeholder="数値を入力"
        keyboardType="numeric"
        autoFocus
      />
      <Text style={styles.hint}>
        {directValue ? `値: ${parseInt(directValue, 10) || 0}` : '数値を入力してください'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 20,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 60,
    textAlign: 'center',
  },
  directContainer: {
    gap: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
