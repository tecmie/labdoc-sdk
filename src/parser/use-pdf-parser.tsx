/* eslint-disable no-console */
import React, { useEffect } from 'react';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { usePdf } from './use-pdf';
import { useStoreContext } from './store-context';
import { ContextStoreActions as ActionType } from './store-actions';

export interface UseFileUploadOptions {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export interface UsePDFParserReturn {
  document: PDFDocumentProxy;
  documentURL: string;
  executeUpload: (uploadedFile: string) => void;
  parsePageText: (pageNumber: number) => Promise<string | undefined>;
  pdfPage?: PDFPageProxy;
}

export function usePDFParser({
  canvasRef,
}: UseFileUploadOptions): UsePDFParserReturn {
  // const docURL = store((state) => state.docURL);
  // const setDocURL = store((state) => state.setDocURL);
  // const setNumpages = store((state) => state.setNumPages);

  // const setUploadedFile = store((state) => state.setUploadedFile);

  const { dispatch, docURL } = useStoreContext();
  // const docURL = store.getState().docURL
  // const setDocURL = store.getState().setDocURL
  // const setNumpages = store.getState().setNumPages
  // const setUploadedFile = store.getState().setUploadedFile

  useEffect(() => {
    console.log('docURL', docURL);
  }, [docURL]);

  const { pdfDocument: pdf, pdfPage } = usePdf({
    file: docURL,
    page: 1,
    canvasRef,
    onDocumentLoadSuccess(document) {
      console.log('[usePDFParser] PDF document loaded successfully');
      dispatch({ type: ActionType.SET_NUM_PAGES, payload: document.numPages });
      dispatch({ type: ActionType.SET_UPLOADED_FILE, payload: document });
    },
    onDocumentLoadFail() {
      console.log('[usePDFParser] Failed to load PDF document');
    },
  });

  const executeUpload = async (uploadedFile: string) => {
    dispatch({ type: ActionType.SET_DOC_URL, payload: uploadedFile });
  };

  /** PDF Text content extraction handler */
  const extractTextFromPdfPage = async (pageNumber: number) => {
    try {
      if (!pdf) {
        return '';
      }
      const totalPages = pdf.numPages;

      if (pageNumber < 1 || pageNumber > totalPages) {
        throw new Error(`Invalid page number: ${pageNumber}`);
      }

      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const extractedText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      console.log(`Page ${pageNumber} text:`, extractedText);
      return extractedText;
    } catch (error) {
      console.error('Error extracting text from PDF page:', error);
      throw new Error(error as any);
    }
  };

  // create a dummy pdf document` proxy
  const pdfDocument = {
    numPages: 0,
    getPage: () => Promise.resolve(pdfPage),
  } as unknown as PDFDocumentProxy;

  return {
    pdfPage,
    documentURL: docURL,
    executeUpload,
    parsePageText: extractTextFromPdfPage,
    document: pdf || pdfDocument,
  };
}

export default usePDFParser;
