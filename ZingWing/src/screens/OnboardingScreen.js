import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, TextInput, useTheme } from 'react-native-paper';
import { categories } from '../data/mockData';
import { auth } from '../firebase/firebaseConfig';
import { saveUserOnboardingAnswers } from '../services/database';

export default function OnboardingScreen({ navigation, saveOnboardingAnswers }) {
  const theme = useTheme();
  const [goal, setGoal] = useState('');
  const [weakness, setWeakness] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['Productivity']);
  const [difficulty, setDifficulty] = useState('Easy');
  const [reminderPreference, setReminderPreference] = useState('Morning');

  function toggleCategory(category) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  }

  async function handleSubmit() {
    const answers = { goal, weakness, selectedCategories, difficulty, reminderPreference };
    if (auth.currentUser) {
      await saveUserOnboardingAnswers(auth.currentUser.uid, answers);
    }

    saveOnboardingAnswers(answers);
    navigation.replace('MainDrawer');
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Awaken Your Potential</Text>
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.content}>
          <TextInput label="What is your main goal?" value={goal} onChangeText={setGoal} />
          <TextInput label="What is your biggest weakness?" value={weakness} onChangeText={setWeakness} />

          <Text variant="titleMedium">Which categories matter most?</Text>
          <View style={styles.wrap}>
            {categories.map((category) => (
              <Chip key={category} selected={selectedCategories.includes(category)} onPress={() => toggleCategory(category)}>
                {category}
              </Chip>
            ))}
          </View>

          <Text variant="titleMedium">Preferred mission difficulty</Text>
          <View style={styles.wrap}>
            {['Easy', 'Medium', 'Hard'].map((item) => (
              <Chip key={item} selected={difficulty === item} onPress={() => setDifficulty(item)}>
                {item}
              </Chip>
            ))}
          </View>

          <Text variant="titleMedium">Reminder preference</Text>
          <View style={styles.wrap}>
            {['Morning', 'Afternoon', 'Evening'].map((item) => (
              <Chip key={item} selected={reminderPreference === item} onPress={() => setReminderPreference(item)}>
                {item}
              </Chip>
            ))}
          </View>

          <Button mode="contained" onPress={handleSubmit}>
            Start Daily Hunt
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 8,
  },
  content: {
    gap: 16,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
