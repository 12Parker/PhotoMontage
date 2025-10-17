// Love quotes
const LOVE_QUOTES = [
    "Every love story is beautiful, but ours is my favorite.",
    "In all the world, there is no heart for me like yours.",
    "You are my today and all of my tomorrows.",
    "I love you not only for what you are, but for what I am when I am with you.",
    "You are the finest, loveliest, tenderest person I have ever known.",
    "I fell in love the way you fall asleep: slowly, and then all at once.",
    "Whatever our souls are made of, yours and mine are the same.",
    "I would rather spend one lifetime with you, than face all the ages of this world alone.",
    "You are my sun, my moon, and all of my stars.",
    "I love you more than there are stars in the sky and fish in the sea."
];

// Configuration
const CONFIG = {
    photosFolder: 'pictures/',
    photoCount: 20,              // Number of photos flowing at once
    animationDuration: 40,       // Seconds for full path traversal
    staggerDelay: 2,             // Seconds between each photo
    photoFiles: [
        '1000000680.JPG', '1000000681.JPG', '1000000136.JPEG', '1000000137.JPEG', 
        '1000000138.JPEG', '1000000139.JPEG', '1000000140.JPEG', '1000000141.JPEG', 
        '1000000142.JPEG', '1000000143.JPEG', '1000000144.JPEG', '1000000145.JPEG', 
        '1000000146.JPEG', '1000000147.JPEG', '1000000148.JPEG', '1000000149.JPEG', 
        '1000000150.JPEG', '1000000151.JPEG', '1000000152.JPEG', '1000000153.JPEG', 
        '1000000154.JPEG', '1000000155.JPEG', '1000000156.JPEG', '1000000157.JPEG', 
        '1000000158.JPEG', '1000000159.JPEG', '1000000160.JPEG', '1000000161.JPEG', 
        '1000000162.JPEG', '1000000163.JPEG', '1000000164.JPEG', '1000000165.JPEG', 
        '1000000166.JPEG', '1000000167.JPEG', '1000000168.JPEG', '1000000169.JPEG', 
        '1000000170.JPEG', '1000000171.JPEG', '1000000172.JPEG', '1000000173.JPEG', 
        '1000000174.JPEG', '1000000175.JPEG', '1000000176.JPEG', '1000000177.JPEG', 
        '1000000178.JPEG', '1000000179.JPEG', '1000000180.JPEG', '1000000181.JPEG', 
        '1000000182.JPEG', '1000000183.JPEG', '1000000184.JPEG', '1000000185.JPEG', 
        '1000000186.JPEG', '1000000187.JPEG', '1000000679.JPEG'
    ]
};

class SpiralPhotoStream {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.photoIndex = 0;
        this.activePhotos = [];
        this.lightbox = new Lightbox();
        
        // Shuffle photos for variety
        this.shufflePhotos();
        this.init();
    }

    shufflePhotos() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.config.photoFiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.config.photoFiles[i], this.config.photoFiles[j]] = 
                [this.config.photoFiles[j], this.config.photoFiles[i]];
        }
        console.log('Photos shuffled for spiral stream');
    }

    init() {
        console.log('Initializing spiral photo stream with', this.config.photoFiles.length, 'photos');
        
        // Create initial batch of photos
        for (let i = 0; i < this.config.photoCount; i++) {
            this.createPhoto(i * this.config.staggerDelay);
        }
        
        // Continuously add new photos as old ones complete
        this.startContinuousStream();
    }

    createPhoto(delay) {
        const wrapper = document.createElement('div');
        wrapper.className = 'spiral-wrapper';
        wrapper.style.animationDelay = `${delay}s`;
        wrapper.style.animationDuration = `${this.config.animationDuration}s`;
        
        const img = document.createElement('img');
        img.className = 'spiral-thumbnail';
        
        // Cycle through photos
        const photoFile = this.config.photoFiles[this.photoIndex % this.config.photoFiles.length];
        img.src = this.config.photosFolder + photoFile;
        img.alt = `Photo ${this.photoIndex + 1}`;
        
        // Handle image load errors
        img.onerror = () => {
            console.warn(`Failed to load ${photoFile}`);
            // Keep trying with a fallback
            img.style.display = 'none';
        };
        
        img.onload = () => {
            console.log(`Loaded ${photoFile}`);
        };
        
        // Add click event to open lightbox
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            this.lightbox.open(img.src);
        });
        
        wrapper.appendChild(img);
        this.container.appendChild(wrapper);
        this.activePhotos.push(wrapper);
        
        // Increment photo index for next photo
        this.photoIndex++;
        
        // Remove photo after animation completes
        setTimeout(() => {
            this.removePhoto(wrapper);
        }, (delay + this.config.animationDuration) * 1000);
        
        return wrapper;
    }

    removePhoto(wrapper) {
        if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
            const index = this.activePhotos.indexOf(wrapper);
            if (index > -1) {
                this.activePhotos.splice(index, 1);
            }
        }
    }

    startContinuousStream() {
        // Add a new photo at regular intervals
        this.streamInterval = setInterval(() => {
            this.createPhoto(0);
        }, this.config.staggerDelay * 1000);
        
        console.log('Continuous photo stream started');
    }

    stop() {
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
            console.log('Photo stream stopped');
        }
    }
}

