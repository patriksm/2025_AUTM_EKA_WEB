import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// --- Configuration ---
const UNIT_SIZE = 20;
const WALL_HEIGHT = 15;

// --- Advanced Procedural Asset Generation ---
function createTexture(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; // Higher resolution
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Helper: Add Noise
    function addNoise(amount = 0.1) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const val = (Math.random() - 0.5) * amount * 255;
            data[i] += val;
            data[i + 1] += val;
            data[i + 2] += val;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    if (type === 'wall') {
        // High-Tech Cyber Wall
        // Base
        const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
        grad.addColorStop(0, '#1a1f25');
        grad.addColorStop(0.5, '#252a33');
        grad.addColorStop(1, '#1a1f25');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        addNoise(0.05);

        // Hexagon Pattern overlay
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
        ctx.lineWidth = 2;
        const r = 30;
        const w = Math.sqrt(3) * r;
        const h = 2 * r;
        for (let y = -h; y < 1024 + h; y += h * 0.75) {
            for (let x = -w; x < 1024 + w; x += w) {
                const cx = x + ((Math.round(y / (h * 0.75)) % 2) === 0 ? 0 : w / 2);
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const ang = Math.PI / 3 * i + Math.PI / 6;
                    ctx.lineTo(cx + Math.cos(ang) * r, y + Math.sin(ang) * r);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }

        // Heavy Industrial Frame
        ctx.strokeStyle = '#3e4854';
        ctx.lineWidth = 16;
        ctx.strokeRect(8, 8, 1008, 1008);

        // Neon Circuits
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100, 300);
        ctx.lineTo(300, 300);
        ctx.moveTo(924, 924);
        ctx.lineTo(924, 724);
        ctx.lineTo(724, 724);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Rivets/Bolts
        ctx.fillStyle = '#111';
        const bolt = (bx, by) => {
            ctx.beginPath();
            ctx.arc(bx, by, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.stroke();
        };
        bolt(40, 40); bolt(984, 40); bolt(40, 984); bolt(984, 984);
        bolt(512, 40); bolt(512, 984); bolt(40, 512); bolt(984, 512);

    } else if (type === 'floor') {
        // Anti-slip Sci-Fi Grate
        ctx.fillStyle = '#0f1012';
        ctx.fillRect(0, 0, 1024, 1024);

        // Metal plates
        ctx.fillStyle = '#1c1e22';
        ctx.fillRect(10, 10, 500, 500);
        ctx.fillRect(514, 10, 500, 500);
        ctx.fillRect(10, 514, 500, 500);
        ctx.fillRect(514, 514, 500, 500);

        addNoise(0.08);

        // Tread pattern
        ctx.fillStyle = '#2a2e35';
        for (let i = 0; i < 1024; i += 40) {
            ctx.fillRect(i, 0, 10, 1024);
            ctx.fillRect(0, i, 1024, 10);
        }

        // Caution Stripes
        ctx.fillStyle = '#d4aa00'; // Dark Yellow
        for (let i = 0; i < 1024; i += 100) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + 50, 0);
            ctx.lineTo(0, i + 50);
            ctx.lineTo(0, i);
            ctx.fill();
        }
        // Alpha blend caution stripes to look worn
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, 1024, 1024);

    } else if (type === 'ceiling') {
        // Deep Space Tech
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, 1024, 1024);

        // Grid structure
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 5;
        ctx.beginPath();
        for (let i = 0; i <= 1024; i += 128) {
            ctx.moveTo(i, 0); ctx.lineTo(i, 1024);
            ctx.moveTo(0, i); ctx.lineTo(1024, i);
        }
        ctx.stroke();

        // Lights
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const size = Math.random() * 5 + 2;

            ctx.shadowBlur = 15;
            ctx.shadowColor = 'white';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16;
    return tex;
}

// --- Game Logic ---
let camera, scene, renderer, controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let raycaster;

let coins = [];
let score = 0;
const MAX_COINS = 8;
let gameWon = false;
let canJump = false; // Jumping state

// 8x8 Maze Map (including borders)
const mapLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]; // Larger map for longer gameplay

