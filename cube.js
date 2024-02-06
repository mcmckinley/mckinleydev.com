// Obfuscated for efficiency. Refer to the following instead.

//https://github.com/mcmckinley/SudokuSolver/blob/main/sudoku.js

(function() {
    var _onload = function() {
      var pretag = document.getElementById("ascii-art");

      // toggle button
      var tmr1 = undefined;

      var r = [0, 0, 0];
      var asciiframe=function() {
        var b=[];

        var hSpaces = Math.floor(window.innerWidth/7);
        if (window.innerWidth < 500){
          hSpaces+=10;
        }
        
        var vSpaces = Math.floor(window.innerHeight/13);
        if (window.innerHeight < 600){
          vSpaces = Math.floor(window.innerHeight/13)
        }
        //console.log(hSpaces);
        for(var k=0;k<hSpaces*vSpaces;k++) {
          b[k] = k%hSpaces == (hSpaces-1) ? "\n" : '`';
        }


        var side = 0;
        if (window.innerWidth > 1400) {
          side = 7;
        } else {
          side = window.innerWidth/200;
        }
        
        r[0]+=0.005;
        r[1]+=0.002;
        r[2]+=0.006;

        renderCube(r);

        function renderCube(r){
          for (var i=-side; i<side;i+=0.15){
            for (var j=-side; j<side;j+=0.15){
              renderPoint(rotate([i,side,j], r));
              renderPoint(rotate([i,-side,j], r));
              renderPoint(rotate([side,i,j], r));
              renderPoint(rotate([-side,i,j], r));
              renderPoint(rotate([i,j,side], r));
              renderPoint(rotate([i,j,-side], r));
            }
          }
        }

        function renderPoint(point){
          const screenx = 0|6*(point[0]*(49)/(50-point[2]))+(hSpaces/2);
          const screeny = 0|(vSpaces/2)-3*(point[1]*(49)/(50-point[2]));
          
          if(screeny<vSpaces && screeny>0 && screenx>0 && screenx<hSpaces)
          {
            b[screenx+(hSpaces)*screeny] =  " ";
          }
        }

        function rotate(v, r){
          const sinA = Math.sin(r[0]),
                cosA = Math.cos(r[0]),
                sinB = Math.sin(r[1]),
                cosB = Math.cos(r[1]),
                sinC = Math.sin(r[2]),
                cosC = Math.cos(r[2]);
          
          const xprime = v[0]*(cosB*cosC) + v[1]*(sinA*sinB*cosC - cosA*sinC) + v[2]*(cosA*sinB*cosC + sinA*sinC);
          const yprime = v[0]*(cosB*sinC) + v[1]*(sinA*sinB*sinC + cosA*cosC) + v[2]*(cosA*sinB*sinC - sinA*cosC);
          const zprime = v[0]*(-sinB)     +           v[1]*(sinA*cosB)                   + v[2]*(cosA*cosB);
          return [xprime, yprime, zprime];
        }

        pretag.innerHTML = b.join("");
      };

    
      window.anim1 = function() {
        if(tmr1 === undefined) {
          tmr1 = setInterval(asciiframe, 50);
        } else {
          clearInterval(tmr1);
          tmr1 = undefined;
        }
      };
      tmr1 = setInterval(asciiframe, 50);
      asciiframe();
    }

    if(document.all)
      window.attachEvent('onload',_onload);
    else
      window.addEventListener("load",_onload,false);
    })();