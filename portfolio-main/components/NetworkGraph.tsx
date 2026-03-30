"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NetworkGraph() {
    const pointsRef = useRef<THREE.Points>(null);
    
    // Generate thousands of floating nodes acting as a visual threat-intelligence graph background
    const { positions, colors } = useMemo(() => {
        const particleCount = 1500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for(let i = 0; i < particleCount; i++) {
            // Surround the skyscrapers
            positions[i*3] = (Math.random() - 0.5) * 80;
            positions[i*3+1] = Math.random() * 30 + 1; // Heights
            positions[i*3+2] = Math.random() * -150 + 5; // Depths
            
            // Color Logic: Projects(Neutral/White), Skills(Blue), ThreatSim(Red)
            const typeProb = Math.random();
            const color = new THREE.Color();
            
            if (typeProb > 0.9) {
                // Threat Simulation Node = Red
                color.setHex(0xff0055);
            } else if (typeProb > 0.5) {
                // Skill Node = Electric Blue
                color.setHex(0x00e5ff);
            } else {
                // Neutral Data Packet = White/Gray
                color.setHex(0xaaaaaa);
            }

            colors[i*3] = color.r;
            colors[i*3+1] = color.g;
            colors[i*3+2] = color.b;
        }
        return { positions, colors };
    }, []);

    useFrame((state) => {
        if(pointsRef.current) {
            // Very slowly drift the entire network like data flows
            pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 2;
            pointsRef.current.position.z += 0.05; // Packets move toward user

            // Reset loop if they move past the camera
            if (pointsRef.current.position.z > 20) {
                pointsRef.current.position.z = -20;
            }
        }
    });

    return (
        <group>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.15} vertexColors transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
            </points>
        </group>
    );
}
