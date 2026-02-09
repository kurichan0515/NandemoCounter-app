# 実装計画書（整理版）

## 1. 現状と要件の差分

### 1.1 認証について

**現状**:
- Cognito User Poolが設定されている
- DynamoDBテーブルに`userId`フィールドが必要

**要件**:
- 会員登録なしで利用可能
- デバイスIDベースの匿名利用

**対応方針**:
- Phase 1（MVP）ではCognito認証は使用しない
- ローカルストレージ（AsyncStorage）のみを使用
- 将来的なクラウド同期のためにインフラは残しておく（使用しない）

### 1.2 データ保存について

**現状**:
- DynamoDBテーブル設計が存在
- Lambda関数のテンプレートが存在

**要件**:
- ローカルストレージ優先
- クラウドは将来の拡張用

**対応方針**:
- Phase 1ではローカルストレージのみ実装
- DynamoDB/Lambdaは将来の拡張用として残す（使用しない）

### 1.3 データモデルについて

**現状のDynamoDB設計**:
```typescript
{
  counterId: string;    // PK
  userId: string;       // GSI
  name: string;         // GSI
}
```

**要件に基づく新しいデータモデル**:
```typescript
// ローカルストレージ用
{
  deviceId: string;
  tags: Tag[];
  counters: Counter[];
  records: CountRecord[];
}
```

**重要な設計判断**:
- `Counter.currentCount`は保存せず、記録から計算する
- `CountRecord.counterName`は記録時点のスナップショットとして保存（カウンター名変更時の整合性保持）

## 2. アーキテクチャ設計

### 2.1 全体構成

```
┌─────────────────────────────────────┐
│         UI Layer (Screens)          │
│  - メイン画面                        │
│  - カウント登録画面                  │
│  - カウンター詳細画面                │
│  - 履歴画面                          │
│  - タグ分析画面                      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Context Layer (State)          │
│  - CounterContext                   │
│    (tags, counters, records, deviceId)│
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer                  │
│  - StorageService (AsyncStorage)    │
│  - AdService (広告)                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Utility Layer                  │
│  - uuid, date, tag, analysis       │
└─────────────────────────────────────┘
```

### 2.2 データフロー

```
ユーザー操作
    ↓
UI Component
    ↓
Context (State Management)
    ↓
Service (Storage)
    ↓
AsyncStorage (永続化)
```

## 3. Phase 1実装計画（MVP）

### 3.1 データ層の実装

#### 3.1.1 型定義の作成
**ファイル**: `app/types/index.ts`

```typescript
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
  counterName: string;  // スナップショット
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
```

#### 3.1.2 ストレージサービスの作成
**ファイル**: `app/services/storage.ts`

```typescript
// AsyncStorageを使用したローカルストレージサービス
class StorageService {
  // デバイスID
  async getDeviceId(): Promise<string>
  async saveDeviceId(id: string): Promise<void>
  
  // タグ
  async getTags(): Promise<Tag[]>
  async saveTags(tags: Tag[]): Promise<void>
  async addTag(tag: Tag): Promise<void>
  async updateTag(id: string, tag: Partial<Tag>): Promise<void>
  async deleteTag(id: string): Promise<void>
  
  // カウンター
  async getCounters(): Promise<Counter[]>
  async saveCounters(counters: Counter[]): Promise<void>
  async addCounter(counter: Counter): Promise<void>
  async updateCounter(id: string, counter: Partial<Counter>): Promise<void>
  async deleteCounter(id: string): Promise<void>
  
  // 記録
  async getRecords(): Promise<CountRecord[]>
  async saveRecords(records: CountRecord[]): Promise<void>
  async addRecord(record: CountRecord): Promise<void>
  async updateRecord(id: string, record: Partial<CountRecord>): Promise<void>
  async deleteRecord(id: string): Promise<void>
  
  // 一括読み込み（初期化時）
  async loadAllData(): Promise<{
    deviceId: string;
    tags: Tag[];
    counters: Counter[];
    records: CountRecord[];
  }>
}
```

### 3.2 状態管理の実装

