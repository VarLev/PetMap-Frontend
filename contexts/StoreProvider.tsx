import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';



const StoreContext = createContext(userStore);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  
  useEffect(() => {
    userStore.getCurrentUser().then((res) => {
      if (res) {
        userStore.setLogged(true);
        userStore.setUser(res);
        console.log('User logined');
      } else {
        userStore.setLogged(false);
        userStore.setUser(null);
        console.log('User not logined');
        userStore.signOut();
      }
    }).catch((error) => {
      console.log(error);
    })
    .finally(() => {
      userStore.setLoading(false);
    });
  }, []);

  return (
    <StoreContext.Provider value={userStore}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export default observer(StoreProvider);