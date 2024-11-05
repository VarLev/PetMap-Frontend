import React from 'react';
import { View } from 'react-native';
import { TouchableRipple, List } from 'react-native-paper';


const CustomListItemWrapper = ({ onPress, title, leftIcon }) => {
  return (
    <View className="overflow-hidden rounded-full">
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
    </View>
  );
};

export default CustomListItemWrapper;
