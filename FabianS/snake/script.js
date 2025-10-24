const canvas = document.getElementById("game"); //refering to the canvas element in html file
const ctx = canvas.getContext("2d"); //enables us to use some tools for drawing such like fillRect, drawImage etc. 

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  result = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  console.log(result)
  return result
}

function getRandomIntProfessor(fieldsize){
    nominator = Math.random() * fieldsize
    // denom = 1 .... 17
    // result = nominator / denom 
}
let myPlayground = new Image(); // create an empty Image object
myPlayground.src = "img/ground.png"; // we set the property src equal to the path to the file we want to diplay 
let myCarrot = new Image();
myCarrot.src = "img/carrot.png";

let box = 32;
let food_coords = {
    x: (Math.trunc(17*Math.random())+ 1)*box,
    y: (Math.trunc(15*Math.random())+ 3)*box, 
    // y: getRandomInt(0, 17)*box, 
    type: "carrot"
}

function drawGame(){ // the function for drawing the game
    ctx.drawImage(myPlayground, 0, 0);
    ctx.drawImage(myCarrot, food_coords.x, food_coords.y);
}

let myGame = setInterval(drawGame, 100) // we create a refresh of the scene each 100 ms, each 100 ms the funciton drawGame will be used