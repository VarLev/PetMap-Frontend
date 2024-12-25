import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';




function CustomPlug({text}) {

    const { width, height } = Dimensions.get("window");


    return ( 
        <View className="flex-1 justify-center items-center">
            <View className="items-center">
              {/* Картинка */}
              <Image
                style={{ width: width, height: height * 0.6 }}
                resizeMode="contain"
                source={require("@/assets/images/filterPlug.png")}
              />
              {/* Текстовые надписи */}
              <View className="items-center mt-2">
                <Text className="text-xl font-nunitoSansBold">{text}</Text>    

               </View>
            </View>
          </View>
     );
}

export default CustomPlug;