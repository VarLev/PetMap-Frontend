import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactElement,
  useCallback,
  useEffect,
} from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

type DrawerContextType = {
  openDrawer: (component: ReactElement) => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
});

export const useDrawer = () => useContext(DrawerContext);

type DrawerProviderProps = {
  children: React.ReactNode;
  defaultComponent?: ReactElement;
  drawerWidth?: number;
  animationDuration?: number;
};

const { width } = Dimensions.get('window');

export const DrawerProvider = ({
  children,
  defaultComponent,
  drawerWidth = 360,
  animationDuration = 300,
}: DrawerProviderProps) => {
  const [drawerComponent, setDrawerComponent] = useState<ReactElement>(
    defaultComponent || <></>
  );
  
  const translateX = useSharedValue(width);
  const isDrawerOpen = useRef(false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const setIsDrawerOpenTrue = useCallback(() => {
    isDrawerOpen.current = true;
    setDrawerOpened(true);
  }, []);

  const setIsDrawerOpenFalse = useCallback(() => {
    isDrawerOpen.current = false;
    setDrawerOpened(false);
  }, []);

  const openDrawer = useCallback((component: ReactElement) => {
    if (isDrawerOpen.current) return;
    setDrawerComponent(component);
    translateX.value = withTiming(width - drawerWidth, {
      duration: animationDuration,
    }, (finished) => {
      if (finished) {
        runOnJS(setIsDrawerOpenTrue)();
      }
    });
  }, [animationDuration, drawerWidth, setIsDrawerOpenTrue]);

  const closeDrawer = useCallback(() => {
    if (!isDrawerOpen.current) return;
    translateX.value = withTiming(width, {
      duration: animationDuration,
    }, (finished) => {
      if (finished) {
        runOnJS(setIsDrawerOpenFalse)();
      }
    });
  }, [animationDuration, setIsDrawerOpenFalse]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const nextPos = ctx.startX + event.translationX;
      if (nextPos <= width && nextPos >= width - drawerWidth) {
        translateX.value = nextPos;
      }
    },
    onEnd: () => {
      const midPoint = width - drawerWidth / 2;
      if (translateX.value < midPoint) {
        translateX.value = withTiming(width - drawerWidth, { duration: animationDuration }, (finished) => {
          if (finished) {
            runOnJS(setIsDrawerOpenTrue)();
          }
        });
      } else {
        translateX.value = withTiming(width, { duration: animationDuration }, (finished) => {
          if (finished) {
            runOnJS(setIsDrawerOpenFalse)();
          }
        });
      }
    },
  });

  // Анимируем затемнение в зависимости от положения Drawer:
  // Когда Drawer полностью закрыт (translateX = width), затемнение = 0
  // Когда Drawer полностью открыт (translateX = width - drawerWidth), затемнение = 0.5
  const overlayStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [width, width - drawerWidth],
      [0, 0.5],
      Extrapolate.CLAMP
    );
    return {
      opacity: progress,
    };
  });

  const animatedDrawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      <View style={{ flex: 1 }}>
        {children}
        
        {/* Полупрозрачный оверлей */}
        {/*
          pointerEvents: 
           - когда drawer закрыт, "none", чтобы сквозь оверлей можно было взаимодействовать с контентом
           - когда открыт, "auto", чтобы можно было тапом по оверлею закрыть Drawer
        */}
        <TouchableWithoutFeedback onPress={closeDrawer} disabled={!drawerOpened}>
          <Animated.View 
            pointerEvents={drawerOpened ? "auto" : "none"} 
            style={[StyleSheet.absoluteFillObject, { backgroundColor: 'black' }, overlayStyle]} 
          />
        </TouchableWithoutFeedback>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.drawerContainer, { width: drawerWidth }, animatedDrawerStyle]}>
            <View style={styles.drawerContent}>
              {drawerComponent}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </DrawerContext.Provider>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 5,
  },
  drawerContent: {
    flex: 1,
    padding: 16,
  },
});
