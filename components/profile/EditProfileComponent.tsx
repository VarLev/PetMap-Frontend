import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput, Text, Divider } from 'react-native-paper';
import userStore from '@/stores/UserStore';
import { observer } from 'mobx-react-lite';
import { User } from '@/dtos/classes/user/UserDTO';
import { INTEREST_TAGS, LANGUAGE_TAGS } from '@/constants/Strings';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import PhotoSelector from '../common/PhotoSelector';
import { setUserAvatarDependOnGender } from '@/utils/utils';
import AvatarSelector from '../common/AvatarSelector';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../common/BottomSheetComponent';
import { avatarsStringF, avatarsStringM } from '@/constants/Avatars';
import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler';

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
    setEditableUser({ ...editableUser, thumbnailUrl: newAvatar });
    setUserPhoto(newAvatar);
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
              <Text className="text-lg font-nunitoSansBold text-indigo-800">Обо мне</Text>
              <Divider />
              <TextInput
                className="m-2"
                label="Имя"
                value={editableUser.name || ''}
                onChangeText={(text) => handleChange('name', text)}
                mode="outlined"
              />
              <TextInput
                className="m-2"
                label="День рождения"
                value={editableUser.birthDate ? editableUser.birthDate.toLocaleDateString() : undefined}
                onChangeText={(text) => handleChange('birthDate', new Date(text))}
                mode="outlined"
              />
              <TextInput
                className="m-2"
                label="Пол"
                value={editableUser.gender || ''}
                onChangeText={(text) => handleChange('gender', text)}
                mode="outlined"
              />
              <TextInput
                className="m-2"
                label="Обо мне"
                value={editableUser.description || ''}
                onChangeText={(text) => handleChange('description', text)}
                mode="outlined"
                numberOfLines={6}
                multiline
              />
            </View>
            <View className="p-2">
              <Text className="text-lg font-nunitoSansBold text-indigo-800">Интересы</Text>
              <Divider />
              <CustomTagsSelector
                tags={INTEREST_TAGS}
                initialSelectedTags={editableUser.interests || []}
                onSelectedTagsChange={(selectedTags) => handleChange('interests', selectedTags)}
                maxSelectableTags={5}
              />
            </View>
            <View className="p-2">
              <Text className="text-lg font-nunitoSansBold text-indigo-800">Основные</Text>
              <Divider />
              <TextInput
                className="m-2"
                label="Location"
                value={''}
                onChangeText={(text) => {}}
                mode="outlined"
              />
              <CustomTagsSelector
                tags={LANGUAGE_TAGS}
                initialSelectedTags={editableUser.userLanguages || []}
                onSelectedTagsChange={(selectedTags) => handleChange('userLanguages', selectedTags)}
              />
              <TextInput
                className="m-2"
                label="Education"
                value={editableUser.education || ''}
                onChangeText={(text) => handleChange('education', text)}
                mode="outlined"
              />
              <TextInput
                className="m-2"
                label="Work"
                value={editableUser.work || ''}
                onChangeText={(text) => handleChange('work', text)}
                mode="outlined"
              />
            </View>
            <View className="p-2">
              <Text className="text-lg font-nunitoSansBold text-indigo-800">Социальные сети</Text>
              <Divider />
              <TextInput
                className="m-2"
                label="Instagram"
                value={''}
                onChangeText={(text) => {}}
                mode="outlined"
              />
              <TextInput
                className="m-2"
                label="Facebook"
                value={''}
                onChangeText={(text) => {}}
                mode="outlined"
              />
            </View>
            <Button mode="contained" onPress={handleSave} className='bg-indigo-800'>
              Save
            </Button>
            <Button mode="outlined" onPress={onCancel} className='mt-4'>
              Cancel
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
