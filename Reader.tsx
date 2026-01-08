'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DropZone from '@/components/DropZone';
import ReadingControls from '@/components/ReadingControls';
import ProgressBar from '@/components/ProgressBar';
import TTSPlayer from '@/components/TTSPlayer';
import AmbientBackground from '@/components/AmbientBackground';
import { isEpub, isPdf } from '@/lib/utils';
import { Book } from 'epubjs';

import dynamic from 'next/dynamic';

const EpubReader = dynamic(() => import('@/components/EpubReader'), { ssr: false });
const PdfReader = dynamic(() => import('@/components/PdfReader'), { ssr: false });

export default function Reader() {
  const [file, setFile] = useState<File | string | ArrayBuffer | null>(null);
  const [fileType, setFileType] = useState<'epub' | 'pdf' | null>(null);
  const [loading, setLoading] = useState(false);

  // Settings
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [fontFamily, setFontFamily] = useState('sans');

  // Progress
  const [readingTime, setReadingTime] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<string | number | undefined>(undefined);
  
  // Theme
  const [ambientColor, setAmbientColor] = useState<string | undefined>(undefined);
  
  // Text for TTS
  const [currentText, setCurrentText] = useState('');

  // Load saved progress
  const loadProgress = (fileName: string) => {
      const saved = localStorage.getItem(`reader-progress-${fileName}`);
      if (saved) {
          const { location, time } = JSON.parse(saved);
          setCurrentLocation(location);
          if (time) setReadingTime(time);
      }
  };

  const saveProgress = (fileName: string, location: string | number) => {
      localStorage.setItem(`reader-progress-${fileName}`, JSON.stringify({
          location,
          time: readingTime,
          timestamp: Date.now()
      }));
  };

  const handleFileSelect = (selectedFile: File) => {
    setLoading(true);
    if (isEpub(selectedFile)) {
      setFileType('epub');
      // For epubjs, we can pass the ArrayBuffer or URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFile(e.target?.result as ArrayBuffer);
        loadProgress(selectedFile.name);
        setLoading(false);
      };
      reader.readAsArrayBuffer(selectedFile);
    } else if (isPdf(selectedFile)) {
        setFileType('pdf');
        setFile(selectedFile);
        loadProgress(selectedFile.name);
        setLoading(false);
    } else {
        alert('Unsupported file type');
        setLoading(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
      setLoading(true);
      const name = url.split('/').pop() || 'book';
      if (isEpub(url)) {
          setFileType('epub');
          setFile(url);
          loadProgress(name);
      } else if (isPdf(url)) {
          setFileType('pdf');
          setFile(url);
          loadProgress(name);
      }
      setLoading(false);
  }

  // Handle Book Ready (Metadata etc)
  const handleBookReady = (book: Book) => {
      book.loaded.metadata.then((meta) => {
          document.title = meta.title || 'E-Book Reader';
      });
      
      // Try to get cover for ambient background
      book.loaded.cover.then(async (coverUrl) => {
          if (coverUrl) {
               // In a real browser environment with epubjs, we might get a blob URL
               // We would use ColorThief here, but for now let's just use a placeholder 
               // logic or leave it blank as extracting colors from blob URL in React requires canvas
               // and might be heavy. 
               // A simple approach for now:
               setAmbientColor('#e0e7ff'); // Light indigo default
          }
      });
      
      // Calculate estimated time (rough approximation)
      book.locations.generate(1000).then(() => {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           const total = (book.locations as any).total;
           // Avg reading speed: 250 words per minute. 
           // 1000 chars per location approx? 
           // This is very rough. Let's assume 1 location = 1 minute for simplicity or derive better.
           // Better: total locations / X.
           setReadingTime(Math.ceil(total / 1.5)); // Mock calculation
      });
  }
  
  const handleLocationChange = (loc: string) => {
      console.log('Location changed', loc);
      
      // Save progress
      // We need a unique identifier for the file. 
      // If 'file' is a File object, use name. If string, use url.
      let fileName = 'unknown-book';
      if (file instanceof File) {
          fileName = file.name;
      } else if (typeof file === 'string') {
          fileName = file.split('/').pop() || 'book';
      }
      
      saveProgress(fileName, loc);
      setCurrentLocation(loc);
      
      // Update reading time left
      // We need total locations here, ideally passed from handleBookReady or stored in state
      // For now, let's just decrement randomly or based on progress if we had total
  }

  if (!file) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        )}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
        >
            <h1 className="text-4xl font-bold mb-4 tracking-tight text-gray-900">Your Personal Library</h1>
            <p className="text-gray-500 text-lg">Minimalist. Fluid. Immersive.</p>
        </motion.div>
        
        <DropZone onFileSelect={handleFileSelect} onUrlSubmit={handleUrlSubmit} />
        
        <AmbientBackground />
      </div>
    );
  }

  return (
    <>
      <ProgressBar />
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen pb-32"
      >
        {fileType === 'epub' && (
          <EpubReader 
            url={file as ArrayBuffer | string}
            location={currentLocation}
            fontSize={fontSize}
            lineHeight={lineHeight}
            fontFamily={fontFamily}
            onBookReady={handleBookReady}
            onLocationChange={handleLocationChange}
            onTextReady={setCurrentText}
          />
        )}
        
        {fileType === 'pdf' && (
            <PdfReader file={file as File | string} />
        )}
      </motion.main>

      {/* Controls */}
      <ReadingControls
        fontSize={fontSize}
        setFontSize={setFontSize}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
      />
      
      {/* Estimated Time (Mock for now, needs real calculation based on content length) */}
      <div className="fixed bottom-8 left-8 text-sm text-gray-500 font-medium backdrop-blur-md bg-white/50 px-4 py-2 rounded-full border border-white/20 shadow-sm z-40">
        {readingTime > 0 ? `${readingTime} min left` : 'Reading'}
      </div>

      {currentText && <TTSPlayer textToRead={currentText} />}

      <AmbientBackground color={ambientColor} />
    </>
  );
}
