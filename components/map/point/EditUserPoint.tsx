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
import { UserPointType } from '@/dtos/enum/UserPointType';

interface CompositeFormProps {
  mapPoint: IPointUserDTO;
  onClose: () => void;  
}

const EditUserPoint: React.FC<CompositeFormProps> = ({ onClose, mapPoint }) => {
  const [editablePoint, setEditablePoint] = useState<IPointUserDTO>(mapPoint);

  const handleFieldChange = (field: keyof IPointUserDTO, value: any) => {
    setEditablePoint((prevPoint) => {
      const updatedPoint = { ...prevPoint, [field]: value };  
      return updatedPoint;
    });
  };

  const CheckErrors = () => {
    if (!editablePoint.userPointType || !editablePoint.description) {
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
        editablePoint.mapPointType = editablePoint.userPointType as number;
        await mapStore.addPoint(editablePoint);
        await mapStore.getMapPointsByType({type: editablePoint.mapPointType, userId: editablePoint.userId!});
        onClose();
      } 
    } catch (error) {
      console.error("Ошибка при сохранении точки:", error);
      onClose();
    }
  }

  return (
    <View className='px-7'>
      <Text className='text-lg font-nunitoSansBold'>{editablePoint.userPointType === UserPointType.Note ? 'Моя заметка' : 'Публичная метка'}</Text>
      <View className='flex-col'>
        {editablePoint.userPointType !== UserPointType.Note && (
          <>
            <AddPhotoButton buttonText='Добавить фото' onImageSelected={(photo) => handleFieldChange('thumbnailUrl', photo)}/>
            <CustomDropdownList tags={USERSPOINTTYPE_TAGS} listMode='MODAL' onChange={(tag) => handleFieldChange('userPointType', tag)} disabledInexes={[0,1,9,10,11]}/>
            <CustomOutlineInputText label='Название' value={editablePoint.name} handleChange={(text) => handleFieldChange('name', text)}/>
            <CustomOutlineInputText label='Адрес' value={editablePoint.address} handleChange={(text) => handleFieldChange('address', text)}/>
          </>
        )}

        {/* Компонент для текстового описания всегда рендерится */}
        <CustomOutlineInputText label='Описание' value={editablePoint.description} handleChange={(text) => handleFieldChange('description', text)} numberOfLines={3}/>
        
        {/* Блок удобств показывается только если это не заметка */}
        {editablePoint.userPointType !== UserPointType.Note && (
          <View>
            <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Удобства</Text>
            <CustomTagsSelector tags={AMENITIES_TAGS} initialSelectedTags={[]} maxSelectableTags={5} visibleTagsCount={10}/>
          </View>
        )}
        
        <CustomButtonPrimary title='Добавить' handlePress={handleSave}/>
        <View className="h-24"/>
      </View>
    </View>
  );
};

export default EditUserPoint;
