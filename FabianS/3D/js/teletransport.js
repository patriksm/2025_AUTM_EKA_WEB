

function drawTransport() {
    let transport_box = document.createElement("div");
    transport_box.id = id_transportbox
    // transport_box.style.display = "block";
    // transport_box.style.position = "absolute";
    // transport_box.style.width = `50px`;
    // transport_box.style.height = `50px`;
    // transport_box.style.borderRadius = `50%`;
    // transport_box.style.backgroundColor = `#B5A642`;
    // transport_box.style.backgroundImage = "url('textures/cookies.png')";


    Object.assign(transport_box.style, {
        position: "absolute",
        width: "200px",
        height: "200px",
        borderRadius: "10%",
        backgroundImage: "url('textures/teleport.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: `
            perspective(800px)
            translate3d(
            ${600}px,
            ${200}px,
            ${200}px
            )
            rotateX(${0}deg)
            rotateY(${0}deg)
        `
        // transform: `
        //     perspective(800px)
        //     translate3d(
        //     ${600}px,
        //     ${600}px,
        //     ${-1800}px
        //     )
        //     rotateX(${0}deg)
        //     rotateY(${0}deg)
        // `
    });

    world.appendChild(transport_box);
    transportBox.push(transport_box)
    return transport_box;
}


function update_transportbox() {
    for (let c = 0; c < transportBox.length; c++) {
        const it = transportBoxD[c];
        const el = transportBox[c];
        const size = 100
        //(SPIN)
        // it.rx = (it.rx + 90 * deltaTime) % 360;
        it.ry = (it.ry + 90 * deltaTime) % 360;
        it.rz = (it.rz + 90 * deltaTime) % 360;

        el.style.transform = `
        translate3d(${600 + it.x - size / 2}px, ${400 + it.y - size / 2}px, ${0}px)
            rotateX(${it.rx}deg)
            rotateY(${it.ry}deg)
            rotateZ(${it.rz}deg)
        `;
    }
}

function checkTransport() {

    if (!transportBoxData.length) {
        return;
    }


    // Pawn world coords (anpassen!)
    const px = (pawn.x );
    const py = (pawn.y );
    const pz = (pawn.z );
    const pawnRadius = 50;
    
    for (let c = 0; c < transportBoxData.length; c++) {
        const it = transportBoxData[c];
        const itemRadius = 670 / 2;

        const dx = px - it.x;
        const dy = py - it.y;
        const dz = pz - it.z;

        const r = pawnRadius + itemRadius;

        if (dx * dx + dy * dy + dz * dz < r * r) {
            showHit("Ready for Level 2");
            return;
        }
    }
}