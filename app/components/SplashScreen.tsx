import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

/**
 * スプラッシュスクリーンコンポーネント
 * コンセプト: "Clean Start"（クリーンな始まり）
 */
export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* シンボルロゴ */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoSymbol}>1+</Text>
      </View>

      {/* アプリ名 */}
      <Text style={styles.appName}>なんでもカウンター</Text>

      {/* サブタイトル */}
      <Text style={styles.subtitle}>Nandemo COUNTER</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.card, // #FFFFFF
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoSymbol: {
    fontSize: 80,
    fontWeight: 'bold',
    color: COLORS.primary.main, // #2196F3
    letterSpacing: -2,
  },
  appName: {
    fontSize: TYPOGRAPHY.h1.fontSize + 4, // 32px
    fontWeight: 'bold',
    color: COLORS.text.primary, // #333333
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.h3.fontSize, // 18px
    fontWeight: '500',
    color: COLORS.primary.main, // #2196F3
    letterSpacing: 2, // 0.1em相当（18px * 0.1 ≈ 2px）
  },
});
