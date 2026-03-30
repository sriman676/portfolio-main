"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DecryptText } from "./ui/DecryptText";

const volunteerings = [
    {
        organization: "NSS SRM University AP",
        role: "Member",
        period: "Jan 2025 - Present · 1 yr 3 mos", // Based on user string
        industry: "Social Services",
        description: "Participated in community service initiatives through NSS, contributing to the organization of two blood donation drives and assisting pilgrims at Tirumala Tirupati Devasthanam. Supported crowd management, guided visitors, and helped ensure smooth operations while developing teamwork, communication, and leadership skills."
    },
    {
        organization: "Microsoft Student Community, SRMAP",
        role: "Member",
        period: "Nov 2024 - Nov 2025 · 1 yr 1 mo",
        industry: "Tech Community",
        description: "Engaged in 2 hackathons and 1 Zero Jam, working in team environments to design and build solutions within limited timeframes. Gained hands-on experience in problem-solving, rapid prototyping, and collaboration, while strengthening technical and interpersonal skills."
    }
];

export default function Volunteering() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <section className="relative z-20 bg-[#0a0a0a] py-32 px-4 md:px-12 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-20 tracking-tighter text-white text-center"
                >
                    Volunteering
                </motion.h2>

                <div className="relative border-l border-cyan-500/20 ml-4 md:ml-0 md:pl-0 space-y-12">
                    {volunteerings.map((vol, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-8 md:pl-12 cursor-pointer group transition-all duration-500 hover:scale-105"
                            onMouseEnter={() => setExpandedIndex(index)}
                            onMouseLeave={() => setExpandedIndex(null)}
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        >
                            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(0,255,255,1)] group-hover:scale-150 transition-transform" />

                            <div className="text-sm text-cyan-500 font-mono mb-2 uppercase tracking-widest">{vol.period}</div>
                            <div className="text-xs text-blue-400 font-mono mb-2">{vol.industry}</div>
                            <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                                <DecryptText text={vol.organization} />
                            </h3>
                            <h4 className="text-xl text-cyan-200/80 font-mono mb-4">
                                <DecryptText text={vol.role} />
                            </h4>
                            <p className="text-gray-300 leading-relaxed max-w-2xl pb-4">
                                {vol.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
