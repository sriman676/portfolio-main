import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import Avatar from './Avatar';
import CursorTrail from './CursorTrail';
import { useStore } from '../systems/store';

// ── Pre-allocated — NEVER allocate new objects in useFrame ──
const _camTarget = new THREE.Vector3();
const _lookAt    = new THREE.Vector3(0, 0, 0);

// ── Camera Rig ─────────────────────────────────────────────
const CameraRig = React.memo(() => {
  const { camera, mouse, invalidate } = useThree();  // FIXED: use useThree().invalidate

  useFrame((_, delta) => {
    _camTarget.set(mouse.x * 1.5, mouse.y * 0.8, 18);
    const lf = 1 - Math.pow(0.05, delta);
    const prevX = camera.position.x;
    const prevY = camera.position.y;
    camera.position.lerp(_camTarget, lf);
    camera.lookAt(_lookAt);
    // Only invalidate when camera actually moved
    if (Math.abs(camera.position.x - prevX) > 0.0001 ||
        Math.abs(camera.position.y - prevY) > 0.0001) {
      invalidate();
    }
  });
  return null;
});

// ── Reusable dummy object for instanced mesh ───────────────
const dummy = new THREE.Object3D();

// ── Instanced Data Nodes (1 draw call instead of N) ───────
// ── Optimized DataNodes Shader ─────────────────────────────
const DataNodeMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00f3ff') },
    uOpacity: { value: 0.45 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying float vInstanceId;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vInstanceId = float(gl_InstanceID);
      
      // Procedural animation in vertex shader (GPU)
      vec3 pos = position;
      float phase = vInstanceId * 0.5;
      pos.y += sin(uTime * 0.5 + phase) * 0.3;
      
      // Calculate rotation matrix (y-axis)
      float angle = uTime * 0.4 + vInstanceId;
      float s = sin(angle);
      float c = cos(angle);
      mat3 rotY = mat3(
        c, 0.0, s,
        0.0, 1.0, 0.0,
        -s, 0.0, c
      );
      pos = rotY * pos;
      
      // Scale pulse
      float scale = 0.8 + sin(uTime + vInstanceId) * 0.1;
      pos *= scale;

      vec4 worldPosition = instanceMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 uColor;
    uniform float uOpacity;
    
    void main() {
      float edge = 1.0 - smoothstep(0.0, 0.1, vUv.x) * smoothstep(0.0, 0.1, 1.0 - vUv.x);
      edge += 1.0 - smoothstep(0.0, 0.1, vUv.y) * smoothstep(0.0, 0.1, 1.0 - vUv.y);
      vec3 finalColor = uColor + edge * 0.5;
      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `
};

const DataNodes = React.memo(() => {
  const nodes     = useStore((s) => s.nodes);
  const meshRef   = useRef();
  const matRef    = useRef();
  const isLow     = useStore((s) => s.perfTier === 'low');

  useEffect(() => {
    if (!meshRef.current) return;
    nodes.forEach((n, i) => {
      dummy.position.set(n.position[0], n.position[1], n.position[2]);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    // Only invalidate if NOT on low tier to save CPU
    if (!isLow) state.invalidate();
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, nodes.length]}
      frustumCulled={false}
    >
      <boxGeometry args={[0.3, 1.2, 0.3]} />
      <shaderMaterial
        ref={matRef}
        attach="material"
        args={[DataNodeMaterial]}
        transparent
        depthWrite={false}
      />
    </instancedMesh>
  );
});

// ── WebGL context cleanup on unmount ───────────────────────
const GLCleanup = () => {
  const { gl } = useThree();
  useEffect(() => {
    return () => { gl.dispose(); };
  }, [gl]);
  return null;
};

// ── Main Scene ─────────────────────────────────────────────
export default function CyberScene() {
  const perfTier = useStore((s) => s.perfTier);
  const isLow    = perfTier === 'low';

  return (
    <div
      className="absolute inset-0 z-0"
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      aria-label="Interactive 3D SOC visualization"
      role="img"
    >
      <Canvas
        frameloop="demand"
        dpr={isLow ? [0.6, 0.8] : [0.8, 1.4]}
        camera={{ position: [0, 0, 18], fov: 50 }}
        gl={{
          antialias: !isLow,
          stencil: false,
          depth: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#050810', 1);
        }}
      >
        <Suspense fallback={null}>
          <GLCleanup />
          <CameraRig />

          <color attach="background" args={['#050810']} />
          <fog attach="fog" args={['#050810', 25, 55]} />

          {/* Lights — only 1 shadow free setup */}
          <ambientLight intensity={0.15} />
          <pointLight position={[10, 8, 10]}  intensity={1.2} color="#007bff" castShadow={false} />
          <pointLight position={[-10, -5, 5]} intensity={0.8} color="#7c3aed" castShadow={false} />
          <spotLight
            position={[0, 20, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1.5}
            color="#00f3ff"
            castShadow={false}
          />

          <Stars
            radius={80}
            depth={40}
            count={isLow ? 1000 : 2500}
            factor={3}
            saturation={0}
            fade
            speed={0.5}
          />

          <Avatar />
          <DataNodes />
          <CursorTrail />

          {!isLow && (
            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom
                intensity={0.8}
                mipmapBlur={false}
                radius={0.5}
                luminanceThreshold={0.7}
              />
              <ChromaticAberration offset={[0.0008, 0.0008]} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #050810 0%, transparent 40%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
