/**
 * AI Forecaster Screen (Premium Feature)
 * AI-powered fishing forecast and lure recommendations
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Button, Badge } from '../components';
import { theme } from '../theme';

export const AIForecasterScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isPremium] = React.useState(true); // Mock premium status

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Regenerate forecast
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  if (!isPremium) {
    return (
      <View style={styles.premiumPrompt}>
        <Text style={styles.premiumIcon}>🎣</Text>
        <Text style={styles.premiumTitle}>AI Fishing Forecaster</Text>
        <Text style={styles.premiumDescription}>
          Get personalized fishing forecasts powered by AI. Know exactly when and where to fish,
          with specific lure and color recommendations.
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>✓ Best fishing times based on conditions</Text>
          <Text style={styles.feature}>✓ Personalized lure recommendations</Text>
          <Text style={styles.feature}>✓ Pattern detection from your catches</Text>
          <Text style={styles.feature}>✓ Heat maps of productive spots</Text>
        </View>
        <Button
          title="Unlock with Premium"
          variant="premium"
          size="large"
          onPress={() => navigation.navigate('Profile', { screen: 'PremiumUpgrade' })}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Overall Rating */}
      <Card style={styles.ratingCard}>
        <View style={styles.ratingHeader}>
          <Text style={styles.date}>Today - {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}</Text>
          <Badge label="AI Forecast" variant="info" />
        </View>
        <View style={styles.ratingContent}>
          <View style={styles.ratingCircle}>
            <Text style={styles.ratingNumber}>8.5</Text>
            <Text style={styles.ratingMax}>/10</Text>
          </View>
          <View style={styles.ratingDescription}>
            <Text style={styles.ratingTitle}>Excellent Fishing</Text>
            <Text style={styles.ratingText}>
              Strong solunar activity combined with favorable weather creates ideal conditions.
              High barometric pressure and moderate winds.
            </Text>
          </View>
        </View>
      </Card>

      {/* Best Times */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Best Fishing Times</Text>
        <View style={styles.timesList}>
          <View style={styles.timeItem}>
            <View style={styles.timeRating}>
              <Text style={styles.timeRatingNumber}>9.5</Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.timeTitle}>Early Morning Peak</Text>
              <Text style={styles.timeRange}>6:30 AM - 8:30 AM</Text>
              <Text style={styles.timeReason}>
                Major solunar period coincides with sunrise. Ideal temperature and calm winds.
              </Text>
            </View>
          </View>

          <View style={styles.timeItem}>
            <View style={[styles.timeRating, styles.timeRatingMedium]}>
              <Text style={styles.timeRatingNumber}>7.0</Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.timeTitle}>Midday Activity</Text>
              <Text style={styles.timeRange}>12:00 PM - 1:30 PM</Text>
              <Text style={styles.timeReason}>
                Minor solunar period with peak temperature. Fish may be deeper.
              </Text>
            </View>
          </View>

          <View style={styles.timeItem}>
            <View style={styles.timeRating}>
              <Text style={styles.timeRatingNumber}>9.0</Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.timeTitle}>Evening Golden Hour</Text>
              <Text style={styles.timeRange}>6:45 PM - 8:30 PM</Text>
              <Text style={styles.timeReason}>
                Major solunar period at sunset. Topwater action highly probable.
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Recommended Lures */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended YeetLures</Text>
        <View style={styles.luresList}>
          <View style={styles.lureItem}>
            <View style={styles.lureImage}>
              <Text style={styles.lureIcon}>🎣</Text>
            </View>
            <View style={styles.lureInfo}>
              <View style={styles.lureHeader}>
                <Text style={styles.lureName}>Pro Crankbait</Text>
                <Badge label="95% Match" variant="success" />
              </View>
              <Text style={styles.lureColor}>Color: Chartreuse</Text>
              <Text style={styles.lureReason}>
                Perfect for current water clarity and low-light conditions. Proven effective in
                similar conditions based on your catch history.
              </Text>
            </View>
          </View>

          <View style={styles.lureItem}>
            <View style={styles.lureImage}>
              <Text style={styles.lureIcon}>🎣</Text>
            </View>
            <View style={styles.lureInfo}>
              <View style={styles.lureHeader}>
                <Text style={styles.lureName}>Topwater Popper</Text>
                <Badge label="88% Match" variant="success" />
              </View>
              <Text style={styles.lureColor}>Color: White</Text>
              <Text style={styles.lureReason}>
                Ideal for evening session. Surface activity expected during sunset major period.
              </Text>
            </View>
          </View>

          <View style={styles.lureItem}>
            <View style={styles.lureImage}>
              <Text style={styles.lureIcon}>🎣</Text>
            </View>
            <View style={styles.lureInfo}>
              <View style={styles.lureHeader}>
                <Text style={styles.lureName}>Soft Plastic Jig</Text>
                <Badge label="82% Match" variant="info" />
              </View>
              <Text style={styles.lureColor}>Color: Green Pumpkin</Text>
              <Text style={styles.lureReason}>
                Versatile backup option. Effective for deeper structure during midday lull.
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* AI Insights */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>AI Insights from Your Data</Text>
        <View style={styles.insightsList}>
          <View style={styles.insight}>
            <Text style={styles.insightIcon}>📊</Text>
            <Text style={styles.insightText}>
              You've caught 3x more bass in similar conditions using chartreuse lures
            </Text>
          </View>
          <View style={styles.insight}>
            <Text style={styles.insightIcon}>🌡</Text>
            <Text style={styles.insightText}>
              Your best catches occurred between 68-75°F with rising barometric pressure
            </Text>
          </View>
          <View style={styles.insight}>
            <Text style={styles.insightIcon}>🌙</Text>
            <Text style={styles.insightText}>
              80% of your trophy fish were caught during major solunar periods
            </Text>
          </View>
        </View>
      </Card>

      <Button
        title="View Pattern Analysis"
        variant="outline"
        size="large"
        onPress={() => {}}
        style={styles.analysisButton}
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
    paddingBottom: theme.spacing.xxxl,
  },
  premiumPrompt: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.xl,
  },
  premiumTitle: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  premiumDescription: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  featureList: {
    marginBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  feature: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
  },
  ratingCard: {
    marginBottom: theme.spacing.lg,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  date: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
  },
  ratingContent: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  ratingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  ratingMax: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.white,
  },
  ratingDescription: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  ratingText: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.bodySmall * theme.typography.lineHeight.relaxed,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  timesList: {
    gap: theme.spacing.lg,
  },
  timeItem: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  timeRating: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRatingMedium: {
    backgroundColor: theme.colors.accent.cool,
  },
  timeRatingNumber: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  timeInfo: {
    flex: 1,
  },
  timeTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  timeRange: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.accent.primary,
    marginBottom: theme.spacing.xs,
  },
  timeReason: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.bodySmall * theme.typography.lineHeight.normal,
  },
  luresList: {
    gap: theme.spacing.lg,
  },
  lureItem: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  lureImage: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lureIcon: {
    fontSize: 32,
  },
  lureInfo: {
    flex: 1,
  },
  lureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  lureName: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  lureColor: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.accent.primary,
    marginBottom: theme.spacing.xs,
  },
  lureReason: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.bodySmall * theme.typography.lineHeight.normal,
  },
  insightsList: {
    gap: theme.spacing.md,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  insightIcon: {
    fontSize: 24,
  },
  insightText: {
    flex: 1,
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.fontSize.bodySmall * theme.typography.lineHeight.normal,
  },
  analysisButton: {
    marginBottom: theme.spacing.lg,
  },
});
