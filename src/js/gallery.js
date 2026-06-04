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
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);
        
        // Point light for ambiance
        const pointLight = new THREE.PointLight(0x87ceeb, 0.3);
        pointLight.position.set(-5, 3, 0);
        this.scene.add(pointLight);
    }
    
    setupEnvironment() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.1
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Back walls
        const wallGeometry = new THREE.PlaneGeometry(100, 50);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.7,
            metalness: 0.05
        });
        
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -50;
        backWall.receiveShadow = true;
        this.scene.add(backWall);
        
        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -50;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);
        
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
                url: new URL('../images/artwork1.svg', import.meta.url).href,
                position: [0, 3, -15],
                scale: 3
            },
            {
                title: 'Digital Dreams',
                description: 'Exploring the intersection of art and technology',
                url: new URL('../images/artwork2.svg', import.meta.url).href,
                position: [-15, 3, -5],
                scale: 2.5
            },
            {
                title: 'Ethereal Forms',
                description: 'Abstract shapes dancing in space',
                url: new URL('../images/artwork3.svg', import.meta.url).href,
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
                // Create frame with artwork
                const group = new THREE.Group();
                
                // Artwork frame
                const frameGeometry = new THREE.BoxGeometry(data.scale, data.scale * 0.75, 0.2);
                const frameMaterial = new THREE.MeshStandardMaterial({
                    color: 0x8b7355,
                    roughness: 0.4,
                    metalness: 0.6
                });
                const frame = new THREE.Mesh(frameGeometry, frameMaterial);
                frame.castShadow = true;
                frame.receiveShadow = true;
                group.add(frame);
                
                // Artwork plane
                const planeGeometry = new THREE.PlaneGeometry(data.scale * 0.9, data.scale * 0.65);
                const planeMaterial = new THREE.MeshStandardMaterial({ map: texture });
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
                group.scale.set(1, 1, 1);
                
                this.scene.add(group);
                this.artworks.push(group);
            },
            undefined,
            () => {
                // Fallback if texture loading fails
                const group = new THREE.Group();
                const planeGeometry = new THREE.PlaneGeometry(data.scale, data.scale * 0.75);
                const planeMaterial = new THREE.MeshStandardMaterial({
                    color: 0x444444
                });
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
            const artwork = intersects[0].object.parent;
            if (artwork !== this.hoveredArtwork) {
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
