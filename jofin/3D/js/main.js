const DEG = Math.PI / 180;
const world = document.getElementById("world");
const container = document.getElementById("container");
const scoreBoard = document.getElementById("scoreBoard");

/* ---------- SETTINGS ---------- */
const ARENA_LIMIT = 1000;
let mouseSensitivity = 0.15; // <-- Change this value to make rotation faster/slower

/* ---------- POINTER LOCK ---------- */
let lock = false;
document.addEventListener("pointerlockchange", () => lock = !lock);
container.onclick = () => !lock && container.requestPointerLock();

/* ---------- PLAYER ---------- */
let pawn = { x: 0, y: 0, z: 0, rx: 0, ry: 0, speed: 6 };

/* ---------- INPUT ---------- */
let pressForward = 0, pressBack = 0, pressLeft = 0, pressRight = 0;
let mouseX = 0, mouseY = 0;

document.addEventListener("keydown", e => {
    let key = e.key.toLowerCase();
    if (key === "s") pressForward = 1;
    if (key === "w") pressBack = 1;
    if (key === "a") pressLeft = 1;
    if (key === "d") pressRight = 1;
});
document.addEventListener("keyup", e => {
    let key = e.key.toLowerCase();
    if (key === "s") pressForward = 0;
    if (key === "w") pressBack = 0;
    if (key === "a") pressLeft = 0;
    if (key === "d") pressRight = 0;
});
document.addEventListener("mousemove", e => {
    if (lock) { 
        mouseX = e.movementX; 
        mouseY = e.movementY; 
    }
});

/* ---------- SKYBOX ---------- */
const skyImages = {
    front: "textures/blue sky.jpg", back: "textures/blue sky2.jpg",
    left: "textures/blue sky3.jpg", right: "textures/blue sky4.jpg",
    top: "textures/blue sky5.jpg", bottom: "textures/blue sky6.jpg"
};

function createSkybox() {
    const size = 2000;
    for (let [dir, img] of Object.entries(skyImages)) {
        let s = document.createElement("div");
        s.className = "skybox";
        s.style.backgroundImage = `url(${img})`;
        if (dir === "front") s.style.transform = `translate3d(0,0,${-size}px) rotateY(0deg)`;
        if (dir === "back") s.style.transform = `translate3d(0,0,${size}px) rotateY(180deg)`;
        if (dir === "left") s.style.transform = `translate3d(${-size}px,0,0) rotateY(-90deg)`;
        if (dir === "right") s.style.transform = `translate3d(${size}px,0,0) rotateY(90deg)`;
        if (dir === "top") s.style.transform = `translate3d(0,${-size}px,0) rotateX(90deg)`;
        if (dir === "bottom") s.style.transform = `translate3d(0,${size}px,0) rotateX(-90deg)`;
        world.appendChild(s);
    }
}
createSkybox();

/* ---------- ARENA ---------- */
let arena = [
    [0, 200, 0, 90, 0, 0, 2000, 2000, "url('textures/floor.jpg')"], 
    [0, -200, 0, 90, 0, 0, 2000, 2000, "url('textures/rusty.jpg')"],      
    [0, 0, -1000, 0, 0, 0, 2000, 400, "url('textures/wall.jpg')"],     
    [0, 0, 1000, 0, 0, 0, 2000, 400, "url('textures/wall.jpg')"],      
    [-1000, 0, 0, 0, 90, 0, 2000, 400, "url('textures/wall.jpg')"],   
    [1000, 0, 0, 0, 90, 0, 2000, 400, "url('textures/wall.jpg')"]      
];

function drawArena() {
    for (let sq of arena) {
        let div = document.createElement("div");
        div.className = "arena";
        div.style.width = `${sq[6]}px`;
        div.style.height = `${sq[7]}px`;
        div.style.backgroundImage = sq[8];
        div.style.backgroundSize = "cover";
        div.style.transform = `translate3d(${sq[0]-sq[6]/2}px, ${sq[1]-sq[7]/2}px, ${sq[2]}px) rotateX(${sq[3]}deg) rotateY(${sq[4]}deg) rotateZ(${sq[5]}deg)`;
        world.appendChild(div);
    }
}
drawArena();

/* ---------- TARGETS ---------- */
let targetsData = [];
let score = 0;

function spawnTargets(count = 8) {
    for (let i = 0; i < count; i++) {
        let t = document.createElement("div");
        t.className = "target";

        let x = Math.random() * 1600 - 800;
        let y = Math.random() * 100;
        let z = Math.random() * 1600 - 800;

        targetsData.push({ x, y, z, alive: true, element: t, score: 10 });
        t.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        world.appendChild(t);
    }
}
spawnTargets();

/* ---------- BONUS TARGETS ---------- */
function spawnBonusTarget() {
    let t = document.createElement("div");
    t.className = "bonus-target";

    let x = Math.random() * 1600 - 800;
    let y = Math.random() * 100;
    let z = Math.random() * 1600 - 800;

    targetsData.push({ x, y, z, alive: true, element: t, score: 50 });
    t.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    world.appendChild(t);

    setTimeout(() => {
        if (t.parentNode) t.remove();
        let idx = targetsData.findIndex(td => td.element === t);
        if (idx !== -1) targetsData.splice(idx, 1);
    }, 10000);
}
setInterval(spawnBonusTarget, 20000);

/* ---------- GAME LOOP ---------- */
function update() {
    // Camera rotation with mouse sensitivity
    pawn.ry += mouseX * mouseSensitivity;
    pawn.rx -= mouseY * mouseSensitivity;
    pawn.rx = Math.max(-80, Math.min(80, pawn.rx));
    mouseX = mouseY = 0;

    // Player movement
    let rad = pawn.ry * DEG;
    let moveX = pressRight - pressLeft;
    let moveZ = pressForward - pressBack;
    pawn.x += (moveX * Math.cos(rad) + moveZ * Math.sin(rad)) * pawn.speed;
    pawn.z += (moveZ * Math.cos(rad) - moveX * Math.sin(rad)) * pawn.speed;

    // Constrain player inside arena
    pawn.x = Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, pawn.x));
    pawn.z = Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, pawn.z));

    // Crosshair proximity hit
    const HIT_THRESHOLD = 100;
    for (let t of targetsData) {
        if (!t.alive) continue;

        let dx = t.x - pawn.x;
        let dy = t.y - pawn.y;
        let dz = t.z - pawn.z;
        let distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (distance < HIT_THRESHOLD) {
            t.alive = false;
            t.element.remove();
            score += t.score;
            scoreBoard.innerText = "Score: " + score;
        }
    }

    // Apply camera transform
    world.style.transform = `perspective(800px) rotateX(${pawn.rx}deg) rotateY(${-pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;
}

setInterval(update, 1000 / 60);