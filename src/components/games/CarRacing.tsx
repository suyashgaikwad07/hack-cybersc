import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import * as THREE from 'three';

interface ObstacleCar {
  id: number;
  position: THREE.Vector3;
  lane: number;
  speed: number;
}

interface GameState {
  speed: number;
  maxSpeed: number;
  acceleration: number;
  position: THREE.Vector3;
  steering: number;
  score: number;
  level: number;
  gameOver: boolean;
}

// Road segment component
const Road = ({ zPosition }: { zPosition: number }) => {
  return (
    <group position={[0, -0.5, zPosition]}>
      {/* Main road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 100]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Road edges */}
      <mesh position={[-6.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 100]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[6.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 100]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Lane markers */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh key={i} position={[-4, 0.02, -48 + i * 4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 2]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      ))}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh key={`r-${i}`} position={[4, 0.02, -48 + i * 4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 2]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      ))}
    </group>
  );
};

// Obstacle car 3D model
const ObstacleCarModel = ({ position, color }: { position: THREE.Vector3; color: string }) => {
  return (
    <group position={position}>
      {/* Car body */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.6, 4]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Car top */}
      <mesh position={[0, 0.9, -0.3]}>
        <boxGeometry args={[1.6, 0.5, 2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.9, 0.2, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.9, 0.2, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[-0.9, 0.2, -1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.9, 0.2, -1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Brake lights */}
      <mesh position={[-0.7, 0.4, 2.01]}>
        <boxGeometry args={[0.3, 0.15, 0.02]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.7, 0.4, 2.01]}>
        <boxGeometry args={[0.3, 0.15, 0.02]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// Cockpit dashboard
const Cockpit = ({ speed, rpm }: { speed: number; rpm: number }) => {
  const { camera } = useThree();
  
  return (
    <group>
      {/* Dashboard base */}
      <mesh position={[0, 0.3, 0.8]}>
        <boxGeometry args={[2.2, 0.4, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Steering wheel */}
      <group position={[0, 0.6, 0.5]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.25, 0.03, 8, 32]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      {/* Windshield frame */}
      <mesh position={[-1.1, 0.9, 0.3]}>
        <boxGeometry args={[0.08, 0.8, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[1.1, 0.9, 0.3]}>
        <boxGeometry args={[0.08, 0.8, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 1.3, 0.3]}>
        <boxGeometry args={[2.3, 0.08, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

// Main game scene
const GameScene = ({ 
  gameState, 
  setGameState, 
  obstacles, 
  setObstacles,
  gameStarted,
  onGameOver 
}: { 
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  obstacles: ObstacleCar[];
  setObstacles: React.Dispatch<React.SetStateAction<ObstacleCar[]>>;
  gameStarted: boolean;
  onGameOver: () => void;
}) => {
  const { camera } = useThree();
  const roadOffset = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const lastSpawnTime = useRef(0);
  const obstacleIdRef = useRef(0);

  const obstacleColors = useMemo(() => ['#ff3333', '#ff6600', '#3366ff', '#33cc33', '#cc33ff'], []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!gameStarted || gameState.gameOver) return;

    const keys = keysPressed.current;
    let newSpeed = gameState.speed;
    let newSteering = gameState.steering;
    const newPosition = gameState.position.clone();

    // Acceleration physics
    if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) {
      newSpeed = Math.min(gameState.maxSpeed, newSpeed + gameState.acceleration * delta * 60);
    } else if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) {
      newSpeed = Math.max(0, newSpeed - gameState.acceleration * 2 * delta * 60);
    } else {
      // Natural deceleration
      newSpeed = Math.max(0, newSpeed - gameState.acceleration * 0.3 * delta * 60);
    }

    // Steering physics with momentum
    const steerSpeed = 3;
    const steerReturn = 5;
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
      newSteering = Math.max(-1, newSteering - steerSpeed * delta);
    } else if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
      newSteering = Math.min(1, newSteering + steerSpeed * delta);
    } else {
      // Return to center
      if (newSteering > 0) {
        newSteering = Math.max(0, newSteering - steerReturn * delta);
      } else {
        newSteering = Math.min(0, newSteering + steerReturn * delta);
      }
    }

    // Apply steering to position
    const steerAmount = newSteering * newSpeed * 0.15 * delta * 60;
    newPosition.x = Math.max(-5, Math.min(5, newPosition.x + steerAmount));

    // Update road offset for infinite road effect
    roadOffset.current += newSpeed * delta * 60;

    // Spawn obstacles
    const now = state.clock.elapsedTime;
    const spawnInterval = Math.max(0.8, 2 - gameState.level * 0.1);
    if (now - lastSpawnTime.current > spawnInterval && newSpeed > 0) {
      lastSpawnTime.current = now;
      const lane = Math.floor(Math.random() * 3) - 1;
      const newObstacle: ObstacleCar = {
        id: obstacleIdRef.current++,
        position: new THREE.Vector3(lane * 4, 0, -80),
        lane,
        speed: 0.3 + Math.random() * 0.3
      };
      setObstacles(prev => [...prev, newObstacle]);
    }

    // Update obstacles
    setObstacles(prev => {
      const updated = prev.map(obs => ({
        ...obs,
        position: new THREE.Vector3(
          obs.position.x,
          obs.position.y,
          obs.position.z + (newSpeed - obs.speed * newSpeed) * delta * 60
        )
      }));

      // Check collisions
      for (const obs of updated) {
        const dx = Math.abs(obs.position.x - newPosition.x);
        const dz = obs.position.z;
        if (dx < 1.8 && dz > -3 && dz < 4) {
          onGameOver();
          return updated;
        }
      }

      // Remove passed cars and update score
      const remaining = updated.filter(obs => {
        if (obs.position.z > 10) {
          setGameState(prev => {
            const newScore = prev.score + 1;
            const newLevel = Math.floor(newScore / 10) + 1;
            return {
              ...prev,
              score: newScore,
              level: newLevel,
              maxSpeed: 1 + newLevel * 0.2
            };
          });
          return false;
        }
        return true;
      });

      return remaining;
    });

    // Update camera position (first-person cockpit view)
    camera.position.set(newPosition.x, 1.2, 2);
    camera.lookAt(newPosition.x + newSteering * 2, 1, -20);

    setGameState(prev => ({
      ...prev,
      speed: newSpeed,
      steering: newSteering,
      position: newPosition
    }));
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <pointLight position={[0, 10, -20]} intensity={0.5} color="#ffffff" />
      
      {/* Sky */}
      <mesh>
        <sphereGeometry args={[200, 32, 32]} />
        <meshBasicMaterial color="#0a1628" side={THREE.BackSide} />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a1628', 30, 100]} />

      {/* Road segments */}
      <Road zPosition={-50 + (roadOffset.current % 100)} />
      <Road zPosition={-150 + (roadOffset.current % 100)} />

      {/* Ground beside road */}
      <mesh position={[-15, -0.55, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 200]} />
        <meshStandardMaterial color="#1a3a1a" />
      </mesh>
      <mesh position={[15, -0.55, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 200]} />
        <meshStandardMaterial color="#1a3a1a" />
      </mesh>

      {/* Cockpit */}
      <group position={[gameState.position.x, 0, 0]}>
        <Cockpit speed={gameState.speed} rpm={gameState.speed * 100} />
      </group>

      {/* Obstacle cars */}
      {obstacles.map((obs, index) => (
        <ObstacleCarModel 
          key={obs.id} 
          position={obs.position} 
          color={obstacleColors[index % obstacleColors.length]} 
        />
      ))}

      {/* Street lights */}
      {Array.from({ length: 10 }).map((_, i) => (
        <group key={i}>
          <mesh position={[-7, 4, -20 - i * 20 + (roadOffset.current % 200)]}>
            <cylinderGeometry args={[0.1, 0.1, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <pointLight 
            position={[-7, 6, -20 - i * 20 + (roadOffset.current % 200)]} 
            intensity={0.3} 
            color="#ffaa55" 
            distance={15}
          />
          <mesh position={[7, 4, -20 - i * 20 + (roadOffset.current % 200)]}>
            <cylinderGeometry args={[0.1, 0.1, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <pointLight 
            position={[7, 6, -20 - i * 20 + (roadOffset.current % 200)]} 
            intensity={0.3} 
            color="#ffaa55" 
            distance={15}
          />
        </group>
      ))}
    </>
  );
};

// HUD overlay
const HUD = ({ speed, score, level, maxSpeed }: { speed: number; score: number; level: number; maxSpeed: number }) => {
  const speedPercent = (speed / maxSpeed) * 100;
  const rpm = Math.min(100, speedPercent * 1.2);

  return (
    <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
      <div className="flex justify-between items-end">
        {/* Speedometer */}
        <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-center mb-2">
            <span className="text-4xl font-bold text-primary">{Math.round(speed * 100)}</span>
            <span className="text-sm text-muted-foreground ml-1">km/h</span>
          </div>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
              style={{ width: `${speedPercent}%` }}
            />
          </div>
        </div>

        {/* Score and level */}
        <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm text-center">
          <div className="text-2xl font-bold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">SCORE</div>
          <div className="mt-2 text-lg font-semibold text-accent">Level {level}</div>
        </div>

        {/* RPM gauge */}
        <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-center mb-2">
            <span className="text-2xl font-bold text-accent">{Math.round(rpm * 80)}</span>
            <span className="text-xs text-muted-foreground ml-1">RPM</span>
          </div>
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-100"
              style={{ width: `${rpm}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Controls info
const ControlsInfo = () => (
  <div className="absolute top-4 left-4 bg-black/60 rounded-lg p-3 backdrop-blur-sm text-xs">
    <div className="text-muted-foreground space-y-1">
      <div><span className="text-primary font-bold">↑/W</span> - Accelerate</div>
      <div><span className="text-primary font-bold">↓/S</span> - Brake</div>
      <div><span className="text-primary font-bold">←/→</span> - Steer</div>
    </div>
  </div>
);

const CarRacing = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [obstacles, setObstacles] = useState<ObstacleCar[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    speed: 0,
    maxSpeed: 1.2,
    acceleration: 0.02,
    position: new THREE.Vector3(0, 0, 0),
    steering: 0,
    score: 0,
    level: 1,
    gameOver: false
  });

  const handleGameOver = () => {
    setGameOver(true);
    setGameState(prev => ({ ...prev, gameOver: true }));
    if (gameState.score > highScore) {
      setHighScore(gameState.score);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setObstacles([]);
    setGameState({
      speed: 0,
      maxSpeed: 1.2,
      acceleration: 0.02,
      position: new THREE.Vector3(0, 0, 0),
      steering: 0,
      score: 0,
      level: 1,
      gameOver: false
    });
  };

  return (
    <Card className="p-4 md:p-6 bg-card border-border max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            3D Car Racing
          </h2>
          <p className="text-muted-foreground text-sm">First-person cockpit view • Realistic physics</p>
        </div>

        <div className="flex justify-center gap-4 text-sm">
          <div className="font-semibold">
            High Score: <span className="text-accent">{highScore}</span>
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-primary/30">
          <Canvas camera={{ position: [0, 1.2, 2], fov: 75 }}>
            <GameScene 
              gameState={gameState}
              setGameState={setGameState}
              obstacles={obstacles}
              setObstacles={setObstacles}
              gameStarted={gameStarted && !gameOver}
              onGameOver={handleGameOver}
            />
          </Canvas>
          
          {gameStarted && !gameOver && (
            <>
              <HUD 
                speed={gameState.speed} 
                score={gameState.score} 
                level={gameState.level}
                maxSpeed={gameState.maxSpeed}
              />
              <ControlsInfo />
            </>
          )}

          {!gameStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-primary">Ready to Race?</h3>
                <p className="text-muted-foreground">Use arrow keys or WASD to drive</p>
                <Button onClick={startGame} size="lg" className="bg-primary hover:bg-primary/90">
                  Start Racing
                </Button>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-destructive">Game Over!</h3>
                <p className="text-xl text-muted-foreground">Score: {gameState.score}</p>
                <p className="text-lg text-muted-foreground">Level: {gameState.level}</p>
                <Button onClick={startGame} size="lg" className="bg-primary hover:bg-primary/90">
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex justify-center gap-2 md:hidden">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <Button 
              variant="outline" 
              className="w-14 h-14"
              onTouchStart={() => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
                window.dispatchEvent(event);
              }}
              onTouchEnd={() => {
                const event = new KeyboardEvent('keyup', { key: 'ArrowUp' });
                window.dispatchEvent(event);
              }}
            >
              ↑
            </Button>
            <div />
            <Button 
              variant="outline" 
              className="w-14 h-14"
              onTouchStart={() => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
                window.dispatchEvent(event);
              }}
              onTouchEnd={() => {
                const event = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
                window.dispatchEvent(event);
              }}
            >
              ←
            </Button>
            <Button 
              variant="outline" 
              className="w-14 h-14"
              onTouchStart={() => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
                window.dispatchEvent(event);
              }}
              onTouchEnd={() => {
                const event = new KeyboardEvent('keyup', { key: 'ArrowDown' });
                window.dispatchEvent(event);
              }}
            >
              ↓
            </Button>
            <Button 
              variant="outline" 
              className="w-14 h-14"
              onTouchStart={() => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
                window.dispatchEvent(event);
              }}
              onTouchEnd={() => {
                const event = new KeyboardEvent('keyup', { key: 'ArrowRight' });
                window.dispatchEvent(event);
              }}
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CarRacing;
