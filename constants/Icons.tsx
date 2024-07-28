import React from 'react';
import { AntDesign, Feather } from "@expo/vector-icons";

type IconProps = {
    color: string;
};

export const iconsTab: Record<string, (props: IconProps) => JSX.Element> = {
    explore: (props) => <Feather name="compass" size={24} {...props} />,
    search: (props) => <Feather name="search" size={24} {...props} />,
    map: (props) => <Feather name="map" size={24} {...props} />,
    chat: (props) => <AntDesign name="message1" size={24} {...props} />,
    profile: (props) => <AntDesign name="user" size={24} {...props} />,
};