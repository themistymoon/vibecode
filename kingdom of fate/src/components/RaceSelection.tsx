import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function RaceSelection() {
  const races = useQuery(api.races.getAllRaces);
  const initializeRaces = useMutation(api.races.initializeRaces);
  const createNewGame = useMutation(api.game.createNewGame);
  const [selectedRace, setSelectedRace] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<any>(null);

  useEffect(() => {
    if (races && races.length === 0) {
      initializeRaces();
    }
  }, [races, initializeRaces]);

  const spinRaceWheel = () => {
    if (!races || races.length === 0) return;
    
    setIsSpinning(true);
    setSpinResult(null);
    
    // Simulate wheel spinning
    setTimeout(() => {
      const randomRace = races[Math.floor(Math.random() * races.length)];
      setSpinResult(randomRace);
      setSelectedRace(randomRace);
      setIsSpinning(false);
      toast.success(`The wheel has chosen: ${randomRace.name}!`);
    }, 2000);
  };

  const startGame = async () => {
    if (!selectedRace) return;
    
    try {
      // Generate or get session ID
      let sessionId = localStorage.getItem('kingdoms-session-id');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('kingdoms-session-id', sessionId);
      }
      
      await createNewGame({ raceId: selectedRace._id, sessionId });
      toast.success("Your adventure begins!");
    } catch (error) {
      toast.error("Failed to start game");
    }
  };

  if (!races) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
          Choose Your Destiny
        </h1>
        <p className="text-purple-200 text-lg mb-8">
          Spin the Wheel of Fate to discover your race, or select one manually
        </p>

        {/* Race Wheel */}
        <div className="mb-8">
          <div className={`relative w-64 h-64 mx-auto mb-6 ${isSpinning ? 'animate-spin' : ''}`}>
            <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-1">
              <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  {isSpinning ? (
                    <div className="text-white text-lg font-bold">Spinning...</div>
                  ) : spinResult ? (
                    <div>
                      <div className="text-2xl font-bold text-purple-300">{spinResult.name}</div>
                      <div className="text-sm text-purple-200 mt-1">
                        {spinResult.traits.slice(0, 2).join(", ")}
                      </div>
                    </div>
                  ) : (
                    <div className="text-white text-lg font-bold">Wheel of Fate</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={spinRaceWheel}
            disabled={isSpinning}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpinning ? "Spinning..." : "Spin the Wheel!"}
          </button>
        </div>

        {/* Manual Race Selection */}
        <div className="border-t border-purple-500/30 pt-8">
          <h3 className="text-xl font-bold text-purple-300 mb-4">Or Choose Manually:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {races.map((race) => (
              <button
                key={race._id}
                onClick={() => setSelectedRace(race)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedRace?._id === race._id
                    ? "border-purple-400 bg-purple-500/20"
                    : "border-purple-500/30 bg-black/20 hover:border-purple-400 hover:bg-purple-500/10"
                }`}
              >
                <div className="text-lg font-bold text-purple-300">{race.name}</div>
                <div className="text-sm text-purple-200 mt-1">
                  {race.traits.slice(0, 2).join(", ")}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Race Details */}
        {selectedRace && (
          <div className="mt-8 p-6 bg-black/40 rounded-xl border border-purple-500/30">
            <h3 className="text-2xl font-bold text-purple-300 mb-2">{selectedRace.name}</h3>
            <p className="text-purple-200 mb-4">{selectedRace.description}</p>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-bold text-green-400 mb-2">Traits:</h4>
                <ul className="text-green-300">
                  {selectedRace.traits.map((trait: string, i: number) => (
                    <li key={i}>• {trait}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-blue-400 mb-2">Buffs:</h4>
                <ul className="text-blue-300">
                  {selectedRace.buffs.map((buff: string, i: number) => (
                    <li key={i}>• {buff}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-400 mb-2">Debuffs:</h4>
                <ul className="text-red-300">
                  {selectedRace.debuffs.map((debuff: string, i: number) => (
                    <li key={i}>• {debuff}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={startGame}
              className="mt-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              Begin Your Adventure
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
