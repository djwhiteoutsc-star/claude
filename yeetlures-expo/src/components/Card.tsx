import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
  Animated,
} from 'react-native';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevated = true,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.timing(scaleValue, {
      toValue: 1.02,
      duration: theme.animation.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: theme.animation.fast,
      useNativeDriver: true,
    }).start();
  };

  const content = (
    <Animated.View
      style={[
        styles.card,
        elevated && theme.shadows.card,
        { transform: [{ scale: scaleValue }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    padding: theme.spacing.lg,
  },
});
