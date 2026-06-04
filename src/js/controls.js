export class Controls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        
        // Movement
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = true;
        this.speed = 0.1;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.direction = { x: 0, y: 0, z: 0 };
        
        // Mouse look
        this.euler = {
            order: 'YXZ',
            x: 0,
            y: 0,
            z: 0
        };
        this.PI_2 = Math.PI / 2;
        this.pointerLocked = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Mouse events
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('click', () => this.requestPointerLock());
        
        // Pointer lock events
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
        document.addEventListener('pointerlockerror', () => this.onPointerLockError());
    }
    
    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'Space':
                if (this.canJump) {
                    this.velocity.y = 0.15;
                    this.canJump = false;
                }
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.speed = 0.2;
                break;
        }
    }
    
    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'KeyD':
                this.moveRight = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.speed = 0.1;
                break;
        }
    }
    
    onMouseMove(event) {
        if (!this.pointerLocked) return;
        
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        
        this.euler.setFromQuaternion(this.camera.quaternion);
        
        this.euler.setFromAxisAngle({ axis: 'x', value: 1 }, -movementY * 0.002);
        this.euler.setFromAxisAngle({ axis: 'y', value: 1 }, -movementX * 0.002);
        
        this.camera.quaternion.setFromEuler(this.euler);
    }
    
    requestPointerLock() {
        this.domElement.requestPointerLock =
            this.domElement.requestPointerLock ||
            this.domElement.mozRequestPointerLock;
        this.domElement.requestPointerLock();
    }
    
    onPointerLockChange() {
        this.pointerLocked = document.pointerLockElement === this.domElement ||
                            document.mozPointerLockElement === this.domElement;
    }
    
    onPointerLockError() {
        console.error('Pointer lock error');
    }
    
    update() {
        // Apply gravity
        this.velocity.y -= 0.01;
        
        // Calculate direction based on keys pressed
        this.direction.x = 0;
        this.direction.z = 0;
        
        if (this.moveForward) this.direction.z -= 1;
        if (this.moveBackward) this.direction.z += 1;
        if (this.moveLeft) this.direction.x -= 1;
        if (this.moveRight) this.direction.x += 1;
        
        // Normalize direction
        const length = Math.sqrt(
            this.direction.x ** 2 + this.direction.z ** 2
        );
        
        if (length > 0) {
            this.direction.x /= length;
            this.direction.z /= length;
        }
        
        // Apply movement
        this.velocity.x = this.direction.x * this.speed;
        this.velocity.z = this.direction.z * this.speed;
        
        // Ground collision (simple plane at y=0)
        if (this.camera.position.y + this.velocity.y <= 1.6) {
            this.camera.position.y = 1.6;
            this.velocity.y = 0;
            this.canJump = true;
        }
        
        // Update camera position
        this.camera.position.x += this.velocity.x;
        this.camera.position.y += this.velocity.y;
        this.camera.position.z += this.velocity.z;
    }
}
