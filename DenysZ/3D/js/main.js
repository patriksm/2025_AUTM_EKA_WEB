const DEG = Math.PI / 180;
const TARGET_SIZE = 40;
const TARGET_Z_OFFSET = 40;
const WALL_Z = -1000;
const WALL_TOP = -650;
const WALL_BOTTOM = 850;
const MARGIN = 10;
const SPAWN_PADDING = 90;
const shotSound = new Audio("sounds/shot.mp3");
const hitSound = new Audio("sounds/hit.mp3");

var world = document.getElementById("world");
var container = document.getElementById("container");


var lock = false;
document.addEventListener("pointerlockchange", (event) => {
    lock = !lock;
})
container.onclick = function () {
    if (!lock) container.requestPointerLock();
}

let crosshair = document.createElement("div");
crosshair.style.position = "absolute";
crosshair.style.left = "50%";
crosshair.style.top = "50%";
crosshair.style.width = "6px";
crosshair.style.height = "6px";
crosshair.style.marginLeft = "0px";
crosshair.style.marginTop = "0px";
crosshair.style.background = "green";
crosshair.style.borderRadius = "50%";
crosshair.style.zIndex = "999";
container.appendChild(crosshair);

let hud = document.createElement("div");
hud.style.position = "absolute";
hud.style.left = "20px";
hud.style.top = "20px";
hud.style.color = "lime";
hud.style.fontFamily = "monospace";
hud.style.fontSize = "20px";
hud.style.zIndex = "10000";
hud.style.userSelect = "none";
container.appendChild(hud);

let resetHint = document.createElement("div");
resetHint.style.position = "absolute";
resetHint.style.right = "20px";
resetHint.style.top = "20px";
resetHint.style.color = "blue";
resetHint.style.fontFamily = "monospace";
resetHint.style.fontSize = "14px";
resetHint.style.opacity = "0.8";
resetHint.style.userSelect = "none";
resetHint.innerText = "press R to reset your points";

container.appendChild(resetHint);

function player(x, y, z, rx, ry, vx, vy, vz) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.onGround = false;
}

var pawn = new player(0, 0, 0, 0, 0, 5, 6, 5);
var myBullets = [];
var myBulletNumber = 0;
var myBulletsData = [];

let score = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;


let squares = [
    [500, 300, 100, 0, 0, 0, 200, 200, "blueviolet", 0.5],
    [500, 300, -100, 0, 0, 0, 200, 200, "yellowgreen", 0.5],
    [500, 200, 0, 90, 0, 0, 200, 200, "black", 0.5],
    [500, 400, 0, 90, 0, 0, 200, 200, "black", 0.5],
    [400, 300, 0, 0, 90, 0, 200, 200, "red", 0.5],
    [600, 300, 0, 0, 90, 0, 200, 200, "red", 0.5]
];

let myRoom = [
    [0, 100, 0, 90, 0, 0, 2000, 2000, "brown", 1, "url('textures/floor_01.jpg')"], // floor
    [0, -650, 0, 90, 0, 0, 2000, 2000, "brown", 1, "url('textures/wood_ceiling.jpg')"], // ceiling
    [0, 100, -1000, 0, 0, 0, 2000, 1500, "brown", 1, "url('textures/stone_wall.jpg')"], // wall1
    [0, 100, 1000, 0, 0, 0, 2000, 1500, "brown", 1, "url('textures/stone_wall.jpg')"], // wall2
    [1000, 0, 0, 0, 90, 0, 2000, 1300, "brown", 1, "url('textures/stone_wall.jpg')"], // wall3 
    [-1000, 0, 0, 0, 90, 0, 2000, 1300, "brown", 1, "url('textures/stone_wall.jpg')"], // wall4

    // PARKOUR 
    // Start cube
    [-300, 100, 100, 0, 0, 0, 200, 200, "orange", 1],  // front
    [-300, 100, -100, 0, 180, 0, 200, 200, "orange", 1],  // back
    [-400, 100, 0, 0, 90, 0, 200, 200, "orange", 1],  // left
    [-200, 100, 0, 0, -90, 0, 200, 200, "orange", 1],  // right
    [-300, 0, 0, 90, 0, 0, 200, 200, "orange", 1],  // top
    [-300, 200, 0, -90, 0, 0, 200, 200, "orange", 1],  // bottom

    // Platform 1
    [-100, 0, 300, 0, 0, 0, 200, 200, "blueviolet", 1],
    [-100, 0, 100, 0, 180, 0, 200, 200, "blueviolet", 1],
    [-200, 0, 200, 0, 90, 0, 200, 200, "blueviolet", 1],
    [0, 0, 200, 0, -90, 0, 200, 200, "blueviolet", 1],
    [-100, -100, 200, 90, 0, 0, 200, 200, "blueviolet", 1],
    [-100, 100, 200, -90, 0, 0, 200, 200, "blueviolet", 1],

    // Platform 2
    [100, -100, 450, 0, 0, 0, 200, 200, "cyan", 1],
    [100, -100, 250, 0, 180, 0, 200, 200, "cyan", 1],
    [0, -100, 350, 0, 90, 0, 200, 200, "cyan", 1],
    [200, -100, 350, 0, -90, 0, 200, 200, "cyan", 1],
    [100, -200, 350, 90, 0, 0, 200, 200, "cyan", 1],
    [100, 0, 350, -90, 0, 0, 200, 200, "cyan", 1],

    // Platform 3
    [300, -200, 300, 0, 0, 0, 200, 200, "lime", 1],
    [300, -200, 100, 0, 180, 0, 200, 200, "lime", 1],
    [200, -200, 200, 0, 90, 0, 200, 200, "lime", 1],
    [400, -200, 200, 0, -90, 0, 200, 200, "lime", 1],
    [300, -300, 200, 90, 0, 0, 200, 200, "lime", 1],
    [300, -100, 200, -90, 0, 0, 200, 200, "lime", 1],

    // Final cube
    [500, -300, 75, 0, 0, 0, 150, 150, "gold", 1],
    [500, -300, -75, 0, 180, 0, 150, 150, "gold", 1],
    [425, -300, 0, 0, 90, 0, 150, 150, "gold", 1],
    [575, -300, 0, 0, -90, 0, 150, 150, "gold", 1],
    [500, -375, 0, 90, 0, 0, 150, 150, "gold", 1],
    [500, -225, 0, -90, 0, 0, 150, 150, "gold", 1],
];