#### 3.2.1 Context APIの実装
**ファイル**: `app/contexts/CounterContext.tsx`

```typescript
interface CounterContextType {
  // 状態
  deviceId: string | null;
  tags: Tag[];
  counters: Counter[];
  records: CountRecord[];
  loading: boolean;
  
  // タグ操作
  createTag(name: string, color: string): Promise<void>;
  updateTag(id: string, tag: Partial<Tag>): Promise<void>;
  deleteTag(id: string): Promise<void>;
  
  // カウンター操作
  createCounter(name: string, description?: string): Promise<void>;
  updateCounter(id: string, counter: Partial<Counter>): Promise<void>;
  deleteCounter(id: string): Promise<void>;
  
  // カウント操作（記録作成）
  addCountRecord(
    counterId: string,
    count: number,
    tags: string[],
    timestamp?: string,
    inputMethod?: InputMethod
  ): Promise<void>;
  
  // 記録操作
  updateRecord(id: string, record: Partial<CountRecord>): Promise<void>;
  deleteRecord(id: string): Promise<void>;
  
  // クエリ関数
  getCounterById(id: string): Counter | undefined;
  getTagById(id: string): Tag | undefined;
  getRecordsByCounterId(counterId: string): CountRecord[];
  getRecordsByTagId(tagId: string): CountRecord[];
  getRecordsByDateRange(startDate: string, endDate: string): CountRecord[];
  calculateCounterCurrentCount(counterId: string): number;  // 記録から計算
}
```

### 3.3 UI実装

#### 3.3.1 画面構成

```
app/
├── (tabs)/
│   ├── index.tsx                    # メイン画面（今日の記録）
│   ├── record/
│   │   └── new.tsx                  # カウント登録画面
│   ├── counter/
│   │   ├── [id].tsx                 # カウンター詳細画面
│   │   └── new.tsx                  # カウンター作成画面
│   ├── tags/
│   │   ├── index.tsx                # タグ一覧画面
│   │   ├── new.tsx                  # タグ作成画面
│   │   └── [id].tsx                 # タグ編集画面
│   ├── history/
│   │   ├── index.tsx                # 履歴一覧画面（全記録）
│   │   └── [counterId].tsx          # カウンター別履歴画面
│   └── analysis/
│       ├── index.tsx                # タグ選択画面
│       └── tag/
│           └── [tagId].tsx          # タグ分析画面
```

#### 3.3.2 メイン画面（今日の記録）
**ファイル**: `app/app/(tabs)/index.tsx`

**機能**:
- 今日の日付表示
- カウンター一覧表示（現在値も表示）
- 新しいカウント登録ボタン
- カウンター詳細への遷移
- バナー広告表示

**実装ポイント**:
- カウンターの現在値は`calculateCounterCurrentCount()`で計算
- 当日の記録を強調表示

#### 3.3.3 カウント登録画面
**ファイル**: `app/app/(tabs)/record/new.tsx`

**機能**:
- カウンター選択（必須）
- カウント値入力（ボタン操作 or 直接入力）
- 日時設定（デフォルト：現在日時）
- タグ選択（複数選択可能）
- 登録ボタン

**実装ポイント**:
- 入力方法の切り替えUI
- バリデーション（カウンター選択必須など）
- 登録完了時に広告表示（Phase 5）

#### 3.3.4 カウンター詳細画面
**ファイル**: `app/app/(tabs)/counter/[id].tsx`

**機能**:
- カウンター情報表示
- 現在値表示（記録から計算）
- カウント操作UI（ボタン操作 or 直接入力）
- 履歴表示への遷移
- タグ分析への遷移
- カウンター編集・削除

**実装ポイント**:
- カウント操作時に即座に記録を作成
- 現在値はリアルタイムで更新

#### 3.3.5 履歴画面
**ファイル**: `app/app/(tabs)/history/index.tsx`（全記録）
**ファイル**: `app/app/(tabs)/history/[counterId].tsx`（カウンター別）

