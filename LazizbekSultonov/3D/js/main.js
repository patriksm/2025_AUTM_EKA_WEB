var points = 0;
var bulletCount = 0;
var pawn = new Player(0, 0, 0, 0, 0, 0);
var bullets = [];
var bulletData = [];
var timerGame;

function startGame() {
    canlock = true;
    world.innerHTML = "";
    activeObjects = structuredClone(gameLevels[level][1]);
    createWorld(gameLevels[level][0]);
    drawActiveObjects(activeObjects, `objekts`);
    drawActiveObjects(gameLevels[level][2], `teleports`);
    timerGame = setInterval(update, 10);
}

// Auto-start
window.onload = function () {
    startGame();
};


function update() {
    dx = -(pressLeft - pressRight) * Math.cos(pawn.ry * deg) + (pressForward - pressBack) * Math.sin(pawn.ry * deg);
    dz = -(pressLeft - pressRight) * Math.sin(pawn.ry * deg) - (pressForward - pressBack) * Math.cos(pawn.ry * deg);
    dy += g;

    if (onGround) {
        dy = 0;
        if (pressUp) {
            dy = -pressUp;
            onGround = false;
        }
    }

    let drx = -mouseY / 4;
    let dry = mouseX / 4;

    mouseX = mouseY = 0;

    collision(gameLevels[level][0], pawn);

    pawn.x += dx;
    pawn.y += dy;
    pawn.z += dz;

    if (canlock) {
        pawn.rx += drx;
        pawn.ry += dry;
        if (pawn.rx > 57) pawn.rx = 57;
        if (pawn.rx < -57) pawn.rx = -57;
    }

    if (document.pointerLockElement === container || document.mozPointerLockElement === container) {
        // pointer lock active
    }

    container.onclick = function () {
        if (canlock) {
            container.requestPointerLock();
            bullets.push(createBulletElement(bulletCount));
            bulletData.push(new Player(pawn.x, pawn.y, pawn.z, pawn.rx, pawn.ry + 45, pawn.rz, 5, 5));
            bulletCount++;
            let shootSound = new Audio("audio/shooting.mp3");
            shootSound.play();
        }
    }

    for (let sk = 0; sk < bullets.length; sk++) {
        let ldx = -bulletData[sk].vx * Math.cos(bulletData[sk].ry * deg) + (bulletData[sk].vy) * Math.sin(bulletData[sk].ry * deg);
        let ldz = -(bulletData[sk].vx) * Math.sin(bulletData[sk].ry * deg) - (bulletData[sk].vy) * Math.cos(bulletData[sk].ry * deg);

        bulletData[sk].x += ldx;
        bulletData[sk].z += ldz;

        bullets[sk].style.transform = `translate3d(${bulletData[sk].x - 10}px, ${bulletData[sk].y - 10}px, ${bulletData[sk].z}px) rotateX(${bulletData[sk].rx}deg) rotateY(${bulletData[sk].ry}deg) rotateZ(${0}deg)`;

        interactBullet(activeObjects, bulletData[sk], bullets[sk], sk);

        bulletData[sk].timer--;
        if (bulletData[sk].timer < 0) {
            if (bullets[sk]) bullets[sk].remove();
            bullets.splice(sk, 1);
            bulletData.splice(sk, 1);
            sk--;
        }
    }

    world.style.transform = `translateZ(600px) rotateX(${pawn.rx}deg) rotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;

    rotateObjects(activeObjects, 0.5);
    interact(activeObjects);
    interactTeleport(gameLevels[level][2], activeObjects);
}
