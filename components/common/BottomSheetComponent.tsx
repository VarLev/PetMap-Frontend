import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

interface BottomSheetComponentProps {
  snapPoints: (number | string)[];
  renderContent: () => React.ReactNode;
  onClose?: () => void;
  enablePanDownToClose: boolean;
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetComponentProps>(
  ({ snapPoints, renderContent, onClose, enablePanDownToClose }, ref) => {
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onClose={onClose}
        backgroundStyle={styles.backgroundStyle}
        handleStyle={styles.handleStyle}
      >
        <BottomSheetFlatList
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

    backgroundColor: 'white',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  handleStyle: {
   
    backgroundColor: 'white', // Цвет ручки (если используется)
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
});

export default BottomSheetComponent;
