# 🏰 Kingdoms of Fate

An epic text-based RPG adventure game featuring AI-generated storytelling, kingdom management, turn-based combat, and character progression. Built with React, TypeScript, and Convex.

![Kingdoms of Fate](public/og-preview.png)

## ✨ Features

- 🎲 **8 Unique Races** - Each with distinct traits, buffs, and debuffs
- 📖 **AI-Generated Stories** - Dynamic narratives that adapt to your choices
- ⚔️ **Turn-Based Combat** - Strategic battles with dice-based mechanics
- 🏰 **Kingdom Management** - Build and upgrade your settlement from village to empire
- 📦 **Inventory System** - Collect, equip, and use items
- 🏪 **Merchant Trading** - Buy and sell equipment and consumables
- 💾 **Save/Load System** - Continue your adventure anytime
- 🎵 **Audio Experience** - Background music and sound effects
- 📱 **Responsive Design** - Play on desktop or mobile

## 🎮 How to Play

1. **Choose Your Race** - Spin the Wheel of Fate or manually select from 8 races
2. **Make Choices** - Navigate through AI-generated story scenarios
3. **Roll Dice** - Success/failure based on your stats and luck
4. **Manage Resources** - Balance health, currency, and kingdom growth
5. **Engage in Combat** - Fight enemies with strategic turn-based battles
6. **Build Your Kingdom** - Upgrade from village to empire

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kingdoms-of-fate.git
   cd kingdoms-of-fate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```
   Follow the prompts to create a new Convex project.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🌐 Free Deployment Options

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Add environment variables in Vercel dashboard:
   - `VITE_CONVEX_URL` (from your Convex dashboard)
6. Deploy!

### Option 2: Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables in Netlify dashboard
7. Deploy!

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy-gh": "gh-pages -d dist"`
3. Run: `npm run build && npm run deploy-gh`

## 🔧 Environment Variables

The game uses Convex's built-in OpenAI integration by default. For better performance, you can set up your own API keys:

### Required (Auto-provided by Convex)
- `VITE_CONVEX_URL` - Your Convex deployment URL

### Optional (For better performance)
- `OPENAI_API_KEY` - Your OpenAI API key
- `RESEND_API_KEY` - For email notifications (optional)

Add these in your Convex dashboard under Settings → Environment Variables.

## 🏗️ Project Structure

```
kingdoms-of-fate/
├── convex/                 # Backend functions and schema
│   ├── game.ts            # Core game logic
│   ├── races.ts           # Race definitions and initialization
│   ├── combat.ts          # Combat system
│   ├── cityManagement.ts  # Kingdom building
│   ├── enhancedGame.ts    # Advanced game features
│   └── schema.ts          # Database schema
├── src/                   # Frontend React application
│   ├── components/        # React components
│   │   ├── GameInterface.tsx
│   │   ├── RaceSelection.tsx
│   │   ├── CombatInterface.tsx
│   │   └── ...
│   └── App.tsx           # Main application component
├── public/               # Static assets
│   └── sounds/          # Audio files
└── README.md
```

## 🎯 Game Mechanics

### Races
- **Human**: Balanced stats, good at trading
- **Elf**: High intelligence, nature affinity
- **Dwarf**: Strong crafters, material bonus
- **Orc**: Combat focused, high strength
- **Demon**: Dark magic, unique abilities
- **Dragonkin**: Fire resistance, powerful
- **Beastfolk**: Nature connection, agility
- **Undead**: Death resistance, necromancy

### Stats System
- **Health**: Your life force
- **Strength**: Physical power and combat
- **Intelligence**: Magic and problem-solving
- **Charisma**: Social interactions and trading
- **Luck**: Affects dice rolls and random events

### Kingdom Progression
Village → Town → City → Kingdom → Empire

Each upgrade increases population capacity and unlocks new buildings.

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to Convex production

### Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (serverless functions + database)
- **AI**: OpenAI GPT-4.1-nano for story generation
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify + Convex

## 🐛 Troubleshooting

### Common Issues

**"Failed to generate story"**
- Wait 1-2 minutes (API rate limits)
- Check internet connection
- Set up your own OpenAI API key

**Game won't load**
- Ensure `npx convex dev` is running
- Clear browser cache
- Check browser console for errors

**Race selection not working**
- Wait for auto-initialization
- Refresh the page

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [Convex](https://convex.dev) for the backend
- AI storytelling powered by OpenAI
- Sound effects and music for immersive experience
- Inspired by classic text-based RPGs

## 📞 Support

If you encounter any issues:
1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Look at browser console for error messages
3. Open an issue on GitHub with detailed information

---

**Start your epic adventure today!** 🗡️✨
