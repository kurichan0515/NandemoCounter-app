# アプリアイコン設定ガイド

## 概要

アプリアイコンの設定と要件について説明します。

## アイコンの仕様

### 現在のアイコン

- **ファイル**: `app/assets/icon.png`
- **サイズ**: 1024x1024px
- **形式**: PNG（推奨）またはJPEG
- **デザイン**: 青い背景に白い「1+」シンボル

### アイコンの特徴

- **形状**: Squircle（角が丸い正方形）
- **背景色**: 青（#2196F3）- プライマリカラーと一致
- **シンボル**: 白い「1+」- カウント機能を表現
- **スタイル**: ミニマルでモダン

## プラットフォーム別の設定

### iOS

**設定場所**: `app.json` → `expo.icon`

```json
{
  "expo": {
    "icon": "./assets/icon.png"
  }
}
```

**要件**:
- サイズ: 1024x1024px
- 形式: PNG（推奨）
- 透明背景: 不要（Expoが自動処理）

### Android

**設定場所**: `app.json` → `expo.android.adaptiveIcon`

```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2196F3"
      }
    }
  }
}
```

**要件**:
- **前景画像** (`foregroundImage`): 
  - サイズ: 1024x1024px
  - 形式: PNG
  - 中央1024x1024pxの領域が表示される
  - 周囲は安全領域として考慮（実際には中央部分が表示）
- **背景色** (`backgroundColor`): 
  - 現在: `#2196F3`（プライマリカラー）
  - アイコンの背景色と一致させる

**注意**: Androidのadaptive iconは、前景画像と背景色を組み合わせて表示されます。前景画像の周囲は切り取られる可能性があるため、重要な要素は中央に配置する必要があります。

### Web

**設定場所**: `app.json` → `expo.web.favicon`

```json
{
  "expo": {
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

**要件**:
- サイズ: 32x32px または 16x16px
- 形式: PNG または ICO

## アイコンの最適化

### サイズの確認

```bash
# 画像のサイズを確認
file app/assets/icon.png
identify app/assets/icon.png  # ImageMagickがインストールされている場合
```

### 形式の変換

必要に応じて、JPEGからPNGに変換：

```bash
# ImageMagickを使用
convert app/assets/icon.png -format png app/assets/icon.png

# または、オンラインツールを使用
```

### サイズの調整

1024x1024px以外のサイズの場合、リサイズが必要：

```bash
# ImageMagickを使用
convert input.png -resize 1024x1024 output.png

# または、オンラインツールを使用
```

## アイコンのテスト

### 開発環境での確認

```bash
cd app
npm run android
# または
npm run ios
```

### ビルド後の確認

```bash
# プレビュービルド
eas build --platform android --profile preview

# ビルド後、実機でアイコンを確認
```

## アイコンの更新手順

1. **新しいアイコン画像を準備**
   - サイズ: 1024x1024px
   - 形式: PNG（推奨）

2. **ファイルを配置**
   ```bash
   cp new-icon.png app/assets/icon.png
   cp new-icon.png app/assets/adaptive-icon.png
   ```

3. **app.jsonの確認**
   - `icon`パスが正しいか確認
   - `adaptiveIcon.foregroundImage`パスが正しいか確認
   - `adaptiveIcon.backgroundColor`が適切か確認

4. **ビルドとテスト**
   ```bash
   cd app
   npm run android
   ```

## 現在の設定

### アイコンファイル

- **iOS/Web用**: `app/assets/icon.png`
- **Android用**: `app/assets/adaptive-icon.png`

### app.jsonの設定

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2196F3"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## トラブルシューティング

### アイコンが表示されない

**原因と解決策**:
1. **ファイルパスが間違っている**
   - `app.json`のパスを確認
   - ファイルが存在するか確認: `ls app/assets/icon.png`

2. **ファイル形式が対応していない**
   - PNG形式に変換

3. **サイズが適切でない**
   - 1024x1024pxにリサイズ

4. **キャッシュの問題**
   - Expoのキャッシュをクリア: `npx expo start -c`

### Androidでアイコンが正しく表示されない

**原因と解決策**:
1. **前景画像のサイズ**
   - 1024x1024pxであることを確認

2. **背景色の設定**
   - `backgroundColor`が適切か確認
   - アイコンの背景色と一致させる

3. **安全領域**
   - 重要な要素が中央に配置されているか確認
   - 周囲は切り取られる可能性がある

## 参考資料

- [Expo アイコン設定](https://docs.expo.dev/guides/app-icons/)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [iOS App Icon](https://developer.apple.com/design/human-interface-guidelines/app-icons)
