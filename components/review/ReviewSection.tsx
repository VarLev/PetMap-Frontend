import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Text } from "react-native";
import { Divider } from "react-native-paper";
import { ReviewDTO } from "@/dtos/classes/review/Review";
import StarRating from "react-native-star-rating-widget";
import CustomOutlineInputText from "../custom/inputs/CustomOutlineInputText";
import userStore from "@/stores/UserStore";
import CustomAlert from "../custom/alert/CustomAlert";
import ReviewComment from "./ReviewComment";
import mapStore from "@/stores/MapStore";
import StarSvgIcon from "../custom/icons/StarSvgIcon";
import i18n from "@/i18n";
import CustomLoadingButton from "../custom/buttons/CustomLoadingButton";

interface ReviewSectionProps {
  mapPointId: string;
  fetchReviews: () => Promise<ReviewDTO[]>;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ mapPointId, fetchReviews }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [localReviews, setLocalReviews] = useState<ReviewDTO[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewDTO | null>(null);

  const hasLoadedInitialReviews = useRef(false);

  useEffect(() => {
    if (!hasLoadedInitialReviews.current) {
      loadReviews();
      hasLoadedInitialReviews.current = true;
    }
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const newReviews = await fetchReviews();
      setLocalReviews(newReviews);
      // Определяем, есть ли отзыв текущего пользователя
      const userReview = newReviews.find(
        (review) =>
          userStore.currentUser && review.userId === userStore.currentUser.id
      );
      if (userReview) {
        setExistingReview(userReview);
        // Если необходимо, можно установить данные отзыва для редактирования
        setReviewText(userReview.comment);
        setRating(userReview.rating);
      }
    } catch (error) {
      console.error("Ошибка при загрузке отзывов:", error);
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
      setIsLoading(true);
      if (
        !userStore.currentUser ||
        !userStore.currentUser.id ||
        !userStore.currentUser.name
      ) {
        console.error("User ID или имя отсутствуют");
        return;
      }
      // Если отзыв существует, обновляем его, иначе создаём новый
      const review = new ReviewDTO(
        existingReview ? existingReview.id : "",
        rating,
        reviewText,
        new Date(),
        userStore.currentUser.id,
        userStore.currentUser.name ?? "User",
        mapPointId
      );

      await mapStore.addReview(review);
      setLocalReviews((prevReviews) => {
        if (existingReview) {
          return prevReviews.map((r) => (r.id === review.id ? review : r));
        } else {
          return [review, ...prevReviews];
        }
      });
      // После создания или обновления отзыва скрываем блок создания, устанавливая существующий отзыв
      setExistingReview(review);
      // Сброс полей ввода (хотя блок больше не отображается)
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    await mapStore
      .deleteReview(reviewId)
      .then(() => {
        setLocalReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
        // После удаления отзыва разрешаем создание нового
        setExistingReview(null);
        setReviewText("");
        setRating(0);
      })
      .then(() => loadReviews());
  };

  const renderReview = ({ item }: { item: ReviewDTO }) => {
    return (
      <View>
        <ReviewComment
          item={item}
          handleDeleteReview={(reviewId) => deleteReview(reviewId)}
          refreshReviews={(updatedReview: ReviewDTO) => {
            setLocalReviews((prevReviews) =>
              prevReviews.map((r) =>
                r.id === updatedReview.id ? updatedReview : r
              )
            );
          }}
        />
        {localReviews.length - 1 !== localReviews.indexOf(item) && <Divider />}
      </View>
    );
  };

  return (
    <View className="pt-2">
      <Text className="text-base font-nunitoSansBold text-indigo-700">
        {i18n.t("ReviewsSection.title")}
      </Text>
      {/* Если у пользователя уже есть отзыв (или он только что создан), блок ввода не отображается */}
      {!existingReview && (
        <View>
          <CustomOutlineInputText
            numberOfLines={3}
            label={i18n.t("ReviewsSection.inputPlaceholder")}
            value={reviewText}
            handleChange={setReviewText}
          />
          <StarRating
            rating={rating}
            starSize={50}
            maxStars={5}
            onChange={setRating}
            emptyColor="#2F00B6"
            style={{ paddingVertical: 10, alignSelf: "center" }}
            color="#2F00B6"
            starStyle={{ marginHorizontal: 10 }}
            StarIconComponent={StarSvgIcon}
          />
          <CustomLoadingButton
            title={i18n.t("ReviewsSection.submitButton")}
            handlePress={handleSubmitReview}
            isLoading={isLoading}
          />
        </View>
      )}
      {localReviews.length === 0 ? (
        <Text className="mt-2 text-sm font-nunitoSansBold text-gray-400">
          {i18n.t("ReviewsSection.noReviews")}
        </Text>
      ) : (
        <FlatList
          data={localReviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.9}
        />
      )}
      <CustomAlert
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message={i18n.t("ReviewsSection.alertMessage")}
        type={"error"}
        title={i18n.t("ReviewsSection.alertTitle")}
      />
    </View>
  );
};

export default React.memo(ReviewSection);
