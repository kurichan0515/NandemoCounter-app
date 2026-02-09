import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || '';

if (!API_URL) {
  console.warn('EXPO_PUBLIC_API_URL is not set');
}

export const apiConfig = {
  baseURL: API_URL,
  timeout: 10000,
};
