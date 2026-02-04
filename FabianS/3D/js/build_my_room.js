


myRoom = window.myRoom;
let step_temp
let allSteps = [];
let addition_walls = []

let faktor_y = 100
let faktor_x = 400
let faktor_z = 400

let x_abstand = 0
let y_abstand = 0
let z_abstand = 0
let structure

let height_room = 2000
let width_room = 2000
let height_wall_floor = 400

let height_stair = 200
let width_stair = 200

let start_pisition_floor = 35



function drawMyWorld(squares, name) {
    for (let i = 0; i < squares.length; i++) {
        let mySquare1 = document.createElement("div");
        mySquare1.id = `${name}${i}`;
        mySquare1.style.position = "absolute";
        mySquare1.style.width = `${squares[i][6]}px`;
        mySquare1.style.height = `${squares[i][7]}px`;

        if (squares[i][10]) {
            mySquare1.style.backgroundImage = squares[i][10];
        } else {
            mySquare1.style.backgroundColor = squares[i][8];
        }

        mySquare1.style.transform =
        `
            translate3d(
                ${600 + squares[i][0] - squares[i][6] / 2}px,
                ${400 + squares[i][1] - squares[i][7] / 2}px,
                ${squares[i][2]}px
            )
            rotateX(${squares[i][3]}deg)
            rotateY(${squares[i][4]}deg)
            rotateZ(${squares[i][5]}deg)
        `;

        mySquare1.style.opacity = squares[i][9];
        world.appendChild(mySquare1);
    }
}

myRoom = room_data()

let steps = buildSteps();
myRoom = [...myRoom, ...steps];


let add_walls
add_walls = interrior_walls()
myRoom = [...myRoom, ...add_walls];


add_walls = tunnel()
myRoom = [...myRoom, ...add_walls];

add_walls = second_floor_front_and_behind()
myRoom = [...myRoom, ...add_walls];

add_walls = second_floor_left_and_right()
myRoom = [...myRoom, ...add_walls];





add_walls = step_floor_adapter()
myRoom = [...myRoom, ...add_walls];

add_walls = step_handgriff()
myRoom = [...myRoom, ...add_walls];

drawMyWorld(myRoom, "wall");





function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
    //   return Math.floor(Math.random() * max);
}