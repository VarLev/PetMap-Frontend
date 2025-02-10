import React, { FC } from 'react';
import { View } from 'react-native';
import PermissionsRequestComponent from '@/components/auth/PermissionsRequestComponent';
import PetsGrid from '@/components/search/PetsGrid';

// Тип пропов для NewsScreen
interface NewsScreenProps {
  setSwipeEnabled: (enabled: boolean) => void;
}

const NewsScreen: FC<NewsScreenProps> = ({ setSwipeEnabled }) => {
  return (
    <View className="flex-1 bg-white">
      <PermissionsRequestComponent />
      {/* <NewsWebView setSwipeEnabled={setSwipeEnabled} /> */}
      <PetsGrid />
    </View>
  );
};

export default NewsScreen;
