/**
 * Home Dashboard Screen
 * Quick overview of recent catches, weather, and AI recommendations
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Button, Badge } from '../components';
import { theme } from '../theme';

export const HomeScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isPremium, setIsPremium] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refresh data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning, Angler</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })}</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Total Catches</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Species</Text>
        </Card>
      </View>

      {/* AI Forecast Card (Premium) */}
      <Card style={styles.forecastCard} onPress={() => navigation.navigate('AIForecaster')}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Today's Forecast</Text>
          {!isPremium && <Badge label="Premium" variant="premium" />}
        </View>
        {isPremium ? (
          <>
            <View style={styles.forecastRating}>
              <Text style={styles.ratingNumber}>8.5</Text>
              <Text style={styles.ratingLabel}>/10 Fishing Rating</Text>
            </View>
            <Text style={styles.forecastText}>
              Excellent conditions this morning. High barometric pressure and solunar activity peak at 6:30 AM.
            </Text>
            <Text style={styles.recommendedLure}>
              Recommended: YeetLure Crankbait (Chartreuse)
            </Text>
          </>
        ) : (
          <View style={styles.premiumPrompt}>
            <Text style={styles.premiumText}>
              Unlock AI-powered fishing forecasts and lure recommendations
            </Text>
            <Button
              title="Go Premium"
              variant="premium"
              size="small"
              onPress={() => navigation.navigate('Profile', { screen: 'PremiumUpgrade' })}
            />
          </View>
        )}
      </Card>

      {/* Current Conditions */}
      <Card style={styles.conditionsCard}>
        <Text style={styles.cardTitle}>Current Conditions</Text>
        <View style={styles.conditionsGrid}>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionValue}>72°F</Text>
            <Text style={styles.conditionLabel}>Temperature</Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionValue}>5 mph</Text>
            <Text style={styles.conditionLabel}>Wind</Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionValue}>30.12</Text>
            <Text style={styles.conditionLabel}>Pressure</Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionValue}>🌕 85%</Text>
            <Text style={styles.conditionLabel}>Moon</Text>
          </View>
        </View>
        <Button
          title="View Full Forecast"
          variant="outline"
          size="small"
          onPress={() => navigation.navigate('Weather')}
          style={styles.viewMoreButton}
        />
      </Card>

      {/* Recent Catches */}
      <Card style={styles.recentCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Catches</Text>
          <Button
            title="View All"
            variant="ghost"
            size="small"
            onPress={() => navigation.navigate('Catches')}
          />
        </View>
        <View style={styles.catchItem}>
          <Text style={styles.catchSpecies}>Largemouth Bass</Text>
          <View style={styles.catchDetails}>
            <Text style={styles.catchWeight}>3.2 lbs</Text>
            <Text style={styles.catchDate}>Today, 7:30 AM</Text>
          </View>
        </View>
        <View style={styles.catchItem}>
          <Text style={styles.catchSpecies}>Rainbow Trout</Text>
          <View style={styles.catchDetails}>
            <Text style={styles.catchWeight}>1.8 lbs</Text>
            <Text style={styles.catchDate}>Yesterday, 6:15 AM</Text>
          </View>
        </View>
      </Card>

      {/* Quick Actions */}
      <Button
        title="Log New Catch"
        size="large"
        onPress={() => navigation.navigate('Catches', { screen: 'AddCatch' })}
        style={styles.logButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  statValue: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  forecastCard: {
    marginBottom: theme.spacing.lg,
  },
  conditionsCard: {
    marginBottom: theme.spacing.lg,
  },
  recentCard: {
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  forecastRating: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent.primary,
  },
  ratingLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
  },
  forecastText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  recommendedLure: {
    fontSize: theme.typography.fontSize.bodySmall,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.accent.secondary,
  },
  premiumPrompt: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  premiumText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  conditionItem: {
    width: '45%',
  },
  conditionValue: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  conditionLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
  },
  viewMoreButton: {
    marginTop: theme.spacing.sm,
  },
  catchItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  catchSpecies: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  catchDetails: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  catchWeight: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.accent.primary,
  },
  catchDate: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.tertiary,
  },
  logButton: {
    marginBottom: theme.spacing.lg,
  },
});
