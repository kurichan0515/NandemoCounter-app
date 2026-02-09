import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateTime } from '../../utils/date';

interface DateTimeSelectorProps {
  value: Date;
  onChange: (date: Date) => void;
  useCustomDate: boolean;
  onToggleCustomDate: () => void;
  maxDate?: Date;
}

export default function DateTimeSelector({
  value,
  onChange,
  useCustomDate,
  onToggleCustomDate,
  maxDate,
}: DateTimeSelectorProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (date) {
      onChange(date);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggle} onPress={onToggleCustomDate}>
        <Text style={styles.toggleText}>
          {useCustomDate ? '✓ 過去の日時を指定' : '○ 現在の日時を使用'}
        </Text>
      </TouchableOpacity>
      {useCustomDate && (
        <>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateButtonText}>{formatDateTime(value.toISOString())}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={value}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={maxDate}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  toggle: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleText: {
    fontSize: 14,
    color: '#333',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
  },
});
