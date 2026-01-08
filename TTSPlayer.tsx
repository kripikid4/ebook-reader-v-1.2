'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';

interface TTSPlayerProps {
  textToRead: string;
}

export default function TTSPlayer({ textToRead }: TTSPlayerProps) {
  const { isPlaying, isPaused, speak, pause, resume, stop } = useTTS();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(textToRead);
    }
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-6 shadow-xl z-40"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <button 
        onClick={handlePlayPause}
        className="hover:scale-110 transition-transform"
      >
        {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
      </button>

      {(isPlaying || isPaused) && (
        <button 
            onClick={stop}
            className="hover:scale-110 transition-transform"
        >
            <Square size={20} fill="white" />
        </button>
      )}
    </motion.div>
  );
}
