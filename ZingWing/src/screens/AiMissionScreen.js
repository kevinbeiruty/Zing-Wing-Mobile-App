import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, TextInput, useTheme } from 'react-native-paper';
import MissionCard from '../components/MissionCard';
import { categories, difficulties, getXPByDifficulty } from '../data/mockData';

export default function AiMissionScreen({ onboardingAnswers }) {
  const theme = useTheme();
  const [goal, setGoal] = useState(onboardingAnswers.goal || '');
  const [weakness, setWeakness] = useState(onboardingAnswers.weakness || '');
  const [category, setCategory] = useState(onboardingAnswers.selectedCategories?.[0] || 'Productivity');
  const [difficulty, setDifficulty] = useState(onboardingAnswers.difficulty || 'Easy');
  const [missions, setMissions] = useState([]);

  function generateMissions() {
    // Later: send onboarding answers to Firebase Generative AI.
    // The AI should return JSON missions only.
    // Then this screen will render the JSON using MissionCard components.
    setMissions([
      {
        title: `${difficulty} ${category} Sprint`,
        category,
        difficulty,
        xp: getXPByDifficulty(difficulty),
        reason: goal || weakness
          ? `Built around your goal: ${goal || 'steady progress'}.`
          : 'Good for starting when motivation is low.',
      },
      {
        title: `Small ${category} Win`,
        category,
        difficulty: 'Easy',
        xp: getXPByDifficulty('Easy'),
        reason: weakness
          ? `A low-pressure step against: ${weakness}.`
          : 'Builds consistency without pressure.',
      },
    ]);
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>AI Mission Generator</Text>
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.content}>
          <TextInput label="User goal" value={goal} onChangeText={setGoal} />
          <TextInput label="Weakness" value={weakness} onChangeText={setWeakness} />

          <Text variant="titleMedium">Preferred Category</Text>
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

          <Button mode="contained" onPress={generateMissions}>
            Generate Missions
          </Button>
        </Card.Content>
      </Card>

      {missions.map((mission, index) => (
        <View key={`${mission.title}-${index}`} style={styles.generated}>
          <MissionCard mission={{ ...mission, id: String(index), completed: false, description: mission.reason }} showActions={false} />
          <Text>{mission.reason}</Text>
        </View>
      ))}
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
  generated: {
    gap: 6,
  },
});
