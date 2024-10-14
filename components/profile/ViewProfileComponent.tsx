import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View,Image, StatusBar, StyleSheet  } from 'react-native';
import { Text, Card, Divider, IconButton, Menu, PaperProvider } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import BottomSheetComponent from '../common/BottomSheetComponent';
import { FlatList, GestureHandlerRootView, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomTextComponent from '../custom/text/CustomTextComponent';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import { calculateDogAge, calculateHumanAge, getTagsByIndex } from '@/utils/utils';
import CustomSocialLinkInput from '../custom/text/SocialLinkInputProps';
import { router } from 'expo-router';
import petStore from '@/stores/PetStore';
import { BREEDS_TAGS, INTEREST_TAGS, LANGUAGE_TAGS, PETGENDERS_TAGS, petUriImage, PROFESSIONS_TAGS } from '@/constants/Strings';
import { User } from '@/dtos/classes/user/UserDTO';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import AddCard from '../custom/buttons/AddCard';




const ViewProfileComponent = observer(({ onEdit, onPetOpen, loadedUser }: { onEdit: () => void, onPetOpen: (petId:string) => void, loadedUser: IUser }) => {
  //const user = userStore.currentUser!;
  const [user, setUser] = useState<IUser>(loadedUser);
  const sheetRef = useRef<BottomSheet>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    sheetRef.current?.expand();
    loadData();
  }, []);

  const loadData = async () => {
    if (user.id === userStore.currentUser?.id) {
      // Загружаем текущего пользователя
      console.log('Загружаем текущего пользователя');
      
      //await userStore.loadUser();
      console.log(user.thumbnailUrl);
      setUser(user);
      console.log(user);
      setIsCurrentUser(true);
    } else {
      // Загружаем другого пользователя
      const otherUser = await userStore.getUserById(loadedUser.id);
      setUser(otherUser as User);
      setIsCurrentUser(false);
    }
    
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(); // Обновляем данные
    setRefreshing(false); // Отключаем индикатор обновления
  };

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);
  
  const logOut = () => {
    closeMenu();
    router.replace('/(auth)/sign-in');
  }

  const handleAddPet = () =>{
    const newPat = petStore.getEmptyPetProfile('new', user.id)
    petStore.setPetProfile(newPat);
    router.push('/profile/pet/new/edit');

  }
  return (
    <GestureHandlerRootView className='h-full' >
      <PaperProvider>
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#6200ee']} />       
        }>
          <View style={{ alignItems: 'center'}}>
            <StatusBar  backgroundColor="transparent" translucent />
            <View className="relative w-full aspect-square">
              <Image source={{ uri: user?.thumbnailUrl! }} className="w-full h-full" />
              <View style={styles.iconContainer}>
                {isCurrentUser && (
                  <Menu 
                  style={{marginTop: 25}}
                  visible={menuVisible}
                  onDismiss={closeMenu}
                  contentStyle={{ backgroundColor: 'white' }}
                  anchor={
                    <IconButton
                      icon="menu"
                      size={30}
                      iconColor="black"
                      style={styles.menuButton}
                      onPress={openMenu}
                    />
                  }
                >
                  <Menu.Item onPress={onEdit} title="Редактировать" rippleColor='black' titleStyle={{color:'balck', fontFamily:'NunitoSans_400Regular'}} leadingIcon='pencil-outline'/>
                  <Menu.Item onPress={logOut} title="Выйти" titleStyle={{color:'balck', fontFamily:'NunitoSans_400Regular'}} leadingIcon='exit-to-app'/>
                  <Menu.Item onPress={closeMenu} title="Удалить аккаунт" titleStyle={{color:'balck', fontFamily:'NunitoSans_400Regular'}} leadingIcon='delete-outline'/>
                </Menu>
                )}
                
              </View>
            </View>
          </View>
        </ScrollView>
        
      </PaperProvider>
      <BottomSheetComponent ref={sheetRef} enablePanDownToClose={false} snapPoints={['60%','100%']} renderContent={function (): React.ReactNode {
        return ( 
        <View className='bg-white h-full'>
          <Text className='pl-5 text-2xl font-nunitoSansBold'>
            {user.name} {calculateHumanAge(user.birthDate)}
          </Text>
          <FlatList
            horizontal={true}
            data={user.petProfiles}
            keyExtractor={(item, index) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={()=> onPetOpen(item.id)}>
                <Card className="w-48 h-62 p-2 m-2 rounded-2xl shadow bg-purple-100">
                  <Card.Cover source={{ uri: item.thumbnailUrl || petUriImage }} style={{ height: 150, borderRadius: 14 }} />
                  <Text className="font-nunitoSansBold text-lg">
                    {item.petName} {calculateDogAge(item.birthDate)}
                  </Text>
                  <Text className="font-nunitoSansRegular">{getTagsByIndex(BREEDS_TAGS, item.breed!)}</Text>
                  <Text className="font-nunitoSansRegular">{getTagsByIndex(PETGENDERS_TAGS, item.gender!)}, {item.weight}kg</Text>
                </Card>
              </TouchableOpacity>
            )}
            
            ListFooterComponent={() => (
              isCurrentUser ? <AddCard buttonText='Добавить питомца' onPress={handleAddPet} /> : null
            )}
          />
          
          <View className='pr-3 pl-4'>
            <View >
              <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Обо мне</Text>
              <CustomTextComponent text={user.description}  rightIcon='chevron-right' onRightIconPress={onEdit}/>
              <Divider />
            </View>
            <View >
              <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Интересы</Text>
              <CustomTagsSelector 
                tags={INTEREST_TAGS} 
                initialSelectedTags={user.interests!}
                maxSelectableTags={5}
                readonlyMode = {true}
                visibleTagsCount={10}
              />
              <Divider className='mt-3' />
            </View>
            <View>
              <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Основное</Text>
              <CustomTextComponent text={user.location} leftIcon='location-pin' iconSet='simpleLine' rightIcon='chevron-right' onRightIconPress={onEdit} />
              <CustomTextComponent text={getTagsByIndex(LANGUAGE_TAGS, user.userLanguages!)} leftIcon='language-outline' iconSet='ionicons' rightIcon='chevron-right' onRightIconPress={onEdit}/>
              <CustomTextComponent text={getTagsByIndex(PROFESSIONS_TAGS, user.work!)} leftIcon='work-outline' rightIcon='chevron-right' onRightIconPress={onEdit} />
              <CustomTextComponent text={user.education} leftIcon='school-outline' iconSet='ionicons'  rightIcon='chevron-right'onRightIconPress={onEdit} />
              <Divider className='mt-3' />
            </View>
            <View>
              <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Социальные сети</Text>
              <CustomSocialLinkInput text={user.instagram!} leftIcon='instagram' iconSet='fontAwesome' rightIcon='chevron-right' onRightIconPress={onEdit} platform={'instagram'}/>
              <CustomSocialLinkInput text={user.facebook!} leftIcon='facebook' iconSet='fontAwesome' rightIcon='chevron-right' onRightIconPress={onEdit} platform={'facebook'} />
              <Divider className='mt-3' />
            </View>
          </View>
          <View className='h-28'/>
        </View>)
      } }/>
    </GestureHandlerRootView>
  );
});

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
  },
  menuButton: {
    backgroundColor: 'white',
  }
  
});