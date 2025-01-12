import { TouchableOpacity, Text } from 'react-native';
import React, { FC } from 'react';

type CustomButtonPrimaryProps = {
  title?: string;
  handlePress?: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  fontWeight?: string;
};

const CustomButtonOutlined: FC<CustomButtonPrimaryProps> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  fontWeight = "font-nunitoSansRegular"
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={isLoading}
      className={`bg-violet-200 rounded-full min-h-[40px] justify-center items-center mt-2
      ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
    >
      <Text className={`text-gray-900 text-base ${textStyles} ${fontWeight}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButtonOutlined;
