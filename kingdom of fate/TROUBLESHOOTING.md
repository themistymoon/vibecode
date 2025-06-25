# Troubleshooting Guide

## Common Issues

### 1. "Failed to generate story" Error

**Symptoms:**
- Story doesn't load when starting a new game
- Error message appears when making choices
- Loading spinner continues indefinitely

**Causes & Solutions:**

#### A. OpenAI API Rate Limits
- **Cause**: Built-in Convex OpenAI has usage limits
- **Solution**: Wait 1-2 minutes and try again
- **Long-term fix**: Set up your own OpenAI API key

#### B. Network Issues
- **Cause**: Poor internet connection
- **Solution**: Check your internet connection and retry

#### C. API Response Parsing Error
- **Cause**: OpenAI response format changed
- **Solution**: Check browser console for detailed errors

#### D. Convex Backend Not Running
- **Cause**: Backend functions not deployed
- **Solution**: Run `npx convex dev` in terminal

### 2. Game Won't Load

**Symptoms:**
- Blank screen or loading spinner
- Race selection doesn't appear

**Solutions:**
1. **Check Convex Status**: Ensure `npx convex dev` is running
2. **Clear Browser Cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
3. **Check Console**: Look for error messages in browser developer tools

### 3. Race Selection Issues

**Symptoms:**
- No races appear in selection screen
- "Spin the Wheel" doesn't work

**Solutions:**
1. **Wait for Initialization**: Races auto-initialize on first load
2. **Check Network**: Ensure stable internet connection
3. **Refresh Page**: Sometimes helps with initialization

### 4. Combat Not Working

**Symptoms:**
- Combat interface doesn't load
- Attack buttons don't respond

**Solutions:**
1. **Check Game State**: Ensure you're actually in combat
2. **Refresh Game**: Sometimes combat state gets stuck
3. **Check Console**: Look for JavaScript errors

### 5. Save/Load Issues

**Symptoms:**
- Can't save game
- Load doesn't work

**Solutions:**
1. **Check Browser Storage**: Ensure localStorage is enabled
2. **Clear Old Data**: Clear browser data if corrupted
3. **Try Different Browser**: Test in incognito/private mode

## Debug Steps

### 1. Check Browser Console
1. Press F12 (or right-click → Inspect)
2. Go to Console tab
3. Look for red error messages
4. Copy error messages for troubleshooting

### 2. Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Look for failed requests (red entries)
4. Check if API calls are being made

### 3. Check Convex Dashboard
1. Go to your Convex dashboard
2. Check if functions are deployed
3. Look at function logs for errors

## Environment Variables Setup

If you're experiencing API issues, set up your own keys:

### OpenAI Setup
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. In Convex Dashboard → Settings → Environment Variables:
   - Name: `OPENAI_API_KEY`
   - Value: Your API key

### Resend Setup (Optional)
1. Go to https://resend.com/api-keys
2. Create new API key
3. In Convex Dashboard → Settings → Environment Variables:
   - Name: `RESEND_API_KEY`
   - Value: Your API key

## Performance Issues

### Slow Story Generation
- **Cause**: Using built-in Convex OpenAI limits
- **Solution**: Set up your own OpenAI API key for faster responses

### Game Lag
- **Cause**: Too many API calls or large game state
- **Solution**: Refresh the page to reset game state

## Getting Help

1. **Check Console First**: Always check browser console for errors
2. **Copy Error Messages**: Include full error text when asking for help
3. **Describe Steps**: What were you doing when the error occurred?
4. **Browser Info**: Include browser type and version

## Emergency Reset

If nothing works:
1. Clear all browser data for the site
2. Run `npx convex dev --clear` to reset backend
3. Refresh the page and start over

**Note**: This will delete all saved games!
