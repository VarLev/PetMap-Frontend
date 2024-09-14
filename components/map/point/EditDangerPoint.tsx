// CompositeFormComponent.tsx

import React, { useState } from 'react';
import { View } from 'react-native';
import CustomOutlineInputText from '../../custom/inputs/CustomOutlineInputText';
import { Text } from 'react-native';
import AddPhotoButton from '../../custom/buttons/AddPhotoButton';
import { DANGERTYPE_TAGS } from '@/constants/Strings';
import CustomDropdownList from '../../custom/selectors/CustomDropdownList';
import CustomButtonPrimary from '../../custom/buttons/CustomButtonPrimary';
import mapStore from '@/stores/MapStore';

import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import { MapPointType } from '@/dtos/enum/MapPointType';

interface CompositeFormProps {
  mapPoint: IPointDangerDTO;
  onClose: () => void;  
}

const EditDangerPoint: React.FC<CompositeFormProps> = ({ onClose, mapPoint }) => {
  const [editablePoint, setEditablePoint] = useState<IPointDangerDTO>(mapPoint);
  //const [editablePet, setEditablePet] = useState<Pet>(new Pet({ ...pet }));
 

  const handleFieldChange = (field: keyof IPointDangerDTO, value: any) => {
    setEditablePoint((prevPet) => {
      const updatedPoint = { ...prevPet, [field]: value };  
      return updatedPoint;
    });
  };

  


  const handleSave = async () => {
    
    await mapStore.addPointDanger(editablePoint);
    await mapStore.getMapPointsByType(MapPointType.Danger);
    onClose();
  }

  return (
    <View className='px-7'>
      <Text className='px-2 text-lg font-nunitoSansBold'>Опасность</Text>
      <View className='flex-col'>
        <AddPhotoButton buttonText='Добавить фото' onImageSelected={(photo) => handleFieldChange('thumbnailUrl',photo)}/>
        <CustomDropdownList tags={DANGERTYPE_TAGS} listMode='MODAL' onChange={(tag) => handleFieldChange('dangerType', tag)}/>
        <CustomOutlineInputText label='Описание' value={editablePoint.description} handleChange={(text) => handleFieldChange('description',text)}/>
        <CustomButtonPrimary title='Добавить' handlePress={handleSave}/>
      </View>
    </View>
  );
};

export default EditDangerPoint;
