"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function CyberCity() {
    const instancesCount = 400;
    
    // Procedurally generate a massive city with dense buildings around the travel path
    const buildings = useMemo(() => {
        const bd = [];
        for (let i = 0; i < instancesCount; i++) {
            const x = (Math.random() - 0.5) * 120;
            // Create a street/canyon for the camera/avatar to fly through safely
            if (x > -6 && x < 6) continue; 
            
            const z = Math.random() * -180 + 20; 
            const width = Math.random() * 3 + 2;
            const depth = Math.random() * 3 + 2;
            const height = Math.random() * 25 + 10; 

            // 15% are glowing neon pillars (red/cyan), else dark glass skyscrapers
            const isNeon = Math.random() > 0.85;
            const color = isNeon 
                ? (Math.random() > 0.5 ? '#00e5ff' : '#ff0055') 
                : '#050510';

            bd.push({ x, y: height/2, z, width, height, depth, color, isNeon });
        }
        return bd;
    }, []);

    return (
        <group>
            {buildings.map((b, i) => (
                <mesh key={i} position={[b.x, b.y, b.z]}>
                    <boxGeometry args={[b.width, b.height, b.depth]} />
                    {b.isNeon ? (
                        <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={3} toneMapped={false} />
                    ) : (
                        <meshStandardMaterial color={b.color} roughness={0.1} metalness={0.9} envMapIntensity={1} />
                    )}
                    
                    {/* Glowing neon window/wireframe trims on buildings */}
                    <lineSegments>
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(b.width, b.height, b.depth)]} />
                        <lineBasicMaterial attach="material" color={b.isNeon ? "#ffffff" : "#0055ff"} transparent opacity={0.15} />
                    </lineSegments>
                </mesh>
            ))}
            
            {/* The ground canyon river containing the neon grid */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -50]}>
                <planeGeometry args={[300, 300]} />
                <meshStandardMaterial color="#010103" roughness={0.1} metalness={0.9} />
            </mesh>
            
            <gridHelper args={[300, 150, "#00ffcc", "#002233"]} rotation={[-0, 0, 0]} position={[0, -0.4, -50]} />
        </group>
    );
}
