# 🎵 Music Setup Guide

## Music Files Location

Add your music files to: `/frontend/public/music/`

## Required Files

1. **`home.mp3`** - Main menu background music
2. **`game-a.mp3`** - Groove Orbit Runner music
3. **`game-b.mp3`** - Space Groove Drift music (when available)
4. **`game-c.mp3`** - Groove Arena Overdrive music (when available)

## Specifications

- **Format:** MP3 or OGG (MP3 recommended for compatibility)
- **Bitrate:** 128-192 kbps (balance between quality and file size)
- **Sample Rate:** 44.1 kHz
- **Duration:** 2-4 minutes (will loop automatically)
- **Volume:** Normalized to -14 LUFS (will be adjusted in-app)

## Music Behavior

- ✅ **Autoplay:** Music starts automatically when page loads
- ✅ **Loop:** Music loops infinitely
- ✅ **Volume Control:** Users can adjust volume with slider (bottom-right)
- ✅ **Mute:** Users can mute/unmute with button
- ✅ **Stop on Navigation:** Music stops when navigating to game pages
- ✅ **Game-specific Music:** Each game plays its own music

## Adding Music Files

### Method 1: Local Development

```bash
cd frontend/public/music
# Add your MP3 files here
cp ~/Downloads/home.mp3 .
cp ~/Downloads/game-a.mp3 .
cp ~/Downloads/game-b.mp3 .
cp ~/Downloads/game-c.mp3 .
```

### Method 2: Production Server

```bash
ssh user@pawstation.djebre.fr
cd /path/to/PawStation-Overdrive/frontend/public/music
# Upload or copy your music files
```

### Method 3: During Docker Build

Music files in `frontend/public/music/` will be included in the Docker build automatically.

## Volume Levels

Default volumes (can be adjusted in code):

- **Home Music:** 30% (0.3)
- **Game A Music:** 40% (0.4)
- **Game B Music:** 35% (0.35)
- **Game C Music:** 40% (0.4)

To change default volumes, edit the `useMusic` hook calls in each page:

```javascript
const music = useMusic('/music/home.mp3', {
  autoplay: true,
  loop: true,
  volume: 0.3, // Change this value (0.0 to 1.0)
});
```

## Music Control UI

Located at bottom-right corner:
- 🔊 Volume icon (click to mute/unmute)
- Slider (drag to adjust volume)

## Browser Autoplay Policy

Modern browsers block autoplay by default. Music will start:
- ✅ After user interaction (click, tap)
- ✅ If user previously interacted with the site
- ❌ On first visit without interaction

The app handles this gracefully - music will start as soon as possible.

## Testing

### Without Music Files
App will work normally without errors. Music simply won't play.

### With Music Files
1. Add at least `home.mp3`
2. Start the app
3. Music should start playing automatically
4. Test volume controls
5. Navigate to game and verify music stops

## Troubleshooting

### Music doesn't play
- Check browser console for errors
- Verify file paths are correct
- Check file format (MP3 recommended)
- Try clicking anywhere on the page (browser autoplay policy)

### Music is too loud/quiet
- Adjust volume with slider
- Or change default volume in code (see above)

### Music doesn't loop
- Verify `loop: true` in useMusic call
- Check browser console for errors

## Recommended Music Style

For Space Groove theme:
- **Home:** Upbeat disco/electronic, groovy, welcoming
- **Game A (Orbit Runner):** Fast-paced electronic, intense, arcade-style
- **Game B (Groove Drift):** Chill, vaporwave, ambient electronic
- **Game C (Arena Overdrive):** Hardcore electronic, rhythmic, aggressive

## Free Music Resources

- **Uppbeat:** https://uppbeat.io
- **Epidemic Sound:** https://www.epidemicsound.com
- **Bensound:** https://www.bensound.com
- **Free Music Archive:** https://freemusicarchive.org

⚠️ **Important:** Make sure you have the rights to use the music!

---

**Ready to add music! Place your MP3 files in `/frontend/public/music/` 🎵**
