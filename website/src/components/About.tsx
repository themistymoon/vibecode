export function About() {
  return (
    <section id="about" className="min-h-screen flex items-center py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              The Mind Behind The Code
            </h2>
            
            <div className="space-y-6 text-lg text-white/80 leading-relaxed">
              <p>
                I'm a Computer Science student at Kasetsart University with an insatiable curiosity for 
                research, coding, and continuous self-improvement. My passion lies in exploring the 
                fascinating intersection of neuroscience and technology.
              </p>
              
              <p>
                Currently participating in the Super AI Engineer program, I'm diving deep into 
                cutting-edge AI technologies including NLP, computer vision, and time series analysis. 
                Every project is an opportunity to push boundaries and create meaningful impact.
              </p>
              
              <p>
                I believe in the power of innovative thinking, rigorous research, 
                and solutions that don't just work—they transform how we understand intelligence itself.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">2024</div>
                <div className="text-sm text-white/60">Expected Graduation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300 mb-2">5+</div>
                <div className="text-sm text-white/60">AI Hackathons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">∞</div>
                <div className="text-sm text-white/60">Learning Mindset</div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Profile image */}
            <div className="w-full aspect-square rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <img 
                src="https://i.ibb.co/5pMS9gC/profile.jpg" 
                alt="Natthakit Jantawong - AI Engineer and Computer Science Student" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to brain emoji placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.className = "w-full aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-white/10 flex items-center justify-center";
                    parent.innerHTML = '<div class="text-6xl text-white/30">🧠</div>';
                  }
                }}
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
