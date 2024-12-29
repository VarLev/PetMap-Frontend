import { FC, forwardRef, ReactElement } from 'react';
import { ListRenderItem, RefreshControlProps, StyleSheet, View, ViewStyle } from 'react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import { Portal } from 'react-native-paper';
import { AnimatedStyle, SharedValue } from 'react-native-reanimated';
import { StyleProp } from 'react-native';


interface BottomSheetComponentProps {
  snapPoints: (number | string)[];
  renderContent: ReactElement | null;
  onClose?: () => void;
  enablePanDownToClose: boolean;
  initialIndex?: number;
  usePortal?: boolean; // Новый пропс для управления отображением через Portal
  footerComponent?: FC<BottomSheetFooterProps> | undefined;
  handleHeight?: number;
  enableFooterMarginAdjustment?: boolean;
  flatListData?: ArrayLike<any> | SharedValue<ArrayLike<any> | null | undefined> | null | undefined;
  flatListRenderItem?: ListRenderItem<any> | SharedValue<ListRenderItem<any> | null | undefined> | null | undefined;
  contentStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
  refreshControl?: ReactElement<RefreshControlProps>;
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
      footerComponent,
      handleHeight,
      enableFooterMarginAdjustment,
      flatListData,
      flatListRenderItem,
      contentStyle,
      refreshControl 
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
        footerComponent={footerComponent}
        handleHeight={handleHeight}
        
      >
        <BottomSheetFlatList
          style={contentStyle}
          enableFooterMarginAdjustment={enableFooterMarginAdjustment} // передаём true, если используем footerComponent
          data={flatListData} // передаём, если используем flatlist
          keyExtractor={(_, index) => index.toString()}
          renderItem={flatListRenderItem} // передаём, если используем flatlist
          ListHeaderComponent={renderContent}
          contentContainerStyle={styles.contentContainer}
          refreshControl={refreshControl}
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
