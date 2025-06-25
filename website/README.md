# Natthakit Jantawong - Personal Portfolio Website

A sophisticated, interactive personal portfolio website showcasing Natthakit's journey as an AI engineer and computer science student. Built with React, Convex, and Tailwind CSS.

## About Natthakit

**Full Name:** Natthakit Jantawong  
**Nickname:** Deep  
**Location:** Bangkok, Thailand  
**Education:** Computer Science Student at Kasetsart University (Expected Graduation: June 2024)  
**Focus:** AI Research, Neuroscience, and Human-Computer Interaction  

## Features

- **Interactive Design**: Custom cursor, smooth animations, and engaging hover effects
- **Real-time Analytics**: Visitor tracking and interaction analytics powered by Convex
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Modern Tech Stack**: React 19, Convex backend, Tailwind CSS
- **Performance Optimized**: Fast loading with smooth transitions

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database)
- **Deployment**: Vercel (recommended)
- **Analytics**: Custom Convex-powered analytics

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/natthakit-portfolio.git
cd natthakit-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set up environment variables in Vercel dashboard:
   - `CONVEX_DEPLOYMENT` (from your Convex dashboard)
   - `NEXT_PUBLIC_CONVEX_URL` (from your Convex dashboard)

### Deploy Convex Backend

```bash
npx convex deploy
```

### Alternative Deployment Options

- **Netlify**: Works great with static builds
- **Railway**: Good for full-stack applications
- **Render**: Free tier available

## Customization

### Personal Information
Update the following files with your information:
- `src/components/Hero.tsx` - Name and title
- `src/components/About.tsx` - Personal story and stats
- `src/components/Experience.tsx` - Work experience
- `src/components/Contact.tsx` - Contact information

### Styling
- Colors: Edit `tailwind.config.js`
- Fonts: Update `src/index.css`
- Animations: Modify component-specific styles

### Images
Replace placeholder images in:
- `src/components/Hero.tsx` - Profile image
- `src/components/About.tsx` - About section image

## Analytics

The site includes built-in analytics that track:
- Visitor count
- Section interactions
- User engagement metrics

View analytics data in your Convex dashboard.

## Performance

- Lighthouse Score: 95+
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this as a template for your own portfolio.

## Contact

**Natthakit Jantawong (Deep)**
- Email: deef5509@gmail.com
- LinkedIn: [linkedin.com/in/diyh](https://linkedin.com/in/diyh)
- Phone: +66 90 323 0276
- Location: Bangkok, Thailand

---

Built with ❤️ using React and Convex for AI research and innovation
