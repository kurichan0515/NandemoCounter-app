# 実装計画書

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
  tags: Tag[];
  counters: Counter[];
  records: CountRecord[];
  deviceId: string;
}
```

## 2. Phase 1実装計画（MVP）

### 2.1 データ層の実装

#### 2.1.1 ストレージサービスの作成
**ファイル**: `app/services/storage.ts`

```typescript
// AsyncStorageを使用したローカルストレージサービス
- getDeviceId(): Promise<string>
- saveDeviceId(id: string): Promise<void>
- getTags(): Promise<Tag[]>
- saveTags(tags: Tag[]): Promise<void>
- addTag(tag: Tag): Promise<void>
- updateTag(id: string, tag: Partial<Tag>): Promise<void>
- deleteTag(id: string): Promise<void>
- getCounters(): Promise<Counter[]>
- saveCounters(counters: Counter[]): Promise<void>
- getRecords(): Promise<CountRecord[]>
- saveRecords(records: CountRecord[]): Promise<void>
- addRecord(record: CountRecord): Promise<void>
```

#### 2.1.2 型定義の作成
**ファイル**: `app/types/index.ts`

```typescript
- Tag
- Counter
- CountRecord
- Location (オプション)
- InputMethod ('button' | 'direct')
```

### 2.2 状態管理の実装

#### 2.2.1 Context APIの実装
**ファイル**: `app/contexts/CounterContext.tsx`

```typescript
// CounterContext
- tags: Tag[]
- counters: Counter[]
- records: CountRecord[]
- deviceId: string
- createTag(name: string, color: string)
- updateTag(id: string, tag: Partial<Tag>)
- deleteTag(id: string)
- createCounter(name: string, description?: string)
- updateCounter(id: string, count: number)
- deleteCounter(id: string)
- incrementCounter(id: string)
- decrementCounter(id: string)
- resetCounter(id: string)
- addCountRecord(counterId: string, count: number, tags: string[], timestamp?: string, inputMethod: 'button' | 'direct')
- getRecordsByCounterId(counterId: string)
- getRecordsByTagId(tagId: string)
- getRecordsByDateRange(startDate: string, endDate: string)
```

**ファイル**: `app/contexts/TagContext.tsx`（オプション、CounterContextに統合も可）

```typescript
// TagContext（必要に応じて分離）
- tags: Tag[]
- createTag(name: string, color: string)
- updateTag(id: string, tag: Partial<Tag>)
- deleteTag(id: string)
- getTagById(id: string)
```

### 2.3 UI実装

#### 2.3.1 メイン画面（今日の記録）
**ファイル**: `app/app/(tabs)/index.tsx`（既存を拡張）

- **当日登録中心のUI**
  - デフォルトで今日の日付を表示
  - カウンター一覧またはタグ一覧表示
  - 新しいカウント登録ボタン
  - 過去入力への切り替えボタン
  - バナー広告の表示

#### 2.3.2 カウント登録画面
**ファイル**: `app/app/(tabs)/record/new.tsx`（新規作成）

- **入力方法の選択**
  - ボタン操作モード（+/-ボタン）
  - 直接入力モード（数値キーボード）
  - モード切り替えボタン

- **日時設定**
  - デフォルト：現在の日時
  - 過去入力：日時ピッカーで変更可能
  - 日時表示と編集ボタン

- **カウンター選択**
  - カウンター一覧から選択
  - 新規カウンター作成ボタン

- **タグ選択**
  - タグの一覧から複数選択（チェックボックス）
  - 新規タグ作成ボタン
  - 選択されたタグの表示

- **登録ボタン**
  - 登録完了時にインタースティシャル広告表示

#### 2.3.3 カウンター詳細画面
**ファイル**: `app/app/(tabs)/counter/[id].tsx`（新規作成）

- 大きなカウント表示
- **入力方法切り替え**
  - ボタンモード：+/-/リセットボタン
  - 直接入力モード：数値入力フィールドと確定ボタン
- 履歴表示への遷移ボタン
- タグ分析への遷移ボタン

#### 2.3.4 カウンター作成画面
**ファイル**: `app/app/(tabs)/counter/new.tsx`（新規作成）

- カウンター名入力
- 説明入力（オプション）
- 作成ボタン

#### 2.3.5 タグ管理画面
**ファイル**: `app/app/(tabs)/tags/index.tsx`（新規作成）

- タグ一覧表示
- タグ作成ボタン
- タグ編集・削除機能
- タグ分析への遷移

#### 2.3.6 タグ作成・編集画面
**ファイル**: `app/app/(tabs)/tags/new.tsx`（新規作成）
**ファイル**: `app/app/(tabs)/tags/[id].tsx`（新規作成）

- タグ名入力
- 色選択（カラーピッカー）
- 保存ボタン

#### 2.3.7 履歴画面
**ファイル**: `app/app/(tabs)/history/[counterId].tsx`（新規作成）

- 記録一覧表示
- 日時、カウント値、タグの表示
- ソート機能（日時順）
- 日付ごとのグループ化表示

#### 2.3.8 タグ分析画面
**ファイル**: `app/app/(tabs)/analysis/index.tsx`（新規作成：タグ選択画面）
**ファイル**: `app/app/(tabs)/analysis/tag/[tagId].tsx`（新規作成：個別タグ分析画面）

- **タグ選択画面**
  - **頻度の高いタグを優先表示**
    - 記録に使用された回数でソート
    - 最近使用されたタグも考慮（重み付け計算）
    - ソートオプション：頻度順、名前順、作成日順
  - タグ一覧の表示（頻度順がデフォルト）
  - タグの選択UI（チェックボックスまたはタップ選択）
  - 複数タグの選択をサポート
  - 選択されたタグのハイライト表示
  - タグの色で視覚的に識別
  - 「分析開始」ボタンで分析画面へ遷移

- **個別タグ分析画面**（URLパラメータでタグIDを指定）
  - **タグ選択UI**
    - 現在選択中のタグ表示
    - タグ変更ボタン（タグ選択画面へ戻る）
    - 複数タグ選択時の表示

- **カレンダー表示**
  - 月間カレンダーコンポーネント
  - 選択されたタグの記録がある日をハイライト表示（色分け）
  - 複数タグ選択時は各タグの色で表示
  - 日付タップでその日の記録詳細を表示
  - カレンダー上で期間範囲選択

- **期間選択UI**
  - プリセット期間ボタン（月累計、3か月、6か月、12か月）
  - カスタム期間選択ボタン
  - 期間選択時の日付ピッカー表示

- **統計情報表示**
  - 選択期間の合計カウント
  - 平均カウント（日別平均）
  - 最大カウント日
  - 記録日数
  - 選択されたタグ別の集計情報
  - 複数タグ選択時は比較統計情報

- **グラフ表示**
  - 選択されたタグに応じたグラフ表示
  - 期間に応じたグラフの自動切り替え
  - 日別集計グラフ（棒グラフ）- 月累計・3か月の場合
  - 週別集計グラフ（折れ線グラフ）- 6か月の場合
  - 月別集計グラフ（折れ線グラフ）- 12か月の場合
  - タグ別の色分け表示
  - 複数タグ選択時は比較表示
  - グラフのインタラクティブ操作（タップで詳細表示）

- **記録一覧表示**
  - 選択期間の記録一覧
  - 選択されたタグでフィルタリング
  - 日付ごとのグループ化
  - ソート機能

### 2.4 ユーティリティ

#### 2.4.1 UUID生成
**ファイル**: `app/utils/uuid.ts`

```typescript
generateUUID(): string
```

#### 2.4.2 日時フォーマット
**ファイル**: `app/utils/date.ts`

```typescript
formatDateTime(timestamp: string): string
formatDate(timestamp: string): string
formatTime(timestamp: string): string
getTodayStart(): string  // 今日の0時0分0秒
getTodayEnd(): string    // 今日の23時59分59秒
isToday(timestamp: string): boolean
```

#### 2.4.3 タグユーティリティ
**ファイル**: `app/utils/tag.ts`

```typescript
getDefaultTagColors(): string[]  // デフォルトのタグカラー一覧
generateTagColor(): string        // ランダムなタグカラー生成

