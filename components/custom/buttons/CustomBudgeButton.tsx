import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper';
import IconSelectorComponent from '../icons/IconSelectorComponent';
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
        
        <View className="bg-white m-1 justify-center items-center w-11 h-11 rounded-full" style={[styles.shadow, { elevation: 3 }]}>
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
const styles = StyleSheet.create({
  shadow: {
    // iOS тени
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 1 }, // Смещение тени
    shadowOpacity: 0.3, // Прозрачность тени
    shadowRadius: 1.5, // Радиус размытия

    // Android тени через elevation
    elevation: 3,
  },
});
export default BadgeIconButton;
