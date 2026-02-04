const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ---------- IMAGES ---------- */
let myPlayground = new Image();
myPlayground.src = "img/ground.png";

let myCarrot = new Image();
myCarrot.src = "img/carrot.png";

let myBonus = new Image();
myBonus.src = "img/bonus.png"; // bonus fruit image

/* ---------- CONSTANTS ---------- */
let box = 32;
const FRUIT_COUNT = 5; // 5 NORMAL fruits

/* ---------- GAME STATE ---------- */
let snakeX = 0;
let snakeY = 0;
let dir = "";
let score = 0;
let myGame;

/* ---------- SNAKE ---------- */
let snake = [];

/* ---------- FOOD LIST ---------- */
let foods = [];

/* ---------- CREATE FOOD ---------- */
function createFood(type = "carrot") {
    return {
        x: (Math.trunc(17 * Math.random()) + 1) * box,
        y: (Math.trunc(15 * Math.random()) + 3) * box,
        type
    };
}

/* ---------- RESET GAME ---------- */
function resetGame() {
    clearInterval(myGame);

    dir = "";
    score = 0;

    snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };

    foods = [];

    // 5 NORMAL fruits
    for (let i = 0; i < FRUIT_COUNT; i++) {
        foods.push(createFood("carrot"));
    }

    // 1 BONUS fruit
    foods.push(createFood("bonus"));

    myGame = setInterval(drawGame, 100);
}

/* ---------- CONTROLS ---------- */
document.addEventListener("keypress", (event) => {
    if (event.key === "w" && dir !== "down") dir = "up";
    if (event.key === "s" && dir !== "up") dir = "down";
    if (event.key === "a" && dir !== "right") dir = "left";
    if (event.key === "d" && dir !== "left") dir = "right";
});

/* ---------- DRAW GAME ---------- */
function drawGame() {
    ctx.drawImage(myPlayground, 0, 0);

    /* Draw fruits */
    foods.forEach(food => {
        if (food.type === "bonus") {
            ctx.drawImage(myBonus, food.x, food.y);
        } else {
            ctx.drawImage(myCarrot, food.x, food.y);
        }
    });

    /* Score */
    ctx.fillStyle = "white";
    ctx.font = "50px serif";
    ctx.fillText("Points: " + score, 1 * box, 1.7 * box);

    /* Snake */
    ctx.fillStyle = "#FFE607";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    snakeX = snake[0].x;
    snakeY = snake[0].y;

    if (dir === "right") snakeX += box;
    if (dir === "left") snakeX -= box;
    if (dir === "up") snakeY -= box;
    if (dir === "down") snakeY += box;

    /* ---------- WALL COLLISION = RESTART ---------- */
    if (
        snakeX < 0 ||
        snakeX > 18 * box ||
        snakeY < 2 * box ||
        snakeY > 18 * box
    ) {
        resetGame();
        return;
    }

    let ateFood = false;

    /* ---------- FOOD COLLISION ---------- */
    for (let i = 0; i < foods.length; i++) {
        if (snakeX === foods[i].x && snakeY === foods[i].y) {
            ateFood = true;

            if (foods[i].type === "bonus") {
                score += 5;
                foods[i] = createFood("bonus");
            } else {
                score += 1;
                foods[i] = createFood("carrot");
            }
        }
    }

    if (!ateFood) {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    snake.unshift(newHead);
}

/* ---------- START GAME ---------- */
resetGame();
