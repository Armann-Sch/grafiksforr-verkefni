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
var frog;
var frogy = 0;

var fly = [];

var entities;
var endWalls;
var endFrogs = new Array();
var freeSpots;

var left_edge = -7;
var right_edge = 7;

// Variables used to define the interval between checks
var paused = false;
var time = 0;
var interval = 5;

// Frog is initialized
function resetFrog() {
    frog = [0.0, 0.5, -1, 1, 0];
}

function addFly() {
    if (fly.length === 0) {
        fly = freeSpots[(Math.floor(Math.random()*freeSpots.length))];
        freeSpots.splice(fly, 1);
    }
}

// Resets the game to start state
function setupGame() {
    // Game state variables reset
    gameWon = false;
    gameOver = false;
    lives = 5;

    // Frog reset
    resetFrog();
    // Table keeping track of entities initialized
    entities = new Array(9).fill(new Array());
    // Cars
    entities[1] = [
        [-6, 1.5, -1, 1, 0.05],
        [-8, 1.5, -1, 1, 0.05],
        [-10, 1.5, -1, 1, 0.05]
    ];
    entities[2] = [
        [7, 2.5, -1, 2, -0.1]
    ];
    entities[3] = [
        [-6, 3.5, -1, 1, 0.075],
        [-8, 3.5, -1, 1, 0.075],
        [-10, 3.5, -1, 1, 0.075],
    ];
    // Logs and turtles
    entities[5] = [ // Logs
        [-6, 5.5, 0, 2, 0.05],
        [-8, 5.5, 0, 2, 0.05],
        [-10, 5.5, 0, 2, 0.05]
    ];
    entities[6] = [ // Turtles
        [7, 6.5, 0, 1, -0.1, 1],
        [8, 6.5, 0, 1, -0.1, 1],
        
        [11, 6.5, 0, 1, -0.1, 1],
        [12, 6.5, 0, 1, -0.1, 1],
    ];
    entities[7] = [ // Logs
        [-6, 7.5, 0, 4, 0.075]
    ];
    entities[8] = [ //Turtles
        [65, 8.5, 0, 1, -0.01, 1],
        [75, 8.5, 0, 1, -0.01, 1],
        [85, 8.5, 0, 1, -0.01, -1],
        [95, 8.5, 0, 1, -0.01, -1]
    ];
    // Back walls
    endWalls = [
        [-5, 8.5, -1, 1, 0],
        [-3, 8.5, -1, 1, 0],
        [-1, 8.5, -1, 1, 0],
        [1, 8.5, -1, 1, 0],
        [3, 8.5, -1, 1, 0],
        [5, 8.5, -1, 1, 0]
    ];

    endFrogs = new Array();

    freeSpots = [
        [-4, 8.5, -1],
        [-2, 8.5, -1],
        [0, 8.5, -1],
        [2, 8.5, -1],
        [4, 8.5, -1],
        [0, 4.5, -0.5]
    ];
}

function updateMovement() {
    frog[0] += frog[4];
    if (frog[0] <= -5) {
        frog[0] = -5;
    }
    else if (frog[0] >= 5) {
        frog[0] = 5;
    }

    for (var i = 0; i < entities.length; i++) {
        if (entities[i]) {
            for (var j = 0; j < entities.length; j++) {
                if (entities[i][j]) {
                    // If object is moving to the right
                    if(entities[i][j][4] >= 0) {
                        if(entities[i][j][0]-entities[i][j][3]*0.5 > right_edge) {
                            entities[i][j][0] = left_edge-entities[i][j][3]*0.5;
                        }
                    }
                    // If object is moving to the left
                    else {
                        if(entities[i][j][0]+entities[i][j][3]*0.5 < left_edge) {
                            entities[i][j][0] = right_edge+entities[i][j][3]*0.5;
                        }
                    }
                    entities[i][j][0] += entities[i][j][4];
                }
            }
        }
    }
}

