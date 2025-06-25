interface EnhancedGameStatsProps {
  game: any;
}

export function EnhancedGameStats({ game }: EnhancedGameStatsProps) {
  const { stats, story, currency, inventory } = game.gameState;

  const getStatColor = (value: number) => {
    if (value >= 8) return 'text-green-400';
    if (value >= 5) return 'text-yellow-400';
    if (value >= 3) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatModifier = (value: number) => {
    return Math.floor((value - 10) / 2);
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
      <h3 className="text-lg font-bold text-purple-300 mb-4">Character Stats</h3>
      
      {/* Health Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-purple-300">Health</span>
          <span className="text-white">{stats.health}/{stats.maxHealth}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, (stats.health / stats.maxHealth) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Enhanced Stats Grid with D&D Modifiers */}
      <div className="space-y-3 mb-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Strength:</span>
          <div className="text-right">
            <span className={`font-bold ${getStatColor(stats.strength)}`}>{stats.strength}</span>
            <span className="text-gray-400 ml-2">
              ({getStatModifier(stats.strength) >= 0 ? '+' : ''}{getStatModifier(stats.strength)})
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Intelligence:</span>
          <div className="text-right">
            <span className={`font-bold ${getStatColor(stats.intelligence)}`}>{stats.intelligence}</span>
            <span className="text-gray-400 ml-2">
              ({getStatModifier(stats.intelligence) >= 0 ? '+' : ''}{getStatModifier(stats.intelligence)})
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Charisma:</span>
          <div className="text-right">
            <span className={`font-bold ${getStatColor(stats.charisma)}`}>{stats.charisma}</span>
            <span className="text-gray-400 ml-2">
              ({getStatModifier(stats.charisma) >= 0 ? '+' : ''}{getStatModifier(stats.charisma)})
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Luck:</span>
          <div className="text-right">
            <span className={`font-bold ${getStatColor(stats.luck)}`}>{stats.luck}</span>
            <span className="text-gray-400 ml-2">
              ({getStatModifier(stats.luck) >= 0 ? '+' : ''}{getStatModifier(stats.luck)})
            </span>
          </div>
        </div>
      </div>

      {/* Kingdom Info */}
      <div className="border-t border-purple-500/30 pt-4 mb-4">
        <h4 className="text-md font-bold text-purple-300 mb-2">Kingdom</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-purple-300">Size:</span>
            <span className="text-white capitalize">{story.kingdomSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-300">Chapter:</span>
            <span className="text-white">{story.chapter}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-300">Gold:</span>
            <span className="text-yellow-400">{currency}</span>
          </div>
        </div>
      </div>

      {/* Equipment/Items */}
      {inventory && inventory.length > 0 && (
        <div className="border-t border-purple-500/30 pt-4">
          <h4 className="text-md font-bold text-purple-300 mb-2">Equipment</h4>
          <div className="space-y-1 text-sm">
            {inventory.slice(0, 5).map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-purple-200">{item.name}</span>
                {item.statBonus && (
                  <span className="text-green-400 text-xs">
                    +{item.statBonus.value} {item.statBonus.stat}
                  </span>
                )}
              </div>
            ))}
            {inventory.length > 5 && (
              <div className="text-purple-400 text-xs">
                +{inventory.length - 5} more items
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
