// ==========================================
// 1. SETUP & CONFIGURATION
// ==========================================
const DEG = Math.PI / 180;
var world = document.getElementById("world");
var container = document.getElementById("container");

// --- TEXTURE SETTINGS ---
const texFloor = "url('textures/floor.jpg')";
const texWall  = "url('textures/wall.jpg')";
const texBox   = "url('textures/sandy_wall.jpg')"; 
// NEW: The Eka Texture
const texEka   = "url('textures/eka.png')";

// --- GAME UI (Win Message) ---
var winMsg = document.createElement("div");
winMsg.style.position = "absolute";
winMsg.style.top = "40%";
winMsg.style.left = "50%";
winMsg.style.transform = "translate(-50%, -50%)";
winMsg.style.color = "#FFD700"; // Gold Color
winMsg.style.fontSize = "60px";
winMsg.style.fontFamily = "Arial Black";
winMsg.style.textShadow = "0px 0px 20px black";
winMsg.style.display = "none"; 
winMsg.innerText = "YOU FOUND EKA!";
winMsg.style.zIndex = "2000";
document.body.appendChild(winMsg);

// Debug display
var debug = document.createElement("div");
debug.style.position = "absolute";
debug.style.color = "white";
debug.style.top = "10px";
debug.style.left = "10px";
debug.style.fontFamily = "monospace";
debug.style.backgroundColor = "rgba(0,0,0,0.5)";
debug.style.padding = "10px";
debug.style.zIndex = "1000";
debug.style.fontSize = "12px";
debug.style.borderRadius = "5px";
document.body.appendChild(debug);

// Pointer Lock
var lock = false;
document.addEventListener("pointerlockchange", () => lock = !lock);
container.onclick = () => { if (!lock) container.requestPointerLock(); };

// Player Constructor
function player(x, y, z, rx, ry, vx, vy, vz) {
    this.x = x; this.y = y; this.z = z;
    this.rx = rx; this.ry = ry;
    this.vx = vx; this.vy = vy; this.vz = vz;
    this.onGround = false;
}

// Spawn Player
var pawn = new player(0, -200, 800, 0, 0, 10, 15, 10);

// ==========================================
// 2. LEVEL DESIGN
// ==========================================
// Format: [x, y, z, rx, ry, rz, width, height, color, opacity, texture]

let goalX = 0, goalY = -700, goalZ = -1400;

