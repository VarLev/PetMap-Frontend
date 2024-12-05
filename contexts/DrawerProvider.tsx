import React, { createContext, useContext, useRef, useState, ReactElement } from 'react';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { View, StyleSheet } from 'react-native';

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
};

export const DrawerProvider = ({ children, defaultComponent }: DrawerProviderProps) => {
  const drawerRef = useRef<any>(null);
  const [drawerComponent, setDrawerComponent] = useState<ReactElement>(
    defaultComponent || <></>
  );
  const isDrawerOpen = useRef(false);

  const openDrawer = (component: ReactElement) => {
    if (isDrawerOpen.current) return;
    setDrawerComponent(component);
    drawerRef.current?.openDrawer();
  };

  const closeDrawer = () => {
    
    //if (!isDrawerOpen.current) return;
    console.log('closeDrawer');
    drawerRef.current?.closeDrawer();
  };

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={350}
        drawerPosition="right"
        onDrawerOpen={() => (isDrawerOpen.current = true)}
        onDrawerClose={() => (isDrawerOpen.current = false)}
        renderNavigationView={() => (
          <View style={styles.drawerContent}>{drawerComponent}</View>
        )}
      >
        {children}
      </DrawerLayout>
    </DrawerContext.Provider>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
});