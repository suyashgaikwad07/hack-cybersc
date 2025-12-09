import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DriftTrailProps {
  isDrifting: boolean;
  playerPosition: THREE.Vector3;
  driftDirection: number;
}

const DriftTrail = ({ isDrifting, playerPosition, driftDirection }: DriftTrailProps) => {
  const trailPointsRef = useRef<THREE.Vector3[]>([]);
  const meshRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Points>(null);
  
  const smokeCount = 50;
  const smokePositions = new Float32Array(smokeCount * 3);
  
  useEffect(() => {
    if (!isDrifting) {
      trailPointsRef.current = [];
    }
  }, [isDrifting]);

  useFrame((state, delta) => {
    if (!smokeRef.current) return;
    
    const positions = smokeRef.current.geometry.attributes.position.array as Float32Array;
    
    if (isDrifting) {
      // Add tire smoke
      for (let i = smokeCount - 1; i > 0; i--) {
        positions[i * 3] = positions[(i - 1) * 3];
        positions[i * 3 + 1] = positions[(i - 1) * 3 + 1] + delta * 2;
        positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
      }
      
      // New smoke at tire positions
      const wheelOffset = driftDirection > 0 ? -0.8 : 0.8;
      positions[0] = playerPosition.x + wheelOffset + (Math.random() - 0.5) * 0.3;
      positions[1] = 0.1;
      positions[2] = 1 + (Math.random() - 0.5) * 0.5;
    }
    
    smokeRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Tire smoke */}
      <points ref={smokeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={smokeCount}
            array={smokePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          color="#aaaaaa"
          transparent
          opacity={isDrifting ? 0.6 : 0}
          blending={THREE.NormalBlending}
        />
      </points>
      
      {/* Tire marks on ground */}
      {isDrifting && (
        <mesh position={[playerPosition.x, -0.48, 1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 2]} />
          <meshBasicMaterial color="#222222" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
};

export default DriftTrail;
