"use client";

import { useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import CyberCity from "./CyberCity";
import NetworkGraph from "./NetworkGraph";
import CyberGlobe from "./CyberGlobe";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";
import { useStore } from "../systems/store";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

export function CameraController() {
    const { camera } = useThree();

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Smooth dragging
            }
        });

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const swingX = isMobile ? 1.5 : 8;

        // Creating a dynamic spiderman swing arc through the neon city
        tl.to(camera.position, {
            z: -30,
            y: 0,
            x: -swingX,
            ease: "sine.inOut",
        })
        .to(camera.position, {
            z: -70,
            y: 8,
            x: swingX,
            ease: "sine.inOut",
        })
        .to(camera.position, {
            z: -120,
            y: 2,
            x: 0,
            ease: "power2.out",
        });

        return () => {
            tl.kill();
        }
    }, [camera]);

    return null;
}

function FirstPersonWebShooter() {
    const { activeIntrusions } = useStore();
    const lineRef = useRef<any>(null);
    const { camera } = useThree();

    // Module 7 Web Tension Logic triggered internally for first-person perspective
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(camera.position.x + 1.5, camera.position.y - 1.5, camera.position.z - 2), // Web shooter from bottom right of viewport
        new THREE.Vector3(camera.position.x + 5, camera.position.y + 10, camera.position.z - 15),   // Dynamic arc
        new THREE.Vector3(15, 20, camera.position.z - 40)   // Distant visual strike node
    );
    
    const linePoints: [number, number, number][] = curve.getPoints(20).map(p => [p.x, p.y, p.z]);

    useFrame(() => {
        if (lineRef.current) {
            lineRef.current.rotation.x = Math.random() * 0.05;
            lineRef.current.rotation.y = Math.random() * 0.05;
        }
    });

    if (activeIntrusions === 0) return null;

    return (
        <Line 
            ref={lineRef}
            points={linePoints}       
            color="#ffffff"                   
            lineWidth={3}                   
            transparent
            opacity={0.8}
        />
    );
}

export default function CyberScene() {
    const { perfTier, animationState } = useStore();

    // Module 21: Fail-safe Rendering Hierarchy evaluates whether effects block main thread
    const renderEffects = perfTier !== "lightweight";
    const highEnd = perfTier === "high";

    return (
        <div className={`fixed inset-0 z-0 bg-[#020205] pointer-events-none transition-opacity duration-1000 ${animationState === "BOOT" ? "opacity-0" : "opacity-100"}`}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 4, 15]} fov={75} />
                <CameraController />
                
                <color attach="background" args={["#020205"]} />
                <fog attach="fog" args={["#0a0a1a", 15, 80]} />
                
                <ambientLight intensity={0.5} color="#44aaff" />
                <directionalLight position={[10, 20, 10]} intensity={1.5} color={"#00ffff"} />
                <pointLight position={[0, 5, -50]} intensity={3} color={"#ff0055"} distance={100} />

                {renderEffects ? <Stars radius={150} depth={50} count={highEnd ? 5000 : 1500} factor={6} saturation={1} fade speed={1} /> : null}

                <CyberCity />
                <NetworkGraph />
                <FirstPersonWebShooter />
                <CyberGlobe />

                {renderEffects ? (
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={highEnd ? 1.5 : 1.0} mipmapBlur={highEnd} />
                        {highEnd ? <Noise opacity={0.04} /> : <group />}
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>
                ) : <group />}
            </Canvas>
        </div>
    );
}
