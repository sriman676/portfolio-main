"use client";

import { useEffect } from "react";
import { useStore } from "../systems/store";

export function useDevicePerf() {
    const setPerfTier = useStore(state => state.setPerfTier);

    useEffect(() => {
        if (typeof navigator === 'undefined') return;
        
        // Modules 16 & 21: Device Capability Detection
        const cores = navigator.hardwareConcurrency || 4;
        const memory = (navigator as any).deviceMemory || 4; // Experimental API
        
        let tier: "high" | "balanced" | "lightweight" = "balanced";

        if (cores >= 8 && memory >= 8) {
            tier = "high"; // Fast PCs
        } else if (cores <= 4 || memory <= 4) {
            tier = "lightweight"; // Older phones, cheap laptops, battery saver
        }

        // Add battery saver check (if supported)
        if ('getBattery' in navigator) {
             (navigator as any).getBattery().then((battery: any) => {
                 if(battery.level <= 0.20 && !battery.charging) {
                     tier = "lightweight";
                 }
                 setPerfTier(tier);
             }).catch(() => {
                 setPerfTier(tier);
             });
        } else {
             setPerfTier(tier);
        }

    }, [setPerfTier]);

    return null;
}
