const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

// Snake
let snake = [
  { x: 200, y: 200 }
];

// Direction
let direction = "RIGHT";

// Food
let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box
};

// Keyboard control
document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Collision detection
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

// Draw everything
function draw() {
  // Green floor
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = "yellow"; // Snake color
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food (red circle = apple)
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + box/2, food.y + box/2, box/2, 0, Math.PI * 2);
  ctx.fill();

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // Wall collision
  if (
    headX < 0 || headX >= canvas.width ||
    headY < 0 || headY >= canvas.height ||
    collision({ x: headX, y: headY }, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + (snake.length - 1));
    return;
  }

  // Eat food
  if (headX === food.x && headY === food.y) {
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } else {
    snake.pop();
  }

  snake.unshift({ x: headX, y: headY });

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + (snake.length - 1), 10, 20);
}

// Game loop
let game = setInterval(draw, 150);
