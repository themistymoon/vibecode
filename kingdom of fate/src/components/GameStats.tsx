interface GameStatsProps {
  game: any;
}

export function GameStats({ game }: GameStatsProps) {
  const { stats, story, currency, inventory } = game.gameState;

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
            style={{ width: `${(stats.health / stats.maxHealth) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-purple-300">Strength:</span>
          <span className="text-white">{stats.strength}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-purple-300">Intelligence:</span>
          <span className="text-white">{stats.intelligence}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-purple-300">Charisma:</span>
          <span className="text-white">{stats.charisma}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-purple-300">Luck:</span>
          <span className="text-white">{stats.luck}</span>
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

      {/* Inventory */}
      {inventory && inventory.length > 0 && (
        <div className="border-t border-purple-500/30 pt-4">
          <h4 className="text-md font-bold text-purple-300 mb-2">Inventory</h4>
          <div className="space-y-1 text-sm">
            {inventory.slice(0, 5).map((item: any, index: number) => (
              <div key={index} className="text-purple-200">
                {item.name}
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
