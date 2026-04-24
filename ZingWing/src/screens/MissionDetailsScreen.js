import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, TextInput, useTheme } from 'react-native-paper';
import { difficulties, getXPByDifficulty } from '../data/mockData';

export default function MissionDetailsScreen({
  route,
  navigation,
  missions,
  completeMission,
  updateMission,
  deleteMission,
  scheduleReminder,
}) {
  const theme = useTheme();
  const routeMission = route.params?.mission;
  const mission = missions.find((item) => item.id === routeMission?.id) || routeMission;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(mission?.title || '');
  const [difficulty, setDifficulty] = useState(mission?.difficulty || 'Easy');

  useEffect(() => {
    setTitle(mission?.title || '');
    setDifficulty(mission?.difficulty || 'Easy');
  }, [mission?.id]);

  if (!mission) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.colors.background }]}>
        <Text>Mission not found.</Text>
      </View>
    );
  }

  function handleSave() {
    updateMission(mission.id, {
      title,
      difficulty,
      xp: getXPByDifficulty(difficulty),
    });
    setIsEditing(false);
  }

  function handleDelete() {
    deleteMission(mission.id);
    navigation.goBack();
  }

  function handleScheduleReminder() {
    scheduleReminder(mission);
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Mission Info</Text>
      <Card mode="outlined" style={[styles.card, { borderColor: theme.colors.primary }]}>
        <Card.Content style={styles.content}>
          {isEditing ? (
            <>
              <TextInput label="Mission Title" value={title} onChangeText={setTitle} />
              <Text variant="titleMedium">Difficulty</Text>
              <View style={styles.wrap}>
                {difficulties.map((item) => (
                  <Chip key={item} selected={difficulty === item} onPress={() => setDifficulty(item)}>
                    {item}
                  </Chip>
                ))}
              </View>
              <Button mode="contained" onPress={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Text variant="headlineSmall" style={styles.title}>{mission.title}</Text>
              <Text>{mission.description}</Text>
              <View style={styles.wrap}>
                <Chip>{mission.category}</Chip>
                <Chip>{mission.difficulty}</Chip>
                <Chip>{mission.xp} XP</Chip>
                <Chip>{mission.completed ? 'Completed' : 'Active'}</Chip>
              </View>
              <Text>Routine days: {mission.routineDays.join(', ')}</Text>
              <Text>Reminder time: {mission.reminderTime}</Text>
            </>
          )}
        </Card.Content>
      </Card>

      <Button mode="contained" disabled={mission.completed} onPress={() => completeMission(mission.id)}>
        Complete Mission
      </Button>
      <Button mode="outlined" onPress={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel Edit' : 'Edit Mission'}
      </Button>
      <Button mode="outlined" onPress={handleScheduleReminder}>
        Schedule Reminder
      </Button>
      <Button textColor="#ff6b6b" onPress={handleDelete}>
        Delete Mission
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
  },
  content: {
    gap: 14,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
