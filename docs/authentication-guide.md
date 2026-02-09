# 認証設定ガイド

## 目次

1. [現状の実装](#現状の実装)
2. [将来の拡張（クラウド同期）](#将来の拡張クラウド同期)
3. [匿名認証の実装](#匿名認証の実装)
4. [Cognito設定](#cognito設定)

---

## 現状の実装

### 会員登録なしでの利用

現在のアプリは**会員登録なしで利用可能**な設計になっています。

#### 実装方法

1. **デバイスIDの自動生成**
   - アプリ初回起動時にUUIDを自動生成
   - AsyncStorageに保存
   - 以降は同じIDを使用

2. **ローカルストレージ**
   - すべてのデータをAsyncStorageに保存
   - クラウドサーバーへの送信なし
   - デバイス内のみで完結

#### メリット

- 即座に利用開始可能
- 認証フローが不要
- プライバシーに配慮（データがローカルのみ）

#### デメリット

- デバイス間でのデータ同期不可
- デバイス変更時にデータが引き継げない
- バックアップ機能がない

---

## 将来の拡張（クラウド同期）

クラウド同期機能を追加する場合の実装方法です。

### 設計方針

- **デバイスIDベースの匿名認証**: ユーザー登録不要
- **オプトイン方式**: ユーザーが明示的に有効化
- **段階的移行**: 既存のローカルデータをクラウドに移行可能

---

## 匿名認証の実装

### 1. Cognito Identity Poolの設定

**ファイル**: `terraform/cognito.tf`

既に設定済みのCognito Identity Poolを使用します。

### 2. 匿名認証の実装例

**ファイル**: `app/services/auth.ts`（将来の拡張用）

```typescript
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { storageService } from './storage';

class AuthService {
  private identityPoolId: string;
  private userPoolId: string;
  private region: string;

  constructor() {
    this.identityPoolId = process.env.EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID || '';
    this.userPoolId = process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID || '';
    this.region = process.env.EXPO_PUBLIC_AWS_REGION || 'ap-northeast-1';
  }

  /**
   * デバイスIDを使用した匿名認証
   */
  async authenticateAnonymously(): Promise<any> {
    const deviceId = await storageService.getDeviceId();

    const credentials = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: this.region }),
      identityPoolId: this.identityPoolId,
      logins: {
        [`cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`]: deviceId,
      },
    });

    return credentials;
  }

  /**
   * AWS認証情報の取得
   */
  async getCredentials() {
    return await this.authenticateAnonymously();
  }
}

export const authService = new AuthService();
```

### 3. クラウド同期の実装

**ファイル**: `app/services/sync.ts`（将来の拡張用）

```typescript
import { authService } from './auth';
import { storageService } from './storage';
import { StorageData } from '../types';

class SyncService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL || '';
  }

  /**
   * ローカルデータをクラウドにアップロード
   */
  async uploadToCloud(): Promise<void> {
    const credentials = await authService.getCredentials();
    const localData = await storageService.loadAllData();

    // API Gateway経由でDynamoDBに保存
    // 実装はLambda関数で行う
  }

  /**
   * クラウドからデータをダウンロード
   */
  async downloadFromCloud(): Promise<StorageData | null> {
    const credentials = await authService.getCredentials();

    // API Gateway経由でDynamoDBから取得
    // 実装はLambda関数で行う
    return null;
  }

  /**
   * クラウド同期を有効化
   */
  async enableSync(): Promise<void> {
    // ユーザーが明示的に有効化
    // ローカルデータをクラウドにアップロード
    await this.uploadToCloud();
  }

  /**
   * クラウド同期を無効化
   */
  async disableSync(): Promise<void> {
    // クラウドデータを削除（オプション）
    // ローカルデータは保持
  }
}

export const syncService = new SyncService();
```

---

## Cognito設定

### 1. Terraformでの設定確認

**ファイル**: `terraform/cognito.tf`

既に以下のリソースが設定されています：

- Cognito User Pool
- Cognito User Pool Client
- Cognito User Pool Domain
- Cognito Identity Pool

### 2. 環境変数の設定

**ファイル**: `app/.env`

```env
# Cognito設定（クラウド同期時に使用）
EXPO_PUBLIC_COGNITO_USER_POOL_ID=ap-northeast-1_xxxxxxxxx
EXPO_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_COGNITO_DOMAIN=nandemo-counter-dev.auth.ap-northeast-1.amazoncognito.com
EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID=ap-northeast-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
EXPO_PUBLIC_AWS_REGION=ap-northeast-1
```

### 3. 必要なパッケージ

クラウド同期を実装する場合、以下のパッケージが必要：

```bash
cd app
npm install @aws-sdk/client-cognito-identity @aws-sdk/credential-provider-cognito-identity
```

---

## 実装の優先順位

### Phase 1（現在）: ローカルのみ

- ✅ デバイスIDの自動生成
- ✅ ローカルストレージへの保存
- ✅ 認証不要

### Phase 2（将来）: クラウド同期（オプション）

- [ ] 匿名認証の実装
- [ ] クラウド同期機能の実装
- [ ] データ移行機能の実装
- [ ] 同期設定UIの実装

---

## セキュリティ考慮事項

### デバイスIDの管理

- UUID形式でランダムに生成
- デバイスを特定できない形式
- 個人情報と紐付け不可

### データの保護

- ローカルストレージ: 暗号化なし（将来的に実装可能）
- クラウド同期時: AWSのセキュリティ機能を活用

### プライバシー

- 匿名認証により個人を特定できない
- データはデバイスIDと紐付けのみ
- ユーザーが明示的に有効化

---

## 参考資料

- [AWS Cognito 公式ドキュメント](https://docs.aws.amazon.com/cognito/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [Expo セキュアストレージ](https://docs.expo.dev/versions/latest/sdk/securestore/)
