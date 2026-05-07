import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, ContactShadows, Sky, Center } from '@react-three/drei';
import * as THREE from 'three';
import { MascotState } from './MascotBlob';

interface BoatSceneProps {
  state: MascotState;
  dailyBudget: number;
  size?: number;
}

const FishingBoat = ({ state }: { state: MascotState }) => {
  const group = useRef<THREE.Group>(null);

  const config = {
    happy: { speed: 1, factor: 0.2 },
    neutral: { speed: 2, factor: 0.5 },
    sad: { speed: 4, factor: 1.2 },
    concerned: { speed: 6, factor: 2.0 },
    shocked: { speed: 10, factor: 3.5 }
  }[state] || { speed: 2, factor: 0.5 };

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(t * config.speed) * 0.08 * config.factor;
    group.current.rotation.x = Math.sin(t * config.speed * 0.8) * 0.04 * config.factor;
    group.current.rotation.z = Math.cos(t * config.speed * 0.5) * 0.04 * config.factor;
  });

  return (
    <group ref={group} rotation={[0, -Math.PI / 4, 0]} scale={1.2}>
      {/* Scafo Principale */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2.8, 0.7, 1.2]} />
        <meshStandardMaterial color="#064e3b" roughness={0.4} />
      </mesh>
      
      {/* Prua */}
      <mesh position={[1.6, 0.6, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
        <boxGeometry args={[1.2, 1, 1.2]} />
        <meshStandardMaterial color="#064e3b" />
      </mesh>

      {/* Linea di galleggiamento */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[3, 0.2, 1.25]} />
        <meshStandardMaterial color="#991b1b" />
      </mesh>

      {/* Cabina */}
      <group position={[-0.2, 1.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.8, 0.9]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.4, 0.1, 1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.61, 0.1, 0]}>
          <boxGeometry args={[0.02, 0.4, 0.6]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Alberi */}
      <mesh position={[1.2, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 2.2]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[-1.2, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.05, 1.6]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Parabordi */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0.62]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.15, 0.06, 12, 24]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );
};

const Sea = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
      <circleGeometry args={[15, 32]} />
      <meshStandardMaterial 
        color="#075985" 
        transparent 
        opacity={0.8} 
        roughness={0.2}
      />
    </mesh>
  );
};

const BoatScene = ({ state, dailyBudget, size = 300 }: BoatSceneProps) => {
  return (
    <div className="relative w-full rounded-[40px] overflow-hidden shadow-2xl bg-[#0c1a2b]" style={{ height: size }}>
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
        <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={35} />
        
        <ambientLight intensity={1} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#38bdf8" />

        <Sky sunPosition={[100, 10, 100]} turbidity={0.1} rayleigh={0.5} />

        <Suspense fallback={null}>
          <Center top position={[0, 0, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
              <FishingBoat state={state} />
            </Float>
          </Center>
          <Sea />
        </Suspense>
        
        <ContactShadows 
          position={[0, -0.25, 0]} 
          opacity={0.4} 
          scale={15} 
          blur={2} 
          far={5} 
        />
      </Canvas>

      {/* Effetto Pioggia */}
      {(state === 'sad' || state === 'concerned' || state === 'shocked') && (
        <div className="absolute inset-0 pointer-events-none z-40 bg-blue-950/10 backdrop-blur-[0.5px]">
          <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default BoatScene;