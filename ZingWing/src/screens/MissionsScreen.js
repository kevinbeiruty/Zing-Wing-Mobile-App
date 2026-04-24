import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, Text, useTheme } from 'react-native-paper';
import MissionCard from '../components/MissionCard';
import { categories } from '../data/mockData';

export default function MissionsScreen({ navigation, missions, completeMission, deleteMission }) {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredMissions = selectedCategory === 'All'
    ? missions
    : missions.filter((mission) => mission.category === selectedCategory);

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="headlineMedium" style={styles.title}>Daily Hunt</Text>
          <Text variant="bodyMedium">Enter the Mission Gate and clear your tasks.</Text>
        </View>
        <Button mode="contained" onPress={() => navigation.navigate('AddMission')}>
          Add
        </Button>
      </View>

      <View style={styles.wrap}>
        {['All', ...categories].map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
          >
            {category}
          </Chip>
        ))}
      </View>

      {filteredMissions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onPress={() => navigation.navigate('MissionDetails', { mission })}
          onComplete={() => completeMission(mission.id)}
          onDelete={() => deleteMission(mission.id)}
        />
      ))}
      {filteredMissions.length === 0 ? <Text>No missions in this category yet.</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
