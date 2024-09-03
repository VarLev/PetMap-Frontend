import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, Divider } from 'react-native-paper';
import userStore from '@/stores/UserStore';
import { observer } from 'mobx-react-lite';
import { User } from '@/dtos/classes/user/UserDTO';
import { GENDERS_TAGS, INTEREST_TAGS, LANGUAGE_TAGS } from '@/constants/Strings';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import PhotoSelector from '../common/PhotoSelector';
import { setUserAvatarDependOnGender, translateGender } from '@/utils/utils';
import AvatarSelector from '../common/AvatarSelector';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../common/BottomSheetComponent';
import { avatarsStringF, avatarsStringM } from '@/constants/Avatars';
import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';

import MultiTagDropdown from '../custom/selectors/MultiTagDropdown';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';

const EditProfileComponent = observer(({ onSave, onCancel }: { onSave: () => void, onCancel: () => void }) => {
  const user: User = userStore.currentUser!;
  const [editableUser, setEditableUser] = useState<User>(new User({ ...user }));
  const [userPhoto, setUserPhoto] = useState(user.thumbnailUrl);
  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);


  const handleChange = (field: keyof User, value: any) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleSave = async () => {
    const resp = await userStore.uploadUserThumbnailImage(editableUser);
    editableUser.thumbnailUrl = resp;
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
                containerStyles='mt-4' 
                label='День рождения' 
                value={editableUser.birthDate ? editableUser.birthDate.toLocaleDateString() : undefined} 
                handleChange={(text) => handleChange('birthDate', new Date(text))}
              />
              
              <CustomDropdownList tags={GENDERS_TAGS} label='Пол' initialSelectedTag={ translateGender(editableUser.gender||'N/A')} onChange={(text) => handleChange('gender', text)}/>
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
                label='Локация' 
                value={user.location!} 
                handleChange={(text) => handleChange('location', text)} 
               
              />

              <MultiTagDropdown tags={LANGUAGE_TAGS} placeholder='Выберите языки' />
              <CustomOutlineInputText 
                containerStyles='mt-4' 
                label='Профессия' 
                value={editableUser.work || ''} 
                handleChange={(text) => handleChange('work', text)} 
               
              />
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
                value={user.instagram! } 
                handleChange={(text) => handleChange('instagram', text)} 
              />
              <CustomOutlineInputText 
                containerStyles='mt-4' 
                label='Facebook' 
                value={user.facebook! } 
                handleChange={(text) => handleChange('facebook', text)}/>
              </View>
              <Button mode="contained" onPress={handleSave} className='mt-5 bg-indigo-800'>
                Сохранить
              </Button>
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
