// PostItem.tsx

import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { Post } from '@/dtos/classes/feed/Post';
import feedStore from '@/stores/FeedStore';

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = observer(({ post }) => {
  const [commentText, setCommentText] = React.useState('');

  const handleLike = async () => {
    if (post.hasLiked) {
      await feedStore.unlikePost(post.id);
    } else {
      await feedStore.likePost(post.id);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      await feedStore.addComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <View className="p-4 border-b border-gray-300">
      <Text className="text-lg font-bold">{post.title}</Text>
      {post.images && post.images.length > 0 && (
        <FlatList
          data={post.images}
          horizontal
          keyExtractor={(image) => image.id}
          renderItem={({ item }) => (
            <Image source={{ uri: item.url }} className="w-24 h-24 mr-2" />
          )}
        />
      )}
      <Text className="mt-2">{post.content}</Text>
      <View className="flex-row items-center mt-2">
        <TouchableOpacity onPress={handleLike}>
          <Text className="text-blue-500 mr-4">{post.hasLiked ? 'Unlike' : 'Like'} ({post.likesCount})</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-4">
        {post.comments.map(comment => (
          <Text key={comment.id.toString()} className="mb-1">{comment.content}</Text>
        ))}
        <TextInput
          className="border border-gray-300 p-2 mt-2"
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Добавить комментарий..."
        />
        <Button onPress={handleCommentSubmit} className="mt-2">
          Отправить
        </Button>
      </View>
    </View>
  );
});

export default PostItem;