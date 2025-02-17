import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Text } from "react-native";
import { Divider } from "react-native-paper";
import { ReviewDTO } from "@/dtos/classes/review/Review";
import CustomButtonPrimary from "../custom/buttons/CustomButtonPrimary";
import CustomOutlineInputText from "../custom/inputs/CustomOutlineInputText";
import userStore from "@/stores/UserStore";
import CustomAlert from "../custom/alert/CustomAlert";
import TextComment from "./TextComment";
import mapStore from "@/stores/MapStore";
import i18n from "@/i18n";
import CustomLoadingButton from "../custom/buttons/CustomLoadingButton";
import { set } from "lodash";

interface CommentSectionProps {
  mapPointId: string;
  fetchReviews: () => Promise<ReviewDTO[]>;
}

const TextReviewSection: React.FC<CommentSectionProps> = ({ mapPointId, fetchReviews }) => {
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<ReviewDTO[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasLoadedInitialComments = useRef(false);

  useEffect(() => {
    if (!hasLoadedInitialComments.current) {
      loadComments();
      hasLoadedInitialComments.current = true;
    }
  }, []);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const newComments = await fetchReviews();
      setLocalComments(newComments);
    } catch (error) {
      console.error("Ошибка при загрузке комментариев:", error);
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleSubmitComment = async () => {
    if (!commentText) {
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
        console.error("Отсутствует ID или имя пользователя");
        return;
      }

      // Создаем новый комментарий (рейтинг не используется, поэтому передаем 0)
      const comment = new ReviewDTO(
        "", // При отсутствии id создается новый
        0,
        commentText,
        new Date(),
        userStore.currentUser.id,
        userStore.currentUser.name ?? "User",
        mapPointId
      );

      await mapStore.addReview(comment);
      setLocalComments((prevComments) => [comment, ...prevComments]);
      setCommentText("");
    } catch (error) {
      console.error("Ошибка при отправке комментария:", error);
      
    }finally{
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    await mapStore
      .deleteReview(commentId)
      .then(() => {
        setLocalComments([]);
        loadComments();
      })
      .catch((error) => {
        console.error("Ошибка при удалении комментария:", error);
      });
  };

  const renderComment = ({ item }: { item: ReviewDTO }) => (
    <View>
      <TextComment
        item={item}
        handleDeleteReview={(id) => deleteComment(id)}
        refreshReviews={(updatedComment: ReviewDTO) => {
          setLocalComments((prevComments) =>
            prevComments.map((c) =>
              c.id === updatedComment.id ? updatedComment : c
            )
          );
        }}
      />
      {localComments.length - 1 !== localComments.indexOf(item) && <Divider />}
    </View>
  );

  return (
    <View className="pt-2">
      <Text className="text-base font-nunitoSansBold text-indigo-700">
        {i18n.t("ReviewsSection.title")}
      </Text>
      <View>
        <CustomOutlineInputText
          numberOfLines={3}
          label={i18n.t("ReviewsSection.inputPlaceholder")}
          value={commentText}
          handleChange={setCommentText}
        />
        <CustomLoadingButton
          title={i18n.t("ReviewsSection.submitButton")}
          handlePress={handleSubmitComment}
          isLoading={isLoading}
        />
        
      </View>
      <Divider className="mt-2"/>
      {localComments.length === 0 ? (
        <Text className="mt-2 text-sm font-nunitoSansBold text-gray-400">
          {i18n.t("ReviewsSection.noReviews")}
        </Text>
      ) : (
        <FlatList
          data={localComments}
          renderItem={renderComment}
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

export default React.memo(TextReviewSection);
