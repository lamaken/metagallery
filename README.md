# MetaGallery - 3D Art Gallery

An interactive 3D HTML art gallery where users can upload images and experience them as artworks displayed on walls in a virtual 3D space. Walk around, explore, and interact with art in a high-definition immersive environment.

## 🎨 Features

- **Interactive 3D Space**: Navigate through a virtual gallery with keyboard and mouse controls
- **Image Upload**: Add your own images to be displayed as gallery artworks
- **High Definition Rendering**: Beautiful 3D rendering powered by Three.js
- **Responsive Design**: Works on desktop browsers with WebGL support
- **Multi-Image Support**: Display multiple artworks throughout the gallery space
- **Future Multi-User**: Foundation for collaborative gallery experiences

## 🚀 Quick Start

### Prerequisites

- Modern web browser with WebGL support (Chrome, Firefox, Edge, Safari)
- Node.js and npm (optional, for development server)

### Installation

```bash
# Clone the repository
git clone https://github.com/lamaken/metagallery.git
cd metagallery

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open your browser to `http://localhost:5173` (or the port shown in the terminal).

## 📦 Project Structure

```
metagallery/
├── src/
│   ├── index.html           # Main HTML file
│   ├── styles/
│   │   └── style.css       # Application styles
│   └── js/
│       ├── main.js         # Entry point
│       ├── gallery.js      # Gallery scene management
│       ├── controls.js     # Camera controls
│       └── utils.js        # Utility functions
├── public/
│   └── images/             # Sample images
├── package.json
└── vite.config.js          # Build configuration
```

## 🎮 Controls

- **W / A / S / D** - Move forward/left/backward/right
- **Mouse Movement** - Look around (click canvas to lock pointer)
- **Space** - Jump (future feature)
- **Shift** - Run faster (future feature)

## 🛠️ Development

### Add Images to Gallery

Edit `src/js/gallery.js` to add your images:

```javascript
const ARTWORKS = [
  { 
    title: 'My Artwork',
    description: 'Description here',
    url: 'path/to/image.jpg', 
    position: [0, 3, -15],
    scale: 2
  },
  // Add more...
];
```

### Customize Gallery Layout

Modify wall positions, lighting, and camera settings in `gallery.js`.

## 📄 License

GNU General Public License v3.0 - See LICENSE file for details

## 👤 Author

**lamaken** - [GitHub Profile](https://github.com/lamaken)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 🔮 Future Roadmap

- [ ] Image upload interface
- [ ] Multi-user support (WebSocket)
- [ ] Custom gallery layout editor
- [ ] VR/AR support
- [ ] Performance optimizations
- [ ] Mobile support
