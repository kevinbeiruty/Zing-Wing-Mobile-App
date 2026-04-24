import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, List, Text } from 'react-native-paper';

export default function LeaderboardItem({ user, place }) {
  return (
    <List.Item
      title={`${place}. ${user.name}`}
      description={`${user.country} - Level ${user.level} - ${user.rank}`}
      left={() => <Avatar.Text size={44} label={String(place)} />}
      right={() => (
        <View style={styles.xpBox}>
          <Text variant="labelLarge">{user.xp}</Text>
          <Text variant="labelSmall">XP</Text>
        </View>
      )}
      style={styles.item}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: 8,
    marginBottom: 6,
  },
  xpBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
