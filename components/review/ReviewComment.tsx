import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Card } from 'react-native-paper';
import StarRating from 'react-native-star-rating-widget';
import CustomButtonPrimary from '../custom/buttons/CustomButtonPrimary';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import { ReviewDTO } from '@/dtos/classes/review/Review';
import userStore from '@/stores/UserStore';

interface ReviewCommentProps {
  item: ReviewDTO;
  onUpdateReview: (review: ReviewDTO) => Promise<void>;
  refreshReviews: (updatedReview: ReviewDTO) => void;
}


const ReviewComment: React.FC<ReviewCommentProps> = ({ item, onUpdateReview, refreshReviews }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.comment);
  const [editedRating, setEditedRating] = useState(item.rating);

  const handleSaveEdit = async () => {
    // Логика для сохранения отредактированного отзыва
    item.comment = editedText;
    item.rating = editedRating;
    await onUpdateReview(item);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(item.comment);
    setEditedRating(item.rating);
    setIsEditing(false);
  };

  return (
    <Card className="m-1 p-2 bg-white" elevation={1}>
      <Text>{item.userName}</Text>
      <StarRating
        rating={isEditing ? editedRating : item.rating}
        starSize={15}
        onChange={isEditing ? setEditedRating : () => {}}
        style={{ paddingVertical: 1 }}
      />
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
          <Text>{item.comment}</Text>
          {item.userId === userStore.currentUser.id && (
            <CustomButtonOutlined
              title="Редактировать"
              handlePress={() => {
                setIsEditing(true);
              }}
            />
          )}
        </>
      )}
    </Card>
  );
};


export default ReviewComment;