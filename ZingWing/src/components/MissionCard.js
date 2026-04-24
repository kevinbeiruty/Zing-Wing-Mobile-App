import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, useTheme } from 'react-native-paper';

export default function MissionCard({ mission, onPress, onComplete, onDelete, showActions = true }) {
  const theme = useTheme();

  return (
    <Card
      mode="outlined"
      onPress={onPress}
      style={[styles.card, { borderColor: mission.completed ? '#22c55e' : theme.colors.primary }]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text variant="titleMedium" style={styles.title}>{mission.title}</Text>
            <Text variant="bodySmall">{mission.category} Gate</Text>
          </View>
          <Chip compact>{mission.xp} XP</Chip>
        </View>
        <Text variant="bodyMedium" numberOfLines={2}>{mission.description}</Text>
        <View style={styles.chipRow}>
          <Chip compact>{mission.difficulty}</Chip>
          <Chip compact>{mission.completed ? 'Completed' : 'Active'}</Chip>
        </View>
        {showActions && (
          <View style={styles.actions}>
            <Button mode="contained-tonal" onPress={onComplete} disabled={mission.completed}>
              Complete
            </Button>
            <Button textColor="#ff6b6b" onPress={onDelete}>
              Delete
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
});
