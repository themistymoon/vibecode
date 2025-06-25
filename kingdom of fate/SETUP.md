# Kingdoms of Fate - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development**
   ```bash
   npm run dev
   ```

3. **Deploy Convex Backend**
   ```bash
   npx convex dev
   ```

## Environment Setup

The app uses built-in Convex OpenAI integration, so no API keys are required initially. However, you can set up your own keys for better performance:

### Optional: Custom OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. In Convex Dashboard → Settings → Environment Variables, add:
   - `OPENAI_API_KEY`: Your OpenAI API key

### Optional: Custom Resend API Key (for emails)
1. Go to [Resend](https://resend.com/api-keys)
2. Create a new API key
3. In Convex Dashboard → Settings → Environment Variables, add:
   - `RESEND_API_KEY`: Your Resend API key

## Project Structure

```
/convex/           # Backend functions and schema
  ├── game.ts      # Core game logic
  ├── races.ts     # Race definitions
  ├── combat.ts    # Combat system
  ├── schema.ts    # Database schema
  └── ...

/src/              # Frontend React app
  ├── App.tsx      # Main app component
  ├── components/  # UI components
  └── ...
```

## Common Issues & Solutions

### "Failed to generate story"
This is the most common issue. Here are the causes and solutions:

#### Cause 1: OpenAI API Rate Limits
- **Symptom**: Error after making several choices
- **Solution**: Wait 2-3 minutes and try again
- **Long-term fix**: Set up your own OpenAI API key (see Environment Variables section)

#### Cause 2: Network/API Issues
- **Symptom**: Error on first story generation
- **Solution**: Check internet connection, refresh page
- **Debug**: Open browser console (F12) to see detailed error

#### Cause 3: Convex Backend Not Running
- **Symptom**: No story loads at all
- **Solution**: Ensure `npx convex dev` is running in terminal

#### Cause 4: Invalid API Response
- **Symptom**: Story loads but choices don't work
- **Solution**: The app now has fallback content, should work automatically

### Game not loading
- **Cause**: Convex backend not deployed
- **Solution**: Run `npx convex dev` in terminal

### Race selection not working
- **Cause**: Database not initialized
- **Solution**: Races are auto-initialized on first load

## Features

- 🎲 Dice-based RPG mechanics
- 🏰 City management and kingdom building
- ⚔️ Turn-based combat system
- 📦 Inventory and equipment system
- 🏪 Merchant trading
- 💾 Save/load game system
- 🎵 Background music and sound effects

## Development Commands

```bash
# Start frontend development server
npm run dev

# Deploy Convex backend
npx convex dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## Troubleshooting

1. **Clear browser cache** if experiencing issues
2. **Check browser console** for error messages
3. **Verify Convex deployment** is running
4. **Check network connection** for API calls

For more help, check the browser console for detailed error messages.

## Quick Diagnostic Checklist

1. **Convex Backend**: Run `npx convex dev` - should show "Convex functions ready!"
2. **Frontend**: Run `npm run dev` - should show "Local: http://localhost:5173"  
3. **Race Selection**: Should show 8 races (wait for auto-initialization)
4. **Story Generation**: Should work after race selection (now has fallback content)
5. **Browser Console**: Press F12 → Console tab to see any error messages
