import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import userStore from '@/stores/UserStore';
import uiStore from '@/stores/UIStore';
import { Language } from '@/dtos/enum/Language';

const StoreContext = createContext({
  ...userStore,
  isInitialized: false, // Добавляем isInitialized в начальное значение контекста
});

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try{
        const user = await userStore.getCurrentUserForProvider();
        const systemLanguage = await uiStore.getSystemLanguage();
        if (user) {
          
          if (systemLanguage !== undefined && systemLanguage !== null) 
            await uiStore.setLanguagei18n(systemLanguage as Language);
          else 
            await uiStore.setLanguagei18n(user.systemLanguage as Language);
          
        
          console.log('userStore.setLogged(true);');
          userStore.setLogged(true);
          userStore.setUser(user);
          
        } else if (user == null) {
          console.log('userStore.setLogged(true);2');
          userStore.setLogged(false);
          userStore.setUser(null);
          
        } else if (user === false){
          console.log('userStore.setLogged(true);3');
          userStore.setLogged(false);
          userStore.setUser(null);
          setIsError(true);
        }
      }catch(e)
      {
        console.log('userStore.setLogged(true);4');
        userStore.setUser(null);
        console.log(e);
      }
      finally{
        console.log('userStore.setLogged(true);5');
        userStore.setLoading(false);
        setIsInitialized(true);
      }
     
    };

    initializeUser();
  }, []);

  const storeValue = { ...userStore, isInitialized, isError }; // Объединяем userStore с isInitialized

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
