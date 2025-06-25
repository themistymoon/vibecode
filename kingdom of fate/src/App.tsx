import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { RaceSelection } from "./components/RaceSelection";
import { GameInterface } from "./components/GameInterface";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export default function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    // Get or create session ID
    let storedSessionId = localStorage.getItem('kingdoms-session-id');
    if (!storedSessionId) {
      storedSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('kingdoms-session-id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const currentGame = useQuery(
    api.game.getGameBySession, 
    sessionId ? { sessionId } : "skip"
  );

  useEffect(() => {
    // Initialize background music
    const audio = new Audio('/sounds/background-music.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    
    const playMusic = () => {
      audio.play().catch(() => {
        // Auto-play blocked, will play on first user interaction
      });
    };

    // Try to play immediately
    playMusic();

    // Play on first user interaction
    const handleFirstInteraction = () => {
      playMusic();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      audio.pause();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            ⚔️ Kingdoms of Fate ⚔️
          </h1>
          <p className="text-purple-200 text-xl">
            Forge your destiny in an epic text adventure
          </p>
        </header>

        {currentGame ? (
          <GameInterface game={currentGame} />
        ) : (
          <RaceSelection />
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
