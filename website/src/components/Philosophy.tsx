export function Philosophy() {
  const principles = [
    {
      title: "Research-Driven Innovation",
      description: "I believe in diving deep into the fundamentals. Every breakthrough starts with understanding the 'why' before the 'how'.",
      icon: "🔬"
    },
    {
      title: "Human-Centered AI",
      description: "Technology should amplify human potential, not replace it. I design AI systems that enhance human intelligence and creativity.",
      icon: "❤️"
    },
    {
      title: "Continuous Learning",
      description: "In the rapidly evolving field of AI, staying curious and adaptable is not optional—it's essential for meaningful contribution.",
      icon: "📚"
    },
    {
      title: "Ethical Foundation",
      description: "Every AI system I build considers its impact on society. Technology without ethics is just sophisticated tools without purpose.",
      icon: "⚖️"
    }
  ];

  return (
    <section id="philosophy" className="min-h-screen flex items-center py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Research Philosophy
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            These principles guide my approach to AI research, development, 
            and every project I undertake in the pursuit of meaningful innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {principles.map((principle, index) => (
            <div 
              key={index}
              className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105"
              data-cursor-hover
            >
              <div className="text-4xl mb-4">{principle.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors">
                {principle.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <blockquote className="text-2xl md:text-3xl font-light text-white/80 italic max-w-4xl mx-auto">
            "The best AI systems don't just process data—they understand context, respect humanity, and create possibilities."
          </blockquote>
          <cite className="block mt-4 text-purple-300">— My Research Compass</cite>
        </div>
      </div>
    </section>
  );
}
