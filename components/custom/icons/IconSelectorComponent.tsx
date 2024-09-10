import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconComponentProps {
  iconSet: 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'MaterialCommunityIcons';
  iconName: string;
  size?: number;
}

const IconSelectorComponent: React.FC<IconComponentProps> = ({
  iconSet,
  iconName,
  size = 20, // Размер по умолчанию 20
}) => {
  switch (iconSet) {
    case 'FontAwesome':
      return <FontAwesome name={iconName} size={size} />;
    case 'Ionicons':
      return <Ionicons name={iconName} size={size} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={iconName} size={size} />;
    case 'MaterialIcons':
    default:
      return <MaterialIcons name={iconName} size={size} />;
  }
};

export default IconSelectorComponent;
