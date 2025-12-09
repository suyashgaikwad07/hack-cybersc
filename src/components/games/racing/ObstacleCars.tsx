import { useMemo } from 'react';
import * as THREE from 'three';
import { ObstacleCar } from './types';

interface ObstacleCarsProps {
  obstacles: ObstacleCar[];
}

// Supercar-style obstacle
const SuperCar = ({ position, color, variant }: { position: THREE.Vector3; color: string; variant: number }) => {
  const accentColor = useMemo(() => {
    const accents = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];
    return accents[variant % accents.length];
  }, [variant]);

  return (
    <group position={position}>
      {/* Main body - low and sleek */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.9, 0.45, 4.2]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Cabin - aerodynamic */}
      <mesh position={[0, 0.7, -0.2]}>
        <boxGeometry args={[1.7, 0.4, 2]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.75, 0.8]} rotation={[0.4, 0, 0]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial color="#111133" metalness={1} roughness={0} />
      </mesh>
      
      {/* Hood scoop */}
      <mesh position={[0, 0.55, 0.8]}>
        <boxGeometry args={[0.4, 0.15, 0.8]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Rear spoiler */}
      <mesh position={[0, 0.9, -1.8]}>
        <boxGeometry args={[1.8, 0.05, 0.3]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.7, 0.75, -1.8]}>
        <boxGeometry args={[0.05, 0.3, 0.2]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 0.75, -1.8]}>
        <boxGeometry args={[0.05, 0.3, 0.2]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Wheels - detailed */}
      {[[-0.9, 0.25, 1.3], [0.9, 0.25, 1.3], [-0.9, 0.25, -1.2], [0.9, 0.25, -1.2]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.26, 6]} />
            <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
      
      {/* Headlights */}
      <mesh position={[-0.6, 0.4, 2.11]}>
        <boxGeometry args={[0.4, 0.1, 0.02]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.6, 0.4, 2.11]}>
        <boxGeometry args={[0.4, 0.1, 0.02]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight position={[0, 0.4, 2.5]} intensity={0.3} color="#ffffff" distance={10} />
      
      {/* Taillights - neon style */}
      <mesh position={[-0.7, 0.4, -2.11]}>
        <boxGeometry args={[0.35, 0.08, 0.02]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.7, 0.4, -2.11]}>
        <boxGeometry args={[0.35, 0.08, 0.02]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <pointLight position={[0, 0.4, -2.5]} intensity={0.2} color="#ff0000" distance={5} />
      
      {/* Neon underglow */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.7, 0.02, 3.8]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.5} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={0.3} color={accentColor} distance={3} />
    </group>
  );
};

const ObstacleCars = ({ obstacles }: ObstacleCarsProps) => {
  const carColors = useMemo(() => [
    '#ff2222', // Red
    '#2255ff', // Blue
    '#22ff22', // Green
    '#ff6600', // Orange
    '#aa22ff', // Purple
    '#ffff00', // Yellow
    '#00ffff', // Cyan
    '#ff00ff', // Magenta
  ], []);

  return (
    <>
      {obstacles.map((obs, index) => (
        <SuperCar 
          key={obs.id}
          position={obs.position}
          color={carColors[index % carColors.length]}
          variant={index}
        />
      ))}
    </>
  );
};

export default ObstacleCars;
