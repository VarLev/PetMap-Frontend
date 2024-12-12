import React, { useEffect, useState } from "react";
import { View, Pressable, Platform } from "react-native";
import { Menu, TouchableRipple } from "react-native-paper";

type MenuItemWrapperProps = {
  icon?: any;
  title: string;
  onPress: () => void;
};

const MenuItemWrapper: React.FC<MenuItemWrapperProps> = ({
  icon,
  title,
  onPress,
}) => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(Platform.OS === 'ios');
  }, [])
    
  return (
    <View className="overflow-hidden rounded-full">
      {!isIOS ? (
        <TouchableRipple onPress={onPress} rippleColor="#E8DFFF">
          <Menu.Item
            leadingIcon={icon}
            title={title}
            titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
          />
        </TouchableRipple>
      ) : (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#E8DFFF" : "white",
              paddingLeft: 10,
            },
          ]}
        >
          <Menu.Item
            leadingIcon={icon}
            title={title}
            titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
          />
        </Pressable>
      )}
    </View>
  );
};

export default MenuItemWrapper;
