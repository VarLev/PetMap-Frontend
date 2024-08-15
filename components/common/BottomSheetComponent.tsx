import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface BottomSheetComponentProps {
  snapPoints: (number | string)[];
  renderContent: () => React.ReactNode;
  onClose?: () => void;
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetComponentProps>(
  ({ snapPoints, renderContent, onClose }, ref) => {
    return (
      <BottomSheet 
        ref={ref}
        snapPoints={snapPoints}
        style={styles.bottomSheetContainer}
        enablePanDownToClose={true}
        onClose={onClose}
        backgroundStyle={{ backgroundColor: '#e5e5e5' }}
      >
        <BottomSheetScrollView>
          {renderContent()}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

BottomSheetComponent.displayName = 'BottomSheetComponent';

const styles = StyleSheet.create({
  bottomSheetContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});

export default BottomSheetComponent;