let myRoom = [
    // --- FLOOR ---
    [0, 100, 0, 90, 0, 0, 3000, 3000, "#333", 1, texFloor],

    // --- WALLS ---
    [0, -400, -1500, 0, 0, 0, 3000, 1000, "grey", 1, texWall], // Front
    [0, -400, 1500, 0, 180, 0, 3000, 1000, "grey", 1, texWall], // Back
    [-1500, -400, 0, 0, 90, 0, 3000, 1000, "grey", 1, texWall], // Left
    [1500, -400, 0, 0, -90, 0, 3000, 1000, "grey", 1, texWall], // Right

    // --- PARKOUR STEPS ---
    
    // Step 1
    [0, 50, 400, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -25, 400, 90, 0, 0, 150, 150, "orange", 1, texBox],

    // Step 2
    [0, -50, 100, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -125, 100, 90, 0, 0, 150, 150, "orange", 1, texBox],

    // Step 3
    [0, -150, -200, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -225, -200, 90, 0, 0, 150, 150, "orange", 1, texBox],

    // Step 4 (Bridge)
    [0, -250, -600, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -325, -600, 90, 0, 0, 150, 400, "orange", 1, texBox],

    // Step 5 (Side Jump)
    [300, -400, -900, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [300, -475, -900, 90, 0, 0, 150, 150, "orange", 1, texBox],

    // Step 6 (Center)
    [0, -550, -1100, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -625, -1100, 90, 0, 0, 150, 150, "orange", 1, texBox],

    // --- THE GOAL (EKA BOX) ---
    // I added texEka to the last slot of each line below
    [goalX, goalY, goalZ-100, 0, 0, 0, 200, 200, "gold", 1, texEka], // Front
    [goalX, goalY-100, goalZ, 90, 0, 0, 200, 200, "gold", 1, texEka], // Top
    [goalX, goalY, goalZ+100, 0, 180, 0, 200, 200, "gold", 1, texEka], // Back
    [goalX-100, goalY, goalZ, 0, 90, 0, 200, 200, "gold", 1, texEka], // Left
    [goalX+100, goalY, goalZ, 0, -90, 0, 200, 200, "gold", 1, texEka], // Right
    [goalX, goalY+100, goalZ, -90, 0, 0, 200, 200, "gold", 1, texEka], // Bottom
];

drawMyWorld(myRoom, "level");

// ==========================================
// 3. LOGIC
// ==========================================
var pressForward = pressBack = pressRight = pressLeft = pressUp = 0;
var mouseX = mouseY = 0;
var mouseSensitivity = 1.2;
var dx = dy = dz = 0;
var gravity = 0.4; 
var onGround = false;
var won = false;

document.addEventListener("keydown", (e) => {
    if (e.key == "w") pressForward = pawn.vz;
    if (e.key == "s") pressBack = pawn.vz;
    if (e.key == "d") pressRight = pawn.vx;
    if (e.key == "a") pressLeft = pawn.vx;
    if (e.key == " ") pressUp = pawn.vy;
});
document.addEventListener("keyup", (e) => {
    if (e.key == "w") pressForward = 0;
    if (e.key == "s") pressBack = 0;
    if (e.key == "d") pressRight = 0;
    if (e.key == "a") pressLeft = 0;
    if (e.key == " ") pressUp = 0;
});
document.addEventListener("mousemove", (e) => {
    mouseX = e.movementX;
    mouseY = e.movementY;
});

function checkWinCondition() {
    if (won) return;
    let d = Math.sqrt((pawn.x - goalX)**2 + (pawn.y - (goalY-150))**2 + (pawn.z - goalZ)**2);
    if (d < 200) {
        won = true;
        winMsg.style.display = "block";
        setTimeout(() => {
            pawn.x = 0; pawn.y = -200; pawn.z = 800;
            pawn.vx = pawn.vy = pawn.vz = 0;
            won = false;
            winMsg.style.display = "none";
        }, 3000);
    }
}

function update() {
    dz = +(pressRight - pressLeft) * Math.sin(pawn.ry * DEG) - (pressForward - pressBack) * Math.cos(pawn.ry * DEG);
    dx = +(pressRight - pressLeft) * Math.cos(pawn.ry * DEG) + (pressForward - pressBack) * Math.sin(pawn.ry * DEG);
    dy += gravity;

    if (onGround) {
        dy = 0;
        if (pressUp) {
            dy = -pressUp;
            onGround = false;
        }
    }

    if (lock) {
        pawn.ry += mouseX * mouseSensitivity;
        pawn.rx += mouseY * mouseSensitivity;
        if (pawn.rx > 80) pawn.rx = 80;
        if (pawn.rx < -80) pawn.rx = -80;
    }
    mouseX = mouseY = 0;

    onGround = false;
    collision(myRoom, pawn);

    pawn.z += dz;
    pawn.x += dx;
    pawn.y += dy;

    checkWinCondition();

    world.style.transform = `translateZ(600px) rotateX(${-pawn.rx}deg) rotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;

    debug.innerHTML = `
        FIND EKA!<br>
        Jump to the Image Box!<br>
        Height: ${Math.abs(pawn.y).toFixed(0)}
    `;
}

setInterval(update, 20);

// ==========================================
// 4. RENDERING
// ==========================================
function drawMyWorld(squares, name) {
    let frag = document.createDocumentFragment();
    for (let i = 0; i < squares.length; i++) {
        let el = document.createElement("div");
        el.id = `${name}${i}`;
        el.style.position = "absolute";
        el.style.width = `${squares[i][6]}px`;
        el.style.height = `${squares[i][7]}px`;
        
        // Color & Texture Logic
        el.style.backgroundColor = squares[i][8];
        if (squares[i][10]) {
            el.style.backgroundImage = squares[i][10];
            el.style.backgroundSize = "cover";
            el.style.backgroundRepeat = "no-repeat";
        } else {
            el.style.boxShadow = "inset 0 0 20px rgba(0,0,0,0.3)";
        }

        el.style.transform = `translate3d(${600 + squares[i][0] - squares[i][6] / 2}px, ${400 + squares[i][1] - squares[i][7] / 2}px, ${squares[i][2]}px) rotateX(${squares[i][3]}deg) rotateY(${squares[i][4]}deg) rotateZ(${squares[i][5]}deg)`;
        el.style.opacity = squares[i][9];
        frag.appendChild(el);
    }
    world.appendChild(frag);
}

// ==========================================
// 5. COLLISION
// ==========================================
function collision(mapObj, leadObj) {
    onGround = false;
    for (let i = 0; i < mapObj.length; i++) {
        let obj = mapObj[i];
        let x0 = (leadObj.x - obj[0]);
        let y0 = (leadObj.y - obj[1]);
        let z0 = (leadObj.z - obj[2]);

        if ((x0 ** 2 + y0 ** 2 + z0 ** 2 + dx ** 2 + dy ** 2 + dz ** 2) < (obj[6] ** 2 + obj[7] ** 2)) {
            let x1 = x0 + dx; let y1 = y0 + dy; let z1 = z0 + dz;
            let point0 = coorTransform(x0, y0, z0, obj[3], obj[4], obj[5]);
            let point1 = coorTransform(x1, y1, z1, obj[3], obj[4], obj[5]);
            let normal = coorReTransform(0, 0, 1, obj[3], obj[4], obj[5]);

            if (Math.abs(point1[0]) < (obj[6] + 70) / 2 && Math.abs(point1[1]) < (obj[7] + 70) / 2 && Math.abs(point1[2]) < 50) {
                point1[2] = Math.sign(point0[2]) * 50;
                let point2 = coorReTransform(point1[0], point1[1], point1[2], obj[3], obj[4], obj[5]);
                let point3 = coorReTransform(point1[0], point1[1], 0, obj[3], obj[4], obj[5]);
                
                dx = point2[0] - x0;
                dy = point2[1] - y0;
                dz = point2[2] - z0;

                if (Math.abs(normal[1]) > 0.8) {
                    if (point3[1] > point2[1]) {
                        onGround = true;
                        if (dy > 0) dy = 0;
                    }
                } else { dy = y1 - y0; }
            }
        }
    };
}

function coorTransform(x0, y0, z0, rxc, ryc, rzc) {
    let x1 = x0, y1 = y0 * Math.cos(rxc * DEG) + z0 * Math.sin(rxc * DEG), z1 = -y0 * Math.sin(rxc * DEG) + z0 * Math.cos(rxc * DEG);
    let x2 = x1 * Math.cos(ryc * DEG) - z1 * Math.sin(ryc * DEG), y2 = y1, z2 = x1 * Math.sin(ryc * DEG) + z1 * Math.cos(ryc * DEG);
    return [x2 * Math.cos(rzc * DEG) + y2 * Math.sin(rzc * DEG), -x2 * Math.sin(rzc * DEG) + y2 * Math.cos(rzc * DEG), z2];
}

function coorReTransform(x3, y3, z3, rxc, ryc, rzc) {
    let x2 = x3 * Math.cos(rzc * DEG) - y3 * Math.sin(rzc * DEG), y2 = x3 * Math.sin(rzc * DEG) + y3 * Math.cos(rzc * DEG), z2 = z3;
    let x1 = x2 * Math.cos(ryc * DEG) + z2 * Math.sin(ryc * DEG), y1 = y2, z1 = -x2 * Math.sin(ryc * DEG) + z2 * Math.cos(ryc * DEG);
    return [x1, y1 * Math.cos(rxc * DEG) - z1 * Math.sin(rxc * DEG), y1 * Math.sin(rxc * DEG) + z1 * Math.cos(rxc * DEG)];
}