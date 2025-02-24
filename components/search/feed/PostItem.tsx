import { FC, useEffect, useMemo, useState } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { Text, Menu, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { IPost } from '@/dtos/Interfaces/feed/IPost';
import { BG_COLORS } from '@/constants/Colors';
import { router } from 'expo-router';
import searchStore from '@/stores/SearchStore';
import userStore from '@/stores/UserStore';
import i18n from '@/i18n';
import ComplaintModal from '@/components/custom/complaint/ComplaintModal';
import CustomTextComponent from '@/components/custom/text/CustomTextComponent';
import PhotoCarusel from '@/components/common/PhotoCarusel';
import WebView from 'react-native-webview';
import { randomUUID } from 'expo-crypto';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';

type PostCardProps = {
  post: IPost;
  handleSheetCommentsOpenById: (postId: string) => void;
  refresh: boolean;
  isProfileView?: boolean;
  setCurrentPlayingVideo: (videoId: string) => void;
  currentPlayingVideo: string;
};

const PostCard: FC<PostCardProps> = observer(
  ({ post, handleSheetCommentsOpenById, refresh, isProfileView, currentPlayingVideo, setCurrentPlayingVideo }) => {
    const [hasLiked, setHasLiked] = useState<boolean>(post.hasLiked);
    const [commentText, setCommentText] = useState<string>('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isLoadingDeletingPost, setIsLoadingDeletingPost] = useState(false);
    const [likesCounter, setLikesCounter] = useState<number>(post.likesCount);
    const [commentsCounter, setCommentsCounter] = useState(post.comments.length);
    const [isComplaintModal, setIsComplaintModal] = useState<boolean>(false);
    const [isComplaintDone, setIsComplaintDone] = useState(false);
    const [isComplaintSuccess, setIsComplaintSuccess] = useState(false);
    const [webViewRefresherKey, setWebViewRefresherKey] = useState<string>('');

    const [previewAvailable, setPreviewAvailable] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string>(`https://vz-cb33998c-f18.b-cdn.net/${post.postPhotos[0]?.id}/preview.webp`);
    const maxRetries = 10; // Например, 10 попыток
  
   
    

    useEffect(() => {
      (async () => {
        const postComments = await searchStore.fetchGetComments(post.id);
        const hasLiked = await searchStore.hasUserLiked(post.id);
        updateLikes();
        setHasLiked(hasLiked);
        setCommentsCounter(postComments.length);
      })();
    }, [refresh]);

    useEffect(() => {
      if (!post.postPhotos.length) return;
      let isMounted = true;
      //setPreviewUrl(`https://vz-cb33998c-f18.b-cdn.net/${post.postPhotos[0].id}/preview.webp`);
      const checkPreview = async () => {
        try {
          
          const response = await fetch(previewUrl, { method: 'HEAD' });
          if (response.ok && isMounted) {
            console.log('Preview ready');
            setPreviewAvailable(true);
            setRetryCount(0); // Сбрасываем счетчик
          } else {
            throw new Error('Preview not ready');
          }
        } catch (_error) {
          if (retryCount < maxRetries && isMounted) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              checkPreview();
            }, 5000);
          } else {
            setPreviewAvailable(false); // Если не удалось загрузить после 10 попыток, отключаем превью
          }
        }
      };
    
      checkPreview();
    
      return () => {
        isMounted = false;
      };
    }, [post.postPhotos[0]?.id]); // Зависимость - ID фото, а не URL, чтобы эффект срабатывал при смене фото
    
  

    const memoDepends = [
      post,
      likesCounter,
      commentText,
      menuVisible,
      hasLiked,
      isCurrentUser,
      isLoadingDeletingPost,
      isComplaintModal,
      isComplaintDone,
      isComplaintSuccess,
      commentsCounter,
      currentPlayingVideo,
      previewAvailable
    ];

    const updateLikes = async () => {
      const updatedLikesCount = await searchStore.fetchLikesCount(post.id);
      setLikesCounter(updatedLikesCount);
    };

    const toggleLike = async () => {
      try {
        if (!hasLiked) {
          await searchStore.likePost(post.id);
          setLikesCounter(likesCounter + 1);
          setHasLiked(true);
        } else {
          await searchStore.unlikePost(post.id);
          setLikesCounter(likesCounter - 1);
          setHasLiked(false);
        }
      } catch (error) {
        console.error('Error updating like:', error);
      } finally {
        updateLikes();
      }
    };

    const openMenu = () => {
      if (post.userId === userStore.currentUser?.id) {
        setIsCurrentUser(true);
      } else {
        setIsCurrentUser(false);
      }
      setMenuVisible(true);
    };

    const closeMenu = () => setMenuVisible(false);

    const deletePost = async (postId: string) => {
      try {
        setIsLoadingDeletingPost(true);
        await searchStore.deletePost(postId);
        await searchStore.fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        setMenuVisible(false);
        setIsLoadingDeletingPost(false);
      }
    };

    const closeComplaintModal = () => {
      setIsComplaintModal(false);
    };

    const handleComplain = () => {
      setMenuVisible(false);
      setIsComplaintModal(true);
    };

    const handleSheetCommentsOpen = (postId: string) => {
      handleSheetCommentsOpenById(postId);
    };

    const addComment = async () => {
      if (commentText.trim()) {
        await searchStore.addComment(post.id, commentText.trim());
        setCommentsCounter(commentsCounter + 1);
        setCommentText('');
      }
    };

    const openUserProfile = (userId: string) => {
      router.push(`/(user)/${userId}`);
    };

    const onComplain = async (text: string) => {
      await searchStore
        .complain(text)
        .then(() => {
          setIsComplaintDone(true);
          setIsComplaintSuccess(true);
        })
        .catch(() => {
          setIsComplaintDone(true);
          setIsComplaintSuccess(false);
        });
    };

    const onVideoPress = () => {
      // Обновляем глобальное состояние
      setCurrentPlayingVideo(post.id);
      // Обновляем ключ WebView для перерендеривания, если необходимо
      setWebViewRefresherKey(randomUUID());
    };

 

    const CardItem = useMemo(
      () => (
        <Card className="mx-2 mt-2 bg-white rounded-2xl">
          <Card.Content>
            <View className="flex-row items-center justify-between mb-1">
              {isProfileView && <Text className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</Text>}
              {!isProfileView && (
                <>
                  <View className="flex-row items-center">
                    <TouchableRipple onPress={() => openUserProfile(post.userId)}>
                      <Avatar.Image size={36} source={{ uri: `${post.userAvatar}` }} />
                    </TouchableRipple>
                    <View className="ml-2">
                      <TouchableRipple onPress={() => openUserProfile(post.userId)}>
                        <Text className="font-bold text-sm">{post.userName}</Text>
                      </TouchableRipple>
                      <Text className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</Text>
                    </View>
                  </View>
                  <View>
                    <Menu
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        top: 40,
                      }}
                      visible={menuVisible}
                      onDismiss={closeMenu}
                      anchor={<IconButton icon="dots-vertical" style={{ margin: 0 }} onPress={openMenu} size={20} />}
                    >
                      {isCurrentUser ? (
                        <Menu.Item
                          contentStyle={{ display: 'flex' }}
                          onPress={() => deletePost(post.id)}
                          title={
                            isLoadingDeletingPost ? <ActivityIndicator size="small" color="#6200ee" /> : i18n.t('feedPosts.deletePost')
                          }
                        />
                      ) : (
                        <Menu.Item onPress={handleComplain} title={i18n.t('feedPosts.complainOnPost')} />
                      )}
                    </Menu>
                  </View>
                </>
              )}

              <ComplaintModal
                isVisible={isComplaintModal}
                handleCloseModal={closeComplaintModal}
                handleComplain={(text) => onComplain(text)}
                isComplaintDone={isComplaintDone}
                isComplaintSuccess={isComplaintSuccess}
                contentId={post.id}
                contentUserId={post.userId}
                contentType={'post'}
              />
            </View>
            {post.content.length > 0 && <CustomTextComponent text={post.content} maxLines={10} enableTranslation />}
            {post.postPhotos.length > 0 && (
              <View className="rounded-2xl justify-center items-center">
                {(post.postPhotos.length === 1 && post.postPhotos[0].url.includes('iframe.mediadelivery.net')) ? (
                  previewAvailable ?(
                  Platform.OS === 'ios' ? (
                    <TouchableWithoutFeedback onPress={onVideoPress} style={{ width: 340, height: 440, alignSelf: 'center' }}>
                      <WebView
                        source={{
                          uri:
                            currentPlayingVideo === post.id
                              ? post.postPhotos[0].url
                              : previewUrl,
                        }}
                        style={{ width: 360, height: 440, alignSelf: 'center' }}
                        allowsFullscreenVideo={true}
                        className="bg-white rounded-2xl overflow-hidden"
                        refresherKey={webViewRefresherKey}
                        scrollEnabled={false}
                        allowsInlineMediaPlayback={true}
                        useWebView2={true}
                      />
                    </TouchableWithoutFeedback>
                    ):(
                      <WebView
                        source={{
                          uri:
                            currentPlayingVideo === post.id
                              ? post.postPhotos[0].url
                              : previewUrl,
                        }}
                       
                        style={{ width: 360, height: 440, alignSelf: 'center' }}
                        allowsFullscreenVideo={true}
                        className="bg-white rounded-2xl overflow-hidden"
                        refresherKey={webViewRefresherKey}
                        onTouchEndCapture={onVideoPress}
                        scrollEnabled={false}
                        allowsInlineMediaPlayback={true}
                        useWebView2={true}
                      />
                    )
                  ) : (         
                      
                     <Text className="text-center text-gray-500 text-xs font-nunitoSansRegular">Loading...</Text>
                  )
                ) : (
                  <PhotoCarusel images={post.postPhotos} imageWidth={325} imageHeight={300} />
                )}
              </View>
            )}
          </Card.Content>
          <Card.Actions>
            <View className="flex-row items-center w-full">
              {/* Кнопки лайка и комментариев (слева) */}
              <View className="-ml-2 flex-row items-center mr-2">
                <IconButton
                  icon={hasLiked ? 'heart' : 'heart-outline'}
                  iconColor={hasLiked ? BG_COLORS.purple[400] : 'gray'}
                  onPress={toggleLike}
                  size={20}
                />
                <Text className="-ml-2 text-sm text-gray-500 font-medium">{likesCounter}</Text>
                <IconButton
                  icon="comment-outline"
                  className="-ml-0"
                  iconColor="gray"
                  size={20}
                  onPress={() => handleSheetCommentsOpen(post.id)}
                />
                <Text className="-ml-2 text-sm text-gray-500 font-medium">{commentsCounter}</Text>
              </View>

              {/* Поле ввода текста и кнопка отправки (справа) */}
              <View className="flex-row items-center flex-1 -mr-1">
                <TextInput
                  multiline
                  style={{
                    maxHeight: 180,
                    borderBlockColor: '#E4E4E4',
                    borderWidth: 1,
                    borderColor: '#E4E4E4',
                    borderRadius: 5,
                    padding: 5,
                    flex: 1,
                  }}
                  placeholder={i18n.t('feedPosts.commentInput')}
                  className="flex-1 bg-gray-100 rounded-md px-2 py-1 text-sm"
                  onChangeText={(text) => setCommentText(text)}
                  value={commentText}
                />
                <IconButton icon="send" iconColor={BG_COLORS.purple[400]} onPress={addComment} size={20} style={{ marginLeft: 4 }} />
              </View>
            </View>
          </Card.Actions>
        </Card>
      ),
      [...memoDepends]
    );

    return CardItem;
  }
);

export default PostCard;