// タグ頻度計算
calculateTagFrequency(records: CountRecord[], tags: Tag[]): Array<{ tag: Tag, count: number, lastUsed?: string }>
sortTagsByFrequency(tags: Tag[], records: CountRecord[], sortOrder: 'frequency' | 'name' | 'created'): Tag[]
getMostUsedTags(tags: Tag[], records: CountRecord[], limit?: number): Tag[]  // 頻度の高いタグを取得
```

#### 2.4.4 分析ユーティリティ
**ファイル**: `app/utils/analysis.ts`

```typescript
// 期間計算
getMonthToDate(): { start: string, end: string }  // 月累計
getLastMonths(months: number): { start: string, end: string }  // 過去Nか月
getCustomPeriod(startDate: string, endDate: string): { start: string, end: string }

// 統計計算
calculateTagStatistics(records: CountRecord[], tagId: string, startDate?: string, endDate?: string)
calculatePeriodStatistics(records: CountRecord[], startDate: string, endDate: string)
getTotalCount(records: CountRecord[]): number
getAverageCount(records: CountRecord[]): number
getMaxCountDay(records: CountRecord[]): { date: string, count: number }
getRecordDays(records: CountRecord[]): number

// データグループ化
groupRecordsByDate(records: CountRecord[]): Record<string, CountRecord[]>
groupRecordsByWeek(records: CountRecord[]): Record<string, CountRecord[]>
groupRecordsByMonth(records: CountRecord[]): Record<string, CountRecord[]>
groupRecordsByTag(records: CountRecord[]): Record<string, CountRecord[]>

