import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CustomOutlineInputText from '../../custom/inputs/CustomOutlineInputText';
import AddPhotoButton from '../../custom/buttons/AddPhotoButton';
import CustomDropdownList from '../../custom/selectors/CustomDropdownList';
import CustomButtonPrimary from '../../custom/buttons/CustomButtonPrimary';
import mapStore from '@/stores/MapStore';
import { MapPointType } from '@/dtos/enum/MapPointType';
import { IPointUserDTO } from '@/dtos/Interfaces/map/IPointUserDTO';
import CustomTagsSelector from '@/components/custom/selectors/CustomTagsSelector';
import { UserPointType } from '@/dtos/enum/UserPointType';
import userStore from '@/stores/UserStore';
import i18n from '@/i18n'; // Импорт i18n

interface CompositeFormProps {
  mapPoint: IPointUserDTO;
  onClose: () => void;
}

const EditUserPointOnMap: React.FC<CompositeFormProps> = ({ onClose, mapPoint }) => {
  const [editablePoint, setEditablePoint] = useState<IPointUserDTO>(mapPoint);

  const handleFieldChange = (field: keyof IPointUserDTO, value: any) => {
    setEditablePoint((prevPoint) => {
      const updatedPoint = { ...prevPoint, [field]: value };
      return updatedPoint;
    });
  };

  const checkErrors = () => {

    if (!editablePoint.userPointType || !editablePoint.description) {
      alert(i18n.t('EditUserPoint.errors.missingFields'));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      if (checkErrors()) {
        const thumb = await mapStore.uploaPiontThumbnailImage(
          editablePoint,
          MapPointType.UsersCustomPoint
        );
        editablePoint.thumbnailUrl = thumb;
        editablePoint.mapPointType = editablePoint.userPointType as number;
        editablePoint.city = (await userStore.getCurrentUserCity()) || 'Buenos Aires';
        await mapStore.addPoint(editablePoint);
        await mapStore.getMapPointsByType({
          type: editablePoint.mapPointType,
          userId: editablePoint.userId!,
          city: (await userStore.getCurrentUserCity()) || '',
        });
        onClose();
      }
    } catch (error) {
      console.error(error);
      onClose();
    }
  };

  return (
    <View className="px-7">
      <Text className="text-lg font-nunitoSansBold">
        {editablePoint.userPointType === UserPointType.Note
          ? i18n.t('EditUserPoint.myNote')
          : i18n.t('EditUserPoint.publicMark')}
      </Text>
      <View className="flex-col">
        {editablePoint.userPointType !== UserPointType.Note && (
          <>
            <AddPhotoButton
              buttonText={i18n.t('EditUserPoint.addPhoto')}
              onImageSelected={(photo) => handleFieldChange('thumbnailUrl', photo)}
            />
            <CustomDropdownList
              tags={i18n.t('tags.USERSPOINTTYPE_TAGS') as string[]}
              listMode="MODAL"
              onChange={(tag) => handleFieldChange('userPointType', tag)}
              disabledIndexes={[0, 1, 9, 10, 11]}
             
            />
            <CustomOutlineInputText
              label={i18n.t('EditUserPoint.name')}
              value={editablePoint.name}
              handleChange={(text) => handleFieldChange('name', text)}
            />
            <CustomOutlineInputText
              label={i18n.t('EditUserPoint.address')}
              value={editablePoint.address}
              handleChange={(text) => handleFieldChange('address', text)}
            />
          </>
        )}

        {/* Компонент для текстового описания всегда рендерится */}
        <CustomOutlineInputText
          label={i18n.t('EditUserPoint.description')}
          value={editablePoint.description}
          handleChange={(text) => handleFieldChange('description', text)}
          numberOfLines={3}
        />

        {/* Блок удобств показывается только если это не заметка */}
        {editablePoint.userPointType !== UserPointType.Note && (
          <View>
            <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
              {i18n.t('EditUserPoint.amenities')}
            </Text>
            <CustomTagsSelector
              tags={i18n.t('tags.AMENITIES_TAGS') as string[]}
              initialSelectedTags={[]}
              maxSelectableTags={5}
              visibleTagsCount={10}
            />
          </View>
        )}

        <CustomButtonPrimary
          title={i18n.t('EditUserPoint.addButton')}
          handlePress={handleSave}
        />
        <View className="h-24" />
      </View>
    </View>
  );
};

export default EditUserPointOnMap;