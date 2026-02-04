
function second_floor_front_and_behind() {
    let beleuchtung = structures[11]
    let height_second_floor_side_one = 200
    let width_second_floor_side_one = width_room - width_stair - 198
    let abstaende = [
        {
            x: 0,
            y: 2.0,
            z: 2.25
        },
        {
            x: 0,
            y: 2.0,
            z: -2.25
        },
    ]
    for (let c = 0; c < abstaende.length; c++) {
        let { x, y, z } = abstaende[c];

        let x_abstand = x;
        let y_abstand = y;
        let z_abstand = z;
        let add_wall = [
            // floor 
            [
                -201 + faktor_x * x_abstand,
                95.25 - faktor_y * y_abstand,
                0 + faktor_z * z_abstand,
                90,
                0,
                0,
                width_second_floor_side_one,
                height_second_floor_side_one,
                "brown",
                1,
                structures[4]
            ],
            // vordere Platte
            [
                -198.5 + faktor_x * x_abstand,
                77.5 - faktor_y * y_abstand,
                100 + faktor_z * z_abstand,
                0,
                0,
                0,
                width_second_floor_side_one,
                start_pisition_floor,
                "#0FFF50",
                1,
                beleuchtung
            ],

            // rechte Platte
            [
                //  hier fehlt noch eine äußere Kante hinten
                -(width_second_floor_side_one / 2) - 198 + faktor_x * x_abstand,
                77.5 - faktor_y * y_abstand,
                - width_second_floor_side_one / 2 + 800 + faktor_z * z_abstand,
                0,
                90,
                0,
                width_stair,
                start_pisition_floor,
                "yellow",
                1,
                structures[0]
            ],

            // // linke Platte 
            [
                width_second_floor_side_one / 3 + 66 + faktor_x * x_abstand,
                77.5 - faktor_y * y_abstand,
                0 + faktor_z * z_abstand,
                0,
                90,
                0,
                width_stair,
                start_pisition_floor,
                "green",
                1,
                beleuchtung
            ],


            // // hintere Platte
            [
                -198.5 + faktor_x * x_abstand,
                77.5 - faktor_y * y_abstand,
                -100 + faktor_z * z_abstand,
                0,
                0,
                0,
                width_second_floor_side_one,
                start_pisition_floor,
                "#0FFF50",
                1,
                beleuchtung
            ],


            // // obere Platte
            [
                -199 + faktor_x * x_abstand,
                60 - faktor_y * y_abstand,
                0 + faktor_z * z_abstand,
                90,
                0,
                0,
                width_second_floor_side_one,
                height_second_floor_side_one,
                "orange",
                1,
                structures[4]
            ],
        ];

        allSteps.push(...add_wall);
    }


    return allSteps;
}


