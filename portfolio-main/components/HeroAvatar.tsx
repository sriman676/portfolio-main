"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function HeroAvatar() {
    const avatarRef = useRef<THREE.Group>(null);
    const texture = useTexture("/profile.png");

    useFrame((state) => {
        if (!avatarRef.current) return;
        
        // Dynamic "Follow Camera" physics
        // The drone stays at a fixed distance from the camera but sways and bobs to look like it's swinging 
        const camZ = state.camera.position.z;
        const camY = state.camera.position.y;
        
        const floatY = Math.sin(state.clock.elapsedTime * 3) * 0.4; // Bounce
        const swayX = Math.cos(state.clock.elapsedTime * 1.5) * 1.5; // Lateral swing arc

        // Sits 6 units dead ahead, gently swaying from side to side
        avatarRef.current.position.set(swayX, camY - 0.5 + floatY, camZ - 8);
        
        // Banking physics - tilts into the sway direction like a real pendulum
        avatarRef.current.rotation.z = -swayX * 0.15; 
        avatarRef.current.rotation.y = swayX * 0.1; 
    });

    return (
        <group ref={avatarRef}>
            {/* The protective glowing frame representing the web-shield */}
            <mesh>
                <boxGeometry args={[2.1, 2.1, 0.1]} />
                <meshStandardMaterial color="#000" metalness={1} roughness={0} opacity={0.5} transparent />
                <lineSegments>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(2.1, 2.1, 0.1)]} />
                    <lineBasicMaterial attach="material" color="#ff0055" />
                </lineSegments>
            </mesh>

            {/* The actual holographic portrait interface mapping the Profile Image to 3D */}
            <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>

            {/* Simulated thruster/spider core at the back */}
            <mesh position={[0, -0.5, -0.4]}>
                <cylinderGeometry args={[0.2, 0.4, 0.5, 16]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
            </mesh>
        </group>
    );
}
