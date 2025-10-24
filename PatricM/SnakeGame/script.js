const canvas = document.getElementById("game"); //refering to the canvas element in html file
const ctx = canvas.getContext("2d"); //enables us to use some tools for drawing such like fillRect, drawImage etc.

let myPlayground = new Image(); // create an empty Image object
myPlayground.src = "img/ground.png"; // we set the property src equal to the path to the file we want to diplay
let myCarrot = new Image();
myCarrot.src = "img/carrot.png";

let box = 32;
let food_coords = {
  x: (Math.trunc(17 * Math.random()) + 1) * box,
  y: (Math.trunc(15 * Math.random()) + 3) * box,
  type: "carrot",
};

let snakeX = 0;
let snakeY = 0;

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box,
};
snake[1] = {
  x: 8 * box,
  y: 10 * box,
};
snake[2] = {
  x: 8 * box,
  y: 11 * box,
};
snake[3] = {
  x: 7 * box,
  y: 11 * box,
};

snake[4] = {
  x: 7 * box,
  y: 12 * box,
};

// snake.unshift(newHead)
// snake.pop()

function drawGame() {
  // the function for drawing the game
  ctx.drawImage(myPlayground, 0, 0);
  ctx.drawImage(myCarrot, food_coords.x, food_coords.y);
  ctx.fillStyle = "#FFE607";
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  snakeX = snake[0].x;
  snakeY = snake[0].y;
  snakeY -= box;

  snake.pop();

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  snake.unshift(newHead);
}

let myGame = setInterval(drawGame, 100); // we create a refresh of the scene each 100 ms, each 100 ms the funciton drawGame will be used
