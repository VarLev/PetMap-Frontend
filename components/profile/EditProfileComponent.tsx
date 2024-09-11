import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, View } from 'react-native';
import { Button, Text, Divider } from 'react-native-paper';
import userStore from '@/stores/UserStore';
import { observer } from 'mobx-react-lite';
import { User } from '@/dtos/classes/user/UserDTO';
import { GENDERS_TAGS, INTEREST_TAGS, LANGUAGE_TAGS, PROFESSIONS_TAGS } from '@/constants/Strings';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import PhotoSelector from '../common/PhotoSelector';
import { getTagsByIndex, parseDateToString, parseStringToDate, setUserAvatarDependOnGender, translateGender } from '@/utils/utils';
import AvatarSelector from '../common/AvatarSelector';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../common/BottomSheetComponent';
import { avatarsStringF, avatarsStringM } from '@/constants/Avatars';
import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';


import MultiTagDropdown from '../custom/selectors/MultiTagDropdown';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';
import { router } from 'expo-router';
import CustomLoadingButton from '../custom/buttons/CustomLoadingButton';

const EditProfileComponent = observer(({ onSave, onCancel }: { onSave: () => void, onCancel: () => void }) => {
  const user: User = userStore.currentUser!;
  const [editableUser, setEditableUser] = useState<User>(new User({ ...user }));
  const [userPhoto, setUserPhoto] = useState(user.thumbnailUrl);
  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [birthDate, setBirthDate] = useState(parseDateToString(user.birthDate || new Date()));

  useEffect(() => {
    
    // Функция, которая срабатывает при нажатии кнопки "назад"
    const backAction = () => {
      Alert.alert("Подтверждение", "Вы уверены, что хотите выйти?", [
        {
          text: "Отмена",
          onPress: () => null, // Ничего не делать, просто закрыть диалог
          style: "cancel"
        },
        { 
          text: "Да", 
          onPress: () => router.back() // Выйти из приложения
        }
      ]);
      return true; // Возвращаем true, чтобы предотвратить стандартное поведение (закрытие экрана)
    };

    // Подписываемся на событие нажатия кнопки "назад"
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Возвращаем функцию для очистки эффекта (отписка от события)
    return () => backHandler.remove();
  }, []);

  const CheckErrors = () => {
    if (!editableUser.name || !birthDate ) {
      // Вывод ошибки, если не все обязательные поля заполнены
      alert("Пожалуйста, заполните все обязательные поля: Имя, Дата рождения.");
      return false;
    }
    else{
      // Проверка корректности введенной даты
      const date = parseStringToDate(birthDate);
      if (!date) {
        alert("Некорректная дата рождения. Пожалуйста, введите дату в формате YYYY-MM-DD.");
        return false;
      }
    }
    return true;

  }

  useEffect(() => {
    const fetchUser = async () => {
      const thisUser = await userStore.getCurrentUserFromServer();
      console.log(thisUser);
      setEditableUser(new User({ ...thisUser }));
    };
  
    fetchUser(); 
  }, []);


  const handleChange = (field: keyof User, value: any) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleSave = async () => {
    if (!CheckErrors()) return;
    const resp = await userStore.uploadUserThumbnailImage(editableUser);
    editableUser.thumbnailUrl = resp;
    editableUser.birthDate = parseStringToDate(birthDate);
    console.log(editableUser);
    await userStore.updateOnlyUserData(editableUser);
    onSave();
  };

 
  const SetUserPhoto = async () => {
    const image = await userStore.setUserImage();
    if (image) {
      setEditableUser({ ...editableUser, thumbnailUrl: image });
      setUserPhoto(image);
    }
  };

  const DeleteUserPhoto = async () => {
    const newAvatar = SetRandomAvatarDependOnGender();
    userStore.fetchImageUrl(newAvatar).then(resp => {
      if (resp) {
        setUserPhoto(resp);
        setEditableUser({ ...editableUser, thumbnailUrl: resp });
        handleSheetClose();
      }
    });
  };

  const SetRandomAvatarDependOnGender = () => {
    return setUserAvatarDependOnGender(user);
  };

  const handleSheetOpen = () => {
    setIsSheetVisible(true);
    sheetRef.current?.expand();
  };

  const handleSheetClose = () => {
    setIsSheetVisible(false);
    sheetRef.current?.close();
  };

  const handleAvatarSelect = (avatar: number, isMail: boolean) => {
    const userAv = isMail ? avatarsStringM[avatar] : avatarsStringF[avatar];
    userStore.fetchImageUrl(userAv).then(resp => {
      if (resp) {
        setUserPhoto(resp);
        setEditableUser({ ...editableUser, thumbnailUrl: resp });
        handleSheetClose();
      }
    });
  };

  const shouldShowChooseAvatar = userPhoto && userPhoto.includes('userAvatars');

  return (
    <GestureHandlerRootView className="h-full bg-white">
      <FlatList
        data={[]} // Пустой массив данных, поскольку список аватаров будет в BottomSheet
        renderItem={null}
        ListHeaderComponent={
          <View className="p-2">
            <View className="items-center">
              <PhotoSelector
                imageUrl={userPhoto || SetRandomAvatarDependOnGender()}
                onReplace={SetUserPhoto}
                onDelete={DeleteUserPhoto}
                onChooseAvatar={shouldShowChooseAvatar ? handleSheetOpen : undefined}
              />
            </View>
            <View className="p-2">
             
              <CustomOutlineInputText 
                containerStyles='mt-2' 
                label='Как вас зовут?' 
                value={editableUser.name || ''} 
                handleChange={(text) => handleChange('name', text)}
              />
              <CustomOutlineInputText
                containerStyles="mt-4"
                placeholder='Дата рождения YYYY-MM-DD'
                mask="9999-99-99"
                label="Дата рождения"
                value={birthDate}
                handleChange={setBirthDate}
                keyboardType='number-pad'
              />
              {/* <CustomOutlineInputText 
                containerStyles='mt-4' 
                label='День рождения' 
                value={editableUser.birthDate ? editableUser.birthDate.toLocaleDateString() : undefined} 
                handleChange={(text) => handleChange('birthDate', new Date(text))}
              /> */}
              
              <CustomDropdownList 
                tags={GENDERS_TAGS} 
                label='Пол' 
                initialSelectedTag={editableUser.gender!} 
                onChange={(text) => handleChange('gender', text)}
              />
              
              <CustomOutlineInputText 
                containerStyles='mt-4' 
                label='Обо мне' 
                value={editableUser.description || ''} 
                handleChange={(text) => handleChange('description', text)} 
                numberOfLines={7}
              />
              
             
              
            </View>
            <View className="p-2 ">
              <Text className="text-lg font-nunitoSansBold text-indigo-800">Интересы</Text>
              <CustomTagsSelector
                tags={INTEREST_TAGS}
                initialSelectedTags={editableUser.interests || []}
                onSelectedTagsChange={(selectedTags) => handleChange('interests', selectedTags)}
                maxSelectableTags={5}
              />
            </View>
            <Divider className="mt-4"/>
            
            <View className="p-2">
              <Text className="text-lg font-nunitoSansBold text-indigo-800">Основные</Text>
              <CustomOutlineInputText 
                containerStyles='mt-4' 
                label='Локация (город, район)' 
                value={editableUser.location || ''} 
                handleChange={(text) => handleChange('location', text)} 
               
              />

              <MultiTagDropdown tags={LANGUAGE_TAGS} initialSelectedTags={editableUser.userLanguages} label='Язык' onChange={(text) => handleChange('userLanguages', text)} />
              {/* <CustomOutlineInputText 
                containerStyles='mt-4' 
                label='Профессия' 
                value={editableUser.work || ''} 
                handleChange={(text) => handleChange('work', text)} 
               
              /> */}
              <MultiTagDropdown tags={PROFESSIONS_TAGS} initialSelectedTags={editableUser.work || []} label='Профессия' onChange={(text) => handleChange('work', text)} searchable listMode='MODAL'  />
              {/* <CustomDropdownList 
                tags={PROFESSIONS_TAGS} 
                label='Профессия' 
                initialSelectedTag={editableUser.work || ''} 
                searchable={true}
                onChange={(text) => handleChange('work', text)}
              /> */}
             
              <CustomOutlineInputText 
                containerStyles='mt-4' 
                label='Образование' 
                value={editableUser.education || ''} 
                handleChange={(text) => handleChange('education', text)} 
               
              />
            
            <Divider className='mt-5' />
             
            </View>
            <View className="p-2">
              <Text className="text-lg font-nunitoSansBold text-indigo-800">Социальные сети</Text>
              <CustomOutlineInputText 
                containerStyles='mt-4' 
                label='Instagram' 
                value={editableUser.instagram || ''} 
                handleChange={(text) => handleChange('instagram', text)} 
              />
              <CustomOutlineInputText 
                containerStyles='mt-4' 
                label='Facebook' 
                value={editableUser.facebook || ''} 
                handleChange={(text) => handleChange('facebook', text)}/>
              </View>
              <CustomLoadingButton title='Сохранит' handlePress={handleSave} />
              {/* <Button mode="contained" onPress={handleSave} className='mt-5 bg-indigo-800'>
                Сохранить
              </Button> */}
              <Button mode="outlined" onPress={onCancel} className='mt-4'>
                Отмена
              </Button>
            <View className="h-32"/>
          </View>
        }
      />
      {isSheetVisible && (
        <BottomSheetComponent
          ref={sheetRef}
          snapPoints={['60%', '100%']}
          renderContent={() => (
            <AvatarSelector onAvatarSelect={handleAvatarSelect} />
          )}
          onClose={handleSheetClose}
          enablePanDownToClose={true}
        />
      )}
    </GestureHandlerRootView>
  );
});

export default EditProfileComponent;
