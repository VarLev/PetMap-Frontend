import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, View } from 'react-native';
import { Button, Text, Divider } from 'react-native-paper';
import userStore from '@/stores/UserStore';
import { observer } from 'mobx-react-lite';
import { User } from '@/dtos/classes/user/UserDTO';
import { GENDERS_TAGS, INTEREST_TAGS, LANGUAGE_TAGS, PROFESSIONS_TAGS } from '@/constants/Strings';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import PhotoSelector from '../common/PhotoSelector';
import { parseDateToString, parseStringToDate, setUserAvatarDependOnGender } from '@/utils/utils';
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
import { useControl } from '@/hooks/useBonusControl';
import { BonusContex } from '@/contexts/BonusContex';

const TASK_IDS = {
  userEdit:{
    name: 1,
    birthDate: 2,
    gender: 3,
    description: 4,
    interests: 5,
    location: 6,
    userLanguages: 7,
    work: 8,
    education: 9,
    instagram: 10,
    facebook: 11,
    thumbnailUrl: 12,
  } 
};

const EditProfileComponent = observer(({ onSave, onCancel }: { onSave: () => void, onCancel: () => void }) => {
  const user: User = userStore.currentUser!;
  const [editableUser, setEditableUser] = useState<User>(new User({ ...user }));
  const [userPhoto, setUserPhoto] = useState(user.thumbnailUrl);
  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [birthDate, setBirthDate] = useState(parseDateToString(user.birthDate || new Date()));

  const { completedJobs } = useContext(BonusContex)!;

  // Используем useControl для каждого поля
  useControl('name', editableUser.name, {id : TASK_IDS.userEdit.name, description:'name'});
  useControl('birthDate', birthDate, {id:TASK_IDS.userEdit.birthDate, description:'birthDate'});
  useControl('gender', editableUser.gender, { id: TASK_IDS.userEdit.gender, description:'gender' });
  useControl('description', editableUser.description, { id: TASK_IDS.userEdit.description, description:'description' });
  useControl('interests', editableUser.interests, { id: TASK_IDS.userEdit.interests, description:'interests' });
  useControl('location', editableUser.location, { id: TASK_IDS.userEdit.location, description:'location' });
  useControl('userLanguages', editableUser.userLanguages, { id: TASK_IDS.userEdit.userLanguages, description:'userLanguages' });
  useControl('work', editableUser.work, { id: TASK_IDS.userEdit.work, description:'work' });
  useControl('education', editableUser.education, { id: TASK_IDS.userEdit.education, description:'education' });
  useControl('instagram', editableUser.instagram, { id: TASK_IDS.userEdit.instagram, description:'instagram' });
  useControl('facebook', editableUser.facebook, { id: TASK_IDS.userEdit.facebook, description:'facebook' });
  useControl('thumbnailUrl', editableUser.thumbnailUrl, { id: TASK_IDS.userEdit.thumbnailUrl, description:'thumbnailUrl' });
  
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

  useEffect(() => {
    const fetchUser = async () => {
      const thisUser = await userStore.getCurrentUserForProvider();
      setEditableUser(new User({ ...thisUser }));
    };
  
    fetchUser(); 
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
      else{
        const today = new Date();
        const birthDateObj = new Date(date);
        const age = today.getFullYear() - birthDateObj.getFullYear();
        if (age < 14 ) {
          alert("Не корректная дата рождения");
          return false;
        }
      }
    }
    
    return true;

  }

  const handleChange = (field: keyof User, value: any) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleSave = async () => {
    if (!CheckErrors()) return;

    // Обновляем фото пользователя
    if (editableUser.thumbnailUrl !== user.thumbnailUrl) {
      const resp = await userStore.uploadUserThumbnailImage(editableUser);
      editableUser.thumbnailUrl = resp;
    }

     // Парсим дату рождения
    editableUser.birthDate = parseStringToDate(birthDate);
    editableUser.jobs = completedJobs;

    // Вызываем метод в userStore для обновления данных пользователя и выполнения заданий
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
                visibleTagsCount={10}
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
          renderContent={<AvatarSelector onAvatarSelect={handleAvatarSelect} />}
          onClose={handleSheetClose}
          enablePanDownToClose={true}
        />
      )}
    </GestureHandlerRootView>
  );
});

export default EditProfileComponent;
