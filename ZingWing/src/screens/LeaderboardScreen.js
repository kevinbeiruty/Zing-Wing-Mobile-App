import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { Button, Card, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import LeaderboardItem from '../components/LeaderboardItem';
import { getLevel, getRank } from '../data/mockData';
import { listenLeaderboard } from '../services/database';

export default function LeaderboardScreen({ currentUserCountry }) {
  const theme = useTheme();
  const [filter, setFilter] = useState('global');
  const [locationText, setLocationText] = useState('Location not checked yet.');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    return listenLeaderboard(
      filter,
      currentUserCountry,
      setUsers,
      (error) => console.log('Leaderboard listener failed:', error.message)
    );
  }, [filter, currentUserCountry]);

  const rankedUsers = users.map((user) => {
    const xp = user.totalXP || user.xp || 0;
    const level = user.level || getLevel(xp);
    return {
      ...user,
      xp,
      level,
      rank: user.rank || getRank(level),
    };
  });

  async function detectLocation() {
    // This native feature gets latitude and longitude. Country is still manually selected for simplicity.
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      setLocationText('Location permission denied.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocationText(`Lat ${location.coords.latitude.toFixed(2)}, Lng ${location.coords.longitude.toFixed(2)}`);
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Leaderboard</Text>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'global', label: 'Global' },
          { value: 'country', label: 'My Country' },
        ]}
      />

      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.content}>
          <Text variant="titleMedium">Country Filter</Text>
          <Text>Showing: {filter === 'global' ? 'Global Top 10' : `Top 10 ${currentUserCountry}`}</Text>
          <Text>{locationText}</Text>
          <Button mode="outlined" onPress={detectLocation}>
            Detect Location
          </Button>
        </Card.Content>
      </Card>

      <View>
        {rankedUsers.map((user, index) => (
          <LeaderboardItem key={user.id} user={user} place={index + 1} />
        ))}
        {rankedUsers.length === 0 ? <Text>No leaderboard users yet.</Text> : null}
      </View>
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
    gap: 8,
  },
});
