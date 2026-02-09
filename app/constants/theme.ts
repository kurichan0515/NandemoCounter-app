// constants/theme.ts

export const COLORS = {
  primary: {
    main: '#2196F3', // メインブルー
    light: '#64B5F6',
    dark: '#1976D2',
    background: '#E3F2FD',
  },
  secondary: {
    main: '#4CAF50', // セカンダリグリーン
    light: '#81C784',
    dark: '#388E3C',
    background: '#E8F5E9',
  },
  accent: {
    main: '#FF9800', // アクセントオレンジ
    light: '#FFB74D',
    dark: '#F57C00',
    background: '#FFF3E0',
  },
  status: {
    error: '#F44336', // 削除・減少
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    placeholder: '#999999',
    disabled: '#CCCCCC',
  },
  background: {
    main: '#F5F5F5', // 画面背景
    card: '#FFFFFF', // カード背景
  },
  border: '#E0E0E0',
};

export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: 'bold' as 'bold', lineHeight: 34 },
  h2: { fontSize: 24, fontWeight: 'bold' as 'bold', lineHeight: 29 },
  h3: { fontSize: 18, fontWeight: '600' as '600', lineHeight: 22 },
  body: { fontSize: 16, fontWeight: 'normal' as 'normal', lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: 'normal' as 'normal', lineHeight: 18 },
  countLarge: { fontSize: 72, fontWeight: 'bold' as 'bold', lineHeight: 86 },
  countMedium: { fontSize: 24, fontWeight: 'bold' as 'bold', lineHeight: 29 },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const LAYOUT = {
  borderRadius: {
    md: 8,
    lg: 12,
    pill: 9999,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};
