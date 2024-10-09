
var canvas;
var gl;

// 
var numVertices = 36;

var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var matrixLoc;

// Grids for Conway's Life
var grid;
var newgrid;


grid = new Array(12);
for (i = 0; i < grid.length; i++) {
    grid[i] = new Array(12);
    for (j = 0; j < grid[i].length; j++) {
        grid[i][j] = new Array(12);
    }
}
grid.fill(0);

console.log(grid[11][11][11]);
/*
grid = new Array(10);
for (i = 0; i < grid.length; i++) {
    grid[i] = new Array(10);
    newgrid[i] = new Array(10);
    for (j = 0; j < grid[i].length; j++) {
        grid[i][j] = new Array(10);
        newgrid[i][j] = new Array(10);
        for (k = 0; k < grid[i][j].length; k++) {
            var l = Math.random();
            if(l <= 0.45) { grid[i][j][k] = 1; }
            else { grid[i][j][k] = 0; }
            newgrid[i][j][k] = 0;
        }
    }
}

function checkLife(oldGrid) {
    for(i = 0; i < oldGrid.length; i++) {
        if(i == 0) {
            xmin = 0;
            xmax = 1;
        }
        else if( i == oldGrid.length-1) {
            xmin = i-1;
            xmax = i;
        }
        else {
            xmin = i-1;
            xmax = i+1;
        }
        for(j = 0; oldGrid[i].length; j++) {
            if (j == 0) {
                ymin = 0;
                ymax = 1;
            }
            else if (j == oldGrid[i].length-1) {
                ymin = j-1;
                ymax = j;
            }
            else {
                ymin = j-1;
                ymax = j+1;
            }
            for (k = 0; oldGrid[i][j].length; k++) {
                if (k == 0) {
                    zmin = 0;
                    zmax = 1;
                }
                else if (k == oldGrid[i][j].length-1) {

                }
            }
        }

    }
    // Edge cases to remember:
    // // Left or right
    // // Top or bottom
    // // Front or back
}
*/
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

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");


}

function render() {

}