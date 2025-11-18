/**
 * Add Catch Screen
 * Form to log a new catch with photos, location, and weather
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button, Card } from '../components';
import { theme } from '../theme';

export const AddCatchScreen = ({ navigation }: any) => {
  const [species, setSpecies] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [length, setLength] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    if (!species.trim()) {
      Alert.alert('Error', 'Please enter the species');
      return;
    }

    setLoading(true);
    // TODO: Save catch to Firestore
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Photo Upload */}
      <Card style={styles.photoSection}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photoGrid}>
          <View style={styles.addPhotoButton}>
            <Text style={styles.addPhotoText}>+ Add Photo</Text>
          </View>
        </View>
      </Card>

      {/* Basic Info */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Catch Details</Text>
        <Input
          label="Species *"
          placeholder="e.g., Largemouth Bass"
          value={species}
          onChangeText={setSpecies}
        />
        <View style={styles.row}>
          <Input
            label="Weight (lbs)"
            placeholder="0.0"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
            containerStyle={styles.halfInput}
          />
          <Input
            label="Length (inches)"
            placeholder="0.0"
            keyboardType="decimal-pad"
            value={length}
            onChangeText={setLength}
            containerStyle={styles.halfInput}
          />
        </View>
        <Input
          label="Notes"
          placeholder="Add any notes about this catch..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </Card>

      {/* Location */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Button
            title="Use Current"
            variant="outline"
            size="small"
            onPress={() => {}}
          />
        </View>
        <Text style={styles.autoCapture}>
          📍 Lake Thompson (37.7749° N, 122.4194° W)
        </Text>
      </Card>

      {/* Weather */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weather</Text>
          <Text style={styles.autoCapture}>Auto-captured</Text>
        </View>
        <View style={styles.weatherGrid}>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Temp</Text>
            <Text style={styles.weatherValue}>72°F</Text>
          </View>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Wind</Text>
            <Text style={styles.weatherValue}>5 mph NE</Text>
          </View>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Pressure</Text>
            <Text style={styles.weatherValue}>30.12 mb</Text>
          </View>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Moon</Text>
            <Text style={styles.weatherValue}>🌕 85%</Text>
          </View>
        </View>
      </Card>

      {/* Lure Used */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Lure Used (Optional)</Text>
        <Button
          title="Select Lure"
          variant="outline"
          onPress={() => {}}
        />
      </Card>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.actionButton}
        />
        <Button
          title="Save Catch"
          onPress={handleSave}
          loading={loading}
          style={[styles.actionButton, styles.saveButton]}
        />
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
  photoSection: {
    marginBottom: theme.spacing.lg,
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
    marginBottom: theme.spacing.md,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
  },
  addPhotoText: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  autoCapture: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  weatherItem: {
    width: '45%',
  },
  weatherLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  weatherValue: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});
