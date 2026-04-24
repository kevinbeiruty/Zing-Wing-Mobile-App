import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Card, Chip, Text, TextInput, useTheme } from 'react-native-paper';

export default function AddPostScreen({ navigation, addPost, userStats }) {
  const theme = useTheme();
  const [imageUri, setImageUri] = useState('');
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState('public');

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
      setImageUri(result.assets[0].uri);
    }
  }

  function handleSave() {
    const post = {
      id: Date.now().toString(),
      userName: 'You',
      country: userStats.country,
      level: userStats.level,
      rank: userStats.rank,
      imageUri,
      caption,
      visibility,
    };

    // Later this function will upload the image to Firebase Storage
    // and save the post document in Firestore.
    addPost(post);
    navigation.goBack();
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Progress Post</Text>
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.content}>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
          <Button mode="outlined" onPress={pickImage}>
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
          <Button mode="contained" onPress={handleSave} disabled={!caption}>
            Save Post
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
