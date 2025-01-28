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
       Esta sección está en desarrollo. Si eres dueño de un refugio o voluntario, escríbenos. Agregaremos información sobre ti y configuraremos un canal de comunicación para actualizar regularmente los datos de las mascotas.
      </Text>
      <Text className='text-lg self-center text-indigo-800'>info@petmap.app</Text>
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
      <Divider className="my-4" />
      <TouchableOpacity onPress={()=>router.push('profile/petShelters/mascotasenadopcion')}>
        <View className="flex-row bg-white rounded-lg shadow p-4 items-center">
          <Image source={{ uri: 'https://www.mascotasenadopcion.com/docs/logomascotasenadopcion180.jpg' }}
            className="w-20 h-20 rounded-lg mr-4"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="font-nunitoSansBold text-lg mb-1">Mascotas en Adopcion</Text>
            <Text numberOfLines={4} className="font-nunitoSansRegular text-sm mb-1">
            Mascotas en adopción se formó inicialmente con el fin de poder rescatar, rehabilitar y luego dar en adopción aquellos perros, gatos abandonados o maltratados en la zona de Del Viso, Partido de Pilar, aunque con el transcurrir del tiempo, hemos extendido nuestro trabajo abarcando Gran Buenos Aires y CABA 
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
    </View>
  );
});

export default PetShelters;