import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

interface CombatInterfaceProps {
  game: any;
}

export function CombatInterface({ game }: CombatInterfaceProps) {
  const performCombatAction = useMutation(api.combat.performCombatAction);
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { combatState, stats } = game.gameState;

  const handleAttack = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await performCombatAction({
        gameId: game._id,
        action: "attack",
        targetIndex: selectedTarget,
      });
      
      setCombatLog(prev => [...prev, ...result.combatLog]);
      
      if (result.combatEnded) {
        if (result.victory) {
          toast.success("Victory!");
        } else {
          toast.error("Defeat!");
        }
      }
    } catch (error) {
      toast.error("Combat action failed");
    }
    setIsProcessing(false);
  };

  if (!combatState) return null;

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-6 text-center">
        ⚔️ Combat ⚔️
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Player Status */}
        <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
          <h3 className="text-lg font-bold text-green-400 mb-2">You ({game.gameState.race.name})</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-300">Health:</span>
              <span className="text-white">{stats.health}/{stats.maxHealth}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.health / stats.maxHealth) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span className="text-green-300">Strength:</span>
              <span className="text-white">{stats.strength}</span>
            </div>
          </div>
        </div>

        {/* Enemies */}
        <div className="bg-black/40 rounded-lg p-4 border border-red-500/30">
          <h3 className="text-lg font-bold text-red-400 mb-2">Enemies</h3>
          <div className="space-y-3">
            {combatState.enemies.map((enemy: any, index: number) => (
              <div 
                key={index}
                className={`p-3 rounded border cursor-pointer transition-all ${
                  selectedTarget === index 
                    ? "border-yellow-400 bg-yellow-500/10" 
                    : "border-red-500/30 hover:border-red-400"
                } ${enemy.health <= 0 ? "opacity-50" : ""}`}
                onClick={() => setSelectedTarget(index)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-red-300 font-medium">{enemy.name}</span>
                  <span className="text-white">{enemy.health}/{enemy.maxHealth}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Combat Actions */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleAttack}
          disabled={isProcessing || combatState.enemies[selectedTarget]?.health <= 0}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "⚔️ Attack"}
        </button>
        
        <button
          disabled={isProcessing}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🛡️ Defend
        </button>
        
        <button
          disabled={isProcessing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✨ Special
        </button>
      </div>

      {/* Combat Log */}
      {combatLog.length > 0 && (
        <div className="mt-6 bg-black/40 rounded-lg p-4 border border-purple-500/30">
          <h4 className="text-lg font-bold text-purple-400 mb-2">Combat Log</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {combatLog.slice(-10).map((log, index) => (
              <div key={index} className="text-purple-200 text-sm">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
