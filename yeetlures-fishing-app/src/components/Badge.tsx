import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme';

type BadgeVariant = 'default' | 'premium' | 'success' | 'warning' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    const styles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
      default: {
        container: { backgroundColor: theme.colors.background.tertiary },
        text: { color: theme.colors.text.secondary },
      },
      premium: {
        container: { backgroundColor: theme.colors.premium.gold },
        text: { color: theme.colors.white },
      },
      success: {
        container: { backgroundColor: theme.colors.utility.success },
        text: { color: theme.colors.white },
      },
      warning: {
        container: { backgroundColor: theme.colors.utility.warning },
        text: { color: theme.colors.white },
      },
      info: {
        container: { backgroundColor: theme.colors.accent.cool },
        text: { color: theme.colors.white },
      },
    };

    return styles[variant];
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[componentStyles.container, variantStyles.container, style]}>
      <Text style={[componentStyles.text, variantStyles.text, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const componentStyles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.badge,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});
