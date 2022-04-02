import { createContext, ReactNode, useContext, useMemo } from 'react';
import { FieldProps } from '../types';

interface AppProviderProps {
  sdk: FieldProps['sdk'];
  cma: FieldProps['cma'];
  children: ReactNode;
}

interface AppContextValue {
  sdk: FieldProps['sdk'];
  cma: FieldProps['cma'];
}
const AppContext = createContext<AppContextValue | null>(null);

function AppProvider({ sdk, cma, children }: AppProviderProps) {
  const value = useMemo(() => ({ sdk, cma }), [sdk, cma]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function useApp() {
  const contextValue = useContext(AppContext);
  if (!contextValue) {
    throw new Error('useApp must be used in a child of AppProvider.');
  }

  return contextValue;
}

export { AppProvider, useApp };