**機能**:
- 記録一覧表示（日付ごとにグループ化）
- ソート機能（日時順）
- フィルタ機能（タグ、日付範囲）
- 記録の編集・削除
- 記録詳細表示

### 3.4 ユーティリティ

#### 3.4.1 UUID生成
**ファイル**: `app/utils/uuid.ts`

```typescript
export function generateUUID(): string {
  // UUID v4を生成
}
```

#### 3.4.2 日時フォーマット
**ファイル**: `app/utils/date.ts`

```typescript
export function formatDateTime(timestamp: string): string
export function formatDate(timestamp: string): string
export function formatTime(timestamp: string): string
export function getTodayStart(): string  // 今日の0時0分0秒
export function getTodayEnd(): string    // 今日の23時59分59秒
export function isToday(timestamp: string): boolean
export function getCurrentTimestamp(): string  // ISO8601形式
```

#### 3.4.3 タグユーティリティ
**ファイル**: `app/utils/tag.ts`

```typescript
export function getDefaultTagColors(): string[]
export function generateTagColor(): string
export function calculateTagFrequency(
  records: CountRecord[],
  tags: Tag[]
): Array<{ tag: Tag, count: number, lastUsed?: string }>
export function sortTagsByFrequency(
  tags: Tag[],
  records: CountRecord[],
  sortOrder: 'frequency' | 'name' | 'created'
): Tag[]
```

## 4. 実装手順（Phase 1）

### Step 1: 基盤の整備
1. 型定義の作成（`app/types/index.ts`）
2. UUID生成ユーティリティの作成
3. 日時フォーマットユーティリティの作成
4. タグユーティリティの作成（基本機能のみ）

### Step 2: ストレージ層の実装
1. AsyncStorageサービスの実装
2. デバイスID管理の実装
3. タグ保存/読み込みの実装
4. カウンター保存/読み込みの実装
5. 記録保存/読み込みの実装
6. 一括読み込み機能の実装

### Step 3: 状態管理の実装
1. CounterContextの作成
2. 初期化処理（データ読み込み）
3. タグ管理ロジックの実装
4. カウンター管理ロジックの実装
5. 記録作成ロジックの実装（ボタン操作）
6. 記録編集・削除ロジックの実装
7. クエリ関数の実装

### Step 4: UI実装（基本画面）
1. メイン画面（今日の記録）の実装
2. カウント登録画面の実装（ボタン操作のみ）
3. カウンター作成画面の実装
4. カウンター詳細画面の実装
5. タグ管理画面の実装
6. タグ作成・編集画面の実装
7. 履歴画面の実装

### Step 5: 統合とテスト
1. 各画面の統合
2. データの永続化確認
3. 基本的な動作確認
4. エラーハンドリングの確認

## 5. Phase 2実装計画（入力方法の拡張）

### 5.1 直接入力機能の実装
1. 数値キーボードの実装
2. 入力値のバリデーション
3. 入力確定処理

### 5.2 入力方法切り替えUI
1. モード切り替えボタンの実装
2. UIの切り替え処理

### 5.3 過去入力機能
1. 日時ピッカーの実装
2. 日時設定UIの実装
3. 過去日時のバリデーション

## 6. Phase 4実装計画（分析機能）

### 6.1 タグ選択画面
1. タグ頻度計算の実装
2. 頻度順表示の実装
3. タグ選択UIの実装
4. 複数タグ選択機能

### 6.2 カレンダー表示
1. カレンダーコンポーネントの実装
2. 記録日のハイライト機能
3. 期間選択機能

### 6.3 期間選択UI
1. プリセット期間ボタン
2. カスタム期間選択
3. 期間計算ユーティリティ

### 6.4 統計情報表示
1. 統計計算ユーティリティ
2. 統計情報カードコンポーネント
3. 比較統計機能

### 6.5 グラフ表示
1. グラフライブラリの統合
2. 期間に応じたグラフの切り替え
3. 日別・週別・月別の集計
4. インタラクティブな操作

## 7. Phase 5実装計画（広告機能）

### 7.1 AdMobの設定
1. Google AdMobアカウントの作成
2. アプリの登録
3. 広告ユニットIDの取得
4. app.jsonへの設定追加

