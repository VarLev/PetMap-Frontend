import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, Image, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MascotasenadopcionShelter = observer(() => {
  const [isTextCollapsed, setIsTextCollapsed] = useState(true);

  const toggleText = () => {
    setIsTextCollapsed(!isTextCollapsed);
  };

  const galleryImages = [
    'https://cmsphoto.ww-cdn.com/superstatic/528641/art/default/85734567-61076873.jpg?v=1737413581&force_webp=1',
    'https://cmsphoto.ww-cdn.com/superstatic/528641/art/default/13123810-60441696.jpg?v=1733175624&force_webp=1',
    'https://cmsphoto.ww-cdn.com/superstatic/528641/art/default/85208401-60768292.jpg?v=1735433599&force_webp=1',
    'https://cmsphoto.ww-cdn.com/superstatic/528641/art/default/10503002-17244153.jpg?v=1478033623&force_webp=1',
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Шапка приюта */}
      <View className="flex-row p-4 bg-white shadow">
        <Image
          source={{
            uri: 'https://www.mascotasenadopcion.com/docs/logomascotasenadopcion180.jpg',
          }}
          className="w-24 h-24 rounded-lg mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="font-nunitoSansBold text-2xl text-center mb-2">Mascotas en Adopcion</Text>
          <Text className="font-nunitoSansRegular text-base text-center text-gray-700">Encontrar una mascota para adoptar</Text>
        </View>
      </View>

      {/* Основной блок с текстом и кнопкой для сворачивания */}
      <View className="p-4 bg-white">
       
        <>
            <Text className="text-xl font-bold mb-4">CANTIDAD DE ADOPCIONES</Text>
            <Text className="mb-4">
              A lo largo de más de veinticinco años de funcionamiento, nos enorgullece haber encontrado hogar a más de
              30.000 perros y a más de 7.500 gatos, incluyendo tanto a adultos como cachorros. El promedio de
              adopciones es de 50 perros y de 15 gatos por mes.
            </Text>

          </>
          <TouchableOpacity onPress={toggleText} className="mb-4 flex-row items-center">
          <Text className="text-xl font-bold">
            {isTextCollapsed ? 'Expandir' : 'Colapsar'}
          </Text>
          <Ionicons
            name={isTextCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'}
            size={24}
            className="ml-2"
          />
        </TouchableOpacity>
        {!isTextCollapsed && (
          <>
           <Text className="text-xl font-bold mb-4">NUESTRA HISTORIA</Text>
           <Text className="mb-4">
             Mascotas en adopción se formó inicialmente con el fin de poder rescatar, rehabilitar y luego dar en adopción
             aquellos perros, gatos abandonados o maltratados en la zona de Del Viso, Partido de Pilar, aunque con el
             transcurrir del tiempo, hemos extendido nuestro trabajo abarcando Gran Buenos Aires y CABA.
           </Text>
     
           <Text className="text-xl font-bold mb-4">NO TENEMOS UN LUGAR FÍSICO PROPIO</Text>
           <Text className="mb-4">
             Utilizamos distintos pensionados que se abonan por día hasta que se adopta el animal. Tenemos en este momento
             más de 80 animales adultos y cachorros (entre perros y gatos) que esperan encontrar un hogar donde se los trate
             con respeto y responsabilidad.
           </Text>
     
           <Text className="text-xl font-bold mb-4">FORMA DE TRABAJO</Text>
           <Text className="text-lg font-semibold mb-2">PASO 1 – Rescate y recuperación</Text>
           <Text className="mb-4">
             Se trata de hacer todo lo posible para dar asilo a la mayor cantidad de animales posible, por un tema de espacio
             y de presupuesto, no siempre es factible.
             {"\n"}Una vez que el animal es rescatado, se le realiza un control veterinario para conocer en qué estado se
             encuentra, se vacuna y desparasita. Paso seguido, se fija fecha para su castración.
           </Text>
     
           <Text className="text-lg font-semibold mb-2">PASO 2 – Difusión</Text>
           <Text className="mb-4">
             Una vez efectuada la castración, se observa su temperamento, comportamiento e interacción con otros animales y
             humanos. Luego de un minucioso diagnóstico se determina cuál sería su función en un hogar adoptivo: la de animal
             de compañía, guardia o alerta y qué tipo de ambiente sería ideal para el mismo.
           </Text>
     
           <Text className="text-lg font-semibold mb-2">PASO 3 – Puesta en adopción</Text>
           <Text className="mb-4">
             Luego de haber sido evaluado su temperamento, se publican fotos en diferentes medios de comunicación.
           </Text>
     
           <Text className="text-lg font-semibold mb-2">PASO 4 – Entrevistas</Text>
           <Text className="mb-4">
             Se entrevista a los posibles candidatos para cada adopción. Para poder adoptar es necesario ser mayor de edad y
             acreditar su identidad mediante la presentación del documento de identidad.
           </Text>
     
           <Text className="text-lg font-semibold mb-2">PASO 5 – Seguimientos</Text>
           <Text className="mb-4">
             Cada animal se entrega en adopción con una chapa identificadora que tiene números de contacto del grupo y un
             número que corresponde al animal adoptado.
           </Text>
     
           <Text className="text-xl font-bold mb-4">CONDICIONES DE ENTREGA DE LOS ANIMALES</Text>
           <Text className="mb-4">
             Todos los animales se entregan vacunados y desparasitados con certificado avalado por un veterinario y, si son
             adultos esterilizados. También se entregan con collar, chapita identificatoria y correa. No pedimos ningún tipo
             de remuneración por cada animal que entregamos en adopción.
           </Text>
           </>
        )}
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
            Linking.openURL('https://www.mascotasenadopcion.com/');
          }}
          className="mt-4 bg-violet-300 p-3 rounded-lg"
        >
          <View className="flex-row content-center gap-2">
            <Ionicons name="link-outline" size={30} />
            <Text className="font-nunitoSansRegular text-lg mb-2">linktr</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="h-36"></View>
    </ScrollView>
  );
});

export default MascotasenadopcionShelter;
