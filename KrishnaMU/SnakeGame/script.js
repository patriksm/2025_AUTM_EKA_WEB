const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* =======================
   IMAGES
======================= */
let myPlayground = new Image();
myPlayground.src = "img/ground.png";

let fruits = {
    carrot: { img: "img/carrot.png", points: 1 },
    water:  { img: "img/water.png",  points: 2 },
    kiwi: { img: "img/kiwi.png", points: 3 }
};

let foodImages = {};
for (let key in fruits) {
    foodImages[key] = new Image();
    foodImages[key].src = fruits[key].img;
}

/* BONUS IMAGE */
let bonusImg = new Image();
bonusImg.src = "img/bonus.png";

/* =======================
   GAME VARIABLES
======================= */
let box = 32;
let score = 0;
let dir = "";

let snake = [{ x: 9 * box, y: 10 * box }];

const FOOD_COUNT = 3;
let foods = [];

let bonus = null;
let bonusTimer = 0;

/* =======================
   HELPERS
======================= */
function randomFood() {
    const keys = Object.keys(fruits);
    const type = keys[Math.floor(Math.random() * keys.length)];

    return {
        x: (Math.trunc(17 * Math.random()) + 1) * box,
        y: (Math.trunc(15 * Math.random()) + 3) * box,
        type
    };
}

function randomBonus() {
    return {
        x: (Math.trunc(17 * Math.random()) + 1) * box,
        y: (Math.trunc(15 * Math.random()) + 3) * box,
        time: 50 // lasts 50 frames (5 seconds)
    };
}

function restartGame() {
    score = 0;
    dir = "";
    snake = [{ x: 9 * box, y: 10 * box }];
    foods = [];
    bonus = null;
    bonusTimer = 0;

    for (let i = 0; i < FOOD_COUNT; i++) {
        foods.push(randomFood());
    }
}

restartGame();

/* =======================
   CONTROLS
======================= */
document.addEventListener("keypress", event => {
    if (event.key === "w" && dir !== "down") dir = "up";
    if (event.key === "s" && dir !== "up") dir = "down";
    if (event.key === "a" && dir !== "right") dir = "left";
    if (event.key === "d" && dir !== "left") dir = "right";
});

/* =======================
   GAME LOOP
======================= */
function drawGame() {
    ctx.drawImage(myPlayground, 0, 0);

    /* Draw foods */
    for (let food of foods) {
        ctx.drawImage(foodImages[food.type], food.x, food.y);
    }

    /* Bonus logic */
    bonusTimer++;
    if (bonusTimer === 100 && !bonus) { // every 10 seconds
        bonus = randomBonus();
        bonusTimer = 0;
    }

    if (bonus) {
        ctx.drawImage(bonusImg, bonus.x, bonus.y);
        bonus.time--;
        if (bonus.time <= 0) bonus = null;
    }

    /* Score */
    ctx.fillStyle = "white";
    ctx.font = "50px serif";
    ctx.fillText("Points: " + score, box, 1.7 * box);

    /* Snake */
    ctx.fillStyle = "#FFE607";
    for (let part of snake) {
        ctx.fillRect(part.x, part.y, box, box);
    }

    /* Movement */
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (dir === "right") snakeX += box;
    if (dir === "left")  snakeX -= box;
    if (dir === "up")    snakeY -= box;
    if (dir === "down")  snakeY += box;

    /* Wall hit → restart */
    if (
        snakeX < 0 ||
        snakeX > 18 * box ||
        snakeY < 3 * box ||
        snakeY > 18 * box
    ) {
        restartGame();
        return;
    }

    /* Food collision */
    let ate = false;
    for (let i = 0; i < foods.length; i++) {
        if (snakeX === foods[i].x && snakeY === foods[i].y) {
            score += fruits[foods[i].type].points;
            foods[i] = randomFood();
            ate = true;
            break;
        }
    }

    /* Bonus collision */
    if (bonus && snakeX === bonus.x && snakeY === bonus.y) {
        score += 5;
        bonus = null;
        ate = true;
    }

    if (!ate) snake.pop();

    snake.unshift({ x: snakeX, y: snakeY });
}

/* =======================
   START
======================= */
setInterval(drawGame, 100);
