import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { Avatar } from 'react-native-paper';
import UserCard from '../custom/cards/UserCard';
import usersStore from '@/stores/UserStore';
import { IUserCardDto } from '@/dtos/Interfaces/user/IUserCardDto';
import { Svg, Path, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import i18n from '@/i18n';
import SkeletonCard from '../custom/cards/SkeletonCard';

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState<IUserCardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanning, setIsPanning] = useState(false);


  // SHARED VALUE: общий translateY — им управляют и скролл, и жест
  const translateY = useSharedValue(0);

  const StarIcon = () => (
    <Svg width="23" height="21" viewBox="0 0 23 21" fill="none">
      <Path
        d="M10.5472 0.735608C10.9599 -0.0162274 12.0401 -0.0162266 12.4528 0.735609L15.1622 5.67098C15.3184 5.95535 15.5933 6.15513 15.912 6.21573L21.4431 7.26744C22.2857 7.42765 22.6195 8.45493 22.032 9.0798L18.1754 13.1817C17.9532 13.4181 17.8482 13.7413 17.889 14.0632L18.598 19.6485C18.706 20.4994 17.8321 21.1343 17.0563 20.7686L11.9634 18.3684C11.6699 18.2301 11.3301 18.2301 11.0366 18.3684L5.94369 20.7686C5.16786 21.1343 4.294 20.4994 4.402 19.6485L5.11097 14.0632C5.15182 13.7413 5.04679 13.4181 4.82458 13.1817L0.968018 9.0798C0.380525 8.45493 0.714309 7.42765 1.55689 7.26744L7.08797 6.21573C7.40667 6.15513 7.68164 5.95535 7.83775 5.67098L10.5472 0.735608Z"
        fill="#ACFFB9"
      />
    </Svg>
  );

  const fetchTopUsers = useCallback(async () => {
    const fetchedUsers = await usersStore.getAllTopUsers();
    const validUsers = fetchedUsers.filter((user) => user.name && user.thumbnailUrl);
    setTopUsers(validUsers);
    if (validUsers.length > 4) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopUsers();
    // Пример анимации "появления" блока при загрузке:
    translateY.value = withTiming(0, { duration: 500 });
  }, [fetchTopUsers]);

  // ==============
  // GESTURE (Свайп «шапки» вручную)
  // ==============
  // Общая позиция шапки


