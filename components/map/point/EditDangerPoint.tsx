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
import userStore from '@/stores/UserStore';
import i18n from '@/i18n'; // Импорт конфигурации i18n

interface CompositeFormProps {
  mapPoint: IPointDangerDTO;
  onClose: () => void;
}

const EditDangerPoint: React.FC<CompositeFormProps> = ({ onClose, mapPoint }) => {
  const [editablePoint, setEditablePoint] = useState<IPointDangerDTO>(mapPoint);

  const handleFieldChange = (field: keyof IPointDangerDTO, value: any) => {
    setEditablePoint((prevPoint) => {
      const updatedPoint = { ...prevPoint, [field]: value };
      return updatedPoint;
    });
  };

  const checkErrors = () => {
    if (!editablePoint.dangerType || !editablePoint.description) {
      alert(i18n.t('EditDangerPoint.errors.missingFields'));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      if (checkErrors()) {
        const thumb = await mapStore.uploaPiontThumbnailImage(editablePoint, MapPointType.Danger);
        editablePoint.thumbnailUrl = thumb;

        await mapStore.addPoint(editablePoint);
        const currentUser = await userStore.getCurrentUser();
        await mapStore.getMapPointsByType({
          type: MapPointType.Danger,
          userId: currentUser?.id!,
          city: (await userStore.getCurrentUserCity()) || '',
        });
        onClose();
      }
    } catch (error) {
      console.error(i18n.t('EditDangerPoint.errors.saveError'), error);
      onClose();
    }
  };

  return (
    <View className="px-7">
      <Text className="px-2 text-lg font-nunitoSansBold">
        {i18n.t('EditDangerPoint.title')}
      </Text>
      <View className="flex-col">
        <AddPhotoButton
          buttonText={i18n.t('EditDangerPoint.addPhoto')}
          onImageSelected={(photo) => handleFieldChange('thumbnailUrl', photo)}
        />
        <CustomDropdownList
          tags={DANGERTYPE_TAGS}
          listMode="MODAL"
          onChange={(tag) => handleFieldChange('dangerType', tag)}
        />
        <CustomOutlineInputText
          label={i18n.t('EditDangerPoint.description')}
          value={editablePoint.description}
          handleChange={(text) => handleFieldChange('description', text)}
        />
        <CustomButtonPrimary
          title={i18n.t('EditDangerPoint.addButton')}
          handlePress={handleSave}
        />
      </View>
    </View>
  );
};

export default EditDangerPoint;