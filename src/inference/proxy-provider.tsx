import * as React from 'react';
import { createContext, useContext } from 'react';
import { createLabProxy } from './proxy';

export const LabBaseContext = createContext(
  createLabProxy({ secretOrKey: '' })
);

type LabProviderProps = {
  children: React.ReactNode;
  customHttpLink?: string;
  secretOrKey: string;
};

export const LabProvider = ({
  secretOrKey,
  customHttpLink,
  children,
}: LabProviderProps) => {
  const proxy = createLabProxy({ secretOrKey, customHttpLink });

  return (
    <LabBaseContext.Provider value={proxy}>{children}</LabBaseContext.Provider>
  );
};

export const useIn = () => {
  const context = useContext(LabBaseContext);

  if (!context) {
    throw new Error('useScanner must be used within a LabProvider');
  }

  return context;
};
