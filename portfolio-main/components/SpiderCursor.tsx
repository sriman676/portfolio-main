"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SpiderCursor() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [clickPulse, setClickPulse] = useState(false);

    useEffect(() => {
        // Force hide default cursor globally directly on mount
        document.body.style.cursor = "none";
        // Also apply to all links/buttons
        const style = document.createElement("style");
        style.innerHTML = `* { cursor: none !important; }`;
        document.head.appendChild(style);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            
            // Spider-Sense: Check if hovering a clickable UI element
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleClick = () => {
            setClickPulse(true);
            setTimeout(() => setClickPulse(false), 400); // Pulse duration
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleClick);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleClick);
            document.body.style.cursor = "auto";
            document.head.removeChild(style);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99999]"
            animate={{ x: mousePos.x, y: mousePos.y }}
            transition={{ type: "spring", stiffness: 700, damping: 28, mass: 0.5 }}
        >
            <div className="relative -ml-4 -mt-4 flex items-center justify-center">
                {/* Spider central node */}
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isHovering ? "bg-[#ff0055] scale-150 shadow-[0_0_20px_#ff0055]" : "bg-[#00e5ff] scale-100 shadow-[0_0_15px_#00e5ff]"}`} />
                
                {/* Cybernetic web reticle / spider legs */}
                <div className={`absolute w-10 h-px transition-colors duration-300 ${isHovering ? "bg-[#ff0055]/60" : "bg-[#00e5ff]/50"}`} />
                <div className={`absolute w-px h-10 transition-colors duration-300 ${isHovering ? "bg-[#ff0055]/60" : "bg-[#00e5ff]/50"}`} />
                
                {/* Spider-Sense Ripple expanding on click */}
                {clickPulse && (
                    <>
                        <motion.div
                            initial={{ opacity: 1, scale: 0.2 }}
                            animate={{ opacity: 0, scale: 3.5 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute w-12 h-12 border-2 border-[#00ffff] rounded-full"
                        />
                        <motion.div
                            initial={{ opacity: 1, scale: 0.2 }}
                            animate={{ opacity: 0, scale: 2 }}
                            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                            className="absolute w-12 h-12 border border-[#00ffff] rounded-full"
                        />
                    </>
                )}
            </div>
        </motion.div>
    );
}
