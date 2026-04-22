import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PerformanceMonitor } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import Avatar from './Avatar';
import CursorTrail from './CursorTrail';
import { useStore } from '../systems/store';

// ── Suppress R3F-internal THREE.Clock deprecation (three@0.183 / r3f@9.x) ──
// THREE.warn is a read-only getter — we must intercept console.warn instead.
if (typeof window !== 'undefined') {
  const _cWarn = console.warn.bind(console);
  console.warn = (...args) => {
    const msg = String(args[0] ?? '');
    if (msg.includes('THREE.THREE.Clock') || (msg.includes('Clock') && msg.includes('deprecated'))) return;
    _cWarn(...args);
  };
}


// ── Pre-allocated — NEVER allocate new objects in useFrame ──
const _camTarget = new THREE.Vector3();
const _lookAt    = new THREE.Vector3(0, 0, 0);

// ── Camera Rig ─────────────────────────────────────────────
const CameraRig = React.memo(() => {
  const { camera, mouse, invalidate } = useThree();  // FIXED: use useThree().invalidate

  const isAutoScanning = useStore((s) => s.isAutoScanning);
  const isSingularity = useStore((s) => s.isSingularity);

  useFrame((state, delta) => {
    if (isSingularity) {
      // Warp effect: Zoom in and increase FOV to simulate high speed
      camera.fov = THREE.MathUtils.lerp(camera.fov, 110, delta * 3);
      camera.updateProjectionMatrix();
      // Target is deep inside the blackhole center
      _camTarget.set(0, 0, 4); 
    } else {
      camera.fov = THREE.MathUtils.lerp(camera.fov, 50, delta * 2);
      camera.updateProjectionMatrix();
      _camTarget.set(mouse.x * 1.5, mouse.y * 0.8, 18);
    }

    const lf = 1 - Math.pow(0.05, delta);
    const prevX = camera.position.x;
    const prevY = camera.position.y;
    camera.position.lerp(_camTarget, lf);
    camera.lookAt(_lookAt);
    if (Math.abs(camera.position.x - prevX) > 0.0001 ||
        Math.abs(camera.position.y - prevY) > 0.0001 || isSingularity) {
      invalidate();
    }
  });
  return null;
});

