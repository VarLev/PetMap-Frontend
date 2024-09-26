import React from 'react';
import { View } from 'react-native';
import { IconButton, Badge, TouchableRipple } from 'react-native-paper';
import IconSelectorComponent from '../icons/IconSelectorComponent';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { TouchableOpacity } from '@gorhom/bottom-sheet';


interface BadgeIconButtonProps {
  iconSet: 'Ionicons' | 'FontAwesome' | 'MaterialIcons' | 'MaterialCommunityIcons';
  iconName: string;
  badgeCount: number;
  onPress: () => void;
}

const BadgeIconButton: React.FC<BadgeIconButtonProps> = ({
  iconSet,
  iconName,
  badgeCount,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}  >
      <View className="relative">
        {/* <IconButton
          icon={() => <IconSelectorComponent iconSet={iconSet} iconName={iconName}  />}
          onPress={onPress}
          className="bg-white w-11 h-11 rounded-full" 
          size={40}
        /> */}
        
        <View className="bg-white m-1 justify-center items-center w-11 h-11 rounded-full" style={{elevation: 3}}>
          <IconSelectorComponent iconSet={iconSet} iconName={iconName}  />
        </View>
      
        {badgeCount > 0 && (
          <Badge
            className="absolute top-1 right-0 bg-purple-300 border-white  border-[3px]"
            size={20}
          >
            {badgeCount}
          </Badge>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BadgeIconButton;
