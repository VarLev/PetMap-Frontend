import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";

type LoadingButtonProps = {
  title?: string;
  handlePress?: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomLoadingButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: LoadingButtonProps) => {
  const [loading, setLoading] = useState(false);

  const onPressHandler = async () => {
    if (handlePress) {
      setLoading(true);
      try {
        await handlePress();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={onPressHandler}
      activeOpacity={0.8}
      disabled={isLoading || loading}
      className={`bg-indigo-800 rounded-full min-h-[40px] justify-center items-center mt-2
      ${containerStyles} ${isLoading || loading ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text
          className={`text-white font-nunitoSansRegular text-base ${textStyles}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomLoadingButton;
