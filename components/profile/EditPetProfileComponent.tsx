import React, { useState, useMemo, useEffect, useContext } from 'react';
import { View, Text, Platform, Modal } from 'react-native';
import { Button, Checkbox, Divider, IconButton } from 'react-native-paper';
import { Pet } from '@/dtos/classes/pet/Pet';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';
import PhotoSelector from '../common/PhotoSelector';
import { observer } from 'mobx-react-lite';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { IPet } from '@/dtos/Interfaces/pet/IPet';
import StarRating from 'react-native-star-rating-widget';
import petStore from '@/stores/PetStore';
import { parseDateToString, parseStringToDate } from '@/utils/utils';
import { router } from 'expo-router';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import CustomLoadingButton from '../custom/buttons/CustomLoadingButton';
import { BonusContex } from '@/contexts/BonusContex';
import { useControl } from '@/hooks/useBonusControl';
import userStore from '@/stores/UserStore';
import CircleIcon from '../custom/icons/CircleIcon';
import i18n from '@/i18n';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import { petCatUriImage, petUriImage } from '@/constants/Strings';

const TASK_IDS = {
  petEdit: {
    dog_name: 22,
    dog_birthDate: 23,
    dog_gender: 24,
    dog_breed: 25,
    dog_weight: 26,
    dog_interests: 27,
    dog_health: 28,
    dog_vaccines: 29,
    dog_sterilized: 30,
    dog_temperament: 31,
    dog_friendliness: 32,
    dog_activity: 33,
    dog_notes: 34,
    dog_instagram: 35,
    dog_facebook: 36,
    dog_photo: 37,
  },
};

