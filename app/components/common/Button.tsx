import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.text.disabled;
    
    switch (variant) {
      case 'primary':
        return COLORS.primary.main;
      case 'danger':
        return COLORS.background.card; // 白背景
      case 'secondary':
        return COLORS.background.card; // 白背景
      default:
        return COLORS.primary.main;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.text.disabled;
    
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'danger':
        return COLORS.status.error; // 赤文字
      case 'secondary':
        return COLORS.primary.main; // 青文字
      default:
        return '#FFFFFF';
    }
  };

  const getBorder = () => {
    if (disabled) {
      return { borderWidth: 1, borderColor: COLORS.text.disabled };
    }
    
    if (variant === 'danger') {
      return { borderWidth: 1, borderColor: COLORS.status.error };
    }
    if (variant === 'secondary') {
      return { borderWidth: 1, borderColor: COLORS.primary.main };
    }
    return {};
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        getBorder(),
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: LAYOUT.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
});
