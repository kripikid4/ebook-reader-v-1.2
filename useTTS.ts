import { useState, useEffect, useRef, useCallback } from 'react';

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  text: string;
}

export const useTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synth.current) return;

    // Cancel existing speech
    synth.current.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    // Attempt to get a good voice
    const voices = synth.current.getVoices();
    // Prefer Samantha (MacOS) or Google US English
    const preferredVoice = voices.find(v => v.name === 'Samantha' || v.name.includes('Google US English'));
    if (preferredVoice) {
      u.voice = preferredVoice;
    }

    utterance.current = u;
    synth.current.speak(u);
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (!synth.current) return;
    synth.current.pause();
    setIsPaused(true);
    setIsPlaying(false); // Technically still "playing" but paused, but for UI toggle we can handle it
  }, []);

  const resume = useCallback(() => {
    if (!synth.current) return;
    synth.current.resume();
    setIsPaused(false);
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (!synth.current) return;
    synth.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  return {
    isPlaying,
    isPaused,
    speak,
    pause,
    resume,
    stop
  };
};
