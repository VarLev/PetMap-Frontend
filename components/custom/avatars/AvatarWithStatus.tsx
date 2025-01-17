import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';

interface AvatarWithStatusProps {
  imageUrl?: string;
  isOnline?: boolean;
  onPress: () => void;
}

const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({
  imageUrl,
  isOnline,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} className="relative">
      <Image
        source={{
          uri: imageUrl ?? 'https://avatar.iran.liara.run/public',
        }}
        className="rounded-xl h-16 w-16"
      />
      {/* Цветной кружочек в правом нижнем углу */}
      <View
        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
          isOnline ? 'bg-emerald-400' : 'bg-gray-400'
        }`}
      />
    </TouchableOpacity>
  );
};

export default AvatarWithStatus;