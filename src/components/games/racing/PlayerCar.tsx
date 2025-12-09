import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameState } from './types';

interface PlayerCarProps {
  gameState: GameState;
}

const PlayerCar = ({ gameState }: PlayerCarProps) => {
  const cockpitRef = useRef<THREE.Group>(null);
  const wheelRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (wheelRef.current) {
      // Rotate steering wheel based on steering input
      wheelRef.current.rotation.z = -gameState.steering * 0.8;
    }
    
    if (cockpitRef.current && gameState.isDrifting) {
      // Add subtle cockpit shake during drift
      cockpitRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.02;
    }
  });

  const nitroGlowColor = gameState.nitroStage === 'shockwave' ? '#ff00ff' : 
                         gameState.nitroStage === 'perfect' ? '#00ffff' : '#ff6600';

  return (
    <group ref={cockpitRef} position={[gameState.position.x, 0, 0]}>
      {/* Dashboard base - sleek modern design */}
      <mesh position={[0, 0.25, 0.9]}>
        <boxGeometry args={[2.4, 0.35, 0.9]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Dashboard top accent */}
      <mesh position={[0, 0.45, 0.85]}>
        <boxGeometry args={[2.3, 0.05, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Steering wheel column */}
      <group ref={wheelRef} position={[0, 0.55, 0.5]}>
        {/* Wheel rim */}
        <mesh rotation={[Math.PI / 3.5, 0, 0]}>
          <torusGeometry args={[0.22, 0.025, 8, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Wheel spokes */}
        <mesh rotation={[Math.PI / 3.5, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 3.5, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Center hub with accent */}
        <mesh rotation={[Math.PI / 3.5, 0, 0]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
          <meshBasicMaterial color={gameState.nitroActive ? nitroGlowColor : '#333333'} />
        </mesh>
      </group>

      {/* Digital speedometer screen */}
      <mesh position={[0, 0.5, 1.1]}>
        <planeGeometry args={[0.6, 0.25]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0, 0.5, 1.11]}>
        <planeGeometry args={[0.55, 0.2]} />
        <meshBasicMaterial color={gameState.nitroActive ? '#ff3300' : '#00ff88'} />
      </mesh>

      {/* Windshield frame - A-pillars */}
      <mesh position={[-1.2, 0.9, 0.3]}>
        <boxGeometry args={[0.06, 1, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1.2, 0.9, 0.3]}>
        <boxGeometry args={[0.06, 1, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Top frame */}
      <mesh position={[0, 1.4, 0.3]}>
        <boxGeometry args={[2.5, 0.06, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rearview mirror */}
      <mesh position={[0, 1.2, 0.5]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Side vents with neon glow */}
      <mesh position={[-1.1, 0.3, 0.6]}>
        <boxGeometry args={[0.1, 0.15, 0.3]} />
        <meshBasicMaterial color={gameState.nitroActive ? nitroGlowColor : '#333333'} />
      </mesh>
      <mesh position={[1.1, 0.3, 0.6]}>
        <boxGeometry args={[0.1, 0.15, 0.3]} />
        <meshBasicMaterial color={gameState.nitroActive ? nitroGlowColor : '#333333'} />
      </mesh>

      {/* Nitro glow light when active */}
      {gameState.nitroActive && (
        <pointLight 
          position={[0, 0.5, 1]} 
          intensity={1} 
          color={nitroGlowColor}
          distance={5}
        />
      )}
    </group>
  );
};

export default PlayerCar;
