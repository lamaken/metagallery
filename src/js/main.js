import { Gallery } from './gallery.js';
import { Controls } from './controls.js';

// Initialize the gallery application
const gallery = new Gallery();
const controls = new Controls(gallery.camera, gallery.renderer.domElement);

// Update info panel when hovering over artworks
gallery.on('artwork-hover', (artwork) => {
    const titleElement = document.getElementById('artwork-title');
    const descElement = document.getElementById('artwork-description');
    
    if (artwork) {
        titleElement.textContent = artwork.title;
        descElement.textContent = artwork.description;
    } else {
        titleElement.textContent = 'Welcome to MetaGallery';
        descElement.textContent = 'Use WASD to move, mouse to look around';
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Update gallery
    gallery.update();
    
    // Render scene
    gallery.render();
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    gallery.resize();
});
