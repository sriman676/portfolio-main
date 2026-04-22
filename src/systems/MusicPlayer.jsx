'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useStore } from './store';

// Ambient music generated procedurally using Web Audio API — no external file needed
function createAmbientSynth(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const reverb = ctx.createGain();

  filter.type = 'lowpass';
  filter.frequency.value = 600;
  filter.Q.value = 0.8;

  osc1.type = 'sine';
  osc1.frequency.value = 55; // A1
  osc2.type = 'sine';
  osc2.frequency.value = 57.5; // slight detune

  const g1 = ctx.createGain(); g1.gain.value = 0.4;
  const g2 = ctx.createGain(); g2.gain.value = 0.3;

  osc1.connect(g1); g1.connect(filter);
  osc2.connect(g2); g2.connect(filter);
  filter.connect(reverb);
  reverb.gain.value = 0.8;
  reverb.connect(master);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 0.15;
  lfo.connect(lfoGain);
  lfoGain.connect(master.gain);

  osc1.start(); osc2.start(); lfo.start();

  return {
    master,
    setVolume: (v) => {
      master.gain.setTargetAtTime(v * 0.35, ctx.currentTime, 0.3);
    },
    stop: () => {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      setTimeout(() => {
        try { osc1.stop(); osc2.stop(); lfo.stop(); } catch {}
      }, 600);
    }
  };
}

const COMBAT_TRACK_URL = "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7315b.mp3"; // High-intensity Cyberpunk Track

export default function MusicPlayer() {
  const isSingularity = useStore((s) => s.isSingularity);
  const ctxRef = useRef(null);
  const synthRef = useRef(null);
  const audioRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [mode, setMode] = useState('AMBIENT'); // 'AMBIENT' or 'COMBAT'

  // Sync mode with singularity
  useEffect(() => {
    if (isSingularity && mode !== 'COMBAT') {
      setMode('COMBAT');
    }
  }, [isSingularity, mode]);

  const startMusic = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }

    if (mode === 'AMBIENT') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (!synthRef.current) {
        synthRef.current = createAmbientSynth(ctxRef.current);
      }
      synthRef.current.setVolume(isMuted ? 0 : volume);
    } else {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
      if (!audioRef.current) {
        audioRef.current = new Audio(COMBAT_TRACK_URL);
        audioRef.current.loop = true;
      }
      audioRef.current.volume = isMuted ? 0 : volume * 0.5;
      audioRef.current.play().catch(e => console.warn("AUDIO_PLAY_BLOCK", e));
    }
    setIsPlaying(true);
  }, [isMuted, volume, mode]);

  const stopMusic = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.stop();
      synthRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startMusic();
    }
  }, [mode, isPlaying, startMusic]);

  const togglePlay = useCallback(() => {
    if (isPlaying) stopMusic();
    else startMusic();
  }, [isPlaying, startMusic, stopMusic]);

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    if (synthRef.current) synthRef.current.setVolume(next ? 0 : volume);
    if (audioRef.current) audioRef.current.volume = next ? 0 : volume * 0.5;
  }, [isMuted, volume]);

  const handleVolume = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (synthRef.current && !isMuted) synthRef.current.setVolume(v);
    if (audioRef.current && !isMuted) audioRef.current.volume = v * 0.5;
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.stop();
      if (audioRef.current) audioRef.current.pause();
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 10px',
      background: 'rgba(0,243,255,0.04)',
      border: '1px solid rgba(0,243,255,0.15)',
      borderRadius: '2px',
    }}>
      <button
        onClick={togglePlay}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: isPlaying ? 'var(--c-cyan)' : 'var(--c-muted)',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      <button
        onClick={toggleMute}
        disabled={!isPlaying}
        style={{
          background: 'none', border: 'none', cursor: isPlaying ? 'pointer' : 'default',
          color: isMuted ? 'var(--c-red)' : 'var(--c-muted)',
          fontSize: '0.65rem',
          opacity: isPlaying ? 1 : 0.3,
        }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolume}
        disabled={!isPlaying || isMuted}
        style={{
          width: '50px',
          accentColor: 'var(--c-cyan)',
          opacity: isPlaying && !isMuted ? 1 : 0.3,
        }}
      />

      <div 
        onClick={() => isPlaying && setMode(prev => prev === 'AMBIENT' ? 'COMBAT' : 'AMBIENT')}
        style={{
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.45rem',
          color: isPlaying ? (mode === 'COMBAT' ? 'var(--c-stark-red)' : 'var(--c-cyan)') : 'var(--c-muted)',
          letterSpacing: '0.1em',
          cursor: isPlaying ? 'pointer' : 'default',
          border: `1px solid ${isPlaying ? 'rgba(0,243,255,0.2)' : 'transparent'}`,
          padding: '2px 4px',
          borderRadius: '2px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '0.35rem', opacity: 0.6 }}>THEME</span>
        <span>{mode}</span>
      </div>
    </div>
  );
}
