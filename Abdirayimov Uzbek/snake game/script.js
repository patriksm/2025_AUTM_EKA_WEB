const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let box = 32;

// Fallback background color (instead of image)
function drawBackground() {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Optional images (won’t break if missing)
let myPlayground = new Image();
myPlayground.src = "img/ground.png";

let myCarrot = new Image();
myCarrot.src = "img/carrot.png";

// Food coordinates
let food_coords = {
    x: (Math.floor(17 * Math.random()) + 1) * box,
    y: (Math.floor(15 * Math.random()) + 3) * box
};

let dir = "right"; // start direction
let score = 0;

// Snake starts with one segment
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// Change direction with arrow keys or WASD
document.addEventListener("keydown", (event) => {
    if ((event.key === "ArrowUp" || event.key === "w") && dir !== "down") dir = "up";
    if ((event.key === "ArrowDown" || event.key === "s") && dir !== "up") dir = "down";
    if ((event.key === "ArrowLeft" || event.key === "a") && dir !== "right") dir = "left";
    if ((event.key === "ArrowRight" || event.key === "d") && dir !== "left") dir = "right";
});

function drawGame() {
    // Draw background
    if (myPlayground.complete && myPlayground.naturalHeight !== 0) {
        ctx.drawImage(myPlayground, 0, 0);
    } else {
        drawBackground();
    }

    // Draw food
    if (myCarrot.complete && myCarrot.naturalHeight !== 0) {
        ctx.drawImage(myCarrot, food_coords.x, food_coords.y);
    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(food_coords.x, food_coords.y, box, box);
    }

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, box, 1.5 * box);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#FFD700" : "#00FF7F";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Current head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Movement
    if (dir === "right") snakeX += box;
    if (dir === "left") snakeX -= box;
    if (dir === "up") snakeY -= box;
    if (dir === "down") snakeY += box;

    // Eat food
    if (snakeX === food_coords.x && snakeY === food_coords.y) {
        score++;
        food_coords = {
            x: (Math.floor(17 * Math.random()) + 1) * box,
            y: (Math.floor(15 * Math.random()) + 3) * box
        };
    } else {
        snake.pop();
    }

    // Game over if snake hits wall
    if (
        snakeX < 0 ||
        snakeY < 3 * box ||
        snakeX >= 19 * box ||
        snakeY >= 18 * box
    ) {
        clearInterval(myGame);
        alert("Game Over! Your score: " + score);
    }

    // New head
    let newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);
}

// Run game every 100 ms
let myGame = setInterval(drawGame, 200);
