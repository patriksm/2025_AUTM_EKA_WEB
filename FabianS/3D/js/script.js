

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// https://polyhaven.com/
// https://www.fr.de/panorama/geschichte-vom-louvre-passwort-bis-zu-den-atom-codes-die-schlimmsten-security-fails-der-94028611.html
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const DEG = Math.PI / 180;

let dzb
let dxb
let container = document.getElementById("container")
var world = document.getElementById("world");
let points_anzeige = document.getElementById("points")
let height_anzeige = document.getElementById("height")
let x_anzeige = document.getElementById("x")
let y_anzeige = document.getElementById("y")
let dx_anzeige = document.getElementById("dx")
let dz_anzeige = document.getElementById("dz")

let counter_points = 0

let lastHitId = null;


let drx = 0;
let dry = 0
let drz = 0;
let dx = 0;
let dy = 0;
let dz = 0



let jump
jump = true


let mySquares = []
let mouseX = 0
let mouseY = 0;

let transportBox = []
let transportBoxData = []
let id_transportbox = "transport_box_1"

let onGround = false;

let pressForward = 0
let pawn


let pressBack = 0
let pressRight = 0
let pressLeft = 0;
let pressUp = 0

let lock = false

let my_items = []
let myItemsData = []
let myItemsCounter = 0


let my_shooting_bullets = []
let myBulletData = []
let myBulletsShooting = 0




function player(
    x,
    y,
    z,
    rx,
    ry,
    vx,
    vy,
    vz
) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.onGround = false
}

document.onclick = function () {
    if (lock) {
        let newBullet = drawMyBullet(myBulletsShooting++)
        my_shooting_bullets.push(newBullet)


        myBulletData.push(
            new player(
                pawn.x,
                pawn.y,
                pawn.z,
                pawn.rx,
                pawn.ry,
                bulletSpeed,
                bulletSpeed,
                bulletSpeed
            )
        )


    }

}

function update() {

    updateBullets()

    updateItems(0.01)

    // update_transportbox()
    checkPawnItemHits()
    checkHits()

    checkTransport()
    dz = +(pressRight - pressLeft) * Math.sin(pawn.ry * DEG) - (pressForward - pressBack) * Math.cos(pawn.ry * DEG)
    dx = +(pressRight - pressLeft) * Math.cos(pawn.ry * DEG) + (pressForward - pressBack) * Math.sin(pawn.ry * DEG)
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

    collision(
        window.myRoom,
        pawn
    )

    mouseX = 0
    mouseY = 0;

    pawn.z += dz;
    pawn.x += dx;
    pawn.y += dy



    if (lock) {
        pawn.rx += drx;

        if (pawn.rx > 57) {
            pawn.rx = 57;
        } else if (pawn.rx < -57) {
            pawn.rx = -57;
        }
        pawn.ry += dry;
    }

    world.style.transform = `
        translateZ(600px) 
        rotateX(${-pawn.rx}deg) 
        rotateY(${pawn.ry}deg) 
        translate3d(
            ${-pawn.x}px, 
            ${-pawn.y}px
            ,${-pawn.z}px
        )
    `;

}



let game = setInterval(
    update,
    10
);




pawn = new player(
    0,
    0,
    0,
    0,
    -90,
    player_speed,
    player_speed,
    player_speed
);



document.addEventListener("pointerlockchange", (event) => {
    lock = !lock;
})
container.onclick = function () {
    if (!lock) {
        container.requestPointerLock();
    }
}







// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// movement
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

document.addEventListener("keydown", (event) => {
    if (event.key == "w" || event.key == "ArrowUp") {
        pressForward = pawn.vz;
    }
    if (event.key == "s" || event.key == "ArrowDown") {
        pressBack = pawn.vz;
    }
    if (event.key == "d" || event.key == "ArrowRight") {
        pressRight = pawn.vx;
    }
    if (event.key == "a" || event.key == "ArrowLeft") {
        pressLeft = pawn.vx;
    }
    if (event.key == " ") {
        pressUp = pawn.vy;
    }

})

document.addEventListener("keyup", (event) => {
    if (event.key == "w" || event.key == "ArrowUp") {
        pressForward = 0;
    }
    if (event.key == "s" || event.key == "ArrowDown") {
        pressBack = 0;
    }
    if (event.key == "d" || event.key == "ArrowRight") {
        pressRight = 0;
    }
    if (event.key == "a" || event.key == "ArrowLeft") {
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


function update_points(num) {
    points_anzeige.textContent = `Points: ${num} / ${myItemsCounter}`
}
function getAllItemsRemoved() {
    return myItemsCounter == counter_points
}

function add_items() {

    spawnItem({
        x: 0,
        y: 30,
        z: -900,
        size: 100,
        rx: 0,
        ry: 90,
        rz: 0
    });


    spawnItem({
        x: 300,
        y: 30,
        z: -700,
        size: 100,
        rx: 0,
        ry: 90,
        rz: 0
    });
    spawnItem({
        x: -300,
        y: -140,
        z: -700,
        size: 100,
        rx: 0,
        ry: 90,
        rz: 0
    });
    spawnItem({
        x: -300,
        y: -200,
        z: 900,
        size: 100,
        rx: 0,
        ry: 90,
        rz: 0
    });
    spawnItem({
        x: 700,
        y: 30,
        z: 900,
        size: 100,
        rx: 0,
        ry: 0,
        rz: 90
    });

    update_points(counter_points)
}





var panemsanasSkana = new Audio;
panemsanasSkana.src = "./audio/thing.mp3";

var soluSkana = new Audio;
soluSkana.src = "./audio/walking.mp3";

var kludasSkana = new Audio;
kludasSkana.src = "./audio/mistake.mp3"

var teleportaSkana = new Audio;
teleportaSkana.src = "./audio/win.mp3"

add_items()
