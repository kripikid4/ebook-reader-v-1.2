'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfReaderProps {
  file: File | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoadSuccess?: (pdf: any) => void;
}

export default function PdfReader({ file, onLoadSuccess }: PdfReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);

  function onDocumentLoadSuccess(pdf: { numPages: number }) {
    setNumPages(pdf.numPages);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (onLoadSuccess) onLoadSuccess(pdf as any);
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#F5F5F7]">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="max-w-4xl w-full"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div key={`page_${index + 1}`} className="mb-8 shadow-lg">
             <Page 
                pageNumber={index + 1} 
                renderTextLayer={true} 
                renderAnnotationLayer={true}
                width={Math.min(window.innerWidth * 0.95, 800)} // Responsive width
                className="bg-white"
             />
          </div>
        ))}
      </Document>
    </div>
  );
}
