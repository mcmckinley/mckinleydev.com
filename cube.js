var doLuminance = false;

var pretag = document.getElementById("ascii-art");

var r = [0.03, 0.05, 0.02];

var centerOfRotation = {
  x: 0, y: 0, z: 0
}

var framerate = 50

var planets = [
  {
    x: 20, // SUN
    y: 3,
    z: -20,
    r: 25,
    m: 10,
    vx: 0,
    vy: 0,
    vz: 0
  }
]

var count = 0

var hSpaces = Math.floor(window.innerWidth / 5);
if (window.innerWidth < 500) {
  hSpaces += 10;
}

A = 0
B = 0 
C = 0
0.0000
0.1



rotationSpeedA = 0.0006
rotationSpeedB = 0.0006
rotationSpeedC = 0

var renderDistance = 23

var density = 0.1;


var vSpaces = Math.floor(window.innerHeight / 8); 

var previousScroll = 0;

var asciiframe = function () {
  A += rotationSpeedA
  B += rotationSpeedB
  C += rotationSpeedC


  // var lightSources = [
  //   // [0, 0, 0], // origin
  //   [0 , - scrollTop / 42 + 10, 20] // tracks how much the user has scrolled
  // ]


  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  var currentScroll = getScrollTop();

  var scrollDiff = currentScroll - previousScroll
  C = scrollDiff / 50000 ;

  planets[0].y = currentScroll / 1000



  var b = [];

  var zBuffer = [];

  for (var k = 0; k < hSpaces * vSpaces; k++) {
    b[k] = k % hSpaces == hSpaces - 1 ? "\n" : " ";
    zBuffer[k] = 0;
  }

  // Adjust the side length of the cube with the screen
  // var side = 0;
  // if (window.innerWidth > 1000) {
  //   side = 4;
  // } else {
  //   side = window.innerWidth / 250;
  // }

  // renderCube(r);

  // function renderCube(r) {
  //   // Normal vectors for each face of the cube
  //   var normals = [
  //     [0, 1, 0],
  //     [0, -1, 0],
  //     [1, 0, 0],
  //     [-1, 0, 0],
  //     [0, 0, 1],
  //     [0, 0, -1],
  //   ];

  //   // Rotate each normal vector
  //   for (var i = 0; i < 6; i++) {
  //     normals[i] = rotate(normals[i], r);
  //   }

  //   // For every point on one face of the cube, render that
  //   // point on each face.
  //   for (var i = -side; i < side; i += 0.2) {
  //     for (var j = -side; j < side; j += 0.2) {
  //       var points = [
  //         [i, side, j],
  //         [i, -side, j],
  //         [side, i, j],
  //         [-side, i, j],
  //         [i, j, side],
  //         [i, j, -side],
  //       ];

  //       for (const direction in points) {
  //         renderPoint(
  //           rotate(points[direction], r), // The rotated point
  //           normals[direction], // Its normal vector
  //         );
  //       }
  //     }
  //   }
  // }




  function renderSphere(sphere) {
    // render a tropic/equator
    for (var i = 0; i < 3.14 * 2; i += density) {


      // var density = ((i) * (i - 6.2) / 9.2) + 1;
      // if (density < 0.01) density = 0.01;

      

      for (var k = -1.57; k < 1.57; k += density) {
        const x = Math.cos(k) * Math.cos(i);
        const y = Math.sin(k);
        const z = Math.cos(k) * Math.sin(i);

        // renderPoint([
        //     x * sphere.r + sphere.x, 
        //     y * sphere.r + sphere.y, 
        //     z * sphere.r + sphere.z
        //   ], 
        //   [x, y, z]
        // );

        // To rotate the sphere
        renderPoint(
          rotateAboutPoint([
            x * sphere.r + sphere.x,
            y * sphere.r + sphere.y,
            z * sphere.r + sphere.z,
            ], 
            [A, B, C],
            [sphere.x, sphere.y, sphere.z]
          ), 
          [x, y, z]
        );
      }
    }
  }

  // function updatePlanetPositions(){
  //   for (const planet in planets){
  //     for (const otherPlanet in planets){
  //         if (planet != otherPlanet){
  //             const r = distance(planets[planet], planets[otherPlanet]);
  //             const G = 0.0005;

  //             const netAcceleration = G * planets[otherPlanet].m / r

  //             const i = (planets[otherPlanet].x - planets[planet].x) / r
  //             const j = (planets[otherPlanet].y - planets[planet].y) / r
  //             const k = (planets[otherPlanet].z - planets[planet].z) / r

  //             planets[planet].vx += netAcceleration * i
  //             planets[planet].vy += netAcceleration * j
  //             planets[planet].vz += netAcceleration * k
  //         }
  //     }
  //   }

  //   for (const planet in planets){
  //     planets[planet].x += planets[planet].vx;
  //     planets[planet].y += planets[planet].vy;
  //     planets[planet].z += planets[planet].vz;
  //   }
  // }

  // // For gravity:
  // updatePlanetPositions()
  for (var i = 0; i < planets.length; i++){
    renderSphere(planets[i])
  }

  function renderPoint(point, normal) {
    // notes: the camera is assumed to be 0,0,0

    const m = 3 // magnification
    const d = 50 // distance of camera from viewing plane 

    const px = point[0] // x coord of point
    const py = point[1] // y coord of point
    const pz = point[2] // z coord of point

    const distanceFromCamera = distance([px,py,pz])

    if (distanceFromCamera > renderDistance) return;

    const dx = hSpaces / 2 // treat the center of the screen as (0,0) 
    const dy = vSpaces / 2 

    const screenx = 0 | (dx + 2 * m * d * px / (d - pz));
    const screeny = 0 | (dy -     m * d * py / (d - pz));

    if (screeny > hSpaces || screeny <= 0 || screenx <= 0 || screenx > hSpaces - 2)
      return;

    const intersect = screenx + hSpaces * screeny;

    // Luminance when there are multiple light sources
    // var luminance = 0
    // for (var i = 0; i < lightSources.length; i++){
    //   const lightSource = lightSources[i]
    //   const lightvec = normalize([
    //     lightSource[0] - point[0],
    //     lightSource[1] - point[1],
    //     lightSource[2] - point[2],
    //   ]);
    //   const strength = 2.7 ** (-0.02 * lightvec[3]);
    //   luminance += 0 | (strength * 11 * dot(lightvec, normal));
    // }
    // if (luminance > 11)
    //   luminance = 11


    

    var depth = 1 / (50 - point[2]);

    if (depth > zBuffer[intersect]) {
      zBuffer[intersect] = depth;
      if (doLuminance) {
        // Luminance for a single light source
        const lightvec = normalize([
          0 - point[0],
          0 - point[1],
          0 - point[2],
        ]);
        const strength = 2.7 ** (-0.02 * lightvec[3]);
        const luminance = 0 | (strength * 11 * dot(lightvec, normal));
        b[intersect] = "`,-~:;!=*$#@"[luminance > 0 ? luminance : 0];
      } else {
        b[intersect] = "@"
      }
    }
  }

  // function rotate(v, r) {
  //   const sinA = Math.sin(r[0]),
  //     cosA = Math.cos(r[0]),
  //     sinB = Math.sin(r[1]),
  //     cosB = Math.cos(r[1]),
  //     sinC = Math.sin(r[2]),
  //     cosC = Math.cos(r[2]);

  //   const xprime =
  //     v[0] * (cosB * cosC) +
  //     v[1] * (sinA * sinB * cosC - cosA * sinC) +
  //     v[2] * (cosA * sinB * cosC + sinA * sinC);
  //   const yprime =
  //     v[0] * (cosB * sinC) +
  //     v[1] * (sinA * sinB * sinC + cosA * cosC) +
  //     v[2] * (cosA * sinB * sinC - sinA * cosC);
  //   const zprime = 
  //     v[0] * -sinB + 
  //     v[1] * (sinA * cosB) + 
  //     v[2] * (cosA * cosB);

  //   return [xprime, yprime, zprime];
  // }

  function rotateAboutPoint(v, r, p) {
    const sinA = Math.sin(r[0]),
      cosA = Math.cos(r[0]),
      sinB = Math.sin(r[1]),
      cosB = Math.cos(r[1]),
      sinC = Math.sin(r[2]),
      cosC = Math.cos(r[2]);

    const xprime =
      (v[0] - p[0]) * (cosB * cosC) +
      (v[1] - p[1]) * (sinA * sinB * cosC - cosA * sinC) +
      (v[2] - p[2]) * (cosA * sinB * cosC + sinA * sinC);
    const yprime =
      (v[0] - p[0]) * (cosB * sinC) +
      (v[1] - p[1]) * (sinA * sinB * sinC + cosA * cosC) +
      (v[2] - p[2]) * (cosA * sinB * sinC - sinA * cosC);
    const zprime = 
      (v[0] - p[0]) * -sinB + 
      (v[1] - p[1]) * (sinA * cosB) + 
      (v[2] - p[2]) * (cosA * cosB);

    v[0] = xprime + p[0]
    v[1] = yprime + p[1]
    v[2] = zprime + p[2]
    return v;
  }

  function normalize(v) {
    const mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    return [v[0] / mag, v[1] / mag, v[2] / mag, mag];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function distance(A, B=[0,0,0]){
    if (Array.isArray(A)){
      return Math.sqrt((A[0]-B[0])**2 + (A[1]-B[1])**2 + (A[2]-B[2])**2);
    }

    return Math.sqrt((A.x-B.x)**2 + (A.y-B.y)**2 + (A.z-B.z)**2);
  }

  pretag.innerHTML = b.join("");
};

tmr1 = setInterval(asciiframe, framerate);
asciiframe();
