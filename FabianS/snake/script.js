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

// create an empty Image object
let myPlayground = new Image(); 
// we set the property src equal to the path to the file we want to diplay 
myPlayground.src = "img/ground.png"; 
let myCarrot = new Image();
myCarrot.src = "img/carrot.png";

let box = myCarrot.naturalWidth;
let food_coords = {
    // Es hat 17 Felder, daher 17. 
    // Math. random liefert einen Wert zwischen 0 ... 1 
    // Da ich ab dem ersten Feld starten möchte die + 1
    x: (
        Math.trunc(
            17 * Math.random()
        ) + 1) * box,

    y: (
        Math.trunc(15 * Math.random()
    ) + 3) * box, 
    type: "carrot"
}

function drawGame(){ // the function for drawing the game
    ctx.drawImage(myPlayground, 0, 0);
    ctx.drawImage(myCarrot, food_coords.x, food_coords.y);
}

let myGame = setInterval(drawGame, 100) // we create a refresh of the scene each 100 ms, each 100 ms the funciton drawGame will be used