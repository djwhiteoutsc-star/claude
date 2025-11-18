/**
 * Premium Upgrade Screen
 * Subscription pricing and features
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from '../components';
import { theme } from '../theme';

export const PremiumUpgradeScreen = ({ navigation }: any) => {
  const [selectedPlan, setSelectedPlan] = React.useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = () => {
    // TODO: Implement subscription purchase
    console.log('Subscribe to', selectedPlan);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>⭐</Text>
        <Text style={styles.title}>Go Premium</Text>
        <Text style={styles.subtitle}>
          Unlock the full power of AI-driven fishing insights
        </Text>
      </View>

      {/* Features */}
      <Card style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>Premium Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🤖</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureName}>AI Fishing Forecaster</Text>
              <Text style={styles.featureDescription}>
                Get personalized forecasts with best times and lure recommendations
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureName}>Pattern Detection</Text>
              <Text style={styles.featureDescription}>
                Discover patterns in your catches and conditions
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🗺</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureName}>Heat Maps</Text>
              <Text style={styles.featureDescription}>
                Visualize your most productive fishing spots
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📈</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureName}>Advanced Analytics</Text>
              <Text style={styles.featureDescription}>
                Seasonal trends, hourly weather charts, and pressure analysis
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📸</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureName}>Unlimited Photos</Text>
              <Text style={styles.featureDescription}>
                Store unlimited catch photos in the cloud
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🚫</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureName}>Ad-Free Experience</Text>
              <Text style={styles.featureDescription}>
                Enjoy the app without any advertisements
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Pricing */}
      <View style={styles.pricingSection}>
        <Text style={styles.pricingTitle}>Choose Your Plan</Text>

        <Card
          style={[
            styles.planCard,
            selectedPlan === 'yearly' && styles.planCardSelected,
          ]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Yearly</Text>
              <Text style={styles.planSavings}>Save 39%</Text>
            </View>
            <View style={styles.planPricing}>
              <Text style={styles.planPrice}>$29</Text>
              <Text style={styles.planPeriod}>/year</Text>
            </View>
          </View>
          <Text style={styles.planDetail}>Just $2.42/month</Text>
        </Card>

        <Card
          style={[
            styles.planCard,
            selectedPlan === 'monthly' && styles.planCardSelected,
          ]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Monthly</Text>
            <View style={styles.planPricing}>
              <Text style={styles.planPrice}>$3.99</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
          </View>
          <Text style={styles.planDetail}>Billed monthly</Text>
        </Card>
      </View>

      {/* CTA */}
      <Button
        title={`Start ${selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'} Subscription`}
        variant="premium"
        size="large"
        onPress={handleSubscribe}
        style={styles.subscribeButton}
      />

      {/* Fine Print */}
      <Text style={styles.finePrint}>
        Subscription automatically renews unless cancelled at least 24 hours before the end of
        the current period. Manage subscriptions in Account Settings.
      </Text>

      <Button
        title="Restore Purchase"
        variant="ghost"
        onPress={() => {}}
        style={styles.restoreButton}
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
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  featuresCard: {
    marginBottom: theme.spacing.xxl,
  },
  featuresTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  featuresList: {
    gap: theme.spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureText: {
    flex: 1,
  },
  featureName: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.bodySmall * theme.typography.lineHeight.normal,
  },
  pricingSection: {
    marginBottom: theme.spacing.xxl,
  },
  pricingTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  planCard: {
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
  },
  planCardSelected: {
    borderColor: theme.colors.premium.gold,
    backgroundColor: theme.colors.premium.goldLight + '10',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  planName: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  planSavings: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.utility.success,
    marginTop: theme.spacing.xs,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  planPeriod: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
  },
  planDetail: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
  },
  subscribeButton: {
    marginBottom: theme.spacing.lg,
  },
  finePrint: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.caption * theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing.lg,
  },
  restoreButton: {
    marginBottom: theme.spacing.lg,
  },
});
