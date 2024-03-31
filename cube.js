var pretag = document.getElementById("ascii-art");

// toggle button
var tmr1 = undefined;

var r = [0, 0, 0];

var sphere1 = [0, 0, 0, 4];

const myname = "michael mckinley";

var mouseX = 100;
var mouseY = 100;

document.addEventListener("mousemove", function (e) {
  // Update the mouse coordinates
  mouseX = e.clientX;
  mouseY = e.clientY;
});

var asciiframe = function () {
  var lightSource = [mouseX / 43 - 18, -mouseY / 42 + 10, 5];

  var b = [];

  var hSpaces = Math.floor(window.innerWidth / 7);
  if (window.innerWidth < 500) {
    hSpaces += 10;
  }

  var vSpaces = Math.floor(window.innerHeight / 13);
  if (window.innerHeight < 600) {
    vSpaces = Math.floor(window.innerHeight / 13);
  }

  var zBuffer = [];

  for (var k = 0; k < hSpaces * vSpaces; k++) {
    b[k] = k % hSpaces == hSpaces - 1 ? "\n" : " ";
    zBuffer[k] = 0;
  }

  // Adjust the side length of the cube with the screen
  var side = 0;
  if (window.innerWidth > 1000) {
    side = 4;
  } else {
    side = window.innerWidth / 250;
  }

  sphere1[3] = side;

  // r[0]+=0.015;
  // r[1]+=0.006;
  // r[2]+=0.018;

  // renderCube(r);

  function renderCube(r) {
    // Normal vectors for each face of the cube
    var normals = [
      [0, 1, 0],
      [0, -1, 0],
      [1, 0, 0],
      [-1, 0, 0],
      [0, 0, 1],
      [0, 0, -1],
    ];

    // Rotate each normal vector
    for (var i = 0; i < 6; i++) {
      normals[i] = rotate(normals[i], r);
    }

    // For every point on one face of the cube, render that
    // point on each face.
    for (var i = -side; i < side; i += 0.2) {
      for (var j = -side; j < side; j += 0.2) {
        var points = [
          [i, side, j],
          [i, -side, j],
          [side, i, j],
          [-side, i, j],
          [i, j, side],
          [i, j, -side],
        ];

        for (const direction in points) {
          renderPoint(
            rotate(points[direction], r), // The rotated point
            normals[direction], // Its normal vector
          );
        }
      }
    }
  }
  function renderSphere() {
    for (var i = 0; i < 3.14; i += 0.03) {
      for (var k = -1.57; k < 1.57; k += 0.03) {
        const x = Math.cos(k) * Math.cos(i);
        const y = Math.sin(k);
        const z = Math.cos(k) * Math.sin(i);

        renderPoint([x * side, y * side, z * side], [x, y, z]);
      }
    }
  }

  renderSphere();

  // renderPoint(
  //   [0, 0, 0],
  //   [0, 0, 1]
  // )

  // renderPoint(
  //   [mouseX/43 - 18, -mouseY/42 + 10, 1],
  //   [0, 0, 1]
  // )

  function renderPoint(point, normal) {
    const screenx = 0 | (6 * ((point[0] * 49) / (50 - point[2])) + hSpaces / 2);
    const screeny = 0 | (vSpaces / 2 - 3 * ((point[1] * 49) / (50 - point[2])));

    if (screeny > hSpaces || screeny <= 0 || screenx <= 0 || screenx > hSpaces)
      return;

    const intersect = screenx + hSpaces * screeny;

    const lightvec = normalize([
      lightSource[0] - point[0],
      lightSource[1] - point[1],
      lightSource[2] - point[2],
    ]);
    const strength = 2.7 ** (-0.02 * lightvec[3]);
    var luminance = 0 | (strength * 11 * dot(lightvec, normal));

    var depth = 1 / (50 - point[2]);

    if (depth > zBuffer[intersect]) {
      zBuffer[intersect] = depth;
      b[intersect] = " .,-~:;!=*$#@"[luminance > 0 ? luminance : 0];
      // b[intersect] =  "0123456789"[luminance>0?luminance:0];
    }

    // if(screeny<vSpaces && screeny>0 && screenx>0 && screenx<hSpaces-1)
    // {
    //   b[intersect] =  " ";
    // }
  }

  // function renderWord

  function rotate(v, r) {
    const sinA = Math.sin(r[0]),
      cosA = Math.cos(r[0]),
      sinB = Math.sin(r[1]),
      cosB = Math.cos(r[1]),
      sinC = Math.sin(r[2]),
      cosC = Math.cos(r[2]);

    const xprime =
      v[0] * (cosB * cosC) +
      v[1] * (sinA * sinB * cosC - cosA * sinC) +
      v[2] * (cosA * sinB * cosC + sinA * sinC);
    const yprime =
      v[0] * (cosB * sinC) +
      v[1] * (sinA * sinB * sinC + cosA * cosC) +
      v[2] * (cosA * sinB * sinC - sinA * cosC);
    const zprime = v[0] * -sinB + v[1] * (sinA * cosB) + v[2] * (cosA * cosB);
    return [xprime, yprime, zprime];
  }
  function normalize(v) {
    const mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    return [v[0] / mag, v[1] / mag, v[2] / mag, mag];
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  pretag.innerHTML = b.join("");
};

window.anim1 = function () {
  if (tmr1 === undefined) {
    tmr1 = setInterval(asciiframe, 100);
  } else {
    clearInterval(tmr1);
    tmr1 = undefined;
  }
};
tmr1 = setInterval(asciiframe, 50);
asciiframe();
