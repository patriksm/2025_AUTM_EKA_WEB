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
const texEka   = "url('textures/eka.png')";

// --- BULLET SYSTEM (Using the method from your second code) ---
var myBullets = [];           // Stores bullet DOM elements
var myBulletsData = [];       // Stores bullet player objects
var myBulletNumber = 0;       // Counter for bullet IDs
var bulletSpeed = 20;         // Speed of bullets

// --- UI GENERATION (Pure JS) ---
// 1. Win Message
var winMsg = document.createElement("div");
Object.assign(winMsg.style, {
    position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
    color: "#FFD700", fontSize: "60px", fontFamily: "Arial Black", textShadow: "0px 0px 20px black",
    display: "none", zIndex: "2000"
});
winMsg.innerText = "YOU FOUND EKA!";
document.body.appendChild(winMsg);

// 2. Death Message
var deathMsg = document.createElement("div");
Object.assign(deathMsg.style, {
    position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
    color: "red", fontSize: "60px", fontFamily: "Arial Black", textShadow: "0px 0px 20px black",
    display: "none", zIndex: "2000"
});
deathMsg.innerText = "WASTED";
document.body.appendChild(deathMsg);

// 3. Debug
var debug = document.createElement("div");
Object.assign(debug.style, {
    position: "absolute", color: "white", top: "10px", left: "10px", fontFamily: "monospace",
    backgroundColor: "rgba(0,0,0,0.5)", padding: "10px", zIndex: "1000", fontSize: "12px", borderRadius: "5px"
});
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

var pawn = new player(0, -200, 800, 0, 0, 10, 15, 10);

// ==========================================
// 2. LEVEL DESIGN
// ==========================================
let goalX = 0, goalY = -700, goalZ = -1400;

let myRoom = [
    // --- FLOOR ---
    [0, 100, 0, 90, 0, 0, 3000, 3000, "#333", 1, texFloor],

    // --- WALLS ---
    [0, -400, -1500, 0, 0, 0, 3000, 1000, "grey", 1, texWall],
    [0, -400, 1500, 0, 180, 0, 3000, 1000, "grey", 1, texWall],
    [-1500, -400, 0, 0, 90, 0, 3000, 1000, "grey", 1, texWall],
    [1500, -400, 0, 0, -90, 0, 3000, 1000, "grey", 1, texWall],

    // --- PARKOUR STEPS ---
    [0, 50, 400, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -25, 400, 90, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -50, 100, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -125, 100, 90, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -150, -200, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -225, -200, 90, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -250, -600, 0, 0, 0, 150, 150, "orange", 1, texBox],
    [0, -325, -600, 90, 0, 0, 150, 400, "orange", 1, texBox],

    // A platform that will move left and right
    [0, -450, -1000, 90, 0, 0, 200, 200, "cyan", 1, texBox],

    // If you fall here, you restart
    [0, 90, -1000, 90, 0, 0, 1000, 800, "red", 0.8, null],

    // --- THE GOAL ---
    [goalX, goalY, goalZ-100, 0, 0, 0, 200, 200, "gold", 1, texEka],
    [goalX, goalY-100, goalZ, 90, 0, 0, 200, 200, "gold", 1, texEka],
    [goalX, goalY, goalZ+100, 0, 180, 0, 200, 200, "gold", 1, texEka],
    [goalX-100, goalY, goalZ, 0, 90, 0, 200, 200, "gold", 1, texEka],
    [goalX+100, goalY, goalZ, 0, -90, 0, 200, 200, "gold", 1, texEka],
    [goalX, goalY+100, goalZ, -90, 0, 0, 200, 200, "gold", 1, texEka],
];

drawMyWorld(myRoom, "level");

// ==========================================
// 3. BULLET FUNCTIONS (EXACTLY from your second code)
// ==========================================

function drawMyBullet(num) {
    let myBullet = document.createElement("div");
    myBullet.id = `bullet_${num}`;
    myBullet.style.display = "block";
    myBullet.style.position = "absolute";
    myBullet.style.width = `50px`;
    myBullet.style.height = `50px`;
    myBullet.style.borderRadius = `50%`;
    myBullet.style.backgroundColor = `red`;
    myBullet.style.boxShadow = "0 0 20px rgba(255,0,0,0.8)";
    myBullet.style.zIndex = "100";
    myBullet.style.transform = `translate3d(${600 + pawn.x - 25}px, ${400 + pawn.y - 25}px, ${pawn.z}px) rotateX(${pawn.rx}deg) rotateY(${-pawn.ry}deg)`;
    world.appendChild(myBullet);
    return myBullet;
}

function updateBullets() {
    for (let i = 0; i < myBullets.length; i++) {
        // Calculate bullet movement 
        let dzb = +(myBulletsData[i].vx) * Math.sin((myBulletsData[i].ry - 45) * DEG) - (myBulletsData[i].vz) * Math.cos((myBulletsData[i].ry - 45) * DEG);
        let dxb = +(myBulletsData[i].vx) * Math.cos((myBulletsData[i].ry - 45) * DEG) + (myBulletsData[i].vz) * Math.sin((myBulletsData[i].ry - 45) * DEG);
        
        // Update bullet position
        myBulletsData[i].x += dxb;
        myBulletsData[i].z += dzb;
        
        // Add some gravity to bullets
        myBulletsData[i].y += 0.5;
        
        // Update bullet rotation for visual spin (optional)
        // myBulletsData[i].ry += 10; // Uncomment for spinning effect
        
        // Update bullet visual position
        myBullets[i].style.transform = `translate3d(${600 + myBulletsData[i].x - 25}px, ${400 + myBulletsData[i].y - 25}px, ${myBulletsData[i].z}px) rotateX(${myBulletsData[i].rx}deg) rotateY(${-myBulletsData[i].ry}deg)`;
        
        // Remove bullets that are too far away
        if (Math.abs(myBulletsData[i].x) > 3000 || Math.abs(myBulletsData[i].y) > 3000 || Math.abs(myBulletsData[i].z) > 3000) {
            myBullets[i].style.display = "none";
            if (myBullets[i].parentNode) {
                myBullets[i].parentNode.removeChild(myBullets[i]);
            }
            myBullets.splice(i, 1);
            myBulletsData.splice(i, 1);
            i--;
        }
    }
}

