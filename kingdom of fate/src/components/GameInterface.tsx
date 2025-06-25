import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { EnhancedStoryDisplay } from "./EnhancedStoryDisplay";
import { CombatInterface } from "./CombatInterface";
import { EnhancedGameStats } from "./EnhancedGameStats";
import { SaveLoadSystem } from "./SaveLoadSystem";
import { MerchantInterface } from "./MerchantInterface";
import { InventoryModal } from "./InventoryModal";
import { CityManagementModal } from "./CityManagementModal";

interface GameInterfaceProps {
  game: any;
}

export function GameInterface({ game }: GameInterfaceProps) {
  const generateStoryScene = useAction(api.game.generateStoryScene);
  const makeChoice = useMutation(api.game.makeChoice);
  const applyChoiceEffects = useMutation(api.enhancedGame.applyChoiceEffects);
  const createMerchant = useMutation(api.enhancedGame.createMerchant);
  const deactivateGame = useMutation(api.game.deactivateCurrentGame);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMerchant, setShowMerchant] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showCityManagement, setShowCityManagement] = useState(false);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);

  useEffect(() => {
    // Generate initial scene if none exists
    if (!game.gameState.story.currentScene && !isGenerating) {
      setIsGenerating(true);
      generateStoryScene({ gameId: game._id })
        .then(() => setIsGenerating(false))
        .catch(() => {
          setIsGenerating(false);
          toast.error("Failed to generate story");
        });
    }
  }, [game, generateStoryScene, isGenerating]);

  const handleChoice = async (choiceIndex: number, diceResult?: any) => {
    try {
      setIsGenerating(true);
      
      // Apply choice effects first if there's a dice result
      if (diceResult) {
        const choice = game.gameState.story.choices[choiceIndex];
        const effects = generateChoiceEffects(choice, diceResult.success, game.gameState);
        
        await applyChoiceEffects({
          gameId: game._id,
          effects,
          diceResult,
        });
      }
      
      await makeChoice({ 
        gameId: game._id, 
        choiceIndex,
        diceResult 
      });
      
      // The story will be regenerated automatically via scheduler
      setTimeout(() => setIsGenerating(false), 3000);
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to make choice");
    }
  };

  const generateChoiceEffects = (choice: any, success: boolean, gameState: any) => {
    const effects = [];
    const choiceText = choice.text.toLowerCase();
    
    if (choiceText.includes('fight') || choiceText.includes('attack')) {
      if (success) {
        effects.push({ type: 'stat', name: 'health', change: -2, positive: false });
        effects.push({ type: 'currency', name: 'gold', change: 15, positive: true });
        effects.push({ type: 'stat', name: 'strength', change: 1, positive: true });
      } else {
        effects.push({ type: 'stat', name: 'health', change: -8, positive: false });
      }
    } else if (choiceText.includes('study') || choiceText.includes('research')) {
      if (success) {
        effects.push({ type: 'stat', name: 'intelligence', change: 2, positive: true });
      } else {
        effects.push({ type: 'stat', name: 'intelligence', change: 1, positive: true });
      }
    } else if (choiceText.includes('trade') || choiceText.includes('merchant')) {
      if (success) {
        effects.push({ type: 'currency', name: 'gold', change: 25, positive: true });
        effects.push({ type: 'stat', name: 'charisma', change: 1, positive: true });
      } else {
        effects.push({ type: 'currency', name: 'gold', change: -10, positive: false });
      }
    } else {
      // Default effects for other choices
      if (success) {
        effects.push({ type: 'stat', name: 'luck', change: 1, positive: true });
      } else {
        effects.push({ type: 'stat', name: 'health', change: -1, positive: false });
      }
    }
    
    return effects;
  };

  const handleOpenMerchant = async () => {
    try {
      await createMerchant({ gameId: game._id });
      setShowMerchant(true);
    } catch (error) {
      toast.error("Failed to open merchant");
    }
  };

  const handleStartNewGame = async () => {
    try {
      await deactivateGame();
      toast.success("Starting new adventure...");
      // The app will automatically redirect to race selection
    } catch (error) {
      toast.error("Failed to start new game");
    }
  };

  const playSound = (soundType: string) => {
    const audio = new Audio(`/sounds/${soundType}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  if (game.gameState.inCombat) {
    return (
      <div className="max-w-6xl mx-auto">
        <EnhancedGameStats game={game} />
        <CombatInterface game={game} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Story Area */}
        <div className="lg:col-span-3">
          <EnhancedStoryDisplay 
            game={game} 
            onChoice={handleChoice}
            isGenerating={isGenerating}
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <EnhancedGameStats game={game} />
          
          {/* Action Buttons */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowInventory(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                📦 Inventory ({game.gameState.inventory?.length || 0})
              </button>
              
              <button
                onClick={() => setShowCityManagement(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                🏰 Manage {game.gameState.story.kingdomSize.charAt(0).toUpperCase() + game.gameState.story.kingdomSize.slice(1)}
              </button>
              
              <button
                onClick={handleOpenMerchant}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                🏪 Find Merchant
              </button>

              <button
                onClick={() => {
                  playSound('ui-click');
                  setShowNewGameConfirm(true);
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 border border-red-500/30"
              >
                🔄 Start New Game
              </button>
            </div>
          </div>
          
          <SaveLoadSystem />
        </div>
      </div>

      {/* New Game Confirmation Modal */}
      {showNewGameConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 max-w-md mx-4">
            <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Start New Game?</h3>
            <p className="text-purple-200 mb-6">
              This will end your current adventure and start fresh. Your current progress will be lost unless you save it first.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  playSound('ui-click');
                  setShowNewGameConfirm(false);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  playSound('ui-click');
                  setShowNewGameConfirm(false);
                  handleStartNewGame();
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Start New Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showInventory && (
        <InventoryModal 
          game={game} 
          onClose={() => setShowInventory(false)} 
        />
      )}

      {showCityManagement && (
        <CityManagementModal 
          game={game} 
          onClose={() => setShowCityManagement(false)} 
        />
      )}

      {showMerchant && (
        <MerchantInterface 
          game={game} 
          onClose={() => setShowMerchant(false)} 
        />
      )}
    </div>
  );
}
