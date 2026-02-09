import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../constants/theme';

/**
 * 共通スタイル
 * テーマを使用した共通スタイル定義
 */
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.main,
  },
  content: {
    padding: SPACING.xl,
  },
  label: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...LAYOUT.shadow,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
  },
});
