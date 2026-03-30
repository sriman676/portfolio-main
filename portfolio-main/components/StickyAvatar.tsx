"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";

export default function StickyAvatar() {
    const { scrollYProgress } = useScroll(); // Tracks the entire window scroll

    // 0 to 0.05: Slides in from the left, fades in.
    // 0.05 to 0.9: Stays fixed on the left/bottom left, watching the user read the page.
    // 0.9 to 1.0: Spins and magically shrinks away before the footer is reached.

    const x = useTransform(scrollYProgress, [0, 0.05, 0.9, 0.95], ["-100%", "0%", "0%", "-100%"]);
    const scale = useTransform(scrollYProgress, [0, 0.05, 0.9, 0.95], [0.5, 1, 1, 0]);
    const rotate = useTransform(scrollYProgress, [0.85, 0.95], [0, 360]);
    const opacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 0.95], [0, 1, 1, 0]);

    // Give it a subtle 'breathing' float animation while 1.0 scale
    const yFloat = useTransform(scrollYProgress, (val) => Math.sin(val * 100) * 10);

    return (
        <motion.div
            style={{ x, scale, rotate, opacity, y: yFloat }}
            className="fixed bottom-10 left-10 z-50 pointer-events-none"
        >
            <div className="relative w-[150px] h-[150px] md:w-[250px] md:h-[250px] rounded-full overflow-hidden border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] bg-[#0a0a0a]">
                <Image
                    src="/profile.png"
                    alt="3D Avatar"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 250px, 250px"
                    className="object-cover"
                    priority
                />
            </div>
        </motion.div>
    );
}
