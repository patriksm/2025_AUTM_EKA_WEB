function createWorld(levelData) {
    for (let i = 0; i < levelData.length; i++) {
        let wall = document.createElement("div");
        wall.className = "square";
        wall.id = `square${i}`;
        wall.style.width = `${levelData[i][6]}px`;
        wall.style.height = `${levelData[i][7]}px`;
        wall.style.backgroundImage = levelData[i][8];
        wall.style.opacity = levelData[i][9];
        wall.style.transform = `translate3d(${levelData[i][0] - levelData[i][6] / 2}px, ${levelData[i][1] - levelData[i][7] / 2}px, ${levelData[i][2]}px) rotateX(${levelData[i][3]}deg) rotateY(${levelData[i][4]}deg) rotateZ(${levelData[i][5]}deg)`;
        if (levelData[i][10]) wall.style.backgroundSize = `${levelData[i][10]}%`;
        world.append(wall);
    }
}

function drawActiveObjects(objects, name) {
    myH1.textContent = "Points:";
    textBox.appendChild(myH1);

    for (let i = 0; i < objects.length; i++) {
        let newObj = document.createElement("div");
        newObj.className = "objekts";
        newObj.id = `${name}${i}`;
        newObj.style.width = `${objects[i][6]}px`;
        newObj.style.height = `${objects[i][7]}px`;
        if (objects[i][10]) {
            newObj.style.backgroundSize = "100% 100%";
            newObj.style.backgroundImage = objects[i][10];
        } else {
            newObj.style.backgroundColor = objects[i][8];
        }
        newObj.style.opacity = objects[i][9];
        newObj.style.transform = `translate3d(${objects[i][0] - objects[i][6] / 2}px, ${objects[i][1] - objects[i][7] / 2}px, ${objects[i][2]}px) rotateX(${objects[i][3]}deg) rotateY(${objects[i][4]}deg) rotateZ(${objects[i][5]}deg)`;
        world.append(newObj);
    }
}

function rotateObjects(objects, wy) {
    for (let i = 0; i < objects.length; i++) {
        objects[i][4] += wy;
        let el = document.getElementById(`objekts${i}`);
        if (el) {
            el.style.transform = `translate3d(${objects[i][0] - objects[i][6] / 2}px, ${objects[i][1] - objects[i][7] / 2}px, ${objects[i][2]}px) rotateX(${objects[i][3]}deg) rotateY(${objects[i][4]}deg) rotateZ(${objects[i][5]}deg)`;
        }
    }
}

function createBulletElement(num) {
    let bullet = document.createElement("div");
    bullet.id = `bullet${num}`;
    bullet.style.display = "block";
    bullet.style.position = "absolute";
    bullet.style.width = `20px`;
    bullet.style.height = `20px`;
    bullet.style.borderRadius = `50%`;
    bullet.style.backgroundColor = `#0ff`;
    bullet.style.boxShadow = `0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff`;
    world.appendChild(bullet);
    return bullet;
}
