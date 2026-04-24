import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, List, Switch, Text, useTheme } from 'react-native-paper';

export default function SettingsScreen({ navigation, isDarkMode, setIsDarkMode }) {
  const theme = useTheme();
  const [remindersEnabled, setRemindersEnabled] = React.useState(true);

  function handleLogout() {
    // Later this button will call Firebase Authentication signOut().
    navigation.getParent()?.replace('Welcome');
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Settings</Text>
      <Card mode="outlined" style={styles.card}>
        <Card.Content>
          <List.Item
            title="Dark Mode"
            description="Saved with AsyncStorage"
            right={() => <Switch value={isDarkMode} onValueChange={setIsDarkMode} />}
          />
          <List.Item
            title="Notification Reminders"
            description="Routine reminder toggle"
            right={() => <Switch value={remindersEnabled} onValueChange={setRemindersEnabled} />}
          />
        </Card.Content>
      </Card>
      <Button mode="outlined" textColor="#ff6b6b" onPress={handleLogout}>
        Logout
      </Button>
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
});
