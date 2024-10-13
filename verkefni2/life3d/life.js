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

// Grids for Conway's Life
var grid;
var newgrid;

// Variables used to define the interval between checks
var paused = false;
var time = 0;
var interval = 5;

var liferate = 0.2;

// Variables subtracted from the value when sclaing a growing or shrinking cube
var deathsubtract = 0; 
var birthsubstract = 0.06;


// Grid sizes are defined and the grids filled in with zeroes
function createGrids(width, height, depth){
    grid = new Array(width);
    newgrid = new Array(width);
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(height);
        newgrid[i] = new Array(height);
        for (var j = 0; j < grid[i].length; j++) {
            grid[i][j] = new Array(depth);
            newgrid[i][j] = new Array(depth);
            grid[i][j].fill(0);
            newgrid[i][j].fill(0);
        }
    }
}

// Insert life into grid with a specified spawnrate
function spreadLife(spawnrate) {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            for (var k = 0; k < grid.length; k++) {
                if (Math.random() <= spawnrate) {
                    grid[i][j][k] = 1;
                }
                else {
                    grid[i][j][k] = 0;
                }
            }
        }
    }
}

function count(x, y, z) {
    var count = -1; // Start at -1 because the cell being checked is also counted
    var xmin = x-1;
    var xmax = x+1;
    var ymin = y-1;
    var ymax = y+1;
    var zmin = z-1;
    var zmax = z+1;
    var limit = grid.length-1;

    // Check for edges
    if (x == 0) { xmin = 0; }
    else if (x == limit) { xmax = x; }
    if (y == 0) { ymin = 0; }
    else if (y == limit) { ymax = y; }
    if (z == 0) { zmin = 0; }
    else if (z == limit) { zmax = z; }

    for (var i = xmin; i <= xmax; i++) {
        for (var j = ymin; j <= ymax; j++) {
            for (var k = zmin; k <= zmax; k++) {
                if (grid[i][j][k] == 1) { count++; }
            }
        }
    }

    if (count == 6) {
        newgrid[x][y][z] = 1;
    }
    else if (grid[x][y][z] == 1 && (count >= 5 && count <= 7)) {
        newgrid[x][y][z] = 1;
    }
    else {
        newgrid[x][y][z] = 0;
    }
}

// Grid is checked for life
function checkLife() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            for (var k = 0; k < grid.length; k++) {
                count(i, j, k);
            }
        }
    }
}

// The values of the new grid are put into the old grid
function updateGrid() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            for (var k = 0; k < grid[i][j].length; k++) {
                grid[i][j][k] = newgrid[i][j][k];
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

createGrids(10, 10, 10);

spreadLife(liferate);

checkLife();

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
    document.getElementById("timeInterval").onchange = function(event) {
        interval = event.target.value;
    }
    
    // Change the probabilty of a square being filled at the start
    document.getElementById("lifeChance").onchange = function(event) {
        liferate = event.target.value;
    }

    window.addEventListener("keydown", function(e){
        switch (e.keyCode) {
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

    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            for (var k = 0; k < grid.length; k++) {
                if (newgrid[i][j][k] == 1) {
                    if (grid[i][j][k] == 1) {
                        // Cube remains the same
                        mv1 = mult(mv, translate(i*0.1, j*0.1-0.5, k*0.1));
                        mv1 = mult(mv1, scalem(0.08, 0.08, 0.08));
                        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
                        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
                    }
                    else {
                        // Cube is growing
                        mv1 = mult(mv, translate(i*0.1, j*0.1-0.5, k*0.1));
                        mv1 = mult(mv1, scalem(0.08-birthsubstract, 0.08-birthsubstract, 0.08-birthsubstract));
                        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
                        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
                    }
                }
                else if(grid[i][j][k]) {
                    mv1 = mult(mv, translate(i*0.1, j*0.1-0.5, k*0.1));
                        mv1 = mult(mv1, scalem(0.08-deathsubtract, 0.08-deathsubtract, 0.08-deathsubtract));
                        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
                        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
                }               
            }
        }
    }

    if (!paused) { time += 0.5; }
    
    if (time >= interval) {
        time = 0;
        deathsubtract += 0.01;
        birthsubstract -= 0.01;
        if (deathsubtract >= 0.06) {
            deathsubtract = 0.0;
            birthsubstract = 0.06;
            updateGrid();
            checkLife();
        }
    }
    requestAnimationFrame(render);
}