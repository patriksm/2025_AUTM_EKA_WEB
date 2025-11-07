var world = document.getElementById("world");

let drx = 0; // rotation around X-axis
let dry = 0; // rotation around Y-axis

document.addEventListener("keydown", (event) => {
    if(event.key == "ArrowUp"){
        drx++;
    }
    if(event.key == "ArrowDown"){
        drx--;
    }
    if(event.key == "ArrowLeft"){
        dry--;
    }
    if(event.key == "ArrowRight"){
        dry++;
    }

    // Apply both rotations at once
    world.style.transform = `rotateX(${drx}deg) rotateY(${dry}deg)`;
});
