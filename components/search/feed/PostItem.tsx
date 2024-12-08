import { FC, useEffect, useState } from 'react';
import { View, Image, TextInput, FlatList, StyleSheet } from 'react-native';
import { Text, Menu, ActivityIndicator, Button } from 'react-native-paper';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { IPost } from '@/dtos/Interfaces/feed/IPost';
import { BG_COLORS } from '@/constants/Colors';
import feedStore from '@/stores/FeedStore';
import userStore from "@/stores/UserStore";

type PostCardProps = {
  post: IPost,
  handleSheetCommentsOpenById: (postId: string) => void
}

const PostCard: FC<PostCardProps> = observer(({ post, handleSheetCommentsOpenById }) => {
  const [hasLiked, setHasLiked] = useState<boolean>(post.hasLiked);
  const [commentText, setCommentText] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isLoadingDeletingPost, setIsLoadingDeletingPost] = useState(false);

  useEffect(() => {
    (async () => {
      const comments = await feedStore.fetchGetComments(post.id);
      const updatedLikesCount = await feedStore.fetchLikesCount(post.id);
      const hasLiked = await feedStore.hasUserLiked(post.id);
      setHasLiked(hasLiked);

      runInAction(() => {
        post.likesCount = updatedLikesCount; // Реактивное обновление
        post.comments = comments;
      });

      if (post.userId === userStore.currentUser?.id) {
        setIsCurrentUser(true);
      } else {
        setIsCurrentUser(false);
      }
    })();
  }, [post]);

  const addLike = async () => {
    try {
      if (hasLiked) {
        if(await feedStore.unlikePost(post.id)){
          setHasLiked(false);
          runInAction(() => post.decrementLikes());
        }
       
      } else {
        if(await feedStore.likePost(post.id)){
          setHasLiked(true);
          runInAction(() => post.incrementLikes());
        }
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const deletePost = async (postId: string) => {
    try {
      setIsLoadingDeletingPost(true);
      await feedStore.deletePost(postId);
      await feedStore.fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setMenuVisible(false);
      setIsLoadingDeletingPost(false);
    }
  }

  const complainOnPost = () => {
    console.log('Пожаловались на пост')
  }

  const handleSheetCommentsOpen = (postId: string) => {
    handleSheetCommentsOpenById(postId);
  };

  return (
    <Card className="mx-2 mt-2 bg-white rounded-2xl">
      <Card.Content>
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center">
            <Avatar.Image size={36} source={{ uri: `${post.userAvatar}` }} />
            <View className="ml-2">
              <Text className="font-bold text-sm">{post.userName}</Text>
              <Text className="text-gray-500 text-xs">
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View>
            <Menu
              contentStyle={{
                backgroundColor: "white",
                borderRadius: 10,
                top: 40
              }}
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={<IconButton
                icon="dots-vertical"
                style={{ margin: 0 }}
                onPress={openMenu}
                size={20}
              />}
            >
              {isCurrentUser ?
              <Menu.Item
                contentStyle={{
                  display: "flex"
                }}
                onPress={() => deletePost(post.id)}
                title={isLoadingDeletingPost ?
                  <ActivityIndicator
                    size="small"
                    color="#6200ee"
                  /> : 
                  "Удалить"}
              /> :
              <Menu.Item onPress={complainOnPost} title="Пожаловаться" />}
            </Menu>
          </View>
        </View>
        <Text className="my-1 text-sm">{post.content}</Text>
        {post.postPhotos.length > 0 && (
          <View className="rounded-md overflow-hidden">
            {post.postPhotos.map((image) => (
              <Image
                key={image.id}
                source={{ uri: image.url }}
                className="w-full aspect-square"
                resizeMode="cover"
              />
            ))}
          </View>
        )}
      </Card.Content>
      <Card.Actions>
        <View className="flex-row items-center w-full">
          {/* Кнопки лайка и комментариев (слева) */}
          <View className="-ml-2 flex-row items-center mr-2">
            <IconButton
              icon={hasLiked ? "heart" : "heart-outline"}
              iconColor={hasLiked ? BG_COLORS.purple[400] : "gray"}
              onPress={addLike}
              size={20}
            />
            <Text className="-ml-2 text-sm text-gray-500 font-medium">
              {post.likesCount}
            </Text>
            <IconButton
              icon="comment-outline"
              className='-ml-0'
              iconColor="gray"
              size={20}
              onPress={() => handleSheetCommentsOpen(post.id)}/>
            <Text className="-ml-2 text-sm text-gray-500 font-medium">{post.comments.length}</Text>
          </View>

          {/* Поле ввода текста и кнопка отправки (справа) */}
          <View className="flex-row items-center flex-1 -mr-1">
            <TextInput
              placeholder="Напишите комментарий..."
              className="flex-1 bg-gray-100 rounded-md px-2 py-1 text-sm"
              onChangeText={(text) => setCommentText(text)}
              value={commentText}
              multiline={false}
            />
            <IconButton
              icon="send"
              iconColor={BG_COLORS.purple[400]}
              onPress={async () => {
                if (commentText.trim()) {
                  await feedStore.addComment(post.id, commentText.trim());
                  setCommentText("");
                  await feedStore.fetchPosts();
                }
              }}
              size={20}
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
      </Card.Actions>
    </Card>
  );
});

export default PostCard;