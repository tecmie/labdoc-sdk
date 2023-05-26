import { PDFDocumentProxy } from "pdfjs-dist";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface FileDropzoneProps {
  lastModified: number;
  name: string;
  path: string;
  size: number;
  type: string;
}

export interface DiagnosisReport {
  Summary: string;
  ReportLines: string[];
  [key: string]: any;
}

type State = {
  docURL: string;
  /**  tuple of diagnosis report and the report object */
  diagnosisReport: [null | string, DiagnosisReport | null];
  scanOp: Record<string, any>;
  numPages: number;
  upload: FileDropzoneProps[];
};

type Actions = {
  setUploadedFile: (file: FileDropzoneProps[]) => void;
  setDocURL: (url: string) => void;
  scanai: (input: any) => void;
  setPDFDocument?: (doc: PDFDocumentProxy) => void;
  setNumPages: (pages: number) => void;
};

export type DocumentStore = State & Actions;

export const store = create<DocumentStore>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  immer(
      (set) => ({
        docURL: "url://to/pdf/file.pdf",
        numPages: 0,
        diagnosisReport: [null, {} as DiagnosisReport],
        upload: [],
        currentStep: 0,
        scanOp: {
          status: "idle",
          isError: false,
          error: null,
          isSucces: false,
          isLoading: false,
        },
        setUploadedFile: (file: FileDropzoneProps[]) =>
          set((state) => {
            state.upload = file;
          }),
        scanai: (report: any) => {
          try {
            set((state) => {
              state.diagnosisReport = report;
              console.log({ "[from__store]": state.diagnosisReport });

              /* reset out workflow steps: DISABLED */
              // state.currentStep = 0;
            });
          } catch (error) {
            console.error(error);
          }
        },
        setDocURL: (url: string) =>
          set((state) => {
            /* Initialize our pages as 0*/
            state.numPages = 0;

            /* Set the document URL */
            state.docURL = url;
          }),
        setNumPages: (pages: number) =>
          set((state) => {
            state.numPages = pages;
          }),
      })
  )
);

const totalPages = store((state) => state.numPages);
