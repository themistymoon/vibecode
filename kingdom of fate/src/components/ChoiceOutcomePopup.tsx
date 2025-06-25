import { useEffect, useState } from "react";

interface ChoiceOutcome {
  choice: string;
  effects: Array<{
    type: 'stat' | 'item' | 'currency' | 'story';
    name: string;
    change: number | string;
    positive: boolean;
  }>;
  diceRoll?: {
    roll: number;
    total: number;
    success: boolean;
    diceType: number;
    modifier: number;
  };
}

interface ChoiceOutcomePopupProps {
  outcome: ChoiceOutcome | null;
  onClose: () => void;
}

export function ChoiceOutcomePopup({ outcome, onClose }: ChoiceOutcomePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (outcome) {
      setIsVisible(true);
    }
  }, [outcome]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!outcome) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl border border-purple-500/50 p-6 max-w-md w-full transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Choice Made
          </h3>
          <div className="text-purple-200 bg-black/30 rounded-lg p-3 border border-purple-500/30">
            "{outcome.choice}"
          </div>
        </div>

        {outcome.diceRoll && (
          <div className="mb-6 p-4 bg-black/40 rounded-lg border border-purple-500/30">
            <div className="text-center">
              <div className="text-sm text-purple-300 mb-2">Dice Roll Result</div>
              <div className="text-xl font-bold text-white mb-1">
                {outcome.diceRoll.roll} + {outcome.diceRoll.modifier} = {outcome.diceRoll.total}
              </div>
              <div className={`text-lg font-medium ${outcome.diceRoll.success ? 'text-green-400' : 'text-red-400'}`}>
                {outcome.diceRoll.success ? '✅ Success!' : '❌ Failure!'}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <h4 className="text-lg font-bold text-purple-300">Effects:</h4>
          {outcome.effects.map((effect, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                effect.positive 
                  ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <span className="font-medium">{effect.name}</span>
              <span className="font-bold">
                {effect.type === 'stat' || effect.type === 'currency' 
                  ? `${effect.positive ? '+' : ''}${effect.change}`
                  : effect.change
                }
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