function second_floor_left_and_right() {
    let beleuchtung = structures[11]
    let height_second_floor_side_one = 200
    let width_second_floor_side_one = width_room - width_stair - 200

    let height_second_floor_side_two = height_room - 440
    let width_second_floor_side_two = 200

    let x_abstand = 1;
    let y_abstand = 0;
    let z_abstand = 0;
    // Ecke vorne rechts
    step = [
        [
            500 + faktor_x * x_abstand,
            -140 - faktor_y * y_abstand,
            - width_room / 2 + 100 + faktor_z * z_abstand,
            90,
            0,
            0,
            200,
            200,
            "orange",
            1,
            structures[4]
        ],
        [
            500 + faktor_x * x_abstand,
            -105 - faktor_y * y_abstand,
            - width_room / 2 + 100 + faktor_z * z_abstand,
            90,
            0,
            0,
            200,
            200,
            "orange",
            1,
            structures[4]
        ],
        [
            500 + faktor_x * x_abstand,
            -122.5 - faktor_y * y_abstand,
            - width_room / 2 + 200 + faktor_z * z_abstand,
            0,
            0,
            0,
            200,
            34.5,
            "green",
            1,
            structures[11]
        ],
        [
            500 + faktor_x * x_abstand,
            -140 - faktor_y * y_abstand,
            width_room / 2 - 100 + faktor_z * z_abstand,
            90,
            0,
            0,
            200,
            200,
            "orange",
            1,
            structures[4]
        ],
        [
            500 + faktor_x * x_abstand,
            -105 - faktor_y * y_abstand,
            width_room / 2 - 100 + faktor_z * z_abstand,
            90,
            0,
            0,
            200,
            200,
            "orange",
            1,
            structures[4]
        ],
        [
            500 + faktor_x * x_abstand,
            -122.5 - faktor_y * y_abstand,
            width_room / 2 - 200 + faktor_z * z_abstand,
            0,
            0,
            0,
            200,
            35,
            "green",
            1,
            structures[11]
        ],
    ]
    allSteps.push(...step);


    let abstaende = [
        {
            x: 0,
            y: 0.0,
            z: 0
        },
        {
            x: -4.5,
            y: 0.0,
            z: 0
        },
    ]

    for (let c = 0; c < abstaende.length; c++) {
        let { x, y, z } = abstaende[c]
        x_abstand = x
        y_abstand = y
        z_abstand = z
        step = [
            [
                900 + faktor_x * x_abstand,
                -140 - faktor_y * y_abstand,
                - width_room / 2 + 1000 + faktor_z * z_abstand,
                90,
                0,
                0,
                200,
                1600,
                "black",
                1,
                structures[4]
            ],
            [
                900 + faktor_x * x_abstand,
                -105 - faktor_y * y_abstand,
                - width_room / 2 + 1000 + faktor_z * z_abstand,
                90,
                0,
                0,
                200,
                1600,
                "black",
                1,
                structures[4]
            ],
            [
                800 + faktor_x * x_abstand,
                -122.5 - faktor_y * y_abstand,
                - width_room / 2 + 1000 + faktor_z * z_abstand,
                90,
                90,
                0,
                35,
                1600,
                "#4169E1",
                1,
                structures[11]
            ],
            [
                1000 + faktor_x * x_abstand,
                -122.5 - faktor_y * y_abstand,
                - width_room / 2 + 1000 + faktor_z * z_abstand,
                90,
                90,
                0,
                35,
                1600,
                "#4169E1",
                1,
                structures[11]
            ],
        ]
        allSteps.push(...step);
    }

    // Geländer
    abstaende = [
        {
            x: 0,
            y: 0.0,
            z: 0
        },
    ]
    step = [
        [
            2600 + faktor_x * x_abstand,
            -140 - faktor_y * y_abstand,
            - width_room / 2 + 1000 + faktor_z * z_abstand,
            90,
            90,
            0,
            90,
            1600,
            "rgba(160,160,160,0.01)",
            1,
            // surface_light
        ],
        [
            1700 + faktor_x * x_abstand,
            -140 - faktor_y * y_abstand,
            - width_room / 2 + 1800 + faktor_z * z_abstand,
            0,
            0,
            90,
            90,
            1400,
            "rgba(160,160,160,0.01)",
            1,
            // surface_light
        ],
        [
            1000 + faktor_x * x_abstand,
            -140 - faktor_y * y_abstand,
            - width_room / 2 + 1150 + faktor_z * z_abstand,
            0,
            90,
            90,
            90,
            1300,
            "rgba(160,160,160,0.01)",
            1,
            // surface_light
        ],
    ]
    allSteps.push(...step);
    return allSteps;
}


