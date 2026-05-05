import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Card, Chip, Text, TextInput, useTheme } from 'react-native-paper';

export default function AddPostScreen({ navigation, addPost, userStats }) {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isSaving, setIsSaving] = useState(false);

  const imageUri = selectedImage?.uri || '';

  async function pickImage() {
    // This is one of our native features: image picker for progress photos.
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  }

  async function handleSave() {
    setIsSaving(true);

    const post = {
      userName: userStats.name || 'You',
      country: userStats.country,
      level: userStats.level,
      rank: userStats.rank,
      image: selectedImage,
      caption,
      visibility,
    };

    try {
      await addPost(post);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not save post', error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Progress Post</Text>
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.content}>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
          <Button mode="outlined" onPress={pickImage} disabled={isSaving}>
            Choose Progress Photo
          </Button>
          <TextInput label="Caption" value={caption} onChangeText={setCaption} multiline />
          <Text variant="titleMedium">Visibility</Text>
          <View style={styles.wrap}>
            {['public', 'private'].map((item) => (
              <Chip key={item} selected={visibility === item} onPress={() => setVisibility(item)}>
                {item}
              </Chip>
            ))}
          </View>
          <Button mode="contained" onPress={handleSave} disabled={!caption || isSaving} loading={isSaving}>
            {isSaving ? 'Uploading...' : 'Save Post'}
          </Button>
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
  title: {
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 8,
  },
  content: {
    gap: 14,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 8,
  },
  wrap: {
    flexDirection: 'row',
    gap: 8,
  },
});
