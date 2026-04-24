import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, List, Text, useTheme } from 'react-native-paper';
import RankBadge from '../components/RankBadge';

export default function ProfileScreen({ userStats }) {
  const theme = useTheme();

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={58} label={userStats.name.charAt(0)} />
        <View>
          <Text variant="headlineSmall" style={styles.title}>{userStats.name}</Text>
          <Text>{userStats.country}</Text>
        </View>
      </View>

      <RankBadge level={userStats.level} rank={userStats.rank} totalXP={userStats.totalXP} />

      <Card mode="outlined" style={styles.card}>
        <Card.Content>
          <List.Item title="Missions completed" description={String(userStats.completedMissions)} />
          <List.Item title="Public posts" description={String(userStats.publicPosts)} />
          <List.Item title="Private posts" description={String(userStats.privatePosts)} />
        </Card.Content>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Card.Title title="Rank Path" />
        <Card.Content>
          <List.Item title="Level 1" description="Crook" />
          <List.Item title="Level 10" description="Big Man" />
          <List.Item title="Level 50" description="Elite" />
          <List.Item title="Level 100" description="BOSS" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 8,
  },
});
