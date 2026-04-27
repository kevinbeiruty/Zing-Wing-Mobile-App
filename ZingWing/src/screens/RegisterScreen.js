import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { registerUser } from "../services/auth";

export default function RegisterScreen({ navigation, saveRegisteredUser }) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Lebanon');

  function handleRegister() {
    // Later this function will use Firebase Authentication createUserWithEmailAndPassword().
    // The user profile will be saved in the users collection with name, email, and country.
    saveRegisteredUser({
      name: name || 'You',
      email,
      country: country || 'Lebanon',
    });
    navigation.navigate('Onboarding', { name, email, country });
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>Create Hunter Profile</Text>
      <TextInput label="Name" value={name} onChangeText={setName} />
      <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput label="Country" value={country} onChangeText={setCountry} />
      <Button mode="contained" onPress={handleRegister}>
        Continue
      </Button>
      <Button onPress={() => navigation.navigate('Login')}>
        Already have an account?
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 14,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
