import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import userStore from '@/stores/UserStore';

const StoreContext = createContext({
  ...userStore,
  isInitialized: false, // Добавляем isInitialized в начальное значение контекста
});

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try{
        const user = await userStore.getCurrentUserForProvider();
        if (user) {
          userStore.setLogged(true);
          userStore.setUser(user);
          
        } else {
          userStore.setLogged(false);
          userStore.setUser(null);
          
        }
        userStore.setLoading(false);
      }catch(e)
      {
        userStore.setUser(null);
        console.log(e);
      }
      finally{
        userStore.setLoading(false);
        setIsInitialized(true);
      }
     
    };

    initializeUser();
  }, []);

  const storeValue = { ...userStore, isInitialized }; // Объединяем userStore с isInitialized

  return (
    <StoreContext.Provider value={storeValue}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
