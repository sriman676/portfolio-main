"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// Micro-base64 generic digital blip
const BEEP_SRC = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

export function useAudio() {
    const [audioEnabled, setAudioEnabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio(BEEP_SRC);
            audioRef.current.volume = 0.2;
        }
    }, []);

    const playBeep = useCallback(() => {
        if (audioEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }
    }, [audioEnabled]);

    return { audioEnabled, setAudioEnabled, playBeep };
}
