const gravDisplay = document.getElementById("gravity-display");
const renderingDisplay = document.getElementById("3drendering-display");

var planets = {
    sun: {
        pos: {
            x: 19, y: 19
        },
        vel: {
            x: 0, y: 0
        },
        mass: 10,
        icon: '@'
    },
    mars: {
        pos: {
            x: 35, y: 19
        },
        vel: {
            x: 0, y: .7
        },
        mass: 0.005,
        icon: '.'
    },
    earth: {
        pos: {
            x: 5, y: 19
        },
        vel: {
            x: 0, y: -.7
        },
        mass: 0.1,
        icon: 'o'
    },
    moon: {
        pos: {
            x: 4, y: 19
        },
        vel: {
            x: 0, y: .7
        },
        mass: 0.01,
        icon: '.'
    },
}


function updateGravDisplay(){
    clearDisplay(gravDisplay, gravText);
    for (const planet in planets){
        for (const otherPlanet in planets){
            if (planet != otherPlanet){
                const r = distanceBetween(planets[planet].pos, planets[otherPlanet].pos);
                const G = 0.05;

                const netAcceleration = G*planets[otherPlanet].mass/r;
                const sin = (planets[otherPlanet].pos.y-planets[planet].pos.y)/r;
                const cos = (planets[otherPlanet].pos.x-planets[planet].pos.x)/r;

                planets[planet].vel.x += netAcceleration*cos;
                planets[planet].vel.y += netAcceleration*sin;
            }
        }
    }

    for (const planet in planets){
        planets[planet].pos.x += planets[planet].vel.x;
        planets[planet].pos.y += planets[planet].vel.y;
        const current = planets[planet].pos;
        if (current.x > 0 && current.x < 38 && current.y > 0 && current.y < 38){
            const xintercept = 0|current.x;
            const yintercept = 0|current.y;
            const intercept = xintercept+38*yintercept;
            if (intercept % 38 != 0){
                gravText[intercept] = planets[planet].icon;
            }
        }
    }
    gravDisplay.innerHTML = gravText.join("");
}


var gravText = [];

function clearDisplay(display, array){
    for(var k=0;k<1444;k++) {
        array[k] = k%38 == 37 ? "\n" : ' ';
    }
    display.innerHTML = array.join("");
}

function distanceBetween(A, B){
    //console.log(A.x , B.x, A.y, B.y)
    if (!A.z){
        return Math.sqrt((A.x-B.x)**2 + (A.y-B.y)**2);
    }
}

clearDisplay(gravDisplay, gravText);
var interval = setInterval(updateGravDisplay, 100);
