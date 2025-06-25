import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface CityManagementModalProps {
  game: any;
  onClose: () => void;
}

export function CityManagementModal({ game, onClose }: CityManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'buildings' | 'population' | 'economy'>('overview');
  const upgradeCity = useMutation(api.cityManagement.upgradeCity);
  const constructBuilding = useMutation(api.cityManagement.constructBuilding);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const { story, currency } = game.gameState;
  const cityData = game.gameState.cityData || {
    population: 100,
    happiness: 75,
    buildings: [
      { name: "Town Hall", level: 1, description: "Administrative center" },
      { name: "Market", level: 1, description: "Trade hub" },
    ],
    jobs: {
      farmers: 30,
      merchants: 15,
      guards: 10,
      crafters: 20,
      scholars: 5,
    },
    resources: {
      food: 150,
      materials: 80,
      knowledge: 25,
    }
  };

  const getCitySizeInfo = (size: string) => {
    switch (size) {
      case 'village':
        return { maxPop: 200, upgradeCost: 500, nextSize: 'town' };
      case 'town':
        return { maxPop: 1000, upgradeCost: 2000, nextSize: 'city' };
      case 'city':
        return { maxPop: 5000, upgradeCost: 10000, nextSize: 'kingdom' };
      case 'kingdom':
        return { maxPop: 25000, upgradeCost: 50000, nextSize: 'empire' };
      default:
        return { maxPop: 100000, upgradeCost: 0, nextSize: null };
    }
  };

  const handleUpgradeCity = async () => {
    const sizeInfo = getCitySizeInfo(story.kingdomSize);
    if (currency < sizeInfo.upgradeCost) {
      toast.error("Not enough gold to upgrade!");
      return;
    }

    setIsUpgrading(true);
    try {
      await upgradeCity({ gameId: game._id });
      toast.success(`Successfully upgraded to ${sizeInfo.nextSize}!`);
    } catch (error) {
      toast.error("Failed to upgrade city");
    }
    setIsUpgrading(false);
  };

  const handleConstructBuilding = async (buildingType: string) => {
    try {
      await constructBuilding({ gameId: game._id, buildingType });
      toast.success(`Construction of ${buildingType} started!`);
    } catch (error: any) {
      toast.error(error.message || "Construction failed");
    }
  };

  const sizeInfo = getCitySizeInfo(story.kingdomSize);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl border border-purple-500/50 p-6 max-w-6xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🏰 {story.kingdomName || "Your Settlement"} Management
          </h2>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-black/40 rounded-lg p-1 overflow-x-auto">
          {[
            { id: 'overview', label: '🏰 Overview', icon: '🏰' },
            { id: 'buildings', label: '🏗️ Buildings', icon: '🏗️' },
            { id: 'population', label: '👥 Population', icon: '👥' },
            { id: 'economy', label: '💰 Economy', icon: '💰' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Settlement Size</h3>
                <div className="text-2xl font-bold text-white capitalize mb-2">{story.kingdomSize}</div>
                <div className="text-sm text-purple-200">
                  Population: {cityData.population}/{sizeInfo.maxPop}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(cityData.population / sizeInfo.maxPop) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Happiness</h3>
                <div className="text-2xl font-bold text-green-400 mb-2">{cityData.happiness}%</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cityData.happiness}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Treasury</h3>
                <div className="text-2xl font-bold text-yellow-400">{currency} Gold</div>
              </div>
            </div>

            {/* Upgrade City */}
            {sizeInfo.nextSize && (
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-3">Settlement Upgrade</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">
                      Upgrade to {sizeInfo.nextSize.charAt(0).toUpperCase() + sizeInfo.nextSize.slice(1)}
                    </div>
                    <div className="text-purple-200 text-sm">
                      Cost: {sizeInfo.upgradeCost} Gold
                    </div>
                  </div>
                  <button
                    onClick={handleUpgradeCity}
                    disabled={isUpgrading || currency < sizeInfo.upgradeCost}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpgrading ? "Upgrading..." : "Upgrade"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buildings Tab */}
        {activeTab === 'buildings' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {cityData.buildings.map((building: any, index: number) => (
                <div key={index} className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-purple-300">{building.name}</h3>
                      <p className="text-purple-200 text-sm">{building.description}</p>
                      <div className="text-yellow-400 text-sm">Level {building.level}</div>
                    </div>
                    <button
                      onClick={() => handleConstructBuilding(building.name)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Available Buildings */}
            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-4">Available Constructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Barracks", cost: 200, description: "Train guards and soldiers" },
                  { name: "Library", cost: 300, description: "Increase knowledge production" },
                  { name: "Workshop", cost: 250, description: "Craft better equipment" },
                  { name: "Temple", cost: 400, description: "Increase happiness and faith" },
                ].map((building, index) => (
                  <div key={index} className="bg-black/20 rounded-lg p-3 border border-purple-500/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-purple-300">{building.name}</div>
                        <div className="text-purple-200 text-sm">{building.description}</div>
                        <div className="text-yellow-400 text-sm">{building.cost} Gold</div>
                      </div>
                      <button
                        onClick={() => handleConstructBuilding(building.name)}
                        disabled={currency < building.cost}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Build
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Population Tab */}
        {activeTab === 'population' && (
          <div className="space-y-6">
            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-4">Population Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(cityData.jobs).map(([job, count]: [string, any]) => (
                  <div key={job} className="bg-black/20 rounded-lg p-3 border border-purple-500/20">
                    <div className="font-bold text-purple-300 capitalize">{job}</div>
                    <div className="text-2xl font-bold text-white">{count}</div>
                    <div className="text-purple-200 text-sm">
                      {((count / cityData.population) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-4">Population Growth</h3>
              <div className="text-purple-200">
                <p>Current Population: <span className="text-white font-bold">{cityData.population}</span></p>
                <p>Growth Rate: <span className="text-green-400 font-bold">+2.5% per month</span></p>
                <p>Happiness Bonus: <span className="text-blue-400 font-bold">+{Math.floor(cityData.happiness / 20)}% growth</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Economy Tab */}
        {activeTab === 'economy' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(cityData.resources).map(([resource, amount]: [string, any]) => (
                <div key={resource} className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                  <h3 className="text-lg font-bold text-purple-300 capitalize">{resource}</h3>
                  <div className="text-2xl font-bold text-white">{amount}</div>
                  <div className="text-purple-200 text-sm">
                    +{Math.floor(amount * 0.1)} per day
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-4">Economic Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Daily Income:</span>
                  <span className="text-green-400 font-bold">+{Math.floor(cityData.population * 0.5)} Gold</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Daily Expenses:</span>
                  <span className="text-red-400 font-bold">-{Math.floor(cityData.population * 0.3)} Gold</span>
                </div>
                <div className="flex justify-between border-t border-purple-500/30 pt-2">
                  <span className="text-purple-200 font-bold">Net Income:</span>
                  <span className="text-yellow-400 font-bold">+{Math.floor(cityData.population * 0.2)} Gold/day</span>
                </div>
              </div>
            </div>
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
