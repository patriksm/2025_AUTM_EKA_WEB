const DEG = Math.PI / 180;
var world = document.getElementById("world");
var container = document.getElementById("container");

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

var pawn = new player(0, 0, 0, 0, 0, 7, 7, 7);
var myBullets = [];
var myBulletsData = [];
var myBulletNumber = 0;
var bulletSpeed = 21;

// Add single zombie for challenge
var myZombie = [500, 0, -600, 100, 120, 100]; // x, y, z, width, height, health

var score = 0; // Player score
var health = 100; // Player health
var ammo = 30; // Player ammo
var isReloading = false;

// Scary atmosphere variables
var lightFlicker = false;
var flickerTimer = 0;
var scarySound = false;
var jumpScareTimer = 0;

let myRoom = [
    // Big floor
    [0, 100, 0, 90, 0, 0, 4000, 4000, "brown", 1, "url('textures/crackedconcrete.jpg')"],
    
    // Central elevated SAFE ZONE platform where all 4 stairs gather (lowered for easier access)
    [0, -100, 0, 90, 0, 0, 400, 400, "darkgray", 1, "url('textures/concrete2.jpg')"],
    
    // SAFE ZONE WALLS - Zombies can't get through these (lowered)
    [0, -50, -200, 0, 0, 0, 50, 100,"linear-gradient(45deg, #ff4757, #2f3542)", 1],// North wall
    [0, -50, 200, 0, 0, 0, 50, 100, "linear-gradient(45deg, #ff4757, #2f3542)", 1], // South wall
    [200, -50, 0, 0, 90, 0, 50, 100, "linear-gradient(45deg, #ff4757, #2f3542)", 1], // East wall
    [-200, -50, 0, 0, 90, 0, 50, 100, "linear-gradient(45deg, #ff4757, #2f3542)", 1], // West wall
    
    // SAFE ZONE ENTRANCE GATES (small openings for player only) (lowered)
    [0, -50, -175, 0, 0, 0, 80, 100, "linear-gradient(45deg, #00d2d3, #54a0ff)", 0.7], // North gate
    [0, -50, 175, 0, 0, 0, 80, 100, "linear-gradient(45deg, #00d2d3, #54a0ff)", 0.7], // South gate
    [175, -50, 0, 0, 90, 0, 80, 100, "linear-gradient(45deg, #00d2d3, #54a0ff)", 0.7], // East gate
    [-175, -50, 0, 0, 90, 0, 80, 100, "linear-gradient(45deg, #00d2d3, #54a0ff)", 0.7], // West gate
    
    // Big walls around the room
   [0, -100, -2000, 0, 0, 0, 4000, 600, "darkgray", 1, "url('textures/wood.png')"], // North wall
    [0, -100, 2000, 0, 180, 0, 4000, 600, "darkgray", 1, "url('textures/wood.png')"], // South wall
    [-2000, -100, 0, 0, 90, 0, 4000, 600, "darkgray", 1, "url('textures/wood.png')"], // West wall
    [2000, -100, 0, 0, -90, 0, 4000, 600, "darkgray", 1, "url('textures/wood.png')"], // East wall
    
    // Ceiling wall facing the ground (matches other walls)
    [0, -400, 0, 90, 0, 0, 4000, 4000, "darkgray", 1, "url('textures/wood.png')"], // Ceiling wall facing down
    
    // STAIRCASE 1 - FROM NORTH CORNER TO SAFE ZONE (Broken concrete texture)
    [0, 80, -800, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 1 (start from far north)
    [0, 60, -700, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 2
    [0, 40, -600, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 3
    [0, 20, -500, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 4
    [0, 0, -400, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 5
    [0, -20, -300, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 6
    [0, -60, -250, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 7 (ends at safe zone - easier jump)
    
    // STAIRCASE 2 - FROM SOUTH CORNER TO SAFE ZONE (Broken concrete texture)
    [0, 80, 800, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 1 (start from far south)
    [0, 60, 700, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 2
    [0, 40, 600, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 3
    [0, 20, 500, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 4
    [0, 0, 400, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 5
    [0, -20, 300, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 6
    [0, -60, 250, 90, 0, 0, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 7 (ends at safe zone - easier jump)
    
    // STAIRCASE 3 - FROM EAST CORNER TO SAFE ZONE (Broken concrete texture)
    [800, 80, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 1 (start from far east)
    [700, 60, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 2
    [600, 40, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 3
    [500, 20, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 4
    [400, 0, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 5
    [300, -20, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 6
    [250, -60, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 7 (ends at safe zone - easier jump)
    
    // STAIRCASE 4 - FROM WEST CORNER TO SAFE ZONE (Broken concrete texture)
    [-800, 80, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 1 (start from far west)
    [-700, 60, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 2
    [-600, 40, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 3
    [-500, 20, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 4
    [-400, 0, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 5
    [-300, -20, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 6
    [-250, -60, 0, 90, 0, 90, 150, 50, "gray", 1, "url('textures/brokenconcrete.jpg')"], // Step 7 (ends at safe zone - easier jump)
    
    // Additional corner platforms for extra parkour
    [1200, 50, -1200, 0, 0, 0, 200, 100 ,"gray", 1 , "url('textures/brick.jpg')"],
    [-1200, 50, -1200, 0, 0, 0, 200, 100, "gray", 1 , "url('textures/brick.jpg')"],
    [1200, 50, 1200, 0, 0, 0, 200, 100, "gray", 1 , "url('textures/brick.jpg')"],
    [-1200, 50, 1200, 0, 0, 0, 200, 100, "gray", 1 , "url('textures/brick.jpg')"],
];

drawMyWorld(myRoom, "wall")

// Draw single zombie
let zombieDiv = document.createElement("div");
zombieDiv.id = "zombie";
zombieDiv.innerHTML = "🧟‍♂️";
zombieDiv.style.position = "absolute";
zombieDiv.style.fontSize = "60px";
zombieDiv.style.zIndex = "1000";
zombieDiv.style.transform = `translate3d(${600 + myZombie[0] - 30}px, ${400 + myZombie[1] - 60}px, ${myZombie[2]}px)`;
world.appendChild(zombieDiv);

// Draw game UI
let gameUI = document.createElement("div");
gameUI.id = "gameUI";
gameUI.innerHTML = `
    <div id="scoreDisplay">Score: ${score}</div>
    <div id="healthDisplay">Health: ${health}</div>
    <div id="ammoDisplay">Ammo: ${ammo}</div>
    <div id="reloadDisplay" style="display: none;">RELOADING...</div>
`;
gameUI.style.position = "fixed";
gameUI.style.top = "20px";
gameUI.style.left = "20px";
gameUI.style.color = "white";
gameUI.style.fontSize = "20px";
gameUI.style.fontWeight = "bold";
gameUI.style.backgroundColor = "rgba(0,0,0,0.8)";
gameUI.style.padding = "15px";
gameUI.style.borderRadius = "10px";
gameUI.style.zIndex = "2000";
gameUI.style.border = "2px solid #ff4757";
document.body.appendChild(gameUI);

// Add scary atmosphere overlay
let atmosphereDiv = document.createElement("div");
atmosphereDiv.id = "atmosphere";
atmosphereDiv.style.position = "fixed";
atmosphereDiv.style.top = "0";
atmosphereDiv.style.left = "0";
atmosphereDiv.style.width = "100%";
atmosphereDiv.style.height = "100%";
atmosphereDiv.style.backgroundColor = "rgba(0,0,0,0.3)";
atmosphereDiv.style.pointerEvents = "none";
atmosphereDiv.style.zIndex = "1500";
document.body.appendChild(atmosphereDiv);

// Add CSS animations
let style = document.createElement("style");
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

var pressForward = pressBack = pressRight = pressLeft = pressUp = 0;
var mouseX = mouseY = 0;
var mouseSensitivity = 1;
var dx = dy = dz = 0;
var gravity = 0.2;
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
    if (event.key == "r" || event.key == "R") {
        // Reload ammo
        if (!isReloading && ammo < 30) {
            reload();
        }
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
            // console.log("jump");
            dy = -pressUp;
            onGround = false;
        }
    }

    //   dx = -(pressLeft - pressRight) * Math.cos(pawn.ry * deg) + (pressForward - pressBack) * Math.sin(pawn.ry * deg);
    //let dz = pressForward - pressBack;
    // dz = -(pressLeft - pressRight) * Math.sin(pawn.ry * deg) - (pressForward - pressBack) * Math.cos(pawn.ry * deg);

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

    //shooting option with the mouse
    document.onclick = function () {
        if (lock && ammo > 0 && !isReloading) {
            myBullets.push(drawMyBullet(myBulletNumber));
            myBulletsData.push(new player(pawn.x, pawn.y, pawn.z, pawn.rx, pawn.ry, 0, 0, 0));
            myBulletNumber++;
            ammo--;
            updateUI();
            
            // Auto-reload when out of ammo
            if (ammo === 0) {
                setTimeout(() => reload(), 500);
            }
        } else if (lock && ammo === 0) {
            // Click sound when out of ammo
            console.log("Out of ammo! Press R to reload");
        }
    }

    // Update bullets
    updateBullets();
    
    // Update zombie
    updateZombie();
    
    // Update scary atmosphere
    updateAtmosphere();

    // for (let i = 0; i < myBullets.length; i++) {
    //     myBullets[i].style.transform = `translateZ(600px) rotateX(${-myBulletsData[i].rx}deg) rotateY(${myBulletsData[i].ry}deg) translate3d(${-myBulletsData[i].x}px, ${-myBulletsData[i].y}px, ${-myBulletsData[i].z}px)`;
    // }

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
            // Check if it's a gradient or solid color
            if (squares[i][8].includes("gradient")) {
                mySquare1.style.background = squares[i][8];
            } else {
                mySquare1.style.backgroundColor = squares[i][8];
            }
        }
        
        // Add cool visual effects for cubes (not walls/floor)
        if (name === "wall" && i >= 6) { // Cubes start from index 6
            mySquare1.style.border = "3px solid rgba(255,255,255,0.3)";
            mySquare1.style.boxShadow = "0 0 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.1)";
            mySquare1.style.borderRadius = "8px";
            
            // Add a subtle glow effect
            if (i % 2 === 0) {
                mySquare1.style.boxShadow += ", 0 0 30px rgba(100,200,255,0.3)";
            } else {
                mySquare1.style.boxShadow += ", 0 0 30px rgba(255,100,150,0.3)";
            }
        }
        
        mySquare1.style.transform = `translate3d(${600 + squares[i][0] - squares[i][6] / 2}px, ${400 + squares[i][1] - squares[i][7] / 2}px, ${squares[i][2]}px) rotateX(${squares[i][3]}deg) rotateY(${squares[i][4]}deg) rotateZ(${squares[i][5]}deg)`;
        mySquare1.style.opacity = squares[i][9];
        world.appendChild(mySquare1);
    }
}

function collision(mapObj, leadObj) {
    onGround = false;
    for (let i = 0; i < mapObj.length; i++) {
        //spēlētāja koordinātes katra taiststūra koordināšu sistēmā
        let x0 = (leadObj.x - mapObj[i][0]);
        let y0 = (leadObj.y - mapObj[i][1]);
        let z0 = (leadObj.z - mapObj[i][2]);

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
                // console.log("collision!");
                point1[2] = Math.sign(point0[2]) * 50;
                let point2 = coorReTransform(point1[0], point1[1], point1[2], mapObj[i][3], mapObj[i][4], mapObj[i][5]);
                let point3 = coorReTransform(point1[0], point1[1], 0, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
                dx = point2[0] - x0;
                dy = point2[1] - y0;
                dz = point2[2] - z0;

                if (Math.abs(normal[1]) > 0.8) {
                    if (point3[1] > point2[1]) {
                        onGround = true;
                        // console.log("OnGround!");
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

//functions related to shooting - START

function updateBullets() {
    for (let i = myBullets.length - 1; i >= 0; i--) {
        if (myBullets[i] && myBulletsData[i]) {
            let bullet = myBulletsData[i];
            
            // Move bullet forward
            bullet.x += Math.sin(bullet.ry * DEG) * bulletSpeed;
            bullet.z -= Math.cos(bullet.ry * DEG) * bulletSpeed;
            bullet.y += Math.tan(bullet.rx * DEG) * bulletSpeed * 0.3;
            
            // Update bullet position
            myBullets[i].style.transform = `translate3d(${600 + bullet.x - 25}px, ${400 + bullet.y - 25}px, ${bullet.z}px)`;
            
            // Check collision with zombie
            if (myZombie[5] > 0) { // If zombie is alive
                let dx = bullet.x - myZombie[0];
                let dz = bullet.z - myZombie[2];
                let distance = Math.sqrt(dx*dx + dz*dz);
                
                if (distance < 80) {
                    // Zombie hit! Damage zombie
                    myZombie[5] -= 25; // Reduce health
                    
                    if (myZombie[5] <= 0) {
                        // Zombie killed! Increase score and respawn
                        score += 15;
                        
                        // Respawn zombie after 3 seconds
                        setTimeout(() => {
                            myZombie[0] = Math.random() * 1500 - 750; // Random X position
                            myZombie[2] = Math.random() * 1500 - 750; // Random Z position
                            myZombie[5] = 100; // Reset health
                            
                            // Show zombie again
                            let zombieElement = document.getElementById("zombie");
                            if (zombieElement) {
                                zombieElement.style.display = "block";
                                zombieElement.innerHTML = "🧟‍♂️";
                            }
                        }, 3000);
                        
                        // Hide zombie temporarily
                        let zombieElement = document.getElementById("zombie");
                        if (zombieElement) {
                            zombieElement.style.display = "none";
                        }
                    }
                    
                    updateUI();
                    
                    // Remove bullet
                    myBullets[i].remove();
                    myBullets.splice(i, 1);
                    myBulletsData.splice(i, 1);
                    break;
                }
            }
            
            // Remove bullets that are too far
            if (myBullets[i] && (Math.abs(bullet.x) > 2000 || Math.abs(bullet.z) > 2000)) {
                myBullets[i].remove();
                myBullets.splice(i, 1);
                myBulletsData.splice(i, 1);
            }
        }
    }
}

function updateZombie() {
    if (myZombie[5] > 0) { // If zombie is alive
        // Make zombie follow player BUT NOT if player is in safe zone
        let dx = pawn.x - myZombie[0];
        let dz = pawn.z - myZombie[2];
        let distance = Math.sqrt(dx*dx + dz*dz);
        
        // Check if player is in safe zone (center area) - updated for lower platform
        let playerInSafeZone = (Math.abs(pawn.x) < 200 && Math.abs(pawn.z) < 200 && pawn.y < -50);
        
        // Check if zombie is trying to enter safe zone
        let zombieNearSafeZone = (Math.abs(myZombie[0]) < 300 && Math.abs(myZombie[2]) < 300);
        
        if (distance > 100 && !playerInSafeZone && !zombieNearSafeZone) { 
            // Normal zombie movement - only on ground level
            if (myZombie[1] > -50) { // Keep zombie on ground level (can't climb stairs)
                let speed = 1.5 + (Math.random() * 0.5);
                myZombie[0] += (dx/distance) * speed;
                myZombie[2] += (dz/distance) * speed;
            }
        } else if (!playerInSafeZone && distance < 80 && myZombie[1] > -50) {
            // Zombie attacks player only if not in safe zone and on ground level
            health -= 0.5;
            if (health <= 0) {
                gameOver();
            }
            updateUI();
        } else if (playerInSafeZone) {
            // Player is safe! Zombie wanders around the base of the stairs
            let wanderSpeed = 0.5;
            myZombie[0] += (Math.random() - 0.5) * wanderSpeed * 4;
            myZombie[2] += (Math.random() - 0.5) * wanderSpeed * 4;
            
            // Keep zombie away from safe zone center
            if (Math.abs(myZombie[0]) < 400) {
                myZombie[0] += myZombie[0] > 0 ? 50 : -50;
            }
            if (Math.abs(myZombie[2]) < 400) {
                myZombie[2] += myZombie[2] > 0 ? 50 : -50;
            }
        }
        
        // Keep zombie on ground level (can't climb)
        myZombie[1] = Math.max(0, myZombie[1]);
        
        // Update zombie visual position
        let zombieElement = document.getElementById("zombie");
        if (zombieElement) {
            zombieElement.style.transform = `translate3d(${600 + myZombie[0] - 30}px, ${400 + myZombie[1] - 60}px, ${myZombie[2]}px)`;
            
            // Change appearance based on health and if player is safe
            if (playerInSafeZone) {
                // Frustrated zombie when player is safe
                zombieElement.style.filter = "brightness(0.6) contrast(1.8) sepia(0.3)";
                zombieElement.innerHTML = "😡"; // Angry face when player is safe
            } else if (myZombie[5] < 50) {
                zombieElement.style.filter = "brightness(0.5) contrast(1.5)";
                zombieElement.innerHTML = "🧟‍♂️";
            } else {
                zombieElement.style.filter = "brightness(0.8)";
                zombieElement.innerHTML = "🧟‍♂️";
            }
        }
    }
}

function updateAtmosphere() {
    flickerTimer++;
    jumpScareTimer++;
    
    // Random light flicker effect
    if (flickerTimer > 200 && Math.random() < 0.02) {
        lightFlicker = true;
        document.getElementById("atmosphere").style.animation = "flicker 0.5s";
        flickerTimer = 0;
        
        setTimeout(() => {
            document.getElementById("atmosphere").style.animation = "";
            lightFlicker = false;
        }, 500);
    }
    
    // Random jump scare effect
    if (jumpScareTimer > 500 && Math.random() < 0.005) {
        let gameUI = document.getElementById("gameUI");
        gameUI.style.animation = "shake 0.3s";
        gameUI.style.border = "2px solid #ff0000";
        
        setTimeout(() => {
            gameUI.style.animation = "";
            gameUI.style.border = "2px solid #ff4757";
        }, 300);
        
        jumpScareTimer = 0;
    }
}

function updateUI() {
    document.getElementById("scoreDisplay").innerHTML = `Score: ${score}`;
    document.getElementById("healthDisplay").innerHTML = `Health: ${Math.max(0, Math.floor(health))}`;
    document.getElementById("ammoDisplay").innerHTML = `Ammo: ${ammo}`;
    
    // Change health color based on value
    let healthDisplay = document.getElementById("healthDisplay");
    if (health < 30) {
        healthDisplay.style.color = "#ff4757";
        healthDisplay.style.animation = "flicker 1s infinite";
    } else if (health < 60) {
        healthDisplay.style.color = "#ffa502";
        healthDisplay.style.animation = "";
    } else {
        healthDisplay.style.color = "#2ed573";
        healthDisplay.style.animation = "";
    }
}

function reload() {
    if (!isReloading) {
        isReloading = true;
        document.getElementById("reloadDisplay").style.display = "block";
        
        setTimeout(() => {
            ammo = 30;
            isReloading = false;
            document.getElementById("reloadDisplay").style.display = "none";
            updateUI();
        }, 2000); // 2 second reload time
    }
}

function gameOver() {
    clearInterval(game);
    
    let gameOverDiv = document.createElement("div");
    gameOverDiv.innerHTML = `
        <h1 style="color: #ff4757; font-size: 48px; text-align: center;">GAME OVER</h1>
        <p style="color: white; font-size: 24px; text-align: center;">Final Score: ${score}</p>
        <p style="color: white; font-size: 18px; text-align: center;">Press F5 to restart</p>
    `;
    gameOverDiv.style.position = "fixed";
    gameOverDiv.style.top = "50%";
    gameOverDiv.style.left = "50%";
    gameOverDiv.style.transform = "translate(-50%, -50%)";
    gameOverDiv.style.backgroundColor = "rgba(0,0,0,0.9)";
    gameOverDiv.style.padding = "40px";
    gameOverDiv.style.borderRadius = "20px";
    gameOverDiv.style.border = "3px solid #ff4757";
    gameOverDiv.style.zIndex = "3000";
    document.body.appendChild(gameOverDiv);
}

function drawMyBullet(num) {
    let myBullet = document.createElement("div");
    myBullet.id = `bullet_${num}`;
    myBullet.style.display = "block";
    myBullet.style.position = "absolute";
    myBullet.style.width = `10px`;
    myBullet.style.height = `10px`;
    myBullet.style.borderRadius = `50%`;
    myBullet.style.backgroundColor = `yellow`;
    myBullet.style.border = `2px solid red`;
    myBullet.style.zIndex = `1000`;
    myBullet.style.transform = `translate3d(${600+pawn.x-5}px, ${400+pawn.y-5}px, ${pawn.z}px)`;
    world.appendChild(myBullet);
    return myBullet;
}