function bruecken() {
    allSteps = []
    abstaende = [
        {
            x: 0,
            y: 0,
            z: 0
        },
        {
            x: 0,
            y: -0.35,
            z: 0
        },
 
    ]
    for (let c = 0; c < abstaende.length; c++) {
        let { x, y, z } = abstaende[c]
        x_abstand = x
        y_abstand = y
        z_abstand = z
        step = [
            [
                0 + faktor_x * x_abstand,
                -140 - faktor_y * y_abstand,
                - width_room / 2 + 1000 + faktor_z * z_abstand,
                90,
                0,
                90,
                200,
                1600,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
            [
                0 + faktor_x * x_abstand,
                -140 - faktor_y * y_abstand,
                - width_room / 2 + 1000 + faktor_z * z_abstand,
                90,
                0,
                0,
                200,
                1600,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
        ]
        allSteps.push(...step);
    }
    return allSteps
}



function wuerfel() {
    allSteps = []
    abstaende = [
        {
            x: 1,
            y: 1,
            z: 1
        },
    ]
    for (let c = 0; c < abstaende.length; c++) {
        step = [
            [
                100 + faktor_x * x_abstand,
                -140 - faktor_y * y_abstand,
                - width_room / 2 + 700 + faktor_z * z_abstand,
                90,
                0,
                90,
                200,
                200,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
            [
                100 + faktor_x * x_abstand,
                -340 - faktor_y * y_abstand,
                - width_room / 2 + 700 + faktor_z * z_abstand,
                90,
                0,
                0,
                200,
                200,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
            [
                200 + faktor_x * x_abstand,
                -240 - faktor_y * y_abstand,
                - width_room / 2 + 700 + faktor_z * z_abstand,
                90,
                90,
                0,
                200,
                200,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
            [
                0 + faktor_x * x_abstand,
                -240 - faktor_y * y_abstand,
                - width_room / 2 + 700 + faktor_z * z_abstand,
                90,
                90,
                0,
                200,
                200,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
            [
                100 + faktor_x * x_abstand,
                -240 - faktor_y * y_abstand,
                - width_room / 2 + 600 + faktor_z * z_abstand,
                0,
                0,
                90,
                200,
                200,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
            [
                100 + faktor_x * x_abstand,
                -240 - faktor_y * y_abstand,
                - width_room / 2 + 800 + faktor_z * z_abstand,
                0,
                0,
                90,
                200,
                200,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
        ]
        allSteps.push(...step);
    }
    return allSteps
}




function tunnel() {
    allSteps = []
    abstaende = [
        {
            x: 1,
            y: 1,
            z: 1
        },
    ]
    for (let c = 0; c < abstaende.length; c++) {
        step = [
            [
                -100 + faktor_x * x_abstand,
                -50 - faktor_y * y_abstand,
                - width_room / 2 + 350 + faktor_z * z_abstand,
                90,
                0,
                0,
                1400,
                300,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
            [
                -100 + faktor_x * x_abstand,
                -70 - faktor_y * y_abstand,
                - width_room / 2 + 350 + faktor_z * z_abstand,
                90,
                0,
                0,
                1400,
                300,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
            [
                -350 + faktor_x * x_abstand,
                -60 - faktor_y * y_abstand,
                - width_room / 2 + 500 + faktor_z * z_abstand,
                0,
                0,
                0,
                900,
                21,
                "rgba(0,0,160,1)",
                1,
                floor
            ],
            [
                350 + faktor_x * x_abstand,
                -60 - faktor_y * y_abstand,
                - width_room / 2 + 500 + faktor_z * z_abstand,
                0,
                0,
                0,
                500,
                21,
                "rgba(0,0,160,1)",
                1,
                floor
            ],

            [
                -800 + faktor_x * x_abstand,
                -60 - faktor_y * y_abstand,
                - width_room / 2 + 350 + faktor_z * z_abstand,
                0,
                90,
                0,
                300,
                20,
                "rgba(0,0,160,1)",
                1,
                floor
            ],
            [
                - 400 + faktor_x * x_abstand,
                25 - faktor_y * y_abstand,
                - width_room / 2 + 500 + faktor_z * z_abstand,
                0,
                0,
                0,
                800,
                150,
                "rgba(160,160,160,1)",
                1,
                floor
            ],
            [
                - 400 + faktor_x * x_abstand,
                25 - faktor_y * y_abstand,
                - width_room / 2 + 480 + faktor_z * z_abstand,
                0,
                0,
                0,
                800,
                150,
                "rgba(0,0,160,1)",
                1,
                floor
            ],
            [
                - 800 + faktor_x * x_abstand,
                25 - faktor_y * y_abstand,
                - width_room / 2 + 490 + faktor_z * z_abstand,
                0,
                90,
                90,
                150,
                20,
                "rgba(0,0,160,1)",
                1,
                floor
            ],
            [
                0 + faktor_x * x_abstand,
                25 - faktor_y * y_abstand,
                - width_room / 2 + 490 + faktor_z * z_abstand,
                0,
                90,
                90,
                150,
                20,
                "rgba(0,0,160,1)",
                1,
                floor
            ],
            [
                100 + faktor_x * x_abstand,
                25 - faktor_y * y_abstand,
                - width_room / 2 + 490 + faktor_z * z_abstand,
                0,
                90,
                90,
                150,
                20,
                "rgba(0,0,160,1)",
                1,
                floor
            ],

            [
                350 + faktor_x * x_abstand,
                25 - faktor_y * y_abstand,
                - width_room / 2 + 500 + faktor_z * z_abstand,
                0,
                0,
                0,
                500,
                150,
                "rgba(0,0,160,1)",
                1,
                floor
            ],
            [
                350 + faktor_x * x_abstand,
                25 - faktor_y * y_abstand,
                - width_room / 2 + 480 + faktor_z * z_abstand,
                0,
                0,
                0,
                500,
                155,
                "rgba(0,0,160,1)",
                1,
                floor
            ],
            [
                -100 + faktor_x * x_abstand,
                -100 - faktor_y * y_abstand,
                - width_room / 2 + 500 + faktor_z * z_abstand,
                0,
                0,
                0,
                1400,
                60,
                "rgba(251, 251, 251, 0.001)",
                1,
                // floor
            ],
            [
                -800 + faktor_x * x_abstand,
                -100 - faktor_y * y_abstand,
                - width_room / 2 + 350 + faktor_z * z_abstand,
                0,
                90,
                0,
                300,
                60,
                "rgba(251, 251, 251, 1)",
                1,
                floor
            ],
        ]
        allSteps.push(...step);
    }
    return allSteps
}