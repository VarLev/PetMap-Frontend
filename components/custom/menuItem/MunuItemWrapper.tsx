import React from "react";
import { View } from "react-native";
import { Menu, TouchableRipple } from "react-native-paper";

type MenuItemWrapperProps = {
    icon: any; 
    title: string; 
    onPress: () => void;
    
  };

const MenuItemWrapper: React.FC<MenuItemWrapperProps> = ({ icon, title, onPress }) => {
  return (
    <View className="overflow-hidden rounded-full">
      <TouchableRipple onPress={onPress} rippleColor="#E8DFFF" >
        <Menu.Item
          leadingIcon={icon}
          title={title}
          titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
        />
      </TouchableRipple>
    </View>
  );
};

export default MenuItemWrapper;
