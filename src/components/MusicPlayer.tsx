import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  // Synthesize gentle conference ambient sound loop via Web Audio API (Zero external file dependencies)
  const playGentleChime = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Pentatonic soothing chime notes (C5, D5, E5, G5, A5)
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0];
      const note = notes[Math.floor(Math.random() * notes.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch (e) {
      console.warn('Web Audio Ambient', e);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      playGentleChime();
      timerRef.current = window.setInterval(() => {
        playGentleChime();
      }, 3500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      id="music-toggle-btn"
      onClick={togglePlay}
      aria-label="背景氛围音效"
      title="背景氛围音效"
      className="relative z-40 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-[#DFF4FF] shadow-sm flex items-center justify-center text-[#4A90E2] active:scale-90 transition-transform"
    >
      <div className={`flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
        <Music className="w-4 h-4 text-[#4A90E2]" />
      </div>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-[1.5px] bg-[#9CA3AF] rotate-45" />
        </div>
      )}
    </button>
  );
};
