import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../systems/store';

// ── Reusable geometries (created once, shared) ────────────
const icoGeo    = new THREE.IcosahedronGeometry(1.2, 1);
const sphereGeo = new THREE.SphereGeometry(0.08, 6, 6);
const ringGeo   = new THREE.TorusGeometry(2.8, 0.02, 8, 64);
const ring2Geo  = new THREE.TorusGeometry(4.0, 0.015, 8, 64);
const ring3Geo  = new THREE.TorusGeometry(5.5, 0.012, 8, 64);
const diskGeo   = new THREE.CylinderGeometry(6, 6, 0.02, 64, 1, true);
const lineGeo   = new THREE.CylinderGeometry(0.01, 0.01, 8, 4);

// Number of DNA helix nodes
const HELIX_COUNT = 24;

// ── DNA Helix positions (computed once) ──────────────────
const helixPositions = Array.from({ length: HELIX_COUNT }, (_, i) => {
  const t = (i / HELIX_COUNT) * Math.PI * 4;
  const y = (i / HELIX_COUNT) * 8 - 4;
  return {
    posA: [Math.cos(t) * 1.2, y, Math.sin(t) * 1.2],
    posB: [Math.cos(t + Math.PI) * 1.2, y, Math.sin(t + Math.PI) * 1.2],
  };
});

// ── Holographic Core ──────────────────────────────────────
const HolographicCore = React.memo(({ activeIntrusions }) => {
  const meshRef = useRef();
  const innerRef = useRef();

  // BUG FIX: Material created in useMemo + disposed on unmount
  const coreMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00f3ff',
    emissive: '#00f3ff',
    emissiveIntensity: 1.5,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  }), []);

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: activeIntrusions > 0 ? '#ff0033' : '#00f3ff',
    emissive: activeIntrusions > 0 ? '#ff0033' : '#00f3ff',
    emissiveIntensity: 2,
    transparent: true,
    opacity: 0.3,
  }), [activeIntrusions]);

  useEffect(() => {
    return () => {
      coreMat.dispose();
      innerMat.dispose();
    };
  }, [coreMat, innerMat]);

  // PERF: dirty-check — only update if alertMode changes
  const prevAlert = useRef(0);
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const alertVal = activeIntrusions > 0 ? 1 : 0;

    if (meshRef.current) {
      // Frame-rate independent rotation
      meshRef.current.rotation.y += 0.3 * delta;
      meshRef.current.rotation.x += 0.15 * delta;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.5 * delta;
      // Breathing scale
      const breath = 1 + Math.sin(t * 1.5) * 0.04;
      innerRef.current.scale.setScalar(breath);
    }

    // Color transition on alert — only update when needed
    if (prevAlert.current !== alertVal && innerRef.current?.material) {
      const c = alertVal > 0 ? '#ff0033' : '#00f3ff';
      innerRef.current.material.color.set(c);
      innerRef.current.material.emissive.set(c);
      prevAlert.current = alertVal;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={icoGeo} material={coreMat} />
      <mesh ref={innerRef} geometry={icoGeo} material={innerMat} scale={0.7} />
    </group>
  );
});

// ── Orbital Rings ──────────────────────────────────────────
const OrbitalRings = React.memo(() => {
  const r1 = useRef();
  const r2 = useRef();
  const r3 = useRef();

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00f3ff', transparent: true, opacity: 0.4,
    side: THREE.DoubleSide,
  }), []);

  const mat2 = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#7c3aed', transparent: true, opacity: 0.3,
    side: THREE.DoubleSide,
  }), []);

  useEffect(() => {
    return () => { mat.dispose(); mat2.dispose(); };
  }, [mat, mat2]);

  useFrame((_, delta) => {
    if (r1.current) r1.current.rotation.z += 0.4 * delta;
    if (r2.current) {
      r2.current.rotation.x += 0.25 * delta;
      r2.current.rotation.y += 0.15 * delta;
    }
    if (r3.current) r3.current.rotation.y += 0.2 * delta;
  });

  return (
    <group>
      <mesh ref={r1} geometry={ringGeo} material={mat} />
      <mesh ref={r2} geometry={ring2Geo} material={mat2} rotation={[Math.PI / 3, 0, 0]} />
      <mesh ref={r3} geometry={ring3Geo} material={mat} rotation={[Math.PI / 6, Math.PI / 4, 0]} />
    </group>
  );
});

// ── Radar Sweep ────────────────────────────────────────────
const RadarSweep = React.memo(() => {
  const sweepRef = useRef();
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00f3ff', transparent: true, opacity: 0.15,
    side: THREE.DoubleSide,
  }), []);

  useEffect(() => () => mat.dispose(), [mat]);

  useFrame((_, delta) => {
    if (sweepRef.current) sweepRef.current.rotation.y += 1.2 * delta;
  });

  return (
    <group position={[0, -3.5, 0]}>
      {/* Radar disk */}
      <mesh geometry={diskGeo} material={mat} />
      {/* Sweep arm */}
      <mesh ref={sweepRef} rotation={[0, 0, 0]}>
        <mesh position={[3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh geometry={lineGeo} material={new THREE.MeshBasicMaterial({
            color: '#00ff88', transparent: true, opacity: 0.8
          })} />
        </mesh>
      </mesh>
      {/* Radar rings */}
      {[2, 4, 6].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.015, 8, 64]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
});

// ── DNA Helix ──────────────────────────────────────────────
const DNAHelix = React.memo(() => {
  const groupRef = useRef();
  const matA = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00f3ff', transparent: true, opacity: 0.8,
  }), []);
  const matB = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#7c3aed', transparent: true, opacity: 0.8,
  }), []);

  useEffect(() => () => { matA.dispose(); matB.dispose(); }, [matA, matB]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.3 * delta;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {helixPositions.map(({ posA, posB }, i) => (
        <group key={i}>
          <mesh geometry={sphereGeo} material={matA} position={posA} />
          <mesh geometry={sphereGeo} material={matB} position={posB} />
        </group>
      ))}
    </group>
  );
});

// ── Main Avatar ────────────────────────────────────────────
export const Avatar = () => {
  const groupRef  = useRef();
  const { mouse, invalidate } = useThree();
  const activeIntrusions = useStore((s) => s.activeIntrusions);

  const prevMouse = useRef({ x: 0, y: 0 });

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (!groupRef.current) return;

    const mx = mouse.x;
    const my = mouse.y;
    const moved =
      Math.abs(mx - prevMouse.current.x) > 0.001 ||
      Math.abs(my - prevMouse.current.y) > 0.001;

    if (moved) {
      const lerpFactor = 1 - Math.pow(0.02, delta);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, mx * 0.3, lerpFactor
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, -my * 0.15, lerpFactor
      );
      prevMouse.current = { x: mx, y: my };
      invalidate(); // frameloop=demand: tell R3F to render this frame
    }

    // Breathing — always animating, so always invalidate
    const breathY = Math.sin(t * 1.2) * 0.08;
    groupRef.current.position.y = breathY;
    invalidate();
  });

  return (
    <group ref={groupRef}>
      <HolographicCore activeIntrusions={activeIntrusions} />
      <OrbitalRings />
      <DNAHelix />
      <RadarSweep />
    </group>
  );
};

export default Avatar;
