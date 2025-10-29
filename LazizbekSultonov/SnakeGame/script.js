const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let myPlayground = new Image();
myPlayground.src = "img/ground.png";
let myCarrot = new Image();
myCarrot.src = "img/carrot.png";
let snakeImg = new Image();
let snakeImgLoaded = false;
snakeImg.onload = () => (snakeImgLoaded = true);
snakeImg.src = "img/snake.png";

let box = 32;
let food_coords = {
  x: (Math.trunc(17 * Math.random()) + 1) * box,
  y: (Math.trunc(15 * Math.random()) + 3) * box,
  type: "carrot",
};

let snakeX = 0;
let snakeY = 0;
let dir = "";
let score = 0;
let gameOver = false;

const MIN_X = 1 * box;
const MAX_X = 17 * box;
const MIN_Y = 3 * box;
const MAX_Y = 17 * box;

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

document.addEventListener("keydown", (event) => {
  if (gameOver) return;
  if ((event.key === "w" || event.key === "ArrowUp") && dir != "down") {
    dir = "up";
  }
  if ((event.key === "s" || event.key === "ArrowDown") && dir != "up") {
    dir = "down";
  }
  if ((event.key === "a" || event.key === "ArrowLeft") && dir != "right") {
    dir = "left";
  }
  if ((event.key === "d" || event.key === "ArrowRight") && dir != "left") {
    dir = "right";
  }
});

function endGame() {
  gameOver = true;
  clearInterval(myGame);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "24px serif";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 26);
  ctx.textAlign = "start";
  const overlay = document.getElementById("overlay");
  const finalScore = document.getElementById("finalScore");
  if (finalScore) finalScore.textContent = "Score: " + score;
  if (overlay) overlay.classList.remove("hidden");
}

function isSelfCollision(nextX, nextY) {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === nextX && snake[i].y === nextY) {
      return true;
    }
  }
  return false;
}

function drawGame() {
  ctx.drawImage(myPlayground, 0, 0);
  ctx.drawImage(myCarrot, food_coords.x, food_coords.y);
  ctx.fillStyle = "white";
  ctx.font = "50px serif";
  ctx.fillText("Points: " + score, 1 * box, 1.7 * box);
  ctx.fillStyle = "#FFE607";
  for (let i = 0; i < snake.length; i++) {
    const seg = snake[i];
    if (snakeImgLoaded) {
      ctx.drawImage(snakeImg, seg.x, seg.y, box, box);
    } else {
      const radius = 10;
      ctx.beginPath();
      ctx.moveTo(seg.x + radius, seg.y);
      ctx.arcTo(seg.x + box, seg.y, seg.x + box, seg.y + box, radius);
      ctx.arcTo(seg.x + box, seg.y + box, seg.x, seg.y + box, radius);
      ctx.arcTo(seg.x, seg.y + box, seg.x, seg.y, radius);
      ctx.arcTo(seg.x, seg.y, seg.x + box, seg.y, radius);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(
        seg.x,
        seg.y,
        seg.x + box,
        seg.y + box
      );
      gradient.addColorStop(0, "#8ef58e");
      gradient.addColorStop(1, "#39b54a");
      ctx.fillStyle = gradient;
      ctx.fill();
      if (i === 0) {
        ctx.fillStyle = "#0b2b40";
        ctx.beginPath();
        ctx.arc(seg.x + box * 0.3, seg.y + box * 0.35, 3, 0, Math.PI * 2);
        ctx.arc(seg.x + box * 0.7, seg.y + box * 0.35, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  snakeX = snake[0].x;
  snakeY = snake[0].y;

  if (dir == "right") snakeX += box;
  if (dir == "up") snakeY -= box;
  if (dir == "left") snakeX -= box;
  if (dir == "down") snakeY += box;

  if (snakeX == food_coords.x && snakeY == food_coords.y) {
    food_coords = {
      x: (Math.trunc(17 * Math.random()) + 1) * box,
      y: (Math.trunc(15 * Math.random()) + 3) * box,
      type: "carrot",
    };
    score++;
  } else {
    snake.pop();
  }

  if (snakeX < MIN_X || snakeX > MAX_X || snakeY < MIN_Y || snakeY > MAX_Y) {
    endGame();
    return;
  }

  if (isSelfCollision(snakeX, snakeY)) {
    endGame();
    return;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  snake.unshift(newHead);
}

let myGame = setInterval(drawGame, 100);

const restartBtn = document.getElementById("restartBtn");
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.classList.add("hidden");
    gameOver = false;
    dir = "";
    score = 0;
    food_coords = {
      x: (Math.trunc(17 * Math.random()) + 1) * box,
      y: (Math.trunc(15 * Math.random()) + 3) * box,
      type: "carrot",
    };
    snake = [{ x: 9 * box, y: 10 * box }];
    clearInterval(myGame);
    myGame = setInterval(drawGame, 100);
  });
}
