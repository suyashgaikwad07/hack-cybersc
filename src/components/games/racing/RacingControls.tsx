import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Flame, Zap } from 'lucide-react';

interface RacingControlsProps {
  onAccelerate: (active: boolean) => void;
  onBrake: (active: boolean) => void;
  onSteerLeft: (active: boolean) => void;
  onSteerRight: (active: boolean) => void;
  onNitro: () => void;
  onDrift: () => void;
  touchDriveEnabled: boolean;
}

const RacingControls = ({ 
  onAccelerate, 
  onBrake, 
  onSteerLeft, 
  onSteerRight,
  onNitro,
  onDrift,
  touchDriveEnabled
}: RacingControlsProps) => {
  return (
    <div className="flex justify-between items-center gap-4 px-4 py-2">
      {/* Left side - Steering */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-primary/50 bg-black/50 backdrop-blur-sm active:bg-primary/30 active:scale-95 transition-all"
          onTouchStart={() => onSteerLeft(true)}
          onTouchEnd={() => onSteerLeft(false)}
          onMouseDown={() => onSteerLeft(true)}
          onMouseUp={() => onSteerLeft(false)}
          onMouseLeave={() => onSteerLeft(false)}
        >
          <ChevronLeft className="w-8 h-8 text-primary" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-primary/50 bg-black/50 backdrop-blur-sm active:bg-primary/30 active:scale-95 transition-all"
          onTouchStart={() => onSteerRight(true)}
          onTouchEnd={() => onSteerRight(false)}
          onMouseDown={() => onSteerRight(true)}
          onMouseUp={() => onSteerRight(false)}
          onMouseLeave={() => onSteerRight(false)}
        >
          <ChevronRight className="w-8 h-8 text-primary" />
        </Button>
      </div>

      {/* Center - Nitro and Drift */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="lg"
          className="w-20 h-12 rounded-xl border-2 border-orange-500/50 bg-gradient-to-r from-orange-600/30 to-red-600/30 backdrop-blur-sm active:from-orange-500/60 active:to-red-500/60 active:scale-95 transition-all"
          onTouchStart={onNitro}
          onMouseDown={onNitro}
        >
          <Flame className="w-6 h-6 text-orange-400" />
          <span className="text-xs text-orange-300 ml-1">N2O</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-20 h-12 rounded-xl border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-sm active:from-cyan-500/60 active:to-blue-500/60 active:scale-95 transition-all"
          onTouchStart={onDrift}
          onMouseDown={onDrift}
        >
          <Zap className="w-6 h-6 text-cyan-400" />
          <span className="text-xs text-cyan-300 ml-1">Drift</span>
        </Button>
      </div>

      {/* Right side - Accelerate/Brake */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-green-500/50 bg-green-900/30 backdrop-blur-sm active:bg-green-500/40 active:scale-95 transition-all"
          onTouchStart={() => onAccelerate(true)}
          onTouchEnd={() => onAccelerate(false)}
          onMouseDown={() => onAccelerate(true)}
          onMouseUp={() => onAccelerate(false)}
          onMouseLeave={() => onAccelerate(false)}
        >
          <ChevronUp className="w-8 h-8 text-green-400" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-red-500/50 bg-red-900/30 backdrop-blur-sm active:bg-red-500/40 active:scale-95 transition-all"
          onTouchStart={() => onBrake(true)}
          onTouchEnd={() => onBrake(false)}
          onMouseDown={() => onBrake(true)}
          onMouseUp={() => onBrake(false)}
          onMouseLeave={() => onBrake(false)}
        >
          <ChevronDown className="w-8 h-8 text-red-400" />
        </Button>
      </div>
    </div>
  );
};

export default RacingControls;
