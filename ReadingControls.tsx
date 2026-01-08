'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, X, Minus, Plus } from 'lucide-react';

interface ReadingControlsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
}

export default function ReadingControls({
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  fontFamily,
  setFontFamily,
}: ReadingControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-14 h-14 bg-black/80 text-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-md z-40"
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <Type size={24} />
      </motion.button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl rounded-t-3xl p-6 shadow-2xl z-50 border-t border-white/20"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Reading Settings</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Font Size */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Size</span>
                  <div className="flex items-center gap-4 bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                      className="p-2 rounded-full hover:bg-white shadow-sm transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{fontSize}</span>
                    <button
                      onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                      className="p-2 rounded-full hover:bg-white shadow-sm transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Line Height */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Spacing</span>
                  <div className="flex items-center gap-4 bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => setLineHeight(Math.max(1, lineHeight - 0.1))}
                      className="p-2 rounded-full hover:bg-white shadow-sm transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{lineHeight.toFixed(1)}</span>
                    <button
                      onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))}
                      className="p-2 rounded-full hover:bg-white shadow-sm transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Font Family */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Font</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFontFamily('sans')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        fontFamily === 'sans'
                          ? 'bg-black text-white shadow-md'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Sans
                    </button>
                    <button
                      onClick={() => setFontFamily('serif')}
                      className={`px-4 py-2 rounded-full text-sm font-serif font-medium transition-all ${
                        fontFamily === 'serif'
                          ? 'bg-black text-white shadow-md'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Serif
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
