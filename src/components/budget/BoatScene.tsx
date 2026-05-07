import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Stars, Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { MascotState } from './MascotBlob';

interface BoatSceneProps {
  state: MascotState;
  dailyBudget: number;
  size?: number;
}

// Componente per il Mare 3D
const Ocean = ({ state: mascotState }: { state: MascotState }) => {
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
    return { color: colors[mascotState], speed: waveSpeeds[mascotState] };
  }, [mascotState]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * config.speed;
    mesh.current.position.y = -0.8 + Math.sin(t) * 0.05;
    mesh.current.rotation.x = -Math.PI / 2 + Math.cos(t * 0.5) * 0.01;
  });

  return (
    <mesh ref={mesh} receiveShadow>
      <planeGeometry args={[40, 40, 32, 32]} />
      <meshStandardMaterial 
        color={config.color} 
        roughness={0.1} 
        metalness={0.6} 
        transparent 
        opacity={0.9}
      />
    </mesh>
  );
};

// Componente Barca 3D (Low-Poly Dredge Style)
const Boat = ({ state: mascotState }: { state: MascotState }) => {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const intensityMap: Record<MascotState, number> = { 
      happy: 0.1, 
      neutral: 0.2, 
      sad: 0.5, 
      concerned: 0.8, 
      shocked: 1.2 
    };
    const intensity = intensityMap[mascotState] || 0.2;
    
    group.current.rotation.z = Math.sin(t * 1.5) * 0.05 * intensity;
    group.current.rotation.x = Math.cos(t * 1.2) * 0.03 * intensity;
    group.current.position.y = -0.4 + Math.sin(t * 2) * 0.05 * intensity;
  });

  return (
    <group ref={group}>
      {/* Scafo - Legno Scuro */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.5, 0.7]} />
        <meshStandardMaterial color="#2C1E12" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.1, 0]} castShadow>
        <coneGeometry args={[0.4, 0.7, 4]} rotation={[0, 0, -Math.PI / 2]} />
        <meshStandardMaterial color="#2C1E12" roughness={0.8} />
      </mesh>
      
      {/* Cabina */}
      <mesh position={[-0.2, 0.45, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.5]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      
      {/* Finestra Illuminata */}
      <mesh position={[-0.1, 0.5, 0.26]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshBasicMaterial color="#F1C40F" />
      </mesh>
      <pointLight position={[-0.1, 0.5, 0.4]} intensity={1.5} color="#F1C40F" distance={3} />

      {/* Albero */}
      <mesh position={[0.2, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 1.5]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Luci di navigazione */}
      <mesh position={[-0.6, 0.3, 0.35]}>
        <sphereGeometry args={[0.04]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>
      <pointLight position={[-0.6, 0.3, 0.35]} intensity={1} color="red" distance={2} />
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
    <div className="relative w-full rounded-[32px] overflow-hidden shadow-2xl bg-[#051515]" style={{ height: size }}>
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
      <Canvas shadows camera={{ position: [4, 3, 6], fov: 35 }}>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        {/* Illuminazione */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight position={[-5, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        {/* Atmosfera */}
        <Sky 
          sunPosition={[100, 20, 100]} 
          turbidity={state === 'happy' ? 0.1 : 8} 
          rayleigh={state === 'happy' ? 0.5 : 3} 
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Sparkles 
          count={50} 
          scale={6} 
          size={2} 
          speed={0.3} 
          opacity={0.4} 
          color="#F4EBD0" 
        />

        {/* Elementi Scena */}
        <Boat state={state} />
        <Ocean state={state} />

        {/* Nebbia per profondità */}
        <fog attach="fog" args={['#051515', 5, 20]} />
      </Canvas>

      {/* Overlay Gradiente */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#051515]/60 via-transparent to-transparent" />
    </div>
  );
};

export default BoatScene;