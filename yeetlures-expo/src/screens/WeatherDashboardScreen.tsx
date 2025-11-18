/**
 * Weather Dashboard Screen
 * Comprehensive weather and solunar data
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card } from '../components';
import { theme } from '../theme';

export const WeatherDashboardScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Fetch fresh weather data
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
      {/* Current Conditions */}
      <Card style={styles.currentCard}>
        <Text style={styles.location}>Lake Thompson</Text>
        <View style={styles.currentTemp}>
          <Text style={styles.temperature}>72°</Text>
          <Text style={styles.conditions}>Partly Cloudy</Text>
        </View>
        <Text style={styles.feelsLike}>Feels like 70°</Text>
      </Card>

      {/* Key Metrics */}
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricIcon}>💨</Text>
          <Text style={styles.metricValue}>5 mph</Text>
          <Text style={styles.metricLabel}>Wind NE</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricIcon}>📊</Text>
          <Text style={styles.metricValue}>30.12</Text>
          <Text style={styles.metricLabel}>Pressure</Text>
        </Card>
      </View>

      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricIcon}>💧</Text>
          <Text style={styles.metricValue}>65%</Text>
          <Text style={styles.metricLabel}>Humidity</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricIcon}>👁</Text>
          <Text style={styles.metricValue}>10 mi</Text>
          <Text style={styles.metricLabel}>Visibility</Text>
        </Card>
      </View>

      {/* Sun & Moon */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Sun & Moon</Text>
        <View style={styles.sunMoonGrid}>
          <View style={styles.sunMoonItem}>
            <Text style={styles.sunMoonLabel}>Sunrise</Text>
            <Text style={styles.sunMoonValue}>6:24 AM</Text>
          </View>
          <View style={styles.sunMoonItem}>
            <Text style={styles.sunMoonLabel}>Sunset</Text>
            <Text style={styles.sunMoonValue}>7:48 PM</Text>
          </View>
          <View style={styles.sunMoonItem}>
            <Text style={styles.sunMoonLabel}>Moonrise</Text>
            <Text style={styles.sunMoonValue}>8:15 PM</Text>
          </View>
          <View style={styles.sunMoonItem}>
            <Text style={styles.sunMoonLabel}>Moonset</Text>
            <Text style={styles.sunMoonValue}>7:30 AM</Text>
          </View>
        </View>
        <View style={styles.moonPhase}>
          <Text style={styles.moonIcon}>🌕</Text>
          <View>
            <Text style={styles.moonPhaseText}>Waxing Gibbous</Text>
            <Text style={styles.moonIllumination}>85% Illuminated</Text>
          </View>
        </View>
      </Card>

      {/* Solunar Forecast */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Solunar Activity</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>4.5/5</Text>
          </View>
        </View>
        <Text style={styles.solunarDescription}>
          Excellent fishing conditions today with major and minor feeding periods.
        </Text>
        <View style={styles.periodsList}>
          <View style={styles.period}>
            <View style={[styles.periodBadge, styles.majorPeriod]}>
              <Text style={styles.periodBadgeText}>Major</Text>
            </View>
            <Text style={styles.periodTime}>6:30 AM - 8:30 AM</Text>
            <Text style={styles.periodRating}>⭐⭐⭐⭐⭐</Text>
          </View>
          <View style={styles.period}>
            <View style={[styles.periodBadge, styles.minorPeriod]}>
              <Text style={styles.periodBadgeText}>Minor</Text>
            </View>
            <Text style={styles.periodTime}>12:15 PM - 1:15 PM</Text>
            <Text style={styles.periodRating}>⭐⭐⭐</Text>
          </View>
          <View style={styles.period}>
            <View style={[styles.periodBadge, styles.majorPeriod]}>
              <Text style={styles.periodBadgeText}>Major</Text>
            </View>
            <Text style={styles.periodTime}>6:45 PM - 8:45 PM</Text>
            <Text style={styles.periodRating}>⭐⭐⭐⭐⭐</Text>
          </View>
        </View>
      </Card>

      {/* Hourly Forecast (Premium) */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <Text style={styles.premiumLabel}>Premium</Text>
        </View>
        <View style={styles.hourlyList}>
          {[
            { time: 'Now', temp: 72, icon: '⛅' },
            { time: '2 PM', temp: 75, icon: '⛅' },
            { time: '3 PM', temp: 76, icon: '☁️' },
            { time: '4 PM', temp: 75, icon: '☁️' },
            { time: '5 PM', temp: 73, icon: '🌤' },
          ].map((hour, index) => (
            <View key={index} style={styles.hourlyItem}>
              <Text style={styles.hourlyTime}>{hour.time}</Text>
              <Text style={styles.hourlyIcon}>{hour.icon}</Text>
              <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Barometric Pressure Trend (Premium) */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pressure Trend</Text>
          <Text style={styles.premiumLabel}>Premium</Text>
        </View>
        <View style={styles.pressureTrend}>
          <Text style={styles.trendIcon}>📈</Text>
          <Text style={styles.trendText}>Rising - Good for fishing</Text>
        </View>
        <View style={styles.pressureChart}>
          <Text style={styles.chartPlaceholder}>Pressure chart (24h)</Text>
        </View>
      </Card>
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
  currentCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    marginBottom: theme.spacing.lg,
  },
  location: {
    fontSize: theme.typography.fontSize.h3,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  currentTemp: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  temperature: {
    fontSize: 72,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  conditions: {
    fontSize: theme.typography.fontSize.h3,
    color: theme.colors.text.secondary,
  },
  feelsLike: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.tertiary,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  sunMoonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sunMoonItem: {
    width: '45%',
  },
  sunMoonLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  sunMoonValue: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  moonPhase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  moonIcon: {
    fontSize: 48,
  },
  moonPhaseText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  moonIllumination: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
  },
  ratingBadge: {
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.badge,
  },
  ratingText: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.white,
  },
  solunarDescription: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  periodsList: {
    gap: theme.spacing.md,
  },
  period: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  periodBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.badge,
    minWidth: 60,
  },
  majorPeriod: {
    backgroundColor: theme.colors.accent.primary,
  },
  minorPeriod: {
    backgroundColor: theme.colors.accent.cool,
  },
  periodBadgeText: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.white,
    textAlign: 'center',
  },
  periodTime: {
    flex: 1,
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.primary,
  },
  periodRating: {
    fontSize: theme.typography.fontSize.caption,
  },
  premiumLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.premium.gold,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  hourlyList: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  hourlyItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  hourlyTime: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
  },
  hourlyIcon: {
    fontSize: 32,
  },
  hourlyTemp: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  pressureTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  trendIcon: {
    fontSize: 24,
  },
  trendText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
  },
  pressureChart: {
    height: 120,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.tertiary,
  },
});
