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
      className={`bg-white rounded-full min-h-[55px] justify-center items-center mt-3 border border-gray-300 shadow shadow-black
      ${containerStyles} ${isLoading ? 'opacity-50':''}`}>
        <Text className={`text-gray-900 font-psemi text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButtonOutlined