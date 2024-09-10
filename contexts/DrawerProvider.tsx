import React, { createContext, useContext, useRef, ReactElement, useState } from 'react';
import { DrawerLayoutAndroid } from 'react-native';

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
  defaultComponent?: () => ReactElement;
};

export const DrawerProvider = ({
  children,
  defaultComponent,
}: DrawerProviderProps) => {
  const drawer = useRef<DrawerLayoutAndroid>(null);
  const [drawerComponent, setDrawerComponent] = useState<ReactElement>(
    defaultComponent || <></>
  );
  
  const openDrawer = (component: ReactElement) => {
    setDrawerComponent(component);
    drawer.current?.openDrawer();
  };

  const closeDrawer = () => {
    drawer.current?.closeDrawer();
  };

  return (
    
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={350}
        drawerPosition="right"
        renderNavigationView={() => drawerComponent}
      >
        {children}
      </DrawerLayoutAndroid>
    </DrawerContext.Provider>
  );
};
