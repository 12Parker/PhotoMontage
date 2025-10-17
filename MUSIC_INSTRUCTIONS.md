# 🎵 How to Add Your Wedding Song

## Quick Setup (3 Steps):

### 1. Get Your Audio File
- Find your wedding song audio file (MP3 format is best)
- You can convert other formats to MP3 using online converters

### 2. Rename Your File
- Rename your audio file to: **`wedding-song.mp3`**
- Make sure it's exactly this name (lowercase, with hyphen)

### 3. Place in Timeline Folder
- Put `wedding-song.mp3` in the same folder as `index.html`
- Your folder should look like:
  ```
  Timeline/
  ├── index.html
  ├── styles.css
  ├── script.js
  ├── wedding-song.mp3  ← Your song here!
  ├── pictures/
  └── ...
  ```

## Alternative: Different Song Name

If you want to use a different filename, edit `index.html` line 39:

```html
<source src="wedding-song.mp3" type="audio/mpeg">
```

Change `wedding-song.mp3` to your filename, like:
```html
<source src="my-first-dance.mp3" type="audio/mpeg">
```

## Features:

✨ **Music Player Controls:**
- Click ▶️ button in bottom-right to play/pause
- Music loops automatically
- Volume set to 30% (comfortable background level)
- Beautiful frosted glass design

🎶 **Automatic Behavior:**
- Music starts paused (click to play)
- Continues playing as you browse photos
- Loops endlessly for continuous ambiance

## Troubleshooting:

**Music not playing?**
1. Check console (F12) for error messages
2. Verify file is named exactly `wedding-song.mp3`
3. Make sure file is in the same folder as `index.html`
4. Try refreshing the page (Cmd+R or Ctrl+R)

**Want different volume?**
Edit `script.js` line 275:
```javascript
this.audio.volume = 0.3; // Change to 0.5 for 50%, 0.8 for 80%, etc.
```

Enjoy your romantic timeline with your special song! 💕

