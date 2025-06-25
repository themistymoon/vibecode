import { useState } from "react";

interface StoryDisplayProps {
  game: any;
  onChoice: (choiceIndex: number) => void;
  isGenerating: boolean;
}

export function StoryDisplay({ game, onChoice, isGenerating }: StoryDisplayProps) {
  const { story, race } = game.gameState;

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
      {/* Chapter Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Chapter {story.chapter}
        </h2>
        <div className="text-purple-300 text-sm mt-1">
          {story.kingdomName || "Your Village"} • {story.kingdomSize.charAt(0).toUpperCase() + story.kingdomSize.slice(1)}
        </div>
      </div>

      {/* Race Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-purple-300">{race.name}</h3>
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

      {/* Choices */}
      {!isGenerating && story.choices && story.choices.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-purple-300 mb-4">What do you choose?</h4>
          {story.choices.map((choice: any, index: number) => (
            <button
              key={index}
              onClick={() => onChoice(index)}
              className="w-full p-4 text-left bg-black/40 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400 rounded-lg transition-all duration-200 group"
            >
              <div className="text-purple-200 group-hover:text-purple-100">
                <span className="font-bold text-purple-400 mr-2">{index + 1}.</span>
                {choice.text}
              </div>
            </button>
          ))}
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
  );
}
