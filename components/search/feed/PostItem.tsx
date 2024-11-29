import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { makeAutoObservable } from 'mobx';
import { IPost } from '@/dtos/Interfaces/feed/IPost';


class PostStore {
  likes: number;
  hasLiked: boolean;

  constructor(initialLikes: number, initialHasLiked: boolean) {
    this.likes = initialLikes;
    this.hasLiked = initialHasLiked;
    makeAutoObservable(this);
  }

  toggleLike() {
    this.hasLiked = !this.hasLiked;
    this.likes += this.hasLiked ? 1 : -1;
  }
}

const PostCard: React.FC<{ post: IPost }> = observer(({ post }) => {
  const postStore = new PostStore(post.likesCount, post.hasLiked);

  return (
    <Card className="mx-3 my-2  rounded-lg shadow-lg">
      <Card.Content>
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Avatar.Image
              size={40}
              source={{ uri: `https://example.com/avatar/${post.userId}` }}
            />
            <View className="ml-2">
              <Text className="font-bold">{post.title}</Text>
              <Text className="text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <IconButton icon="dots-vertical" onPress={() => console.log('Menu clicked')} />
        </View>
        <Text className="mb-2">{post.content}</Text>
        {post.images.length > 0 && (
          <View className="rounded-lg overflow-hidden">
            {post.images.map((image) => (
              <Image
                key={image.id}
                source={{ uri: image.url }}
                className="w-full h-64"
                resizeMode="cover"
              />
            ))}
          </View>
        )}
        <View className="flex-row items-center justify-between mt-2">
          <TouchableOpacity
            onPress={() => postStore.toggleLike()}
            className="flex-row items-center"
          >
            <IconButton
              icon={postStore.hasLiked ? 'heart' : 'heart-outline'}
              iconColor={postStore.hasLiked ? 'red' : 'gray'}
            />
            <Text>{postStore.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <IconButton icon="comment-outline" />
            <Text>{post.comments.length}</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
});

export default PostCard;