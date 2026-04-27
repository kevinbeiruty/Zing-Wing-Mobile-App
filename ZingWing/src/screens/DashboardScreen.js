import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import MissionCard from '../components/MissionCard';
import RankBadge from '../components/RankBadge';
import XPBar from '../components/XPBar';
import { getLevel, getRank } from '../data/mockData';
import { getItems, deleteItem } from "../services/database";

export default function DashboardScreen({ navigation, missions, totalXP, completeMission }) {
  const theme = useTheme();
  const [quote, setQuote] = useState('Discipline defeats laziness.');
  const xpForNextLevel = 100;
  const level = getLevel(totalXP);
  const rank = getRank(level);
  const currentLevelXP = totalXP % xpForNextLevel;
  const todaysMissions = missions.filter((mission) => !mission.completed).slice(0, 3);

  useEffect(() => {
    // This fetch call satisfies the public Web API requirement.
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => setQuote(data.content))
      .catch(() => setQuote('Discipline defeats laziness.'));
  }, []);

  function openAiScreen() {
    navigation.getParent()?.getParent()?.navigate('AI Mission Generator');
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Rise Above Procrastination</Text>
      <RankBadge level={level} rank={rank} totalXP={totalXP} />
      <XPBar currentXP={currentLevelXP} xpForNextLevel={xpForNextLevel} />

      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.content}>
          <Text variant="titleMedium">Quote of the Day</Text>
          <Text variant="bodyLarge">"{quote}"</Text>
        </Card.Content>
      </Card>

      <View style={styles.row}>
        <Button mode="contained" onPress={() => navigation.navigate('MissionsTab', { screen: 'AddMission' })}>
          Add Mission
        </Button>
        <Button mode="outlined" onPress={openAiScreen}>
          AI Missions
        </Button>
      </View>

      <Text variant="titleLarge" style={styles.sectionTitle}>Today's Missions</Text>
      {todaysMissions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onPress={() => navigation.navigate('MissionDetails', { mission })}
          onComplete={() => completeMission(mission.id)}
          onDelete={() => {}}
          showActions={false}
        />
      ))}
      {todaysMissions.length === 0 ? <Text>All gates cleared today.</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 8,
  },
  content: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
});
