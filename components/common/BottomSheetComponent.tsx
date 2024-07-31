import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

interface BottomSheetComponentProps {
  snapPoints: (number | string)[];
  renderContent: () => React.ReactNode;
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetComponentProps>(
  ({ snapPoints, renderContent }, ref) => {
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        style={styles.bottomSheetContainer}
        enablePanDownToClose={true}
      >
        <View style={styles.contentContainer}>{renderContent()}</View>
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
