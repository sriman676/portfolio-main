"use client";

import dynamic from 'next/dynamic';
import ScrollPanels from "@/components/ScrollPanels";
import SpiderCursor from "@/components/SpiderCursor";

// Module 1, 12, 13, 14, 16 Overlays
import BootSystem from "@/components/ui/BootSystem";
import OperatorHUD from "@/components/ui/OperatorHUD";
import MissionOverlay from "@/components/ui/MissionOverlay";
import { useDevicePerf } from "@/hooks/useDevicePerf";

const CyberScene = dynamic(() => import('@/components/CyberScene'), { ssr: false });

export default function Home() {
  useDevicePerf(); // Execute Module 16 hardware evaluation

  return (
    <main className="bg-[#020205] min-h-[800vh] relative overflow-x-hidden font-sans selection:bg-cyan-500/30">
      <SpiderCursor />
      
      {/* Absolute UI overlay systems */}
      <BootSystem />
      <OperatorHUD />
      <MissionOverlay />
      
      {/* 3D WebGL Canvas Architecture */}
      <CyberScene />
      
      {/* Glassmorphism DOM overlay layers driven by GSAP */}
      <ScrollPanels />
    </main>
  );
}


