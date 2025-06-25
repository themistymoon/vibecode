import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function SaveLoadSystem() {
  const saveGameData = useQuery(api.game.saveGameData);
  const loadGameData = useMutation(api.game.loadGameData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!saveGameData) {
      toast.error("No game data to save");
      return;
    }

    const dataStr = JSON.stringify(saveGameData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `kingdoms-of-fate-save-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Game saved successfully!");
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const gameData = JSON.parse(e.target?.result as string);
        
        // Validate the save file structure
        if (!gameData.gameState || !gameData.timestamp || !gameData.version) {
          throw new Error("Invalid save file format");
        }
        
        await loadGameData({ gameData });
        toast.success("Game loaded successfully!");
      } catch (error) {
        toast.error("Failed to load game file");
      }
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsLoading(false);
    };
    
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
      <h3 className="text-lg font-bold text-purple-300 mb-4">Save & Load</h3>
      
      <div className="space-y-3">
        <button
          onClick={handleSave}
          disabled={!saveGameData}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💾 Save Game
        </button>
        
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleLoad}
            disabled={isLoading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "📁 Load Game"}
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-purple-400">
        Save files are downloaded to your device and can be shared or backed up.
      </div>
    </div>
  );
}
