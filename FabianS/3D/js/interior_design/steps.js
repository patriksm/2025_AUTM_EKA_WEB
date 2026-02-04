
function buildSteps() {
    allSteps = [];
    let temp = 120
    let abstaende = [
        {
            x: 1,
            y: -0.05,
            z: 0,
        },
        {
            x: 1,
            y: 0.5,
            z: -0.7,
        },

        {
            x: 1,
            y: 1.0,
            z: -1.22,
        },
        
        {
            x: 1,
            y: 1.5,
            z: -1.75,
        },
        {
            x: 1,
            y: 2.0,
            z: -2.25,
        },

        {
            x: 1,
            y: 0.5,
            z: 0.7,
        },

        {
            x: 1,
            y: 1.0,
            z: 1.22,
        },
        
        {
            x: 1,
            y: 1.5,
            z: 1.75,
        },
        {
            x: 1,
            y: 2.0,
            z: 2.25,
        },
        
    ];

    for (let i = 0; i < abstaende.length; i++) {
        let { x, y, z } = abstaende[i];

        let x_abstand = x;
        let y_abstand = y;
        let z_abstand = z;

        if(i >=1){
            temp = 0
        }
        let step = [
            // floor 
            [
                // 300 + faktor_x * x_abstand,
                300 + faktor_x * x_abstand,
                95.25 - faktor_y * y_abstand,
                0 + faktor_z * z_abstand,
                90,
                0,
                0,
                width_stair,
                height_stair + temp,
                "yellow",
                1,
                structures[4]
            ],
            // vordere Platte
            [
                // 300 + faktor_x * x_abstand,
                300 + faktor_x * x_abstand,
                77.5 - faktor_y * y_abstand,
                100 + (temp * 0.5) + faktor_z * z_abstand,
                0,
                0,
                0,
                width_stair,
                start_pisition_floor,
                lights[1],
                1,
                structures[0]
            ],

            // rechte Platte
            [
                400 + faktor_x * x_abstand, // 500
                77.5 - faktor_y * y_abstand,
                0 + faktor_z * z_abstand,
                0,
                90,
                0,
                width_stair + (temp),
                start_pisition_floor,
                lights[1],
                1,
                structures[0]
            ],

            // linke Platte 
            [
                (200) + faktor_x * x_abstand,
                77.5 - faktor_y * y_abstand,
                0 + faktor_z * z_abstand,
                0,
                90,
                0,
                width_stair + temp,
                start_pisition_floor,
                lights[1],
                1,
                structures[0]
            ],


            // hintere Platte
            [
                300 + faktor_x * x_abstand,
                77.5 - faktor_y * y_abstand,
                -100 - (temp * 0.5) + faktor_z * z_abstand,
                0,
                0,
                0,
                width_stair,
                start_pisition_floor,
                lights[1],
                1,
                structures[0]
            ],


            // obere Platte
            [
                300 + faktor_x * x_abstand,
                60 - faktor_y * y_abstand,
                0 + faktor_z * z_abstand,
                90,
                0,
                0,
                width_stair,
                height_stair + temp,
                "yellow",
                1,
                structures[4]
            ],
        ];

        allSteps.push(...step);
    }



    return allSteps;
}

