const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0,0,200, 200);

let myPlayGround = new Image();
myPlayGround.src = "img/ground.png";

let myFood= new Image();
myFood.src = "img/meat.png";

let box = 32;
let food_coords = {
    x:(Math.trunc(17*Math.random())+1)*box,
    y:(Math.trunc(15*Math.random())+3)*box,
    type: "meat"
}

function drawGame(){
    ctx.drawImage(myPlayGround, 0, 0);
    ctx.drawImage(myFood, food_coords.x, food_coords.y);
}

let myGame = setInterval(drawGame, 100);