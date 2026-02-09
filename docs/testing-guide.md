# テストガイド

## テスト前の確認事項

### 1. 依存関係のインストール

```bash
cd app
npm install
```

### 2. TypeScriptのコンパイルチェック

```bash
cd app
npx tsc --noEmit
```

エラーがないことを確認してください。

### 3. アセットファイルの確認

以下のファイルが存在することを確認：

```bash
ls -lh app/assets/
# 以下が存在することを確認:
# - icon.png (アプリアイコン)
# - adaptive-icon.png (Android用アイコン)
# - splash.png (スプラッシュスクリーン、オプション)
```

## テスト実行方法

### 開発サーバーの起動

```bash
cd app
npm start
# または
npx expo start
```

### プラットフォーム別の起動

#### Android

```bash
cd app
npm run android
# または
npx expo start --android
```

#### iOS

```bash
cd app
npm run ios
# または
npx expo start --ios
```

#### Web

```bash
cd app
npm run web
# または
npx expo start --web
```

## テストチェックリスト

### メイン画面

- [ ] アプリが正常に起動する
- [ ] ヘッダーに「なんでもカウンター」と日付が表示される
- [ ] カウンターカードが正しく表示される（存在する場合）
- [ ] カウンターカードをタップして詳細画面に遷移できる
- [ ] 「カウンターがありません」が表示される（カウンターがない場合）
- [ ] 「カウンター作成」ボタンが動作する
- [ ] 「記録を追加」ボタンが動作する
- [ ] 「タグ分析」ボタンが動作する
- [ ] 「タグ管理」ボタンが動作する
- [ ] バナー広告が表示される（開発環境ではテスト広告）

### デザインの確認

- [ ] テーマシステムが正しく適用されている
- [ ] カラーが正しく表示される（青、グレーなど）
- [ ] フォントサイズが適切
- [ ] スペーシングが一貫している
- [ ] ボタンのスタイルが統一されている
- [ ] カードのスタイルが統一されている

### コンポーネントの確認

- [ ] `Button`コンポーネントが正しく動作する
- [ ] `CounterCard`コンポーネントが正しく表示される
- [ ] 各バリアント（primary, secondary, danger）が正しく表示される

### パフォーマンス

- [ ] アプリの起動時間が適切（3秒以内）
- [ ] 画面遷移がスムーズ
- [ ] スクロールがスムーズ
- [ ] メモリリークがない

## トラブルシューティング

### エラー: "Cannot find module"

**解決策**:
```bash
cd app
rm -rf node_modules package-lock.json
npm install
```

### エラー: "Metro bundler error"

**解決策**:
```bash
cd app
npx expo start -c
```

### エラー: "TypeScript compilation error"

**解決策**:
1. `npx tsc --noEmit`でエラーを確認
2. エラーを修正
3. 再度テスト

### アプリが起動しない

**解決策**:
1. Expo Goアプリがインストールされているか確認（実機テストの場合）
2. エミュレータ/シミュレータが起動しているか確認
3. ネットワーク接続を確認
4. ログを確認: `npx expo start --clear`

## テスト環境

### 推奨環境

- **Node.js**: 18.x以上
- **npm**: 9.x以上
- **Expo CLI**: 最新版
- **Android Studio**: 最新版（Androidテストの場合）
- **Xcode**: 最新版（iOSテストの場合）

### 実機テスト

1. **Expo Goアプリをインストール**
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

2. **開発サーバーを起動**
   ```bash
   cd app
   npm start
   ```

3. **QRコードをスキャン**
   - ターミナルに表示されるQRコードをExpo Goでスキャン

## 参考資料

- [Expo ドキュメント](https://docs.expo.dev/)
- [React Native ドキュメント](https://reactnative.dev/)
