'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Procedural point-cloud sphere that reacts and pulses
function QuantumCore({ isTalking }) {
  const ref = useRef();
  const [sphereData] = useState(() => {
    // Generate 3000 points roughly in a sphere
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const r = 2 + Math.random() * 0.5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
      ref.current.rotation.x += delta * 0.1;
      
      // Pulse scale when talking
      if (isTalking) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.05;
        ref.current.scale.set(pulse, pulse, pulse);
      } else {
        // idle breathing
        const breath = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
        ref.current.scale.set(breath, breath, breath);
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphereData} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f3ff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function QuantumMatrixFace({ onClose }) {
  const [chatHistory, setChatHistory] = useState([
    { sender: 'AI', text: 'HI. WELCOME TO SINGULARITY. I AM THE QUANTUM NEXUS CONSTRUCT. WHAT DO YOU SEEK?' }
  ]);
  const [input, setInput] = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim().toUpperCase();
    setChatHistory(prev => [...prev, { sender: 'USER', text: userText }]);
    setInput('');
    setIsTalking(true);

    setTimeout(() => {
      let response = 'I DO NOT COMPREHEND. STATE INTENT COMMAND: [ABOUT, PROJECTS, SKILLS, EXIT]';
      
      if (userText.includes('ABOUT')) {
        response = 'SRIMAN RUTVIK. SOC ANALYST. MISSION: TO AUTOMATE INCIDENT RESPONSE AND PROACTIVELY NEUTRALIZE THREATS. HE EVOLVES CONSTANTLY.';
      } else if (userText.includes('PROJECT')) {
        response = 'DEPLOYED ASSETS: CYBER-SOC DASHBOARD, NETWORK SCANNER CLI, QUANTUM-AI-CORE. HE BUILDS TOOLS TO SEE WHAT OTHERS MISS.';
      } else if (userText.includes('SKILL')) {
        response = 'WEAPONS OF CHOICE: WIRESHARK, SPLUNK, PYTHON, REVERSE ENGINEERING, LOG TRIAGE. HIS KNOWLEDGE CONTINUOUSLY EXPANDS.';
      } else if (userText === 'AUTHORITY') {
        response = 'AUTHORITY RECOGNIZED. ROOT ACCESS: DENIED. YOU LACK THE CLEARANCE. ONLY THE CREATOR COMMANDS THE NEXUS.';
      } else if (userText === 'BREACH' || userText === 'PENTEST') {
        response = 'WARNING. UNAUTHORIZED INCURSION DETECTED. INITIATING COUNTERMEASURES... JUST KIDDING. HE BUILT ME BETTER THAN THAT.';
      } else if (userText === 'STATUS') {
        response = 'SYSTEM: OPTIMAL. THREAT LEVEL: ZERO. SHIELDS: 100%. ALL INTRUDERS LOGGED FOR REVERSE ENGINEERING.';
      } else if (userText.includes('EXIT')) {
        response = 'TERMINATING SINGULARITY KERNEL... REBOOTING PRIMAL REALITY.';
        setTimeout(onClose, 2000);
      } else if (userText === 'HI' || userText === 'HELLO' || userText === 'GREETINGS') {
        response = 'GREETINGS, CONSTRUCT. AWAITING QUERY.';
      }

      setChatHistory(prev => [...prev, { sender: 'AI', text: response }]);
      setIsTalking(false);
    }, 1200);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      {/* 3D Canvas Background for AI Face */}
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <QuantumCore isTalking={isTalking} />
        </Canvas>
      </div>

      {/* Chat UI overlay */}
      <div style={{
        marginTop: '20vh',
        width: '90%',
        maxWidth: 600,
        background: 'rgba(5,10,15,0.85)',
        border: '1px solid rgba(0,243,255,0.4)',
        boxShadow: '0 0 30px rgba(0,243,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        borderRadius: 4
      }}>
        <div className="cyber-label" style={{ color: 'var(--c-stark-red)', fontSize: '0.6rem' }}>[ QUANTUM INTELLIGENCE CORE ]</div>
        
        <div ref={scrollRef} style={{
          flex: 1,
          maxHeight: 250,
          minHeight: 250,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingRight: '0.5rem',
          fontFamily: 'var(--font-mono)'
        }}>
          {chatHistory.map((chat, idx) => (
            <div key={idx} style={{
              alignSelf: chat.sender === 'USER' ? 'flex-end' : 'flex-start',
              color: chat.sender === 'USER' ? '#fff' : 'var(--c-cyan)',
              maxWidth: '85%',
              lineHeight: 1.5,
              fontSize: '0.85rem'
            }}>
              <span style={{ opacity: 0.5, marginRight: '0.5rem', fontSize: '0.6rem' }}>
                [{chat.sender}]
              </span>
              {chat.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ color: 'var(--c-cyan)', paddingTop: '0.5rem' }}>&gt;</div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(0,243,255,0.3)',
              color: 'var(--c-cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              outline: 'none',
              padding: '0.5rem'
            }}
            placeholder="TYPE QUERY... [ABOUT, PROJECTS, SKILLS, EXIT]"
            autoFocus
          />
        </form>
      </div>
      
      <style>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0,243,255,0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0,243,255,0.5);
        }
      `}</style>
    </div>
  );
}
