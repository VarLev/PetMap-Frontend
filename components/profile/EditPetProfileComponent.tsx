import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { Pet } from '@/dtos/classes/pet/Pet';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';
import PhotoSelector from '../common/PhotoSelector';
import { observer } from 'mobx-react-lite';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { IPet } from '@/dtos/Interfaces/pet/IPet';
import StarRating from 'react-native-star-rating-widget';
import { BREEDS_TAGS, GENDERS_TAGS, PETTYPES_TAGS } from '@/constants/Strings';
import petStore from '@/stores/PetStore';


const EditPetProfileComponent = observer(({ pet, onSave, onCancel }: { pet: IPet, onSave: (updatedPet: Pet) => void, onCancel: () => void }) => {
  const [editablePet, setEditablePet] = useState<Pet>(new Pet({ ...pet }));
  const [petPhoto, setPetPhoto] = useState(editablePet.thumbnailUrl);

  const [temperament, setTemperament] = useState(0);
  const [friendly, setFriendly] = useState(0);
  const [activity, setActivity] = useState(0);
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [isNewPet, setIsNewPet] = useState(false);

  const handleFieldChange = (field: keyof Pet, value: any) => {
    setEditablePet((prevPet) => {
      const updatedPet = { ...prevPet, [field]: value };  
      return updatedPet;
    });
};

    // Debugging useEffect to see the changes in editablePet
  useEffect(() => {
    setFriendly(editablePet.friendliness?? 0);
    setTemperament(editablePet.temperament?? 0);
    setActivity(editablePet.activityLevel?? 0);
    const size = editablePet.size?.split('х');
    setLength(size?.[1] ?? '');
    setHeight(size?.[0] ?? '');
    if(pet.id === 'new'){
      setIsNewPet(true);
    }
    
  }, [editablePet]);

  const SetPetPhoto = async () => {
    const image = await petStore.setPetImage();
    if (image) {
      setEditablePet({ ...editablePet, thumbnailUrl: image });
      setPetPhoto(image);
    }
  };

  const handleSave = async () => {
    onSave(editablePet);
  };

  const handleAddPet = async () => {
    petStore.createPetProfile(editablePet);
  };


  const DeletePetPhoto = async () => {
    const newAvatar = ''; // Логика для удаления фото питомца
    setPetPhoto(newAvatar);
    setEditablePet((prevPet) => ({ ...prevPet, thumbnailUrl: newAvatar }));
  };

  const handleTemperament = (rating: number) => {
    setTemperament(rating);
    setEditablePet((petEdit) => ({ ...petEdit, temperament: rating }));
  }

  const handleFriendly = (rating: number) => {
    setFriendly(rating);
    setEditablePet((petEdit) => ({ ...petEdit, friendliness: rating }));
  }

  const handleActivity = (rating: number) => {
    setActivity(rating);
    setEditablePet((petEdit) => ({ ...petEdit, activityLevel: rating }));
  }

  const handleLengh = (lenth: string) => {
    setLength(lenth);
    const size = `${length}х${height}`;
    setEditablePet((pet) => ({ ...pet, size: size }));
  }

  const handleHeight = (height: string) => {
    setHeight(height);
    const size = `${height}х${length}`;
    setEditablePet((pet) => ({ ...pet, size: size }));
  }

  

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
        placeholder='YYYY-MM-DD'
        label="Дата рождения"
        value={editablePet.birthDate ? editablePet.birthDate.toString() : ''}
        handleChange={(text) => handleFieldChange('birthDate', text)}
        keyboardType='number-pad'
        
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
        label="Пол"
        placeholder="Выберите пол"
        initialSelectedTag={editablePet.gender!}
        onChange={(selectedGender) => handleFieldChange('gender', selectedGender)}
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
          handleChange={(text) => handleFieldChange('weight', text)}
        />

        <CustomOutlineInputText
          containerStyles="mt-4 w-1/3 flex-1 mr-1"
          label="Высота"
          value={height || ''}
          handleChange={handleHeight}
        />

        <CustomOutlineInputText
          containerStyles="mt-4 w-1/3 flex-1 mr-1"
          label="Длина"
          value={length || ''}
          handleChange={handleLengh}
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
          <StarRating rating={temperament} starSize={25} color='#BFA8FF' onChange={handleTemperament} />
        </View>
        <View className='pt-2 flex-row justify-between'>              
          <Text className='font-nunitoSansRegular text-base'>Дружелюбность</Text>
          <StarRating rating={friendly} starSize={25}  color='#BFA8FF' onChange={handleFriendly}/>
        </View>
        <View className='pt-2 flex-row justify-between'>              
          <Text className='font-nunitoSansRegular text-base'>Активность</Text>
          <StarRating rating={activity} starSize={25} color='#BFA8FF' onChange={handleActivity}/>
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

      {isNewPet ?  (
        <Button mode="contained" onPress={handleAddPet} className='mt-5 bg-indigo-800'>
          Добавить
        </Button>
        ):(
        <Button mode="contained" onPress={handleSave} className='mt-5 bg-indigo-800'>
          Сохранить
        </Button>
      )} 
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
