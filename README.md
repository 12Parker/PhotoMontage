# 💕 Romantic Photo Timeline

A beautiful, interactive photo timeline web app with spiral animations, floating hearts, and romantic features perfect for celebrating your love story.

![Timeline Demo](https://img.shields.io/badge/Status-Working-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📸 Screenshots

![Timeline Demo](screenshots/Screenshot 2025-10-16 at 11.15.36 PM.png)

*Photos flow in a beautiful spiral with floating hearts, anniversary counter, and background music*

## ✨ Features

- **🌀 Spiral Photo Animation** - Photos flow in a beautiful winding spiral path
- **💖 Floating Hearts** - Romantic heart animations continuously drifting up
- **📅 Anniversary Counter** - Displays time since dating and marriage
- **💌 Love Quotes** - Random romantic quotes appear when viewing photos
- **🖼️ Lightbox Viewer** - Click photos to view full-size with pause functionality
- **🎵 Music Player** - Background music with play/pause controls
- **📱 Responsive Design** - Works beautifully on desktop and mobile

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Timeline.git
cd Timeline
```

### 2. Add Your Photos

Create a `pictures` folder and add your photos:

```bash
mkdir pictures
# Copy your photos into the pictures/ folder
```

### 3. Update Photo List

Edit `script.js` (lines 21-33) and replace the photo filenames with your own:

```javascript
photoFiles: [
    'your-photo-1.jpg',
    'your-photo-2.jpg',
    // Add all your photo filenames here
]
```

### 4. Add Your Music (Optional)

1. Place your song MP3 file in the root folder
2. Edit `index.html` (line 39) to use your song:

```html
<source src="your-song.mp3" type="audio/mpeg">
```

3. Update the song title in `index.html` (line 33)

### 5. Update Anniversary Dates

Edit `script.js` (lines 204-205) with your special dates:

```javascript
const DATING_START = new Date('YYYY-MM-DD');
const WEDDING_DATE = new Date('YYYY-MM-DD');
```

### 6. Run the Server

```bash
python3 server.py
```

Open your browser to `http://localhost:8001`

## 📁 File Structure

```
Timeline/
├── index.html              # Main HTML structure
├── styles.css              # All styling and animations
├── script.js               # JavaScript logic
├── server.py               # Local Python server
├── .gitignore             # Git ignore rules
├── MUSIC_INSTRUCTIONS.md  # Music setup guide
├── pictures/              # Your photos (not tracked by git)
│   └── *.jpg/png/jpeg
└── your-song.mp3          # Your music (not tracked by git)
```

## 🎨 Customization

### Change Colors

Edit `styles.css` to customize the color scheme:

```css
/* Background gradient */
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Heart colors - edit the heartEmojis array in script.js */
```

### Adjust Animation Speed

In `script.js` (line 19):

```javascript
animationDuration: 40,  // Change to speed up (20) or slow down (60)
```

### Change Photo Size

In `styles.css` (lines 32-34):

```css
.spiral-thumbnail {
    width: 180px;  /* Adjust size */
    height: 180px;
}
```

### Add More Love Quotes

Edit the `LOVE_QUOTES` array in `script.js` (lines 1-13).

## 🎵 Music Setup

See [MUSIC_INSTRUCTIONS.md](MUSIC_INSTRUCTIONS.md) for detailed music setup instructions.

## 📱 Mobile Support

The timeline is fully responsive and works great on:
- 📱 iPhone & Android phones
- 📟 Tablets
- 💻 Desktop browsers
- 🖥️ Large displays

## 🛠️ Technologies Used

- **HTML5** - Structure and audio
- **CSS3** - Animations and styling
- **JavaScript (ES6+)** - Interactive features
- **Python** - Local server
- **CSS Animations** - Spiral motion, floating hearts
- **SVG** - Coming soon for enhanced path animations

## 💡 Tips

- Use high-quality photos (JPEG recommended)
- Keep photo sizes under 5MB for best performance
- Use an MP3 file for music (30% volume by default)
- The spiral works best with 20-100 photos
- Photos are shuffled randomly on each load

## 🐛 Troubleshooting

**Photos not showing?**
- Check that photos are in the `pictures/` folder
- Verify filenames in `script.js` match your files
- Make sure server is running

**Music not playing?**
- Verify MP3 file is in the root folder
- Check filename in `index.html` matches your file
- Try clicking the play button (browsers require user interaction)

**Anniversary counter not updating?**
- Check date format is correct: `YYYY-MM-DD`
- Dates should be in the past

## 📄 License

MIT License - feel free to use this for your own romantic projects!

## ❤️ Credits

Created with love for celebrating relationships and memories.

Special thanks to:
- Tyler Childers for "All Your'n"
- CSS animation techniques from various web design resources

---

**Made with 💕 for preserving precious memories**
