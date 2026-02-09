import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useCounter } from '../contexts/CounterContext';
import { getCurrentTimestamp } from '../utils/date';
import { InputMethod } from '../types';
import { validateNumber, validateCounterId } from '../utils/validation';
import { useAdDisplay } from './useAdDisplay';

interface CreateRecordParams {
  counterId: string;
  count?: number;
  directValue?: string;
  tags?: string[];
  timestamp?: string;
  inputMethod?: InputMethod;
  location?: { latitude: number; longitude: number; address?: string };
}

/**
 * カウント記録作成のカスタムフック
 */
export function useCountRecord() {
  const { addCountRecord } = useCounter();
  const { handleAdDisplay } = useAdDisplay();

  const createRecord = useCallback(
    async (params: CreateRecordParams) => {
      // バリデーション
      const counterValidation = validateCounterId(params.counterId);
      if (!counterValidation.isValid) {
        Alert.alert('エラー', counterValidation.error);
        return false;
      }

      let finalCount: number;
      if (params.inputMethod === 'direct' && params.directValue !== undefined) {
        const numberValidation = validateNumber(params.directValue);
        if (!numberValidation.isValid) {
          Alert.alert('エラー', numberValidation.error);
          return false;
        }
        finalCount = numberValidation.value!;
      } else {
        finalCount = params.count ?? 1;
      }

      try {
        await addCountRecord(
          params.counterId,
          finalCount,
          params.tags ?? [],
          params.timestamp ?? getCurrentTimestamp(),
          params.inputMethod ?? 'button',
          params.location
        );

        // 広告表示
        await handleAdDisplay();

        return true;
      } catch (error) {
        Alert.alert('エラー', '記録の作成に失敗しました');
        console.error(error);
        return false;
      }
    },
    [addCountRecord, handleAdDisplay]
  );

  return { createRecord };
}
