import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Card } from 'react-native-paper';
import StarRating from 'react-native-star-rating-widget';
import CustomButtonPrimary from '../custom/buttons/CustomButtonPrimary';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';
import { ReviewDTO } from '@/dtos/classes/review/Review';
import userStore from '@/stores/UserStore';
import CustomAlert from '../custom/alert/CustomAlert';

interface ReviewSectionProps {
  onSubmitReview: (review: ReviewDTO) => Promise<void>;
  fetchReviews: (page: number) => Promise<ReviewDTO[]>;
  totalPages: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  onSubmitReview,
  fetchReviews,
  totalPages,
}) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [localReviews, setLocalReviews] = useState<ReviewDTO[]>(new Array<ReviewDTO>());
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasLoadedInitialReviews = useRef(false); // Use ref to track if initial load has occurred

  useEffect(() => {
    if (!hasLoadedInitialReviews.current) {
      loadReviews(currentPage);
      hasLoadedInitialReviews.current = true;
    }
  }, [currentPage]);

  const loadReviews = async (page: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log('Загрузка отзывов');
      const newReviews = await fetchReviews(page);
      setLocalReviews((prevReviews) => [...prevReviews, ...newReviews]);
      console.log('Отзывы загружены:', localReviews);
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText || rating === 0) {
      setModalVisible(true);
      return;
    }

    try {
      if (!userStore.currentUser.id || !userStore.currentUser.name) {
        console.error('User ID or name is missing');
        return;
      }
      console.log('Отправка отзыва:', reviewText, rating);
      const review = new ReviewDTO(
        '',
        rating,
        reviewText,
        new Date(),
        userStore.currentUser.id,
        userStore.currentUser.name
      );
      await onSubmitReview(review);
      setLocalReviews([review, ...localReviews]);
      setReviewText('');
      setRating(0);
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderReview = ({ item }: { item: ReviewDTO }) => (
    <Card className="m-1 p-2 bg-white" elevation={1}>
      <Text>{item.userName}</Text>
      <StarRating
        rating={item.rating}
        starSize={15}
        onChange={() => {}}
        style={{ paddingVertical: 1 }}
      />
      <Text>{item.comment}</Text>
    </Card>
  );

  return (
    <View className="pt-2">
      <Card className="p-4 bg-white" elevation={1}>
        <CustomOutlineInputText
          numberOfLines={3}
          label="Напишите ваш отзыв"
          value={reviewText}
          handleChange={setReviewText}
        />
        <StarRating
          rating={rating}
          starSize={40}
          onChange={setRating}
          emptyColor="#2F00B6"
          style={{ paddingVertical: 10 }}
          color="#BFA8FF"
          starStyle={{ marginHorizontal: 5 }}
        />
        <CustomButtonPrimary
          title="Отправить отзыв"
          handlePress={handleSubmitReview}
        />
      </Card>

      <FlatList
        data={localReviews}
        renderItem={renderReview}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.9}
        ListFooterComponent={() =>
          currentPage < totalPages ? (
            <CustomButtonOutlined
              title="Загрузить еще"
              handlePress={handleLoadMore}
            />
          ) : null
        }
      />
      <CustomAlert
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message={'Поставьте рейтинг и напишите отзыв'}
        type={'error'}
        title={'Ошибка'}
      />
    </View>
  );
};

export default React.memo(ReviewSection);
