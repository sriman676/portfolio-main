"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "./Experience";
import AboutMovie from "./AboutMovie";
import Volunteering from "./Volunteering";
import Projects from "./Projects";
import Skills from "./Skills";
import Certifications from "./Certifications";
import { useStore } from "../systems/store";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollPanels() {
    useEffect(() => {
        const panels = gsap.utils.toArray('.scroll-panel') as HTMLElement[];
        
        panels.forEach((panel, i) => {
            // Animates each section sliding in from the top as if pulled down by a web
            gsap.fromTo(panel, 
                { opacity: 0, y: -100, scale: 0.95 },
                {
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    scrollTrigger: {
                        trigger: panel.parentElement,
                        start: `top+=${i * window.innerHeight} top`,
                        end: `+=${window.innerHeight}`,
                        scrub: 0.1, // Drastically reduced for immediate, snappy scroll response
                        onEnter: () => {
                            // Module 12: Trigger Interactive Mission Mode at Skills Panel
                            if (i === 5) {
                                const state = useStore.getState();
                                if (state.animationState === "SCENE_ACTIVE") {
                                    state.setAnimationState("MISSION_ACTIVE");
                                    state.simulateAttack(); // Spawn web targets globally
                                    state.logEvent("ALERT: Security Override Requested.");
                                }
                            }
                        }
                    }
                }
            );
        });
    }, []);

    const PanelContainer = ({ children }: { children: React.ReactNode }) => (
        <div className="h-screen w-full flex items-center justify-center sticky top-0 scroll-panel pointer-events-auto overflow-hidden">
            <div className="w-full max-w-5xl px-4 md:px-12 origin-top">
                {children}
            </div>
        </div>
    );

    return (
        <div className="absolute top-0 left-0 w-full h-[800vh] pointer-events-none z-10">
            {/* 1. Intro HUD */}
            <PanelContainer>
                <div className="text-center bg-[#020510]/90 p-12 backdrop-blur-3xl rounded-3xl border border-cyan-500/60 shadow-[0_0_80px_rgba(0,255,255,0.2)]">
                    <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
                        Sriman Rutvik
                    </h1>
                    <p className="text-xl md:text-2xl text-cyan-200 mt-4 tracking-[0.2em] font-light uppercase">
                        Cyber Security / Cloud Defense
                    </p>
                    <div className="mt-8 text-sm text-gray-400 tracking-widest">(Scroll to Deploy Protocols)</div>
                </div>
            </PanelContainer>

            {/* 2. About Cinematic Movie Sequence HUD */}
            <PanelContainer>
                <div className="w-full h-full flex items-center justify-center p-4">
                    <AboutMovie />
                </div>
            </PanelContainer>

            {/* 3. Experience Timeline HUD */}
            <PanelContainer>
                 <div className="backdrop-blur-3xl bg-[#020510]/90 rounded-3xl border border-blue-400/50 p-6 md:p-10 overflow-y-auto max-h-[80vh] shadow-[0_0_100px_rgba(0,150,255,0.2)] flex justify-start scale-[0.95]">
                     <Experience />
                 </div>
            </PanelContainer>

            {/* 3. Volunteering Timeline HUD */}
            <PanelContainer>
                 <div className="backdrop-blur-3xl bg-[#020510]/90 rounded-3xl border border-blue-400/50 p-6 md:p-10 overflow-y-auto max-h-[80vh] shadow-[0_0_100px_rgba(0,150,255,0.2)] flex justify-start scale-[0.95]">
                     <Volunteering />
                 </div>
            </PanelContainer>

            {/* 4. Projects HUD */}
            <PanelContainer>
                 <div className="backdrop-blur-3xl bg-[#020510]/90 rounded-3xl border border-blue-400/50 p-6 md:p-10 overflow-y-auto max-h-[80vh] shadow-[0_0_100px_rgba(0,150,255,0.2)] scale-[0.95] origin-right">
                     <Projects />
                 </div>
            </PanelContainer>

            {/* 5. Skills HUD */}
             <PanelContainer>
                 <div className="backdrop-blur-3xl bg-[#020510]/90 rounded-3xl border border-blue-400/50 p-6 md:p-8 overflow-y-auto max-h-[80vh] shadow-[0_0_100px_rgba(0,150,255,0.2)] scale-[0.95]">
                     <Skills />
                 </div>
            </PanelContainer>

            {/* 6. Contact & Certs Final HUD */}
            <PanelContainer>
                <div className="flex flex-col gap-6 max-h-screen overflow-y-auto pb-10">
                    <div className="backdrop-blur-3xl bg-[#020510]/90 rounded-3xl border border-blue-400/50 p-6 shadow-[0_0_100px_rgba(0,150,255,0.2)] scale-[0.95]">
                         <Certifications />
                    </div>
                    <div className="bg-[#050510]/90 p-12 rounded-3xl border border-cyan-500/50 backdrop-blur-xl text-center shadow-[0_0_100px_rgba(0,200,255,0.2)] pointer-events-auto">
                        <h2 className="text-4xl font-bold text-white mb-6 tracking-wider">INITIATE CONTACT</h2>
                        <div className="flex flex-wrap justify-center gap-6 text-lg">
                            <a href="https://www.linkedin.com/in/sriman-rutvik/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-white transition-colors p-2 z-50">LinkedIn</a>
                            <a href="https://github.com/sriman676" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-white transition-colors p-2 z-50">GitHub</a>
                            <a href="https://www.instagram.com/srimanrutvik" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-white transition-colors p-2 z-50">Instagram</a>
                            <a href="mailto:srimanrutvik_voddiraju@srmap.edu.in" className="text-cyan-400 hover:text-white transition-colors p-2 z-50">Email</a>
                            <a href="tel:9059948291" className="text-cyan-400 hover:text-white transition-colors p-2 z-50">Phone: 9059948291</a>
                        </div>
                        <div className="mt-12 text-center text-cyan-300 tracking-[0.3em] font-light italic opacity-70">
                            "Protecting the Web — One Node at a Time."
                        </div>
                    </div>
                </div>
            </PanelContainer>
        </div>
    );
}
