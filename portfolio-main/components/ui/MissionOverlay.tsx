"use client";
import { useStore } from "../../systems/store";
import { motion, AnimatePresence } from "framer-motion";

export default function MissionOverlay() {
    const { animationState, setAnimationState, neutralizeThreat } = useStore();

    if (animationState !== "MISSION_ACTIVE") return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9995] bg-red-900/20 backdrop-blur-sm pointer-events-auto flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-black/80 border border-red-500/50 p-8 rounded-xl max-w-2xl w-full shadow-[0_0_50px_rgba(255,0,0,0.2)] text-center font-mono"
                >
                    {/* Mission Header */}
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-red-500/20 rounded-full animate-pulse border border-red-500/50">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff0044" strokeWidth="2">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl text-red-500 font-bold mb-2 tracking-widest uppercase text-shadow-glow">Critical Alert</h2>
                    <p className="text-gray-300 text-lg mb-8 tracking-widest uppercase">Security Event Detected — Investigate.</p>
                    
                    {/* Mission Selection Nodes (Module 12) */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <MissionButton title="Malware Activity" onClick={neutralizeThreat} />
                        <MissionButton title="Network Intrusion" onClick={neutralizeThreat} />
                        <MissionButton title="Credential Attack" onClick={neutralizeThreat} />
                    </div>
                    
                    {/* Override Button */}
                    <div className="mt-8 border-t border-red-900/50 pt-6">
                        <button 
                            onClick={() => setAnimationState("SCENE_ACTIVE")}
                            className="text-gray-500 hover:text-white transition-colors text-xs tracking-[0.2em] uppercase"
                        >
                            [ Ignore Broadcast ]
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function MissionButton({ title, onClick }: { title: string, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="w-full md:w-auto relative group bg-red-950/30 border border-red-500/30 p-4 rounded text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white transition-all overflow-hidden flex flex-col items-center justify-center min-h-[120px]"
        >
            {/* Cyber Ring */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-16 h-16 border-2 border-red-400 rounded-full animate-ping"></div>
            </div>
            
            <div className="z-10 font-bold tracking-widest uppercase text-sm mb-2">{title}</div>
            <div className="z-10 text-[10px] text-red-500/70 group-hover:text-red-300/90">&gt; NEUTRALIZE_NODE</div>
        </button>
    );
}
