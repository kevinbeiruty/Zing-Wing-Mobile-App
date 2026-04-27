import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, TextInput, useTheme } from 'react-native-paper';
import { categories, difficulties, getXPByDifficulty, weekDays } from '../data/mockData';

export default function AddMissionScreen({ navigation, addMission, scheduleReminder }) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Productivity');
  const [difficulty, setDifficulty] = useState('Easy');
  const [routineDays, setRoutineDays] = useState(['Mon']);
  const [reminderTime, setReminderTime] = useState('18:00');

  function toggleDay(day) {
    if (routineDays.includes(day)) {
      setRoutineDays(routineDays.filter((item) => item !== day));
    } else {
      setRoutineDays([...routineDays, day]);
    }
  }

  async function handleSave() {
    const mission = {
      title,
      description,
      category,
      difficulty,
      xp: getXPByDifficulty(difficulty),
      completed: false,
      routineDays,
      reminderTime,
    };

    await addMission(mission);
    scheduleReminder(mission);
    navigation.goBack();
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Create Mission Gate</Text>
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.content}>
          <TextInput label="Title" value={title} onChangeText={setTitle} />
          <TextInput label="Description" value={description} onChangeText={setDescription} multiline />

          <Text variant="titleMedium">Category</Text>
          <View style={styles.wrap}>
            {categories.map((item) => (
              <Chip key={item} selected={category === item} onPress={() => setCategory(item)}>
                {item}
              </Chip>
            ))}
          </View>

          <Text variant="titleMedium">Difficulty</Text>
          <View style={styles.wrap}>
            {difficulties.map((item) => (
              <Chip key={item} selected={difficulty === item} onPress={() => setDifficulty(item)}>
                {item}
              </Chip>
            ))}
          </View>

          <Text variant="titleMedium">Routine Days</Text>
          <View style={styles.wrap}>
            {weekDays.map((day) => (
              <Chip key={day} selected={routineDays.includes(day)} onPress={() => toggleDay(day)}>
                {day}
              </Chip>
            ))}
          </View>

          <TextInput label="Reminder Time" value={reminderTime} onChangeText={setReminderTime} placeholder="18:00" />
          <Text variant="bodyMedium">XP Reward: {getXPByDifficulty(difficulty)}</Text>
          <Button mode="contained" onPress={handleSave} disabled={!title}>
            Save Mission
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 8,
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
