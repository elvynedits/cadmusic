# Cadence App - Complete Deployment & Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install & Run
```bash
npm install
npm run dev
```

Open: http://localhost:3000

Done! The app should now be running with:
- Frontend on port 5173
- Backend API on port 3000

### Step 2: Test The App
1. Click search icon (bottom right)
2. Search for "trending songs"
3. Click a song to play
4. Click play button to start audio
5. Use skip/volume controls

## Detailed Setup

### Requirements
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- ~500MB disk space

### Installation
```bash
# Clone or extract the project
cd cadence

# Install all dependencies
npm install

# Start both frontend and backend
npm run dev
```

### What Gets Started
- **Frontend:** http://localhost:5173 (React app)
- **Backend:** http://localhost:3000 (API server)
- Both run from single `npm run dev` command

## Features to Test

### 🎵 Playing Music
```
1. Search icon (bottom right) → "billie eilish"
2. Click song in results
3. Play button appears → click it
4. Volume slider works (right side of player)
5. Skip buttons work (player controls)
```

### 👤 User Account
```
1. Top right → Sign in with Google or Email
2. Search & save songs
3. Songs appear in "Liked Songs"
```

### 📚 Playlists
```
1. Go to Library (bottom nav)
2. New Playlist → Enter name
3. Search songs → Add to playlist
4. Click playlist to view
5. Remove songs with trash icon
```

### 🔍 Search
```
1. Search icon (bottom right)
2. Type song/artist/genre
3. Results appear as you type
4. Click song to play immediately
```

## Configuration

### Firebase (Already Configured!)
- ✅ Firestore Database enabled
- ✅ Authentication (Google + Email) enabled
- ✅ API key: Pre-configured in src/firebase.ts

No additional setup needed! Uses shared demo project.

### To Use Your Own Firebase Project:

1. Create new Firebase project: https://console.firebase.google.com
2. Get your config (Project Settings)
3. Replace values in `src/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## Production Build

### Build the App
```bash
npm run build
# Creates optimized files in dist/ folder
```

### Test Production Build
```bash
npm run start
# Runs production server on http://localhost:3000
```

### Deploy Frontend to Netlify

```bash
# Build first
npm run build

# Option 1: Drag & Drop
# Go to https://app.netlify.com
# Drag dist/ folder to deploy area

# Option 2: Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

### Deploy Backend to Railway

```bash
# Sign up at https://railway.app
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway deploy
```

## Environment Variables

### Optional .env file:
```
VITE_API_URL=http://localhost:3000
```

### For Production:
```
VITE_API_URL=https://your-api-domain.com
```

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Songs won't play

**Check:**
1. Internet connection working?
2. Try different song
3. Check browser console (F12)
4. Check API: http://localhost:3000/api/health

**Should show:**
```json
{"status":"ok"}
```

### Issue: Stuck on loading spinner

**Try:**
```bash
# Stop (Ctrl+C)
npm run clean
npm run build
npm run dev
```

### Issue: Firebase auth not working

**Check:**
1. Firebase console enabled Authentication
2. Google OAuth credentials configured
3. Firestore rules allow reads/writes

**Check rules:**
```
Go to Firebase Console
→ Firestore Database
→ Rules tab
→ Should see rules in firestore.rules file
```

### Issue: Search returns no results

**Check:**
```bash
# Test API health
curl http://localhost:3000/api/health

# Test search
curl -X POST http://localhost:3000/api/search-music \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'
```

## Scripts Reference

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run start            # Start production server
npm run lint             # Type check code
npm run clean            # Remove dist folder
```

## Ports Used

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 3000 | http://localhost:3000 |

⚠️ **Make sure both ports are available!**

If ports are in use:
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## File Structure

```
cadence/
├── src/                    # React source code
│   ├── screens/           # Page components
│   ├── components/        # UI components
│   ├── store/             # State management
│   ├── services/          # API calls
│   ├── firebase.ts        # Firebase config
│   └── App.tsx            # Main app
├── server.ts              # Express backend
├── package.json
├── vite.config.ts
├── firestore.rules        # Database rules
├── FIXES.md               # What was fixed
└── README.md              # This file
```

## Common Tasks

### Add New Song Search Filter
Edit `src/screens/SearchScreen.tsx` → Add category buttons

### Change App Colors
Edit `src/index.css` → Update color variables
Currently uses: Pink (#FF2D55), Dark (#0A0A0A)

### Add New Navigation Item
Edit `src/components/layout/BottomNavigation.tsx`

### Change API Endpoints
Edit `server.ts` → Modify Express routes

### Update Firestore Rules
Edit `firestore.rules` → Deploy to Firebase Console

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| → | Next song |
| ← | Previous song |
| / | Focus search |
| ? | Help (not implemented yet) |

## Performance Tips

1. **Faster Search:** Type more specific queries
2. **Faster Streaming:** First 2 seconds are slowest
3. **Faster App:** Use modern browser (Chrome, Firefox, Safari)
4. **Faster Build:** Clear node_modules if issues

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile browsers (iOS Safari, Chrome Android)

❌ Internet Explorer (not supported)

## Mobile Testing

### Test on Phone:
```bash
# Get your IP address
# Then visit: http://YOUR_IP:3000

# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

## Making Changes

### Edit Code
- Any file in `src/` auto-reloads (hot reload)
- Save file → Browser updates automatically
- Server.ts changes require restart

### Restart Server
```bash
# Stop: Ctrl+C
# Start: npm run dev
```

## Debugging

### Check Console
```
Browser: Press F12 → Console tab
Look for red error messages
```

### Check Network
```
Browser: F12 → Network tab
Watch API calls
Look for failed requests (red)
```

### Check Firestore
```
Firebase Console
→ Firestore Database
→ Check data in collections
```

### Server Logs
```
Terminal running `npm run dev`
Watch for errors and API calls
```

## Deployment Checklist

Before deploying to production:

- [ ] Test all features locally
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Run `npm run build` successfully
- [ ] Update Firebase production config
- [ ] Update API URLs in `.env`
- [ ] Test production build: `npm run start`
- [ ] Deploy backend first
- [ ] Update frontend API URL
- [ ] Deploy frontend
- [ ] Test production app
- [ ] Monitor Firestore usage

## Support Resources

| Resource | URL |
|----------|-----|
| Firebase Docs | https://firebase.google.com/docs |
| React Docs | https://react.dev |
| Vite Docs | https://vitejs.dev |
| Tailwind CSS | https://tailwindcss.com |
| Express.js | https://expressjs.com |

## Getting Help

### Check Logs
```
1. Browser console (F12)
2. Terminal output
3. Firebase console
```

### Google the Error
```
Copy full error message
Paste into Google
Usually finds Stack Overflow answers
```

### Check FIXES.md
```
All issues that were fixed are documented
Might have solution to your problem
```

## Next Steps

1. ✅ Get app running: `npm run dev`
2. ✅ Test all features
3. ✅ Customize to your needs
4. ✅ Build for production: `npm run build`
5. ✅ Deploy to hosting service

## Tips for Success

- **Start Simple:** Just get it running first
- **Test Early:** Check features as you go
- **Read Errors:** Error messages usually tell you what's wrong
- **Check Docs:** FIXES.md has solutions to common issues
- **Ask Questions:** Don't guess, research first

---

**You're all set! Happy coding! 🚀**

If something breaks, it's usually one of three things:
1. Node modules corrupted → `rm -rf node_modules && npm install`
2. Server not running → Check terminal for `npm run dev`
3. Firebase config wrong → Check src/firebase.ts

Good luck! 🎵
