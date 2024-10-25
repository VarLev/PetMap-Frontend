import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

interface IconComponentProps {
  iconSet: 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'MaterialCommunityIcons' | 'SimpleLine';
  iconName: string;
  size?: number;
  color?: string
}

const IconSelectorComponent: React.FC<IconComponentProps> = ({
  iconSet,
  iconName,
  size = 20, // Размер по умолчанию 20
  color = 'black' // Цвет по умолчанию черный
}) => {
  switch (iconSet) {
    case 'FontAwesome':
      return <FontAwesome name={iconName} size={size} color={color} />;
    case 'Ionicons':
      return <Ionicons name={iconName} size={size} color={color}/>;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    case 'SimpleLine':
        return <SimpleLineIcons name={iconName} size={size} color={color} />;
    case 'MaterialIcons':
    default:
      return <MaterialIcons name={iconName} size={size} color={color} />;
  }
};

export default IconSelectorComponent;
