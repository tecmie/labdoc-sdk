/**
 * @param {State} draft
 * @param {Action} action
 * @returns {void}
 */
/* eslint-disable  no-param-reassign */
import { produce } from 'immer';
import { PDFDocumentProxy } from 'pdfjs-dist';

export enum ActionType {
  SET_UPLOADED_FILE = 'SET_UPLOADED_FILE',
  SCAN_AI = 'SCAN_AI',
  SET_DOC_URL = 'SET_DOC_URL',
  SET_NUM_PAGES = 'SET_NUM_PAGES',
}

export interface DiagnosisReport {
  [key: string]: any;
  ReportLines: string[];
  Summary: string;
}

// interface State {
//   upload: PDFDocumentProxy | null;
//   uploadedFile: PDFDocumentProxy | null;
//   diagnosisReport: any;
//   numPages: number;
//   docURL: string;
// }

export interface StoreState {
  upload: PDFDocumentProxy | null;
  uploadedFile: PDFDocumentProxy | null;
  diagnosisReport: any;
  numPages: number;
  docURL: string;
  // docURL: string;
  // uploadedFile: string;
  // diagnosisReport: [string | null, DiagnosisReport | null];
  // numPages: number;
  // upload?: PDFDocumentProxy;
}

export type StoreReducerAction =
  | { type: ActionType.SET_UPLOADED_FILE; payload: PDFDocumentProxy }
  | { type: ActionType.SCAN_AI; payload: any }
  | { type: ActionType.SET_DOC_URL; payload: string }
  | { type: ActionType.SET_NUM_PAGES; payload: number };

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
      case ActionType.SET_UPLOADED_FILE:
        draft.upload = action.payload;
        draft.uploadedFile = action.payload;
        break;
      case ActionType.SCAN_AI:
        draft.diagnosisReport = action.payload;
        break;
      case ActionType.SET_DOC_URL:
        draft.numPages = 0;
        draft.docURL = action.payload;
        break;
      case ActionType.SET_NUM_PAGES:
        draft.numPages = action.payload;
        break;
      default:
        break;
    }
  }
);

const setUploadedFile = (file: PDFDocumentProxy) => ({
  type: ActionType.SET_UPLOADED_FILE,
  payload: file,
});

const scanai = (report: any) => ({
  type: ActionType.SCAN_AI,
  payload: report,
});

const setDocURL = (url: string) => ({
  type: ActionType.SET_DOC_URL,
  payload: url,
});

const setNumPages = (pages: number) => ({
  type: ActionType.SET_NUM_PAGES,
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
