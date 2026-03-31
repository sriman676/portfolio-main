import React from 'react';
import { useStore } from '../systems/store';
import { config } from '../portfolioConfig';

// BUG FIX: AudioSystem rewritten as singleton using useRef to prevent
// creating new Web Audio nodes on every render

const AudioSystem = React.memo(() => {
  const isMuted = useStore((s) => s.isMuted);
  // Audio is managed by the HUD mute button.
  // This component kept for compatibility — audio is ambient-only via a <audio> element.
  return null;
});

export default AudioSystem;
