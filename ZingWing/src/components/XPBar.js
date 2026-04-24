import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressBar, Text, useTheme } from 'react-native-paper';

export default function XPBar({ currentXP, xpForNextLevel }) {
  const theme = useTheme();
  const progress = currentXP / xpForNextLevel;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="labelLarge">XP Progress</Text>
        <Text variant="labelMedium">{currentXP} / {xpForNextLevel}</Text>
      </View>
      <ProgressBar
        progress={progress}
        color={theme.colors.primary}
        style={[styles.bar, { backgroundColor: theme.colors.surfaceVariant }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bar: {
    height: 10,
    borderRadius: 8,
  },
});
