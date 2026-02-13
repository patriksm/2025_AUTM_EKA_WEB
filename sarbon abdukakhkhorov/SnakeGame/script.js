const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreBoard = document.getElementById("score-board");
const highScoreBoard = document.getElementById("high-score-board");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayMsg = document.getElementById("overlay-msg");
const startBtn = document.getElementById("start-btn");

const box = 32;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreBoard.innerText = `HIGH: ${highScore}`;

let snake = [];
let food = {};
let dir = "";
let gameInterval;
let gameSpeed = 120;

// Initialize Game
function init() {
    snake = [{ x: 9 * box, y: 10 * box }];
    food = spawnFood();
    dir = "";
    score = 0;
    gameSpeed = 120;
    scoreBoard.innerText = "SCORE: 0";
    overlay.classList.add("hidden");

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, gameSpeed);
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    };
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
    else if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
    else if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
    else if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
    // Support WASD too
    else if (e.key === "w" && dir !== "DOWN") dir = "UP";
    else if (e.key === "s" && dir !== "UP") dir = "DOWN";
    else if (e.key === "a" && dir !== "RIGHT") dir = "LEFT";
    else if (e.key === "d" && dir !== "LEFT") dir = "RIGHT";
});

function draw() {
    // Clear Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += box) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Draw UI Bar area
    ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
    ctx.fillRect(0, 0, canvas.width, box * 2.5);

    // Draw Snake
    for (let i = 0; i < snake.length; i++) {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? "#0ff" : "rgba(0, 255, 255, 0.7)";

        // Glow effect
        if (isHead) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#0ff";
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.fillRect(snake[i].x + 1, snake[i].y + 1, box - 2, box - 2);
        ctx.shadowBlur = 0;
    }

    // Draw Food
    ctx.fillStyle = "#ff0055";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff0055";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Move Snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (dir === "LEFT") snakeX -= box;
    if (dir === "UP") snakeY -= box;
    if (dir === "RIGHT") snakeX += box;
    if (dir === "DOWN") snakeY += box;

    // Eat Food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreBoard.innerText = `SCORE: ${score}`;
        food = spawnFood();
        // Increase speed
        if (gameSpeed > 50) {
            clearInterval(gameInterval);
            gameSpeed -= 2;
            gameInterval = setInterval(draw, gameSpeed);
        }
    } else {
        if (dir !== "") snake.pop();
    }

    // Head Position
    const newHead = { x: snakeX, y: snakeY };

    // Game Over Logic
    if (dir !== "") {
        if (snakeX < 0 || snakeX >= canvas.width || snakeY < box * 2.5 || snakeY >= canvas.height || collision(newHead, snake)) {
            gameOver();
            return;
        }
        snake.unshift(newHead);
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function gameOver() {
    clearInterval(gameInterval);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreBoard.innerText = `HIGH: ${highScore}`;
    }

    overlayTitle.innerText = "NEURAL LINK SEVERED";
    overlayMsg.innerText = `TOTAL CORES COLLECTED: ${score}`;
    startBtn.innerText = "Reconnect (Restart)";
    overlay.classList.remove("hidden");
}

startBtn.addEventListener("click", init);

// Initial draw to show the grid
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);