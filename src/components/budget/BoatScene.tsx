import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { MascotState } from './MascotBlob';

interface BoatSceneProps {
  state: MascotState;
  dailyBudget: number;
  size?: number;
}

// Componente Barca 3D Low-Poly
const FishingBoat = ({ state }: { state: MascotState }) => {
  const group = useRef<THREE.Group>(null);

  // Animazione di galleggiamento basata sullo stato del budget
  const config = {
    happy: { speed: 1, factor: 0.5 },
    neutral: { speed: 2, factor: 1 },
    sad: { speed: 4, factor: 2 },
    concerned: { speed: 6, factor: 3 },
    shocked: { speed: 10, factor: 5 }
  }[state] || { speed: 2, factor: 1 };

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    
    // Movimento sussultorio (bobbing)
    group.current.position.y = Math.sin(t * config.speed) * 0.1 * config.factor;
    // Rollio e Beccheggio
    group.current.rotation.x = Math.sin(t * config.speed * 0.8) * 0.05 * config.factor;
    group.current.rotation.z = Math.cos(t * config.speed * 0.5) * 0.05 * config.factor;
  });

  return (
    <group ref={group} rotation={[0, -Math.PI / 4, 0]}>
      {/* Scafo (Hull) - Teal/Verde scuro */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.5, 0.6, 1]} />
        <meshStandardMaterial color="#134e4a" />
      </mesh>
      {/* Prua (Bow) */}
      <mesh position={[1.5, 0.35, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color="#134e4a" />
      </mesh>
      {/* Linea di galleggiamento rossa */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[2.6, 0.1, 1.05]} />
        <meshStandardMaterial color="#8b1a1a" />
      </mesh>

      {/* Cabina (Cabin) - Legno/Arancio */}
      <group position={[-0.2, 0.8, 0]}>
        <mesh>
          <boxGeometry args={[1, 0.8, 0.8]} />
          <meshStandardMaterial color="#b45309" />
        </mesh>
        {/* Tetto */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.2, 0.1, 0.9]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Finestre */}
        <mesh position={[0.51, 0.1, 0]}>
          <boxGeometry args={[0.01, 0.4, 0.6]} />
          <meshStandardMaterial color="#1e293b" emissive="#f1c40f" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Alberi (Masts) */}
      <mesh position={[1, 1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[-1, 1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.5]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Parabordi (Gomme/Tires) */}
      {[ -0.5, 0, 0.5 ].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0.52]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.15, 0.05, 8, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}

      {/* Argano/Gru posteriore */}
      <group position={[-1.1, 0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.03, 0.03, 1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    </group>
  );
};

// Mare animato
const Sea = ({ state }: { state: MascotState }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mesh.current) return;
    // Semplice animazione della texture o della posizione per simulare onde
    mesh.current.position.y = -0.5 + Math.sin(state.clock.getElapsedTime()) * 0.02;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial 
        color="#0f172a" 
        transparent 
        opacity={0.8} 
        roughness={0.1}
        metalness={0.2}
      />
    </mesh>
  );
};

const BoatScene = ({ state, dailyBudget, size = 300 }: BoatSceneProps) => {
  return (
    <div className="relative w-full rounded-[40px] overflow-hidden shadow-2xl bg-slate-900" style={{ height: size }}>
      {/* UI Overlay */}
      <div className="absolute top-8 left-8 z-50 pointer-events-none">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Meteo</p>
        <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
          {state === 'happy' ? 'Bonaccia' : state === 'shocked' ? 'Uragano' : 'Navigazione'}
        </h2>
      </div>

      <div className="absolute top-8 right-8 z-50 text-right pointer-events-none">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Oggi Puoi</p>
        <h2 className="text-3xl font-bold text-white tracking-tighter drop-shadow-lg">€ {dailyBudget.toFixed(0)}</h2>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={35} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <FishingBoat state={state} />
        </Float>

        <Sea state={state} />
        
        <ContactShadows position={[0, -0.45, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
        <Environment preset="city" />
      </Canvas>

      {/* Effetto Pioggia per stati negativi */}
      {(state === 'sad' || state === 'concerned' || state === 'shocked') && (
        <div className="absolute inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[1px]" />
          <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default BoatScene;