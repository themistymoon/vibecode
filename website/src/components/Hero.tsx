import { useEffect, useState } from "react";

export function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "AI Engineer",
    "Computer Science Student", 
    "Research Enthusiast",
    "Innovation Catalyst"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="text-center z-10 max-w-4xl mx-auto px-6">
        {/* Profile image */}
        <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
          <img 
            src="https://i.ibb.co/5pMS9gC/profile.jpg" 
            alt="Natthakit Jantawong (Deep)" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to gradient placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.className = "w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl font-bold";
                parent.innerHTML = "Deep";
              }
            }}
          />
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
          Natthakit
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-light mb-8 text-white/80">
          Jantawong
        </h2>

        <div className="h-16 mb-12">
          <p className="text-xl md:text-2xl text-purple-300 font-medium transition-all duration-500">
            {texts[textIndex]}
          </p>
        </div>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
          Computer Science student passionate about AI research and neuroscience. 
          Building innovative technologies that bridge the gap between human intelligence and artificial intelligence.
        </p>

        <button 
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
          data-cursor-hover
        >
          <span className="text-white font-medium">Discover My Journey</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