// ==========================================
// 4. INPUTS & LOGIC
// ==========================================
var pressForward = pressBack = pressRight = pressLeft = pressUp = 0;
var mouseX = mouseY = 0;
var mouseSensitivity = 1.2;
var dx = dy = dz = 0;
var gravity = 0.4; 
var onGround = false;
var won = false;
var isSprinting = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "Shift") isSprinting = true;
    if (e.key == "w") pressForward = pawn.vz;
    if (e.key == "s") pressBack = pawn.vz;
    if (e.key == "d") pressRight = pawn.vx;
    if (e.key == "a") pressLeft = pawn.vx;
    if (e.key == " ") pressUp = pawn.vy;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Shift") isSprinting = false;
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

// Shooting with mouse click (EXACTLY from your second code)
document.addEventListener("click", function () {
    if (lock && !won) {
        myBullets.push(drawMyBullet(myBulletNumber));
        // Store bullet data with player's rotation and bullet speed
        myBulletsData.push(new player(pawn.x, pawn.y, pawn.z, pawn.rx, pawn.ry, bulletSpeed, 0, bulletSpeed));
        myBulletNumber++;
    }
});

// Helper to kill player
function respawn() {
    deathMsg.style.display = "block";
    pawn.x = 0; pawn.y = -200; pawn.z = 800;
    pawn.vx = pawn.vy = pawn.vz = 0;
    dx = dy = dz = 0;
    
    // Clear bullets on respawn
    for (let i = 0; i < myBullets.length; i++) {
        if (myBullets[i].parentNode) {
            myBullets[i].parentNode.removeChild(myBullets[i]);
        }
    }
    myBullets = [];
    myBulletsData = [];
    myBulletNumber = 0;
    
    setTimeout(() => { deathMsg.style.display = "none"; }, 1500);
}

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
            
            // Clear bullets on win
            for (let i = 0; i < myBullets.length; i++) {
                if (myBullets[i].parentNode) {
                    myBullets[i].parentNode.removeChild(myBullets[i]);
                }
            }
            myBullets = [];
            myBulletsData = [];
            myBulletNumber = 0;
        }, 3000);
    }
}

function update() {
    // Update bullets
    updateBullets();

    // 1. ANIMATE MOVING PLATFORM (Cyan)
    let moverIndex = myRoom.findIndex(obj => obj[8] === "cyan");
    if(moverIndex !== -1) {
        let moveSpeed = 0.002;
        let range = 400; 
        myRoom[moverIndex][0] = Math.sin(Date.now() * moveSpeed) * range;
        
        let el = document.getElementById("level" + moverIndex);
        if(el) {
            let sq = myRoom[moverIndex];
            el.style.transform = `translate3d(${600 + sq[0] - sq[6] / 2}px, ${400 + sq[1] - sq[7] / 2}px, ${sq[2]}px) rotateX(${sq[3]}deg) rotateY(${sq[4]}deg) rotateZ(${sq[5]}deg)`;
        }
    }

    // 2. MOVEMENT (With Sprint)
    let speedMult = isSprinting ? 2.0 : 1.0;

    dz = +(pressRight - pressLeft) * speedMult * Math.sin(pawn.ry * DEG) - (pressForward - pressBack) * speedMult * Math.cos(pawn.ry * DEG);
    dx = +(pressRight - pressLeft) * speedMult * Math.cos(pawn.ry * DEG) + (pressForward - pressBack) * speedMult * Math.sin(pawn.ry * DEG);
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

    // 3. FALL CHECK (Void)
    if(pawn.y > 600) respawn();

    checkWinCondition();

    world.style.transform = `translateZ(600px) rotateX(${-pawn.rx}deg) rotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;

    debug.innerHTML = `
        HOLD SHIFT TO SPRINT<br>
        AVOID RED LAVA<br>
        CLICK TO SHOOT BULLETS<br>
        Height: ${Math.abs(pawn.y).toFixed(0)}<br>
        Bullets: ${myBullets.length}
    `;
}

setInterval(update, 20);

// ==========================================
// 5. RENDERING
// ==========================================
function drawMyWorld(squares, name) {
    let frag = document.createDocumentFragment();
    for (let i = 0; i < squares.length; i++) {
        let el = document.createElement("div");
        el.id = `${name}${i}`;
        el.style.position = "absolute";
        el.style.width = `${squares[i][6]}px`;
        el.style.height = `${squares[i][7]}px`;
        
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
// 6. COLLISION (With Lava & Platform Logic)
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
                
                // --- SPECIAL BLOCK LOGIC ---
                // 1. Red = LAVA = DEATH
                if(obj[8] === "red") {
                    respawn();
                    return;
                }

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

                        // 2. Cyan = MOVING PLATFORM = FRICTION
                        if(obj[8] === "cyan") {
                             let moveSpeed = 0.002;
                             let range = 400;
                             let curr = Math.sin(Date.now()*moveSpeed)*range;
                             let next = Math.sin((Date.now()+20)*moveSpeed)*range;
                             dx += (next - curr); // Push player
                        }
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