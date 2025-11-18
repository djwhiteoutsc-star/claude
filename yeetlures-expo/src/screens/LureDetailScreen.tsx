/**
 * Lure Detail Screen
 * Detailed information about a specific lure
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Badge } from '../components';
import { theme } from '../theme';

export const LureDetailScreen = ({ route, navigation }: any) => {
  const { lureId } = route.params;

  // Mock lure data
  const lure = {
    id: lureId,
    name: 'YeetLure Pro Crankbait',
    type: 'Crankbait',
    description: 'Premium crankbait designed for aggressive bass fishing. Features rattling chambers and lifelike action.',
    colors: ['Chartreuse', 'Fire Tiger', 'Shad', 'Black & Blue'],
    weight: 0.5,
    length: 3.5,
    targetSpecies: ['Largemouth Bass', 'Smallmouth Bass', 'Walleye'],
    techniques: ['Cast and retrieve', 'Twitching', 'Stop and go'],
    idealConditions: {
      waterConditions: ['Clear', 'Stained'],
      seasons: ['Spring', 'Summer', 'Fall'],
      weather: ['Partly cloudy', 'Overcast'],
    },
    productUrl: 'https://yeetlures.com/products/pro-crankbait',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Lure Image */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🎣</Text>
        </View>
      </View>

      {/* Basic Info */}
      <Card style={styles.section}>
        <Text style={styles.lureName}>{lure.name}</Text>
        <View style={styles.badges}>
          <Badge label={lure.type} variant="default" />
          <Badge label="YeetLures" variant="success" />
        </View>
        <Text style={styles.description}>{lure.description}</Text>
      </Card>

      {/* Specifications */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Weight:</Text>
          <Text style={styles.specValue}>{lure.weight} oz</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Length:</Text>
          <Text style={styles.specValue}>{lure.length}"</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Target Species:</Text>
          <Text style={styles.specValue}>{lure.targetSpecies.join(', ')}</Text>
        </View>
      </Card>

      {/* Available Colors */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Available Colors</Text>
        <View style={styles.colorGrid}>
          {lure.colors.map((color, index) => (
            <View key={index} style={styles.colorItem}>
              <View style={styles.colorSwatch} />
              <Text style={styles.colorName}>{color}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Ideal Conditions */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Ideal Conditions</Text>
        <View style={styles.conditionRow}>
          <Text style={styles.conditionLabel}>Water:</Text>
          <Text style={styles.conditionValue}>
            {lure.idealConditions.waterConditions.join(', ')}
          </Text>
        </View>
        <View style={styles.conditionRow}>
          <Text style={styles.conditionLabel}>Seasons:</Text>
          <Text style={styles.conditionValue}>
            {lure.idealConditions.seasons.join(', ')}
          </Text>
        </View>
        <View style={styles.conditionRow}>
          <Text style={styles.conditionLabel}>Weather:</Text>
          <Text style={styles.conditionValue}>
            {lure.idealConditions.weather.join(', ')}
          </Text>
        </View>
      </Card>

      {/* Techniques */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Techniques</Text>
        {lure.techniques.map((technique, index) => (
          <View key={index} style={styles.techniqueItem}>
            <Text style={styles.techniqueBullet}>•</Text>
            <Text style={styles.techniqueText}>{technique}</Text>
          </View>
        ))}
      </Card>

      {/* My Notes */}
      <Card style={styles.section}>
        <View style={styles.notesHeader}>
          <Text style={styles.sectionTitle}>My Notes</Text>
          <Button title="+ Add Note" variant="outline" size="small" onPress={() => {}} />
        </View>
        <Text style={styles.noNotes}>No notes yet. Add your fishing experiences with this lure.</Text>
      </Card>

      {/* Actions */}
      <Button
        title="Shop on YeetLures.com"
        variant="primary"
        size="large"
        onPress={() => {}}
        style={styles.shopButton}
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
    paddingBottom: theme.spacing.xxxl,
  },
  imageContainer: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.xxxl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  section: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  lureName: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  description: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  specLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
  },
  specValue: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  colorItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.accent.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  colorName: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.primary,
  },
  conditionRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  conditionLabel: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    width: 100,
  },
  conditionValue: {
    flex: 1,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
  },
  techniqueItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  techniqueBullet: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.accent.primary,
    marginRight: theme.spacing.sm,
  },
  techniqueText: {
    flex: 1,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  noNotes: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
  },
  shopButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
});
