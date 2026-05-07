import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Stars, Sky, Cloud, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { MascotState } from './MascotBlob';

interface BoatSceneProps {
  state: MascotState;
  dailyBudget: number;
  size?: number;
}

// Componente per il Mare 3D
const Ocean = ({ state }: { state: MascotState }) => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  const config = useMemo(() => {
    const colors = {
      happy: "#1A4A54",
      neutral: "#16353A",
      sad: "#0F2A2A",
      concerned: "#0A1F1F",
      shocked: "#051515"
    };
    const waveSpeeds = { happy: 0.5, neutral: 1, sad: 2, concerned: 3, shocked: 5 };
    return { color: colors[state], speed: waveSpeeds[state] };
  }, [state]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * config.speed;
    mesh.current.position.y = Math.sin(t) * 0.1;
    mesh.current.rotation.x = -Math.PI / 2 + Math.cos(t * 0.5) * 0.02;
  });

  return (
    <mesh ref={mesh} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshStandardMaterial 
        color={config.color} 
        roughness={0.1} 
        metalness={0.8} 
        transparent 
        opacity={0.9}
      />
    </mesh>
  );
};

// Componente Barca 3D (Low-Poly Dredge Style)
const Boat = ({ state }: { state: MascotState }) => {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const intensity = { happy: 0.1, neutral: 0.2, sad: 0.5, concerned: 0.8, shocked: 1.2 }[state.state as MascotState] || 0.2;
    group.current.rotation.z = Math.sin(t * 1.5) * 0.05 * intensity;
    group.current.rotation.x = Math.cos(t * 1.2) * 0.03 * intensity;
    group.current.position.y = Math.sin(t * 2) * 0.05 * intensity;
  });

  return (
    <group ref={group}>
      {/* Scafo */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.4, 0.6]} />
        <meshStandardMaterial color="#121212" />
      </mesh>
      <mesh position={[0.6, 0.1, 0]} castShadow>
        <coneGeometry args={[0.35, 0.6, 4]} rotation={[0, 0, -Math.PI / 2]} />
        <meshStandardMaterial color="#121212" />
      </mesh>
      
      {/* Cabina */}
      <mesh position={[-0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.4]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      
      {/* Finestra Illuminata */}
      <mesh position={[-0.1, 0.45, 0.21]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshBasicMaterial color="#F1C40F" />
      </mesh>
      <pointLight position={[-0.1, 0.45, 0.3]} intensity={0.5} color="#F1C40F" distance={2} />

      {/* Albero */}
      <mesh position={[0.2, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 1.2]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Luci di navigazione */}
      <mesh position={[-0.5, 0.3, 0.3]}>
        <sphereGeometry args={[0.03]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <pointLight position={[-0.5, 0.3, 0.3]} intensity={0.8} color="red" distance={1} />
    </group>
  );
};

const BoatScene = ({ state, dailyBudget, size = 300 }: BoatSceneProps) => {
  const weatherLabels: Record<MascotState, string> = {
    happy: "Bonaccia",
    neutral: "Vento Leggero",
    sad: "Mare Mosso",
    concerned: "Tempesta",
    shocked: "Uragano"
  };

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden shadow-2xl bg-black" style={{ height: size }}>
      {/* UI Overlay */}
      <div className="absolute top-8 left-8 z-50 pointer-events-none">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Meteo</p>
        <h2 className="text-2xl font-bold text-[#F4EBD0] tracking-tight drop-shadow-md">{weatherLabels[state]}</h2>
      </div>

      <div className="absolute top-8 right-8 z-50 text-right pointer-events-none">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Oggi Puoi</p>
        <h2 className="text-3xl font-bold text-[#F4EBD0] tracking-tighter drop-shadow-md">€ {dailyBudget.toFixed(0)}</h2>
      </div>

      {/* Scena 3D */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={35} />
        
        {/* Illuminazione */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        {/* Atmosfera */}
        <Sky 
          sunPosition={[100, 10, 100]} 
          turbidity={state === 'happy' ? 0.1 : 10} 
          rayleigh={state === 'happy' ? 0.5 : 5} 
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Sparkles 
          count={40} 
          scale={5} 
          size={2} 
          speed={0.4} 
          opacity={0.2} 
          color="#F4EBD0" 
        />

        {/* Elementi Scena */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Boat state={state} />
        </Float>
        
        <Ocean state={state} />

        {/* Nebbia */}
        <fog attach="fog" args={['#051515', 5, 15]} />
      </Canvas>

      {/* Overlay Gradiente per profondità */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
};

export default BoatScene;