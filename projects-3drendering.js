(function() {
    var _onload = function() {

      var pretag = document.getElementById("3drendering-display");
      // toggle button
      var A=0;
      var B=0;
      var C=0;

      var asciiframe=function() {
        var b=[];
        var zBuffer=[];
        // reset the background
        for(var k=0;k<1444;k++) {
          b[k] = k%38 == 37 ? "\n" : ' ';
          zBuffer[k] = 0;
        }
        A+=0.04;
        B+=0.05;
        C+=0.01;
        renderCube([A, B, C]);

        
        function renderCube(r){
          var normals = [
            [0, 1, 0],
            [0, -1, 0],
            [1, 0, 0],
            [-1, 0, 0],
            [0, 0, 1],
            [0, 0, -1]
        ]
          for (var i=0; i<6; i++){
            normals[i] = rotate(normals[i], r)
          }
          // lets make the corners cleaner
          for (var i=-4; i<4;i+=0.2){
            for (var j=-4; j<4;j+=0.2){
              var points = [
                [i, 4, j],
                [i, -4, j],
                [4, i, j],
                [-4, i, j],
                [i, j, 4],
                [i, j, -4]
            ]            
              for (const direction in points){
                renderPoint(rotate(points[direction], r), normals[direction]);
              }
            }
          }
        }

        function renderPoint(point, normal){
          const screenx = 0|3*(point[0]*(49)/(50-point[2]))+19;
          const screeny = 0|19-3*(point[1]*(49)/(50-point[2]));
          
          if(screeny>38 || screeny<=0 || screenx<=0 || screenx>36)
          {
            return;
          }
          var intersect=screenx+(38)*screeny;
          
          const lightvec = normalize([
            10-point[0], 
            10-point[1],
            10-point[2],
          ]);
          const strength = 2.7**(-0.02*lightvec[3]);
          var luminance=0|strength*11*(dot(lightvec, normal));
          
          
          var depth=1/(50-point[2]);

          if(depth>zBuffer[intersect])
          {
            zBuffer[intersect] = depth;
            b[intersect] =  " .,-~:;!=*$#@"[luminance>0?luminance:0];
          }
        }


        function rotate(v, r){
          const sinA = Math.sin(r[0]),
                cosA = Math.cos(r[0]),
                sinB = Math.sin(r[1]),
                cosB = Math.cos(r[1]),
                sinC = Math.sin(r[2]),
                cosC = Math.cos(r[2]);
          // relative vector based on pivot point
          
          var xprime = v[0]*(cosB*cosC) + v[1]*(sinA*sinB*cosC - cosA*sinC) + v[2]*(cosA*sinB*cosC + sinA*sinC);
          var yprime = v[0]*(cosB*sinC) + v[1]*(sinA*sinB*sinC + cosA*cosC) + v[2]*(cosA*sinB*sinC - sinA*cosC);
          var zprime = v[0]*(-sinB)     +           v[1]*(sinA*cosB)                   + v[2]*(cosA*cosB);
          return [xprime, yprime, zprime];
        }
        function dot(a, b){
          return (a[0]*b[0] + a[1]*b[1] + a[2]*b[2]);
        }
        function normalize(v){
          const mag = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
          return [v[0]/mag, v[1]/mag, v[2]/mag, mag]
        }
        pretag.innerHTML = b.join("");
      };
      setInterval(asciiframe, 50);
    }

    
    if(document.all)
      window.attachEvent('onload',_onload);
    else
      window.addEventListener("load",_onload,false);
    })();