"use client";

import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 1.5, // 1.5 seconds delay between each sentence appearing
            delayChildren: 0.5,
        }
    }
};

const textVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    show: { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        transition: { duration: 2 }
    }
};

export default function AboutMovie() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-4xl mx-auto my-auto text-center px-4 font-mono pointer-events-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, margin: "-100px" }}
                className="space-y-12"
            >
                <motion.p variants={textVariants} className="text-xl md:text-3xl font-light text-cyan-50">
                    "I am Sriman Rutvik from SRM University."
                </motion.p>
                
                <motion.p variants={textVariants} className="text-lg md:text-2xl font-light text-cyan-200/80 leading-relaxed">
                    Driven by boundless curiosity, I thrive on exploring the unknown and connecting with new minds.
                </motion.p>
                
                <motion.p variants={textVariants} className="text-2xl md:text-4xl italic text-gray-500 tracking-widest my-16">
                    In a world full of noise, my life often feels full of emptiness.
                </motion.p>
                
                <motion.p variants={textVariants} className="text-xl md:text-3xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                    But within that vast emptiness, I find the space to architect logic out of chaos...
                </motion.p>
                
                <motion.p variants={textVariants} className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase drop-shadow-[0_0_20px_rgba(0,255,255,0.8)] mt-12">
                    Securing the unknown. Building something real.
                </motion.p>
            </motion.div>
        </div>
    );
}
