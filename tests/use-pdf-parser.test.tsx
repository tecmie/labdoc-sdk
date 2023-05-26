import { renderHook } from '@testing-library/react-hooks';
import { usePDFParser } from '../src/parser/use-pdf-parser';

describe('usePDFParser', () => {
  it('should return the expected object', () => {
    const canvasRef = { current: document.createElement('canvas') };
    const { result } = renderHook(() => usePDFParser({ canvasRef }));
    expect(result.current).toEqual({
      document: undefined,
      documentURL: '',
      executeUpload: expect.any(Function),
      parsePageText: expect.any(Function),
      pdfPage: undefined,
    });
  });
});
