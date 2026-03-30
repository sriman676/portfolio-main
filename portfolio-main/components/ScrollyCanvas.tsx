"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import Overlay from "./Overlay";

export default function ScrollyCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    return (
        <div ref={containerRef} className="h-[300vh] relative bg-[#0a0a0a]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Optional dark background or gradients could go here if needed. 
                    The global sticky avatar renders above or behind this area! */}
                
                {/* Show Achievements and Works Overlay */}
                <div className="relative z-10 w-full h-full pointer-events-none">
                    <Overlay scrollYProgress={scrollYProgress} />
                </div>
            </div>
        </div>
    );
}
