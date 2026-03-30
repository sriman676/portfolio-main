"use client";
import { useStore } from "../../systems/store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useAudio } from "../../hooks/useAudio";

export default function OperatorHUD() {
    const { threatsBlocked, nodesSecured, activeIntrusions, sysLogMessage, animationState, simulateAttack } = useStore();
    const { audioEnabled, setAudioEnabled, playBeep } = useAudio();

    // Module 11: Background Event Simulation (Every 15s)
    useEffect(() => {
        if (animationState !== "SCENE_ACTIVE") return;
        
        const interval = setInterval(() => {
            simulateAttack();
        }, 15000); // Triggers occasionally
        
        return () => clearInterval(interval);
    }, [animationState, simulateAttack]);

    // Don't render during boot sequence
    if (animationState === "BOOT" || animationState === "SPIDER_INTRO" || animationState === "SCENE_LOADING") return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="fixed top-0 left-0 w-full p-4 pointer-events-none z-[9900] flex justify-between items-start font-mono text-xs md:text-sm"
        >
            {/* Operator Identity Layer (Module 14) */}
            <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 p-4 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.05)] h-auto max-w-[250px]">
                <div className="text-cyan-400 font-bold mb-2 border-b border-cyan-500/30 pb-1 tracking-widest">OPERATOR: SRIMAN</div>
                <div className="text-gray-300">ROLE: Cyber Analyst</div>
                <div className="text-gray-300 mt-1">SYS: DEFENSE_NET</div>
                <div className="text-green-400 mt-3 flex items-center gap-2 font-bold bg-green-500/10 p-1 px-2 rounded-sm w-max">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    STATUS: ACTIVE
                </div>
            </div>

            {/* SOC Telemetry Panel (Module 13) */}
            <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 p-4 rounded-lg flex flex-col items-end shadow-[0_0_15px_rgba(0,255,255,0.05)] w-[300px]">
                <div className="text-cyan-400 font-bold mb-3 border-b border-cyan-500/30 pb-1 w-full text-right tracking-widest">LIVE TELEMETRY</div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-500">Threats Blocked</span>
                    <span className="text-cyan-300 tracking-wider blur-[0.2px] text-shadow-glow">{threatsBlocked}</span>
                </div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-500">Nodes Secured</span>
                    <span className="text-blue-400 tracking-wider">{nodesSecured}</span>
                </div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-500">Intrusions</span>
                    <span className={`tracking-wider font-bold transition-colors ${activeIntrusions > 0 ? "text-red-500 animate-pulse drop-shadow-[0_0_5px_red]" : "text-gray-400"}`}>
                        {activeIntrusions}
                    </span>
                </div>
                
                {/* Event Log Stream */}
                <div className="mt-4 w-full bg-black/60 p-2 border border-cyan-900/50 rounded flex gap-2 overflow-hidden h-8 items-center">
                    <span className="text-cyan-600 animate-pulse">&gt;</span>
                    <AnimatePresence mode="wait">
                        <motion.span 
                            key={sysLogMessage}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`italic whitespace-nowrap overflow-hidden text-ellipsis ${sysLogMessage.includes("WARNING") ? "text-red-400 font-bold shadow-red" : "text-cyan-500/80"}`}
                        >
                            {sysLogMessage}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Audio Engine Toggle (Module 5) */}
                <button 
                    onClick={() => {
                        setAudioEnabled(!audioEnabled);
                        if (!audioEnabled) playBeep();
                    }}
                    className="mt-3 w-full border border-cyan-500/30 p-1 text-center text-[10px] text-cyan-400/80 hover:bg-cyan-500/20 hover:text-white pointer-events-auto transition-colors cursor-pointer"
                >
                    [ SYS_AUDIO: {audioEnabled ? "ONLINE" : "MUTED"} ]
                </button>
            </div>
        </motion.div>
    );
}
