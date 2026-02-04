const canvas = document.getElementById("game"); 
const ctx = canvas.getContext("2d"); 

let box = 32;
let score = 0;
let speed = 150;
let gameRunning = true;
let currentDirection = "RIGHT";

let snakeBody = [];
snakeBody[0] = {
    x: 9*box,
    y: 10*box
}

// Simple walls
let walls = [
    {x: 8*box, y: 8*box},
    {x: 9*box, y: 8*box},
    {x: 10*box, y: 8*box}
]

function controls(e) {
    let key = e.key;
    
    if(key == "ArrowUp" && currentDirection != "DOWN") {
        currentDirection = "UP";
    }
    else if(key == "ArrowDown" && currentDirection != "UP") {
        currentDirection = "DOWN";
    }
    else if(key == "ArrowLeft" && currentDirection != "RIGHT") {
        currentDirection = "LEFT";
    }
    else if(key == "ArrowRight" && currentDirection != "LEFT") {
        currentDirection = "RIGHT";
    }
}

document.addEventListener("keydown", controls);

function checkCollision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        }
    } while(checkCollision(newFood, walls) || checkCollision(newFood, snakeBody));
    return newFood;
}

let food = generateFood();

function draw() {
    if(!gameRunning) return;
    
    // Clear canvas
    ctx.fillStyle = "#2d5a27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw walls
    ctx.fillStyle = "#8B4513";
    for(let i = 0; i < walls.length; i++) {
        ctx.fillRect(walls[i].x, walls[i].y, box, box);
    }
    
    // Draw snake
    for(let i = 0; i < snakeBody.length; i++) {
        if(i == 0) {
            ctx.fillStyle = "#FF0000"; // Head
        } else {
            ctx.fillStyle = "#FF6347"; // Body
        }
        ctx.fillRect(snakeBody[i].x, snakeBody[i].y, box, box);
    }
    
    // Draw food
    ctx.fillStyle = "#FF1493";
    ctx.fillRect(food.x, food.y, box, box);
    
    // Draw score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    
    // Move snake
    let snakeX = snakeBody[0].x;
    let snakeY = snakeBody[0].y;
    
    if(currentDirection == "LEFT") snakeX -= box;
    if(currentDirection == "UP") snakeY -= box;
    if(currentDirection == "RIGHT") snakeX += box;
    if(currentDirection == "DOWN") snakeY += box;
    
    // Check food collision
    if(snakeX == food.x && snakeY == food.y) {
        score++;
        food = generateFood();
    } else {
        snakeBody.pop();
    }
    
    let newHead = {
        x: snakeX,
        y: snakeY
    }
    
    // Check game over
    if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || 
       checkCollision(newHead, snakeBody) || checkCollision(newHead, walls)) {
        gameRunning = false;
        clearInterval(game);
        
        // Simple game over
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER!", 150, 250);
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 250, 300);
        ctx.fillText("Press F5 to restart", 200, 350);
    }
    
    snakeBody.unshift(newHead);
}

let game = setInterval(draw, speed);