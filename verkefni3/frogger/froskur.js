var canvas;
var gl;
 
var numVertices = 36;

var points = [];
var colors = [];

var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var matrixLoc;

// Game variables
// // Game state variables
var gameWon = false;
var gameOver = true;
var lives = 5;
var score = 0;

// // Array to contain the game entities
var frog = [0.0, 0.05, 0.05, 1];
var entities;
var endWalls;
var endFrogs = new Array();

var left_edge = -0.7;
var right_edge = 0.7;

// Variables used to define the interval between checks
var paused = false;
var time = 0;
var interval = 5;

// Grid sizes are defined and the grids filled in with zeroes
function setupGame() {
    // Game state variables reset
    gameWon = false;
    gameOver = false;
    lives = 5;

    // Frog reset
    frog = [0.0, 0.05, 0.05, 1];
    // Table keeping track of entities initialized
    entities = new Array(9).fill(new Array());
    // Cars
    entities[1] = [
        [-0.6, 0.15, 0.05, 1, 0.01],
        [-0.8, 0.15, 0.05, 1, 0.01],
        [-1, 0.15, 0.05, 1, 0.01]
    ];
    entities[2] = [
        [0.7, 0.25, 0.05, 2, -0.02]
    ];
    entities[3] = [
        [-0.6, 0.35, 0.05, 1, 0.15],
        [-0.8, 0.35, 0.05, 1, 0.15],
        [-1.0, 0.35, 0.05, 1, 0.15],
    ];
    // Logs and turtles
    entities[5] = [
        [-0.6, 0.55, -0.05, 2, 0.1],
        [-0.8, 0.55, -0.05, 2, 0.1],
        [-1, 0.55, -0.05, 2, 0.1]
    ];
    entities[6] = [
        [0.7, 0.65, -0.5, 1, -0.2],
        [0.8, 0.65, -0.5, 1, -0.2],
        
        [1.1, 0.65, -0.5, 1, -0.2],
        [1.2, 0.65, -0.5, 1, -0.2],
    ];
    entities[7] = [
        [-0.6, 0.75, -0.5, 4, 0.15]
    ];
    entities[8] = [
        [6.5, 0.85, -0.05, 1, -0.1],
        [7.5, 0.85, -0.05, 1, -0.1],
        [8.5, 0.85, -0.05, 1, -0.1],
        [9.5, 0.85, -0.05, 1, -0.1]
    ];
    // Back walls
    endWalls = [
        [-0.5, 0.95, 0.05, 1, 0],
        [-0.3, 0.95, 0.05, 1, 0],
        [-0.1, 0.95, 0.05, 1, 0],
        [0.1, 0.95, 0.05, 1, 0],
        [0.3, 0.95, 0.05, 1, 0],
        [0.5, 0.95, 0.05, 1, 0]
    ];

    endFrogs = new Array();
}

function checkCollision() {
    var ypos = Math.floor(frog[1]*10);
    
    if (ypos == 9) {
        var hitLeaf = false;
        for (var i = 0; i < endWalls.length-1; i++) {
            if (frog[0] > endWalls[i][0]+0.05 && frog[0] < endWalls[i+1][0]-0.05) {
                endFrogs.push([endWalls[i][0]+0.1, 0.95, 0.05, 1]);
                hitLeaf = true;
                score += 1000;
            }
        }
        if (!hitLeaf) {
            lives--;
            frog = [0.0, 0.05, 0.05, 1];
            if (lives <= 0) {
                gameOver = true;
            }
        }
    }
    else {
        for(var i = 0; i < entities[ypos].length; i++) {
            console.log(entities[ypos]);
            var hit = false;
            if (frog[0]-0.04 <= entities[ypos][i]+ypos[3]*0.05 && frog[0]-0.04 >= entities[ypos][i]-ypos[3]*0.05) {
                hit = true;
            }
            else if (frog[0]+0.04 >= entities[ypos][i]-ypos[3]*0.05 && frog[0]+0.04 <= entities[ypos][i]+ypos[3]*0.05) {
                hit = true;
            }
            if (ypos >= 1 && ypos <= 3) {
                if (hit) {
                    lives--;
                }
            }
            else if (ypos >= 5 && ypos <= 8) {
                if (!hit) {
                    lives--;
                    frog = [0.0, 0.05, 0.05, 1];
                }
            }
        }
    }
    
}

function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) {
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    //vertex color assigned by the index of the vertex
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[a]);
    }
}

setupGame();

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available");}

    colorCube();

    gl.viewport(0, 0, canvas.clientWidth, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);


    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    matrixLoc = gl.getUniformLocation( program, "transform" );

    canvas.addEventListener("mousedown", function(e) {
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault()
    } );

    canvas.addEventListener("mouseup", function(e) {
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e) {
        if(movement) {
            spinY = (spinY + (origX - e.offsetX)) % 360;
            spinX = (spinX + (origY - e.offsetY)) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );

    // Event listeners for changing parameters
    // Change the time interval for changes
    /*document.getElementById("timeInterval").onchange = function(event) {
        interval = event.target.value;
    }
    
    // Change the probabilty of a square being filled at the start
    document.getElementById("lifeChance").onchange = function(event) {
        liferate = event.target.value;
    }
    */
    window.addEventListener("keydown", function(e){
        switch (e.keyCode) {
            case 37:
                if (frog[0] > -0.5) {
                    frog[0] -= 0.1;
                }
                checkCollision();
                break;
            case 38:
                if(frog[1] < 0.95){
                    frog[1] += 0.1;
                }
                checkCollision();
                break;
            case 39:
                if (frog[0] < 0.5) {
                    frog[0] += 0.1;
                }
                checkCollision();
                break;
            case 40:
                if (frog[1] > 0.05) { frog[1] -= 0.1; }
                checkCollision();
                break;
            
            case 32:
                createGrids(10, 10, 10);
                spreadLife(liferate);
                checkLife();
                break;
            case 80:
                paused = !paused;
            
        }
    })

    render();
}

function render() {
    gl.clear(gl.COlOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = mat4();
    mv = mult(mv, rotateX(spinX));
    mv = mult(mv, rotateY(spinY));

    mv1 = mult(mv, translate(frog[0], frog[1], frog[2]));
    mv1 = mult(mv1, scalem(0.08, 0.08, 0.08));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);

    for (var i = 1; i < entities.length; i++) {
        for (var j = 0; j < entities[i].length; j++) {
            coord = entities[i][j];
            mv1 = mult(mv, translate(coord[0], coord[1], coord[2]));
            mv1 = mult(mv1, scalem(coord[3]*0.1, 0.08, 0.08));
            gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
            gl.drawArrays(gl.TRIANGLES, 0, numVertices);
        }
    }
    for (var i = 0; i < endWalls.length; i++) {
        mv1 = mult(mv, translate(endWalls[i][0], endWalls[i][1], endWalls[i][2]));
        mv1 = mult(mv1, scalem(0.1, 0.1, 0.1));
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    }

    if (endFrogs.length > 0) {
        for (var i = 0; i < endFrogs.length; i++) {
            mv1 = mult(mv, translate(endFrogs[i][0], endFrogs[i][1], endFrogs[i][2]));
            mv1 = mult(mv1, scalem(0.08, 0.08, 0.08));
            gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
            gl.drawArrays(gl.TRIANGLES, 0, numVertices);
        }
    }
    if (!paused) { time += 0.5; }
    
    if (time >= interval) {
        time = 0;
    }
    
    if (!frog) {
        console.log("frog is null");
    }

    //checkCollision();
    requestAnimationFrame(render);
}