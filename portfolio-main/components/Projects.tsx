"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DecryptText } from "./ui/DecryptText";

const projects = [
    {
        title: "Brute Force Analyst",
        category: "Security Tool",
        description: "Analyzes brute force attacks using Python directly from Event viewer.",
        tech: "Python",
        image: "/projects/brute-force.png",
        link: "https://github.com/sriman676/SOC_Automation"
    }
];

export default function Projects() {
    return (
        <section className="relative z-20 bg-[#121212] py-32 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-8xl font-bold mb-20 tracking-tighter text-white"
                >
                    Selected Works
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {projects.map((project, index) => (
                        <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-2xl bg-white/5 border border-cyan-500/20 backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:bg-white/10 hover:border-cyan-400/80 hover:shadow-[0_0_50px_rgba(0,255,255,0.3)] cursor-pointer h-[500px] flex flex-col justify-end block"
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />
                            </div>

                            <div className="relative z-10 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 text-xs font-medium tracking-widest text-[#121212] uppercase bg-[#ededed] rounded-full shadow-lg">
                                        {project.category}
                                    </span>
                                    <span className="px-3 py-1 text-xs font-medium tracking-widest text-white uppercase border border-white/30 rounded-full backdrop-blur-md">
                                        {project.tech}
                                    </span>
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-3 drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                                    <DecryptText text={project.title} className="text-cyan-400" />
                                </h3>
                                <p className="text-gray-200 text-lg leading-relaxed drop-shadow-md">{project.description}</p>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
