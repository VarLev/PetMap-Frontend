import React from 'react';
import { Image } from 'react-native';
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import customMapIcon from "@/assets/images/logoIcon.png";

type IconProps = {
    color: string;
};

export const iconsTab: Record<string, (props: IconProps) => JSX.Element> = {
    explore: (props) => <Feather name="search" size={22} {...props} />,
    search: (props) => <Feather name="globe" size={22} {...props} />,
    map: (props) => (
      <Image
          source={customMapIcon}
          style={{ width: 28, height: 28, tintColor: props.color }} // Применяем цвет с помощью tintColor
      />
  ),
    chat: (props) => <AntDesign name="message1" size={22} {...props} />,
    profile: (props) => <Ionicons name="person-outline" size={22} {...props} />,
};