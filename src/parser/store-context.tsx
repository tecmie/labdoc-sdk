import * as React from 'react';
import * as Actors from './store-actions';
import {
  StoreReducerAction,
  StoreState,
  initialState,
  reducer,
} from './store-actions';

interface StoreContextValue extends StoreState {
  dispatch: React.Dispatch<StoreReducerAction>;
}

export const StoreContext = React.createContext<StoreContextValue>({
  ...Actors.initialState,
  dispatch: () => {},
});

export const useStoreContext = () => React.useContext(StoreContext);

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value = React.useMemo(
    () => ({
      docURL: state.docURL,
      upload: state.upload,
      numPages: state.numPages,
      uploadedFile: state.uploadedFile,
      diagnosisReport: state.diagnosisReport,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
