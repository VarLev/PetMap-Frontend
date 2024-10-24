import React, { forwardRef } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Portal } from 'react-native-paper';


interface SlidingSheetComponentProps {
  snapPoints: (number | string)[];
  renderContent: React.ReactElement | null;
  onClose?: () => void;
  enablePanDownToClose: boolean;
  initialIndex?: number;
  usePortal?: boolean;
  appearanceSide?: 'top' | 'bottom';
  zIndex?: number;
}

const SlidingSheetComponent = forwardRef<BottomSheet, SlidingSheetComponentProps>(
  (
    {
      snapPoints,
      renderContent,
      onClose,
      enablePanDownToClose,
      initialIndex = 0,
      usePortal = false,
      appearanceSide = 'bottom',
      zIndex = 1,
    },
    ref
  ) => {
    // Динамические стили для позиции
    const sheetPositionStyle: ViewStyle = appearanceSide === 'top'
      ? { position: 'absolute', top: 0, left: 0, right: 0 }
      : { position: 'absolute', bottom: 0, left: 0, right: 0 };

    // Объединяем стили с помощью flatten
    const backgroundStyle = StyleSheet.flatten([styles.backgroundStyle, sheetPositionStyle]);

    const SlidingSheetContent = (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={initialIndex}
        enablePanDownToClose={enablePanDownToClose}
        onClose={onClose}
        backgroundStyle={backgroundStyle} // Применяем объединённые стили
        handleStyle={styles.handleStyle}
      >
        <BottomSheetFlatList
          data={[]}
          keyExtractor={() => 'key'}
          renderItem={null}
          ListHeaderComponent={renderContent}
          contentContainerStyle={styles.contentContainer}
        />
        <View />
      </BottomSheet>
    );

    return usePortal ? <Portal>{SlidingSheetContent}</Portal> : SlidingSheetContent;
  }
);

SlidingSheetComponent.displayName = 'SlidingSheetComponent';

const styles = StyleSheet.create({
  backgroundStyle: {
    elevation: 5,
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

export default SlidingSheetComponent;
