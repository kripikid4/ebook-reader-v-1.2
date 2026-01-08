'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
}

export default function DropZone({ onFileSelect, onUrlSubmit }: DropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [url, setUrl] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onUrlSubmit(url);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 space-y-8">
      {/* File Drop Zone */}
      <motion.div
        className={`relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden
          ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-gray-400 bg-white/50'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".pdf,.epub"
        />
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-600">Drop your book here</p>
        <p className="text-sm text-gray-400 mt-2">Supports EPUB and PDF</p>
      </motion.div>

      <div className="flex items-center gap-4 text-gray-400">
        <div className="h-px bg-gray-200 flex-1" />
        <span>or</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      {/* URL Input */}
      <form onSubmit={handleUrlSubmit} className="relative">
        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="url"
          placeholder="Paste a direct link to an EPUB or PDF"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
        />
        <button
            type="submit"
            disabled={!url}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
            Go
        </button>
      </form>
    </div>
  );
}
