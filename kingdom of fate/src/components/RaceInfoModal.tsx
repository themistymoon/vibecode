import { useState } from "react";

interface RaceInfoModalProps {
  race: any;
  onClose: () => void;
}

export function RaceInfoModal({ race, onClose }: RaceInfoModalProps) {
  const playSound = () => {
    const audio = new Audio('/sounds/ui-click.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleClose = () => {
    playSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl border border-purple-500/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {race.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-purple-300 hover:text-white text-2xl transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-2">Description</h3>
            <p className="text-purple-100 leading-relaxed">{race.description}</p>
          </div>

          {/* Traits */}
          <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-3">Racial Traits</h3>
            <div className="grid gap-2">
              {race.traits.map((trait: string, index: number) => (
                <div key={index} className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg">
                  {trait}
                </div>
              ))}
            </div>
          </div>

          {/* Buffs */}
          <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-3">Racial Buffs</h3>
            <div className="grid gap-2">
              {race.buffs.map((buff: string, index: number) => (
                <div key={index} className="bg-green-500/20 text-green-300 px-3 py-2 rounded-lg flex items-center">
                  <span className="text-green-400 mr-2">+</span>
                  {buff}
                </div>
              ))}
            </div>
          </div>

          {/* Debuffs */}
          <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-3">Racial Debuffs</h3>
            <div className="grid gap-2">
              {race.debuffs.map((debuff: string, index: number) => (
                <div key={index} className="bg-red-500/20 text-red-300 px-3 py-2 rounded-lg flex items-center">
                  <span className="text-red-400 mr-2">-</span>
                  {debuff}
                </div>
              ))}
            </div>
          </div>

          {/* Stat Modifiers */}
          {race.statModifiers && (
            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-3">Stat Modifiers</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(race.statModifiers).map(([stat, modifier]: [string, any]) => (
                  <div key={stat} className="flex justify-between items-center">
                    <span className="text-purple-200 capitalize">{stat}:</span>
                    <span className={`font-bold ${modifier > 0 ? 'text-green-400' : modifier < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {modifier > 0 ? '+' : ''}{modifier}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
