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
}

var pawn = new player(0, 0, 0, 0, 0, 7, 7, 7);

let myRoom = [
  [0, 100, 0, 90, 0, 0, 2000, 2000, "brown", 1, "url('textures/floor_01.jpg')"],
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
];

drawMyWorld(myRoom, "wall");

var pressForward = (pressBack = pressRight = pressLeft = 0);
var mouseX = (mouseY = 0);
var mouseSensitivity = 1;

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
});
document.addEventListener("mousemove", (event) => {
  mouseX = event.movementX;
  mouseY = event.movementY;
});

function update() {
  let dz =
    +(pressRight - pressLeft) * Math.sin(pawn.ry * DEG) -
    (pressForward - pressBack) * Math.cos(pawn.ry * DEG);
  let dx =
    +(pressRight - pressLeft) * Math.cos(pawn.ry * DEG) +
    (pressForward - pressBack) * Math.sin(pawn.ry * DEG);

  //   dx = -(pressLeft - pressRight) * Math.cos(pawn.ry * deg) + (pressForward - pressBack) * Math.sin(pawn.ry * deg);
  //let dz = pressForward - pressBack;
  // dz = -(pressLeft - pressRight) * Math.sin(pawn.ry * deg) - (pressForward - pressBack) * Math.cos(pawn.ry * deg);

  let drx = mouseY * mouseSensitivity;
  let dry = mouseX * mouseSensitivity;

  mouseX = mouseY = 0;

  pawn.z += dz;
  pawn.x += dx;

  if (lock) {
    pawn.rx += drx;
    pawn.ry += dry;
  }

  world.style.transform = `translateZ(600px) rotateX(${-pawn.rx}deg) rotateY(${
    pawn.ry
  }deg) translate3d(${-pawn.x}px, ${pawn.y}px, ${-pawn.z}px)`;
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
