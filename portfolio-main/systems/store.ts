import { create } from 'zustand';

// Module 18: Animation Safety Layer Strict Types
export type AnimationState = 
    | "BOOT" 
    | "SPIDER_INTRO" 
    | "SCENE_LOADING" 
    | "SCENE_ACTIVE" 
    | "MISSION_ACTIVE" 
    | "ATTACK_EVENT" 
    | "FINAL_SCENE";

export type PerfTier = "high" | "balanced" | "lightweight";

interface SystemState {
    animationState: AnimationState;
    perfTier: PerfTier;
    threatsBlocked: number;
    nodesSecured: number;
    activeIntrusions: number;
    sysLogMessage: string;
    
    setAnimationState: (s: AnimationState) => void;
    setPerfTier: (tier: PerfTier) => void;
    simulateAttack: () => void;
    neutralizeThreat: () => void;
    logEvent: (msg: string) => void;
}

export const useStore = create<SystemState>((set) => ({
    animationState: "SCENE_ACTIVE", // Bypassed artificial loading, instantly active
    perfTier: "balanced", // Adjusted by useDevicePerf
    threatsBlocked: 4021, // Arbitrary telemetry start
    nodesSecured: 153,
    activeIntrusions: 0,
    sysLogMessage: "Initiating Boot Sequence...",
    
    setAnimationState: (s) => set({ animationState: s }),
    setPerfTier: (tier) => set({ perfTier: tier }),
    
    // Module 11: Cyber Attack Simulation state driver
    simulateAttack: () => set(state => {
        // Only trigger if we aren't already swamped handling alerts
        if(state.activeIntrusions > 5) return state;
        
        return {
            activeIntrusions: state.activeIntrusions + 1,
            sysLogMessage: "WARNING: Malicious Packet Activity Detected!"
        };
    }),
    
    neutralizeThreat: () => set(state => ({
        threatsBlocked: state.threatsBlocked + 1,
        nodesSecured: Math.min(200, state.nodesSecured + 1),
        activeIntrusions: Math.max(0, state.activeIntrusions - 1),
        sysLogMessage: "Operator Response Logged — Threat Contained." // Module 14 exact string
    })),
    
    logEvent: (msg) => set({ sysLogMessage: msg })
}));
