import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tag, Counter, CountRecord, InputMethod } from '../types';
import { storageService } from '../services/storage';
import { generateUUID } from '../utils/uuid';
import { getCurrentTimestamp } from '../utils/date';

interface CounterContextType {
  // 状態
  deviceId: string | null;
  tags: Tag[];
  counters: Counter[];
  records: CountRecord[];
  loading: boolean;

  // タグ操作
  createTag: (name: string, color: string) => Promise<void>;
  updateTag: (id: string, tag: Partial<Tag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;

  // カウンター操作
  createCounter: (name: string, description?: string) => Promise<void>;
  updateCounter: (id: string, counter: Partial<Counter>) => Promise<void>;
  deleteCounter: (id: string) => Promise<void>;

  // カウント操作（記録作成）
  addCountRecord: (
    counterId: string,
    count: number,
    tags: string[],
    timestamp?: string,
    inputMethod?: InputMethod,
    location?: { latitude: number; longitude: number; address?: string }
  ) => Promise<void>;

  // 記録操作
  updateRecord: (id: string, record: Partial<CountRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;

  // クエリ関数
  getCounterById: (id: string) => Counter | undefined;
  getTagById: (id: string) => Tag | undefined;
  getRecordsByCounterId: (counterId: string) => CountRecord[];
  getRecordsByTagId: (tagId: string) => CountRecord[];
  getRecordsByDateRange: (startDate: string, endDate: string) => CountRecord[];
  calculateCounterCurrentCount: (counterId: string) => number;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [records, setRecords] = useState<CountRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 初期化
  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await storageService.loadAllData();
        setDeviceId(data.deviceId);
        setTags(data.tags);
        setCounters(data.counters);
        setRecords(data.records);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // タグ操作
  const createTag = useCallback(async (name: string, color: string) => {
    if (!deviceId) return;

    const newTag: Tag = {
      id: generateUUID(),
      name,
      color,
      createdAt: getCurrentTimestamp(),
      deviceId,
    };

    await storageService.addTag(newTag);
    setTags((prev) => [...prev, newTag]);
  }, [deviceId]);

  const updateTag = useCallback(async (id: string, tag: Partial<Tag>) => {
    await storageService.updateTag(id, tag);
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, ...tag } : t)));
  }, []);

  const deleteTag = useCallback(async (id: string) => {
    await storageService.deleteTag(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // カウンター操作
  const createCounter = useCallback(async (name: string, description?: string) => {
    if (!deviceId) return;

    const newCounter: Counter = {
      id: generateUUID(),
      name,
      description,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      deviceId,
    };

    await storageService.addCounter(newCounter);
    setCounters((prev) => [...prev, newCounter]);
  }, [deviceId]);

  const updateCounter = useCallback(async (id: string, counter: Partial<Counter>) => {
    const updatedCounter = {
      ...counter,
      updatedAt: getCurrentTimestamp(),
    };
    await storageService.updateCounter(id, updatedCounter);
    setCounters((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedCounter } : c)));
  }, []);

  const deleteCounter = useCallback(async (id: string) => {
    await storageService.deleteCounter(id);
    setCounters((prev) => prev.filter((c) => c.id !== id));
    // 関連する記録も削除（オプション：孤立記録として保持する場合は削除しない）
    const relatedRecords = records.filter((r) => r.counterId === id);
    for (const record of relatedRecords) {
      await storageService.deleteRecord(record.id);
    }
    setRecords((prev) => prev.filter((r) => r.counterId !== id));
  }, [records]);

  // カウント操作（記録作成）
  const addCountRecord = useCallback(async (
    counterId: string,
    count: number,
    tags: string[],
    timestamp?: string,
    inputMethod: InputMethod = 'button',
    location?: { latitude: number; longitude: number; address?: string }
  ) => {
    if (!deviceId) return;

    const counter = counters.find((c) => c.id === counterId);
    if (!counter) return;

    const newRecord: CountRecord = {
      id: generateUUID(),
      counterId,
      counterName: counter.name, // スナップショット
      count,
      timestamp: timestamp || getCurrentTimestamp(),
      tags,
      location,
      deviceId,
      inputMethod,
    };

    await storageService.addRecord(newRecord);
    setRecords((prev) => [...prev, newRecord]);
  }, [deviceId, counters]);

  // 記録操作
  const updateRecord = useCallback(async (id: string, record: Partial<CountRecord>) => {
    await storageService.updateRecord(id, record);
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...record } : r)));
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    await storageService.deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // クエリ関数
  const getCounterById = useCallback((id: string) => {
    return counters.find((c) => c.id === id);
  }, [counters]);

  const getTagById = useCallback((id: string) => {
    return tags.find((t) => t.id === id);
  }, [tags]);

  const getRecordsByCounterId = useCallback((counterId: string) => {
    return records.filter((r) => r.counterId === counterId);
  }, [records]);

  const getRecordsByTagId = useCallback((tagId: string) => {
    return records.filter((r) => r.tags.includes(tagId));
  }, [records]);

  const getRecordsByDateRange = useCallback((startDate: string, endDate: string) => {
    return records.filter((r) => r.timestamp >= startDate && r.timestamp <= endDate);
  }, [records]);

  const calculateCounterCurrentCount = useCallback((counterId: string) => {
    const counterRecords = records.filter((r) => r.counterId === counterId);
    return counterRecords.reduce((sum, record) => sum + record.count, 0);
  }, [records]);

  const value: CounterContextType = {
    deviceId,
    tags,
    counters,
    records,
    loading,
    createTag,
    updateTag,
    deleteTag,
    createCounter,
    updateCounter,
    deleteCounter,
    addCountRecord,
    updateRecord,
    deleteRecord,
    getCounterById,
    getTagById,
    getRecordsByCounterId,
    getRecordsByTagId,
    getRecordsByDateRange,
    calculateCounterCurrentCount,
  };

  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
}

export function useCounter() {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
}
