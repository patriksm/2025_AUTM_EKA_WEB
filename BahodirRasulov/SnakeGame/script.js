const canvas = document.getElementById("game"); 
const ctx = canvas.getContext("2d"); 

let myPlayground = new Image();
myPlayground.src = "img/ground.png"; 
let myCarrot = new Image();
myCarrot.src = "img/carrot.png";

let box = 32;
let food_coords = {
    x: (Math.trunc(17*Math.random())+1)*box,
    y: (Math.trunc(15*Math.random())+3)*box, 
    type: "carrot"
}

let snakeX = 0;
let snakeY = 0;
let dir = "";
let score = 0;

let snake = [];
snake[0] = {
    x: 9*box,
    y: 10*box
}

document.addEventListener("keypress", (event) =>{
    if(event.key == "w" && dir != "down") {
        dir = "up";
    }
    if(event.key == "s" && dir != "up") {
        dir = "down";
    }
    if(event.key == "a" && dir != "right") {
        dir = "left";
    }
    if(event.key == "d" && dir != "left") {
        dir = "right";
    }
})


function drawGame(){ 
    ctx.drawImage(myPlayground, 0, 0);
    ctx.drawImage(myCarrot, food_coords.x, food_coords.y);
    ctx.fillStyle = "white";
    ctx.font = "50px serif";
    ctx.fillText("Points: " + score, 1*box, 1.7*box);
    ctx.fillStyle = "#FFE607";
    for(let i = 0; i < snake.length; i++){
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    snakeX = snake[0].x;
    snakeY = snake[0].y;

    if(dir == "right") snakeX += box;
    if(dir == "up") snakeY -= box;
    if(dir == "left") snakeX -= box;
    if(dir == "down") snakeY += box;

    //if the food is eaten
    if(snakeX == food_coords.x && snakeY == food_coords.y){
        food_coords = {
            x: (Math.trunc(17*Math.random())+1)*box,
            y: (Math.trunc(15*Math.random())+3)*box, 
            type: "carrot"
        }
        score++;
    } else {
        snake.pop();
    }

    if(snakeX < 0 || snakeX > 18*box){
        clearInterval(myGame);
    }



    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);

}

let myGame = setInterval(drawGame, 100) 