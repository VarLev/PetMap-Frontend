import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Platform, Modal } from 'react-native';
import { Button, Checkbox, Divider, IconButton } from 'react-native-paper';
import { Pet } from '@/dtos/classes/pet/Pet';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';
import { observer } from 'mobx-react-lite';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { IPet } from '@/dtos/Interfaces/pet/IPet';
import StarRating from 'react-native-star-rating-widget';
import petStore from '@/stores/PetStore';
import { parseDateToString, parseStringToDate } from '@/utils/utils';
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
import PhotoSelectorCarusel from '../common/PhotoSelectorCarusel';
import { Photo } from '@/dtos/classes/Photo';
import CustomPriceInput from '../custom/inputs/CustomPriceInput';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

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
    const [petMainPhoto, setPetMainPhoto] = useState<Photo>(
      new Photo({
        url: pet.thumbnailUrl || (pet.animalType === 1 ? petCatUriImage : petUriImage),
      })
    );
    const [petOthePhotos, setPetOthePhotos] = useState<Photo[]>(pet.photos || []);

    // Состояние для комбинированного массива фотографий: первым идёт petMainPhoto, далее остальные
    const [petAllPhoto, setPetAllPhoto] = useState<Photo[]>([petMainPhoto, ...petOthePhotos]);

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
    const [hasSubscription, setHasSubscription] = useState(userStore.getUserHasSubscription() ?? false);

    // Получаем массив статусов (например, ["С хозяином", "Потерялся", "Пристраивается", "Вяжется", "Продается"])
    const petStatusTags = i18n.t('petStatus') as string[];

    // Вычисляем индекс статуса "Продается" из этого массива
    const forSaleIndex = petStatusTags.indexOf(i18n.t('petStatus.forSale'));

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

    // Debugging useEffect to see the changes in editablePet
    useEffect(() => {
      setFriendly(editablePet.friendliness ?? 0);
      setTemperament(editablePet.temperament ?? 0);
      setActivity(editablePet.activityLevel ?? 0);

      if (pet.id === 'new') {
        setIsNewPet(true);
      }
    }, [editablePet]);

    // Обновляем комбинированный массив фотографий, когда меняются главное фото или остальные
    useEffect(() => {
      setPetAllPhoto([petMainPhoto, ...petOthePhotos]);
    }, [petMainPhoto, petOthePhotos]);

    const handleFieldChange = (field: keyof Pet, value: any) => {
      setEditablePet((prevPet) => {
        const updatedPet = { ...prevPet, [field]: value };
        return updatedPet;
      });
    };

    const CheckErrors = () => {
      if (!editablePet.petName || !birthDate) {
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

    // const SetPetPhoto = async () => {
    //   const image = await petStore.setPetImage();
    //   if (image) {
    //     setEditablePet({ ...editablePet, thumbnailUrl: image });
    //     setPetPhoto(image);
    //   }
    // };

    const handleSave = async () => {
      if (!CheckErrors()) return;
      const resp = await petStore.uploadPetThumbnail(editablePet);
      editablePet.thumbnailUrl = resp;
      editablePet.birthDate = parseStringToDate(birthDate);
      editablePet.price = parseFloat(editablePet.price?.toString().replace(' ', '') || '0');

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

      const resp = await petStore.uploadPetThumbnail(editablePet);
      editablePet.thumbnailUrl = resp;
      editablePet.birthDate = parseStringToDate(birthDate);
      editablePet.animalType = editablePet.animalType || 0;
      editablePet.price = parseFloat(editablePet.price?.toString().replace(' ', '') || '0');

      try {
        const pet = await petStore.createNewPetProfile(editablePet);

        // if (pet) {
        //   router.replace(`/(pet)/${pet.id}`); // Перенаправление на профиль после добавления питомца
        // }
      } catch (error) {
        console.error('Ошибка при создании профиля питомца:', error);
        alert(i18n.t('EditPetProfile.errors.addErrorMessage'));
      }
    };

    // const DeletePetPhoto = async () => {
    //   const newAvatar = ''; // Логика для удаления фото питомца
    //   setPetPhoto(newAvatar);
    //   setEditablePet((prevPet) => ({ ...prevPet, thumbnailUrl: newAvatar }));
    // };

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

    // 1. Добавление новой фотографии
    const handleAddPhoto = async () => {
      try {
        const image = await petStore.setPetImage();
        if (image) {
          const newPhoto = new Photo({
            url: image,
            userId: editablePet.userId,
            petProfileId: editablePet.id,
          });
          // Добавляем новую фотографию в дополнительные
          setPetOthePhotos((prev) => [...prev, newPhoto]);
          await petStore.uploadPetPhoto(newPhoto);
        }
      } catch (error) {
        console.error('Ошибка при добавлении фото:', error);
      }
    };

    // 2. Замена существующей фотографии
    const handleReplacePhoto = async (index: number) => {
      try {
        const image = await petStore.setPetImage();
        if (image) {
          if (index === 0) {
            // Замена главного фото (thumbnail)
            const updatedThumbnail = new Photo({ url: image });
            setPetMainPhoto(updatedThumbnail);
            setEditablePet((prev) => ({ ...prev, thumbnailUrl: image }));
          } else {
            // Замена одной из дополнительных фотографий
            const photoIndex = index - 1;
            if (petOthePhotos.length > photoIndex) {
              const updatedPhotos = [...petOthePhotos];
              updatedPhotos[photoIndex] = new Photo({
                ...updatedPhotos[photoIndex],
                url: image,
              });
              setPetOthePhotos(updatedPhotos);
              setEditablePet((prev) => ({ ...prev, photos: updatedPhotos }));
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при замене фото:', error);
      }
    };

    // ===================== Обновлённая логика удаления фотографии =====================
    const handleDeletePhoto = async (index: number) => {
      if (index === 0) {
        // Если удаляется главное изображение (thumbnail),
        // устанавливаем значение по умолчанию (например, petCatUriImage или petUriImage в зависимости от animalType)
        const defaultUrl = editablePet.animalType === 1 ? petCatUriImage : petUriImage;
        const defaultThumbnail = new Photo({ url: defaultUrl });
        setPetMainPhoto(defaultThumbnail);
        setEditablePet((prev) => ({ ...prev, thumbnailUrl: defaultUrl }));
      } else {
        // Если удаляется фотография из дополнительных,
        // индекс в массиве дополнительных фотографий = index - 1

        const photoIndex = index - 1;
        await petStore.deletePetPhoto(petOthePhotos[photoIndex].id!);

        if (petOthePhotos.length > photoIndex) {
          const updatedPhotos = [...petOthePhotos];
          updatedPhotos.splice(photoIndex, 1);
          setPetOthePhotos(updatedPhotos);
          setEditablePet((prev) => ({ ...prev, photos: updatedPhotos }));
        }
      }
    };
    // ============================================================================

    return (
      <GestureHandlerRootView className="h-full bg-white">
        <FlatList
          data={[]} // Пустой массив данных, так как мы используем только ListHeaderComponent
          renderItem={null} // Нет элементов списка для отображения
          ListHeaderComponent={
            <View className="p-4">
              <View className="-mt-4 items-center">
                {/* <PhotoSelector
                  imageUrl={petPhoto || (editablePet.animalType === 1 ? petCatUriImage : petUriImage)}
                  onReplace={SetPetPhoto}
                  onDelete={DeletePetPhoto}
                /> */}
                <PhotoSelectorCarusel
                  photos={petAllPhoto}
                  onReplace={(index) => handleReplacePhoto(index)}
                  onDelete={(index) => handleDeletePhoto(index)}
                  onAdd={handleAddPhoto}
                />
              </View>

              <View>
                <CustomDropdownList
                  tags={petStatusTags}
                  label={i18n.t('EditPetProfile.petStatus')}
                  placeholder={i18n.t('EditPetProfile.petStatus')}
                  // Если petStatus задан, преобразуем его в строку по индексу, иначе используем значение по умолчанию
                  initialSelectedTag={editablePet.petStatus ?? i18n.t('EditPetProfile.petStatusDefault')}
                  onChange={(status) => handleFieldChange('petStatus', status)}
                  listMode="MODAL"
                />
              </View>

              {/* Если выбран статус "Продается", отображаем дополнительное поле для ввода цены */}
              {editablePet.petStatus === 4 && (
                <View className="mt-4">
                  <CustomPriceInput
                    label={i18n.t('EditPetProfile.petStatusPrice') + ' (ARS$)'}
                    value={editablePet.price || ''}
                    handleChange={(text) => handleFieldChange('price', text)}
                    currency={'ARS$'} // например, для аргентинского "ARS$"
                    keyboardType="decimal-pad"
                  />
                </View>
              )}

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
                      <DateTimePicker
                        style={{ width: '100%' }}
                        value={age}
                        mode="date"
                        display="spinner"
                        onChange={onAgeChange}
                        maximumDate={new Date()}
                        textColor="black"
                      />
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

              <CustomDropdownList
                key={editablePet.animalType}
                tags={editablePet.animalType === 1 ? (i18n.t('tags.breedsCat') as string[]) : (i18n.t('tags.breedsDog') as string[])}
                label={i18n.t('EditPetProfile.breed')}
                placeholder={i18n.t('EditPetProfile.selectBreed')}
                initialSelectedTag={editablePet.breed || 0}
                onChange={(text) => handleFieldChange('breed', text)}
                searchable={true}
                listMode="MODAL"
              />

              <View className="flex-row justify-between w-auto">
                <CustomOutlineInputText
                  keyboardType="numeric"
                  maxLength={4}
                  containerStyles="mt-2 w-1/3 flex-1"
                  label={i18n.t('EditPetProfile.weight') + ' (kg)'}
                  value={editablePet.weight || ''}
                  handleChange={(text) => {
                    // Заменяем запятые на точки и удаляем лишние символы
                    let processedText = text
                      .replace(/[^0-9,]/g, '') // Разрешаем только цифры и запятую
                      .replace(/(,.*),/g, '$1'); // Убираем лишние запятые, если их больше одной

                    handleFieldChange('weight', processedText);
                  }}
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

              <View>
                <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">{i18n.t('EditPetProfile.socialMedia')}</Text>
                {!hasSubscription && (
                  <IconButton
                    className="-ml-2"
                    size={20}
                    icon={() => <FontAwesome name="diamond" size={20} color="#8F00FF" />}
                    onPress={() => router.push('/(paywall)/pay')}
                  />
                )}
                <CustomOutlineInputText
                  containerStyles={`mt-4 ${hasSubscription ? 'bg-white' : 'bg-gray-200'}`}
                  label="Instagram"
                  placeholder='username'
                  value={editablePet.instagram || ''}
                  handleChange={(text) => handleFieldChange('instagram', text)}
                  editable={hasSubscription}
                  maxLength={30}
                  allowedSymbols={['social']}
                />
                <CustomOutlineInputText
                  containerStyles={`mt-4 ${hasSubscription ? 'bg-white' : 'bg-gray-200'}`}
                  label="Facebook"
                  placeholder='username'
                  value={editablePet.facebook || ''}
                  handleChange={(text) => handleFieldChange('facebook', text)}
                  editable={hasSubscription}
                  maxLength={50}
                  allowedSymbols={['social']}
                />
                <Divider className="mt-6" />
              </View>

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
