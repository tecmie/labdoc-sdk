import * as Actors from './store-actions';
import * as React from 'react';
import {
  StoreReducerAction,
  StoreState,
  initialState,
  reducer,
} from './store-actions';

// interface StoreActions {
//     setDocURL: (docURL: string) => void;
//     setNumPages: (numPages: number) => void;
//     setPDFDocument?: (doc: PDFDocumentProxy) => void;
//     setUploadedFile: (file: string) => void;
//     setDiagnosisReport: (report: [string | null, DiagnosisReport | null]) => void;
// }

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

  const value = {
    docURL: state.docURL,
    upload: state.upload,
    numPages: state.numPages,
    uploadedFile: state.uploadedFile,
    diagnosisReport: state.diagnosisReport,
    dispatch,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
