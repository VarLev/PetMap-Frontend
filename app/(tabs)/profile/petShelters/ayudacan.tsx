import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image, ScrollView, Linking } from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const AyudacanShelter = observer(() => {
  // Пример массива фотографий приюта
  const galleryImages = [
    'https://lh3.googleusercontent.com/p/AF1QipM7tJUaC5q1Rd1hYLt6RqHpuiiNO9UdLpKnZ5hv=s1600-h380',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0aF1PKP8va3cOM2OMCrZrk6x55EUtX6zFpg&s',
    'https://mir-s3-cdn-cf.behance.net/projects/404/342093166382527.Y3JvcCwxNTg1LDEyNDAsMTEzLDA.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/SedeAyudacan.jpg/640px-SedeAyudacan.jpg',
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Шапка приюта */}
      <View className="flex-row p-4 bg-white shadow">
        <Image
          source={{
            uri: 'https://www.idealist.org/images/no_metadata/output=format:webp/resize=w:180,h:128,fit:max/quality=value:70/compress/cache=expiry:max/LjwDRhQqRqqG62Tak5pI',
          }}
          className="w-24 h-24 rounded-lg mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="font-nunitoSansBold text-2xl text-center mb-2">AyudaCan A.C.</Text>
          <Text className="font-nunitoSansRegular text-base text-center text-gray-700">
            «Promoviendo la adopción responsable de animales»
          </Text>
        </View>
      </View>

      {/* Основной блок с описанием и фотографией */}
      <View className="bg-white p-4">
        <Text className="font-nunitoSansBold text-lg mb-2">Descripción</Text>
        <Text className="font-nunitoSansRegular text-sm text-gray-700 ">
          Ayudacan promueve la adopción responsable de animales, especializándose en perros que necesitan un proceso de sociabilización
          antes de su incorporación a una nueva familia. Ayudacan no es un refugio de animales convencional; nuestro principal propósito es
          mejorar la relación entre el ser humano y los animales domésticos, prevenir el abandono y erradicar el maltrato y los actos de
          crueldad, ofreciéndonos como un ámbito de reflexión, instrucción y guía. También elaboramos y presentamos proyectos de legislación
          ante las autoridades correspondientes para la creación de un Registro de Tenedores Responsables de Animales, y realizamos charlas
          gratuitas para entidades educativas y para el público en general, sobre la importancia del cuidado de los animales de compañía y
          sobre las formas, modos y tiempos en los que debe establecerse sanamente la convivencia humano-animal.
        </Text>
      </View>


      {/* Фотогалерея приюта */}
      <View className="bg-white p-4">
        <Text className="font-nunitoSansBold text-lg mb-2">Galería de Fotos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {galleryImages.map((imgUri, index) => (
            <Image key={index} source={{ uri: imgUri }} className="w-32 h-32 rounded-lg mr-2" resizeMode="cover" />
          ))}
        </ScrollView>
      </View>

     
      {/* Контакты */}
      <View className="bg-white p-4 mb-4">
        <Text className="font-nunitoSansBold text-lg mb-2">Contacto</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://linktr.ee/ayudacan'); 
          }}
          className="mt-4 bg-blue-600 p-3 rounded-lg"
        >
          <View className='flex-row content-center gap-2'>
            <Ionicons name="link-outline" size={30}  />
            <Text className="font-nunitoSansRegular text-lg mb-2">linktr</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="h-36"></View>
    </ScrollView>
  );
});

export default AyudacanShelter;
