import { GameState } from './types';
import { Zap, Gauge, Trophy, Flame, Wind } from 'lucide-react';

interface RacingHUDProps {
  gameState: GameState;
  highScore: number;
}

const RacingHUD = ({ gameState, highScore }: RacingHUDProps) => {
  const speedPercent = (gameState.speed / gameState.maxSpeed) * 100;
  const nitroPercent = (gameState.nitro / gameState.maxNitro) * 100;
  const speedKmh = Math.round(gameState.speed * 200);
  
  const getNitroColor = () => {
    switch (gameState.nitroStage) {
      case 'shockwave': return 'from-purple-500 via-pink-500 to-purple-500';
      case 'perfect': return 'from-cyan-400 via-blue-500 to-cyan-400';
      case 'standard': return 'from-orange-400 via-yellow-500 to-orange-400';
      default: return 'from-orange-600 to-yellow-500';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar - Score and Level */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Left - Score */}
        <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-primary/30">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
          </div>
          <div className="text-3xl font-bold text-primary">{gameState.score}</div>
          <div className="text-xs text-muted-foreground">High: {highScore}</div>
        </div>

        {/* Center - Combo */}
        {gameState.combo > 1 && (
          <div className="bg-gradient-to-r from-orange-500/80 to-red-500/80 backdrop-blur-md rounded-xl px-6 py-3 animate-pulse">
            <div className="text-center">
              <div className="text-2xl font-black text-white">x{gameState.combo}</div>
              <div className="text-xs text-white/80 uppercase tracking-wider">Combo</div>
            </div>
          </div>
        )}

        {/* Right - Level */}
        <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-accent/30">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-5 h-5 text-accent" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Level</span>
          </div>
          <div className="text-3xl font-bold text-accent">{gameState.level}</div>
        </div>
      </div>

      {/* Drift indicator */}
      {gameState.isDrifting && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-md rounded-xl px-8 py-4 animate-bounce">
            <div className="flex items-center gap-3">
              <Wind className="w-8 h-8 text-white animate-spin" />
              <div>
                <div className="text-2xl font-black text-white">DRIFTING!</div>
                <div className="text-lg text-cyan-200">+{Math.round(gameState.driftScore)} pts</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-end gap-4">
          {/* Nitro gauge */}
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-orange-500/30 flex-1 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <Flame className={`w-5 h-5 ${gameState.nitroActive ? 'text-orange-400 animate-pulse' : 'text-orange-600'}`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Nitro</span>
              {gameState.nitroStage !== 'none' && (
                <span className={`text-xs font-bold uppercase ${
                  gameState.nitroStage === 'shockwave' ? 'text-purple-400' :
                  gameState.nitroStage === 'perfect' ? 'text-cyan-400' : 'text-orange-400'
                }`}>
                  {gameState.nitroStage}
                </span>
              )}
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getNitroColor()} transition-all duration-100 ${gameState.nitroActive ? 'animate-pulse' : ''}`}
                style={{ width: `${nitroPercent}%` }}
              />
            </div>
            {/* Nitro stages markers */}
            <div className="relative h-1 mt-1">
              <div className="absolute left-[33%] w-0.5 h-2 bg-cyan-400 -top-1" />
              <div className="absolute left-[66%] w-0.5 h-2 bg-purple-400 -top-1" />
            </div>
          </div>

          {/* Speedometer */}
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-primary/30 min-w-[180px]">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className={`text-5xl font-black ${gameState.nitroActive ? 'text-orange-400' : 'text-primary'}`}>
                  {speedKmh}
                </span>
                <span className="text-lg text-muted-foreground">km/h</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full transition-all duration-100 ${
                    gameState.nitroActive 
                      ? 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-pulse'
                      : 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500'
                  }`}
                  style={{ width: `${Math.min(100, speedPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* RPM / Stunt score */}
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-accent/30 flex-1 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Stunts</span>
            </div>
            <div className="text-2xl font-bold text-accent">+{gameState.stuntsScore}</div>
            <div className="text-xs text-muted-foreground">Drift: +{Math.round(gameState.driftScore)}</div>
          </div>
        </div>
      </div>

      {/* TouchDrive indicator */}
      {gameState.touchDriveEnabled && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <div className="bg-cyan-500/20 backdrop-blur-md rounded-full px-4 py-1 border border-cyan-400/50">
            <span className="text-xs text-cyan-300 uppercase tracking-wider">TouchDrive Active</span>
          </div>
        </div>
      )}

      {/* Screen effects overlay */}
      {gameState.screenShake > 0 && (
        <div 
          className="absolute inset-0 bg-white/10 pointer-events-none"
          style={{ opacity: gameState.screenShake }}
        />
      )}
      
      {gameState.nitroActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-orange-500/10" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default RacingHUD;
