import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { ReviewDTO } from '@/dtos/classes/review/Review';
import StarRating from 'react-native-star-rating-widget';
import CustomButtonPrimary from '../custom/buttons/CustomButtonPrimary';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import userStore from '@/stores/UserStore';
import StarSvgIcon from '../custom/icons/StarSvgIcon';
import i18n from '@/i18n';

interface ReviewCommentProps {
  item: ReviewDTO;
  onUpdateReview: (review: ReviewDTO) => Promise<void>;
  refreshReviews: (updatedReview: ReviewDTO) => void;
}

const ReviewComment: React.FC<ReviewCommentProps> = ({
  item,
  onUpdateReview,
  refreshReviews,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.comment);
  const [editedRating, setEditedRating] = useState(item.rating);

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSaveEdit = async () => {
    item.comment = editedText;
    item.rating = editedRating;
    await onUpdateReview(item);
    setIsEditing(false);
  };

  const onEdit = () => {
    setIsEditing(true);
    closeMenu();
  };

  const onDelete = () => {
    console.log(i18n.t('ReviewComment.deleteLog'));
  };

  const handleCancelEdit = () => {
    setEditedText(item.comment);
    setEditedRating(item.rating);
    setIsEditing(false);
  };

  return (
    <View className="bg-white my-[20px]">
      <View className="flex-row justify-between items-start">
        <View className="flex-col">
          <Text className="text-lg font-nunitoSansBold">{item.userName}</Text>
          <Text className="text-xs font-nunitoSansRegular">
            {i18n.t('ReviewComment.oneDayAgo')}
          </Text>
          <StarRating
            rating={isEditing ? editedRating : item.rating}
            starSize={20}
            onChange={isEditing ? setEditedRating : () => {}}
            starStyle={{ marginHorizontal: 1}}
            style={{ paddingVertical: 1 }}
            StarIconComponent={StarSvgIcon}
            color="#2F00B6"
            emptyColor="#2F00B6"
          />
        </View>
        {userStore.currentUser && item.userId === userStore.currentUser.id && (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            contentStyle={{ backgroundColor: 'white' }}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={30}
                iconColor="gray"
                onPress={openMenu}
                className="mt-0"
              />
            }
          >
            <Menu.Item
              onPress={onEdit}
              title={i18n.t('ReviewComment.edit')}
              rippleColor="black"
              titleStyle={{ color: 'black' }}
              leadingIcon="pencil-outline"
            />
            <Menu.Item
              onPress={onDelete}
              title={i18n.t('ReviewComment.delete')}
              titleStyle={{ color: 'black' }}
              leadingIcon="delete-outline"
            />
          </Menu>
        )}
      </View>
      {isEditing ? (
        <>
          <TextInput
            value={editedText}
            onChangeText={setEditedText}
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              padding: 5,
              marginVertical: 10,
              borderRadius: 5,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}
          >
            <CustomButtonPrimary
              containerStyles='px-4'
              title={i18n.t('ReviewComment.save')}
              handlePress={handleSaveEdit}
            />
            <CustomButtonOutlined
              containerStyles='px-4'
              title={i18n.t('ReviewComment.cancel')}
              handlePress={handleCancelEdit}
            />
          </View>
        </>
      ) : (
        <Text className="pt-2 text-base font-nunitoSansRegular">
          {item.comment}
        </Text>
      )}
    </View>
  );
};

export default ReviewComment;