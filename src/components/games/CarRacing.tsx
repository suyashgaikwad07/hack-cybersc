import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import * as THREE from 'three';
import { GameState, ObstacleCar, initialGameState } from './racing/types';
import Environment from './racing/Environment';
import PlayerCar from './racing/PlayerCar';
import ObstacleCars from './racing/ObstacleCars';
import NitroEffects from './racing/NitroEffects';
import DriftTrail from './racing/DriftTrail';
import RacingHUD from './racing/RacingHUD';
import RacingControls from './racing/RacingControls';
import { Settings, Play, RotateCcw, Zap, Car, Volume2, VolumeX } from 'lucide-react';

// Game Scene Component
const GameScene = ({ 
  gameState, 
  setGameState, 
  obstacles, 
  setObstacles,
  gameStarted,
  onGameOver,
  controls
}: { 
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  obstacles: ObstacleCar[];
  setObstacles: React.Dispatch<React.SetStateAction<ObstacleCar[]>>;
  gameStarted: boolean;
  onGameOver: () => void;
  controls: React.MutableRefObject<Set<string>>;
}) => {
  const { camera } = useThree();
  const roadOffset = useRef(0);
  const lastSpawnTime = useRef(0);
  const obstacleIdRef = useRef(0);
  const lastDriftTap = useRef(0);

  useFrame((state, delta) => {
    if (!gameStarted || gameState.gameOver) return;

    const keys = controls.current;
    let newSpeed = gameState.speed;
    let newSteering = gameState.steering;
    let newNitro = gameState.nitro;
    let newNitroActive = gameState.nitroActive;
    let newNitroStage = gameState.nitroStage;
    let newIsDrifting = gameState.isDrifting;
    let newDriftScore = gameState.driftScore;
    let newDriftAngle = gameState.driftAngle;
    let newCombo = gameState.combo;
    let newComboTimer = gameState.comboTimer;
    let newStuntsScore = gameState.stuntsScore;
    let newScreenShake = Math.max(0, gameState.screenShake - delta * 3);
    const newPosition = gameState.position.clone();

    // TouchDrive auto-acceleration
    if (gameState.touchDriveEnabled) {
      newSpeed = Math.min(gameState.maxSpeed * 0.8, newSpeed + gameState.acceleration * delta * 40);
    }

    // Manual acceleration
    if (keys.has('accelerate')) {
      const accelMultiplier = newNitroActive ? 2.5 : 1;
      newSpeed = Math.min(gameState.maxSpeed * (newNitroActive ? 1.5 : 1), newSpeed + gameState.acceleration * accelMultiplier * delta * 60);
    } else if (keys.has('brake')) {
      newSpeed = Math.max(0, newSpeed - gameState.acceleration * 3 * delta * 60);
      
      // Drift activation - double tap brake
      const now = state.clock.elapsedTime;
      if (now - lastDriftTap.current < 0.3 && newSpeed > 0.3) {
        newIsDrifting = true;
      }
      lastDriftTap.current = now;
    } else if (!gameState.touchDriveEnabled) {
      newSpeed = Math.max(0, newSpeed - gameState.acceleration * 0.5 * delta * 60);
    }

    // Nitro activation
    if (keys.has('nitro') && newNitro > 0 && !newNitroActive) {
      newNitroActive = true;
      // Determine nitro stage based on nitro level
      if (newNitro > 66) {
        newNitroStage = 'shockwave';
      } else if (newNitro > 33) {
        newNitroStage = 'perfect';
      } else {
        newNitroStage = 'standard';
      }
      newScreenShake = 0.5;
    }

    // Nitro consumption and effects
    if (newNitroActive) {
      const consumeRate = newNitroStage === 'shockwave' ? 25 : newNitroStage === 'perfect' ? 18 : 12;
      newNitro = Math.max(0, newNitro - consumeRate * delta);
      if (newNitro <= 0) {
        newNitroActive = false;
        newNitroStage = 'none';
      }
    }

    // Steering with drift physics
    const steerSpeed = newIsDrifting ? 5 : 3.5;
    const steerReturn = newIsDrifting ? 2 : 6;
    const maxSteer = newIsDrifting ? 1.5 : 1;
    
    if (keys.has('left')) {
      newSteering = Math.max(-maxSteer, newSteering - steerSpeed * delta);
      if (newIsDrifting) {
        newDriftAngle = Math.max(-0.5, newDriftAngle - delta * 2);
      }
    } else if (keys.has('right')) {
      newSteering = Math.min(maxSteer, newSteering + steerSpeed * delta);
      if (newIsDrifting) {
        newDriftAngle = Math.min(0.5, newDriftAngle + delta * 2);
      }
    } else {
      if (newSteering > 0) {
        newSteering = Math.max(0, newSteering - steerReturn * delta);
      } else {
        newSteering = Math.min(0, newSteering + steerReturn * delta);
      }
      newDriftAngle *= 0.95;
    }

    // Drift scoring and nitro charging
    if (newIsDrifting && Math.abs(newSteering) > 0.3) {
      newDriftScore += delta * 50 * Math.abs(newSteering);
      newNitro = Math.min(gameState.maxNitro, newNitro + delta * 15);
      
      // End drift if speed too low or no steering
      if (newSpeed < 0.2 || (!keys.has('left') && !keys.has('right'))) {
        newIsDrifting = false;
        newStuntsScore += Math.round(newDriftScore);
        newCombo = Math.min(10, newCombo + 1);
        newComboTimer = 3;
        newDriftScore = 0;
      }
    }

    // Combo timer decay
    if (newComboTimer > 0) {
      newComboTimer -= delta;
      if (newComboTimer <= 0) {
        newCombo = 1;
      }
    }

    // Apply steering to position
    const steerAmount = newSteering * newSpeed * (newIsDrifting ? 0.25 : 0.18) * delta * 60;
    newPosition.x = Math.max(-6, Math.min(6, newPosition.x + steerAmount));

    // Update road offset
    roadOffset.current += newSpeed * delta * 60;

    // Spawn obstacles
    const now = state.clock.elapsedTime;
    const spawnInterval = Math.max(0.6, 1.8 - gameState.level * 0.08);
    if (now - lastSpawnTime.current > spawnInterval && newSpeed > 0) {
      lastSpawnTime.current = now;
      const lane = Math.floor(Math.random() * 5) - 2;
      const newObstacle: ObstacleCar = {
        id: obstacleIdRef.current++,
        position: new THREE.Vector3(lane * 3, 0, -100),
        lane,
        speed: 0.25 + Math.random() * 0.35,
        passed: false
      };
      setObstacles(prev => [...prev, newObstacle]);
    }

    // Update obstacles and check collisions
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
        if (dx < 1.9 && dz > -4 && dz < 4.5) {
          onGameOver();
          return updated;
        }
      }

      // Score for passed cars and update nitro
      const remaining = updated.filter(obs => {
        if (obs.position.z > 12 && !obs.passed) {
          obs.passed = true;
          setGameState(prev => {
            const newScore = prev.score + 10 * prev.combo;
            const newLevel = Math.floor(newScore / 100) + 1;
            return {
              ...prev,
              score: newScore,
              level: newLevel,
              maxSpeed: 1.5 + newLevel * 0.15,
              nitro: Math.min(prev.maxNitro, prev.nitro + 5)
            };
          });
        }
        return obs.position.z < 20;
      });

      return remaining;
    });

    // Camera with effects
    const shakeX = newScreenShake * (Math.random() - 0.5) * 0.1;
    const shakeY = newScreenShake * (Math.random() - 0.5) * 0.05;
    camera.position.set(newPosition.x + shakeX, 1.15 + shakeY, 2);
    camera.lookAt(newPosition.x + newSteering * 3 + newDriftAngle * 2, 0.8, -25);

    setGameState(prev => ({
      ...prev,
      speed: newSpeed,
      steering: newSteering,
      position: newPosition,
      nitro: newNitro,
      nitroActive: newNitroActive,
      nitroStage: newNitroStage,
      isDrifting: newIsDrifting,
      driftScore: newDriftScore,
      driftAngle: newDriftAngle,
      combo: newCombo,
      comboTimer: newComboTimer,
      stuntsScore: newStuntsScore,
      screenShake: newScreenShake,
      motionBlur: newNitroActive ? 0.3 : 0
    }));
  });

  return (
    <>
      <Environment roadOffset={roadOffset.current} />
      <PlayerCar gameState={gameState} />
      <ObstacleCars obstacles={obstacles} />
      <NitroEffects 
        active={gameState.nitroActive} 
        stage={gameState.nitroStage}
        playerPosition={gameState.position}
      />
      <DriftTrail 
        isDrifting={gameState.isDrifting}
        playerPosition={gameState.position}
        driftDirection={gameState.steering}
      />
    </>
  );
};

