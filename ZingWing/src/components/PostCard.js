import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Avatar, Card, Chip, Text } from 'react-native-paper';

export default function PostCard({ post }) {
  return (
    <Card mode="outlined" style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Avatar.Text size={42} label={post.userName.charAt(0)} />
          <View style={styles.userInfo}>
            <Text variant="titleMedium">{post.userName}</Text>
            <Text variant="bodySmall">{post.country} - Level {post.level} - {post.rank}</Text>
          </View>
          <Chip compact>{post.visibility}</Chip>
        </View>
        {post.imageUri ? <Image source={{ uri: post.imageUri }} style={styles.image} /> : null}
        <Text variant="bodyMedium">{post.caption}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userInfo: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
});
