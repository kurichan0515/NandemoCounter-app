import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tag, Counter, CountRecord, StorageData } from '../types';
import { generateUUID } from '../utils/uuid';

const STORAGE_KEYS = {
  DEVICE_ID: '@nandemo_counter:deviceId',
  TAGS: '@nandemo_counter:tags',
  COUNTERS: '@nandemo_counter:counters',
  RECORDS: '@nandemo_counter:records',
};

/**
 * AsyncStorageを使用したローカルストレージサービス
 */
class StorageService {
  /**
   * デバイスIDを取得（存在しない場合は生成して保存）
   */
  async getDeviceId(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
      if (!deviceId) {
        deviceId = generateUUID();
        await this.saveDeviceId(deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error('Failed to get device ID:', error);
      // エラー時も新しいIDを生成して返す
      const deviceId = generateUUID();
      await this.saveDeviceId(deviceId);
      return deviceId;
    }
  }

  /**
   * デバイスIDを保存
   */
  async saveDeviceId(id: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
    } catch (error) {
      console.error('Failed to save device ID:', error);
      throw error;
    }
  }

  /**
   * タグ一覧を取得
   */
  async getTags(): Promise<Tag[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TAGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get tags:', error);
      return [];
    }
  }

  /**
   * タグ一覧を保存
   */
  async saveTags(tags: Tag[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    } catch (error) {
      console.error('Failed to save tags:', error);
      throw error;
    }
  }

  /**
   * タグを追加
   */
  async addTag(tag: Tag): Promise<void> {
    const tags = await this.getTags();
    tags.push(tag);
    await this.saveTags(tags);
  }

  /**
   * タグを更新
   */
  async updateTag(id: string, tag: Partial<Tag>): Promise<void> {
    const tags = await this.getTags();
    const index = tags.findIndex((t) => t.id === id);
    if (index !== -1) {
      tags[index] = { ...tags[index], ...tag };
      await this.saveTags(tags);
    }
  }

  /**
   * タグを削除
   */
  async deleteTag(id: string): Promise<void> {
    const tags = await this.getTags();
    const filteredTags = tags.filter((t) => t.id !== id);
    await this.saveTags(filteredTags);
  }

  /**
   * カウンター一覧を取得
   */
  async getCounters(): Promise<Counter[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COUNTERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get counters:', error);
      return [];
    }
  }

  /**
   * カウンター一覧を保存
   */
  async saveCounters(counters: Counter[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
    } catch (error) {
      console.error('Failed to save counters:', error);
      throw error;
    }
  }

  /**
   * カウンターを追加
   */
  async addCounter(counter: Counter): Promise<void> {
    const counters = await this.getCounters();
    counters.push(counter);
    await this.saveCounters(counters);
  }

  /**
   * カウンターを更新
   */
  async updateCounter(id: string, counter: Partial<Counter>): Promise<void> {
    const counters = await this.getCounters();
    const index = counters.findIndex((c) => c.id === id);
    if (index !== -1) {
      counters[index] = { ...counters[index], ...counter };
      await this.saveCounters(counters);
    }
  }

  /**
   * カウンターを削除
   */
  async deleteCounter(id: string): Promise<void> {
    const counters = await this.getCounters();
    const filteredCounters = counters.filter((c) => c.id !== id);
    await this.saveCounters(filteredCounters);
  }

  /**
   * 記録一覧を取得
   */
  async getRecords(): Promise<CountRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get records:', error);
      return [];
    }
  }

  /**
   * 記録一覧を保存
   */
  async saveRecords(records: CountRecord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save records:', error);
      throw error;
    }
  }

  /**
   * 記録を追加
   */
  async addRecord(record: CountRecord): Promise<void> {
    const records = await this.getRecords();
    records.push(record);
    await this.saveRecords(records);
  }

  /**
   * 記録を更新
   */
  async updateRecord(id: string, record: Partial<CountRecord>): Promise<void> {
    const records = await this.getRecords();
    const index = records.findIndex((r) => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...record };
      await this.saveRecords(records);
    }
  }

  /**
   * 記録を削除
   */
  async deleteRecord(id: string): Promise<void> {
    const records = await this.getRecords();
    const filteredRecords = records.filter((r) => r.id !== id);
    await this.saveRecords(filteredRecords);
  }

  /**
   * 全データを一括読み込み（初期化時）
   */
  async loadAllData(): Promise<StorageData> {
    const deviceId = await this.getDeviceId();
    const tags = await this.getTags();
    const counters = await this.getCounters();
    const records = await this.getRecords();

    return {
      deviceId,
      tags,
      counters,
      records,
    };
  }
}

export const storageService = new StorageService();
