import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

interface BottomSheetComponentProps {
  snapPoints: (number | string)[];
  renderContent: React.ReactElement | null;
  onClose?: () => void;
  enablePanDownToClose: boolean;
  initialIndex?: number;
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetComponentProps>(
  (
    { snapPoints, renderContent, onClose, enablePanDownToClose, initialIndex = 0 },
    ref
  ) => {
    return (
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
    backgroundColor: 'white',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  contentContainer: {
    paddingBottom: 16,
  },
});

export default BottomSheetComponent;
