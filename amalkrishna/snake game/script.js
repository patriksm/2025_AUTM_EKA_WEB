const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ---------- IMAGES ---------- */
const playgroundImage = new Image();
playgroundImage.src = "img/ground.png"; // your playground image

const normalFruits = [
    "img/carrot.png",
    "img/apple.png",
    "img/banana.png",
    "img/grape.png",
    "img/pineapple.png"
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

const bonusImage = new Image();
bonusImage.src = "img/bonus.png";

/* ---------- CONSTANTS ---------- */
const box = 32;
const CANVAS_SIZE = 608;
const BONUS_EVERY = 3; // bonus appears every 3 fruits

/* ---------- SPEED ---------- */
const START_SPEED = 200;
const SPEED_STEP = 8;
const MIN_SPEED = 80;
let speed = START_SPEED;
let gameInterval = null;

/* ---------- GAME STATE ---------- */
let dir = "";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let fruitsEaten = 0;

/* ---------- SNAKE ---------- */
let snake = [{ x: 9 * box, y: 10 * box }];

/* ---------- FOOD ---------- */
let food = null;

/* ---------- CREATE FOOD ---------- */
function createFood() {
    let type;
    if ((fruitsEaten + 1) % BONUS_EVERY === 0) {
        type = "bonus";
    } else {
        type = "normal";
    }
    return {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box,
        type,
        img: type === "bonus" ? bonusImage : normalFruits[Math.floor(Math.random() * normalFruits.length)]
    };
}

/* ---------- RESET GAME ---------- */
function resetGame() {
    clearInterval(gameInterval);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    score = 0;
    speed = START_SPEED;
    dir = "";
    fruitsEaten = 0;

    snake = [{ x: 9 * box, y: 10 * box }];
    food = createFood();

    drawGame(); // draw initial state
}

/* ---------- CONTROLS ---------- */
document.addEventListener("keydown", e => {
    let newDir = dir;

    if (e.key === "w" && dir !== "down") newDir = "up";
    if (e.key === "s" && dir !== "up") newDir = "down";
    if (e.key === "a" && dir !== "right") newDir = "left";
    if (e.key === "d" && dir !== "left") newDir = "right";

    if (newDir && !gameInterval) {
        dir = newDir;
        gameInterval = setInterval(drawGame, speed);
    } else {
        dir = newDir;
    }
});

/* ---------- SPEED UP ---------- */
function increaseSpeed() {
    speed = Math.max(MIN_SPEED, speed - SPEED_STEP);
    clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, speed);
}

/* ---------- DRAW GAME ---------- */
function drawGame() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // draw playground image
    ctx.drawImage(playgroundImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // draw food
    ctx.drawImage(food.img, food.x, food.y);

    // draw score
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText(`Score: ${score}`, box, 1.5 * box);
    ctx.fillText(`High: ${highScore}`, 11 * box, 1.5 * box);

    // draw snake
    ctx.fillStyle = "#FFE607";
    snake.forEach(part => ctx.fillRect(part.x, part.y, box, box));

    if (!dir) return;

    // move snake
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (dir === "right") headX += box;
    if (dir === "left") headX -= box;
    if (dir === "up") headY -= box;
    if (dir === "down") headY += box;

    // wall collision
    if (headX < 0 || headX >= CANVAS_SIZE || headY < 2 * box || headY >= CANVAS_SIZE) {
        resetGame();
        return;
    }

    // food collision
    if (headX === food.x && headY === food.y) {
        fruitsEaten++;
        score += food.type === "bonus" ? 5 : 1;
        increaseSpeed();
        food = createFood();
    } else {
        snake.pop();
    }

    snake.unshift({ x: headX, y: headY });
}

/* ---------- WAIT FOR PLAYGROUND IMAGE ---------- */
playgroundImage.onload = () => {
    resetGame(); // start only when playground image is loaded
};
