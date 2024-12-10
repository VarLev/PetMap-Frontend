// Feed.tsx
import { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FlatList, View, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import { ICommentWithUser } from '@/dtos/Interfaces/feed/IPost';
import { BG_COLORS } from '@/constants/Colors';
import { runInAction } from 'mobx';
import BottomSheet, { BottomSheetFlatList, BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import PostComment from './PostComment';
import feedStore from '@/stores/FeedStore';
import PostItem from '@/components/search/feed/PostItem';
import CreatePost from '@/components/search/feed/CreatePost';

const Feed: FC = observer(() => {
  const [bottomSheetType, setBottomSheetType ] = useState<'create-post' | 'comments' | ''>('')
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postComments, setPostComments] = useState<ICommentWithUser[]>();
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

  const BottomSheetCommentsFooter = ({ animatedFooterPosition }: BottomSheetFooterProps) => {
    const [commentText, setCommentText] = useState('');

    const addComment = async () => {
      if (commentText.trim()) {
        await feedStore.addComment(selectedPostId, commentText.trim());
        setCommentText("");
        runInAction( async () => {
          const comments = await feedStore.fetchGetComments(selectedPostId);
          setPostComments(comments);
        })
      }
    }

      return (
        <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
          <View style={styles.footer} className="flex-row items-center flex-1">
            <TextInput
              multiline
              style={{maxHeight: 60}}
              placeholder="Напишите комментарий..."
              className="flex-1 bg-gray-100 rounded-md px-2 py-1 text-sm"
              onChangeText={(text) => setCommentText(text)}
              value={commentText}
            /> 
            <IconButton
              icon="send"
              iconColor={BG_COLORS.purple[400]}
              onPress={addComment}
              size={20}
              style={{ marginLeft: 4, marginRight: -6 }}
            />
          </View>
        </BottomSheetFooter>
      )
    }

  return (
    <View className='flex-1' >
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
        <BottomSheet
          style={{paddingHorizontal: 12}}
          ref={sheetRef}
          snapPoints={['50%', '100%']}
          onClose={handleSheetClose}
          enablePanDownToClose={true}
          handleHeight={0}
          footerComponent={bottomSheetType === "comments" ? BottomSheetCommentsFooter : undefined}
          backgroundStyle={styles.backgroundStyle}
          handleStyle={styles.handleStyle}
        >
          {bottomSheetType === "comments" ?
          <BottomSheetFlatList
            enableFooterMarginAdjustment
            style={{paddingHorizontal: 12}}
            data={postComments}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <PostComment comment={item}/>
              )
            }}
          /> :
          <CreatePost onClose={handleSheetClose}/>}
        </BottomSheet>
      }
    </View>
  );
});

const styles = StyleSheet.create({
  backgroundStyle: {
    zIndex: -10,
    elevation: 5,
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width:0, height: 0 }, // Смещение тени
    shadowOpacity: 0.4, // Прозрачность тени
    shadowRadius: 5, // Радиус размытия тени
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  handleStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80
  },
  footer: {
    backgroundColor: 'white',
    height: 148,
    paddingBottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12
  },
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