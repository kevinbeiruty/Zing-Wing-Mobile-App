import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function RankBadge({ level, rank, totalXP }) {
  const theme = useTheme();

  return (
    <View style={[styles.badge, { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface }]}>
      <View style={[styles.diamond, { borderColor: theme.colors.primary }]}>
        <View style={[styles.innerDiamond, { backgroundColor: theme.colors.primary }]}>
          <Text variant="headlineLarge" style={styles.level}>{level}</Text>
        </View>
      </View>
      <Text variant="titleLarge" style={styles.rank}>{rank}</Text>
      <Text variant="bodyMedium">Total XP: {totalXP}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 18,
    gap: 10,
    elevation: 6,
  },
  diamond: {
    width: 112,
    height: 112,
    borderWidth: 3,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDiamond: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  level: {
    color: '#ffffff',
    transform: [{ rotate: '-45deg' }],
    fontWeight: 'bold',
  },
  rank: {
    fontWeight: 'bold',
  },
});