// ── BlackHole 3D ───────────────────────────────────────────
const BlackHoleMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uIsSingularity: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uIsSingularity;
    
    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      
      // Event horizon
      float radius = mix(0.15, 0.4, uIsSingularity);
      float blackhole = smoothstep(radius, radius + 0.02, dist);
      
      // Accretion disk
      float diskOuter = radius + mix(0.1, 0.4, uIsSingularity);
      float disk = smoothstep(diskOuter, radius, dist);
      
      // Rotation effect
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float spiral = sin(angle * 5.0 + uTime * 3.0) * 0.5 + 0.5;
      
      // Color
      vec3 color = mix(vec3(0.0), vec3(0.0, 0.8, 1.0) * spiral * disk, blackhole);
      
      // Distortion ring
      float ring = smoothstep(diskOuter + 0.05, diskOuter, dist) * smoothstep(radius, radius + 0.05, dist);
      color += vec3(0.0, 0.5, 1.0) * ring * uIsSingularity * (0.5 + 0.5 * sin(uTime * 10.0));
      
      gl_FragColor = vec4(color, 1.0 - blackhole + (disk * blackhole));
    }
  `
};

const BlackHole3D = React.memo(() => {
  const isSingularity = useStore((s) => s.isSingularity);
  const meshRef = useRef();
  const matRef = useRef();
  
  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      matRef.current.uniforms.uIsSingularity.value = THREE.MathUtils.lerp(
        matRef.current.uniforms.uIsSingularity.value,
        isSingularity ? 1 : 0,
        delta * 2
      );
    }
    if (meshRef.current) {
      // Orbital drift and position offset to top-left
      const t = state.clock.elapsedTime;
      // Normal position: top-left (-5, 3, 5). Singularity: center (0,0,5)
      const targetX = isSingularity ? 0 : -5 + Math.sin(t * 0.5) * 0.5;
      const targetY = isSingularity ? 0 : 3 + Math.cos(t * 0.3) * 0.5;
      const targetZ = isSingularity ? 5 : 5;
      
      meshRef.current.position.set(
        THREE.MathUtils.lerp(meshRef.current.position.x, targetX, delta * 2),
        THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 2),
        THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 2)
      );

      // Scale up when singularity
      const targetScale = isSingularity ? 15 : 4;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 2));
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        args={[BlackHoleMaterial]}
        transparent
        // Make sure it always faces camera
        onBeforeCompile={(shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            `#include <project_vertex>`,
            `
            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            mvPosition.xy += position.xy * vec2( length( modelMatrix[0] ), length( modelMatrix[1] ) );
            gl_Position = projectionMatrix * mvPosition;
            `
          );
        }}
      />
    </mesh>
  );
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
    uIsSingularity: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying float vInstanceId;
    uniform float uTime;
    uniform float uIsSingularity;
    
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

      vec4 instanceWorldPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      
      // Sucking physics: Pull nodes towards center (0,0,5) during singularity
      vec3 targetCenter = vec3(0.0, 0.0, 5.0);
      vec3 pullDir = normalize(targetCenter - instanceWorldPos.xyz);
      float dist = distance(instanceWorldPos.xyz, targetCenter);
      
      // Scale down as they get sucked in
      float suckFactor = uIsSingularity * clamp(1.0 - dist / 20.0, 0.0, 1.0);
      pos *= (1.0 - suckFactor * 0.8);

      vec4 worldPosition = instanceMatrix * vec4(pos, 1.0);
      
      // Apply offset pull to world position
      worldPosition.xyz = mix(worldPosition.xyz, targetCenter, suckFactor * 0.9);

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

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      matRef.current.uniforms.uIsSingularity.value = THREE.MathUtils.lerp(
        matRef.current.uniforms.uIsSingularity.value,
        useStore.getState().isSingularity ? 1 : 0,
        delta * 2
      );
    }
    // Only invalidate if NOT on low tier to save CPU
    if (!isLow) state.invalidate();
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, nodes.length]}
      frustumCulled={true}
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
  const isSingularity = useStore((s) => s.isSingularity);
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
          
          // Debugging & Resilience: Handle Context Loss
          const canvas = gl.domElement;
          const handleContextLost = (e) => {
            e.preventDefault();
            console.warn('TACTICAL_HUD: WebGL Context Lost. Re-initializing...');
          };
          const handleContextRestored = () => {
             console.log('TACTICAL_HUD: WebGL Context Restored.');
          };

          canvas.addEventListener('webglcontextlost', handleContextLost, false);
          canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

          // Return cleanup for the listeners
          return () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);
            gl.dispose();
          };
        }}
      >
        <PerformanceMonitor
          ms={200}
          iterations={3}
          threshold={0.75} // 45 fps trigger
          onIncline={() => {
            const current = useStore.getState().perfTier;
            if (current === 'low') useStore.getState().setPerfTier('mid');
            else if (current === 'mid') useStore.getState().setPerfTier('high');
          }}
          onDecline={() => {
            const current = useStore.getState().perfTier;
            if (current === 'high') useStore.getState().setPerfTier('mid');
            else if (current === 'mid') useStore.getState().setPerfTier('low');
          }}
          onFallback={() => useStore.getState().setPerfTier('low')}
        />
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
            count={perfTier === 'high' ? 3500 : perfTier === 'mid' ? 1800 : 800}
            factor={3}
            saturation={0}
            fade
            speed={isSingularity ? 8 : 0.5} 
          />

          <BlackHole3D />
          <Avatar />
          <DataNodes />
          <CursorTrail />

          {!isLow && (
            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom
                intensity={perfTier === 'high' ? 0.8 : 0.4}
                mipmapBlur={false}
                radius={0.5}
                luminanceThreshold={0.7}
              />
              {perfTier === 'high' && <ChromaticAberration offset={[0.0008, 0.0008]} />}
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