let aimZone = {
    xMin: -1000 + TARGET_SIZE / 2 + MARGIN,
    xMax:  1000 - TARGET_SIZE / 2 - MARGIN,

    yMin: WALL_TOP + TARGET_SIZE / 2 + MARGIN,
    yMax: WALL_BOTTOM - TARGET_SIZE / 2 - MARGIN,

    z: WALL_Z
};


drawMyWorld(myRoom, "wall")

// aim wall
const aimWall = {
    x: 0,
    y: 0,
    z: -900,
    width: 600,
    height: 400
};

const aimFrame = document.createElement("div");
aimFrame.style.position = "absolute";
aimFrame.style.width = aimWall.width + "px";
aimFrame.style.height = aimWall.height + "px";
aimFrame.style.border = "3px dashed lime";
aimFrame.style.boxSizing = "border-box";
aimFrame.style.pointerEvents = "none";

aimFrame.style.transform = `
    translate3d(
        ${600 + aimWall.x - aimWall.width / 2}px,
        ${400 + aimWall.y - aimWall.height / 2}px,
        ${aimWall.z}px
    )
`;

world.appendChild(aimFrame);

const aimTarget = document.createElement("div");
aimTarget.style.position = "absolute";
aimTarget.style.width = TARGET_SIZE + "px";
aimTarget.style.height = TARGET_SIZE + "px";
aimTarget.style.background = "red";
aimTarget.style.zIndex = "9999";

world.appendChild(aimTarget);

const targetPos = { x: 0, y: 0, z: aimWall.z + 1 };

var pressForward = pressBack = pressRight = pressLeft = pressUp = 0;
var mouseX = mouseY = 0;
var dx = dy = dz = 0;

let drx = 0;
let zoom = 0;
var mouseSensitivity = 0.5;
var onGround = false;
var gravity = 0.15;


document.addEventListener("keydown", (event) => {
    if (event.key == "w") {
        pressForward = pawn.vz;
    }
    if (event.key == "s") {
        pressBack = pawn.vz;
    }
    if (event.key == "d") {
        pressRight = pawn.vx;
    }
    if (event.key == "a") {
        pressLeft = pawn.vx;
    }
    if (event.key == " ") {
        pressUp = pawn.vy;
    }
})
document.addEventListener("keyup", (event) => {
    if (event.key == "w") {
        pressForward = 0;
    }
    if (event.key == "s") {
        pressBack = 0;
    }
    if (event.key == "d") {
        pressRight = 0;
    }
    if (event.key == "a") {
        pressLeft = 0;
    }
    if (event.key == " ") {
        pressUp = 0;
    }
})

document.addEventListener("keydown", (e) => {
    if (e.key == "r" || e.key == "R") {
        resetPoints();
    }
});

document.addEventListener("mousemove", (event) => {
    mouseX = event.movementX;
    mouseY = event.movementY;
})