### 7.2 広告サービスの実装
**ファイル**: `app/services/ads.ts`

```typescript
class AdService {
  async initialize(): Promise<void>
  async showInterstitialAd(): Promise<void>
  shouldShowInterstitialAd(): boolean  // 頻度制御
}
```

### 7.3 広告コンポーネントの実装
1. バナー広告コンポーネント
2. インタースティシャル広告コンポーネント
3. 広告表示頻度の制御

## 8. 必要なパッケージ

### 8.1 Phase 1（MVP）
```json
{
  "@react-native-async-storage/async-storage": "^1.21.0",
  "uuid": "^9.0.1"
}
```

### 8.2 Phase 2
```json
{
  "@react-native-community/datetimepicker": "^7.6.2"
}
```

### 8.3 Phase 4
```json
{
  "react-native-chart-kit": "^6.12.0",
  "react-native-calendars": "^1.1301.0"
}
```

### 8.4 Phase 5
```json
{
  "react-native-google-mobile-ads": "^13.0.0"
}
```

## 9. ファイル構造（全Phase完了後）

```
app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx                    # メイン画面
│   │   ├── record/
│   │   │   └── new.tsx                  # カウント登録
│   │   ├── counter/
│   │   │   ├── [id].tsx                 # カウンター詳細
│   │   │   └── new.tsx                  # カウンター作成
│   │   ├── tags/
│   │   │   ├── index.tsx                # タグ一覧
│   │   │   ├── new.tsx                  # タグ作成
│   │   │   └── [id].tsx                 # タグ編集
│   │   ├── history/
│   │   │   ├── index.tsx                # 履歴一覧
│   │   │   └── [counterId].tsx          # カウンター別履歴
│   │   └── analysis/
│   │       ├── index.tsx                # タグ選択
│   │       └── tag/
│   │           └── [tagId].tsx          # タグ分析
│   └── _layout.tsx
├── components/
│   ├── BannerAd.tsx                     # バナー広告
│   ├── InterstitialAd.tsx               # インタースティシャル広告
│   ├── TagSelector.tsx                  # タグ選択
│   ├── DateTimePicker.tsx               # 日時ピッカー
│   ├── CountInput.tsx                   # カウント入力
│   ├── Calendar.tsx                     # カレンダー
│   ├── PeriodSelector.tsx               # 期間選択
│   ├── StatisticsCard.tsx               # 統計情報カード
│   └── TagList.tsx                      # タグ一覧
├── contexts/
│   └── CounterContext.tsx               # 状態管理
├── services/
│   ├── storage.ts                       # ストレージサービス
│   └── ads.ts                           # 広告サービス
├── types/
│   └── index.ts                         # 型定義
└── utils/
    ├── uuid.ts                          # UUID生成
    ├── date.ts                          # 日時フォーマット
    ├── tag.ts                           # タグユーティリティ
    └── analysis.ts                      # 分析ユーティリティ
```

## 10. 注意事項

### 10.1 データ整合性
- `Counter.currentCount`は保存せず、記録から計算する
- `CountRecord.counterName`は記録時点のスナップショットとして保存
- カウンター削除時は関連する記録も削除するか、孤立記録として保持するか検討

### 10.2 パフォーマンス
- 大量の記録がある場合、クエリ関数の最適化が必要
- カレンダー表示時の記録フィルタリングを効率的に実装

### 10.3 エラーハンドリング
- ストレージ保存失敗時の処理
- データ読み込み失敗時の処理
- ネットワークエラー（将来のクラウド同期時）

## 11. 次のステップ

1. 要件定義書のレビュー
2. 実装計画の承認
3. Phase 1の実装開始
   - 基盤の整備
   - ストレージ層の実装
   - 状態管理の実装
   - UI実装（基本機能）
4. Phase 2の実装（入力方法の拡張）
5. Phase 4の実装（分析機能）
6. Phase 5の実装（広告機能）
7. MVP完成後のテスト
8. Phase 3（位置情報機能）の検討
