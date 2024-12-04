import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import StarRating from 'react-native-star-rating-widget';
import CustomButtonPrimary from '../custom/buttons/CustomButtonPrimary';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';
import { ReviewDTO } from '@/dtos/classes/review/Review';
import userStore from '@/stores/UserStore';
import CustomAlert from '../custom/alert/CustomAlert';
import ReviewComment from './ReviewComment';
import mapStore from '@/stores/MapStore';
import StarSvgIcon from '../custom/icons/StarSvgIcon';

interface ReviewSectionProps {
  mapPointId: string;
  fetchReviews: (page: number) => Promise<ReviewDTO[]>;
  totalPages: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  mapPointId,
  fetchReviews,
  totalPages
}) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [localReviews, setLocalReviews] = useState<ReviewDTO[]>(new Array<ReviewDTO>());
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewDTO | null>(null);

  const hasLoadedInitialReviews = useRef(false); // Use ref to track if initial load has occurred

  useEffect(() => {
    console.log('Загрузка отзывов');
    if (!hasLoadedInitialReviews.current) {
      loadReviews(1); // Load first page on initial mount
      hasLoadedInitialReviews.current = true;
    }
  }, []);

  const loadReviews = async (page: number) => {
    if (isLoading || page > totalPages) return;
    setIsLoading(true);
    try {
      const newReviews = await fetchReviews(page);
      setLocalReviews((prevReviews) => [...prevReviews, ...newReviews]);

      // Check if the current user has already left a review for this point
      const userReview = newReviews.find(
        (review) => userStore.currentUser && review.userId === userStore.currentUser.id
      );
      if (userReview) {
        setExistingReview(userReview);
        setReviewText(userReview.comment);
        setRating(userReview.rating);
      }
    
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOrUpdateReview = async () => {
    if (!reviewText || rating === 0) {
      setModalVisible(true);
      return;
    }

    try {
      if (!userStore.currentUser || !userStore.currentUser.id || !userStore.currentUser.name) {
        console.error('User ID or name is missing');
        return;
      }
      const review = new ReviewDTO(
        existingReview ? existingReview.id : '',
        rating,
        reviewText,
        new Date(),
        userStore.currentUser.id,
        userStore.currentUser.name ?? 'User',
        mapPointId // Include pointId in the constructor
      );

      console.log('Отправка отзыва:', reviewText, rating);
      await mapStore.addReview(review);
      setLocalReviews((prevReviews) => {
        if (existingReview) {
          return prevReviews.map((r) => (r.id === review.id ? review : r));
        } else {
          return [review, ...prevReviews];
        }
      });
      setReviewText('');
      setRating(0);
      setExistingReview(null);
    } catch (error) {
      console.error('Ошибка при отправке/обновлении отзыва:', error);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      loadReviews(currentPage + 1); // Load the next page
    }
  };

  const renderReview = ({ item }: { item: ReviewDTO }) => (
    <ReviewComment
      item={item}
      onUpdateReview={handleSubmitOrUpdateReview}
      refreshReviews={(updatedReview: ReviewDTO) => {
        setLocalReviews((prevReviews) =>
          prevReviews.map((r) => (r.id === updatedReview.id ? updatedReview : r))
        );
      }}
    />
  );

  return (
    <View className="pt-2">
      <Text className='ml-1 text-base font-nunitoSansBold text-indigo-700  '>Оценки и отзывы</Text>
      {!existingReview && (
        <View className="m-2">
          <CustomOutlineInputText
            numberOfLines={3}
            label="Напишите ваш отзыв"
            value={reviewText}
            handleChange={setReviewText}
          />
          <StarRating
            rating={rating}
            starSize={50}
            maxStars={5}
            onChange={setRating}
            emptyColor="#2F00B6"
            style={{ paddingVertical: 10, alignSelf: 'center' }}
            color="#2F00B6"
            starStyle={{ marginHorizontal: 10 }}
            StarIconComponent={StarSvgIcon}
          />
          <CustomButtonPrimary
            title="Отправить отзыв"
            handlePress={handleSubmitOrUpdateReview}
          />
        </View>
      )}
      {localReviews.length === 0 ? (
        <Text className='m-2 text-sm font-nunitoSansBold text-gray-400'>
          Никто еще не оставил отзыв об этом месте, будь первым и получи повышенные бонусы.
        </Text>
      ) : (
        <FlatList
          data={localReviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
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
      )}
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
