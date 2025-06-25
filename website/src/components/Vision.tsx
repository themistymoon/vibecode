export function Vision() {
  const visionPoints = [
    {
      title: "AI-Human Collaboration",
      description: "Building AI systems that enhance human intelligence rather than replace it. The future lies in seamless collaboration between human creativity and artificial intelligence.",
      icon: "🤝"
    },
    {
      title: "Neuroscience Integration",
      description: "Exploring the intersection of neuroscience and AI to create more intuitive and human-like artificial intelligence systems.",
      icon: "🧠"
    },
    {
      title: "Ethical AI Development",
      description: "Ensuring AI development considers ethical implications, fairness, and positive societal impact from the ground up.",
      icon: "⚖️"
    }
  ];

  return (
    <section id="vision" className="min-h-screen flex items-center py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            Vision for AI Future
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            My perspective on where artificial intelligence is heading and how I plan to contribute 
            to shaping that future through research and innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {visionPoints.map((point, index) => (
            <div 
              key={index}
              className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500"
              data-cursor-hover
            >
              <div className="text-5xl mb-6">{point.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-white">{point.title}</h3>
              <p className="text-white/70 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Ready to Shape the Future of AI?</h3>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            I'm seeking opportunities to collaborate on cutting-edge AI research, contribute to innovative projects, 
            and work with teams that share my passion for ethical and impactful artificial intelligence.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold hover:scale-105 transition-all duration-300"
              data-cursor-hover
            >
              Let's Collaborate
            </button>
            <button 
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300"
              data-cursor-hover
            >
              View Research
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
