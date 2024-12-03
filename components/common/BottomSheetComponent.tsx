import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Portal } from 'react-native-paper';


interface BottomSheetComponentProps {
  snapPoints: (number | string)[];
  renderContent: React.ReactElement | null;
  onClose?: () => void;
  enablePanDownToClose: boolean;
  initialIndex?: number;
  usePortal?: boolean; // Новый пропс для управления отображением через Portal
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetComponentProps>(
  (
    {
      snapPoints,
      renderContent,
      onClose,
      enablePanDownToClose,
      initialIndex = 0,
      usePortal = false, // Значение по умолчанию - false
    },
    ref
  ) => {
    const BottomSheetContent = (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={initialIndex}
        enablePanDownToClose={enablePanDownToClose}
        onClose={onClose}
        backgroundStyle={styles.backgroundStyle}
        handleStyle={styles.handleStyle}
      >
        <BottomSheetFlatList
          data={[]}
          keyExtractor={() => 'key'}
          renderItem={null}
          ListHeaderComponent={renderContent}
          contentContainerStyle={styles.contentContainer}
        />
        <View className='' />
      </BottomSheet>
    );

    return usePortal ? <Portal>{BottomSheetContent}</Portal> : BottomSheetContent;
  }
);

BottomSheetComponent.displayName = 'BottomSheetComponent';

const styles = StyleSheet.create({
  backgroundStyle: {
    zIndex: -10,
    elevation: 5,
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width:0, height: 0 }, // Смещение тени
    shadowOpacity: 0.4, // Прозрачность тени
    shadowRadius: 5, // Радиус размытия тени
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  handleStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  contentContainer: {
    paddingBottom: 16,
  },
});

export default BottomSheetComponent;