function step_handgriff() {
    let abstaende = [  ];

    abstaende = [
        {
            x: 1,
            y: 0,
            z: 0,
        },
        {
            x: 1,
            y: -0.5,
            z: -0.530,
        },
        {
            x: 1,
            y: -1,
            z: -1.05,
        },

     


        // Linkte Treppe
        {
            x: 1,
            y: 0,
            z: -3.5,
        },
        {
            x: 1,
            y: -0.5,
            z: -2.97,
        },
        {
            x: 1,
            y: -1,
            z: -2.45,
        },

        {
            x: 1.5,
            y: -0.5,
            z: -2.97,
        },
        {
            x: 1.5,
            y: -1,
            z: -2.45,
        },

        // hinten
        {
            x: 1.5,
            y: -0.5,
            z: -0.530,
        },
        {
            x: 1.5,
            y: -1,
            z: -1.05,
        },
        
    ];
    for (let i = 0; i < abstaende.length; i++) {
        let { x, y, z } = abstaende[i];

        let x_abstand = x;
        let y_abstand = y;
        let z_abstand = z;

        step = [
            // Geländer 
            [
                200 + faktor_x * x_abstand,
                -102  - faktor_y * y_abstand,
                700 + faktor_z * z_abstand,
                0,
                90,
                0,
                200,
                95,
                "rgba(160,160,160,1)",
                1,
                railing
            ],

        ];
        allSteps.push(...step);
    }

    for (let i = 0; i < 6; i++) {
        let { x, y, z } = abstaende[i];

        let x_abstand = x;
        let y_abstand = y;
        let z_abstand = z;
        step = [
            [
                210 + faktor_x * x_abstand,
                -120  - faktor_y * y_abstand,
                700 + faktor_z * z_abstand,
                0,
                90,
                0,
                200,
                60,
                "rgba(0,0,160,1)",
                1,
                railing
            ],
            [
                205 + faktor_x * x_abstand,
                -150  - faktor_y * y_abstand,
                700 + faktor_z * z_abstand,
                90,
                0,
                90,
                200,
                10,
                "rgba(0,0,160,1)",
                1,
                railing
            ],
            [
                205 + faktor_x * x_abstand,
                -120  - faktor_y * y_abstand,
                600 + faktor_z * z_abstand,
                0,
                0,
                0,
                10,
                60,
                "rgba(0,0,160,1)",
                1,
                railing
            ],
            [
                205 + faktor_x * x_abstand,
                -120  - faktor_y * y_abstand,
                800 + faktor_z * z_abstand,
                0,
                0,
                0,
                10,
                60,
                "rgba(0,0,160,1)",
                1,
                railing
            ],
        ]
        allSteps.push(...step);
    }
    for (let i = 6; i < abstaende.length; i++) {
        let { x, y, z } = abstaende[i];

        let x_abstand = x;
        let y_abstand = y;
        let z_abstand = z;
        step = [
            [
                190 + faktor_x * x_abstand,
                -120  - faktor_y * y_abstand,
                700 + faktor_z * z_abstand,
                0,
                90,
                0,
                200,
                60,
                "rgba(0,0,160,1)",
                1,
                railing
            ],
            [
                195 + faktor_x * x_abstand,
                -150  - faktor_y * y_abstand,
                700 + faktor_z * z_abstand,
                90,
                0,
                90,
                200,
                10,
                "rgba(0,0,160,1)",
                1,
                railing
            ],
            [
                195 + faktor_x * x_abstand,
                -120  - faktor_y * y_abstand,
                600 + faktor_z * z_abstand,
                0,
                0,
                0,
                10,
                60,
                "rgba(0,0,160,1)",
                1,
                railing
            ],
            [
                195 + faktor_x * x_abstand,
                -120  - faktor_y * y_abstand,
                800 + faktor_z * z_abstand,
                0,
                0,
                0,
                10,
                60,
                "rgba(0,0,160,1)",
                1,
                railing
            ],
        ]
        allSteps.push(...step);
    }
    return allSteps
}

function step_floor_adapter(){
    // Befestigung Treppe Boden
    allSteps = []
    
    let abstaende = [
        {
            x: 1,
            y: 0,
            z: 0.3,
        },
    ]
    let zz = 1
    for(let c = 0; c < 2; c++){
        if (c == 1){
            zz = - 1
        }
        step = [
            [
                600 + faktor_x * x_abstand,
                20  - faktor_y * y_abstand,
                700 * zz + faktor_z * z_abstand ,
                0,
                90,
                0,
                200,
                160,
                "rgba(160,160,160,1)",
                1,
                steps_hold
            ],


            [
                600 + faktor_x * x_abstand,
                45  - faktor_y * y_abstand,
                488 * zz + faktor_z * z_abstand,
                0,
                90,
                0,
                200,
                110,
                "rgba(160,160,160,1)",
                1,
                steps_hold
            ],
            [
                600 + faktor_x * x_abstand,
                70  - faktor_y * y_abstand,
                280 * zz + faktor_z * z_abstand,
                0,
                90,
                0,
                200,
                60,
                "rgba(160,160,160,1)",
                1,
                steps_hold
            ],

        ],
        allSteps.push(...step);
    }
    return allSteps
}