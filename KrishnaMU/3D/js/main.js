const DEG = Math.PI / 180;
const container = document.getElementById("container");
const world = document.getElementById("world");
const scoreBoard = document.getElementById("scoreBoard");

/* ---------- SETTINGS ---------- */
const ARENA_LIMIT = 1000;
let mouseSensitivity = 0.15;

/* ---------- POINTER LOCK ---------- */
let lock = false;
document.addEventListener("pointerlockchange", () => lock = !lock);
container.onclick = () => !lock && container.requestPointerLock();

/* ---------- PLAYER BALL ---------- */
let ball = { x:0, y:30, z:0, ry:0, rx:0, speed:6, size:60 }; // y = radius
const ballEl = document.createElement("div");
ballEl.className = "ball";
world.appendChild(ballEl);

/* ---------- INPUT ---------- */
let pressForward=0, pressBack=0, pressLeft=0, pressRight=0;
let mouseX=0, mouseY=0;

document.addEventListener("keydown", e=>{
    let k = e.key.toLowerCase();
    if(k==="s") pressForward=.23;
    if(k==="w") pressBack=.23;
    if(k==="a") pressLeft=.15;
    if(k==="d") pressRight=.15;
});
document.addEventListener("keyup", e=>{
    let k = e.key.toLowerCase();
    if(k==="s") pressForward=0;
    if(k==="w") pressBack=0;
    if(k==="a") pressLeft=0;
    if(k==="d") pressRight=0;
});
document.addEventListener("mousemove", e=>{
    if(lock){ mouseX = e.movementX; mouseY = e.movementY; }
});

/* ---------- ARENA ---------- */
let arena = [
    [0,200,0,90,0,0,2000,2000,"url('textures/rock_boulder.jpg')"], 
    [0,-200,0,90,0,0,2000,2000,"url('textures/sky2.jpg')"],      
    [0,0,-1000,0,0,0,2000,400,"url('textures/wood.jpg')"],     
    [0,0,1000,0,0,0,2000,400,"url('textures/wood.jpg')"],      
    [-1000,0,0,0,90,0,2000,400,"url('textures/wood.jpg')"],   
    [1000,0,0,0,90,0,2000,400,"url('textures/wood.jpg')"]      
];

function drawArena(){
    for(let sq of arena){
        let div = document.createElement("div");
        div.className = "arena";
        div.style.width = sq[6]+"px";
        div.style.height = sq[7]+"px";
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

function spawnTargets(count=8){
    for(let i=0;i<count;i++){
        let t = document.createElement("div");
        t.className="target";
        let x = Math.random()*1600-800;
        let y = 0; // on floor
        let z = Math.random()*1600-800;
        targetsData.push({x,y,z,alive:true,element:t,score:10});
        t.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
        world.appendChild(t);
    }
}
spawnTargets();

/* ---------- BONUS TARGETS ---------- */
function spawnBonusTarget(){
    let t=document.createElement("div");
    t.className="bonus-target";
    let x = Math.random()*1600-800;
    let z = Math.random()*1600-800;
    let y = 0;
    targetsData.push({x,y,z,alive:true,element:t,score:50});
    t.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    world.appendChild(t);
    setTimeout(()=>{
        if(t.parentNode) t.remove();
        let idx = targetsData.findIndex(td=>td.element===t);
        if(idx!==-1) targetsData.splice(idx,1);
    },10000);
}
setInterval(spawnBonusTarget,20000);

/* ---------- GAME LOOP ---------- */
function update(){
    // Rotate camera
    ball.ry += mouseX*mouseSensitivity;
    ball.rx -= mouseY*mouseSensitivity;
    ball.rx = Math.max(-30, Math.min(60, ball.rx)); // limited angle
    mouseX=mouseY=0;

    // Move ball relative to its facing direction
let rad = ball.ry * DEG;
let forward = pressForward - pressBack; // forward = W, backward = S
let strafe = pressRight - pressLeft;
ball.x += Math.sin(rad) * forward * ball.speed + Math.cos(rad) * strafe * ball.speed;
ball.z += Math.cos(rad) * forward * ball.speed - Math.sin(rad) * strafe * ball.speed;
    ball.y = 0; // stay on floor

    // Keep inside arena
    ball.x = Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, ball.x));
    ball.z = Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, ball.z));

    // Check targets
    const HIT_THRESHOLD = 60;
    for(let t of targetsData){
        if(!t.alive) continue;
        let dx = t.x-ball.x;
        let dz = t.z-ball.z;
        let dist = Math.sqrt(dx*dx + dz*dz);
        if(dist<HIT_THRESHOLD){
            t.alive=false;
            t.element.remove();
            score += t.score;
            scoreBoard.innerText = "Score: "+score;
            // Ball grows
            ball.size += 5;
        }
    }

    // Update ball size and position
    ballEl.style.width = ballEl.style.height = ball.size+"px";
    ballEl.style.transform = `translate3d(${ball.x}px,${ball.y}px,${ball.z}px)`;

    // Camera: slightly above and behind ball (football view)
    let camY = ball.size/2 + 100; // camera height
    let camZ = 300; // camera behind
    world.style.transform = `
        perspective(800px)
        rotateX(${ball.rx}deg)
        rotateY(${-ball.ry}deg)
        translate3d(${-ball.x}px,${-(ball.y+camY)}px,${-(ball.z+camZ)}px)
    `;

    requestAnimationFrame(update);
}
update();