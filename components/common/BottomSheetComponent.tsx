import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

interface BottomSheetComponentProps {
  snapPoints: (number | string)[];
  renderContent: () => React.ReactNode;
  onClose?: () => void;
  enablePanDownToClose: boolean; 
  initialIndex?: number; // Добавляем пропс для начальной позиции снапшота
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetComponentProps>(
  ({ snapPoints, renderContent, onClose, enablePanDownToClose, initialIndex = 0 }, ref) => {
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={initialIndex} // Устанавливаем начальную позицию снапшота
        enablePanDownToClose={enablePanDownToClose}
        onClose={onClose}
        backgroundStyle={styles.backgroundStyle}
        handleStyle={styles.handleStyle}
      >
        <BottomSheetFlatList
          showsHorizontalScrollIndicator={true} 
          initialNumToRender={2} 
          data={[]}
          renderItem={null}
          ListHeaderComponent={renderContent}
        />
      </BottomSheet>
    );
  }
);

BottomSheetComponent.displayName = 'BottomSheetComponent';

const styles = StyleSheet.create({
  backgroundStyle: {
    zIndex: -10,
    elevation: 5,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  handleStyle: {
    backgroundColor: 'white', // Цвет ручки (если используется)
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
});

export default BottomSheetComponent;
