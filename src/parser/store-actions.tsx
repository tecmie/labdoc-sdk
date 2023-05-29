/**
 * @param {State} draft
 * @param {Action} action
 * @returns {void}
 */
/* eslint-disable  no-param-reassign */
import { produce } from 'immer';
import { PDFDocumentProxy } from 'pdfjs-dist';

// eslint-disable-next-line no-shadow
export enum ContextStoreActions {
  SCAN_AI = 'SCAN_AI',
  SET_DOC_URL = 'SET_DOC_URL',
  SET_NUM_PAGES = 'SET_NUM_PAGES',
  SET_UPLOADED_FILE = 'SET_UPLOADED_FILE',
}

export interface DiagnosisReport {
  [key: string]: any;
  ReportLines: string[];
  Summary: string;
}

export interface StoreState {
  diagnosisReport: any;
  docURL: string;
  numPages: number;
  upload: PDFDocumentProxy | null;
  uploadedFile: PDFDocumentProxy | null;
}

export type StoreReducerAction =
  | { payload: PDFDocumentProxy; type: ContextStoreActions.SET_UPLOADED_FILE }
  | { payload: any; type: ContextStoreActions.SCAN_AI }
  | { payload: string; type: ContextStoreActions.SET_DOC_URL }
  | { payload: number; type: ContextStoreActions.SET_NUM_PAGES };

/**
 * @name initialState
 * @type {State}
 */
const initialState: StoreState = {
  upload: null,
  uploadedFile: null,
  diagnosisReport: null,
  numPages: 0,
  docURL: '',
};

type TReducer = (state: StoreState, action: StoreReducerAction) => StoreState;

const reducer: TReducer = produce(
  (draft: StoreState, action: StoreReducerAction) => {
    switch (action.type) {
      case ContextStoreActions.SET_UPLOADED_FILE:
        draft.upload = action.payload;
        draft.uploadedFile = action.payload;
        break;
      case ContextStoreActions.SCAN_AI:
        draft.diagnosisReport = action.payload;
        break;
      case ContextStoreActions.SET_DOC_URL:
        draft.numPages = 0;
        draft.docURL = action.payload;
        break;
      case ContextStoreActions.SET_NUM_PAGES:
        draft.numPages = action.payload;
        break;
      default:
        break;
    }
  }
);

const setUploadedFile = (file: PDFDocumentProxy) => ({
  type: ContextStoreActions.SET_UPLOADED_FILE,
  payload: file,
});

const scanai = (report: any) => ({
  type: ContextStoreActions.SCAN_AI,
  payload: report,
});

const setDocURL = (url: string) => ({
  type: ContextStoreActions.SET_DOC_URL,
  payload: url,
});

const setNumPages = (pages: number) => ({
  type: ContextStoreActions.SET_NUM_PAGES,
  payload: pages,
});

export {
  initialState,
  reducer,
  setUploadedFile,
  scanai,
  setDocURL,
  setNumPages,
};