// Lightbox class for viewing full-size images
class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxQuote = document.getElementById('lightboxQuote');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Close button click
        this.lightboxClose.addEventListener('click', () => {
            this.close();
        });
        
        // Click outside image to close
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.close();
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        console.log('Lightbox initialized');
    }
    
    open(imageSrc) {
        this.lightboxImage.src = imageSrc;
        
        // Display random love quote
        const randomQuote = LOVE_QUOTES[Math.floor(Math.random() * LOVE_QUOTES.length)];
        this.lightboxQuote.textContent = randomQuote;
        
        this.lightbox.classList.add('active');
        document.body.classList.add('paused');
        this.isOpen = true;
        console.log('Lightbox opened with quote:', randomQuote);
    }
    
    close() {
        this.lightbox.classList.remove('active');
        document.body.classList.remove('paused');
        this.isOpen = false;
        console.log('Lightbox closed, animation resumed');
    }
}

// Anniversary dates
const DATING_START = new Date('2012-12-01');
const WEDDING_DATE = new Date('2023-06-10');

// Anniversary Counter
class AnniversaryCounter {
    constructor() {
        this.datingCounter = document.getElementById('datingCounter');
        this.marriedCounter = document.getElementById('marriedCounter');
        this.updateCounters();
        // Update every hour
        setInterval(() => this.updateCounters(), 3600000);
    }
    
    calculateTimeDifference(startDate) {
        const now = new Date();
        const diff = now - startDate;
        
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        
        if (years > 0) {
            return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
        } else if (months > 0) {
            return `${months} month${months !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`;
        } else {
            return `${days} day${days !== 1 ? 's' : ''}`;
        }
    }
    
    updateCounters() {
        this.datingCounter.textContent = this.calculateTimeDifference(DATING_START);
        this.marriedCounter.textContent = this.calculateTimeDifference(WEDDING_DATE);
        console.log('Anniversary counters updated');
    }
}

// Floating Hearts
class FloatingHearts {
    constructor() {
        this.container = document.getElementById('heartsContainer');
        this.heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝', '💞'];
        this.createHearts();
    }
    
    createHearts() {
        // Create 10 floating hearts
        for (let i = 0; i < 10; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = this.heartEmojis[Math.floor(Math.random() * this.heartEmojis.length)];
            this.container.appendChild(heart);
        }
        console.log('Floating hearts created');
    }
}

// Music Player
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('backgroundMusic');
        this.toggleButton = document.getElementById('musicToggle');
        this.playIcon = document.querySelector('.play-icon');
        this.pauseIcon = document.querySelector('.pause-icon');
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        // Set initial volume
        this.audio.volume = 0.3; // 30% volume for background music
        
        // Toggle play/pause on click
        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });
        
        // Handle audio errors
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            console.log('Make sure "wedding-song.mp3" is in the same folder as index.html');
        });
        
        console.log('Music player initialized');
    }
    
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'inline';
            console.log('Music playing');
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playIcon.style.display = 'inline';
        this.pauseIcon.style.display = 'none';
        console.log('Music paused');
    }
}

// Initialize the photo stream when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting photo stream...');
    
    // Check if container exists
    const container = document.getElementById('photoContainer');
    if (!container) {
        console.error('Photo container not found!');
        return;
    }
    
    // Initialize anniversary counter
    new AnniversaryCounter();
    
    // Initialize floating hearts
    new FloatingHearts();
    
    // Initialize music player
    new MusicPlayer();
    
    // Start the spiral photo stream
    const photoStream = new SpiralPhotoStream('photoContainer', CONFIG);
    
    // Optional: Stop the stream after some time (for testing)
    // setTimeout(() => photoStream.stop(), 60000); // Stop after 1 minute
});
