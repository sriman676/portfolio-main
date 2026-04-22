import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Trail, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function CursorTrail() {
  const { viewport, mouse } = useThree();
  const meshRef = useRef();
  
  // Pre-allocate position vector to avoid GC pressure
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Project mouse position into 3D scene (on a plane at Z=5)
    // Viewport width/height accounts for camera FOV and distance
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    
    targetPos.set(x, y, 5);
    meshRef.current.position.lerp(targetPos, 0.2);
    
    // Slight lazy rotation for the 'cursor focus' look
    meshRef.current.rotation.z += 0.02;
  });

  return (
    <Trail
      width={0.25}
      length={8}
      color={new THREE.Color('#00f3ff')}
      attenuation={(t) => t * t}
      opacity={0.6}
    >
      <mesh ref={meshRef}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
        
        {/* Inner core dot */}
        <mesh>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </mesh>
    </Trail>
  );
}
