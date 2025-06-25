import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface InventoryModalProps {
  game: any;
  onClose: () => void;
}

export function InventoryModal({ game, onClose }: InventoryModalProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'equipment'>('inventory');
  const equipItem = useMutation(api.game.equipItem);
  const useItem = useMutation(api.game.useItem);
  const { inventory, stats } = game.gameState;

  const equippedItems = inventory.filter((item: any) => item.equipped);
  const unequippedItems = inventory.filter((item: any) => !item.equipped);

  const getItemTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weapon': return '⚔️';
      case 'armor': return '🛡️';
      case 'accessory': return '💍';
      case 'consumable': return '🧪';
      default: return '📦';
    }
  };

  const getStatColor = (stat: string) => {
    switch (stat.toLowerCase()) {
      case 'strength': return 'text-red-400';
      case 'intelligence': return 'text-blue-400';
      case 'charisma': return 'text-purple-400';
      case 'luck': return 'text-green-400';
      case 'health': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const playSound = (soundType: string) => {
    const audio = new Audio(`/sounds/${soundType}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const handleEquipItem = async (itemIndex: number) => {
    try {
      playSound('equip');
      const result = await equipItem({ gameId: game._id, itemIndex });
      toast.success(result.equipped ? "Item equipped!" : "Item unequipped!");
    } catch (error: any) {
      toast.error(error.message || "Failed to equip item");
    }
  };

  const handleUseItem = async (itemIndex: number) => {
    try {
      playSound('use-item');
      const result = await useItem({ gameId: game._id, itemIndex });
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to use item");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl border border-purple-500/50 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            📦 Inventory & Equipment
          </h2>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-black/40 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'inventory'
                ? 'bg-purple-600 text-white'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            📦 All Items ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'equipment'
                ? 'bg-purple-600 text-white'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            ⚔️ Equipped ({equippedItems.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {inventory.length === 0 ? (
              <div className="text-center py-12 text-purple-300">
                <div className="text-6xl mb-4">📦</div>
                <p>Your inventory is empty</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {inventory.map((item: any, index: number) => (
                  <div key={index} className={`bg-black/40 rounded-lg p-4 border ${
                    item.equipped ? 'border-green-500/50 bg-green-500/10' : 'border-purple-500/30'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {getItemTypeIcon(item.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-purple-300 flex items-center">
                            {item.name}
                            {item.equipped && (
                              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                EQUIPPED
                              </span>
                            )}
                          </h3>
                          <p className="text-purple-200 text-sm mb-2">{item.description}</p>
                          <div className="text-xs text-purple-400 capitalize">
                            {item.type}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        {item.statBonus && (
                          <div className={`font-bold ${getStatColor(item.statBonus.stat)}`}>
                            +{item.statBonus.value} {item.statBonus.stat.charAt(0).toUpperCase() + item.statBonus.stat.slice(1)}
                          </div>
                        )}
                        
                        {item.effect && (
                          <div className="text-green-400 text-sm">
                            {item.effect.type === 'heal' && `Heals ${item.effect.value} HP`}
                          </div>
                        )}

                        <div className="flex space-x-2">
                          {item.type !== 'consumable' && (
                            <button
                              onClick={() => handleEquipItem(index)}
                              className={`px-3 py-1 rounded text-sm font-bold transition-all duration-200 ${
                                item.equipped
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {item.equipped ? 'Unequip' : 'Equip'}
                            </button>
                          )}
                          
                          {item.type === 'consumable' && (
                            <button
                              onClick={() => handleUseItem(index)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-bold transition-all duration-200"
                            >
                              Use
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-6">
            {/* Equipment Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-3">⚔️ Weapon Slot</h3>
                {equippedItems.find((item: any) => item.type === 'weapon') ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="font-bold text-green-300">
                      {equippedItems.find((item: any) => item.type === 'weapon')?.name}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-3 text-gray-400">
                    No weapon equipped
                  </div>
                )}
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-3">🛡️ Armor Slot</h3>
                {equippedItems.find((item: any) => item.type === 'armor') ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="font-bold text-green-300">
                      {equippedItems.find((item: any) => item.type === 'armor')?.name}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-3 text-gray-400">
                    No armor equipped
                  </div>
                )}
              </div>
            </div>

            {/* Equipped Items Details */}
            {equippedItems.length > 0 && (
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-3">Equipment Bonuses</h3>
                <div className="space-y-2">
                  {equippedItems.map((item: any, index: number) => (
                    item.statBonus && (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-purple-200">{item.name}:</span>
                        <span className={`font-bold ${getStatColor(item.statBonus.stat)}`}>
                          +{item.statBonus.value} {item.statBonus.stat.charAt(0).toUpperCase() + item.statBonus.stat.slice(1)}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
