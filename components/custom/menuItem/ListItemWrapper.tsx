import React from 'react';
import { View, Pressable, Platform, GestureResponderEvent  } from 'react-native';
import { TouchableRipple, List } from 'react-native-paper';


interface CustomListItemWrapperProps {
  onPress: (event: GestureResponderEvent) => void; 
  title: string; 
  leftIcon?: (props: any) => JSX.Element; 
}


const CustomListItemWrapper: React.FC<CustomListItemWrapperProps> = ({ onPress, title, leftIcon }) => {

  const isIOS = Platform.OS === 'ios';

  return (
    <>
 <View className="overflow-hidden rounded-full">
    { !isIOS ? (
      <TouchableRipple
        onPress={onPress}
        rippleColor="#E8DFFF"
        className="pl-2"
      >
        <List.Item
          title={title}
          left={leftIcon}
          titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
        />
      </TouchableRipple>   
    ) : 
    (  
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#E8DFFF' : 'white',
           paddingLeft: 10           
          },
        ]}
        >
        <List.Item
          title={title}
          left={leftIcon}
          titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
        />
      </Pressable>
    )}
    </View>
</>
  );
};

export default CustomListItemWrapper;
