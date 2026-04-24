import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

export default function WelcomeScreen({ navigation }) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.hero}>
        <Text variant="displaySmall" style={styles.title}>Zing Wing</Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Overcome laziness. Rise through the ranks.
        </Text>
      </View>

      <Card mode="outlined" style={[styles.card, { borderColor: theme.colors.primary }]}>
        <Card.Content style={styles.cardContent}>
          <Text variant="headlineSmall" style={styles.center}>Defeat Sloth</Text>
          <Text variant="bodyMedium" style={styles.center}>
            Enter the Mission Gate, complete real-life quests, earn XP, and awaken your potential.
          </Text>
          <Button mode="contained" onPress={() => navigation.navigate('Login')}>
            Login
          </Button>
          <Button mode="outlined" onPress={() => navigation.navigate('Register')}>
            Register
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    gap: 28,
  },
  hero: {
    gap: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.8,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
  },
  cardContent: {
    gap: 16,
  },
  center: {
    textAlign: 'center',
  },
});
