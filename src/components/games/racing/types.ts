import * as THREE from 'three';

export interface ObstacleCar {
  id: number;
  position: THREE.Vector3;
  lane: number;
  speed: number;
  passed: boolean;
}

export interface GameState {
  speed: number;
  maxSpeed: number;
  acceleration: number;
  position: THREE.Vector3;
  steering: number;
  score: number;
  level: number;
  gameOver: boolean;
  // Nitro system
  nitro: number;
  maxNitro: number;
  nitroActive: boolean;
  nitroStage: 'none' | 'standard' | 'perfect' | 'shockwave';
  // Drift system
  isDrifting: boolean;
  driftAngle: number;
  driftScore: number;
  // Stunt system
  airTime: number;
  stuntsScore: number;
  combo: number;
  comboTimer: number;
  // TouchDrive
  touchDriveEnabled: boolean;
  // Camera effects
  screenShake: number;
  motionBlur: number;
}

export interface RaceSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  touchDrive: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}

export const initialGameState: GameState = {
  speed: 0,
  maxSpeed: 1.5,
  acceleration: 0.025,
  position: new THREE.Vector3(0, 0, 0),
  steering: 0,
  score: 0,
  level: 1,
  gameOver: false,
  nitro: 50,
  maxNitro: 100,
  nitroActive: false,
  nitroStage: 'none',
  isDrifting: false,
  driftAngle: 0,
  driftScore: 0,
  airTime: 0,
  stuntsScore: 0,
  combo: 1,
  comboTimer: 0,
  touchDriveEnabled: false,
  screenShake: 0,
  motionBlur: 0
};
