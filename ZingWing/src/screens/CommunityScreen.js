import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import PostCard from '../components/PostCard';

export default function CommunityScreen({ navigation, posts }) {
  const theme = useTheme();
  const [feedMode, setFeedMode] = useState('public');
  const visiblePosts = posts.filter((post) => {
    if (feedMode === 'public') return post.visibility === 'public';
    return post.userName === 'You' && post.visibility === 'private';
  });

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="headlineMedium" style={styles.title}>Community</Text>
          <Text variant="bodyMedium">Share progress, or keep proof in your private vault.</Text>
        </View>
        <Button mode="contained" onPress={() => navigation.navigate('AddPost')}>
          Post
        </Button>
      </View>

      <SegmentedButtons
        value={feedMode}
        onValueChange={setFeedMode}
        buttons={[
          { value: 'public', label: 'Public Feed' },
          { value: 'private', label: 'My Private Vault' },
        ]}
      />

      {visiblePosts.map((post) => <PostCard key={post.id} post={post} />)}
      {visiblePosts.length === 0 ? <Text>No posts here yet.</Text> : null}
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
});
