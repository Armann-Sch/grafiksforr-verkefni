var canvas;
var gl;

var numVertices = 36;

var points = [];
var colors = [];

var matrixLoc;

// Variables to determine gamestate
var gameWon = false;
var gameOver = false;
var lives = 3;

// Variables to define different sections of the board
var street_start = 1.0;
var street_end = 3.0;
var river_start = 5.0;
var river_end = 8.0;

var right_edge;
var left_edge;

var defaultSpeed = 0.1;

var entities;
var backgroundStreet;
var backgroundRiver;
var backgroundSidewalk;

var frogPos = vec3(7.0, 0.0, 0.0);
var frogRot = 0;
/*
function setupBoard() {
    frog = [6.5, 0.0, 1.0];

    entities = new Array(11);
    // [x, y, z, width, speed]
    // Cars
    entities[1] = [ // Three one width cars
        [0.0, 1.0, 1.0, 1, 0.1],
        [0.0, 1.0, 1.0, 1, 0.1],
        [0.0, 1.0, 1.0, 1, 0.1]
    ];
    entities[2] = [[]]; 
    entities[1] = [ // Three one width cars
        [0.0, 2.0, 1.0, 1, 0.15],
        [],
        []
    ];
    
    // Logs and turtles on the river
    // // Turtles
    entities[6] = [
        vec3(), vec3(), vec3(),
        vec3(), vec3(), vec3()
    ];
    entities[8] = [
        vec3(), vec3(),
        vec3(), vec3(), vec3(), vec3()
    ];
    // // Logs
    entities[5] = [vec3(), vec3(), vec3()];
    entities[7] = [vec4(), vec4()];
    entities[9] = [vec4(), vec4()];
    // End points on top of the screen
    entities[10] = [];
}
*/
function checkCollision() {
    if (frog.y >= street_start && frog.y <= street_end) {
        
    }
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);

    //colorFrog();

    // Adjust for board
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

    canvas.addEventListener("keydown", function(e) {

    })
}