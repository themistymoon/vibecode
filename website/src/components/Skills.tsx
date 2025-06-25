export function Skills() {
  const skillCategories = [
    {
      title: "Artificial Intelligence",
      skills: [
        { name: "Deep Learning", level: 90 },
        { name: "Natural Language Processing", level: 88 },
        { name: "Computer Vision", level: 85 },
        { name: "Large Language Models", level: 87 }
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Data Science",
      skills: [
        { name: "Time Series Analysis", level: 85 },
        { name: "Data Analysis", level: 90 },
        { name: "Demand Forecasting", level: 82 },
        { name: "Big Data", level: 80 }
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Technical",
      skills: [
        { name: "C Programming", level: 88 },
        { name: "Cloud Computing", level: 85 },
        { name: "IoT Development", level: 80 },
        { name: "Signal Processing", level: 78 }
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Communication",
      skills: [
        { name: "Public Relations", level: 85 },
        { name: "Content Marketing", level: 88 },
        { name: "Creative Writing", level: 90 },
        { name: "Social Media", level: 87 }
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="skills" className="min-h-screen flex items-center py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
            Technical Arsenal
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            A diverse toolkit built through intensive learning, hackathons, and hands-on projects 
            in the rapidly evolving field of artificial intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">{category.title}</h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white/80">{skill.name}</span>
                      <span className="text-white/60 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${category.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            These skills represent real experience from hackathons, research projects, and continuous learning. 
            Each percentage reflects practical application and measurable outcomes in AI development.
          </p>
        </div>
      </div>
    </section>
  );
}
