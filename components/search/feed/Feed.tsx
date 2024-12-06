// Feed.tsx
import { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FlatList, View, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import feedStore from '@/stores/FeedStore';
import PostItem from '@/components/search/feed/PostItem';
import CreatePost from '@/components/search/feed/CreatePost';
import BottomSheetComponent from '@/components/common/BottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import { FAB } from 'react-native-paper';
import PostComment from './PostComment';
import { ICommentWithUser } from '@/dtos/Interfaces/feed/IPost';
import { BG_COLORS } from '@/constants/Colors';

const Feed: FC = observer(() => {
  const [bottomSheetType, setBottomSheetType ] = useState<'create-post' | 'comments' | ''>('')
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postComments, setPostComments] = useState<ICommentWithUser[]>();
  const [commentText, setCommentText] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');
  const sheetRef = useRef<BottomSheet>(null);


  useEffect(() => {
    feedStore.resetPage();
    feedStore.fetchPosts();
  }, []);

  const loadMorePosts = () => {
    //feedStore.incrementPage();
    //feedStore.fetchPosts();
  };

  const handleSheetClose = async () => {
    setBottomSheetType('');
    sheetRef.current?.close();
  };

  const handleCreatePost = () => {
    setBottomSheetType('create-post');
    sheetRef.current?.snapToIndex(0);
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    feedStore.resetPage();
    feedStore.fetchPosts().finally(() => {
      setIsRefreshing(false);
    });
  };

  const handleSheetCommentsOpen = async (postId: string) => {
    const comments = await feedStore.fetchGetComments(postId);
    setSelectedPostId(postId);
    setPostComments(comments);
    setBottomSheetType('comments');
    sheetRef.current?.expand();
  };

  return (
    <View className='flex-1 pb-[88px]' >
      <FlatList
        ListHeaderComponent={
          feedStore.posts.length === 0 ? (
            <View className='items-center content-center justify-center pt-52' style={{ alignItems: 'center' }}>
              <Text>Нет постов</Text>
              <Text>Создайте первый!</Text>
            </View>
          ) : null
        }
        data={feedStore.posts}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return <PostItem post={item} handleSheetCommentsOpenById={(postId) => handleSheetCommentsOpen(postId)}/>
        }}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={feedStore.loading ? <ActivityIndicator size="large" /> : <View className='h-20' />}
      />
      <FAB icon="pen" size='medium' color='white' style={styles.fab} onPress={handleCreatePost}/>
      {
        bottomSheetType && 
        <BottomSheetComponent
          ref={sheetRef}
          snapPoints={['30%', '60%', '100%']}
          renderContent={
            bottomSheetType === 'create-post' ?
            <CreatePost onClose={handleSheetClose}/> :
            <View className="px-4">
              <FlatList
                data={postComments}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                  return (
                    <PostComment comment={item}/>
                  )
                }}
              />
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
                      await feedStore.addComment(selectedPostId, commentText.trim());
                      setCommentText("");
                      await feedStore.fetchPosts();
                    }
                  }}
                  size={20}
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>
          }
          initialIndex={0}
          onClose={handleSheetClose}
          enablePanDownToClose={true}
          usePortal={false}
        />
      }
    </View>
  );
});

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 90,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 100,
    backgroundColor: '#2F00B6'
  },
})

export default Feed;