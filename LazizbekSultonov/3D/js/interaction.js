function interact(obj) {
    for (let i = 0; i < obj.length; i++) {
        let r = (pawn.x - obj[i][0]) ** 2 + (pawn.y - obj[i][1]) ** 2 + (pawn.z - obj[i][2]) ** 2;
        if (r < (obj[i][6]) ** 2 + (obj[i][7]) ** 2) {
            collectSound.play();
            points++;
            myH1.textContent = `Points: ${points} of ${obj.length}`;
            if (points == obj.length) {
                var myH2 = document.createElement("h1");
                myH2.textContent = "All points collected! Go to the portal!";
                textBox.appendChild(myH2);
            }
            textBox.appendChild(myH1);
            obj[i][0] = 100000;
            obj[i][1] = 100000;
            obj[i][2] = 100000;
        }
    }
}

function interactTeleport(tel, obj) {
    for (let i = 0; i < tel.length; i++) {
        let r = (pawn.x - tel[i][0]) ** 2 + (pawn.y - tel[i][1]) ** 2 + (pawn.z - tel[i][2]) ** 2;
        if (r < (tel[i][6] / 4) ** 2 + (tel[i][7] / 4) ** 2) {
            if (points == obj.length) {
                level++;
                winSound.play();
                if (level == gameLevels.length) {
                    level = 0;
                }
                points = 0;
                world.innerHTML = "";
                textBox.innerHTML = "";
                pawn.x = 0;
                pawn.y = 0;
                pawn.z = 0;
                pawn.rx = 0;
                pawn.ry = 0;
                activeObjects = structuredClone(gameLevels[level][1]);
                createWorld(gameLevels[level][0]);
                drawActiveObjects(activeObjects, `objekts`);
                drawActiveObjects(gameLevels[level][2], `teleports`);
            } else {
                errorSound.play();
            }
        }
    }
}

function interactBullet(obj, bulletData, bulletStyle, sk) {
    for (let i = 0; i < obj.length; i++) {
        let r = (bulletData.x - obj[i][0]) ** 2 + (bulletData.y - obj[i][1]) ** 2 + (bulletData.z - obj[i][2]) ** 2;
        if (r < (obj[i][6]) ** 2 + (obj[i][7]) ** 2) {
            collectSound.play();
            points++;
            myH1.textContent = `Points: ${points} of ${obj.length}`;
            if (points == obj.length) {
                var myH2 = document.createElement("h1");
                myH2.textContent = "All points collected! Go to the portal!";
                textBox.appendChild(myH2);
            }
            textBox.appendChild(myH1);
            obj[i][0] = 100000;
            obj[i][1] = 100000;
            obj[i][2] = 100000;

            bulletStyle.style.width = `200px`;
            bulletStyle.style.height = `200px`;
            bulletStyle.remove();
        }
    }
}
