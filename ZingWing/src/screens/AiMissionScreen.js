import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, TextInput, useTheme } from 'react-native-paper';
import MissionCard from '../components/MissionCard';
import { categories, difficulties } from '../data/mockData';
import { generateAIMissions } from '../services/aiMissions';

export default function AiMissionScreen({ onboardingAnswers, addMission, scheduleReminder }) {
  const theme = useTheme();
  const [goal, setGoal] = useState(onboardingAnswers.goal || '');
  const [weakness, setWeakness] = useState(onboardingAnswers.weakness || '');
  const [category, setCategory] = useState(onboardingAnswers.selectedCategories?.[0] || 'Productivity');
  const [difficulty, setDifficulty] = useState(onboardingAnswers.difficulty || 'Easy');
  const [missions, setMissions] = useState([]);
  const [savedMissionTitles, setSavedMissionTitles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function generateMissions() {
    try {
      setIsGenerating(true);
      setErrorMessage('');
      setSavedMissionTitles([]);
      const nextMissions = await generateAIMissions({
        goal,
        weakness,
        category,
        difficulty,
        onboardingAnswers,
      });
      setMissions(nextMissions);
    } catch (error) {
      console.log('AI mission generation failed:', error.message);
      setErrorMessage(`Could not generate missions: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveMission(mission) {
    await addMission(mission);
    scheduleReminder(mission);
    setSavedMissionTitles((oldTitles) => [...oldTitles, mission.title]);
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

          <Button mode="contained" onPress={generateMissions} loading={isGenerating} disabled={isGenerating}>
            Generate Missions
          </Button>
          {errorMessage ? <Text style={{ color: theme.colors.error }}>{errorMessage}</Text> : null}
        </Card.Content>
      </Card>

      {missions.map((mission, index) => (
        <View key={`${mission.title}-${index}`} style={styles.generated}>
          <MissionCard mission={{ ...mission, id: String(index), completed: false }} showActions={false} />
          <Text>{mission.reason}</Text>
          <Button
            mode="contained-tonal"
            onPress={() => saveMission(mission)}
            disabled={savedMissionTitles.includes(mission.title)}
          >
            {savedMissionTitles.includes(mission.title) ? 'Saved' : 'Save Mission'}
          </Button>
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
