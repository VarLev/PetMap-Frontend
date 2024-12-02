import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Card, Divider, IconButton, Menu } from 'react-native-paper';
import StarRating from 'react-native-star-rating-widget';
import CustomButtonPrimary from '../custom/buttons/CustomButtonPrimary';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import { ReviewDTO } from '@/dtos/classes/review/Review';
import userStore from '@/stores/UserStore';
import StarSvgIcon from '../custom/icons/StarSvgIcon';

interface ReviewCommentProps {
  item: ReviewDTO;
  onUpdateReview: (review: ReviewDTO) => Promise<void>;
  refreshReviews: (updatedReview: ReviewDTO) => void;
}


const ReviewComment: React.FC<ReviewCommentProps> = ({ item, onUpdateReview, refreshReviews }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.comment);
  const [editedRating, setEditedRating] = useState(item.rating);

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSaveEdit = async () => {
    // Логика для сохранения отредактированного отзыва
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
    // Логика для удаления отзыва
    console.log('Delete review');
  };

  const handleCancelEdit = () => {
    setEditedText(item.comment);
    setEditedRating(item.rating);
    setIsEditing(false);
  };

  return (
    <View className="m-1 p-2 bg-white" >
      <Divider className='bg-slate-300' />
      <View className='flex-row justify-between items-start'>
        <View className='flex-col'>
          <Text className='text-lg font-nunitoSansBold'>{item.userName}</Text>
          <Text className='-mt-1 text-xs font-nunitoSansRegular'>1 день назад</Text>
          <StarRating
            rating={isEditing ? editedRating : item.rating}
            starSize={20}
            onChange={isEditing ? setEditedRating : () => {}}
            style={{ paddingVertical: 1 }}
            StarIconComponent={StarSvgIcon}
            color='#2F00B6'
            emptyColor='#2F00B6'
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
                className='mt-0'
              />
            }
          >
            <Menu.Item onPress={()=>setIsEditing(true)} title="Редактировать" rippleColor='black' titleStyle={{color:'balck'}} leadingIcon='pencil-outline'/>
            <Menu.Item onPress={onDelete} title="Удалить" titleStyle={{color:'balck'}} leadingIcon='delete-outline'/>
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <CustomButtonPrimary
              title="Сохранить"
              handlePress={handleSaveEdit}
            />
            <CustomButtonOutlined
              title="Отмена"
              handlePress={handleCancelEdit}
            />
          </View>
        </>
      ) : (
        <>
          <Text className='pt-2 text-base font-nunitoSansRegular'>{item.comment}</Text>
        </>
      )}
      
    </View>
  );
};


export default ReviewComment;