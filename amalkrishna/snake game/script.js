const canvas = document.getElementById("game"); 
const ctx = canvas.getContext("2d"); 

let myPlayground = new Image(); 
myPlayground.src = "img/ground.png"; 
let myCarrot = new Image();
myCarrot.src = "img/carrot.png"; 
let myApple = new Image();
myApple.src = "img/apple.png";
let myGrape = new Image();
myGrape.src = "img/grape.png"; 
let myBanana = new Image();
myBanana.src = "img/banana.png";
let myPineapple = new Image();
myPineapple.src = "img/pineapple.png";


let box = 32;

const foodTypes = ["carrot", "apple", "grape", "banana", "pineapple"];

let food_coords = {

    type: foodTypes[Math.trunc(Math.random() * foodTypes.length)], 
};

function generateFoodPosition() {
    food_coords.x = (Math.trunc(17 * Math.random()) + 1) * box;
    food_coords.y = (Math.trunc(12 * Math.random()) + 3) * box;
    food_coords.type = foodTypes[Math.trunc(Math.random() * foodTypes.length)];
}

generateFoodPosition();

function drawGame(){ 
    ctx.drawImage(myPlayground, 0, 0);

    if (food_coords.type === "carrot") {
        ctx.drawImage(myCarrot, food_coords.x, food_coords.y);
    } else if (food_coords.type === "apple") {
        ctx.drawImage(myApple, food_coords.x, food_coords.y);
    } else if (food_coords.type === "grape") {
        ctx.drawImage(myGrape, food_coords.x, food_coords.y);
    } else if (food_coords.type === "banana") {
        ctx.drawImage(myBanana, food_coords.x, food_coords.y);
    } else if (food_coords.type === "pineapple") {
        ctx.drawImage(myPineapple, food_coords.x, food_coords.y);
    }
   
}

let myGame = setInterval(drawGame, 100);