function checkCollision() {
    var y = Math.floor(frog[1]);
    if (y <= 4 || y >= 9) { frog[4] = 0; }
    if (fly.length != 0) {
        if (fly[1] == 4.5 && y == 4) {
            if (frog[0]-0.4 <= fly[0]-0.3 && fly[0]-0.3 <= frog[0]+0.4) {
                score += 500;
                fly = [];
                freeSpots.push([0, 4.5, -0.5])
            }
            else if(frog[0]-0.4 <= fly[0]+0.3 && fly[0]+0.3 <= frog[0]+0.4) {
                score += 500;
                fly = [];
                freeSpots.push([0, 4.5, -0.5]);
            }
        } 
    }
    if (y == 8) {
        var hitLeaf = false;
        for (var i = 0; i < endWalls.length-1; i++) {
            if (frog[0] > endWalls[i][0]+0.2 && frog[0] < endWalls[i+1][0]-0.2) {
                
                endFrogs.push([endWalls[i][0]+1, endWalls[i][1], -0.5, 1]);
                if (fly.length != 0) {
                    if (fly[0] == endFrogs[endFrogs.length-1][0]) {
                        score += 500;
                        fly = [];
                    }
                }
                hitLeaf = true;
                score += 1000;
                console.log(score);
                resetFrog();
            }
        }
        if (!hitLeaf) {
            lives--;
            resetFrog();
        }
    }
    else if (1 <= y && y <= 3) {
        for(var i = 0; i < entities[y].length; i++) {
            if (entities[y][i][0]-(entities[y][i][3]*0.5) <= frog[0]-0.4 && frog[0]-0.4 <= entities[y][i][0]+(entities[y][i][3]*0.5)) {
                lives--;
                resetFrog();
            }
            else if (entities[y][i][0]-(entities[y][i][3]*0.5) <= frog[0]+0.4 && frog[0]+0.4 <= entities[y][i][0]+(entities[y][i][3]*0.5)) {
                lives--;
                resetFrog();
            }
        }
    }
    else if (y >= 5 && y <= 7) {
        var onLog = false;
        for(var i = 0; i < entities[y].length; i++) {
            if (entities[y][i][0]-(entities[y][i][3]*0.5) <= frog[0] && frog[0] <= entities[y][i][0]+(entities[y][i][3]*0.5)) {
                onLog = true;
                if (y == 6 || y  == 8) {
                    if (entities[y][i][0] == -1) {
                        onLog = false;
                    }
                }
                frog[4] = entities[y][i][4];
            }
        }
        if (!onLog) {
            lives--;
            resetFrog();
        }
    }
}

function swapTurtles() {
    for (var i = 0; i < entities[6].length; i++) {
        entities[6][i][5] *= -1;
    }
    for (var i = 0; i < entities[8].length; i++) {
        entities[6][i][5] *= -1;
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
                if (frog[0] > -5) {
                    frog[0] -= 1;
                }
                break;
            case 38:
                if(frog[1] < 9.5){
                    frog[1] += 1;
                    frogy++;
                }
                break;
            case 39:
                if (frog[0] < 5) {
                    frog[0] += 1;
                }
                break;
            case 40:
                if (frog[1] > 0) {
                    frog[1] -= 1;
                    frogy--;
                }
                break;
            
            /*case 32:
                createGrids(10, 10, 10);
                spreadLife(liferate);
                checkLife();
                break;*/
            case 80:
                paused = !paused;
            
        }
    })

    render();
}

function render() {
    gl.clear(gl.COlOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (endFrogs.length == 5) {
        gameWon = true;
        gameOver = true;
        paused = true;
    }
    if (lives <= 0) {
        gameOver = true;
        paused = true;
    }

    var mv = mat4();
    mv = mult(mv, rotateX(spinX));
    mv = mult(mv, rotateY(spinY));

    mv1 = mult(mv, translate(frog[0]/10, frog[1]/10, frog[2]/10));
    mv1 = mult(mv1, scalem(0.08, 0.08, 0.08));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);

    for (var i = 1; i < entities.length; i++) {
        for (var j = 0; j < entities[i].length; j++) {
            if ((i == 6 || i == 8) && entities[i][j][5] == -1) {

            }
            else {
                coord = entities[i][j];
                mv1 = mult(mv, translate(coord[0]/10, coord[1]/10, coord[2]/10));
                mv1 = mult(mv1, scalem(coord[3]*0.1, 0.08, 0.1));
                gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
                gl.drawArrays(gl.TRIANGLES, 0, numVertices);
            }
        }
    }
    for (var i = 0; i < endWalls.length; i++) {
        mv1 = mult(mv, translate(endWalls[i][0]/10, endWalls[i][1]/10, endWalls[i][2]/10));
        mv1 = mult(mv1, scalem(0.1, 0.1, 0.1));
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    }

    if (endFrogs.length > 0) {
        for (var i = 0; i < endFrogs.length; i++) {
            mv1 = mult(mv, translate(endFrogs[i][0]/10, endFrogs[i][1]/10, endFrogs[i][2]/10));
            mv1 = mult(mv1, scalem(0.08, 0.08, 0.08));
            gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
            gl.drawArrays(gl.TRIANGLES, 0, numVertices);
        }
    }

    if (fly.length != 0) {
        mv1 = mult(mv, translate(fly[0]/10, fly[1]/10, fly[2]/10));
        mv1 = mult(mv1, scalem(0.06, 0.06, 0.06));
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    }

    if (!paused) {
        time += 0.5;
        if (time % 5 == 0) {
            swapTurtles();
        }
        checkCollision();
        updateMovement();
    }

    if (time >= 40 && fly.length == 0) {
        addFly();
        time = 0;
    }
    
    requestAnimationFrame(render);
}