// Храним offset при начале свайпа
  const offsetY = useSharedValue(0);
  const panGesture = Gesture.Pan()
  .onBegin(() => {
    // Запоминаем, где была шапка ДО начала жеста
    offsetY.value = translateY.value;
    runOnJS(setIsPanning)(true);
  })
  .onUpdate((evt) => {
    // Текущее смещение = "где шапка была" + "сколько потянул пользователь"
    const newY = offsetY.value + evt.translationY;
    // Ограничиваем диапазон
    translateY.value = clamp(newY, -280, 0);
  })
  .onEnd(() => {
    // Snap-логика: если выше -100, доводим до -280, иначе опускаем до 0
    if (translateY.value < -100) {
      translateY.value = withTiming(-280, { duration: 600, easing: Easing.out(Easing.circle) });
    } else {
      translateY.value = withTiming(0, { duration: 600 });
    }
    runOnJS(setIsPanning)(false);
  });

  // ==============
  // SCROLL (Автоматически убирать «шапку» при прокрутке списка)
  // ==============
  const handleScroll = (event: { nativeEvent: { contentOffset: { y: any } } }) => {
    if (isPanning) return;
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 150) {
      // Прячем
      translateY.value = withTiming(-280, { duration: 600 });
    } else {
      // Показываем
      translateY.value = withTiming(0, { duration: 600 });
    }
  };

  // СТИЛИ ДЛЯ ВЕРХНЕГО БЛОКА
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleUserProfileOpen = (userId: string) => {
    router.push(`(user)/${userId}`);
  };

  // Рендерим Top-3
  const renderTopThreeUsers = useCallback(() => {
    if (topUsers.length < 3) return null;

    return (

      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="rounded-b-3xl"
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: '#2F00B6',
              paddingVertical: 20,
              zIndex: 100,
            },
            animatedStyle,
          ]}
        >
          <Svg height="100%" width="100%" className="absolute">
            <Defs>
              <RadialGradient
                id="grad"
                cx="0.1"
                cy="0.1"
                rx="100%"
                ry="100%"
                fx="0.1"
                fy="0.1"
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0%" stopColor="#BC88FF" />
                <Stop offset="100%" stopColor="#2F00B6" />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
          </Svg>

          <View className="flex-col justify-between">
            <View className="rounded-b-3xl p-4 rounded-full">
              <Text className="pt-2 text-white text-center mb-2 text-lg font-nunitoSansBold">
                {i18n.t('TopUsers.title')}
              </Text>
              <Text className="text-white text-center mb-4 text-base font-nunitoSansRegular">
                {i18n.t('TopUsers.description')}{' '}
                <Text
                  className="text-[#ACFFB9] text-base font-nunitoSansBold"
                  onPress={() => router.replace('/profile/myjobs')}
                >
                  {i18n.t('TopUsers.learnMore')}
                </Text>
              </Text>
            </View>

            <View className="flex-row items-center justify-center mx-2">
              {/* SECOND USER */}
              <View key={topUsers[1]?.id} className="items-center">
                <TouchableOpacity onPress={() => handleUserProfileOpen(topUsers[1]?.id)}>
                  <View className="border-2 rounded-full bg-white border-white">
                    <Avatar.Image
                      size={60}
                      source={{ uri: topUsers[1]?.thumbnailUrl ?? 'https://placehold.it/100x100' }}
                    />
                    <View style={{ position: 'absolute', top: -3, right: -3 }}>
                      <StarIcon />
                    </View>
                  </View>
                </TouchableOpacity>
                <Text
                  numberOfLines={1}
                  className="text-white mt-2 font-nunitoSansBold text-lg w-[120px] text-center"
                >
                  {topUsers[1]?.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Image
                    source={require('@/assets/images/bonuse.png')}
                    style={{ width: 26, height: 26, marginRight: 4 }}
                  />
                  <Text className="text-white text-base font-nunitoSansBold">
                    {topUsers[1]?.balance}
                  </Text>
                </View>
              </View>

              {/* FIRST USER (the biggest one) */}
              <View key={topUsers[0]?.id} className="items-center -mt-2">
                <View>
                  <TouchableOpacity onPress={() => handleUserProfileOpen(topUsers[0]?.id)}>
                    <View className="border-2 rounded-full bg-white border-white">
                      <Avatar.Image
                        size={80}
                        source={{ uri: topUsers[0]?.thumbnailUrl ?? 'https://placehold.it/100x100' }}
                      />
                      <View style={{ position: 'absolute', top: -15, right: -15 }}>
                        <LottieView
                          source={require('@/assets/animations/FlashAnimation.json')}
                          autoPlay
                          loop
                          style={{ width: 50, height: 50 }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <Text
                  numberOfLines={1}
                  className="text-white font-nunitoSansBold text-lg w-[120px] text-center"
                >
                  {topUsers[0]?.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Image
                    source={require('@/assets/images/bonuse.png')}
                    style={{ width: 26, height: 26, marginRight: 4 }}
                  />
                  <Text className="text-white text-base font-nunitoSansBold">
                    {topUsers[0]?.balance}
                  </Text>
                </View>
              </View>

              {/* THIRD USER */}
              <View key={topUsers[2]?.id} className="items-center">
                <TouchableOpacity onPress={() => handleUserProfileOpen(topUsers[2]?.id)}>
                  <View className="border-2 rounded-full bg-white border-white">
                    <Avatar.Image
                      size={60}
                      source={{ uri: topUsers[2]?.thumbnailUrl ?? 'https://placehold.it/100x100' }}
                    />
                    <View style={{ position: 'absolute', top: -3, right: -3 }}>
                      <StarIcon />
                    </View>
                  </View>
                </TouchableOpacity>
                <Text
                  numberOfLines={1}
                  className="text-white mt-2 font-nunitoSansBold text-lg w-[120px] text-center"
                >
                  {topUsers[2]?.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Image
                    source={require('@/assets/images/bonuse.png')}
                    style={{ width: 26, height: 26, marginRight: 4 }}
                  />
                  <Text className="text-white text-base font-nunitoSansBold">
                    {topUsers[2]?.balance}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  }, [topUsers, animatedStyle, panGesture]);

  // Скелетоны на время загрузки
  const skeletonCount = 5;
  const renderItem = ({ item }: { item: IUserCardDto | number }) => {
    return isLoading ? <SkeletonCard /> : <UserCard user={item as IUserCardDto} />;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* TOP-3 BLOCK (с анимацией и свайпом) */}
      {renderTopThreeUsers()}
      <View className='h-5'/>

      <FlatList
        data={
          isLoading
            ? Array.from({ length: skeletonCount }, (_, i) => i)
            : topUsers.slice(0)
        }
        keyExtractor={(item, index) =>
          isLoading ? index.toString() : (item as IUserCardDto).id.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        // Сохраняем автоматическую логику скрытия при скролле
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </GestureHandlerRootView>
  );
};

export default React.memo(TopUsers);
