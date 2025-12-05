const DEG = Math.PI / 180;
var world = document.getElementById("world");
var container = document.getElementById("container");

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

//
var lock = false;
document.addEventListener("pointerlockchange", (event) => {
    lock = !lock;
})
container.onclick = function () {
    if (!lock) container.requestPointerLock();
}
//

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

// CHANGE 1: Increase vertical velocity for higher jumps (from 7 to 15)
var pawn = new player(0, 0, 0, 0, 0, 7, 7, 7);

// Floor and wall
let myRoom = [
    // Floor (at y=100, rotated 90° to be flat)
    [0, 100, 0, 90, 0, 0, 2000, 2000, "brown", 1, "url('textures/floor_01.jpg')"],
    // Wall in front (at z=-1000)
    [0, -100, -1000, 0, 0, 0, 2000, 400, "brown", 1, "url('textures/sandy_wall.jpg')"],
];

// Create 3D cube (6 faces)
let cubeSize = 100; // Size of the cube
let cubeX = 0;
let cubeY = 0;
let cubeZ = -300; // Closer to player


let ekaTexture = "url('textures/eka.png')"; 

// Create cube faces with "eka" texture
// Format: [x, y, z, rx, ry, rz, width, height, color, opacity, texture]
let cubeFaces = [
    // Front face
    [cubeX, cubeY, cubeZ - cubeSize/2, 0, 0, 0, cubeSize, cubeSize, "", 1, ekaTexture],
    // Back face
    [cubeX, cubeY, cubeZ + cubeSize/2, 0, 180, 0, cubeSize, cubeSize, "", 1, ekaTexture],
    // Top face (what you stand on)
    [cubeX, cubeY - cubeSize/2, cubeZ, 90, 0, 0, cubeSize, cubeSize, "", 1, ekaTexture],
    // Bottom face
    [cubeX, cubeY + cubeSize/2, cubeZ, -90, 0, 0, cubeSize, cubeSize, "", 1, ekaTexture],
    // Left face
    [cubeX - cubeSize/2, cubeY, cubeZ, 0, 90, 0, cubeSize, cubeSize, "", 1, ekaTexture],
    // Right face
    [cubeX + cubeSize/2, cubeY, cubeZ, 0, -90, 0, cubeSize, cubeSize, "", 1, ekaTexture]
];

// Add cube faces to room
myRoom = myRoom.concat(cubeFaces);

drawMyWorld(myRoom, "wall")

var pressForward = pressBack = pressRight = pressLeft = pressUp = 0;
var mouseX = mouseY = 0;
var mouseSensitivity = 1;
var dx = dy = dz = 0;
// CHANGE 2: Reduce gravity for longer jumps (from 0.2 to 0.15)
var gravity = 0.15;
var onGround = false;

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

    // Reset onGround before collision check
    onGround = false;
    
    // Store original velocities for collision
    let originalDY = dy;
    
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

    world.style.transform = `translateZ(600px) rotateX(${-pawn.rx}deg) rotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;
    
    // Debug display update
    debug.innerHTML = `
        Position: ${pawn.x.toFixed(1)}, ${pawn.y.toFixed(1)}, ${pawn.z.toFixed(1)}<br>
        Velocity: ${dx.toFixed(2)}, ${dy.toFixed(2)}, ${dz.toFixed(2)}<br>
        On Ground: ${onGround}<br>
        Rotation: ${pawn.rx.toFixed(1)}, ${pawn.ry.toFixed(1)}<br>
        Pressed: W(${pressForward}) A(${pressLeft}) S(${pressBack}) D(${pressRight}) SPACE(${pressUp})<br>
        Cube Center: x=${cubeX}, y=${cubeY}, z=${cubeZ}<br>
        Distance to cube: ${Math.sqrt((pawn.x-cubeX)**2 + (pawn.y-cubeY)**2 + (pawn.z-cubeZ)**2).toFixed(1)}
    `;
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
            mySquare1.style.backgroundSize = "cover"; // Makes image fit the face
            mySquare1.style.backgroundRepeat = "no-repeat";
            mySquare1.style.backgroundPosition = "center";
        } else {
            mySquare1.style.backgroundColor = squares[i][8];
        }
        // Add border to see cube edges better (only if no texture)
        if (!squares[i][10] && squares[i][8]) {
            mySquare1.style.border = "1px solid rgba(0,0,0,0.3)";
            mySquare1.style.boxSizing = "border-box";
        }
        mySquare1.style.transform = `translate3d(${600 + squares[i][0] - squares[i][6] / 2}px, ${400 + squares[i][1] - squares[i][7] / 2}px, ${squares[i][2]}px) rotateX(${squares[i][3]}deg) rotateY(${squares[i][4]}deg) rotateZ(${squares[i][5]}deg)`;
        mySquare1.style.opacity = squares[i][9];
        world.appendChild(mySquare1);
    }
}

function collision(mapObj, leadObj) {
    // Reset onGround at start
    onGround = false;
    
    for (let i = 0; i < mapObj.length; i++) {
        let obj = mapObj[i];
        
        // Player coordinates in each rectangle's coordinate system
        let x0 = (leadObj.x - obj[0]);
        let y0 = (leadObj.y - obj[1]);
        let z0 = (leadObj.z - obj[2]);

        // Check if player is close enough to this object for collision
        if ((x0 ** 2 + y0 ** 2 + z0 ** 2 + dx ** 2 + dy ** 2 + dz ** 2) < (obj[6] ** 2 + obj[7] ** 2)) {
            // Movement
            let x1 = x0 + dx;
            let y1 = y0 + dy;
            let z1 = z0 + dz;

            // New point coordinates in object's local space
            let point0 = coorTransform(x0, y0, z0, obj[3], obj[4], obj[5]);
            let point1 = coorTransform(x1, y1, z1, obj[3], obj[4], obj[5]);
            let normal = coorReTransform(0, 0, 1, obj[3], obj[4], obj[5]);

            // Check if collision occurs (player within object bounds + collision margin)
            if (Math.abs(point1[0]) < (obj[6] + 70) / 2 && 
                Math.abs(point1[1]) < (obj[7] + 70) / 2 && 
                Math.abs(point1[2]) < 50) {
                
                // Collision response
                point1[2] = Math.sign(point0[2]) * 50;
                let point2 = coorReTransform(point1[0], point1[1], point1[2], obj[3], obj[4], obj[5]);
                let point3 = coorReTransform(point1[0], point1[1], 0, obj[3], obj[4], obj[5]);
                
                dx = point2[0] - x0;
                dy = point2[1] - y0;
                dz = point2[2] - z0;

                // Check if this is a ground surface (normal pointing mostly up)
                if (Math.abs(normal[1]) > 0.8) {
                    if (point3[1] > point2[1]) {
                        onGround = true;
                        // If we're standing on something, reset vertical velocity
                        if (dy > 0) {
                            dy = 0;
                        }
                    }
                } else {
                    // For walls, keep vertical movement but adjust horizontal
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