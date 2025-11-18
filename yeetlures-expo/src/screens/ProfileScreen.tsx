/**
 * Profile Screen
 * User settings, stats, and subscription management
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Card, Button, Badge } from '../components';
import { theme } from '../theme';

export const ProfileScreen = ({ navigation }: any) => {
  const [isPremium] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    forecasts: true,
    weather: true,
    reminders: false,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
        {isPremium ? (
          <Badge label="Premium Member" variant="premium" style={styles.badge} />
        ) : (
          <Button
            title="Upgrade to Premium"
            variant="premium"
            size="small"
            onPress={() => navigation.navigate('PremiumUpgrade')}
            style={styles.upgradeButton}
          />
        )}
      </Card>

      {/* Stats */}
      <Card style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Total Catches</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Species</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8.2 lbs</Text>
            <Text style={styles.statLabel}>Biggest Catch</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>Days Fished</Text>
          </View>
        </View>
      </Card>

      {/* Notifications */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Fishing Forecasts</Text>
          <Switch
            value={notifications.forecasts}
            onValueChange={(value) =>
              setNotifications({ ...notifications, forecasts: value })
            }
            trackColor={{ true: theme.colors.accent.primary }}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Weather Alerts</Text>
          <Switch
            value={notifications.weather}
            onValueChange={(value) =>
              setNotifications({ ...notifications, weather: value })
            }
            trackColor={{ true: theme.colors.accent.primary }}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Catch Reminders</Text>
          <Switch
            value={notifications.reminders}
            onValueChange={(value) =>
              setNotifications({ ...notifications, reminders: value })
            }
            trackColor={{ true: theme.colors.accent.primary }}
          />
        </View>
      </Card>

      {/* Preferences */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Units</Text>
          <Text style={styles.preferenceValue}>Imperial (lbs, °F)</Text>
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Default Location</Text>
          <Text style={styles.preferenceValue}>Current Location</Text>
        </View>
      </Card>

      {/* Actions */}
      <Card style={styles.section}>
        <Button
          title="Edit Profile"
          variant="outline"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <Button
          title="Export My Data"
          variant="outline"
          onPress={() => {}}
          style={styles.actionButton}
        />
        {isPremium && (
          <Button
            title="Manage Subscription"
            variant="outline"
            onPress={() => {}}
            style={styles.actionButton}
          />
        )}
        <Button
          title="Sign Out"
          variant="ghost"
          onPress={() => {}}
          style={styles.actionButton}
        />
      </Card>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>YeetLures Fishing Companion v1.0.0</Text>
        <View style={styles.links}>
          <Text style={styles.link}>Privacy Policy</Text>
          <Text style={styles.linkSeparator}>•</Text>
          <Text style={styles.link}>Terms of Service</Text>
          <Text style={styles.linkSeparator}>•</Text>
          <Text style={styles.link}>Support</Text>
        </View>
      </View>
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  name: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  badge: {
    marginTop: theme.spacing.sm,
  },
  upgradeButton: {
    marginTop: theme.spacing.sm,
  },
  statsCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
  statItem: {
    width: '45%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  settingLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  preferenceLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
  },
  preferenceValue: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  appVersion: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.sm,
  },
  links: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  link: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.accent.primary,
  },
  linkSeparator: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.tertiary,
  },
});
