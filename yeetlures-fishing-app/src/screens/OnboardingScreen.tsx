/**
 * Onboarding Screen
 * Welcome new users and explain key features
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../components';
import { theme } from '../theme';

export const OnboardingScreen = ({ navigation }: any) => {
  const [currentPage, setCurrentPage] = React.useState(0);

  const pages = [
    {
      title: 'Welcome to YeetLures',
      subtitle: 'Your Premium Fishing Companion',
      description: 'Log catches, track conditions, and discover the perfect lure for every situation.',
    },
    {
      title: 'Smart Catch Logging',
      subtitle: 'Never Forget a Great Catch',
      description: 'Capture every detail: species, weight, location, weather conditions, and photos. Build your fishing history.',
    },
    {
      title: 'AI-Powered Forecasting',
      subtitle: 'Know When to Fish',
      description: 'Get personalized fishing forecasts based on weather, solunar data, and AI analysis. Premium feature.',
    },
    {
      title: 'YeetLures Library',
      subtitle: 'The Right Lure, Every Time',
      description: 'Browse our complete lure collection with color recommendations, techniques, and ideal conditions.',
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.replace('Main');
    }
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  const page = pages[currentPage];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.imageePlaceholder}>
            {/* Add illustration here */}
            <Text style={styles.pageNumber}>{currentPage + 1}/{pages.length}</Text>
          </View>
        </View>

        <View style={styles.textContent}>
          <Text style={styles.title}>{page.title}</Text>
          <Text style={styles.subtitle}>{page.subtitle}</Text>
          <Text style={styles.description}>{page.description}</Text>
        </View>

        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {currentPage < pages.length - 1 && (
          <Button
            title="Skip"
            variant="ghost"
            onPress={handleSkip}
            style={styles.skipButton}
          />
        )}
        <Button
          title={currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.huge,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  imageePlaceholder: {
    width: 280,
    height: 280,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.radius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent.primary,
  },
  textContent: {
    marginBottom: theme.spacing.xxxl,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.accent.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border.medium,
  },
  activeDot: {
    backgroundColor: theme.colors.accent.primary,
    width: 24,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
