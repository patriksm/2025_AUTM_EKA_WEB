const DEG = Math.PI / 180;
var world = document.getElementById("world");
var container = document.getElementById("container");

//
var lock = false;
document.addEventListener("pointerlockchange", (event) => {
  lock = !lock;
});
container.onclick = function () {
  if (!lock) container.requestPointerLock();
};
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

let myRoom = [
  [0, 100, 0, 90, 0, 0, 2000, 2000, "brown", 1, "url('textures/floor_01.jpg')"],
  [0, 70, 0, 90, 0, 0, 200, 200, "yellow", 1, "url('textures/sandy_wall.jpg')"],
  [
    0,
    -100,
    -1000,
    0,
    0,
    0,
    2000,
    400,
    "brown",
    1,
    "url('textures/sandy_wall.jpg')",
  ],
  [
    0,
    87.5,
    -100,
    0,
    0,
    0,
    200,
    35,
    "yellow",
    1,
    "url('textures/sandy_wall.jpg')",
  ],
  [
    0,
    87.5,
    100,
    0,
    0,
    0,
    200,
    35,
    "yellow",
    1,
    "url('textures/sandy_wall.jpg')",
  ],
  [
    100,
    87.5,
    0,
    0,
    90,
    0,
    200,
    35,
    "yellow",
    1,
    "url('textures/sandy_wall.jpg')",
  ],
  [
    -100,
    87.5,
    0,
    0,
    90,
    0,
    200,
    35,
    "yellow",
    1,
    "url('textures/sandy_wall.jpg')",
  ],
];

drawMyWorld(myRoom, "wall");

var pressForward = (pressBack = pressRight = pressLeft = pressUp = 0);
var mouseX = (mouseY = 0);
var mouseSensitivity = 1;
var dx = (dy = dz = 0);
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
});
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
});
document.addEventListener("mousemove", (event) => {
  mouseX = event.movementX;
  mouseY = event.movementY;
});

function update() {
  dz =
    +(pressRight - pressLeft) * Math.sin(pawn.ry * DEG) -
    (pressForward - pressBack) * Math.cos(pawn.ry * DEG);
  dx =
    +(pressRight - pressLeft) * Math.cos(pawn.ry * DEG) +
    (pressForward - pressBack) * Math.sin(pawn.ry * DEG);
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

  document.onclick = function () {
    if (lock) {
      myBullets.push(drawMyBullet(myBulletNumber));
      myBulletsData.push(
        new player(pawn.x, pawn.y, pawn.z, pawn.rx, pawn.ry, 5, 5, 5)
      );
      myBulletNumber++;
    }
  };

  for (let i = 0; i < myBullets.length; i++) {
    dzb =
      +myBulletsData[i].vx * Math.sin((myBulletsData[i].ry - 45) * DEG) -
      myBulletsData[i].vz * Math.cos((myBulletsData[i].ry - 45) * DEG);
    dxb =
      +myBulletsData[i].vx * Math.cos((myBulletsData[i].ry - 45) * DEG) +
      myBulletsData[i].vz * Math.sin((myBulletsData[i].ry - 45) * DEG);

    myBulletsData[i].x += dxb;
    myBulletsData[i].z += dzb;

    myBullets[i].style.transform = `translate3d(${
      600 + myBulletsData[i].x - 25
    }px, ${400 + myBulletsData[i].y - 25}px, ${myBulletsData[i].z}px) rotateX(${
      myBulletsData[i].rx
    }deg) rotateY(${-myBulletsData[i].ry}deg)`;
  }

  world.style.transform = `translateZ(600px) rotateX(${-pawn.rx}deg) rotateY(${
    pawn.ry
  }deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;
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
    mySquare1.style.transform = `translate3d(${
      600 + squares[i][0] - squares[i][6] / 2
    }px, ${400 + squares[i][1] - squares[i][7] / 2}px, ${
      squares[i][2]
    }px) rotateX(${squares[i][3]}deg) rotateY(${squares[i][4]}deg) rotateZ(${
      squares[i][5]
    }deg)`;
    mySquare1.style.opacity = squares[i][9];
    world.appendChild(mySquare1);
  }
}

function collision(mapObj, leadObj) {
  onGround = false;
  for (let i = 0; i < mapObj.length; i++) {
    let x0 = leadObj.x - mapObj[i][0];
    let y0 = leadObj.y - mapObj[i][1];
    let z0 = leadObj.z - mapObj[i][2];

    if (
      x0 ** 2 + y0 ** 2 + z0 ** 2 + dx ** 2 + dy ** 2 + dz ** 2 <
      mapObj[i][6] ** 2 + mapObj[i][7] ** 2
    ) {
      let x1 = x0 + dx;
      let y1 = y0 + dy;
      let z1 = z0 + dz;

      let point0 = coorTransform(
        x0,
        y0,
        z0,
        mapObj[i][3],
        mapObj[i][4],
        mapObj[i][5]
      );
      let point1 = coorTransform(
        x1,
        y1,
        z1,
        mapObj[i][3],
        mapObj[i][4],
        mapObj[i][5]
      );
      let normal = coorReTransform(
        0,
        0,
        1,
        mapObj[i][3],
        mapObj[i][4],
        mapObj[i][5]
      );

      if (
        Math.abs(point1[0]) < (mapObj[i][6] + 70) / 2 &&
        Math.abs(point1[1]) < (mapObj[i][7] + 70) / 2 &&
        Math.abs(point1[2]) < 50
      ) {
        point1[2] = Math.sign(point0[2]) * 50;
        let point2 = coorReTransform(
          point1[0],
          point1[1],
          point1[2],
          mapObj[i][3],
          mapObj[i][4],
          mapObj[i][5]
        );
        let point3 = coorReTransform(
          point1[0],
          point1[1],
          0,
          mapObj[i][3],
          mapObj[i][4],
          mapObj[i][5]
        );
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

function drawMyBullet(num) {
  let myBullet = document.createElement("div");
  myBullet.id = `bullet_${num}`;
  myBullet.style.display = "block";
  myBullet.style.position = "absolute";
  myBullet.style.width = `50px`;
  myBullet.style.height = `50px`;
  myBullet.style.borderRadius = `50%`;
  myBullet.style.backgroundColor = `red`;
  myBullet.style.transform = `translate3d(${600 + pawn.x - 25}px, ${
    400 + pawn.y - 25
  }px, ${pawn.z}px) rotateX(${pawn.rx}deg) rotateY(${-pawn.ry}deg)`;
  world.appendChild(myBullet);
  return myBullet;
}
