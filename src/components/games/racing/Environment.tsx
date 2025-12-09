import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnvironmentProps {
  roadOffset: number;
  nightMode?: boolean;
}

// Neon-lit cityscape buildings
const Building = ({ position, height, width }: { position: [number, number, number]; height: number; width: number }) => {
  const neonColors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff6600'];
  const color = neonColors[Math.floor(Math.random() * neonColors.length)];
  
  return (
    <group position={position}>
      {/* Building body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Neon accent lines */}
      <mesh position={[0, height * 0.3, width / 2 + 0.05]}>
        <planeGeometry args={[width * 0.8, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, height * 0.6, width / 2 + 0.05]}>
        <planeGeometry args={[width * 0.8, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Window glow */}
      {Array.from({ length: Math.floor(height / 3) }).map((_, i) => (
        <pointLight 
          key={i}
          position={[0, 2 + i * 3, width / 2]} 
          intensity={0.1} 
          color={color}
          distance={5}
        />
      ))}
    </group>
  );
};

// Dynamic road with reflections
const Road = ({ zPosition, wetRoad = true }: { zPosition: number; wetRoad?: boolean }) => {
  return (
    <group position={[0, -0.5, zPosition]}>
      {/* Main road with gradient */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 100]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={wetRoad ? 0.6 : 0.2} 
          roughness={wetRoad ? 0.3 : 0.8}
        />
      </mesh>
      
      {/* Neon road edges */}
      <mesh position={[-7.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 100]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <mesh position={[7.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 100]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      
      {/* Lane markers - animated glow */}
      {Array.from({ length: 25 }).map((_, i) => (
        <group key={i}>
          <mesh position={[-4.5, 0.02, -48 + i * 4]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 2.5]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
          <mesh position={[4.5, 0.02, -48 + i * 4]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 2.5]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
          {/* Center lane */}
          <mesh position={[0, 0.02, -48 + i * 4]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, 2]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Environment = ({ roadOffset, nightMode = true }: EnvironmentProps) => {
  const buildingsRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (buildingsRef.current) {
      // Parallax effect for buildings
    }
  });

  return (
    <>
      {/* Sky gradient */}
      <mesh>
        <sphereGeometry args={[300, 32, 32]} />
        <meshBasicMaterial 
          color="#0a0a1a" 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#0a0a1a', 40, 150]} />

      {/* Road segments */}
      <Road zPosition={-50 + (roadOffset % 100)} />
      <Road zPosition={-150 + (roadOffset % 100)} />

      {/* Ground beside road - grass/terrain */}
      <mesh position={[-20, -0.55, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 300]} />
        <meshStandardMaterial color="#0a1a0a" />
      </mesh>
      <mesh position={[20, -0.55, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 300]} />
        <meshStandardMaterial color="#0a1a0a" />
      </mesh>

      {/* Cityscape buildings */}
      <group ref={buildingsRef}>
        {Array.from({ length: 20 }).map((_, i) => (
          <group key={i}>
            <Building 
              position={[-25, 0, -30 - i * 30 + (roadOffset % 600)]} 
              height={10 + Math.random() * 20} 
              width={5 + Math.random() * 5}
            />
            <Building 
              position={[25, 0, -30 - i * 30 + (roadOffset % 600)]} 
              height={10 + Math.random() * 20} 
              width={5 + Math.random() * 5}
            />
          </group>
        ))}
      </group>

      {/* Neon street lights */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={i}>
          {/* Left side */}
          <mesh position={[-9, 4, -20 - i * 25 + (roadOffset % 375)]}>
            <cylinderGeometry args={[0.08, 0.08, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[-9, 7.5, -20 - i * 25 + (roadOffset % 375)]}>
            <boxGeometry args={[0.5, 0.2, 0.3]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <pointLight 
            position={[-9, 7, -20 - i * 25 + (roadOffset % 375)]} 
            intensity={0.5} 
            color="#00ffff" 
            distance={20}
          />
          
          {/* Right side */}
          <mesh position={[9, 4, -20 - i * 25 + (roadOffset % 375)]}>
            <cylinderGeometry args={[0.08, 0.08, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[9, 7.5, -20 - i * 25 + (roadOffset % 375)]}>
            <boxGeometry args={[0.5, 0.2, 0.3]} />
            <meshBasicMaterial color="#ff00ff" />
          </mesh>
          <pointLight 
            position={[9, 7, -20 - i * 25 + (roadOffset % 375)]} 
            intensity={0.5} 
            color="#ff00ff" 
            distance={20}
          />
        </group>
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 30, 10]} intensity={0.3} color="#6666ff" />
      
      {/* Subtle moon/sky light */}
      <pointLight position={[0, 100, -100]} intensity={0.3} color="#4444ff" />
    </>
  );
};

export default Environment;
