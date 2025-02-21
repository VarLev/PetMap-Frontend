import React, { useEffect } from "react";
import { View, Text, Image, Pressable, TouchableWithoutFeedback } from "react-native";
import { Card } from "react-native-paper";
import { IWalkAdvrtShortDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtShortDto";
import CustomTextComponent from "../text/CustomTextComponent";
import CustomButtonPrimary from "../buttons/CustomButtonPrimary";
import userStore from "@/stores/UserStore";
import { PET_IMAGE } from "@/constants/Strings";
import { getTagsByIndex } from "@/utils/utils";
import ImageModalViewer from "@/components/common/ImageModalViewer";
import i18n from "@/i18n";
import { router } from "expo-router";
import { MapPointType } from "@/dtos/enum/MapPointType";
import mapStore from "@/stores/MapStore";

interface AdCardProps {
  ad: IWalkAdvrtShortDto;
  pressDelete: (id: string) => Promise<void>;
}

const MyAdvrtCard: React.FC<AdCardProps> = ({ ad, pressDelete }) => {
  const [petImage, setPetImage] = React.useState<string>("");

  useEffect(() => {
    getPetImage().then((url) => setPetImage(url));
  }, []);

  const getPetImage = async (): Promise<string> => {
    const petImg = await userStore.fetchImageUrl(PET_IMAGE);
    return petImg || "https://placehold.it/100x100";
  };

  const handleNavigate = () => {
    if (ad.id) {
      mapStore.setMyPointToNavigateOnMap({
        pointId: ad.id,
        pointType: MapPointType.Walk,
      });
      router.push("(tabs)/map");
    }
  };

  return (
    <Card className="p-2 mx-4 mt-5 -mb-2 bg-white rounded-2xl" elevation={5}>
      {/* Область навигации карточки */}
      <Pressable onPress={handleNavigate} style={{ flex: 1 }}>
        <View className="flex-row items-start">
          <Image
            source={{ uri: ad.userPhoto }}
            className="w-20 h-20 rounded-xl"
          />
          {ad.userPets && ad.userPets.length > 0 && (
            <View className="absolute top-8 left-8 rounded-full">
              <ImageModalViewer
                images={[
                  {
                    uri:
                      ad.userPets[0].thumbnailUrl ||
                      petImage ||
                      "https://placehold.it/100x100",
                  },
                ]}
                imageHeight={60}
                imageWidth={60}
                borderRadius={4}
                className_="rounded-full"
              />
            </View>
          )}

          <View className="ml-2 w-60">
            <Text className="text-lg font-nunitoSansBold">
              {ad.userName}
            </Text>
            <CustomTextComponent
              text={ad.address}
              leftIcon="paper-plane-outline"
              iconSet="ionicons"
              className_="p-0"
              maxLines={3}
            />
            {ad.userPets && ad.userPets.length > 0 && (
              <CustomTextComponent
                text={`${ad.userPets[0].petName}, ${getTagsByIndex(
                  i18n.t("tags.breedsDog") as string[],
                  ad.userPets[0].breed!
                )}`}
                leftIcon="paw-outline"
                iconSet="ionicons"
                className_="p-0 pt-1"
              />
            )}
          </View>
        </View>

        {ad.description && (
          <Text className="m-2 text-sm text-gray-800">
            {ad.description}
          </Text>
        )}
      </Pressable>
      {/* Кнопка удаления – перехватывает событие нажатия */}
      <View className="flex-row w-full justify-between px-1">
        <TouchableWithoutFeedback
          onPress={(event) => event.stopPropagation()}
        >
          <CustomButtonPrimary
            title={i18n.t("MyAdvrtCard.delete")}
            containerStyles="w-full"
            handlePress={() => pressDelete(ad.id!)}
          />
        </TouchableWithoutFeedback>
      </View>
    </Card>
  );
};

export default MyAdvrtCard;
