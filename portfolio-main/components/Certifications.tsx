"use client";

import { motion } from "framer-motion";

const certs = [
    {
        title: "Google Cybersecurity Professional Certificate",
        issuer: "Google",
        date: "ACTIVE",
    },
    {
        title: "Introduction to Cybersecurity",
        issuer: "Completed",
        date: "COMPLETED",
    },
    {
        title: "SOC Member Training",
        issuer: "Lab / Program Validation",
        date: "ACTIVE",
    },
    {
        title: "PCAP Analysis Training",
        issuer: "Platform Coursework",
        date: "VALIDATED",
    }
];

export default function Certifications() {
    return (
        <section className="relative z-20 bg-[#0a0a0a] py-32 px-4 md:px-12 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-20 tracking-tighter text-white text-center"
                >
                    Certifications
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certs.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-xl bg-[#121212] border border-white/10 p-8 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all"
                        >
                            <div className="text-sm text-cyan-500 font-mono mb-2 uppercase tracking-widest">{cert.date}</div>
                            <h3 className="text-2xl font-bold text-white mb-2">{cert.title}</h3>
                            <p className="text-gray-400">{cert.issuer}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
