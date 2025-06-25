export function Experience() {
  const experiences = [
    {
      period: "April 2025 - Present",
      role: "Super AI Engineer Season 5 Level 2",
      company: "Artificial Intelligence Association of Thailand",
      description: "Advanced AI engineering program focusing on practical applications and cutting-edge research in artificial intelligence and cloud computing.",
      achievements: [
        "Participated in onsite AI & cloud computing bootcamp",
        "Built time series forecasting models for sales/demand prediction",
        "Developed multilabel classification models for LLM hackathon",
        "Specialized in speech & language processing through audio understanding"
      ]
    },
    {
      period: "January 2025 - March 2025",
      role: "Super AI Engineer Season 5 Level 1",
      company: "Artificial Intelligence Association of Thailand",
      description: "Intensive AI program covering multiple domains through hands-on hackathons and practical projects.",
      achievements: [
        "Completed 5 AI-focused hackathons: NLP, CV, Data Science, IoT, Signal Processing",
        "Participated in 24-hour final hackathon integrating all five domains",
        "Gained comprehensive understanding of AI ecosystem"
      ]
    },
    {
      period: "March 2023 - March 2024",
      role: "Public Relations",
      company: "The YouDee Project",
      description: "Managed digital presence and community engagement for educational project, creating content that resonates with target audience.",
      achievements: [
        "Managed Facebook page and social media presence",
        "Created engaging content for community building",
        "Enhanced project visibility and community engagement"
      ]
    }
  ];

  return (
    <section id="experience" className="min-h-screen flex items-center py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Journey of Learning
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Each experience has been a stepping stone in my quest to understand and innovate 
            at the intersection of AI and human intelligence.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 to-blue-500 hidden md:block"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="relative md:pl-20">
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hidden md:block"></div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
                      <p className="text-purple-300 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-white/60 font-mono text-sm mt-2 md:mt-0">{exp.period}</span>
                  </div>
                  
                  <p className="text-white/80 mb-6 leading-relaxed">{exp.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {exp.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-white/70">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
