import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { theme } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg },
      medium: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl },
      large: { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xxl },
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.accent.primary,
      },
      secondary: {
        backgroundColor: theme.colors.accent.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.accent.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      premium: {
        backgroundColor: theme.colors.premium.gold,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<ButtonSize, TextStyle> = {
      small: { fontSize: theme.typography.fontSize.caption },
      medium: { fontSize: theme.typography.fontSize.body },
      large: { fontSize: theme.typography.fontSize.h3 },
    };

    const variantStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: theme.colors.white },
      secondary: { color: theme.colors.white },
      outline: { color: theme.colors.accent.primary },
      ghost: { color: theme.colors.accent.primary },
      premium: { color: theme.colors.white },
    };

    return {
      fontWeight: theme.typography.fontWeight.semiBold,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[getButtonStyle(), style]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'outline' || variant === 'ghost' ? theme.colors.accent.primary : theme.colors.white}
          />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text style={[getTextStyle(), textStyle, icon && { marginLeft: theme.spacing.sm }]}>
              {title}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({});
