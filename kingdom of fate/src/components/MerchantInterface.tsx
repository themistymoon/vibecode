import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

interface MerchantInterfaceProps {
  game: any;
  onClose: () => void;
}

export function MerchantInterface({ game, onClose }: MerchantInterfaceProps) {
  const purchaseItem = useMutation(api.enhancedGame.purchaseItem);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async (itemIndex: number) => {
    setIsPurchasing(true);
    try {
      const result = await purchaseItem({ gameId: game._id, itemIndex });
      toast.success(`Purchased ${result.item.name}!`);
    } catch (error: any) {
      toast.error(error.message || "Purchase failed");
    }
    setIsPurchasing(false);
  };

  const merchantInventory = game.gameState.merchantInventory || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl border border-purple-500/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🏪 Traveling Merchant
          </h2>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 text-center">
          <div className="text-yellow-400 text-lg font-bold">
            Your Gold: {game.gameState.currency}
          </div>
        </div>

        <div className="grid gap-4">
          {merchantInventory.map((item: any, index: number) => (
            <div key={index} className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-purple-300">{item.name}</h3>
                  <p className="text-purple-200 text-sm">{item.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-bold text-lg">{item.price}g</div>
                </div>
              </div>

              {item.statBonus && (
                <div className="mb-3">
                  <span className="inline-block bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
                    +{item.statBonus.value} {item.statBonus.stat.charAt(0).toUpperCase() + item.statBonus.stat.slice(1)}
                  </span>
                </div>
              )}

              {item.effect && (
                <div className="mb-3">
                  <span className="inline-block bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                    {item.effect.type === 'heal' ? `Heals ${item.effect.value} HP` : item.effect.type}
                  </span>
                </div>
              )}

              <button
                onClick={() => handlePurchase(index)}
                disabled={isPurchasing || game.gameState.currency < item.price}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? "Purchasing..." : 
                 game.gameState.currency < item.price ? "Not Enough Gold" : "Purchase"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
          >
            Leave Merchant
          </button>
        </div>
      </div>
    </div>
  );
}
