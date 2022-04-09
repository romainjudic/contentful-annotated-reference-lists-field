import { createContext, ReactNode, useContext, useMemo } from 'react';
import { FieldProps } from '../types';

interface InstanceParameters {
  textLabel?: string;
  contentTypes?: string;
}

interface AppProviderProps {
  sdk: FieldProps['sdk'];
  cma: FieldProps['cma'];
  children: ReactNode;
}

interface AppContextValue {
  sdk: FieldProps['sdk'];
  cma: FieldProps['cma'];
  textLabel: string;
  contentTypes: string[] | null;
}

const AppContext = createContext<AppContextValue | null>(null);

function AppProvider({ sdk, cma, children }: AppProviderProps) {
  const value = useMemo(() => {
    const instanceParameters = sdk.parameters.instance as InstanceParameters;
    return {
      sdk,
      cma,
      textLabel: instanceParameters.textLabel || 'Text',
      contentTypes: instanceParameters.contentTypes ? instanceParameters.contentTypes.split(/\s*,\s*/g) : null,
    };
  }, [sdk, cma]);

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
