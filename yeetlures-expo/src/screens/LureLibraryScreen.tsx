/**
 * Lure Library Screen
 * Browse YeetLures products with filtering
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Badge, Input } from '../components';
import { theme } from '../theme';

export const LureLibraryScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Mock lure data
  const lures = [
    {
      id: '1',
      name: 'YeetLure Pro Crankbait',
      type: 'Crankbait',
      colors: ['Chartreuse', 'Fire Tiger', 'Shad'],
      targetSpecies: ['Bass', 'Walleye'],
      isPremium: false,
    },
    {
      id: '2',
      name: 'YeetLure Deep Diver',
      type: 'Crankbait',
      colors: ['Blue Chrome', 'Natural Shad'],
      targetSpecies: ['Bass', 'Pike'],
      isPremium: true,
    },
    {
      id: '3',
      name: 'YeetLure Topwater Popper',
      type: 'Topwater',
      colors: ['White', 'Yellow Perch', 'Frog'],
      targetSpecies: ['Bass', 'Pike'],
      isPremium: false,
    },
  ];

  const renderLure = ({ item }: any) => (
    <Card
      style={styles.lureCard}
      onPress={() => navigation.navigate('LureDetail', { lureId: item.id })}
    >
      <View style={styles.lureImage}>
        <Text style={styles.lurePlaceholder}>🎣</Text>
      </View>
      <View style={styles.lureInfo}>
        <View style={styles.lureHeader}>
          <Text style={styles.lureName}>{item.name}</Text>
          {item.isPremium && <Badge label="Premium" variant="premium" />}
        </View>
        <Text style={styles.lureType}>{item.type}</Text>
        <Text style={styles.lureColors}>
          Colors: {item.colors.join(', ')}
        </Text>
        <Text style={styles.lureSpecies}>
          Target: {item.targetSpecies.join(', ')}
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search lures..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={lures}
        renderItem={renderLure}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  searchContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  searchInput: {
    marginBottom: 0,
  },
  list: {
    padding: theme.spacing.lg,
  },
  lureCard: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  lureImage: {
    width: 100,
    height: 100,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  lurePlaceholder: {
    fontSize: 40,
  },
  lureInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  lureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  lureName: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  lureType: {
    fontSize: theme.typography.fontSize.bodySmall,
    color: theme.colors.accent.primary,
    marginBottom: theme.spacing.xs,
  },
  lureColors: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  lureSpecies: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.tertiary,
  },
});