const objects = []; // For collision detection

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.Fog(0x050510, 0, 60);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 5; // Eye height

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const pointLight = new THREE.PointLight(0x00ffff, 0.8, 100);
    pointLight.position.set(20, 15, 20);
    scene.add(pointLight);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controls
    controls = new PointerLockControls(camera, document.body);

    const instructions = document.getElementById('instructions');
    instructions.addEventListener('click', function () {
        controls.lock();
        initAudio(); // Initialize sound on click
    });

    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        document.getElementById('ui').style.display = 'block';
    });

    controls.addEventListener('unlock', function () {
        if (!gameWon) instructions.style.display = 'block';
    });

    scene.add(controls.getObject());

    // Input
    const onKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': moveForward = true; break;
            case 'ArrowLeft':
            case 'KeyA': moveLeft = true; break;
            case 'ArrowDown':
            case 'KeyS': moveBackward = true; break;
            case 'ArrowRight':
            case 'KeyD': moveRight = true; break;
            case 'Space':
                if (canJump === true) velocity.y += 150; // Jump force
                canJump = false;
                break;
        }
    };

    const onKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': moveForward = false; break;
            case 'ArrowLeft':
            case 'KeyA': moveLeft = false; break;
            case 'ArrowDown':
            case 'KeyS': moveBackward = false; break;
            case 'ArrowRight':
            case 'KeyD': moveRight = false; break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Build World
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

    // Textures
    const wallTex = createTexture('wall');
    const floorTex = createTexture('floor');
    const ceilTex = createTexture('ceiling');

    const wallGeo = new THREE.BoxGeometry(UNIT_SIZE, WALL_HEIGHT, UNIT_SIZE);
    const wallMat = new THREE.MeshPhongMaterial({ map: wallTex });

    // Floor
    const floorGeo = new THREE.PlaneGeometry(400, 400); // Larger floor
    const floorMat = new THREE.MeshLambertMaterial({ map: floorTex });
    floorTex.repeat.set(20, 20);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = - Math.PI / 2;
    scene.add(floor);

    // Ceiling
    const ceilMat = new THREE.MeshBasicMaterial({ map: ceilTex });
    ceilTex.repeat.set(20, 20);
    const ceiling = new THREE.Mesh(floorGeo, ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = WALL_HEIGHT;
    scene.add(ceiling);

    // Maze Construction
    // mapLayout is 6x6. Offset so (0,0) is center-ish
    const offset = (mapLayout.length * UNIT_SIZE) / 2;

    for (let z = 0; z < mapLayout.length; z++) {
        for (let x = 0; x < mapLayout[z].length; x++) {
            if (mapLayout[z][x] === 1) {
                const wall = new THREE.Mesh(wallGeo, wallMat);
                wall.position.x = (x * UNIT_SIZE) - offset;
                wall.position.y = WALL_HEIGHT / 2;
                wall.position.z = (z * UNIT_SIZE) - offset;
                scene.add(wall);
                objects.push(wall);
            }
        }
    }

    // Coins
    // Manually place 8 coins in open spots
    const coinLocs = [
        { x: 1, z: 1 }, // Top Left
        { x: 8, z: 1 }, // Top Right
        { x: 1, z: 8 }, // Bottom Left
        { x: 8, z: 8 }, // Bottom Right
        { x: 4, z: 3 }, // Mid area
        { x: 6, z: 5 }, // Open path
        { x: 1, z: 5 }, // Left path
        { x: 4, z: 7 }  // Bottom mid
    ];

    const coinGeo = new THREE.TorusGeometry(1.5, 0.4, 8, 20); // Ring/Coin shape
    const coinMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.3,
        emissive: 0xffaa00,
        emissiveIntensity: 0.2
    });

    coinLocs.forEach(loc => {
        const coin = new THREE.Mesh(coinGeo, coinMat);
        // Calculate world pos
        const wx = (loc.x * UNIT_SIZE) - offset;
        const wz = (loc.z * UNIT_SIZE) - offset;

        coin.position.set(wx, 3, wz);
        scene.add(coin);
        coins.push(coin);

        // Add a light to the coin
        const l = new THREE.PointLight(0xffaa00, 1, 10);
        l.position.set(wx, 3, wz);
        scene.add(l);
    });

    // Initial player position (avoid wall)
    // Start at an open spot
    controls.getObject().position.set((5 * UNIT_SIZE) - offset, 5, (8 * UNIT_SIZE) - offset);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();

    if (controls.isLocked === true) {
        const delta = (time - prevTime) / 1000;

        // Gravity and Friction
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 40.0 * delta; // 100.0 = mass, simplified to 40.0 for better feel

        // Input Direction
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // Ensure consistent speed in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        controls.getObject().position.y += (velocity.y * delta); // New Vertical movement

        const playerPos = controls.getObject().position;

        // Floor Collision
        if (playerPos.y < 5) {
            velocity.y = 0;
            playerPos.y = 5;
            canJump = true;
        }

        // Ceiling Collision
        if (playerPos.y > WALL_HEIGHT - 2) { // 2 is a small offset for player "head"
            velocity.y = 0;
            playerPos.y = WALL_HEIGHT - 2;
        }

        const playerRadius = 2.0;

        for (let obj of objects) {
            const wallBox = new THREE.Box3().setFromObject(obj);
            // Check collision only in 2D (XZ plane) for better stability
            const distance = wallBox.distanceToPoint(playerPos);

            if (distance < playerRadius) {
                const wallCenter = new THREE.Vector3();
                obj.getWorldPosition(wallCenter);

                // Calculate push direction only on X and Z axes
                const dirToPlayer = new THREE.Vector3(
                    playerPos.x - wallCenter.x,
                    0, // Ignore Y
                    playerPos.z - wallCenter.z
                ).normalize();

                // Move player out horizontally
                controls.getObject().position.addScaledVector(dirToPlayer, playerRadius - distance + 0.1);

                velocity.x = 0;
                velocity.z = 0;
            }
        }

        // Coin Collection
        for (let i = coins.length - 1; i >= 0; i--) {
            const coin = coins[i];
            coin.rotation.y += 2 * delta; // Spin

            const dist = playerPos.distanceTo(coin.position);
            if (dist < 4) {
                // Collect
                playCollectSound(); // Play Sound
                scene.remove(coin);
                coins.splice(i, 1);
                score++;
                document.getElementById('score').innerText = score;

                if (score >= MAX_COINS) {
                    winGame();
                }
            }
        }
    }

    prevTime = time;
    renderer.render(scene, camera);
}

// --- Audio ---
let audioCtx;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playCollectSound() {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

function winGame() {
    gameWon = true;
    document.getElementById('message').style.display = 'block';
    controls.unlock();

    // Victory fanfare
    setTimeout(() => {
        if (audioCtx) {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.5);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(audioCtx.currentTime + i * 0.1);
                osc.stop(audioCtx.currentTime + i * 0.1 + 0.5);
            });
        }
    }, 100);
}
