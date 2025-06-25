import { useState, useEffect } from "react";

interface DiceRollProps {
  isRolling: boolean;
  diceType: number; // 4, 6, 8, 10, 12, 20
  modifier: number;
  targetNumber?: number;
  onRollComplete: (result: { roll: number; total: number; success: boolean }) => void;
}

export function DiceRoll({ isRolling, diceType, modifier, targetNumber, onRollComplete }: DiceRollProps) {
  const [currentRoll, setCurrentRoll] = useState(1);
  const [finalRoll, setFinalRoll] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isRolling && !isComplete) {
      let rollCount = 0;
      const maxRolls = 20;
      
      const rollInterval = setInterval(() => {
        setCurrentRoll(Math.floor(Math.random() * diceType) + 1);
        rollCount++;
        
        if (rollCount >= maxRolls) {
          clearInterval(rollInterval);
          const finalRollValue = Math.floor(Math.random() * diceType) + 1;
          const total = finalRollValue + modifier;
          const success = targetNumber ? total >= targetNumber : true;
          
          setFinalRoll(finalRollValue);
          setIsComplete(true);
          
          setTimeout(() => {
            onRollComplete({ roll: finalRollValue, total, success });
          }, 500);
        }
      }, 50);

      return () => clearInterval(rollInterval);
    }
  }, [isRolling, diceType, modifier, targetNumber, onRollComplete, isComplete]);

  const getDiceShape = () => {
    switch (diceType) {
      case 4: return "🔺";
      case 6: return "⚀";
      case 8: return "🔶";
      case 10: return "🔟";
      case 12: return "🔷";
      case 20: return "🎲";
      default: return "🎲";
    }
  };

  const total = (finalRoll || currentRoll) + modifier;
  const success = targetNumber ? total >= targetNumber : true;

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-black/40 rounded-xl border border-purple-500/30">
      <div className="text-center">
        <div className="text-sm text-purple-300 mb-2">
          Rolling d{diceType} {modifier !== 0 && `${modifier >= 0 ? '+' : ''}${modifier}`}
          {targetNumber && ` (Target: ${targetNumber})`}
        </div>
        
        <div className={`text-6xl transition-all duration-100 ${isRolling ? 'animate-bounce' : ''}`}>
          {getDiceShape()}
        </div>
        
        <div className="mt-4 text-2xl font-bold">
          {finalRoll !== null ? (
            <div className="space-y-2">
              <div className="text-white">
                {finalRoll} {modifier !== 0 && `${modifier >= 0 ? '+' : ''}${modifier}`} = {total}
              </div>
              {targetNumber && (
                <div className={`text-lg font-medium ${success ? 'text-green-400' : 'text-red-400'}`}>
                  {success ? '✅ Success!' : '❌ Failure!'}
                </div>
              )}
            </div>
          ) : (
            <div className="text-white animate-pulse">
              {currentRoll} {modifier !== 0 && `${modifier >= 0 ? '+' : ''}${modifier}`} = {total}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
