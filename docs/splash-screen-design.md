# スプラッシュスクリーン（タイトル画面）デザイン

## コンセプト

**"Clean Start"（クリーンな始まり）**

アプリアイコンが「青背景に白」だったのに対し、タイトル画面では「白背景に青」とすることで、視覚的なリズムと洗練された印象を与えます。また、アプリ内部のUI（白・グレー基調）への遷移をスムーズにします。

## デザイン仕様

### 背景色

- **色**: `#FFFFFF`（完全な白）
- **理由**: 
  - 清潔感を出す
  - ロゴと文字を際立たせる
  - アプリ内部の背景色（`#F5F5F5`）への違和感のない遷移を実現

### シンボルロゴ

- **配置**: 中央上部
- **内容**: 「1+」（アプリアイコンのモチーフ）
- **色**: `#2196F3`（メインブルー）
- **サイズ**: 80px
- **フォント**: Bold
- **文字間隔**: -2px（タイトに）

**デザイン意図**: 
- アプリアイコンの色を反転（青背景に白 → 白背景に青）
- 視覚的なリズムと洗練された印象
- アプリの機能（カウント）を直感的に表現

### アプリ名

- **テキスト**: 「なんでもカウンター」
- **配置**: ロゴの下、中央
- **色**: `#333333`（ダークグレー）
- **フォントサイズ**: 32px（H1より少し大きめ）
- **フォントウェイト**: Bold
- **文字間隔**: 0.5px

### サブタイトル

- **テキスト**: "Nandemo COUNTER"
- **配置**: アプリ名の下、中央
- **色**: `#2196F3`（メインブルー）
- **フォントサイズ**: 18px（H3）
- **フォントウェイト**: Medium（500）
- **文字間隔**: 2px（0.1em相当、モダンな印象）

## レイアウト

```
┌─────────────────────┐
│                     │
│                     │
│        1+           │  ← シンボルロゴ（青）
│                     │
│   なんでもカウンター   │  ← アプリ名（グレー）
│                     │
│  Nandemo COUNTER   │  ← サブタイトル（青）
│                     │
│                     │
└─────────────────────┘
```

### スペーシング

- **ロゴとアプリ名の間**: 24px（SPACING.xl）
- **アプリ名とサブタイトルの間**: 8px（SPACING.sm）
- **左右パディング**: 24px（SPACING.xl）

## 実装

### コンポーネント

**ファイル**: `app/components/SplashScreen.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoSymbol}>1+</Text>
      </View>
      <Text style={styles.appName}>なんでもカウンター</Text>
      <Text style={styles.subtitle}>Nandemo COUNTER</Text>
    </View>
  );
}
```

### app.jsonの設定

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    }
  }
}
```

## スプラッシュ画像の生成

スプラッシュスクリーン用の画像を生成する場合：

### 推奨サイズ

- **iPhone**: 1242x2436px（iPhone X以降）
- **iPad**: 2048x2732px
- **Android**: 1242x2436px（推奨）

### デザイン仕様

1. **背景色**: `#FFFFFF`（完全な白）
2. **シンボルロゴ「1+」**: 
   - サイズ: 80px
   - 色: `#2196F3`（メインブルー）
   - フォント: Bold
   - 位置: 中央上部
   - 文字間隔: -2px
3. **アプリ名「なんでもカウンター」**: 
   - サイズ: 32px
   - 色: `#333333`（ダークグレー）
   - フォント: Bold
   - 位置: ロゴの下、中央
   - 文字間隔: 0.5px
4. **サブタイトル「Nandemo COUNTER」**: 
   - サイズ: 18px
   - 色: `#2196F3`（メインブルー）
   - フォント: Medium（500）
   - 位置: アプリ名の下、中央
   - 文字間隔: 2px（0.1em相当）

### レイアウト（中央揃え）

```
┌─────────────────────┐
│                     │
│                     │
│        1+           │  ← シンボルロゴ（80px、青）
│                     │
│   なんでもカウンター   │  ← アプリ名（32px、グレー）
│                     │
│  Nandemo COUNTER   │  ← サブタイトル（18px、青）
│                     │
│                     │
└─────────────────────┘
```

### オンラインツール

- [Expo Splash Screen Generator](https://www.appicon.co/)
- [MakeAppIcon](https://makeappicon.com/)

### 手動生成（Figma、Adobe XD、Sketchなど）

1. **キャンバス作成**: 1242x2436px
2. **背景レイヤー**: `#FFFFFF`
3. **シンボルロゴ**: 
   - テキスト「1+」
   - フォントサイズ: 80px
   - 色: `#2196F3`
   - フォントウェイト: Bold
   - 位置: 中央上部（垂直方向の中央より少し上）
   - 文字間隔: -2px
4. **アプリ名**: 
   - テキスト「なんでもカウンター」
   - フォントサイズ: 32px
   - 色: `#333333`
   - フォントウェイト: Bold
   - 位置: ロゴの下24px
   - 文字間隔: 0.5px
5. **サブタイトル**: 
   - テキスト「Nandemo COUNTER」
   - フォントサイズ: 18px
   - 色: `#2196F3`
   - フォントウェイト: Medium（500）
   - 位置: アプリ名の下8px
   - 文字間隔: 2px

### 画像生成スクリプト（オプション）

必要に応じて、プログラムでスプラッシュ画像を生成することも可能です。

## アニメーション（オプション）

将来的にアニメーションを追加する場合：

```typescript
import { Animated } from 'react-native';

// フェードインアニメーション
const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start();
}, []);
```

## ブランディングとの整合性

### アプリアイコンとの関係

- **アプリアイコン**: 青背景（#2196F3）に白い「1+」
- **スプラッシュスクリーン**: 白背景に青い「1+」
- **視覚的なリズム**: 色の反転により、洗練された印象

### アプリ内部UIとの関係

- **スプラッシュスクリーン**: 白背景（#FFFFFF）
- **アプリ内部**: グレー背景（#F5F5F5）
- **スムーズな遷移**: 白からグレーへの自然な移行

## 参考資料

- [Expo Splash Screen](https://docs.expo.dev/guides/splash-screens/)
- [デザインガイドライン](./design-guidelines.md)
- [アプリアイコン設定ガイド](./app-icon-guide.md)