// カレンダー用
getRecordsByDateRange(records: CountRecord[], startDate: string, endDate: string): CountRecord[]
getDatesWithRecords(records: CountRecord[]): string[]  // 記録がある日付のリスト
getDailyCounts(records: CountRecord[]): Record<string, number>  // 日別カウント集計

// タグ分析用
getRecordsByTags(records: CountRecord[], tagIds: string[]): CountRecord[]  // 指定タグの記録を取得
filterRecordsByTags(records: CountRecord[], tagIds: string[], matchAll?: boolean): CountRecord[]  // タグでフィルタ（AND/OR）
compareTagStatistics(records: CountRecord[], tagIds: string[], startDate: string, endDate: string): Array<{ tagId: string, statistics: any }>  // 複数タグの比較統計
```

## 3. 実装手順

### Step 1: 基盤の整備
1. 型定義の作成（`app/types/index.ts`）
   - Tag, Counter, CountRecord, Location, InputMethod
2. UUID生成ユーティリティの作成
3. 日時フォーマットユーティリティの作成
4. タグユーティリティの作成
5. 分析ユーティリティの作成

### Step 2: ストレージ層の実装
1. AsyncStorageサービスの実装
2. デバイスID管理の実装
3. タグ保存/読み込みの実装
4. カウンター保存/読み込みの実装
5. 記録保存/読み込みの実装

### Step 3: 状態管理の実装
1. CounterContextの作成
2. タグ管理ロジックの実装
3. カウンター操作ロジックの実装
4. 記録作成ロジックの実装（ボタン操作）
5. 記録作成ロジックの実装（直接入力）

### Step 4: UI実装（Phase 1）
1. メイン画面（今日の記録）の実装
2. カウント登録画面の実装（ボタン操作のみ）
3. カウンター作成画面の実装
4. タグ管理画面の実装
5. タグ作成・編集画面の実装
6. 履歴画面の実装

### Step 5: UI実装（Phase 2）
1. 直接入力機能の実装
2. 入力方法切り替えUIの実装
3. 過去入力機能（日時ピッカー）の実装

### Step 6: UI実装（Phase 4）
1. タグユーティリティの実装
   - タグ頻度計算関数
   - タグソート関数
   - 頻度の高いタグ取得関数
2. タグ選択画面の実装
   - 頻度順でタグ一覧を表示
   - タグ選択UI（チェックボックスまたはタップ選択）
   - 複数タグ選択機能
   - ソート機能（頻度順、名前順、作成日順）
   - 選択状態の視覚的フィードバック
3. カレンダーコンポーネントの実装
   - 月間カレンダーの表示
   - 記録日のハイライト機能（タグ別色分け）
   - 期間選択機能
4. 期間選択UIの実装
   - プリセット期間ボタン
   - カスタム期間選択
5. 分析ユーティリティの実装
   - 期間計算関数
   - 統計計算関数
   - データグループ化関数
   - タグ分析用関数（タグでフィルタ、比較統計）
6. タグ分析画面の実装
   - タグ選択UI（現在選択中のタグ表示）
   - カレンダー表示
   - 期間選択UI
   - 統計情報の表示（単一タグ・複数タグ比較）
7. グラフ表示の実装
   - 選択されたタグに応じたグラフ表示
   - 期間に応じたグラフの切り替え
   - 日別・週別・月別の集計グラフ
   - 複数タグ選択時の比較表示
   - インタラクティブな操作

### Step 7: 広告機能の実装（Phase 5）
1. AdMobの設定と初期化
2. 登録完了時のインタースティシャル広告実装
3. バナー広告の実装
4. 広告表示頻度の制御

### Step 8: 統合とテスト
1. 各画面の統合
2. データの永続化確認
3. 基本的な動作確認
4. 広告表示の動作確認

## 4. 必要なパッケージ

### 4.1 追加が必要なパッケージ（Phase 1）
```json
{
  "@react-native-async-storage/async-storage": "^1.x.x",
  "uuid": "^9.x.x"
}
```

### 4.2 追加が必要なパッケージ（Phase 2）
```json
{
  "@react-native-community/datetimepicker": "^7.x.x"
}
```

### 4.3 追加が必要なパッケージ（Phase 4）
```json
{
  "react-native-chart-kit": "^6.x.x",
  // または
  "victory-native": "^36.x.x",
  "react-native-calendars": "^1.x.x"
  // または
  "react-native-calendar-strip": "^2.x.x"
}
```

### 4.4 追加が必要なパッケージ（Phase 5）
```json
{
  "react-native-google-mobile-ads": "^13.x.x"
  // または
  "expo-ads-admob": "^10.x.x"  // Expo SDK 49以前の場合
}
```

### 4.5 既存パッケージの確認
- expo-router（既存）
- react-native（既存）
- typescript（既存）

## 5. ファイル構造（全Phase完了後）

```
app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx              # メイン画面（今日の記録）
│   │   ├── record/
│   │   │   └── new.tsx            # カウント登録画面
│   │   ├── counter/
│   │   │   ├── [id].tsx           # カウンター詳細
│   │   │   └── new.tsx            # カウンター作成
│   │   ├── tags/
│   │   │   ├── index.tsx          # タグ一覧
│   │   │   ├── new.tsx           # タグ作成
│   │   │   └── [id].tsx          # タグ編集
│   │   ├── history/
│   │   │   └── [counterId].tsx    # 履歴一覧
│   │   └── analysis/
│   │       ├── index.tsx          # タグ選択画面（頻度順表示）
│   │       └── tag/
│   │           └── [tagId].tsx    # タグ分析画面
│   └── _layout.tsx
├── components/                     # 共通コンポーネント
│   ├── BannerAd.tsx               # バナー広告コンポーネント
│   ├── InterstitialAd.tsx         # インタースティシャル広告コンポーネント
│   ├── TagSelector.tsx            # タグ選択コンポーネント
│   ├── DateTimePicker.tsx         # 日時ピッカーコンポーネント
│   ├── CountInput.tsx             # カウント入力コンポーネント
│   ├── Calendar.tsx               # カレンダーコンポーネント
│   ├── PeriodSelector.tsx         # 期間選択コンポーネント
│   ├── StatisticsCard.tsx         # 統計情報カードコンポーネント
│   └── TagList.tsx                # タグ一覧コンポーネント（頻度順表示対応）
├── contexts/
│   └── CounterContext.tsx         # カウンター状態管理
├── services/
│   ├── storage.ts                 # ローカルストレージサービス
│   └── ads.ts                     # 広告サービス
├── types/
│   └── index.ts                   # 型定義
├── utils/
│   ├── uuid.ts                    # UUID生成
│   ├── date.ts                    # 日時フォーマット
│   ├── tag.ts                     # タグユーティリティ
│   └── analysis.ts                # 分析ユーティリティ（期間計算、統計計算、データグループ化）
└── ...
```

## 6. 注意事項

### 6.1 Cognito認証について
- Phase 1ではCognito認証は使用しない
- インフラコード（terraform/cognito.tf）は残しておくが、アプリ側では使用しない
- 環境変数のCognito設定はオプションとして残す

### 6.2 DynamoDBについて
- Phase 1ではDynamoDBは使用しない
- インフラコードは将来の拡張用として残す
- アプリ側ではAPI呼び出しを行わない

### 6.3 データ移行について
- 将来的にクラウド同期を追加する場合、ローカルデータをDynamoDBに移行する機能が必要
- その際のデータモデル変換ロジックを考慮した設計にする

## 7. 広告実装の詳細

### 7.1 AdMobの設定
1. Google AdMobアカウントの作成
2. アプリの登録（iOS/Android）
3. 広告ユニットIDの取得
   - インタースティシャル広告ID
   - バナー広告ID
4. app.jsonへの設定追加

### 7.2 広告表示のタイミング
- **登録完了時**: カウント記録を保存した直後（3回に1回など頻度制御）
- **バナー広告**: メイン画面と履歴画面の下部に常時表示

### 7.3 広告の実装方針
- 広告サービスを分離して実装（`app/services/ads.ts`）
- 広告コンポーネントを再利用可能に設計
- テスト用の広告ユニットIDを使用して開発

## 8. 次のステップ

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
