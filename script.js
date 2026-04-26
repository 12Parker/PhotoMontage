const CONFIG = window.APP_CONFIG || {};
const DEBUG = false;

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

class SpiralPhotoStream {
  constructor(containerId, config) {
    this.container = document.getElementById(containerId);
    this.config = config;
    this.photoIndex = 0;
    this.activePhotos = [];
    this.lightbox = new Lightbox(config.loveQuotes);
    this.streamInterval = null;

    this.shufflePhotos();
    this.init();
  }

  shufflePhotos() {
    for (let i = this.config.photoFiles.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.config.photoFiles[i], this.config.photoFiles[j]] = [
        this.config.photoFiles[j],
        this.config.photoFiles[i]
      ];
    }
    log('Photos shuffled for spiral stream');
  }

  init() {
    for (let i = 0; i < this.config.photoCount; i += 1) {
      this.createPhoto(i * this.config.staggerDelay);
    }

    this.startContinuousStream();
  }

  createPhoto(delay) {
    const wrapper = document.createElement('div');
    wrapper.className = 'spiral-wrapper';
    wrapper.style.animationDelay = `${delay}s`;
    wrapper.style.animationDuration = `${this.config.animationDuration}s`;

    const image = document.createElement('img');
    image.className = 'spiral-thumbnail';

    const fileName =
      this.config.photoFiles[this.photoIndex % this.config.photoFiles.length];
    image.src = `${this.config.photosFolder}${fileName}`;
    image.alt = `Photo ${this.photoIndex + 1}`;

    image.onerror = () => {
      image.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="100%25" height="100%25" fill="%23222"/%3E%3Ctext x="50%25" y="50%25" font-size="28" fill="%23fff" dominant-baseline="middle" text-anchor="middle"%3EImage Missing%3C/text%3E%3C/svg%3E';
    };

    image.addEventListener('click', (event) => {
      event.stopPropagation();
      this.lightbox.open(image.src);
    });

    wrapper.appendChild(image);
    this.container.appendChild(wrapper);
    this.activePhotos.push(wrapper);
    this.photoIndex += 1;

    setTimeout(() => {
      this.removePhoto(wrapper);
    }, (delay + this.config.animationDuration) * 1000);
  }

  removePhoto(wrapper) {
    if (wrapper?.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
      this.activePhotos = this.activePhotos.filter((item) => item !== wrapper);
    }
  }

  startContinuousStream() {
    this.streamInterval = setInterval(() => {
      this.createPhoto(0);
    }, this.config.staggerDelay * 1000);
  }

  stop() {
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
    }
  }
}

class Lightbox {
  constructor(loveQuotes) {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = document.getElementById('lightboxImage');
    this.lightboxClose = document.getElementById('lightboxClose');
    this.lightboxQuote = document.getElementById('lightboxQuote');
    this.isOpen = false;
    this.loveQuotes = loveQuotes;

    this.init();
  }

  init() {
    this.lightboxClose.addEventListener('click', () => this.close());

    this.lightbox.addEventListener('click', (event) => {
      if (event.target === this.lightbox) {
        this.close();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(imageSrc) {
    this.lightboxImage.src = imageSrc;
    this.lightboxQuote.textContent = pickRandom(this.loveQuotes);
    this.lightbox.classList.add('active');
    document.body.classList.add('paused');
    this.isOpen = true;
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.classList.remove('paused');
    this.isOpen = false;
  }
}

class AnniversaryCounter {
  constructor(datingStart, weddingDate) {
    this.datingCounter = document.getElementById('datingCounter');
    this.marriedCounter = document.getElementById('marriedCounter');
    this.datingStart = new Date(datingStart);
    this.weddingDate = new Date(weddingDate);

    this.updateCounters();
    setInterval(() => this.updateCounters(), 3600000);
  }

  calculateTimeDifference(startDate) {
    const now = new Date();
    const diff = now - startDate;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor(
      (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)
    );
    const days = Math.floor(
      (diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
    );

    if (years > 0) {
      return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
    }

    if (months > 0) {
      return `${months} month${months !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`;
    }

    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  updateCounters() {
    this.datingCounter.textContent = this.calculateTimeDifference(this.datingStart);
    this.marriedCounter.textContent = this.calculateTimeDifference(this.weddingDate);
  }
}

class FloatingHearts {
  constructor() {
    this.container = document.getElementById('heartsContainer');
    this.heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝', '💞'];

    this.createHearts();
  }

  createHearts() {
    for (let i = 0; i < 10; i += 1) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = pickRandom(this.heartEmojis);
      this.container.appendChild(heart);
    }
  }
}

class MusicPlayer {
  constructor(musicConfig) {
    this.audio = document.getElementById('backgroundMusic');
    this.toggleButton = document.getElementById('musicToggle');
    this.playIcon = document.querySelector('.play-icon');
    this.pauseIcon = document.querySelector('.pause-icon');
    this.musicTitle = document.getElementById('musicTitle');
    this.musicConfig = musicConfig;
    this.isPlaying = false;

    this.init();
  }

  init() {
    this.musicTitle.textContent = this.musicConfig.title;
    this.audio.src = this.musicConfig.fileName;
    this.audio.volume = this.musicConfig.volume;

    this.toggleButton.addEventListener('click', () => this.toggle());

    this.audio.addEventListener('error', () => {
      this.musicTitle.textContent = 'Audio file not found';
    });
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return;
    }

    this.play();
  }

  play() {
    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.playIcon.style.display = 'none';
        this.pauseIcon.style.display = 'inline';
      })
      .catch(() => {
        this.musicTitle.textContent = 'Click to retry music';
      });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.playIcon.style.display = 'inline';
    this.pauseIcon.style.display = 'none';
  }
}

function validateConfig(config) {
  const required = ['photosFolder', 'photoCount', 'staggerDelay', 'photoFiles'];
  return required.every((key) => key in config);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!validateConfig(CONFIG)) {
    console.error('Missing required APP_CONFIG values.');
    return;
  }

  const container = document.getElementById('photoContainer');
  if (!container) {
    console.error('Photo container not found.');
    return;
  }

  new AnniversaryCounter(CONFIG.datingStart, CONFIG.weddingDate);
  new FloatingHearts();
  new MusicPlayer(CONFIG.music);
  new SpiralPhotoStream('photoContainer', CONFIG);
});
