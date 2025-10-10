const canvas = document.getElementById("game"); 
const ctx = canvas.getContext("2d"); 

let myPlayground = new Image(); 
myPlayground.src = "img/ground.png"; 

let myCarrot = new Image();
myCarrot.src = "img/carrot.png";

let myApple = new Image();
myApple.src = "img/apple.png";

let box = 32; 
let food_coords = {
    type: Math.random() < 0.5 ? "carrot" : "apple", 
};

function generateFoodPosition() {
    food_coords.x = (Math.trunc(17 * Math.random()) + 1) * box;
    food_coords.y = (Math.trunc(12 * Math.random()) + 3) * box;
}

generateFoodPosition();

function drawGame(){ 

    ctx.drawImage(myPlayground, 0, 0);

    if (food_coords.type === "carrot") {
        ctx.drawImage(myCarrot, food_coords.x, food_coords.y);
    } else if (food_coords.type === "apple") {
        ctx.drawImage(myApple, food_coords.x, food_coords.y);
    }
}

let myGame = setInterval(drawGame, 100);