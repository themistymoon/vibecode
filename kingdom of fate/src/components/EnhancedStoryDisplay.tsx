import { useState } from "react";
import { DiceRoll } from "./DiceRoll";
import { ChoiceOutcomePopup } from "./ChoiceOutcomePopup";
import { RaceInfoModal } from "./RaceInfoModal";

interface EnhancedStoryDisplayProps {
  game: any;
  onChoice: (choiceIndex: number, diceResult?: any) => void;
  isGenerating: boolean;
}

export function EnhancedStoryDisplay({ game, onChoice, isGenerating }: EnhancedStoryDisplayProps) {
  const { story, race, playerName } = game.gameState;
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [choiceOutcome, setChoiceOutcome] = useState<any>(null);
  const [showRaceInfo, setShowRaceInfo] = useState(false);

  const playSound = (soundType: string) => {
    const audio = new Audio(`/sounds/${soundType}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const getChoiceDifficulty = (choice: any, index: number) => {
    // Determine dice type and difficulty based on choice content and player stats
    const choiceText = choice.text.toLowerCase();
    const { stats } = game.gameState;
    
    if (choiceText.includes('fight') || choiceText.includes('attack') || choiceText.includes('combat')) {
      return { diceType: 20, modifier: Math.floor(stats.strength / 10), targetNumber: 12 };
    } else if (choiceText.includes('persuade') || choiceText.includes('convince') || choiceText.includes('negotiate')) {
      return { diceType: 20, modifier: Math.floor(stats.charisma / 10), targetNumber: 14 };
    } else if (choiceText.includes('study') || choiceText.includes('research') || choiceText.includes('magic')) {
      return { diceType: 20, modifier: Math.floor(stats.intelligence / 10), targetNumber: 13 };
    } else if (choiceText.includes('sneak') || choiceText.includes('hide') || choiceText.includes('luck')) {
      return { diceType: 20, modifier: Math.floor(stats.luck / 10), targetNumber: 15 };
    }
    
    // Default for general actions
    return { diceType: 20, modifier: 0, targetNumber: 10 };
  };

  const handleChoiceClick = (choiceIndex: number) => {
    playSound('dice-roll');
    const choice = story.choices[choiceIndex];
    const difficulty = getChoiceDifficulty(choice, choiceIndex);
    
    setSelectedChoice(choiceIndex);
    setIsRolling(true);
  };

  const handleRollComplete = (result: { roll: number; total: number; success: boolean }) => {
    setIsRolling(false);
    
    if (selectedChoice !== null) {
      const choice = story.choices[selectedChoice];
      const difficulty = getChoiceDifficulty(choice, selectedChoice);
      
      // Generate outcome based on success/failure
      const effects = generateChoiceEffects(choice, result.success, game.gameState);
      
      setChoiceOutcome({
        choice: choice.text,
        effects,
        diceRoll: {
          ...result,
          diceType: difficulty.diceType,
          modifier: difficulty.modifier,
        }
      });
      
      // Play success/failure sound
      playSound(result.success ? 'success' : 'failure');
      
      // Call the parent's onChoice with the result
      onChoice(selectedChoice, result);
      setSelectedChoice(null);
    }
  };

  const generateChoiceEffects = (choice: any, success: boolean, gameState: any) => {
    const effects = [];
    const choiceText = choice.text.toLowerCase();
    
    if (choiceText.includes('fight') || choiceText.includes('attack')) {
      if (success) {
        effects.push({ type: 'stat', name: 'Health', change: -2, positive: false });
        effects.push({ type: 'currency', name: 'Gold', change: 15, positive: true });
        effects.push({ type: 'stat', name: 'Strength', change: 1, positive: true });
      } else {
        effects.push({ type: 'stat', name: 'Health', change: -8, positive: false });
        effects.push({ type: 'story', name: 'Reputation', change: 'Wounded in battle', positive: false });
      }
    } else if (choiceText.includes('study') || choiceText.includes('research')) {
      if (success) {
        effects.push({ type: 'stat', name: 'Intelligence', change: 2, positive: true });
        effects.push({ type: 'story', name: 'Knowledge', change: 'Gained valuable insight', positive: true });
      } else {
        effects.push({ type: 'stat', name: 'Intelligence', change: 1, positive: true });
        effects.push({ type: 'story', name: 'Time', change: 'Wasted hours studying', positive: false });
      }
    } else if (choiceText.includes('trade') || choiceText.includes('merchant')) {
      if (success) {
        effects.push({ type: 'currency', name: 'Gold', change: 25, positive: true });
        effects.push({ type: 'stat', name: 'Charisma', change: 1, positive: true });
      } else {
        effects.push({ type: 'currency', name: 'Gold', change: -10, positive: false });
      }
    } else {
      // Default effects for other choices
      if (success) {
        effects.push({ type: 'stat', name: 'Luck', change: 1, positive: true });
      } else {
        effects.push({ type: 'stat', name: 'Health', change: -1, positive: false });
      }
    }
    
    return effects;
  };

  const handleRaceInfoClick = () => {
    playSound('ui-click');
    setShowRaceInfo(true);
  };

  return (
    <>
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        {/* Chapter Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Chapter {story.chapter}
          </h2>
          <div className="text-purple-300 text-sm mt-1">
            {playerName} of {story.kingdomName} • {story.kingdomSize.charAt(0).toUpperCase() + story.kingdomSize.slice(1)}
          </div>
        </div>

        {/* Enhanced Race Banner - Clickable */}
        <div 
          className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30 cursor-pointer hover:border-purple-400 transition-all duration-200"
          onClick={handleRaceInfoClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-purple-300 flex items-center">
                {race.name}
                <span className="ml-2 text-xs text-purple-400">ℹ️ Click for details</span>
              </h3>
              <div className="text-sm text-purple-200">
                {race.traits.join(" • ")}
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="text-green-400">
                {race.buffs.map((buff: string, i: number) => (
                  <div key={i}>+{buff}</div>
                ))}
              </div>
              <div className="text-red-400">
                {race.debuffs.map((debuff: string, i: number) => (
                  <div key={i}>-{debuff}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dice Roll Interface */}
        {isRolling && selectedChoice !== null && (
          <div className="mb-6">
            <DiceRoll
              isRolling={isRolling}
              diceType={getChoiceDifficulty(story.choices[selectedChoice], selectedChoice).diceType}
              modifier={getChoiceDifficulty(story.choices[selectedChoice], selectedChoice).modifier}
              targetNumber={getChoiceDifficulty(story.choices[selectedChoice], selectedChoice).targetNumber}
              onRollComplete={handleRollComplete}
            />
          </div>
        )}

        {/* Story Content */}
        <div className="mb-8">
          {isGenerating ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <div className="text-purple-300">Weaving your tale...</div>
            </div>
          ) : story.currentScene ? (
            <div className="prose prose-invert max-w-none">
              <div className="text-purple-100 leading-relaxed text-lg whitespace-pre-wrap">
                {story.currentScene}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-purple-300">
              Your adventure is about to begin...
            </div>
          )}
        </div>

        {/* Enhanced Choices */}
        {!isGenerating && !isRolling && story.choices && story.choices.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-purple-300 mb-4">What do you choose?</h4>
            {story.choices.map((choice: any, index: number) => {
              const difficulty = getChoiceDifficulty(choice, index);
              const difficultyColor = difficulty.targetNumber >= 15 ? 'text-red-400' : 
                                    difficulty.targetNumber >= 12 ? 'text-yellow-400' : 'text-green-400';
              
              return (
                <button
                  key={index}
                  onClick={() => handleChoiceClick(index)}
                  className="w-full p-4 text-left bg-black/40 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400 rounded-lg transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-purple-200 group-hover:text-purple-100 flex-1">
                      <span className="font-bold text-purple-400 mr-2">{index + 1}.</span>
                      {choice.text}
                    </div>
                    <div className="ml-4 text-right text-xs">
                      <div className={`font-bold ${difficultyColor}`}>
                        d{difficulty.diceType}
                        {difficulty.modifier !== 0 && `${difficulty.modifier >= 0 ? '+' : ''}${difficulty.modifier}`}
                      </div>
                      <div className="text-purple-400">
                        Target: {difficulty.targetNumber}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Story History Toggle */}
        {story.history && story.history.length > 1 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-purple-400 hover:text-purple-300 font-medium">
              View Story History ({story.history.length} entries)
            </summary>
            <div className="mt-4 p-4 bg-black/20 rounded-lg border border-purple-500/20 max-h-64 overflow-y-auto">
              {story.history.slice(0, -1).map((entry: string, index: number) => (
                <div key={index} className="text-purple-200 text-sm mb-2 pb-2 border-b border-purple-500/10 last:border-b-0">
                  {entry}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Race Info Modal */}
      {showRaceInfo && (
        <RaceInfoModal
          race={race}
          onClose={() => setShowRaceInfo(false)}
        />
      )}

      <ChoiceOutcomePopup
        outcome={choiceOutcome}
        onClose={() => setChoiceOutcome(null)}
      />
    </>
  );
}
