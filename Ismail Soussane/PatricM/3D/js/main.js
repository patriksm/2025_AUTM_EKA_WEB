const DEG = Math.PI / 180;
var world = document.getElementById("world");
var container = document.getElementById("container");

var lock = false;
document.addEventListener("pointerlockchange", (event) => {
    lock = !lock;
})
container.onclick = function () {
    if (!lock) container.requestPointerLock();
}

// Add instructions for user
function showInstructions() {
    let instructions = document.createElement("div");
    instructions.id = "instructions";
    instructions.style.position = "fixed";
    instructions.style.top = "50%";
    instructions.style.left = "50%";
    instructions.style.transform = "translate(-50%, -50%)";
    instructions.style.background = "rgba(0,0,0,0.8)";
    instructions.style.color = "white";
    instructions.style.padding = "20px";
    instructions.style.borderRadius = "10px";
    instructions.style.textAlign = "center";
    instructions.style.fontSize = "18px";
    instructions.style.zIndex = "1000";
    instructions.innerHTML = `
        <h2>🎮 3D Game Controls</h2>
        <p><strong>CLICK HERE</strong> to start playing!</p>
        <p>W, A, S, D - Move around</p>
        <p>Mouse - Look around</p>
        <p>Collect all 4 golden points!</p>
    `;
    document.body.appendChild(instructions);
    
    // Remove instructions when clicked
    instructions.onclick = function() {
        instructions.remove();
        container.requestPointerLock();
    };
}

// Show instructions on load
window.addEventListener('load', showInstructions);

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

var pawn = new player(0, 0, 0, 0, 0, 7, 7, 7);

// Game variables for point collection
var score = 0;
var collectiblePoints = [];
var pointElements = [];

let myRoom = [
    // Floor
    [0, 100, 0, 90, 0, 0, 2000, 2000, "brown", 1, "url('textures/wood.jpg')"],
    // Ceiling layer 1
    [0, -300, 0, 90, 0, 0, 2000, 2000, "white", 1, "url('textures/zaleej.jpg')"],
    // Ceiling layer 2 (slightly above)
    [0, -340, 0, 90, 0, 0, 2000, 2000, "white", 1, "url('textures/zaleej.jpg')"],
    // Back wall
    [0, -100, -1000, 0, 0, 0, 2000, 400, "brown", 1, "url('textures/spider.jpg')"],
    // Front wall
    [0, -100, 1000, 0, 0, 0, 2000, 400, "brown", 1, "url('textures/messi.jpg')"],
    // Right wall
    [1000, -100, 0, 0, 90, 0, 2000, 400, "brown", 1, "url('textures/superman.jpg')"],
    // Left wall
    [-1000, -100, 0, 0, 90, 0, 2000, 400, "brown", 1, "url('textures/batman.jpg')"],
    
    // Obstacle walls extending from main walls
    // From back wall
    [0, 40.5, -200, 0, 0, 0, 300, 300, "red", 1, "url('textures/walln3.jpg')"],
    [-200, 40.5, -200, 0, 0, 0, 300, 300, "blue", 1, "url('textures/walln3.jpg')"],
    [400, 40.5, -200, 0, 0, 0, 300, 300, "blue", 1, "url('textures/walln3.jpg')"],
    
    // From front wall
    [0, 40.5, 200, 0, 5, 0, 300, 300, "red", 1, "url('textures/walln3.jpg')"],
    [-400, 40.5, 200, 0, 0, 0, 300, 300, "green", 1, "url('textures/walln3.jpg')"],
    [400, 40.5, 200, 0, 0, 0, 300, 300, "green", 1, "url('textures/walln3.jpg')"],
    
    // From right wall
    [700, 40.5, 0, 0, 90, 0, 300, 300, "purple", 1, "url('textures/walln3.jpg')"],
    [800, 40.5, -400, 0, 90, 0, 200, 300, "orange", 1, "url('textures/walln3.jpg')"],
    [800, 40.5, 400, 0, 90, 0, 200, 300, "orange", 1, "url('textures/walln3.jpg')"],
    
    // From left wall
    [-700, 40.5, 0, 0, 90, 0, 300, 300, "purple", 1, "url('textures/walln3.jpg')"],
    [-800, 40.5, -400, 0, 90, 0, 200, 300, "cyan", 1, "url('textures/walln3.jpg')"],
    [-800, 40.5, 400, 0, 90, 0, 200, 300, "cyan", 1, "url('textures/walln3.jpg')"],
    
    // Additional corner obstacles
    [600, 87.5, 600, 0, 45, 0, 300, 300, "yellow", 1, "url('textures/sandy_wall.jpg')"],
    [-600, 87.5, 600, 0, -45, 0, 300, 300, "yellow", 1, "url('textures/sandy_wall.jpg')"],
    [600, 87.5, -600, 0, -45, 0, 300, 300, "magenta", 1, "url('textures/floor2.jpg')"],
    [-600, 87.5, -600, 0, 45, 0, 300, 300, "magenta", 1, "url('textures/floor2.jpg')"],
];

drawMyWorld(myRoom, "wall");

