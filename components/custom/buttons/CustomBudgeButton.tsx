import React from 'react';
import { View } from 'react-native';
import { IconButton, Badge } from 'react-native-paper';
import IconSelectorComponent from '../icons/IconSelectorComponent';


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
    <View className="relative">
      <IconButton
        icon={() => <IconSelectorComponent iconSet={iconSet} iconName={iconName} />}
        onPress={onPress}
        className="bg-white w-11 h-11 rounded-full"
        size={40}
      />
      {badgeCount > 0 && (
        <Badge
          className="absolute top-1 right-0 bg-purple-300 border-white  border-[3px]"
          size={20}
        >
          {badgeCount}
        </Badge>
      )}
    </View>
  );
};

export default BadgeIconButton;
