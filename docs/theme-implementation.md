# テーマ実装ガイド

## 概要

デザインガイドラインに基づいて、アプリ全体で一貫したデザインを実現するためのテーマシステムを実装しました。

## ファイル構成

### `app/constants/theme.ts`

テーマの定義ファイル。以下の定数をエクスポート：

- `COLORS`: カラーパレット
- `TYPOGRAPHY`: タイポグラフィ設定
- `SPACING`: スペーシング設定
- `LAYOUT`: レイアウト設定（角丸、影）

## 使用方法

### 基本的なインポート

```typescript
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../constants/theme';
// または
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../constants';
```

### カラーの使用

```typescript
import { COLORS } from '../constants/theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary.main, // #2196F3
  },
  text: {
    color: COLORS.text.primary, // #333333
  },
  card: {
    backgroundColor: COLORS.background.card, // #FFFFFF
    borderColor: COLORS.border, // #E0E0E0
  },
});
```

### タイポグラフィの使用

```typescript
import { TYPOGRAPHY } from '../constants/theme';

const styles = StyleSheet.create({
  title: {
    fontSize: TYPOGRAPHY.h1.fontSize, // 28
    fontWeight: TYPOGRAPHY.h1.fontWeight, // 'bold'
    lineHeight: TYPOGRAPHY.h1.lineHeight, // 34
  },
  body: {
    fontSize: TYPOGRAPHY.body.fontSize, // 16
    fontWeight: TYPOGRAPHY.body.fontWeight, // 'normal'
    lineHeight: TYPOGRAPHY.body.lineHeight, // 24
  },
  count: {
    fontSize: TYPOGRAPHY.countLarge.fontSize, // 72
    fontWeight: TYPOGRAPHY.countLarge.fontWeight, // 'bold'
  },
});
```

### スペーシングの使用

```typescript
import { SPACING } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg, // 16
    marginBottom: SPACING.md, // 12
  },
  button: {
    paddingHorizontal: SPACING.xl, // 24
    paddingVertical: SPACING.lg, // 16
  },
});
```

### レイアウトの使用

```typescript
import { LAYOUT } from '../constants/theme';

const styles = StyleSheet.create({
  card: {
    borderRadius: LAYOUT.borderRadius.lg, // 12
    ...LAYOUT.shadow, // 影の設定
  },
  button: {
    borderRadius: LAYOUT.borderRadius.md, // 8
  },
  pill: {
    borderRadius: LAYOUT.borderRadius.pill, // 9999
  },
});
```

## カラーパレット

### プライマリカラー

```typescript
COLORS.primary.main    // #2196F3 - メインブルー
COLORS.primary.light   // #64B5F6 - ホバー状態
COLORS.primary.dark    // #1976D2 - プレス状態
COLORS.primary.background // #E3F2FD - 選択状態の背景
```

### セカンダリカラー

```typescript
COLORS.secondary.main    // #4CAF50 - セカンダリグリーン
COLORS.secondary.light   // #81C784
COLORS.secondary.dark    // #388E3C
COLORS.secondary.background // #E8F5E9
```

### アクセントカラー

```typescript
COLORS.accent.main    // #FF9800 - アクセントオレンジ
COLORS.accent.light   // #FFB74D
COLORS.accent.dark    // #F57C00
COLORS.accent.background // #FFF3E0
```

### ステータスカラー

```typescript
COLORS.status.error   // #F44336 - エラー・削除
COLORS.status.success // #4CAF50 - 成功
COLORS.status.warning // #FF9800 - 警告
COLORS.status.info    // #2196F3 - 情報
```

### テキストカラー

```typescript
COLORS.text.primary     // #333333 - 主要テキスト
COLORS.text.secondary   // #666666 - 補助テキスト
COLORS.text.placeholder // #999999 - プレースホルダー
COLORS.text.disabled    // #CCCCCC - 無効テキスト
```

### 背景カラー

```typescript
COLORS.background.main // #F5F5F5 - 画面背景
COLORS.background.card // #FFFFFF - カード背景
```

### ボーダーカラー

```typescript
COLORS.border // #E0E0E0 - 標準ボーダー
```

## タイポグラフィ

### 見出し

```typescript
TYPOGRAPHY.h1 // 28px, bold, lineHeight: 34
TYPOGRAPHY.h2 // 24px, bold, lineHeight: 29
TYPOGRAPHY.h3 // 18px, 600, lineHeight: 22
```

### 本文

```typescript
TYPOGRAPHY.body // 16px, normal, lineHeight: 24
TYPOGRAPHY.caption // 12px, normal, lineHeight: 18
```

### 特殊用途

```typescript
TYPOGRAPHY.countLarge // 72px, bold, lineHeight: 86 - 大きなカウント値
TYPOGRAPHY.countMedium // 24px, bold, lineHeight: 29 - 中サイズのカウント値
```

## スペーシング

```typescript
SPACING.xs   // 4px
SPACING.sm   // 8px
SPACING.md   // 12px
SPACING.lg   // 16px
SPACING.xl   // 24px
SPACING.xxl  // 32px
```

## レイアウト

### 角丸

```typescript
LAYOUT.borderRadius.md   // 8px - 標準
LAYOUT.borderRadius.lg   // 12px - カード
LAYOUT.borderRadius.pill // 9999 - ピル型
```

### 影

```typescript
LAYOUT.shadow // 標準の影設定
// 使用例:
{
  ...LAYOUT.shadow,
  // または個別に:
  shadowColor: LAYOUT.shadow.shadowColor,
  shadowOffset: LAYOUT.shadow.shadowOffset,
  shadowOpacity: LAYOUT.shadow.shadowOpacity,
  shadowRadius: LAYOUT.shadow.shadowRadius,
  elevation: LAYOUT.shadow.elevation,
}
```

## 実装例

### ボタンスタイル

```typescript
import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../constants/theme';

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  primaryButtonPressed: {
    backgroundColor: COLORS.primary.dark,
  },
});
```

### カードスタイル

```typescript
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, LAYOUT } from '../constants/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...LAYOUT.shadow,
  },
});
```

### 入力フィールドスタイル

```typescript
import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../constants/theme';

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.background.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: LAYOUT.borderRadius.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.primary,
  },
  inputFocused: {
    borderColor: COLORS.primary.main,
    borderWidth: 2,
  },
  inputError: {
    borderColor: COLORS.status.error,
  },
});
```

## 既存コードへの適用

既存のスタイルファイルを段階的にテーマに移行：

1. `styles/common.ts` - 共通スタイルをテーマを使用するように更新済み
2. 各画面のスタイルファイルを順次更新
3. ハードコードされた色やサイズをテーマ定数に置き換え

## ベストプラクティス

1. **ハードコードを避ける**: 色やサイズは直接指定せず、テーマ定数を使用
2. **一貫性を保つ**: 同じ用途には同じテーマ定数を使用
3. **拡張性を考慮**: 新しい色やサイズが必要な場合は、テーマファイルに追加
4. **ドキュメントを更新**: テーマに変更があった場合は、デザインガイドラインも更新

## 参考資料

- [デザインガイドライン](./design-guidelines.md) - デザインシステムの詳細
- [画面・ボタン一覧](./screen-inventory.md) - 実装済み画面の詳細
