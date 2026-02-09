// アプリケーション定数

export const AWS_REGION = process.env.EXPO_PUBLIC_AWS_REGION || 'ap-northeast-1';

export const S3_BUCKET = process.env.EXPO_PUBLIC_S3_BUCKET || '';

export const COGNITO_CONFIG = {
  userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID || '',
  clientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID || '',
  domain: process.env.EXPO_PUBLIC_COGNITO_DOMAIN || '',
  identityPoolId: process.env.EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID || '',
};

// テーマをエクスポート
export * from './theme';
