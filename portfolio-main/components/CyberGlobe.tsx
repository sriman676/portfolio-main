"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../systems/store";

export default function CyberGlobe() {
    const globeRef = useRef<THREE.Mesh>(null);
    const { animationState } = useStore();

    // Do not instantiate heavy global geometry during the boot loader
    if (animationState === "BOOT" || animationState === "SPIDER_INTRO" || animationState === "SCENE_LOADING") return null;

    useFrame((state) => {
        if(globeRef.current) {
            globeRef.current.rotation.y += 0.002; // Very slow majestic spin
        }
    });

    // Module 22: Placed deeply in the Z axis (-150), only visible at very end of the scroll container
    return (
        <group position={[0, -10, -140]}>
            <mesh ref={globeRef}>
                <sphereGeometry args={[50, 64, 64]} />
                <meshStandardMaterial color="#001133" emissive="#000510" wireframe opacity={0.3} transparent />
                
                {/* Lat/Long Grid overlay drawing continents geometry illusion */}
                <lineSegments>
                    <edgesGeometry attach="geometry" args={[new THREE.SphereGeometry(50.5, 32, 32)]} />
                    <lineBasicMaterial attach="material" color="#0088ff" transparent opacity={0.15} toneMapped={false} />
                </lineSegments>
            </mesh>
            
            {/* Internal Core Atmosphere Glow */}
            <mesh>
                <sphereGeometry args={[45, 32, 32]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.03} />
            </mesh>
        </group>
    );
}
