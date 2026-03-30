"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DecryptText } from "./ui/DecryptText";

const experiences = [
    {
        company: "SRM University AP",
        role: "Student",
        period: "Aug 2024 – Present",
        description: "Recently Created Student Welfare Committe. Organized 2X hackathons. Click or hover to view specific organization roles and timelines.",
        subTimeline: [
            { title: "NTL", period: "Oct 2024 - Jan 2025" },
            { title: "MSC", period: "Nov 2024 - Nov 2025" },
            { title: "Singularity", period: "March 2025 - Nov 2025" },
            { title: "HIDRA", period: "Feb 2026 - Present" }
        ]
    }
];

export default function Experience() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="relative z-20 bg-[#0a0a0a] py-32 px-4 md:px-12 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-20 tracking-tighter text-white text-center"
                >
                    Career Timeline
                </motion.h2>

                <div className="relative border-l border-white/20 ml-4 md:ml-0 md:pl-0 space-y-12">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-8 md:pl-12 cursor-pointer group transition-all duration-500 hover:scale-105"
                            onMouseEnter={() => setIsExpanded(true)}
                            onMouseLeave={() => setIsExpanded(false)}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(0,255,255,1)] group-hover:scale-150 transition-transform" />

                            <div className="text-sm text-cyan-500 font-mono mb-2 uppercase tracking-widest">{exp.period}</div>
                            <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                                <DecryptText text={exp.company} />
                            </h3>
                            <h4 className="text-xl text-cyan-200/80 font-mono mb-4">
                                <DecryptText text={exp.role} />
                            </h4>
                            <p className="text-gray-300 leading-relaxed max-w-2xl">
                                {exp.description}
                            </p>

                            <AnimatePresence>
                                {isExpanded && exp.subTimeline && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-6 overflow-hidden"
                                    >
                                        <div className="border-l-2 border-cyan-500/50 pl-6 space-y-6 py-2">
                                            {exp.subTimeline.map((sub, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="relative"
                                                >
                                                    <div className="absolute -left-[29px] top-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                                    <h5 className="text-lg font-bold text-gray-200">{sub.title}</h5>
                                                    <span className="text-sm text-gray-500 font-mono">{sub.period}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
