

function interrior_walls(){
    allSteps = [];
    let abstaende =  [
        { 
            x: 1, 
            z: 0, 
            y: 0 
        },
    ];
    let { x, y, z } = abstaende[0];

    let x_abstand = x;
    let y_abstand = y;
    let z_abstand = z;
    let step = 
    [
        // hintere Wand
        [
            -500 + faktor_x * x_abstand,
            -20 - faktor_y * y_abstand,
            width_room / 2 - 200 + faktor_z * z_abstand,
            0,
            0,
            0,
            1400,
            240,
            "#a0a0a0",
            1,
            structures[4]
        ],
                [
            -500 + faktor_x * x_abstand,
            -20 - faktor_y * y_abstand,
            width_room / 2 - 180 + faktor_z * z_abstand,
            0,
            0,
            0,
            1400,
            240,
            "#a0a0a0",
            1,
            structures[4]
        ],
        [
            -1200 + faktor_x * x_abstand,
            0 - faktor_y * y_abstand,
            width_room / 2 - 190 + faktor_z * z_abstand,
            90,
            90,
            90,
            20,
            205,
            "#a0a0a0",
            1,
            structures[4]
        ],
        [
            200 + faktor_x * x_abstand,
            0 - faktor_y * y_abstand,
            width_room / 2 - 190 + faktor_z * z_abstand,
            90,
            90,
            90,
            20,
            205,
            "#a0a0a0",
            1,
            structures[4]
        ],    
        // Vordere wand 
        [
            -500 + faktor_x * x_abstand,
            -20 - faktor_y * y_abstand,
            - width_room / 2 + 200 + faktor_z * z_abstand,
            0,
            0,
            0,
            1400,
            240,
            "#a0a0a0",
            1,
            structures[4]
        ],
        [
            -500 + faktor_x * x_abstand,
            -20 - faktor_y * y_abstand,
            - width_room / 2 + 180 + faktor_z * z_abstand,
            0,
            0,
            0,
            1400,
            240,
            "#a0a0a0",
            1,
            structures[4]
        ],
        [
            -1200 + faktor_x * x_abstand,
            0 - faktor_y * y_abstand,
            - width_room / 2 + 190 + faktor_z * z_abstand,
            90,
            90,
            90,
            20,
            205,
            "#a0a0a0",
            1,
            structures[4]
        ],
        [
            200 + faktor_x * x_abstand,
            0 - faktor_y * y_abstand,
            - width_room / 2 + 190 + faktor_z * z_abstand,
            90,
            90,
            90,
            20,
            205,
            "#a0a0a0",
            1,
            structures[4]
        ],
    ]
    allSteps.push(...step);


    return allSteps;
}

