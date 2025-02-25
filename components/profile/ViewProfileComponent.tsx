import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Image, StatusBar, StyleSheet, Platform } from 'react-native';
import { Text, Card, Divider, IconButton, Menu } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import BottomSheetComponent from '../common/BottomSheetComponent';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomTextComponent from '../custom/text/CustomTextComponent';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import { calculateHumanAge, calculateShortDogAge, getTagsByIndex, shortenName } from '@/utils/utils';
import CustomSocialLinkInput from '../custom/text/SocialLinkInputProps';
import { router, useNavigation } from 'expo-router';
import petStore from '@/stores/PetStore';
import { petCatUriImage, petUriImage } from '@/constants/Strings';
import { User } from '@/dtos/classes/user/UserDTO';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import AddCard from '../custom/buttons/AddCard';
import MenuItemWrapper from '../custom/menuItem/MunuItemWrapper';
import i18n from '@/i18n';
import { generateChatIdForTwoUsers } from '@/utils/chatUtils';
import { RefreshControl } from 'react-native';
import { BG_COLORS } from '@/constants/Colors';
import Feed from '../search/feed/Feed';

import Comment from './comment/Comment';
import { logViewProfile } from '@/services/AnalyticsService';

const ViewProfileComponent = observer(
  ({ onEdit, onPetOpen, loadedUser }: { onEdit: () => void; onPetOpen: (petId: string) => void; loadedUser: IUser }) => {
    const [user, setUser] = useState<IUser>(loadedUser);
    const sheetRef = useRef<BottomSheet>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [rightIcon, setRightIcon] = useState<string | null>();
    const [isIOS, setIsIOS] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [lastOnline, setLastOnline] = useState<string | null>(null);
    const [hasSubscription, setHasSubscription] = useState(userStore.getUserHasSubscription() ?? false);
    const [hasSubscriptionOtherUser, setHasSubscriptionOtherUser] = useState(false);
    const [activeSection, setActiveSection] = useState<'petshots' | 'comments'>('petshots');
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <>
            {!isLoading && (
              !isCurrentUser ? (
                <IconButton
                  icon="message-processing-outline"
                  size={30}
                  iconColor="white"
                  style={styles.menuButton}
                  onPress={openChat}
                />
              ) : (
                <Menu
                  visible={menuVisible}
                  onDismiss={closeMenu}
                  contentStyle={{ backgroundColor: 'white' }}
                  style={{ paddingTop: 20 }}
                  anchor={
                    <IconButton
                      icon="menu"
                      size={28}
                      iconColor="white"
                      style={styles.menuButton}
                      onPress={openMenu}
                    />
                  }
                >
                  <MenuItemWrapper
                    onPress={() => {
                      onEdit();
                      closeMenu();
                    }}
                    title={i18n.t('UserProfile.edit')}
                    icon="pencil-outline"
                  />
                </Menu>
              )
            )}
          </>
        ),
      });
    }, [isCurrentUser, hasSubscriptionOtherUser, menuVisible, isLoading, navigation, onEdit]);


    useEffect(() => {
      setIsIOS(Platform.OS === 'ios');
    }, []);

    const loadData = async () => {
      logViewProfile(user?.id)
      if (user.id === userStore.currentUser?.id) {
        console.log('Загружаем текущего пользователя');
        const user = await userStore.loadUser();
        setUser(user!);
        setIsCurrentUser(true);
        setRightIcon('chevron-right');
        setIsOnline(true);
      } else {
        if (!loadedUser.id) {
          console.log('Пользователь не найден');
          return;
        }

        const otherUser = await userStore.getUserById(loadedUser.id);
        setUser(otherUser as User);
        setIsCurrentUser(false);
        setRightIcon(null);
        setHasSubscriptionOtherUser(otherUser.isPremium ?? false);
        const onlineStatus = await userStore.getUserStatus(otherUser.id);
        const lastOnlineTime = await userStore.getUserLastOnline(otherUser.id);

        setIsOnline(isCurrentUser || (onlineStatus ?? false));
        setLastOnline(lastOnlineTime || null);
      }
      if (!await checkImageExists(user.thumbnailUrl ?? '') && user.thumbnailUrl !== '' && user.thumbnailUrl !== 'null' && user.thumbnailUrl !== 'undefined') {
        setUserAvatar(`https://avatar.iran.liara.run/username?username=${user.name}`);
      } else {
        setUserAvatar(user.thumbnailUrl!);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          await loadData();
        } catch {
          setIsLoading(true);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [isCurrentUser]);

    const handleRefresh = async () => {
      setRefreshing(true);
      await loadData();
      setRefreshing(false);
    };

    const openMenu = () => setMenuVisible(true);

    const closeMenu = () => setMenuVisible(false);


    const handleAddPet = () => {
      const newPat = petStore.getEmptyPetProfile('new', user.id);
      petStore.setPetProfile(newPat);
      router.push('/(pet)/new/edit');
    };

    const openChat = () => {
      const userId = userStore.currentUser?.id;
      if (!userId || !loadedUser.id) return;

      const chatId = generateChatIdForTwoUsers(userId, loadedUser.id);

      router.push({
        pathname: `(chat)/${chatId}`,
        params: {
          otherUserId: loadedUser.id,
        },
      });
    };

    const checkImageExists = async (url: string) => {
      try {
        await Image.prefetch(url);
        return true;
      } catch {
        return false;
      }
    };


    return (
      <GestureHandlerRootView className="h-full">
        <FlatList
          data={[1]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[BG_COLORS.violet[600]]} tintColor={BG_COLORS.violet[600]} />}
          renderItem={() => {
            return (
              <View style={{ alignItems: 'center' }}>
                <StatusBar backgroundColor="transparent" translucent />
                <View className="relative w-full aspect-square bg-white">
                  <Image source={{ uri: userAvatar ?? `https://avatar.iran.liara.run/username?username=${user.name}` }} className="w-full h-full" />
                </View>
              </View>
            );
          }} />

        <BottomSheetComponent
          ref={sheetRef}
          enablePanDownToClose={false}
          snapPoints={['55%', '100%']}
          renderContent={
            <View className="bg-white h-full">
              <View className='flex-row items-center pl-4'>
                <View className="relative">
                  {((hasSubscription && isCurrentUser) || (hasSubscriptionOtherUser)) && (<Image source={require('@/assets/images/subscription-marker.png')} className={`h-[34px] w-[27px] absolute ${Platform.OS === 'android' ? '-top-[5px]' : '-top-[4.6px]'} -right-[6px]`} />)}
                  <View className={`w-4 h-4 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                </View>
                <View className='flex-col'>
                  <Text className="pl-2 text-2xl font-nunitoSansBold" numberOfLines={2}>
                    {user.name}
                    {user.birthDate && `, ${calculateHumanAge(user.birthDate)}`}
                  </Text>
                  {lastOnline && (
                    <Text className="pl-2 -mt-1 text-xs font-nunitoSansRegular text-gray-400" numberOfLines={2}>
                      {i18n.t("lastOnline")} {lastOnline}
                    </Text>
                  )
                  }
                </View>
              </View>
              <View>
                <FlatList
                  horizontal={true}
                  data={user.petProfiles}
                  keyExtractor={(item, index) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity activeOpacity={0.85} style={{ alignItems: 'center' }} onPress={() => onPetOpen(item.id)}>
                      <Card className="w-[180px] h-[235px] p-2 m-2 rounded-2xl shadow bg-purple-100">
                        <Card.Cover source={{ uri: item.thumbnailUrl || (item.animalType === 1 ? petCatUriImage : petUriImage) }} style={{ height: 150, borderRadius: 14 }} />
                        <Text className="block font-nunitoSansBold text-lg mt-1 mb-[-8px] leading-5" numberOfLines={1} ellipsizeMode="tail">
                          {shortenName(item.petName)}, {calculateShortDogAge(item.birthDate)}
                        </Text>
                        <View style={{ marginTop: 5 }}>
                          <Text className="font-nunitoSansRegular" numberOfLines={1} ellipsizeMode="tail">
                            {getTagsByIndex(i18n.t('tags.TypePet') as string[], item.animalType!) + ', '}
                            {getTagsByIndex(i18n.t('tags.petGender') as string[], item.gender! ? item.gender! : 0)}
                            {item.weight ? `, ${item.weight} kg` : ''}
                          </Text>
                          <Text className="font-nunitoSansRegular" numberOfLines={1} ellipsizeMode="tail">
                            {getTagsByIndex(item.animalType === 0 ? i18n.t('tags.breedsDog') as string[] : i18n.t('tags.breedsCat') as string[], item.breed!)}
                          </Text>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={() =>
                    isCurrentUser ? <AddCard buttonText={i18n.t('UserProfile.addPet')} onPress={handleAddPet} /> : null
                  }
                />
              </View>

              <View className="pt-0 pr-3 pl-4">
                {/* Описание - рендерим, только если есть текст */}
                {user.description && user.description.length > 0 && (
                  <View>
                    <Text className="-mb-1 text-base font-nunitoSansBold text-indigo-700">{i18n.t('UserProfile.aboutMe')}</Text>
                    <CustomTextComponent
                      text={user.description}
                      rightIcon={rightIcon}
                      onRightIconPress={onEdit}
                      enableTranslation={true}
                      maxLines={20}
                    />
                    <Divider />
                  </View>
                )}

                {/* Интересы - рендерим, если массив не пустой */}
                {user.interests && user.interests.length > 0 && (
                  <View>
                    <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">{i18n.t('UserProfile.interests')}</Text>
                    <CustomTagsSelector
                      tags={i18n.t('tags.interests') as string[]}
                      initialSelectedTags={user.interests!}
                      maxSelectableTags={5}
                      readonlyMode={true}
                      visibleTagsCount={10}
                    />
                    <Divider className="mt-3" />
                  </View>
                )}

                {/* Основная информация */}
                {(!!user.location?.trim() ||
                  (user.userLanguages && user.userLanguages.length > 0) || (user.work && user.work.length > 0) ||
                  !!user.education?.trim()) && (
                    <View>
                      <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">{i18n.t('UserProfile.mainInfo')}</Text>
                      {!!user.location?.trim() && (
                        <CustomTextComponent
                          text={user.location}
                          leftIcon="location-pin"
                          iconSet="simpleLine"
                          rightIcon={rightIcon}
                          onRightIconPress={onEdit}
                        />
                      )}
                      {user.userLanguages && user.userLanguages.length > 0 && (
                        <CustomTextComponent
                          text={getTagsByIndex(i18n.t('tags.languages') as string[], user.userLanguages!)}
                          leftIcon="language-outline"
                          iconSet="ionicons"
                          rightIcon={rightIcon}
                          onRightIconPress={onEdit}
                        />
                      )}
                      {user.work && user.work.length > 0 && (
                        <CustomTextComponent
                          text={getTagsByIndex(i18n.t('tags.professions') as string[], user.work!)}
                          leftIcon="work-outline"
                          rightIcon={rightIcon}
                          onRightIconPress={onEdit}
                        />
                      )}
                      {!!user.education?.trim() && (
                        <CustomTextComponent
                          text={user.education}
                          leftIcon="school-outline"
                          iconSet="ionicons"
                          rightIcon={rightIcon}
                          onRightIconPress={onEdit}
                        />
                      )}
                      <Divider className="mt-3" />
                    </View>
                  )}

                {/* Социальные сети */}
                {(!!user.instagram?.trim() || !!user.facebook?.trim()) && (
                  <View>
                    <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">{i18n.t('UserProfile.socialMedia')}</Text>
                    {!!user.instagram?.trim() && (
                      <CustomSocialLinkInput
                        text={user.instagram!}
                        leftIcon="instagram"
                        iconSet="fontAwesome"
                        rightIcon={rightIcon}
                        onRightIconPress={onEdit}
                        platform={'instagram'}
                      />
                    )}
                    {!!user.facebook?.trim() && (
                      <CustomSocialLinkInput
                        text={user.facebook!}
                        leftIcon="facebook"
                        iconSet="fontAwesome"
                        rightIcon={rightIcon}
                        onRightIconPress={onEdit}
                        platform={'facebook'}
                      />
                    )}
                    <Divider className="mt-3" />
                  </View>
                )}
                <View className="-mx-3">
                  {/* Панель переключения секций */}
                  <View style={styles.tabContainer}>
                    <TouchableOpacity
                      style={[styles.tabButton, activeSection === 'petshots' && styles.activeTabButton]}
                      onPress={() => setActiveSection('petshots')}
                    >
                      <Text className='font-nunitoSansBold text-gray-500' >
                        🐾 PetShots
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    style={[styles.tabButton, activeSection === 'comments' && styles.activeTabButton]}
                    onPress={() => setActiveSection('comments')}
                  >
                    <Text className='font-nunitoSansBold text-gray-500' >
                    {i18n.t('UserProfile.reviews')}
                    </Text>
                  </TouchableOpacity> */}
                  </View>

                  {/* Условный рендер контента */}
                  {activeSection === 'petshots' ? (
                    <View>
                      <Feed userId={user.id} />
                      <Text className="text-center text-xs font-nunitoSansBold text-gray-500">{i18n.t('UserProfile.feedEmpty')}</Text>
                    </View>
                  ) : (
                    isCurrentUser ? (
                      <Text className="pt-10 px-4 text-center text-xs font-nunitoSansBold text-gray-500">
                        {i18n.t('UserProfile.commentsOpen')}
                      </Text>
                    ) : (
                      <View>
                        {/* <CreateProfileComment onClose={()=>{}} /> */}
                        <Text className="px-4 text-center text-xs font-nunitoSansBold text-gray-500">
                          {i18n.t('UserProfile.commentsOpenOther')}
                        </Text>
                        <Comment postId={user.id} />

                      </View>
                    )
                  )}
                </View>
              </View>

              <View className="h-28" />
            </View>
          }
        />
      </GestureHandlerRootView>
    );
  }
);

export default ViewProfileComponent;

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 8,
    right: 8,
    elevation: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 3,
  },
  menuButton: {
    top: Platform.OS === "ios" ? -6 : 0,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginVertical: 10,

  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'indigo',
  },
  activeTabText: {
    color: 'indigo',
    fontWeight: 'bold',
  },
});
