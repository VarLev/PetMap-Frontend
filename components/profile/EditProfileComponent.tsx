//интегрирован перевод

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Platform, View } from 'react-native';
import { Button, Text, Divider, IconButton } from 'react-native-paper';
import userStore from '@/stores/UserStore';
import { observer } from 'mobx-react-lite';
import { User } from '@/dtos/classes/user/UserDTO';
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
import CustomLoadingButton from '../custom/buttons/CustomLoadingButton';
import { useControl } from '@/hooks/useBonusControl';
import { BonusContex } from '@/contexts/BonusContex';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import i18n from '@/i18n';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import CustomDropDownCityList from '../custom/selectors/CustomDropDownCityList';
import { router } from 'expo-router';

const TASK_IDS = {
  userEdit: {
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
  },
};

const EditProfileComponent = observer(({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => {
  const user: User = userStore.currentUser!;
  const [editableUser, setEditableUser] = useState<User>(new User({ ...user }));
  const [userPhoto, setUserPhoto] = useState(user.thumbnailUrl);
  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [birthDate, setBirthDate] = useState(parseDateToString(user.birthDate || new Date()));
  const [showUserAge, setShowUserAge] = useState(false);
  const initialDate =
    editableUser.birthDate instanceof Date && !isNaN(editableUser.birthDate.getTime()) ? editableUser.birthDate : new Date();
  const [age, setAge] = useState<Date>(initialDate);

  const { completedJobs } = useContext(BonusContex)!;

  // Используем useControl для каждого поля
  useControl('name', editableUser.name, { id: TASK_IDS.userEdit.name, description: 'name' });
  useControl('birthDate', birthDate, { id: TASK_IDS.userEdit.birthDate, description: 'birthDate' });
  useControl('gender', editableUser.gender, { id: TASK_IDS.userEdit.gender, description: 'gender' });
  useControl('description', editableUser.description, { id: TASK_IDS.userEdit.description, description: 'description' });
  useControl('interests', editableUser.interests, { id: TASK_IDS.userEdit.interests, description: 'interests' });
  useControl('location', editableUser.location, { id: TASK_IDS.userEdit.location, description: 'location' });
  useControl('userLanguages', editableUser.userLanguages, { id: TASK_IDS.userEdit.userLanguages, description: 'userLanguages' });
  useControl('work', editableUser.work, { id: TASK_IDS.userEdit.work, description: 'work' });
  useControl('education', editableUser.education, { id: TASK_IDS.userEdit.education, description: 'education' });
  useControl('instagram', editableUser.instagram, { id: TASK_IDS.userEdit.instagram, description: 'instagram' });
  useControl('facebook', editableUser.facebook, { id: TASK_IDS.userEdit.facebook, description: 'facebook' });
  useControl('thumbnailUrl', editableUser.thumbnailUrl, { id: TASK_IDS.userEdit.thumbnailUrl, description: 'thumbnailUrl' });

  useEffect(() => {
    const initializeAvatar = async () => {
      await SetRandomAvatarDependOnGender();
    };

    initializeAvatar();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const thisUser = await userStore.getCurrentUserForProvider();
      setEditableUser(new User({ ...thisUser }));
    };

    fetchUser();
  }, []);

  const CheckErrors = () => {
    if (!editableUser.name || !birthDate) {
      // Вывод ошибки, если не все обязательные поля заполнены
      alert(i18n.t('EditProfileComponent.error.requiredFields'));
      return false;
    } else {
      // Проверка корректности введенной даты
      const date = parseStringToDate(birthDate);
      if (!date) {
        alert(i18n.t('EditProfileComponent.error.invalidDate'));
        return false;
      } else {
        const today = new Date();
        const birthDateObj = new Date(date);
        const age = today.getFullYear() - birthDateObj.getFullYear();
        if (age < 14) {
          alert(i18n.t('EditProfileComponent.error.ageRestriction'));
          return false;
        }
      }
    }

    return true;
  };

  const handleChange = (field: keyof User, value: any) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleSave = async () => {
    if (!CheckErrors()) return;

    // Обновляем фото пользователя
    const avatarUrl = await userStore.uploadImage(userPhoto!, `users/${editableUser?.email}/thumbnail`);
    editableUser.thumbnailUrl = avatarUrl;
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
    userStore.fetchImageUrl(userPhoto!).then((resp) => {
      if (resp) {
        setUserPhoto(resp);
        setEditableUser({ ...editableUser, thumbnailUrl: resp });
        handleSheetClose();
      }
    });
  };

  const SetRandomAvatarDependOnGender = async () => {
    if (!user.thumbnailUrl) {
      const userAvatar = setUserAvatarDependOnGender(user);
      const userAvatarUrl = await userStore.fetchImageUrl(userAvatar);
      setUserPhoto(userAvatarUrl);
    }
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
    userStore.fetchImageUrl(userAv).then((resp) => {
      if (resp) {
        setUserPhoto(resp);
        setEditableUser({ ...editableUser, thumbnailUrl: resp });
        handleSheetClose();
      }
    });
  };

  const onAgeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowUserAge(false);
      if (event.type === 'set' && selectedDate) {
        if (selectedDate) {
          const correctedDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            12,
            0,
            0,
            0 // Полдень локального времени
          );
          setAge(correctedDate);
          setBirthDate(parseDateToString(correctedDate));
        }
      }
    } else {
      // Логика для iOS
      if (selectedDate) {
        const correctedDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          12,
          0,
          0,
          0 // Полдень локального времени
        );
        setAge(correctedDate);
        setBirthDate(parseDateToString(correctedDate));
      }
    }
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
                imageUrl={userPhoto!}
                onReplace={SetUserPhoto}
                onDelete={DeleteUserPhoto}
                onChooseAvatar={shouldShowChooseAvatar ? handleSheetOpen : undefined}
              />
            </View>
            <View className="p-2">
              <CustomOutlineInputText
                containerStyles="mt-2"
                label={i18n.t('EditProfileComponent.nameLabel')}
                value={editableUser.name || ''}
                handleChange={(text) => handleChange('name', text)}
                allowOnlyLetters = {true}
              />

              <View className=" flex-row w-full">
                <CustomOutlineInputText
                  label={i18n.t('EditProfileComponent.birthDateLabel')}
                  value={age.toISOString().split('T')[0]}
                  onPress={() => setShowUserAge(true)}
                  editable={false}
                  containerStyles="mt-2 w-[85%]"
                />
                <IconButton icon="calendar" size={30} className="mt-4" onPress={() => setShowUserAge(true)} />
              </View>

              {showUserAge && Platform.OS === 'ios' && (
                <Modal transparent={true} >
                  <View className="flex-1 justify-center bg-black/50">
                    <View className="bg-white mx-5 p-5 rounded-3xl shadow-lg">
                      <DateTimePicker value={age} mode="date" display="spinner" onChange={onAgeChange} maximumDate={new Date()} textColor='black' />
                      <Button mode="contained" onPress={() => setShowUserAge(false)}>
                        {i18n.t('ok')}
                      </Button>
                    </View>
                  </View>
                </Modal>
              )}

              {showUserAge && Platform.OS === 'android' && (
                <DateTimePicker value={age} mode="date" display="spinner" onChange={onAgeChange} maximumDate={new Date()} />
              )}

              {/* <CustomOutlineInputText
                containerStyles="mt-4"
                placeholder={i18n.t('EditProfileComponent.birthDatePlaceholder')}
                mask="9999-99-99"
                label={i18n.t('EditProfileComponent.birthDateLabel')}
                value={birthDate}
                handleChange={setBirthDate}
                keyboardType='number-pad'
              /> */}

              <CustomDropdownList
                tags={i18n.t('tags.gender') as string[]}
                label={i18n.t('EditProfileComponent.genderLabel')}
                initialSelectedTag={editableUser.gender!}
                onChange={(text) => handleChange('gender', text)}
                listMode="MODAL"
              />
             
              <CustomOutlineInputText
                containerStyles="mt-4"
                label={i18n.t('EditProfileComponent.descriptionLabel')}
                value={editableUser.description || ''}
                handleChange={(text) => handleChange('description', text)}
                numberOfLines={7}
                maxLength={500}
              />
            </View>
            <View className="p-2 ">
              <Text className="text-lg font-nunitoSansBold text-indigo-800">{i18n.t('EditProfileComponent.interestsTitle')}</Text>
              <Text className="font-nunitoSansRegular text-gray-600">{i18n.t('EditProfileComponent.interestsSubtitle')}</Text>
              <CustomTagsSelector
                tags={i18n.t('tags.interests') as string[]}
                initialSelectedTags={editableUser.interests || []}
                onSelectedTagsChange={(selectedTags) => handleChange('interests', selectedTags)}
                maxSelectableTags={5}
                visibleTagsCount={10}
              />
            </View>
            <Divider className="mt-4" />
            <View className="p-2">
              <Text className="text-lg font-nunitoSansBold text-indigo-800">{i18n.t('EditProfileComponent.mainInfoTitle')}</Text>
              <CustomDropDownCityList 
                initialSelectedTag={editableUser.location || ''} 
                label={i18n.t('EditProfileComponent.locationLabel')}
                onChange={(text) => handleChange('location', text)}
              />
              {/* <CustomOutlineInputText
                containerStyles="mt-4"
                label={i18n.t('EditProfileComponent.locationLabel')}
                value={editableUser.location || ''}
                handleChange={(text) => handleChange('location', text)}
              /> */}
              <MultiTagDropdown
                tags={i18n.t('tags.languages') as string[]}
                initialSelectedTags={editableUser.userLanguages}
                label={i18n.t('EditProfileComponent.languagesLabel')}
                onChange={(text) => handleChange('userLanguages', text)}
                listMode="MODAL"
              />

              <MultiTagDropdown
                tags={i18n.t('tags.professions') as string[]}
                initialSelectedTags={editableUser.work || []}
                label={i18n.t('EditProfileComponent.professionLabel')}
                onChange={(text) => handleChange('work', text)}
                searchable
                listMode="MODAL"
              />

              {/* <CustomOutlineInputText 
                containerStyles='mt-4' 
                label={i18n.t('EditProfileComponent.educationLabel')} 
                value={editableUser.education || ''} 
                handleChange={(text) => handleChange('education', text)} 
               
              /> */}
              <Divider className="mt-5" />
            </View>
            <View className="p-2">
              <View className="flex-row items-center">
                <Text className="text-lg font-nunitoSansBold text-indigo-800 pr-2 ">{i18n.t('EditProfileComponent.socialMediaTitle')}</Text>
                <IconButton className='-ml-2' size={20} icon={() => <FontAwesome name="diamond" size={20} color="#8F00FF" />} onPress={() => router.push('/(paywall)/pay')}/>
              </View>
              

              <CustomOutlineInputText
                containerStyles="mt-4 bg-gray-200"
                label={i18n.t('EditProfileComponent.instagramLabel')}
                value={editableUser.instagram || ''}
                handleChange={(text) => handleChange('instagram', text)}
                editable={false}
              />
              <CustomOutlineInputText
                containerStyles="mt-4 bg-gray-200"
                label={i18n.t('EditProfileComponent.facebookLabel')}
                value={editableUser.facebook || ''}
                handleChange={(text) => handleChange('facebook', text)}
                editable={false}
              />
            </View>
            <View className="p-2">
              <CustomLoadingButton title={i18n.t('EditProfileComponent.saveButton')} handlePress={handleSave} />
              <CustomButtonOutlined title={i18n.t('EditProfileComponent.cancelButton')} handlePress={onCancel} />

            </View>
            
            <View className="h-32" />
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
