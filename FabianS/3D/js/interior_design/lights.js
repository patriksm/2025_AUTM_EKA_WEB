
function item_data(
    x,
    y,
    z,
    rx,
    ry,
    rz,
    vx,
    vy,
    vz
) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.onGround = false
}


var structures = [
        "",
        "url('textures/floor_01.jpg')",
        "url('textures/sandy_wall.jpg')",
        "url('textures/stone_wall.jpg')",
        "url('textures/wood_ceiling.jpg')",
        "url('textures/TemakiRailing.png')",
        "url('textures/ieks_siena_4.jpg')",
        "url('textures/grass.jpg')",
        "url('textures/himmellandschaft.jpg')",
        "url('textures/1_copy.jpg')",
        "url('textures/oldtown.jpg')",
        "url('textures/1_copy_2.jpg')",
        "url('textures/1_gezogen.jpg')",
        "url('textures/mauer.jpg')",
        "url('textures/mauer_05.jpg')",
        "url('textures/wood_ceiling.jpg')",
        "url('textures/zielscheibe.png')",
        "url('textures/ziel_02.jpg')",
        "url('textures/cookies.png')",
    ]
var lights = [
    "#87CEEB",
    "#0FFF50",
]

var signal_light = "#0FFF50"
// var surface_structure_light = structures[11]
var surface_light = structures[11]
var surface_structure_light = structures[12]

var floor = structures[3]


var steps_hold = structures[3]
var railing = structures[15]

var surface_items = structures[18]

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Declare Variables for Movement
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
let mouseSensitivity = 0.3
let gravity = 0.2
let gravity_bullet = 0.0
let player_speed = 5
let bulletSpeed = 13;
let move = 0.01;
let lastTime = performance.now();
