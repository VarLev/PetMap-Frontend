import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { ReviewDTO } from '@/dtos/classes/review/Review';
import userStore from '@/stores/UserStore';
import i18n from '@/i18n';

interface ReviewCommentProps {
  item: ReviewDTO;
  // onUpdateReview: (review: ReviewDTO) => Promise<void>;
  refreshReviews: (updatedReview: ReviewDTO) => void;
  handleDeleteReview: (commentId: string) => void;
}

const TextComment: React.FC<ReviewCommentProps> = ({
  item,
  // onUpdateReview,
  refreshReviews,
  handleDeleteReview
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.comment);
  const [editedRating, setEditedRating] = useState(item.rating);

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // const handleSaveEdit = async () => {
  //   item.comment = editedText;
  //   item.rating = editedRating;
  //   await onUpdateReview(item);
  //   setIsEditing(false);
  // };

  // const onEdit = () => {
  //   setIsEditing(true);
  //   closeMenu();
  // };

  const onDelete = async () => {
    handleDeleteReview(item.id);
    closeMenu();
  };

  // const handleCancelEdit = () => {
  //   setEditedText(item.comment);
  //   setEditedRating(item.rating);
  //   setIsEditing(false);
  // };

  return (
    <View className="bg-white">
      <View className="flex-row justify-between items-center">
        <View className="flex-col">
        <Text className="text-lg font-nunitoSansBold">
          {item.userName}
        </Text>
        <Text className="text-base font-nunitoSansRegular">
        {item.comment}
        </Text>
        </View>
        {userStore.currentUser && item.userId === userStore.currentUser.id && (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            contentStyle={{ backgroundColor: 'white' }}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                iconColor="gray"
                onPress={openMenu}
                className="mt-0"
              />
            }
          >
            <Menu.Item
              onPress={onDelete}
              title={i18n.t('ReviewComment.delete')}
              titleStyle={{ color: 'black' }}
              leadingIcon="delete-outline"
            />
          </Menu>
        )}
      
      </View>
      {/* Добавляем имя автора */}
    
     
    </View>
  );
};

export default TextComment;