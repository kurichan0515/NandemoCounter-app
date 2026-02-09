# スプラッシュスクリーン実装ガイド

## 概要

「Clean Start」コンセプトに基づいたスプラッシュスクリーンの実装方法を説明します。

## 実装方法

### 方法1: 画像ファイルを使用（推奨）

Expoの標準的な方法。`app.json`で設定した画像が自動的に使用されます。

#### 1. スプラッシュ画像の作成

デザインツール（Figma、Adobe XD、Sketchなど）で以下の仕様で作成：

- **サイズ**: 1242x2436px
- **背景色**: `#FFFFFF`
- **内容**: 
  - シンボルロゴ「1+」（80px、`#2196F3`）
  - アプリ名「なんでもカウンター」（32px、`#333333`）
  - サブタイトル「Nandemo COUNTER」（18px、`#2196F3`）

#### 2. 画像ファイルの配置

```bash
# スプラッシュ画像を配置
cp splash.png app/assets/splash.png
```

#### 3. app.jsonの設定

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

### 方法2: カスタムスプラッシュコンポーネント（開発中のみ）

開発中にカスタムスプラッシュスクリーンを表示する場合：

#### 1. コンポーネントの作成

**ファイル**: `app/components/SplashScreen.tsx`（既に作成済み）

#### 2. 使用例

```typescript
import SplashScreen from '../components/SplashScreen';

// 開発中に一時的に表示
<SplashScreen />
```

**注意**: 本番ビルドでは、`app.json`で設定した画像が使用されます。

## デザイン仕様の詳細

### タイポグラフィ

#### シンボルロゴ「1+」
- **フォントサイズ**: 80px
- **フォントウェイト**: Bold
- **色**: `#2196F3`（メインブルー）
- **文字間隔**: -2px（タイトに）

#### アプリ名「なんでもカウンター」
- **フォントサイズ**: 32px
- **フォントウェイト**: Bold
- **色**: `#333333`（ダークグレー）
- **文字間隔**: 0.5px

#### サブタイトル「Nandemo COUNTER」
- **フォントサイズ**: 18px
- **フォントウェイト**: Medium（500）
- **色**: `#2196F3`（メインブルー）
- **文字間隔**: 2px（0.1em相当）

### スペーシング

- **ロゴとアプリ名の間**: 24px
- **アプリ名とサブタイトルの間**: 8px
- **左右パディング**: 24px

### レイアウト

すべての要素は中央揃え（`justifyContent: 'center'`, `alignItems: 'center'`）

## 実装チェックリスト

- [ ] スプラッシュ画像が作成されている（1242x2436px）
- [ ] 画像ファイルが`app/assets/splash.png`に配置されている
- [ ] `app.json`の`splash`設定が正しい
- [ ] 背景色が`#FFFFFF`に設定されている
- [ ] 開発環境でスプラッシュスクリーンが表示される
- [ ] ビルド後にスプラッシュスクリーンが表示される

## トラブルシューティング

### スプラッシュスクリーンが表示されない

**原因と解決策**:
1. **画像ファイルが存在しない**
   - `app/assets/splash.png`が存在するか確認
   - ファイルパスが正しいか確認

2. **app.jsonの設定が間違っている**
   - `splash.image`のパスを確認
   - `splash.backgroundColor`が設定されているか確認

3. **キャッシュの問題**
   - Expoのキャッシュをクリア: `npx expo start -c`
   - アプリを再ビルド

### 画像が正しく表示されない

**原因と解決策**:
1. **画像サイズが適切でない**
   - 1242x2436pxにリサイズ

2. **画像形式の問題**
   - PNG形式を使用

3. **resizeModeの設定**
   - `contain`: 画像全体を表示（推奨）
   - `cover`: 画像を拡大して全体を覆う
   - `native`: 元のサイズで表示

## 参考資料

- [スプラッシュスクリーンデザイン](./splash-screen-design.md) - デザイン仕様の詳細
- [Expo Splash Screen](https://docs.expo.dev/guides/splash-screens/)
- [デザインガイドライン](./design-guidelines.md)
