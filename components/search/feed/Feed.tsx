// Feed.tsx
import { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FlatList, View, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import { ICommentWithUser } from '@/dtos/Interfaces/feed/IPost';
import { BG_COLORS } from '@/constants/Colors';
import { runInAction } from 'mobx';
import BottomSheet, { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import PostComment from './PostComment';
import searchStore from '@/stores/SearchStore';
import PostItem from '@/components/search/feed/PostItem';
import CreatePost from '@/components/search/feed/CreatePost';
import i18n from '@/i18n';
import BottomSheetComponent from '@/components/common/BottomSheetComponent';

const Feed: FC = observer(() => {
  const [bottomSheetType, setBottomSheetType ] = useState<'create-post' | 'comments' | ''>('')
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postComments, setPostComments] = useState<ICommentWithUser[]>();
  const [selectedPostId, setSelectedPostId] = useState('');
  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    searchStore.resetPage();
    searchStore.fetchPosts();
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
    searchStore.resetPage();
    searchStore.fetchPosts().finally(() => {
      setIsRefreshing(false);
    });
  };

  const deleteComment = async (commentId: string) => {
    await searchStore.deletePostComment(commentId);
    runInAction(async () => {
      const comments = await searchStore.fetchGetComments(selectedPostId);
      setPostComments(comments);
      console.log('refresh')
    })
  }

  const handleSheetCommentsOpen = async (postId: string) => {
    const comments = await searchStore.fetchGetComments(postId);
    setSelectedPostId(postId);
    setPostComments(comments);
    setBottomSheetType('comments');
    sheetRef.current?.expand();
  };

  const BottomSheetCommentsFooter = ({ animatedFooterPosition }: BottomSheetFooterProps) => {
    const [commentText, setCommentText] = useState('');

    const addComment = async () => {
      if (commentText.trim()) {
        await searchStore.addComment(selectedPostId, commentText.trim());
        setCommentText("");
        runInAction( async () => {
          const comments = await searchStore.fetchGetComments(selectedPostId);
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
            placeholder={i18n.t("feedPosts.commentInput")}
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
          searchStore.posts.length === 0 ? (
            <View className='items-center content-center justify-center pt-52' style={{ alignItems: 'center' }}>
              <Text>{i18n.t("feedPosts.noPosts")}</Text>
              <Text>{i18n.t("feedPosts.createFirst")}</Text>
            </View>
          ) : null
        }
        data={searchStore.posts}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={searchStore.loading ? <ActivityIndicator size="large" color="#6200ee" /> : <View className='h-20' />}
        renderItem={({ item }) => {
          return <PostItem post={item} handleSheetCommentsOpenById={(postId) => handleSheetCommentsOpen(postId)}/>
        }}
      />
      <FAB icon="pen" size='medium' color='white' style={styles.fab} onPress={handleCreatePost}/>
      {
        bottomSheetType && 
        <BottomSheetComponent
          contentStyle={{paddingHorizontal: 12}}
          ref={sheetRef}
          snapPoints={['60%', '100%']}
          onClose={handleSheetClose}
          enablePanDownToClose
          handleHeight={0}
          enableFooterMarginAdjustment
          footerComponent={bottomSheetType === "comments" ? BottomSheetCommentsFooter : undefined}
          renderContent={bottomSheetType === "create-post" ? <CreatePost onClose={handleSheetClose}/> : null}
          flatListData={bottomSheetType === "comments" ? postComments : null}
          flatListRenderItem={bottomSheetType === "comments" ? ({ item }) => {
            return (
              <PostComment comment={item} handleDeleteComment={(commentId) => deleteComment(commentId)}/>
            )
          } : null}
        />
      }
    </View>
  );
});

const styles = StyleSheet.create({
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