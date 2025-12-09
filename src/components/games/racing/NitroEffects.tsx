import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NitroEffectsProps {
  active: boolean;
  stage: 'none' | 'standard' | 'perfect' | 'shockwave';
  playerPosition: THREE.Vector3;
}

const NitroEffects = ({ active, stage, playerPosition }: NitroEffectsProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2;
    positions[i * 3 + 1] = Math.random() * 0.5;
    positions[i * 3 + 2] = Math.random() * 5;
    
    // Colors based on nitro stage
    if (stage === 'shockwave') {
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.2;
      colors[i * 3 + 2] = 0.8;
    } else if (stage === 'perfect') {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 1;
    } else {
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.5;
      colors[i * 3 + 2] = 0;
    }
  }

  useFrame((state, delta) => {
    if (!particlesRef.current || !active) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 2] += delta * 30;
      if (positions[i * 3 + 2] > 5) {
        positions[i * 3 + 2] = 0;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.2);
    }
  });

  if (!active) return null;

  const glowColor = stage === 'shockwave' ? '#ff33ff' : stage === 'perfect' ? '#00ccff' : '#ff6600';
  const glowIntensity = stage === 'shockwave' ? 3 : stage === 'perfect' ? 2 : 1;

  return (
    <group position={[playerPosition.x, 0.3, 2]}>
      {/* Nitro flame particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, 1]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Light source */}
      <pointLight 
        color={glowColor} 
        intensity={glowIntensity} 
        distance={10}
      />
    </group>
  );
};

export default NitroEffects;
