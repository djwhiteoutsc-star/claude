/**
 * Catch List Screen
 * Display all logged catches with filtering and sorting
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Card, Button } from '../components';
import { theme } from '../theme';

export const CatchListScreen = ({ navigation }: any) => {
  // Mock data - replace with actual data from Firestore
  const catches = [
    {
      id: '1',
      species: 'Largemouth Bass',
      weight: 3.2,
      length: 18,
      location: 'Lake Thompson',
      date: new Date(),
      photo: null,
    },
    {
      id: '2',
      species: 'Rainbow Trout',
      weight: 1.8,
      length: 14,
      location: 'River Creek',
      date: new Date(Date.now() - 86400000),
      photo: null,
    },
  ];

  const renderCatch = ({ item }: any) => (
    <Card style={styles.catchCard} onPress={() => {}}>
      <View style={styles.catchContent}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.catchPhoto} />
        ) : (
          <View style={styles.catchPhotoPlaceholder}>
            <Text style={styles.placeholderText}>📸</Text>
          </View>
        )}
        <View style={styles.catchInfo}>
          <Text style={styles.species}>{item.species}</Text>
          <View style={styles.measurements}>
            {item.weight && (
              <Text style={styles.measurement}>{item.weight} lbs</Text>
            )}
            {item.length && (
              <Text style={styles.measurement}>{item.length}"</Text>
            )}
          </View>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.date}>
            {item.date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={catches}
        renderItem={renderCatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No catches logged yet</Text>
            <Text style={styles.emptyText}>
              Start logging your catches to track your fishing success
            </Text>
          </View>
        }
      />

      <View style={styles.fab}>
        <Button
          title="+ Log New Catch"
          size="large"
          onPress={() => navigation.navigate('AddCatch')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  list: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  catchCard: {
    marginBottom: theme.spacing.md,
  },
  catchContent: {
    flexDirection: 'row',
  },
  catchPhoto: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
    marginRight: theme.spacing.md,
  },
  catchPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background.tertiary,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  catchInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  species: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  measurements: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  measurement: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.accent.primary,
  },
  location: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.tertiary,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xxl,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  empty: {
    alignItems: 'center',
    paddingTop: theme.spacing.huge,
    paddingHorizontal: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
