import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image } from 'react-native';
import { Divider } from 'react-native-paper';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';

const PetShelters = observer(() => {

  return (
    <View className="flex-1 p-4 ">
      <Text className='font-nunitoSansRegular text-center mb-6'>
        Этот раздел находится в разработке. Если вы владелец приюта или волонтёр, напишите нам — мы добавим информацию о вас и настроим канал связи для регулярного обновления данных о питомцах.
      </Text>
      <Divider className="mb-4" />
      {/* Карточка приюта */}
      <TouchableOpacity onPress={()=>router.push('profile/petShelters/ayudacan')}>
        <View className="flex-row bg-white rounded-lg shadow p-4 items-center">
          <Image source={{ uri: 'https://www.idealist.org/images/no_metadata/output=format:webp/resize=w:180,h:128,fit:max/quality=value:70/compress/cache=expiry:max/LjwDRhQqRqqG62Tak5pI' }}
            className="w-20 h-20 rounded-lg mr-4"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="font-nunitoSansBold text-lg mb-1">AyudaCan A.C.</Text>
            <Text numberOfLines={4} className="font-nunitoSansRegular text-sm mb-1">
            Ayudacan promueve la adopción responsable de animales, especializándose en perros que necesitan un proceso de sociabilización antes de su incorporación a una nueva familia. 
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
    </View>
  );
});

export default PetShelters;