import React, { useState } from 'react';
import { View } from 'react-native';
import CustomOutlineInputText from '../../custom/inputs/CustomOutlineInputText';
import { Text } from 'react-native';
import AddPhotoButton from '../../custom/buttons/AddPhotoButton';
import { AMENITIES_TAGS, USERSPOINTTYPE_TAGS } from '@/constants/Strings';
import CustomDropdownList from '../../custom/selectors/CustomDropdownList';
import CustomButtonPrimary from '../../custom/buttons/CustomButtonPrimary';
import mapStore from '@/stores/MapStore';
import { MapPointType } from '@/dtos/enum/MapPointType';
import { IPointUserDTO } from '@/dtos/Interfaces/map/IPointUserDTO';
import CustomTagsSelector from '@/components/custom/selectors/CustomTagsSelector';

interface CompositeFormProps {
  mapPoint: IPointUserDTO;
  onClose: () => void;  
}

const EditUserPoint: React.FC<CompositeFormProps> = ({ onClose, mapPoint }) => {
  const [editablePoint, setEditablePoint] = useState<IPointUserDTO>(mapPoint);
  //const [editablePet, setEditablePet] = useState<Pet>(new Pet({ ...pet }));
 

  const handleFieldChange = (field: keyof IPointUserDTO, value: any) => {
    setEditablePoint((prevPet) => {
      const updatedPoint = { ...prevPet, [field]: value };  
      return updatedPoint;
    });
  };

  const CheckErrors = () => {
    if (!editablePoint.UserPointType || !editablePoint.description) {
      // Вывод ошибки, если не все обязательные поля заполнены
      alert("Пожалуйста, заполните все обязательные поля: Тип, Описание.");
      return false;
    }
    return true;
  }



  
  const handleSave = async () => {
    try {
      if(CheckErrors()){
        const thumb = await mapStore.uploaPiontThumbnailImage(editablePoint, MapPointType.UsersCustomPoint);
        editablePoint.thumbnailUrl = thumb;
        
        await mapStore.addPoint(editablePoint);
        await mapStore.getMapPointsByType(MapPointType.UsersCustomPoint);
        
        onClose();
      } 
    } catch (error) {
      console.error("Ошибка при сохранении точки:", error);
      onClose();
    }
  }

  return (
    <View className='px-7'>
      <Text className='px-2 text-lg font-nunitoSansBold'>Опасность</Text>
      <View className='flex-col'>
        <AddPhotoButton buttonText='Добавить фото' onImageSelected={(photo) => handleFieldChange('thumbnailUrl',photo)}/>
        <CustomDropdownList tags={USERSPOINTTYPE_TAGS} listMode='MODAL' onChange={(tag) => handleFieldChange('UserPointType', tag)}/>
        <CustomOutlineInputText label='Название' value={editablePoint.name} handleChange={(text) => handleFieldChange('name',text)}/>
        <CustomOutlineInputText label='Адрес' value={editablePoint.address} handleChange={(text) => handleFieldChange('address',text)}/>
        <CustomOutlineInputText label='Описание' value={editablePoint.description} handleChange={(text) => handleFieldChange('description',text)}/>
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Удобства</Text>
            <CustomTagsSelector tags={AMENITIES_TAGS} initialSelectedTags={[]} maxSelectableTags={5}/>
          </View>
        <CustomButtonPrimary title='Добавить' handlePress={handleSave}/>
        <View className="h-10"/>
      </View>
    </View>
  );
};

export default EditUserPoint;
