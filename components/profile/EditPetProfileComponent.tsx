import React, { useState, useMemo, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { Pet } from '@/dtos/classes/pet/Pet';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';
import PhotoSelector from '../common/PhotoSelector';
import { observer } from 'mobx-react-lite';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { IPet } from '@/dtos/Interfaces/pet/IPet';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { BREEDS_TAGS, GENDERS_TAGS, PETTYPES_TAGS } from '@/constants/Strings';

const EditPetProfileComponent = observer(({ pet, onSave, onCancel }: { pet: IPet, onSave: () => void, onCancel: () => void }) => {
  const [editablePet, setEditablePet] = useState<Pet>(new Pet({ ...pet }));
  const [petPhoto, setPetPhoto] = useState(editablePet.thumbnailUrl);

  const [temperament, setTemperament] = useState(0);
  const [friendly, setFriendly] = useState(0);
  const [activity, setActivity] = useState(0);

  const handleFieldChange = useCallback((field: keyof Pet, value: any) => {
    setEditablePet((prevPet) => ({ ...prevPet, [field]: value }));
  }, []);

  const SetPetPhoto = async () => {
    // Логика для установки фото питомца
  };

  const DeletePetPhoto = async () => {
    const newAvatar = ''; // Логика для удаления фото питомца
    setPetPhoto(newAvatar);
    setEditablePet((prevPet) => ({ ...prevPet, thumbnailUrl: newAvatar }));
  };

  // Мемоизация хедера формы для предотвращения лишних ререндеров
  const renderHeaderComponent = useMemo(() => (
    <View className="p-4">
      <View className="items-center">
        <PhotoSelector
          imageUrl={petPhoto || 'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/assets%2Fimages%2Fpet%2Fthumbnail.png?alt=media&token=f6fd6149-8755-4a80-a903-635de3c570eb'}
          onReplace={SetPetPhoto}
          onDelete={DeletePetPhoto}
        />
      </View>
      
      <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Основное</Text>
      
      <CustomOutlineInputText
        containerStyles="mt-2"
        label="Имя"
        value={editablePet.petName}
        handleChange={(text) => handleFieldChange('petName', text)}
      />

      <CustomOutlineInputText
        containerStyles="mt-4"
        label="Дата рождения"
        value={editablePet.birthDate ? editablePet.birthDate.toISOString().split('T')[0] : ''}
        handleChange={(text) => handleFieldChange('birthDate', new Date(text))}
      />

      <CustomDropdownList
        tags={PETTYPES_TAGS}
        label='Тип'
        placeholder="Тип"
        initialSelectedTag={editablePet.animalType || 'Собака'}
        onChange={(text) => handleFieldChange('animalType', text)}
      />

      <CustomDropdownList
        tags={GENDERS_TAGS}
        label='Пол'
        placeholder="Пол"
        initialSelectedTag={editablePet.gender || 'N/A'}
        onChange={(text) => handleFieldChange('gender', text)}
      />

      <CustomDropdownList
        tags={BREEDS_TAGS}
        label='Порода'
        placeholder="Порода"
        initialSelectedTag={editablePet.breed || ''}
        onChange={(text) => handleFieldChange('breed', text)}
        searchable={true}
      />

      <View className='flex-row justify-between space-x-4 w-auto'>
        <CustomOutlineInputText
          containerStyles="mt-4 w-1/3 flex-1 mr-1"
          label="Вес"
          value={editablePet.weight || ''}
          handleChange={(text) => handleFieldChange('size', text)}
        />

        <CustomOutlineInputText
          containerStyles="mt-4 w-1/3 flex-1 mr-1"
          label="Высота"
          value={editablePet.weight || ''}
          handleChange={(text) => handleFieldChange('size', text)}
        />

        <CustomOutlineInputText
          containerStyles="mt-4 w-1/3 flex-1 mr-1"
          label="Длина"
          value={editablePet.weight || ''}
          handleChange={(text) => handleFieldChange('size', text)}
        />
      </View>

      <Divider className="mt-6" />

      <View>
        <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Здоровье</Text>
        <Text className='pt-2 font-nunitoSansRegular text-gray-400 text-center'>We are working on a health passport for your pet, stay tuned for updates.</Text>
        <Divider className='mt-6' />
      </View>


      <View >
        <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Показатели</Text>
        <View className='pt-2 flex-row justify-between'>              
          <Text className='font-nunitoSansRegular text-base'>Темперамент</Text>
          <StarRating rating={temperament} starSize={25} color='#BFA8FF' onChange={setTemperament} />
        </View>
        <View className='pt-2 flex-row justify-between'>              
          <Text className='font-nunitoSansRegular text-base'>Дружелюбность</Text>
          <StarRating rating={friendly} style={{}} starSize={25}  color='#BFA8FF' onChange={setFriendly}/>
        </View>
        <View className='pt-2 flex-row justify-between'>              
          <Text className='font-nunitoSansRegular text-base'>Активность</Text>
          <StarRating rating={activity} starSize={25} color='#BFA8FF' onChange={setActivity}/>
        </View>
        <Divider className='mt-3' />
      </View>

      <CustomOutlineInputText
        containerStyles="mt-4"
        label="Дополнительные заметки"
        value={editablePet.additionalNotes || ''}
        handleChange={(text) => handleFieldChange('additionalNotes', text)}
        numberOfLines={4}
      />

      <Button mode="contained" onPress={onSave} className="mt-5 bg-indigo-800">
        Сохранить
      </Button>
      <Button mode="outlined" onPress={onCancel} className="mt-4">
        Отмена
      </Button>
      <View className="h-32" />
    </View>
  ), [editablePet, temperament, friendly, activity, petPhoto]);

  return (
    <GestureHandlerRootView className="h-full bg-white">
      <FlatList
        data={[]} // Пустой массив данных, так как мы используем только ListHeaderComponent
        renderItem={null} // Нет элементов списка для отображения
        ListHeaderComponent={renderHeaderComponent}
        keyExtractor={(item, index) => index.toString()} // Генерация ключа
      />
    </GestureHandlerRootView>
  );
});

export default EditPetProfileComponent;
