// Feed.tsx
import { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FlatList, View, ActivityIndicator, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import { ICommentWithUser, IPost } from '@/dtos/Interfaces/feed/IPost';
import { BG_COLORS } from '@/constants/Colors';
import { runInAction } from 'mobx';
import BottomSheet from '@gorhom/bottom-sheet';
import PostComment from './PostComment';
import searchStore from '@/stores/SearchStore';
import PostItem from '@/components/search/feed/PostItem';
import CreatePost from '@/components/search/feed/CreatePost';
import i18n from '@/i18n';
import BottomSheetComponent from '@/components/common/BottomSheetComponent';


// Если userId не передан, компонент показывает все посты.
// Если userId передан, компонент показывает посты только указанного пользователя.
interface FeedProps {
  userId?: string;
}



const Feed: FC<FeedProps> = observer(({ userId }) => {
  const [bottomSheetType, setBottomSheetType] = useState<'create-post' | 'comments' | ''>('')
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postComments, setPostComments] = useState<ICommentWithUser[]>();
  const [isPostRefresh, setIsPostRefresh] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const sheetRef = useRef<BottomSheet>(null);

  const [commentText, setCommentText] = useState('');
  const addComment = async () => {
    if (commentText.trim()) {
      await searchStore.addComment(selectedPostId, commentText.trim());
      setCommentText("");
      runInAction(async () => {
        const comments = await searchStore.fetchGetComments(selectedPostId);
        setPostComments(comments);
        searchStore.fetchPosts();
        setIsPostRefresh(true);
      });
    }
  };



  /**
  * Функция, определяющая, какие посты загружать:
  * - Все общие посты, если userId не задан;
  * - Посты конкретного пользователя, если userId задан.
  */
  const fetchPosts = async () => {
    searchStore.resetPage();
    if (userId) {
      const posts = await searchStore.getUserPosts(userId);
      if (posts)
        setUserPosts(posts);
    } else {
      await searchStore.fetchPosts();
    }
  };

  // Подписываемся на события клавиатуры
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadMorePosts = () => {
    // if (userId) {
    //   searchStore.fetchUserPosts(userId);
    // } else {
    //   searchStore.fetchPosts();
    // }
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
      setIsPostRefresh(true);
    })
  }

  const handleSheetCommentsOpen = async (postId: string) => {
    const comments = await searchStore.fetchGetComments(postId);
    setSelectedPostId(postId);
    setPostComments(comments);
    setBottomSheetType('comments');
    sheetRef.current?.expand();
  };

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
        data={userId ? userPosts : searchStore.posts}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={searchStore.loading ? <ActivityIndicator size="large" color="#6200ee" /> : <View className='h-20' />}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            handleSheetCommentsOpenById={(postId) => handleSheetCommentsOpen(postId)}
            refresh={isPostRefresh}
            isProfileView={!!userId}
          />
        )}
      />
      {!userId && <FAB icon="pen" size='medium' color='white' style={styles.fab} onPress={handleCreatePost} />}
      {bottomSheetType && (
        <BottomSheetComponent
          contentStyle={{ paddingHorizontal: 12 }}
          ref={sheetRef}
          snapPoints={['60%', '100%']}
          onClose={handleSheetClose}
          enablePanDownToClose
          handleHeight={0}
          enableFooterMarginAdjustment
          // Убираем footerComponent!
          renderContent={
            bottomSheetType === 'create-post'
              ? <CreatePost onClose={handleSheetClose} />
              : bottomSheetType === 'comments' && postComments?.length === 0
                ? (
                  <View style={styles.noCommentsContainer}>
                    <Text>{i18n.t('feedPosts.noCommentsText')}</Text>
                  </View>
                )
                : null
          }
          flatListData={bottomSheetType === 'comments' ? postComments : null}
          flatListRenderItem={
            bottomSheetType === 'comments'
              ? ({ item }) => (
                <PostComment
                  comment={item}
                  handleDeleteComment={(commentId) => deleteComment(commentId)}
                />
              )
              : null
          }
        />
      )}
      {/* Если открыт режим комментариев, отрисовываем поле ввода отдельно */}
      {bottomSheetType === 'comments' && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
          style={styles.commentInputContainer}
        >
          <View style={[styles.footer, Platform.OS === 'android' ? { paddingBottom: isKeyboardVisible ? 0 : 90 } : {paddingBottom: 90}]}>
            <TextInput
              multiline
              style={{ maxHeight:180, borderBlockColor: '#E4E4E4', borderWidth: 1, borderColor: '#E4E4E4', borderRadius: 5, padding: 5, flex: 1}}
              placeholder={i18n.t('feedPosts.commentInput')}
              className="flex-1 bg-gray-100 rounded-md px-2 py-1 text-base"
              onChangeText={(text) => setCommentText(text)}
              value={commentText}
              onFocus={() =>setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
            <IconButton
              icon="send"
              iconColor={BG_COLORS.purple[400]}
              onPress={addComment}
              size={20}
              style={{ marginLeft: 4, marginRight: -6 }}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'white',
    maxHeight: 248,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',

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
  fabAnim: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  noCommentsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12
  },
  commentInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingBottom: 8, // можно подогнать отступ под свои нужды
  },

})

export default Feed;