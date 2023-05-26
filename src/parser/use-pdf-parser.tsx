/* eslint-disable */
import * as React from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { useEffect } from 'react';
import { store } from './store';

export interface UseFileUploadOptions {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export interface UsePDFParserReturn {
  document: PDFDocumentProxy;
  documentURL: string;
  executeUpload: (uploadedFile: string) => void;
  parsePageText: (pageNumber: number) => Promise<string>;
  pdfPage: PDFPageProxy;
}

export function usePDFParser({
  canvasRef,
}: UseFileUploadOptions): UsePDFParserReturn {
  const docURL = store((state) => state.docURL);
  const setDocURL = store((state) => state.setDocURL);
  const setNumpages = store((state) => state.setNumPages);
  const setUploadedFile = store((state) => state.setUploadedFile);

  useEffect(() => {
    console.log('docURL', docURL);
  }, [docURL]);

  const { pdfDocument: pdf, pdfPage } = usePdf({
    file: docURL,
    page: 1,
    canvasRef,
    onDocumentLoadSuccess(document) {
      console.log('[usePDFParser] PDF document loaded successfully');
      setNumpages(document.numPages);
      setUploadedFile(document);
    },
    onDocumentLoadFail() {
      console.log('[usePDFParser] Failed to load PDF document');
    },
  });

  const executeUpload = async (uploadedFile: string) => {
    Boolean(uploadedFile) && (await setDocURL(uploadedFile));
  };

  /** PDF Text content extraction handler */
  const _extractTextFromPdfPage = async (pageNumber: number) => {
    try {
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
    }
  };

  return {
    pdfPage,
    documentURL: docURL,
    executeUpload,
    parsePageText: _extractTextFromPdfPage,
    document: pdf,
  };
}

export default usePDFParser;
