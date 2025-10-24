const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.fillRect(0, 0, 200, 200)

let myPlayGround = new Image();
myPlayGround.src = "ground.png";

let myFood = new Image();
myFood.src = "trophy.png";

let box = 32;
let food_coords = {
    x:(Math.floor(Math.random()*17+1))*box,
    y:(Math.floor(Math.random()*15+3))*box,
    type: "cup"
}

function drawGame() {
    ctx.drawImage(myPlayGround, 0, 0);
    ctx.drawImage(myFood, food_coords.x, food_coords.y);
}

let myGame = setInterval(drawGame, 100);
