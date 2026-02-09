import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { InputMethod } from '../../types';

interface InputMethodSelectorProps {
  value: InputMethod;
  onChange: (method: InputMethod) => void;
}

export default function InputMethodSelector({ value, onChange }: InputMethodSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, value === 'button' && styles.buttonSelected]}
        onPress={() => onChange('button')}
      >
        <Text style={[styles.buttonText, value === 'button' && styles.buttonTextSelected]}>
          ボタン操作
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, value === 'direct' && styles.buttonSelected]}
        onPress={() => onChange('direct')}
      >
        <Text style={[styles.buttonText, value === 'direct' && styles.buttonTextSelected]}>
          直接入力
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  buttonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  buttonTextSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
});
