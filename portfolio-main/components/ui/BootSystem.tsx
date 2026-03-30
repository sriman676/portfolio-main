"use client";
import { useEffect } from "react";
import { useStore } from "../../systems/store";
import { motion, AnimatePresence } from "framer-motion";

export default function BootSystem() {
    const { animationState, setAnimationState, logEvent } = useStore();
    
    useEffect(() => {
        if (animationState !== "BOOT") return;
        
        // Modules 1, 2, 19: Global Timing Specification and Initial Spinner System
        logEvent("System Booting...");
        
        const t1 = setTimeout(() => {
            setAnimationState("SPIDER_INTRO");
            logEvent("Deploying Web Diagnostics...");
        }, 200);

        const t2 = setTimeout(() => {
            setAnimationState("SCENE_LOADING");
            logEvent("Constructing Holographic Identity...");
        }, 600);
        
        const t3 = setTimeout(() => {
            setAnimationState("SCENE_ACTIVE");
            logEvent("Cyber System Online.");
        }, 1200);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [animationState, setAnimationState, logEvent]);

    return (
        <AnimatePresence>
            {(animationState === "BOOT" || animationState === "SPIDER_INTRO" || animationState === "SCENE_LOADING") && (
                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-[99999] bg-[#020205] flex flex-col items-center justify-center pointer-events-none"
                >
                    {/* Module 1/2: Spider SVG Intro Spinner */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        {(animationState === "BOOT" || animationState === "SPIDER_INTRO") && (
                            <motion.svg width="100" height="100" viewBox="0 0 100 100" className="opacity-80">
                                {/* Simple Web Ring */}
                                <motion.circle 
                                    cx="50" cy="50" r="40" 
                                    fill="none" stroke="#00ffff" strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                />
                                {/* Inner web lines */}
                                <motion.line x1="50" y1="10" x2="50" y2="90" stroke="#00ffff" strokeWidth="1" strokeOpacity="0.5" />
                                <motion.line x1="10" y1="50" x2="90" y2="50" stroke="#00ffff" strokeWidth="1" strokeOpacity="0.5" />
                                <motion.line x1="22" y1="22" x2="78" y2="78" stroke="#00ffff" strokeWidth="1" strokeOpacity="0.5" />
                                <motion.line x1="78" y1="22" x2="22" y2="78" stroke="#00ffff" strokeWidth="1" strokeOpacity="0.5" />
                            </motion.svg>
                        )}
                        
                        {/* Spider Morph Indicator */}
                        {(animationState === "SPIDER_INTRO" || animationState === "SCENE_LOADING") && (
                            <motion.div 
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="absolute"
                            >
                                 {/* Spider SVG Body */}
                                 <svg width="40" height="40" viewBox="0 0 24 24" fill="#00ffff" stroke="#00ffff" className="drop-shadow-[0_0_10px_#00ffff]">
                                      <circle cx="12" cy="14" r="4" />
                                      <circle cx="12" cy="8" r="2" />
                                      {/* Legs */}
                                      <path d="M10 12l-4-4M14 12l4-4M10 14l-6 0M14 14l6 0M10 16l-4 4M14 16l4 4" strokeWidth="1.5" />
                                 </svg>
                            </motion.div>
                        )}
                    </div>
                    
                    {/* Loading Status Text */}
                    <motion.p className="text-cyan-400 mt-8 font-mono tracking-widest uppercase text-sm animate-pulse">
                        {animationState === "BOOT" ? "Initializing..." : "Building Scene..."}
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
