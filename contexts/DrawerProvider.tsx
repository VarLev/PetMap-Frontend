import React, { createContext, useContext, useRef, ReactElement } from 'react';
import { DrawerLayoutAndroid } from 'react-native';

type DrawerContextType = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
});

export const useDrawer = () => useContext(DrawerContext);

type DrawerProviderProps = {
  children: React.ReactNode;
  renderNavigationView: () => ReactElement;
};

export const DrawerProvider = ({
  children,
  renderNavigationView,
}: DrawerProviderProps) => {
  const drawer = useRef<DrawerLayoutAndroid>(null);

  const openDrawer = () => {
    drawer.current?.openDrawer();
  };

  const closeDrawer = () => {
    drawer.current?.closeDrawer();
  };
  console.log('drawer')
  return (
    
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition="right"
        renderNavigationView={renderNavigationView}
      >
        {children}
      </DrawerLayoutAndroid>
    </DrawerContext.Provider>
  );
};
