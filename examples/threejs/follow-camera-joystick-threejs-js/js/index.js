import * as THREE from "three";
import { OrbitControls } from "orbit-controls";

let renderer, scene, camera, controls, cube;

// Movement tracking state
const moveState = { forward: 0, backward: 0, left: 0, right: 0 };
const moveSpeed = 0.15;
const forward = new THREE.Vector3();
const right = new THREE.Vector3();

function main() {
    init();
    setupInputs(); // Initialize Desktop + Mobile controls
    window.onresize = onWindowResize;
    animate();
}

window.onload = main;

function init() {
    const canvas = document.getElementById("renderCanvas");

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth movement

    const grid = new THREE.GridHelper(100, 50, 0x444444, 0x222222);
    scene.add(grid);

    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x151515 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 4, 3);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
}

// Input Handling Logic
function setupInputs() {
    // Desktop: WASD & Arraws
    const handleKey = (e, isPressed) => {
        const value = isPressed ? 1 : 0;

        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                moveState.forward = value;
                break;
            case 'KeyS':
            case 'ArrowDown':
                moveState.backward = value;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                moveState.left = value;
                break;
            case 'KeyD':
            case 'ArrowRight':
                moveState.right = value;
                break;
        }
    };

    window.addEventListener('keydown', (e) => handleKey(e, true));
    window.addEventListener('keyup', (e) => handleKey(e, false));

    // Mobile: Detect and create Joystick
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        createJoystickUI();
    }
}

function createJoystickUI() {
    // Create simple DOM elements for joystick
    const base = document.createElement('div');
    base.style = "position:absolute; bottom:50px; left:50px; width: 100px; height: 100px; " +
        "background:rgba(255,255,255,0.2); border-radius:50%; touch-action:none; z-index:10;";

    const stick = document.createElement('div');
    stick.style = "position:absolute; top:25px; left:25px; width:50px; height:50px; " +
        "background:white; border-radius:50%; transition: transform 0.1s;";

    base.appendChild(stick);
    document.body.appendChild(base);

    base.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = base.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate normalized vector (-1 to 1)
        let dx = (touch.clientX - centerX) / 50;
        let dy = (touch.clientY - centerY) / 50;

        // Clamp values
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
            dx /= dist;
            dy /= dist;
        }

        stick.style.transform = `translate(${dx * 40}px, ${dy * 40}px)`;

        // Map to moveState
        moveState.right = dx > 0.2 ? dx : 0;
        moveState.left = dx < -0.2 ? -dx : 0;
        moveState.backward = dy > 0.2 ? dy : 0;
        moveState.forward = dy < -0.2 ? -dy : 0;
    });

    base.addEventListener('touchend', () => {
        stick.style.transform = `translate(0px, 0px)`;
        moveState.forward = moveState.backward = moveState.left = moveState.right = 0;
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Apply movement to the cube
    // We calculate movement based on camera orientation or local axes
    cube.position.z += (moveState.backward - moveState.forward) * moveSpeed;
    cube.position.x += (moveState.right - moveState.left) * moveSpeed;

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    // Update the camera's aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;

    // Recalculate the projection matrix
    camera.updateProjectionMatrix();

    // Update the renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Handle high-DPI scaling for the new size
    renderer.setPixelRatio(window.devicePixelRatio);
}
