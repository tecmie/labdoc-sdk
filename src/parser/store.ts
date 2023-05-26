/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-param-reassign */

import { PDFDocumentProxy } from 'pdfjs-dist';
import { createStore as create } from 'zustand/vanilla';
import { immer } from 'zustand/middleware/immer';

export interface FileDropzoneProps {
  lastModified: number;
  name: string;
  path: string;
  size: number;
  type: string;
}

export interface DiagnosisReport {
  [key: string]: any;
  ReportLines: string[];
  Summary: string;
}

type State = {
  /**  tuple of diagnosis report and the report object */
  diagnosisReport: [null | string, DiagnosisReport | null];
  docURL: string;
  numPages: number;
  scanOp: Record<string, any>;
  upload?: PDFDocumentProxy;
};

type Actions = {
  scanai: (input: any) => void;
  setDocURL: (url: string) => void;
  setNumPages: (pages: number) => void;
  setPDFDocument?: (doc: PDFDocumentProxy) => void;
  setUploadedFile: (file: PDFDocumentProxy) => void;
};

export type DocumentStore = State & Actions;

export const store = create<DocumentStore>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  immer((set) => ({
    docURL: 'url://to/pdf/file.pdf',
    numPages: 0,
    diagnosisReport: [null, {} as DiagnosisReport],
    upload: undefined,
    currentStep: 0,
    scanOp: {
      status: 'idle',
      isError: false,
      error: null,
      isSucces: false,
      isLoading: false,
    },
    setUploadedFile: (file: PDFDocumentProxy) =>
      set((state) => {
        state.upload = file as any;
      }),
    scanai: (report: any) => {
      try {
        set((state) => {
          state.diagnosisReport = report;
          // console.log({ "[from__store]": state.diagnosisReport });

          /* reset out workflow steps: DISABLED */
          // state.currentStep = 0;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    setDocURL: (url: string) =>
      set((state) => {
        /* Initialize our pages as 0 */
        state.numPages = 0;

        /* Set the document URL */
        state.docURL = url;
      }),
    setNumPages: (pages: number) =>
      set((state) => {
        state.numPages = pages;
      }),
  }))
);



// export const pages = store((state: { numPages: any; }) => state.numPages);
// export const pages = store.getState().numPages;
