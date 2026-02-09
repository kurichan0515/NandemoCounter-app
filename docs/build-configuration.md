# ビルド設定ガイド

## 目次

1. [EAS Buildの設定](#eas-buildの設定)
2. [app.jsonの設定](#appjsonの設定)
3. [ビルドプロファイル](#ビルドプロファイル)
4. [環境変数の管理](#環境変数の管理)
5. [ビルドコマンド](#ビルドコマンド)

---

## EAS Buildの設定

### 1. EAS CLIのインストール

```bash
npm install -g eas-cli
```

### 2. EASにログイン

```bash
eas login
```

Expoアカウントでログインします。アカウントがない場合は作成します。

### 3. プロジェクトの初期化

```bash
cd app
eas build:configure
```

これにより`eas.json`が作成されます。

### 4. eas.jsonの設定

**ファイル**: `app/eas.json`

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "bundleIdentifier": "com.nandemocounter"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

---

## app.jsonの設定

### 完全な設定例

**ファイル**: `app/app.json`

```json
{
  "expo": {
    "name": "なんでもカウンター",
    "slug": "nandemo-counter",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.nandemocounter",
      "buildNumber": "1",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "このアプリは記録時の位置情報を保存するために位置情報へのアクセスが必要です。"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.nandemocounter",
      "versionCode": 1,
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      "googleServicesFile": "./google-services.json"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy",
          "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
        }
      ]
    ],
    "scheme": "nandemo-counter",
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 重要な設定項目

#### versionとversionCode

- **version**: ユーザーに表示されるバージョン番号（例: "1.0.0"）
- **versionCode** (Android): 各リリースで1ずつ増やす必要がある（例: 1, 2, 3...）
- **buildNumber** (iOS): 各リリースで1ずつ増やす必要がある

#### パッケージ名

- **package** (Android): `com.nandemocounter`
- **bundleIdentifier** (iOS): `com.nandemocounter`

**重要**: 一度リリースしたら変更できません。

#### 権限設定

**Android**:
```json
"permissions": [
  "ACCESS_FINE_LOCATION",
  "ACCESS_COARSE_LOCATION"
]
```

**iOS**:
```json
"infoPlist": {
  "NSLocationWhenInUseUsageDescription": "このアプリは記録時の位置情報を保存するために位置情報へのアクセスが必要です。"
}
```

---

## ビルドプロファイル

### development（開発用）

```json
"development": {
  "developmentClient": true,
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  }
}
```

**用途**: 開発中のテスト用

### preview（プレビュー用）

```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  }
}
```

**用途**: 内部テスト用（APK形式）

### production（本番用）

```json
"production": {
  "android": {
    "buildType": "app-bundle"
  },
  "ios": {
    "bundleIdentifier": "com.nandemocounter"
  }
}
```

**用途**: Google Play/App Storeへの配布用

---

## 環境変数の管理

### .envファイル

**ファイル**: `app/.env`

```env
# AdMob設定
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
EXPO_PUBLIC_ADMOB_IOS_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy

# API設定（将来の拡張用）
EXPO_PUBLIC_API_URL=https://your-api-id.execute-api.ap-northeast-1.amazonaws.com/prod
```

### EAS Secretsの使用

機密情報はEAS Secretsを使用することを推奨：

```bash
# シークレットの設定
eas secret:create --scope project --name ADMOB_ANDROID_APP_ID --value "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
eas secret:create --scope project --name ADMOB_IOS_APP_ID --value "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
```

`eas.json`で参照：

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_ADMOB_ANDROID_APP_ID": "$ADMOB_ANDROID_APP_ID",
        "EXPO_PUBLIC_ADMOB_IOS_APP_ID": "$ADMOB_IOS_APP_ID"
      }
    }
  }
}
```

---

## ビルドコマンド

### 開発ビルド

```bash
cd app
eas build --platform android --profile development
```

### プレビュービルド（APK）

```bash
eas build --platform android --profile preview
```

### 本番ビルド（App Bundle）

```bash
eas build --platform android --profile production
```

### iOSビルド

```bash
eas build --platform ios --profile production
```

### 両プラットフォーム

```bash
eas build --platform all --profile production
```

---

## ビルド後の確認

### チェックリスト

- [ ] ビルドが成功している
- [ ] アプリバンドル（.aab）またはAPKがダウンロードできる
- [ ] バージョン番号が正しい
- [ ] パッケージ名が正しい
- [ ] アプリアイコンが設定されている
- [ ] スプラッシュスクリーンが設定されている

### ローカルでのテスト

```bash
# APKをダウンロードしてインストール
adb install path/to/app.apk

# または、実機に転送してインストール
```

---

## トラブルシューティング

### ビルドエラー

**問題**: `eas build`でエラーが発生する

**解決策**:
1. `eas.json`の設定を確認
2. `app.json`の設定を確認
3. 依存パッケージのバージョンを確認
4. EAS CLIを最新版に更新: `npm install -g eas-cli@latest`
5. ログを確認: `eas build:list`

### バージョンエラー

**問題**: バージョンコードが既に存在する

**解決策**:
1. `app.json`の`versionCode`を増やす
2. 再ビルド

### パッケージ名エラー

**問題**: パッケージ名が既に使用されている

**解決策**:
1. パッケージ名を変更（初回リリース前のみ可能）
2. または、既存のアプリを更新

---

## ステージングと本番環境の使い分け

詳細は [ビルドガイド](./build-guide.md) を参照してください。

### ステージングビルド

```bash
cd app
eas build --platform android --profile staging
```

### 本番ビルド

```bash
cd app
eas build --platform android --profile production
```

---

## 参考資料

- [EAS Build ドキュメント](https://docs.expo.dev/build/introduction/)
- [app.json リファレンス](https://docs.expo.dev/versions/latest/config/app/)
- [EAS CLI コマンドリファレンス](https://docs.expo.dev/build/building-on-ci/)
- [ビルドガイド](./build-guide.md) - ステージングと本番ビルドの詳細
