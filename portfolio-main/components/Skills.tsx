"use client";

import { motion } from "framer-motion";

const skills = [
    { category: "Core Cybersecurity", list: ["Information Security", "Cybersecurity", "Network Security", "Security Operations", "Security Monitoring", "Incident Response", "Incident Handling", "Threat & Vulnerability Management", "Cyber Threat Intelligence", "SIEM"] },
    { category: "Network Traffic & Analysis", list: ["Network Traffic Analysis", "PCAP Analysis", "Wireshark", "Tcpdump", "Nmap", "TCP/IP Suite", "OSI Model", "Networking"] },
    { category: "SOC / Blue Team Skills", list: ["Log Analysis", "Anomaly Detection", "Security Intelligence", "Windows Defender Endpoint", "Security Hardening"] },
    { category: "Systems Knowledge", list: ["Linux", "Windows", "Operating Systems", "Network Administration"] },
    { category: "Technical & Programming", list: ["Python", "SQL", "C++", "Programming Concepts"] },
];

export default function Skills() {
    return (
        <section className="relative z-20 bg-[#121212] py-32 px-4 md:px-12 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-20 tracking-tighter text-white text-center"
                >
                    Technical Skills
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {skills.map((skillGroup, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-cyan-500/50 transition-colors shadow-lg"
                        >
                            <h3 className="text-2xl font-bold text-cyan-400 mb-6">{skillGroup.category}</h3>
                            <ul className="space-y-3">
                                {skillGroup.list.map((skill, i) => (
                                    <li key={i} className="text-gray-300 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0" />
                                        <span>{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
