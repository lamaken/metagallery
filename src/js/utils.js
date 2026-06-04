import * as THREE from 'three';

/**
 * Create a framed image (artwork) with a 3D frame
 * @param {THREE.Texture} texture - The image texture
 * @param {number} scale - Scale factor for the artwork
 * @returns {THREE.Group} Group containing the frame and image
 */
export function createFramedImage(texture, scale = 1) {
    const group = new THREE.Group();

    // Image dimensions
    const width = 2 * scale;
    const height = 1.5 * scale;
    const frameThickness = 0.1;

    // Create image plane
    const imageGeometry = new THREE.PlaneGeometry(width, height);
    const imageMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0
    });
    const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
    imageMesh.position.z = frameThickness / 2;
    imageMesh.castShadow = true;
    imageMesh.receiveShadow = true;
    group.add(imageMesh);

    // Create frame (simple box geometry)
    const frameGroup = createFrame(width, height, frameThickness);
    group.add(frameGroup);

    return group;
}

/**
 * Create a decorative frame
 * @param {number} width
 * @param {number} height
 * @param {number} thickness
 * @returns {THREE.Group}
 */
function createFrame(width, height, thickness) {
    const group = new THREE.Group();
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b7355,
        roughness: 0.6,
        metalness: 0.2
    });

    const frameWidth = thickness;
    const frameDepth = thickness;

    // Top frame piece
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(width + frameWidth * 2, frameWidth, frameDepth),
        frameMaterial
    );
    topFrame.position.y = height / 2 + frameWidth / 2;
    topFrame.castShadow = true;
    group.add(topFrame);

    // Bottom frame piece
    const bottomFrame = new THREE.Mesh(
        new THREE.BoxGeometry(width + frameWidth * 2, frameWidth, frameDepth),
        frameMaterial
    );
    bottomFrame.position.y = -height / 2 - frameWidth / 2;
    bottomFrame.castShadow = true;
    group.add(bottomFrame);

    // Left frame piece
    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameWidth, height + frameWidth * 2, frameDepth),
        frameMaterial
    );
    leftFrame.position.x = -width / 2 - frameWidth / 2;
    leftFrame.castShadow = true;
    group.add(leftFrame);

    // Right frame piece
    const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameWidth, height + frameWidth * 2, frameDepth),
        frameMaterial
    );
    rightFrame.position.x = width / 2 + frameWidth / 2;
    rightFrame.castShadow = true;
    group.add(rightFrame);

    return group;
}

/**
 * Create a simple wall
 * @param {number} width
 * @param {number} height
 * @param {number} color
 * @returns {THREE.Mesh}
 */
export function createWall(width, height, color = 0x2a2a2a) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.05
    });
    return new THREE.Mesh(geometry, material);
}

/**
 * Clamp a value between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Lerp between two values
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