// Create collectible points - ONLY IN CORNERS
function createCollectiblePoints() {
    let pointPositions = [
        {x: 900, y: 85, z: 900},    // Front-right corner
        {x: -900, y: 85, z: 900},   // Front-left corner
        {x: 900, y: 85, z: -900},   // Back-right corner
        {x: -900, y: 85, z: -900}   // Back-left corner
    ];
    
    for(let i = 0; i < pointPositions.length; i++) {
        collectiblePoints.push({
            x: pointPositions[i].x,
            y: pointPositions[i].y,
            z: pointPositions[i].z,
            collected: false,
            id: i
        });
        
        let pointElement = createPointElement(i, pointPositions[i]);
        pointElements.push(pointElement);
        world.appendChild(pointElement);
    }
}

function createPointElement(id, position) {
    let point = document.createElement("div");
    point.id = `point_${id}`;
    point.style.position = "absolute";
    point.style.width = "30px";
    point.style.height = "30px";
    point.style.borderRadius = "50%";
    point.style.backgroundColor = "gold";
    point.style.border = "3px solid orange";
    point.style.boxShadow = "0 0 20px gold";
    point.style.transform = `translate3d(${600 + position.x - 15}px, ${400 + position.y - 15}px, ${position.z}px)`;
    return point;
}

// Create score display
function createScoreDisplay() {
    let scoreDisplay = document.createElement("div");
    scoreDisplay.id = "scoreDisplay";
    scoreDisplay.style.position = "fixed";
    scoreDisplay.style.top = "20px";
    scoreDisplay.style.left = "20px";
    scoreDisplay.style.color = "white";
    scoreDisplay.style.fontSize = "24px";
    scoreDisplay.style.fontFamily = "Arial";
    scoreDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    scoreDisplay.style.padding = "15px";
    scoreDisplay.style.borderRadius = "8px";
    scoreDisplay.innerHTML = `Score: <span id="scoreValue">0</span> / ${collectiblePoints.length * 10}`;
    document.body.appendChild(scoreDisplay);
}

// Check point collection
function checkPointCollection() {
    for(let i = 0; i < collectiblePoints.length; i++) {
        let point = collectiblePoints[i];
        if(!point.collected) {
            let distance = Math.sqrt(
                Math.pow(pawn.x - point.x, 2) + 
                Math.pow(pawn.y - point.y, 2) + 
                Math.pow(pawn.z - point.z, 2)
            );
            
            if(distance < 80) {
                point.collected = true;
                score += 10;
                pointElements[i].style.display = "none";
                document.getElementById("scoreValue").textContent = score;
                
                if(score === collectiblePoints.length * 10) {
                    alert("🎉 YOU WIN! All corner points collected! 🎉");
                }
            }
        }
    }
}

createCollectiblePoints();
createScoreDisplay();

var pressForward = pressBack = pressRight = pressLeft = pressUp = 0;
var mouseX = 0, mouseY = 0;
var mouseSensitivity = 1;
var dx = 0, dy = 0, dz = 0;
var gravity = 0.2;
var onGround = false;

document.addEventListener("keydown", (event) => {
    if (event.key == "w" || event.key == "W") {
        pressForward = pawn.vz;
    }
    if (event.key == "s" || event.key == "S") {
        pressBack = pawn.vz;
    }
    if (event.key == "d" || event.key == "D") {
        pressRight = pawn.vx;
    }
    if (event.key == "a" || event.key == "A") {
        pressLeft = pawn.vx;
    }
    if (event.key == " ") {
        pressUp = pawn.vy;
    }
})
document.addEventListener("keyup", (event) => {
    if (event.key == "w" || event.key == "W") {
        pressForward = 0;
    }
    if (event.key == "s" || event.key == "S") {
        pressBack = 0;
    }
    if (event.key == "d" || event.key == "D") {
        pressRight = 0;
    }
    if (event.key == "a" || event.key == "A") {
        pressLeft = 0;
    }
    if (event.key == " ") {
        pressUp = 0;
    }
})
document.addEventListener("mousemove", (event) => {
    mouseX = event.movementX;
    mouseY = event.movementY;
})

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

    let drx = mouseY * mouseSensitivity;
    let dry = mouseX * mouseSensitivity;

    collision(myRoom, pawn);

    mouseX = mouseY = 0;

    pawn.z += dz;
    pawn.x += dx;
    pawn.y += dy;

    if (lock) {
        pawn.rx += drx;
        if (pawn.rx > 57) {
            pawn.rx = 57;
        } else if (pawn.rx < -57) {
            pawn.rx = -57;
        }
        pawn.ry += dry;
    }

    checkPointCollection();

    world.style.transform = `translateZ(600px) rotateX(${-pawn.rx}deg) rotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;
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

function collision(mapObj, leadObj) {
    onGround = false;
    for (let i = 0; i < mapObj.length; i++) {
        let x0 = (leadObj.x - mapObj[i][0]);
        let y0 = (leadObj.y - mapObj[i][1]);
        let z0 = (leadObj.z - mapObj[i][2]);

        if ((x0 ** 2 + y0 ** 2 + z0 ** 2 + dx ** 2 + dy ** 2 + dz ** 2) < (mapObj[i][6] ** 2 + mapObj[i][7] ** 2)) {
            let x1 = x0 + dx;
            let y1 = y0 + dy;
            let z1 = z0 + dz;

            let point0 = coorTransform(x0, y0, z0, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
            let point1 = coorTransform(x1, y1, z1, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
            let normal = coorReTransform(0, 0, 1, mapObj[i][3], mapObj[i][4], mapObj[i][5]);

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
    }
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