document.onclick = function () {
    if (lock) {
        myBullets.push(drawMyBullet(myBulletNumber));
        myBulletsData.push({
            x: pawn.x,
            y: pawn.y,
            z: pawn.z,
            rx: pawn.rx,
            ry: pawn.ry,
            speed: 50
        });
        myBulletNumber++;
    }
};


function update() {
    dz = +(pressRight - pressLeft) * Math.sin(pawn.ry * DEG) - (pressForward - pressBack) * Math.cos(pawn.ry * DEG);
    dx = +(pressRight - pressLeft) * Math.cos(pawn.ry * DEG) + (pressForward - pressBack) * Math.sin(pawn.ry * DEG);
    onGround = false;

    let drx = mouseY * mouseSensitivity;
    let dry = mouseX * mouseSensitivity;

    mouseX = mouseY = 0;

    if (!onGround) {
        dy += gravity;
    } else {
        dy = Math.min(dy, 0);
    }

    collision(myRoom, pawn);

    pawn.z += dz;
    pawn.x += dx;
    pawn.y += dy;

    if (onGround) {
        if (pressUp) {
            dy = -pressUp;
            onGround = false;
        } else {
            dy = 0;
        }
    }

    if (lock) {
        pawn.rx += drx;
        pawn.ry += dry;
        if (pawn.rx > 67) {
            pawn.rx = 67;
        }
        else if (pawn.rx < -67) {
            pawn.rx = -67;
        }
    }

    

    world.style.transform = `translateZ(600px) rotateX(${-pawn.rx}deg) rotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;

    for (let i = myBullets.length - 1; i >= 0; i--) {
    let b = myBulletsData[i];

    b.x += Math.sin(b.ry * DEG) * b.speed;
    b.z -= Math.cos(b.ry * DEG) * b.speed;
    b.y += Math.sin(b.rx * DEG) * b.speed;

    myBullets[i].style.transform = `
        translate3d(
            ${600 + b.x}px,
            ${400 + b.y}px,
            ${b.z}px
        )
    `;

    if (Math.abs(b.z) > 3000) {
        myBullets[i].remove();
        myBullets.splice(i, 1);
        myBulletsData.splice(i, 1);
        continue;
    }

    let dxT = b.x - targetPos.x;
    let dyT = b.y - targetPos.y;
    let dzT = b.z - targetPos.z;

    // hit check
    if (dxT*dxT + dyT*dyT + dzT*dzT < 30*30) {
    playHitSound();
    spawnTarget();
    score++;

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
    }

    updateHUD();

    myBullets[i].remove();
    myBullets.splice(i, 1);
    myBulletsData.splice(i, 1);
    }

    if (!aimTarget.style.transform.includes("translate3d")) {
    spawnTarget();
    }
}
}


function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function updateHUD() {
    hud.innerHTML = `
        SCORE: ${score}<br>
        BEST: ${bestScore}<br>
    `;
}
updateHUD();
function collision(mapObj, leadObj, type) {
    for (let i = 0; i < mapObj.length; i++) {
        //spēlētāja koordinātes katra taiststūra koordināšu sistēmā
        let x0 = (pawn.x - mapObj[i][0]);
        let y0 = (pawn.y - mapObj[i][1]);
        let z0 = (pawn.z - mapObj[i][2]);

        if ((x0 ** 2 + y0 ** 2 + z0 ** 2 + dx ** 2 + dy ** 2 + dz ** 2) < (mapObj[i][6] ** 2 + mapObj[i][7] ** 2)) {
            //Pārvietošanās
            let x1 = x0 + dx;
            let y1 = y0 + dy;
            let z1 = z0 + dz;

            //Jaunā punkta koodrinātes
            let point0 = coorTransform(x0, y0, z0, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
            let point1 = coorTransform(x1, y1, z1, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
            let normal = coorReTransform(0, 0, 1, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
            // let point2 = new Array();

            if (Math.abs(point1[0]) < (mapObj[i][6] + 70) / 2 && Math.abs(point1[1]) < (mapObj[i][7] + 70) / 2 && Math.abs(point1[2]) < 50) {
                point1[2] = Math.sign(point0[2]) * 50;
                let point2 = coorReTransform(point1[0], point1[1], point1[2], mapObj[i][3], mapObj[i][4], mapObj[i][5]);
                let point3 = coorReTransform(point1[0], point1[1], 0, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
                dx = point2[0] - x0;
                dy = point2[1] - y0;
                dz = point2[2] - z0;

                if (Math.abs(normal[1]) > 0.8) {
                    if (point3[1] > point2[1]) {
                        onGround = true;
                    }
                } else {
                    dy = y1 - y0;
                }
            }
        }
    };
}


function coorTransform(x0, y0, z0, rxc, ryc, rzc) {
    let x1 = x0;
    let y1 = y0 * Math.cos(rxc * DEG) + z0 * Math.sin(rxc * DEG);
    let z1 = -y0 * Math.sin(rxc * DEG) + z0 * Math.cos(rxc * DEG);

    let x2 = x1 * Math.cos(ryc * DEG) - z1 * Math.sin(ryc * DEG);
    let y2 = y1;
    let z2 = x1 * Math.sin(ryc * DEG) + z1 * Math.cos(ryc * DEG);

    let x3 = x2 * Math.cos(rzc * DEG) + y2 * Math.sin(rzc * DEG);
    let y3 = -x2 * Math.sin(rzc * DEG) + y2 * Math.cos(rzc * DEG);
    let z3 = z2;
    return [x3, y3, z3];
}

function coorReTransform(x3, y3, z3, rxc, ryc, rzc) {
    let x2 = x3 * Math.cos(rzc * DEG) - y3 * Math.sin(rzc * DEG);
    let y2 = x3 * Math.sin(rzc * DEG) + y3 * Math.cos(rzc * DEG);
    let z2 = z3;

    let x1 = x2 * Math.cos(ryc * DEG) + z2 * Math.sin(ryc * DEG);
    let y1 = y2;
    let z1 = -x2 * Math.sin(ryc * DEG) + z2 * Math.cos(ryc * DEG);

    let x0 = x1;
    let y0 = y1 * Math.cos(rxc * DEG) - z1 * Math.sin(rxc * DEG);
    let z0 = y1 * Math.sin(rxc * DEG) + z1 * Math.cos(rxc * DEG);

    return [x0, y0, z0];
}




let game = setInterval(update, 10);

function drawMyWorld(squares, name) {
    for (let i = 0; i < squares.length; i++) {
        let mySquare1 = document.createElement("div");
        mySquare1.id = `${name}${i}`;
        mySquare1.style.position = "absolute";
        mySquare1.style.width = `${squares[i][6]}px`;
        mySquare1.style.height = `${squares[i][7]}px`;
        if (squares[i][10]) {
            mySquare1.style.backgroundImage = squares[i][10];
        } else {
            mySquare1.style.backgroundColor = squares[i][8];
        }
        mySquare1.style.transform = `translate3d(${600 + squares[i][0] - squares[i][6] / 2}px, ${400 + squares[i][1] - squares[i][7] / 2}px, ${squares[i][2]}px) rotateX(${squares[i][3]}deg) rotateY(${squares[i][4]}deg) rotateZ(${squares[i][5]}deg)`;
        mySquare1.style.opacity = squares[i][9];
        world.appendChild(mySquare1);
    }
}

function spawnTarget() {
    const halfW = aimWall.width / 2;
    const halfH = aimWall.height / 2;

    const minX = aimWall.x - halfW + SPAWN_PADDING;
    const maxX = aimWall.x + halfW - SPAWN_PADDING - TARGET_SIZE;

    const minY = aimWall.y - halfH + SPAWN_PADDING;
    const maxY = aimWall.y + halfH - SPAWN_PADDING - TARGET_SIZE;

    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    targetPos.x = x;
    targetPos.y = y;
    targetPos.z = aimWall.z + 20; // всегда ЧУТЬ перед стеной

    aimTarget.style.transform = `
        translate3d(
            ${600 + x}px,
            ${400 + y}px,
            ${targetPos.z}px
        )
    `;
}

// target moving in random pos
function hitTarget() {
    spawnTarget();
}

hitTarget();


function drawMyBullet(num) {
    let myBullet = document.createElement("div");
    myBullet.id = `bullet_${num}`;
    myBullet.style.position = "absolute";
    myBullet.style.width = "20px";
    myBullet.style.height = "20px";
    myBullet.style.borderRadius = "50%";
    myBullet.style.backgroundColor = "red";

    myBullet.style.transform = `
        translate3d(
            ${600 + pawn.x}px,
            ${400 + pawn.y}px,
            ${pawn.z}px
        )
    `;

    world.appendChild(myBullet);
    return myBullet;
}

function playShotSound() {
    const s = shotSound.cloneNode();
    s.volume = 0.4;
    s.play();
}

document.addEventListener("mousedown", () => {
    playShotSound();
});

function playHitSound() {
    const s = hitSound.cloneNode();
    s.volume = 0.3;
    s.play();
}

function resetPoints() {
    score = 0;
    bestScore = 0;
    localStorage.removeItem("bestScore");
    updateHUD();
}


spawnTarget();
updateHUD();