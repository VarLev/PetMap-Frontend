import {TouchableOpacity, Text } from 'react-native'
import React from 'react'

type CustomButtonPrimaryProps = {
  title?: string;
  handlePress?: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButtonOutlined = ({title, handlePress, containerStyles, textStyles, isLoading}: CustomButtonPrimaryProps) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={isLoading}
      className={`bg-violet-200 rounded-full min-h-[45px] justify-center items-center mt-2
      ${containerStyles} ${isLoading ? 'opacity-50':''}`}>
        <Text className={`text-gray-900 font-nunitoSansRegular text-base ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButtonOutlined