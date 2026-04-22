import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../systems/store';

// ── Shared Geometries ───────────────────────────────────────
const icoGeo    = new THREE.IcosahedronGeometry(1.2, 1);
const sphereGeo = new THREE.SphereGeometry(0.08, 6, 6);
const ringGeo   = new THREE.TorusGeometry(2.8, 0.02, 8, 64);
const ring2Geo  = new THREE.TorusGeometry(4.0, 0.015, 8, 64);
const ring3Geo  = new THREE.TorusGeometry(5.5, 0.012, 8, 64);
const diskGeo   = new THREE.CylinderGeometry(6, 6, 0.02, 64, 1, true);
const lineGeo   = new THREE.CylinderGeometry(0.01, 0.01, 8, 4);

const HELIX_COUNT = 24;
const dummy = new THREE.Object3D();

// ── Components (State-less, Logic-less, optimized) ──────────

const HolographicCore = React.memo(({ meshRef, innerRef, coreMat, innerMat }) => (
  <group>
    <mesh ref={meshRef} geometry={icoGeo} material={coreMat} />
    <mesh ref={innerRef} geometry={icoGeo} material={innerMat} scale={0.7} />
  </group>
));

const OrbitalRings = React.memo(({ r1, r2, r3, mat, mat2 }) => (
  <group>
    <mesh ref={r1} geometry={ringGeo} material={mat} />
    <mesh ref={r2} geometry={ring2Geo} material={mat2} rotation={[Math.PI / 3, 0, 0]} />
    <mesh ref={r3} geometry={ring3Geo} material={mat} rotation={[Math.PI / 6, Math.PI / 4, 0]} />
  </group>
));

const RadarSweep = React.memo(({ sweepRef, mat, matLine }) => (
  <group position={[0, -3.5, 0]}>
    <mesh geometry={diskGeo} material={mat} />
    <mesh ref={sweepRef}>
      <mesh position={[3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh geometry={lineGeo} material={matLine} />
      </mesh>
    </mesh>
    {[2, 4, 6].map((r, i) => (
      <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.015, 8, 32]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
      </mesh>
    ))}
  </group>
));

const DNAHelix = React.memo(({ meshARef, meshBRef, matA, matB }) => {
  useEffect(() => {
    // Initial DNA positions (one-time setup)
    for (let i = 0; i < HELIX_COUNT; i++) {
       const t = (i / HELIX_COUNT) * Math.PI * 4;
       const y = (i / HELIX_COUNT) * 8 - 4;
       
       // Mesh A
       dummy.position.set(Math.cos(t) * 1.2, y, Math.sin(t) * 1.2);
       dummy.updateMatrix();
       meshARef.current.setMatrixAt(i, dummy.matrix);
       
       // Mesh B
       dummy.position.set(Math.cos(t + Math.PI) * 1.2, y, Math.sin(t + Math.PI) * 1.2);
       dummy.updateMatrix();
       meshBRef.current.setMatrixAt(i, dummy.matrix);
    }
  }, []);

  return (
    <group>
      <instancedMesh ref={meshARef} args={[sphereGeo, matA, HELIX_COUNT]} />
      <instancedMesh ref={meshBRef} args={[sphereGeo, matB, HELIX_COUNT]} />
    </group>
  );
});

// ── Main Avatar (CONSOLIDATED LOOP) ────────────────────────
export const Avatar = () => {
  const groupRef = useRef();
  const perfTier = useStore((s) => s.perfTier);
  const activeIntrusions = useStore((s) => s.activeIntrusions);
  const { mouse, invalidate } = useThree();
  
  // Refs for child components
  const coreRef = useRef();
  const innerRef = useRef();
  const r1 = useRef();
  const r2 = useRef();
  const r3 = useRef();
  const sweepRef = useRef();
  const dnaARef = useRef();
  const dnaBRef = useRef();
  
  // Materials Memoization
  const mats = useMemo(() => ({
    core: new THREE.MeshStandardMaterial({ color: '#00f3ff', emissive: '#00f3ff', emissiveIntensity: 1.5, wireframe: true, transparent: true, opacity: 0.6 }),
    inner: new THREE.MeshStandardMaterial({ color: '#00f3ff', emissive: '#00f3ff', emissiveIntensity: 2, transparent: true, opacity: 0.3 }),
    ring: new THREE.MeshBasicMaterial({ color: '#00f3ff', transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
    ring2: new THREE.MeshBasicMaterial({ color: '#7c3aed', transparent: true, opacity: 0.3, side: THREE.DoubleSide }),
    radar: new THREE.MeshBasicMaterial({ color: '#00f3ff', transparent: true, opacity: 0.15, side: THREE.DoubleSide }),
    radarLine: new THREE.MeshBasicMaterial({ color: '#00ff88', transparent: true, opacity: 0.8 }),
    dnaA: new THREE.MeshBasicMaterial({ color: '#00f3ff', transparent: true, opacity: 0.8 }),
    dnaB: new THREE.MeshBasicMaterial({ color: '#7c3aed', transparent: true, opacity: 0.8 }),
  }), []);

  useEffect(() => () => Object.values(mats).forEach(m => m.dispose()), [mats]);

  const prevMouse = useRef({ x: 0, y: 0 });

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (!groupRef.current) return;

    // 1. Mouse Interaction (Adaptive Lerp)
    const mx = mouse.x;
    const my = mouse.y;
    const moved = Math.abs(mx - prevMouse.current.x) > 0.001 || Math.abs(my - prevMouse.current.y) > 0.001;

    if (moved) {
      const lerpFactor = 1 - Math.pow(0.02, delta);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 0.3, lerpFactor);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -my * 0.15, lerpFactor);
      prevMouse.current = { x: mx, y: my };
      invalidate();
    }

    // 2. Component Animations (Staggered/Unified)
    const isLow = perfTier === 'low';
    
    // Core Rotation
    if (coreRef.current) {
       coreRef.current.rotation.y += 0.3 * delta;
       coreRef.current.rotation.x += 0.15 * delta;
    }
    
    if (innerRef.current) {
       innerRef.current.rotation.y -= 0.5 * delta;
       // Skip complex breathing logic if CPU is struggling
       if (!isLow) {
          const breath = 1 + Math.sin(t * 1.5) * 0.04;
          innerRef.current.scale.setScalar(breath);
       }
    }

    // Alert Handling (Direct update to avoid excess React renders)
    if (innerRef.current?.material) {
      const c = activeIntrusions > 0 ? '#ff0033' : '#00f3ff';
      if (!innerRef.current.material.color.equals(new THREE.Color(c))) {
        innerRef.current.material.color.set(c);
        innerRef.current.material.emissive.set(c);
      }
    }

    // Rings
    if (r1.current) r1.current.rotation.z += 0.4 * delta;
    if (r2.current) { r2.current.rotation.x += 0.25 * delta; r2.current.rotation.y += 0.15 * delta; }
    if (r3.current) r3.current.rotation.y += 0.2 * delta;

    // Radar (Skip entirely on low tier to save CPU)
    if (!isLow && sweepRef.current) {
       sweepRef.current.rotation.y += 1.2 * delta;
    }

    // DNA Rotation
    if (dnaARef.current && dnaBRef.current) {
       dnaARef.current.rotation.y += 0.3 * delta;
       dnaBRef.current.rotation.y += 0.3 * delta;
    }

    // Global Breathing
    const breathY = Math.sin(t * 1.2) * 0.08;
    groupRef.current.position.y = breathY;

    // Always invalidate if animations are active
    invalidate();
  });

  return (
    <group ref={groupRef}>
      <HolographicCore meshRef={coreRef} innerRef={innerRef} coreMat={mats.core} innerMat={mats.inner} />
      <OrbitalRings r1={r1} r2={r2} r3={r3} mat={mats.ring} mat2={mats.ring2} />
      <DNAHelix meshARef={dnaARef} meshBRef={dnaBRef} matA={mats.dnaA} matB={mats.dnaB} />
      <RadarSweep sweepRef={sweepRef} mat={mats.radar} matLine={mats.radarLine} />
    </group>
  );
};

export default Avatar;
