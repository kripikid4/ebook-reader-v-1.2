'use client';

import { useEffect, useRef } from 'react';
import { Book as BookType, Rendition, Location } from 'epubjs';
import ePub from 'epubjs';

interface EpubReaderProps {
  url: string | ArrayBuffer;
  location?: string | number;
  onLocationChange?: (loc: string) => void;
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
  onBookReady?: (book: BookType) => void;
  onTextReady?: (text: string) => void;
}

export default function EpubReader({
  url,
  location,
  onLocationChange,
  fontSize = 16,
  lineHeight = 1.5,
  fontFamily = 'sans-serif',
  onBookReady,
  onTextReady
}: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const bookRef = useRef<BookType | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const book = ePub(url);
    bookRef.current = book;
    
    // Create a rendition that renders the entire book as a continuous scroll
    // 'manager: "continuous"' is key for vertical scrolling
    // 'flow: "scrolled"' enables scrolling instead of pagination
    const rendition = book.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'scrolled-doc', // scrolled-doc provides a single continuous view
      manager: 'continuous',
    });

    renditionRef.current = rendition;

    rendition.display(location as string);

    rendition.on('relocated', (loc: Location) => {
      if (onLocationChange) {
        onLocationChange(loc.start.cfi);
      }
      
      // Extract text from the current visible area for TTS
      // This is a simplification; ideally we'd get the text of the whole chapter
      if (onTextReady) {
          // loc.start.href points to the current section
          const section = book.spine.get(loc.start.href);
          if (section) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (section as any).load(book.load.bind(book)).then((contents: any) => {
                  // contents is usually the document object or text
                  // We need to be careful as 'load' returns different things based on implementation
                  // A safer way for epubjs v0.3 is usually to use the rendition's hook or just get text from DOM if available
                  // But since we are in a different iframe/view, we use the section object.
                  
                  // Let's try getting text content from the section document
                  const text = contents.textContent || contents.body?.textContent || "";
                  if (text) onTextReady(text);
              });
          }
      }
    });

    if (onBookReady) {
      onBookReady(book);
    }

    return () => {
      if (book) {
        book.destroy();
      }
    };
  }, [url, location, onLocationChange, onBookReady, onTextReady]); // Re-run only if URL changes

  // Apply styling changes
  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${fontSize}px`);
      
      // EPUB.js themes logic might vary, but usually this works for basic styling
      renditionRef.current.themes.default({
        'p': { 
            'line-height': `${lineHeight} !important`,
            'font-family': `${fontFamily === 'serif' ? 'Times New Roman, serif' : 'Inter, sans-serif'} !important`
        },
        'body': { 
            'padding': '0 20px !important',
             // Ensure background matches our theme
            'background-color': '#F5F5F7 !important' 
        }
      });
    }
  }, [fontSize, lineHeight, fontFamily]);

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7]">
      <div 
        ref={viewerRef} 
        className="w-full h-screen overflow-y-scroll no-scrollbar" 
      />
    </div>
  );
}