const EditPetProfileComponent = observer(
  ({ pet, onSave, onCancel }: { pet: IPet; onSave: (updatedPet: Pet) => void; onCancel: () => void }) => {
    const [editablePet, setEditablePet] = useState<Pet>(new Pet({ ...pet }));
    const [petPhoto, setPetPhoto] = useState(editablePet.thumbnailUrl);
    const [birthDate, setBirthDate] = useState(parseDateToString(editablePet.birthDate || new Date()));

    const [temperament, setTemperament] = useState(0);
    const [friendly, setFriendly] = useState(0);
    const [activity, setActivity] = useState(0);
    //const [length, setLength] = useState(editablePet.size?.split('х')[0] ?? '');
    //const [height, setHeight] = useState(editablePet.size?.split('х')[1] ?? '');
    const [isNewPet, setIsNewPet] = useState(false);
    const currentUser = userStore.currentUser!;
    const { completedJobs } = useContext(BonusContex)!;

    const [showPetAge, setShowPetAge] = useState(false);
    const initialDate =
      editablePet.birthDate instanceof Date && !isNaN(editablePet.birthDate.getTime()) ? editablePet.birthDate : new Date();
    const [age, setAge] = useState<Date>(initialDate);

    useControl('petName', editablePet.petName, {
      id: TASK_IDS.petEdit.dog_name,
      description: 'name',
    });
    useControl('birthDate', birthDate, {
      id: TASK_IDS.petEdit.dog_birthDate,
      description: 'birthDate',
    });
    useControl('gender', editablePet.gender, {
      id: TASK_IDS.petEdit.dog_gender,
      description: 'gender',
    });
    useControl('breed', editablePet.breed, {
      id: TASK_IDS.petEdit.dog_breed,
      description: 'breed',
    });
    useControl('weight', editablePet.weight, {
      id: TASK_IDS.petEdit.dog_weight,
      description: 'weight',
    });
    useControl('playPreferences', editablePet.playPreferences, {
      id: TASK_IDS.petEdit.dog_interests,
      description: 'interests',
    });
    useControl('petHealthIssues', editablePet.petHealthIssues, {
      id: TASK_IDS.petEdit.dog_health,
      description: 'health',
    });
    useControl('vaccinations', editablePet.vaccinations, {
      id: TASK_IDS.petEdit.dog_vaccines,
      description: 'vaccines',
    });
    useControl('neutered', editablePet.neutered, {
      id: TASK_IDS.petEdit.dog_sterilized,
      description: 'sterilized',
    });
    useControl('temperament', editablePet.temperament, {
      id: TASK_IDS.petEdit.dog_temperament,
      description: 'temperament',
    });
    useControl('friendliness', editablePet.friendliness, {
      id: TASK_IDS.petEdit.dog_friendliness,
      description: 'friendliness',
    });
    useControl('activityLevel', editablePet.activityLevel, {
      id: TASK_IDS.petEdit.dog_activity,
      description: 'activity',
    });
    useControl('additionalNotes', editablePet.additionalNotes, {
      id: TASK_IDS.petEdit.dog_notes,
      description: 'notes',
    });
    useControl('instagram', editablePet.instagram, {
      id: TASK_IDS.petEdit.dog_instagram,
      description: 'instagram',
    });
    useControl('facebook', editablePet.facebook, {
      id: TASK_IDS.petEdit.dog_facebook,
      description: 'facebook',
    });
    useControl('thumbnailUrl', editablePet.thumbnailUrl, {
      id: TASK_IDS.petEdit.dog_photo,
      description: 'photo',
    });

    const handleFieldChange = (field: keyof Pet, value: any) => {
      setEditablePet((prevPet) => {
        const updatedPet = { ...prevPet, [field]: value };
        return updatedPet;
      });
    };

    // Debugging useEffect to see the changes in editablePet
    useEffect(() => {
      setFriendly(editablePet.friendliness ?? 0);
      setTemperament(editablePet.temperament ?? 0);
      setActivity(editablePet.activityLevel ?? 0);

      if (pet.id === 'new') {
        setIsNewPet(true);
      }
    }, [editablePet]);

    const CheckErrors = () => {
      if (!editablePet.petName || !birthDate || !editablePet.breed) {
        // Вывод ошибки, если не все обязательные поля заполнены
        alert(i18n.t('EditPetProfile.errors.missingFields'));
        return false;
      } else {
        // Проверка корректности введенной даты
        const date = parseStringToDate(birthDate);
        if (!date) {
          alert(i18n.t('EditPetProfile.errors.invalidDate'));
          return false;
        }
      }
      return true;
    };

    const SetPetPhoto = async () => {
      const image = await petStore.setPetImage();
      if (image) {
        setEditablePet({ ...editablePet, thumbnailUrl: image });
        setPetPhoto(image);
      }
    };

    const handleSave = async () => {
      if (!CheckErrors()) return;
      const resp = await petStore.uploadUserThumbnailImage(editablePet);
      editablePet.thumbnailUrl = resp;
      editablePet.birthDate = parseStringToDate(birthDate);
      try {
        await petStore.updatePetProfile(editablePet);
        await userStore.updateUserJobs(currentUser.id, completedJobs);
      } catch (error) {
        console.error('Ошибка при создании профиля питомца:', error);
        alert(i18n.t('EditPetProfile.errors.saveErrorMessage'));
      }
      onSave(editablePet);
    };

    const handleAddPet = async () => {
      // Проверка на обязательные поля
      if (!CheckErrors()) return;

      // Преобразуем дату рождения

      const resp = await petStore.uploadUserThumbnailImage(editablePet);
      editablePet.thumbnailUrl = resp;
      editablePet.birthDate = parseStringToDate(birthDate);
      editablePet.animalType = editablePet.animalType || 0;
      try {
        const pet = await petStore.createNewPetProfile(editablePet);

        if (pet) {
          router.replace(`/(pet)/${pet.id}`); // Перенаправление на профиль после добавления питомца
        }
      } catch (error) {
        console.error('Ошибка при создании профиля питомца:', error);
        alert(i18n.t('EditPetProfile.errors.addErrorMessage'));
      }
    };

    const DeletePetPhoto = async () => {
      const newAvatar = ''; // Логика для удаления фото питомца
      setPetPhoto(newAvatar);
      setEditablePet((prevPet) => ({ ...prevPet, thumbnailUrl: newAvatar }));
    };

    const handleTemperament = (rating: number) => {
      setTemperament(rating);
      setEditablePet((petEdit) => ({ ...petEdit, temperament: rating }));
    };

    const handleFriendly = (rating: number) => {
      setFriendly(rating);
      setEditablePet((petEdit) => ({ ...petEdit, friendliness: rating }));
    };

    const handleActivity = (rating: number) => {
      setActivity(rating);
      setEditablePet((petEdit) => ({ ...petEdit, activityLevel: rating }));
    };

    const onAgeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') {
        setShowPetAge(false);
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

    return (
      <GestureHandlerRootView className="h-full bg-white">
        <FlatList
          data={[]} // Пустой массив данных, так как мы используем только ListHeaderComponent
          renderItem={null} // Нет элементов списка для отображения
          ListHeaderComponent={
            <View className="p-4">
              <View className="items-center">
                <PhotoSelector
                  imageUrl={petPhoto || (editablePet.animalType === 1 ? petCatUriImage : petUriImage)}
                  onReplace={SetPetPhoto}
                  onDelete={DeletePetPhoto}
                />
              </View>

              <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">{i18n.t('EditPetProfile.main')}</Text>

              <CustomOutlineInputText
                containerStyles="mt-2"
                label={i18n.t('EditPetProfile.name')}
                value={editablePet.petName}
                handleChange={(text) => handleFieldChange('petName', text)}
                allowOnlyLetters={true}
              />

              {/* Поле даты с onPress */}

              <View className="flex-row w-full">
                <CustomOutlineInputText
                  label={i18n.t('EditPetProfile.birthDate')}
                  value={age.toISOString().split('T')[0]}
                  containerStyles="mt-2 w-[85%]"
                  editable={false}
                />
                <IconButton icon="calendar" size={30} className="mt-4" onPress={() => setShowPetAge(true)} />
              </View>

              {showPetAge && Platform.OS === 'ios' && (
                <Modal transparent={true} animationType="fade">
                  <View className="flex-1 justify-center bg-black/50">
                    <View className="bg-white mx-5 p-5 rounded-3xl shadow-lg">
                      <DateTimePicker style={{width:'100%'}} value={age} mode="date" display="spinner" onChange={onAgeChange} maximumDate={new Date()} />
                      <Button mode="contained" onPress={() => setShowPetAge(false)}>
                        {i18n.t('ok')}
                      </Button>
                    </View>
                  </View>
                </Modal>
              )}

              {/* Для Android - обычный DateTimePicker */}
              {showPetAge && Platform.OS === 'android' && (
                <DateTimePicker value={age} mode="date" display="spinner" onChange={onAgeChange} maximumDate={new Date()} />
              )}

              <CustomDropdownList
                tags={i18n.t('tags.petGender') as string[]}
                label={i18n.t('EditPetProfile.gender')}
                placeholder={i18n.t('EditPetProfile.selectGender')}
                initialSelectedTag={editablePet.gender ?? i18n.t('EditPetProfile.defaultGender')}
                onChange={(selectedGender) => handleFieldChange('gender', selectedGender)}
                listMode="MODAL"
              />

              <CustomDropdownList
                tags={i18n.t('tags.TypePet') as string[]}
                label={i18n.t('typeOfPet')}
                placeholder={i18n.t('typeOfPet')}
                initialSelectedTag={editablePet.animalType || 0}
                onChange={(text) => handleFieldChange('animalType', text)}
                searchable={true}
                listMode="MODAL"
              />

              <CustomDropdownList key={editablePet.animalType}
                tags={editablePet.animalType === 1 ? (i18n.t('tags.breedsCat') as string[]) : (i18n.t('tags.breedsDog') as string[])}
                label={i18n.t('EditPetProfile.breed')}
                placeholder={i18n.t('EditPetProfile.selectBreed')}
                initialSelectedTag={editablePet.breed || ''}
                onChange={(text) => handleFieldChange('breed', text)}
                searchable={true}
                listMode="MODAL"
              />

              <View className="flex-row justify-between w-auto">
                <CustomOutlineInputText
                  keyboardType="numeric"
                  maxLength={2}
                  containerStyles="mt-2 w-1/3 flex-1"
                  label={i18n.t('EditPetProfile.weight')}
                  value={editablePet.weight || ''}
                  handleChange={(text) => handleFieldChange('weight', text.replace(/[^0-9]/g, ''))}
                />
              </View>

              <Divider className="mt-6" />
              <View>
                <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">{i18n.t('EditPetProfile.interests')}</Text>
                <CustomTagsSelector
                  tags={i18n.t('tags.petGames') as string[]}
                  initialSelectedTags={editablePet.playPreferences || []}
                  onSelectedTagsChange={(selectedTags) => handleFieldChange('playPreferences', selectedTags)}
                  maxSelectableTags={5}
                  visibleTagsCount={10}
                />
              </View>
              <Divider className="mt-6" />

              <View>
                <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">{i18n.t('EditPetProfile.health')}</Text>
                <Text className="pt-2 font-nunitoSansRegular text-gray-400 text-center"> {i18n.t('EditPetProfile.healthUpdate')}</Text>
                <Text className="pt-4 -mb-1 text-base font-nunitoSansRegular">{i18n.t('EditPetProfile.healthFeatures')}</Text>
                <CustomTagsSelector
                  tags={i18n.t('tags.petHealthIssues') as string[]}
                  initialSelectedTags={editablePet.petHealthIssues || []}
                  onSelectedTagsChange={(selectedTags) => handleFieldChange('petHealthIssues', selectedTags)}
                  maxSelectableTags={10}
                  visibleTagsCount={10}
                />
                <Text className="pt-4 -mb-1 text-base font-nunitoSansRegular">{i18n.t('EditPetProfile.vaccinations')}</Text>
                <CustomTagsSelector
                  tags={i18n.t('tags.vaccines') as string[]}
                  initialSelectedTags={editablePet.vaccinations || []}
                  onSelectedTagsChange={(selectedTags) => handleFieldChange('vaccinations', selectedTags)}
                  maxSelectableTags={10}
                  visibleTagsCount={10}
                />
                <View className="pt-4  flex-row items-center">
                  <Checkbox.Android
                    color="#3F00FF"
                    status={editablePet.neutered ? 'checked' : 'unchecked'}
                    onPress={() => handleFieldChange('neutered', !editablePet.neutered)}
                  />
                  <Text className="text-base font-nunitoSansRegular">{i18n.t('EditPetProfile.neutered')}</Text>
                </View>
                <Divider className="mt-6" />
              </View>

              <View>
                <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700"> {i18n.t('EditPetProfile.indicators')}</Text>
                <View className="pl-1 pt-2 flex-row justify-between">
                  <Text className="font-nunitoSansRegular text-base">{i18n.t('EditPetProfile.temperament')}</Text>
                  <StarRating
                    rating={temperament}
                    starSize={25}
                    color="#BFA8FF"
                    onChange={handleTemperament}
                    StarIconComponent={CircleIcon}
                  />
                </View>
                <View className="pl-1 pt-2 flex-row justify-between">
                  <Text className="font-nunitoSansRegular text-base">{i18n.t('EditPetProfile.friendliness')}</Text>
                  <StarRating rating={friendly} starSize={25} color="#BFA8FF" onChange={handleFriendly} StarIconComponent={CircleIcon} />
                </View>
                <View className="pl-1 pt-2 flex-row justify-between">
                  <Text className="font-nunitoSansRegular text-base">{i18n.t('EditPetProfile.activity')}</Text>
                  <StarRating rating={activity} starSize={25} color="#BFA8FF" onChange={handleActivity} StarIconComponent={CircleIcon} />
                </View>
                <Divider className="mt-3" />
              </View>
              {/* <View >
                <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Игровые предпочтения</Text>
                <CustomTagsSelector
                  tags={DOGGAMES_TAGS}
                  initialSelectedTags={editablePet.playPreferences || []}
                  onSelectedTagsChange={(selectedTags) => handleFieldChange('playPreferences', selectedTags)}
                  maxSelectableTags={5}
                />
              </View> */}
              <View>
                <CustomOutlineInputText
                  containerStyles="mt-4"
                  label={i18n.t('EditPetProfile.additionalNotes')}
                  value={editablePet.additionalNotes || ''}
                  handleChange={(text) => handleFieldChange('additionalNotes', text)}
                  numberOfLines={4}
                />
              </View>

              {/* <View>
                <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">{i18n.t('EditPetProfile.socialMedia')}</Text>
                <CustomOutlineInputText
                  containerStyles="mt-4"
                  label="Instagram"
                  value={editablePet.instagram || ''}
                  handleChange={(text) => handleFieldChange('instagram', text)}
                />
                <CustomOutlineInputText
                  containerStyles="mt-4"
                  label="Facebook"
                  value={editablePet.facebook || ''}
                  handleChange={(text) => handleFieldChange('facebook', text)}
                />
                <Divider className="mt-6" />
              </View> */}

              <View className="mt-4">
                {isNewPet ? (
                  <CustomLoadingButton title={i18n.t('EditPetProfile.add')} handlePress={handleAddPet} />
                ) : (
                  <CustomLoadingButton title={i18n.t('EditPetProfile.save')} handlePress={handleSave} />
                )}
                <CustomButtonOutlined title={i18n.t('EditPetProfile.cancel')} handlePress={onCancel} />
              </View>

              <View className="h-32" />
            </View>
          }
          keyExtractor={(item, index) => index.toString()} // Генерация ключа
        />
      </GestureHandlerRootView>
    );
  }
);

export default EditPetProfileComponent;