// Main Component
const CarRacing = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('carRacingHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [touchDrive, setTouchDrive] = useState(false);
  const [obstacles, setObstacles] = useState<ObstacleCar[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    ...initialGameState,
    touchDriveEnabled: false
  });
  
  const controlsRef = useRef(new Set<string>());

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') controlsRef.current.add('accelerate');
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') controlsRef.current.add('brake');
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') controlsRef.current.add('left');
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') controlsRef.current.add('right');
      if (e.key === ' ' || e.key === 'n' || e.key === 'N') controlsRef.current.add('nitro');
      if (e.key === 'Shift') controlsRef.current.add('drift');
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') controlsRef.current.delete('accelerate');
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') controlsRef.current.delete('brake');
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') controlsRef.current.delete('left');
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') controlsRef.current.delete('right');
      if (e.key === ' ' || e.key === 'n' || e.key === 'N') controlsRef.current.delete('nitro');
      if (e.key === 'Shift') controlsRef.current.delete('drift');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleGameOver = useCallback(() => {
    setGameOver(true);
    setGameState(prev => ({ ...prev, gameOver: true }));
    if (gameState.score > highScore) {
      setHighScore(gameState.score);
      localStorage.setItem('carRacingHighScore', gameState.score.toString());
    }
  }, [gameState.score, highScore]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setObstacles([]);
    setGameState({
      ...initialGameState,
      touchDriveEnabled: touchDrive
    });
    controlsRef.current.clear();
  }, [touchDrive]);

  // Mobile control handlers
  const handleAccelerate = (active: boolean) => {
    if (active) controlsRef.current.add('accelerate');
    else controlsRef.current.delete('accelerate');
  };
  const handleBrake = (active: boolean) => {
    if (active) controlsRef.current.add('brake');
    else controlsRef.current.delete('brake');
  };
  const handleSteerLeft = (active: boolean) => {
    if (active) controlsRef.current.add('left');
    else controlsRef.current.delete('left');
  };
  const handleSteerRight = (active: boolean) => {
    if (active) controlsRef.current.add('right');
    else controlsRef.current.delete('right');
  };
  const handleNitro = () => {
    controlsRef.current.add('nitro');
    setTimeout(() => controlsRef.current.delete('nitro'), 100);
  };
  const handleDrift = () => {
    controlsRef.current.add('brake');
    setTimeout(() => {
      controlsRef.current.delete('brake');
      controlsRef.current.add('brake');
      setTimeout(() => controlsRef.current.delete('brake'), 50);
    }, 50);
  };

  return (
    <Card className="p-4 md:p-6 bg-card border-border max-w-5xl mx-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-primary to-purple-400 bg-clip-text text-transparent">
            NITRO RUSH
          </h2>
          <p className="text-muted-foreground text-sm">Arcade Racing • Drift • Nitro Boost</p>
        </div>

        {/* Game Canvas */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20">
          <Canvas camera={{ position: [0, 1.15, 2], fov: 80 }} gl={{ antialias: true }}>
            <GameScene 
              gameState={gameState}
              setGameState={setGameState}
              obstacles={obstacles}
              setObstacles={setObstacles}
              gameStarted={gameStarted && !gameOver}
              onGameOver={handleGameOver}
              controls={controlsRef}
            />
          </Canvas>
          
          {gameStarted && !gameOver && (
            <RacingHUD gameState={gameState} highScore={highScore} />
          )}

          {/* Start Screen */}
          {!gameStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/90 via-black/80 to-black/90">
              <div className="text-center space-y-6 p-8">
                <div className="flex justify-center mb-4">
                  <Car className="w-20 h-20 text-primary animate-pulse" />
                </div>
                <h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                  NITRO RUSH
                </h3>
                <div className="space-y-2 text-muted-foreground text-sm">
                  <p><span className="text-primary font-bold">↑/W</span> Accelerate • <span className="text-primary font-bold">↓/S</span> Brake</p>
                  <p><span className="text-primary font-bold">←→/AD</span> Steer • <span className="text-orange-400 font-bold">Space/N</span> Nitro</p>
                  <p><span className="text-cyan-400 font-bold">Double-tap brake</span> to drift!</p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-cyan-500 to-primary hover:from-cyan-400 hover:to-primary/90 text-lg px-8">
                    <Play className="w-5 h-5 mr-2" />
                    Start Race
                  </Button>
                  <Button onClick={() => setShowSettings(!showSettings)} variant="outline" size="lg">
                    <Settings className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Settings panel */}
                {showSettings && (
                  <div className="mt-4 p-4 bg-black/60 rounded-lg border border-primary/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="touchdrive" className="text-sm">TouchDrive (Auto-steer)</Label>
                      <Switch id="touchdrive" checked={touchDrive} onCheckedChange={setTouchDrive} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound" className="text-sm">Sound Effects</Label>
                      <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-red-900/80 via-black/90 to-black/90">
              <div className="text-center space-y-6 p-8">
                <h3 className="text-5xl font-black text-red-500 animate-pulse">WRECKED!</h3>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">Score: {gameState.score}</p>
                  <p className="text-lg text-muted-foreground">Level: {gameState.level}</p>
                  <p className="text-lg text-muted-foreground">Max Combo: x{gameState.combo}</p>
                  {gameState.score >= highScore && gameState.score > 0 && (
                    <p className="text-xl font-bold text-yellow-400 animate-bounce">🏆 New High Score!</p>
                  )}
                </div>
                <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-cyan-500 to-primary hover:from-cyan-400 hover:to-primary/90 text-lg px-8">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Race Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden">
          <RacingControls
            onAccelerate={handleAccelerate}
            onBrake={handleBrake}
            onSteerLeft={handleSteerLeft}
            onSteerRight={handleSteerRight}
            onNitro={handleNitro}
            onDrift={handleDrift}
            touchDriveEnabled={touchDrive}
          />
        </div>

        {/* Desktop controls hint */}
        <div className="hidden md:block text-center text-xs text-muted-foreground">
          <span className="text-primary">↑↓←→</span> or <span className="text-primary">WASD</span> to drive • 
          <span className="text-orange-400 ml-2">Space/N</span> for Nitro • 
          <span className="text-cyan-400 ml-2">Double-tap ↓</span> to Drift
        </div>
      </div>
    </Card>
  );
};

export default CarRacing;
