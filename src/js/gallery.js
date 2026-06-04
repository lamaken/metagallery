import * as THREE from 'three';
import { EventEmitter } from './utils.js';

export class Gallery extends EventEmitter {
    constructor() {
        super();
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
        
        // Camera setup
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 1.6, 5);
        
        // Renderer setup
        const canvas = document.getElementById('canvas-container');
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        canvas.appendChild(this.renderer.domElement);
        
        // Lighting
        this.setupLighting();
        
        // Gallery environment
        this.setupEnvironment();
        
        // Artworks
        this.artworks = [];
        this.loadArtworks();
        
        // Raycaster for interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredArtwork = null;
    }
    
    setupLighting() {
        // Ambient light - increased intensity
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);
        
        // Directional light - key light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(15, 15, 15);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.6);
        fillLight.position.set(-10, 8, 10);
        this.scene.add(fillLight);
        
        // Back light for ambiance
        const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
        backLight.position.set(0, 5, -20);
        this.scene.add(backLight);
    }
    
    setupEnvironment() {
        // Floor with better material
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.6,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Wall material
        const wallGeometry = new THREE.PlaneGeometry(100, 50);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.02
        });
        
        // Back wall
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -50;
        backWall.receiveShadow = true;
        this.scene.add(backWall);
        
        // Left wall
        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -50;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);
        
        // Right wall
        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.rotation.y = Math.PI / 2;
        rightWall.position.x = 50;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
    }
    
    loadArtworks() {
        const ARTWORKS = [
            {
                title: 'The Blue Horizon',
                description: 'A mesmerizing view of endless possibilities',
                url: '/images/artwork1.svg',
                position: [0, 3, -15],
                scale: 3
            },
            {
                title: 'Digital Dreams',
                description: 'Exploring the intersection of art and technology',
                url: '/images/artwork2.svg',
                position: [-15, 3, -5],
                scale: 2.5
            },
            {
                title: 'Ethereal Forms',
                description: 'Abstract shapes dancing in space',
                url: '/images/artwork3.svg',
                position: [15, 3, -5],
                scale: 2.5
            }
        ];
        
        ARTWORKS.forEach(artworkData => {
            this.addArtwork(artworkData);
        });
    }
    
    addArtwork(data) {
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(
            data.url,
            (texture) => {
                texture.encoding = THREE.sRGBEncoding;
                
                // Create frame with artwork
                const group = new THREE.Group();
                
                // Artwork frame
                const frameGeometry = new THREE.BoxGeometry(data.scale, data.scale * 0.75, 0.2);
                const frameMaterial = new THREE.MeshStandardMaterial({
                    color: 0xc4762f,
                    roughness: 0.3,
                    metalness: 0.7,
                    emissive: 0x1a1a1a,
                    emissiveIntensity: 0.1
                });
                const frame = new THREE.Mesh(frameGeometry, frameMaterial);
                frame.castShadow = true;
                frame.receiveShadow = true;
                frame.position.z = -0.05;
                group.add(frame);
                
                // Artwork plane
                const planeGeometry = new THREE.PlaneGeometry(data.scale * 0.9, data.scale * 0.65);
                const planeMaterial = new THREE.MeshStandardMaterial({ 
                    map: texture,
                    roughness: 0.2,
                    metalness: 0.1
                });
                const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.position.z = 0.15;
                plane.castShadow = true;
                plane.receiveShadow = true;
                group.add(plane);
                
                // Metadata
                group.userData = {
                    title: data.title,
                    description: data.description,
                    isArtwork: true
                };
                
                group.position.set(...data.position);
                this.scene.add(group);
                this.artworks.push(group);
            },
            undefined,
            () => {
                console.warn(`Failed to load texture: ${data.url}`);
                // Fallback with gradient material
                const group = new THREE.Group();
                const planeGeometry = new THREE.PlaneGeometry(data.scale, data.scale * 0.75);
                
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 384;
                const ctx = canvas.getContext('2d');
                
                // Create gradient
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#1a1a1a');
                gradient.addColorStop(1, '#444444');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(data.title, canvas.width / 2, canvas.height / 2);
                
                const texture = new THREE.CanvasTexture(canvas);
                const planeMaterial = new THREE.MeshStandardMaterial({ map: texture });
                const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                group.add(plane);
                group.userData = data;
                group.position.set(...data.position);
                this.scene.add(group);
                this.artworks.push(group);
            }
        );
    }
    
    update() {
        // Check for artwork hover/intersection
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.artworks, true);
        
        if (intersects.length > 0) {
            const artwork = intersects[0].object.parent || intersects[0].object;
            if (artwork !== this.hoveredArtwork && artwork.userData && artwork.userData.title) {
                this.hoveredArtwork = artwork;
                this.emit('artwork-hover', artwork.userData);
            }
        } else {
            if (this.hoveredArtwork !== null) {
                this.hoveredArtwork = null;
                this.emit('artwork-hover', null);
            }
        }
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
