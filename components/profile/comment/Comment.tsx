import React, { FC, useEffect, useState, useCallback } from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import {Avatar,
  Text,
  IconButton,
  Menu,
  ActivityIndicator,
  TouchableRipple,
  Divider
} from 'react-native-paper';
import { router } from 'expo-router';
import searchStore from '@/stores/SearchStore';
import userStore from '@/stores/UserStore';
import i18n from '@/i18n';
import CustomLoadingButton from '@/components/custom/buttons/CustomLoadingButton';

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  userAvatar: string;
};

type CommentItemProps = {
  comment: Comment;
  onDelete: (commentId: string) => void;
};

const CommentItem: FC<CommentItemProps> = ({ comment, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isCurrentUser = userStore.currentUser?.id === comment.userId;

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await searchStore.deletePostComment(comment.id);
      onDelete(comment.id);
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
    } finally {
      setIsDeleting(false);
      closeMenu();
    }
  };

  const openUserProfile = useCallback(() => {
    router.push(`/(user)/${comment.userId}`);
  }, [comment.userId]);

  // Вычисляем компоненты меню и заголовка комментария
  const menuComponent = isCurrentUser && (
    <Menu
    contentStyle={{marginTop: 40}}
      visible={menuVisible}
      onDismiss={closeMenu}
      anchor={<IconButton icon="dots-vertical" onPress={openMenu} size={20} />}
    >
      <Menu.Item
        onPress={handleDelete}
        title={
          isDeleting ? (
            <ActivityIndicator size="small" color="#6200ee" />
          ) : (
            i18n.t('UserProfile.deleteReview') 
          )
        }
      />
    </Menu>
  );

  const commentHeader = (
    <View style={styles.commentHeader}>
      <View style={styles.userInfo}>
        <TouchableRipple onPress={openUserProfile}>
          <Avatar.Image size={36} source={{ uri: comment.userAvatar }} />
        </TouchableRipple>
        <View style={styles.userDetails}>
          <TouchableRipple onPress={openUserProfile}>
            <Text style={styles.userName} className='font-nunitoSansRegular'>{comment.userName}</Text>
          </TouchableRipple>
          <Text style={styles.dateText} className='font-nunitoSansRegular'>
            {new Date(comment.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      {menuComponent}
    </View>
  );

  const renderedCommentItem = (
    <View className='px-4'>
      
        {commentHeader}
        <Text style={styles.commentText} className='font-nunitoSansRegular'>{comment.content}</Text>
        <Divider className='mt-2'   />

    </View>
  );

  return renderedCommentItem;
};

type CommentsListProps = {
 postId: string; // ID пользователя это ID поста
};

const CommentsList: FC<CommentsListProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');



  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await searchStore.fetchGetComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Ошибка при загрузке комментариев:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleDeleteComment = useCallback((deletedCommentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== deletedCommentId));
  }, []);

  const handleCreateComment = async () => {
    if (!content.trim()) {
      return;
    }
    try {
      await searchStore.addComment(postId, content);
      setContent('');
      loadComments();
    } catch (error) {
      console.error('Ошибка при создании комментария:', error);
    }
  };

  // Вычисляем контент комментариев (либо индикатор загрузки, либо список)
  const commentsContent = isLoading ? (
    <ActivityIndicator size="large" color="#6200ee" style={styles.loadingIndicator} />
  ) : (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CommentItem comment={item} onDelete={handleDeleteComment} />
      )}
    />
  );

  const renderedCommentsList = (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder=""
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={250}
        />
        <CustomLoadingButton handlePress={handleCreateComment} title={i18n.t('UserProfile.writeReview')}/>
      </View>
      {commentsContent}
    </View>
  );

  return renderedCommentsList;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 8,
    borderRadius: 10,
  },
  commentHeader: {
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 8,
  },
  userName: {
    fontWeight: 'bold',
  },
  dateText: {
    color: 'gray',
    fontSize: 12,
  },
  commentText: {
    marginTop: 2,
    marginLeft: 44,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 50,
    marginBottom: 8,
  },
  loadingIndicator: {
    marginTop: 16,
  },
});

export default CommentsList;
