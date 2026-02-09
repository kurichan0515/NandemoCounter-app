// 基本型定義

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  deviceId: string;
}

export interface Counter {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deviceId: string;
}

export interface CountRecord {
  id: string;
  counterId: string;
  counterName: string; // 記録時点のスナップショット
  count: number;
  timestamp: string;
  tags: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  deviceId: string;
  inputMethod: 'button' | 'direct';
}

export type InputMethod = 'button' | 'direct';

// ストレージデータ構造
export interface StorageData {
  deviceId: string;
  tags: Tag[];
  counters: Counter[];
  records: CountRecord[];
}
