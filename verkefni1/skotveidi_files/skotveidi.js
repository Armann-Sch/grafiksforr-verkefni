// 
var canvas;
var gl;

var mouseX;             //
var movement = false;   //

var birdcount = 1;      // The number of birds that will be rendered
var points = 0;         // The current score, i.e. number of birds shot
var bulletlimit = 1;    // Number of of bullets permitted to exist at a time
var bulletcount = 0;    // Number of currently active bullets

var bulletoffset = 3 + birdcount * 4;


window.onload = function intit() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL is not available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Starting vertices for the triangle
    var vertices = [
        vec2(-0.05, -0.9),
        vec2(0, -0.8),
        vec2(0.05, -0.9),
    ];
    
    // Array to store the starting vertices of the birds
    var b_vertices = [
        vec2(-1, 0.5),
        vec2(-1, 0.6),
        vec2(-0.85, 0.5),
        vec2(-0.85, 0.6),
    ];

    vertices = vertices.concat(b_vertices);

    console.log(vertices);
    var score_display = [
        vec2(-1, 1),
        vec2(-1, 0,9),
        vec2(-0,95, 1),
        vec2(-0,95, 0,9)
    ]

    //
    var bufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);    

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    canvas.addEventListener("mousedown", function(e){
        movement = true;
        mouseX = e.offsetX;
        if(e.button === 1 && bulletcount < bulletlimit) {
            var x = vertices[1][0] -0.25;
            var y = vertices[1][1];
            bullet_verts.push(makeBullet(x, y));  // New bullet will be added starting from the top of the triangle
        }

    });

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    });

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            var xmove = 2*(e.offsetX - mouseX)/canvas.width;
            mouseX = e.offsetX;
            for(i=0; i<3; i++) {
                vertices[i][0] += xmove;
            }

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        }
    });

    render();
}

function makeBirds(y) {
    return bird = [
        (-1, y),
        (-1, y+0.1),
        (-0,85, y),
        (-0.85, y+0.1)
    ];
}

function makeBullet(x, y) {
    return bullet = [
        (x, y),
        (x, y+0.5),
        (x+0.5, y),
        (x+0.5, y+0.5)
    ];
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);  // Draw the player triangle

    //gl.drawArrays(gl.TRIANGLE_STRIP, 3, 4);    // Draw the bird
    var j = 3;
    for (i=0; i < birdcount; i++) {
        gl.drawArrays(gl.TRIANGLE_STRIP, j, 4);
        j += 4;
    }

    window.requestAnimationFrame(render);
}