import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../constants/theme';

interface CounterCardProps {
  name: string;
  count: number;
  todayCount?: number;
  description?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const CounterCard = ({
  name,
  count,
  todayCount = 0,
  description,
  onPress,
  style,
}: CounterCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {todayCount > 0 && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>今日: +{todayCount}</Text>
          </View>
        )}
      </View>

      <Text style={styles.countValue}>{count}</Text>

      {description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...LAYOUT.shadow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  todayBadge: {
    backgroundColor: COLORS.secondary.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  todayBadgeText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.secondary.main,
    fontWeight: '600',
  },
  countValue: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.countMedium.fontWeight,
    color: COLORS.primary.main,
    marginVertical: SPACING.sm,
  },
  description: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
});
