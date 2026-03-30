"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

export function DecryptText({ text, className = "" }: { text: string, className?: string }) {
    const [display, setDisplay] = useState(text.replace(/./g, '_'));
    const [isTriggered, setIsTriggered] = useState(false);

    useEffect(() => {
        if (!isTriggered) return;
        
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(prev => {
                return text.split("").map((letter, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    if (letter === " ") return " ";
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join("");
            });

            if (iteration >= text.length) {
                clearInterval(interval);
            }
            iteration += 1 / 2; // Speed of decryption
        }, 30); // 30ms per tick

        return () => clearInterval(interval);
    }, [text, isTriggered]);

    return (
        <motion.span 
            className={`font-mono ${className}`}
            onViewportEnter={() => setIsTriggered(true)}
            viewport={{ once: true, margin: "-100px" }}
        >
            {display}
        </motion.span>
    );
}
