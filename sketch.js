//REPORT//

//=======================================================================================================================================================================================

// This snooker application reflects my enthusiasm for both the game of snooker and innovative game design. 
// The application is developed in p5.js and uses the Matter.js package, which includes a powerful physics engine for 
// simulating realistic ball movements and interactions. My objective was to build an engaging digital snooker experience 
// that follows to traditional snooker rules and gameplay while also introducing creative aspects to increase player 
// engagement and provide distinct challenges.

// The "Random Gravity Mode" is one of my application's distinctive features. This mode is a creative enhancement to regular snooker
// that adds an unexpected twist to the gameplay. In this mode, the game's gravitational force switches direction at random intervals.
// Because of this unpredictability, players must constantly change their strategy and shots, making the game challenging and fascinating.
// This mode was inspired by my desire to include a dynamic aspect that may change the game's mechanics, providing an amount of complexity
// and keeping players on their toes. This mode works by changing the 'gravity.y' component of the world's gravity in the Matter.js 
// engine on a regular basis, resulting in varied gravitational effects on the balls.

// The app's basic concept centres around multiple modes that appeal to different skill levels and interests. In addition to the standard 
// "Normal Mode," I've included "Random Mode" and "Random Red Mode." Balls are randomly put on the table in "Random Mode," deviating from 
// the traditional triangular arrangement. This mode is intended to generate novel beginning conditions for each game, requiring players 
// to consider their shots creatively. "Random Red Mode" employs a similar approach but restricts the random placement to red balls, 
// resulting in a little more organised yet unexpected gameplay experience.

// My approach to this application was guided by two fundamental goals: preserving the spirit of snooker and including novel components 
// that make the game more engaging for the digital platform. Traditional components of snooker, such as ball mechanics, table layout, 
// and basic regulations, are meticulously kept making enthusiasts feel at ease. Simultaneously, the new modes give a new dimension to 
// the game, appealing to both conventional gamers and those looking for new challenges.

// My approach to this application was guided by two fundamental goals: preserving the spirit of snooker and including novel components 
// that make the game more engaging for the digital platform. Traditional components of snooker, such as ball mechanics, table layout, 
// and basic regulations, are meticulously kept making enthusiasts feel at ease. Simultaneously, the new modes give a new dimension to 
// the game, appealing to both conventional gamers and those looking for new challenges.

//=======================================================================================================================================================================================

var Engine = Matter.Engine;
var World= Matter.World;
var Render = Matter.Render;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Events = Matter.Events;

//variables
var engine;
var world;
var cueBall;
var canvas;
var startMouseX, startMouseY;
var endMouseX, endMouseY;
var maxVelocity = 5;

// Game modes
var normalMode;
var randomMode;
var randomRedMode;
var randomGravityMode;
var mode = 0;
let isRandomGravity = false;
let gravityInterval;
var lastColoredBallIndex = -1;

//array
var pockets = [];
var walls = [];
var balls1 = [];
var balls2 = [];
var balls3 = [];


var colorBalls1 = [];
var colorBalls2 = [];
var colorBalls3 = [];


var originalCueBallPosition;
var originalColorBalls1Positions = [];
var originalColorBalls2Positions = [];
var originalColorBalls3Positions = [];

// Colors for colorBalls
var BallsColor = [
    '#006400',  // Green
    '#8c5836',  // Brown
    '#ffff58',  // Yellow
    '#0100ff',  // Blue
    '#ff9fd5',  // Pink
    '#000000'   // Black
];

var table = {x: 0, y: 0 , l: 900, w: 450};

var tablePockets = [
    {x: -table.l/2, y: -table.w/2},
    {x: table.x, y: -table.w/2},
    {x: table.l/2, y: -table.w/2},
    {x: -table.l/2, y: table.w/2},
    {x: table.x, y: table.w/2},
    {x: table.l/2, y: table.w/2}];

var cushion = [
    {x:-table.l/2+10,y:-table.w/2},
    {x:table.x+10,y:-table.w/2},
    {x:-table.l/2+10,y:table.w/2},
    {x:table.x+10,y:table.w/2}];

var cushionWidth = 430;
var cushionHeight = 10;
var ballD = table.w/36;

// Initial setup function
function setup()
{   // Create canvas
	canvas = createCanvas(1200, 800);

    // Initialize Matter.js engine and world
    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 0;

    // Generate game elements
    generateWalls();
    generatePockets();
    generateCueBall();
    ModeButton();

    // Event listener for collisions
    Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;
    
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
    
            // Check if the collision involves the cue ball
            if (pair.bodyA === cueBall || pair.bodyB === cueBall) {
                // Determine the type of collision based on the other body
                var otherBody = pair.bodyA === cueBall ? pair.bodyB : pair.bodyA;
    

                if (otherBody.label === 'colorBall') {
                    // Collision with a color ball
                    console.log("Cue ball collided with a color ball");
                } else if (otherBody.label === 'redBall') {
                    // Collision with the red ball
                    console.log("Cue ball collided with the red ball");
                } else if (otherBody.label === 'wall') {
                    // Collision with a cushion 
                    console.log("Cue ball collided with a cushion");
                }
    
            }
        }
    });

}

// Main draw function
function draw()
{
    if (mode == 0){
        // Normal layout
        background(224); 
        Engine.update(engine);
        drawTable();
        drawCushions();
        drawCueBall();
        drawCue();
        generateText();
    }

    else if (mode == 1){
        // Normal Mode
        background(224); 
        Engine.update(engine);
        drawTable();
        drawCushions();
        drawCueBall();
        drawBalls1();
        drawCue();
        updateBalls1Array();
        fill(0);
        textSize(20);
        text("score: " + (15-balls1.length), 350,-350);
        generateText();
    }

    else if(mode == 2){
        // Ramdom Mode
        background(224); 
        Engine.update(engine);
        drawTable();
        drawCushions();
        drawCueBall();
        drawBalls2();
        drawCue();
        updateBalls2Array();
        fill(0);
        textSize(20);
        text("score: " + (15-balls2.length), 350,-350);
        generateText();
    }

    else if(mode == 3){
        // Random Red Mode
        background(224); 
        Engine.update(engine);
        drawTable();
        drawCushions();
        drawCueBall();
        drawBalls3();
        drawCue();
        updateBalls3Array();
        fill(0);
        textSize(20);
        text("score: " + (15-balls3.length), 350,-350);
        generateText();
    }

}
//Function to draw instruction
function generateText()
{    
    textSize(20);
    fill(0);
    textAlign(CENTER);
    text('Press "1" or press the Normal Mode button to play with Normal Mode',0,270);
    text('Press "2" or press the Random Mode button to play with Random Mode',0,300);
    text('Press "3" or press the Random Red Mode button to play with Ramdom Red Mode',0,330);
}

// Helper function to draw the table
function drawTable()
{
    stroke(0);
    translate(width/2,height/2);
    rectMode(CENTER);
    // fill(165,105,30);
    // rect(table.x,table.y,table.l + 30,table.w + 30);
    drawWalls();

    for(var i = 0; i < tablePockets.length; i++)
        {
            fill(250, 235, 10);
            rect(tablePockets[i].x, tablePockets[i].y, 30, 30)
        };

    fill(80,135,30);
    rect(table.x,table.y,table.l,table.w);
    
    //draw pockets
    for(var i = 0; i < pockets.length; i++)
        {          
            ellipseMode(CENTER);
            fill(0);
            ellipse(pockets[i].position.x, pockets[i].position.y, ballD*1.5);
        };

    stroke(255);
    line(-table.l/10*3,table.w/2-2,-table.l/10*3,-table.w/2);

    noFill();
    ellipseMode(CORNER);
    arc(-table.l/15*5.75,-table.w/6,table.w/3,table.w/3,1.57,4.71);
};


// Helper function to draw the cushions
function drawCushions()
{
    for(var i = 0; i < cushion.length; i++)
    {
        if(i<2){
            noStroke();
            fill(50, 105, 25);
            beginShape();
            vertex(cushion[i].x,cushion[i].y);
            vertex(cushion[i].x + cushionWidth,cushion[i].y);
            vertex(cushion[i].x + cushionWidth-cushionHeight,cushion[i].y+cushionHeight);
            vertex(cushion[i].x+cushionHeight,cushion[i].y+cushionHeight);
            endShape();}  
        
        else { 
            noStroke();
            fill(50, 105, 25);
            beginShape();
            vertex(cushion[i].x,cushion[i].y);
            vertex(cushion[i].x + cushionWidth,cushion[i].y);
            vertex(cushion[i].x + cushionWidth-cushionHeight,cushion[i].y-cushionHeight);
            vertex(cushion[i].x+cushionHeight,cushion[i].y-cushionHeight);
            endShape();
        }
    };

    noStroke();
    fill(50, 105, 25);
    beginShape();
    vertex(-table.l/2,-table.w/2+cushionHeight);
    vertex(-table.l/2+cushionHeight,-table.w/2+20);
    vertex(-table.l/2+cushionHeight,table.w/2-20);
    vertex(-table.l/2,table.w/2-cushionHeight);
    endShape();

    beginShape();
    vertex(table.l/2,-table.w/2+cushionHeight);
    vertex(table.l/2-cushionHeight,-table.w/2+20);
    vertex(table.l/2-cushionHeight,table.w/2-20);
    vertex(table.l/2,table.w/2-cushionHeight);
    endShape();
};

// Helper function to generate pockets
function generatePockets(){
    // create pocketsBodies
    for (var i = 0; i < tablePockets.length; i++) {
        var pocket = Bodies.circle(tablePockets[i].x, tablePockets[i].y, (ballD/2)*1.5, {
            isStatic: true,
            isPocket: true
        });
        pockets.push(pocket);
}

World.add(world,pockets);
};

// Helper function to generate walls
function generateWalls(){
    var wall1 = Bodies.rectangle(0,-230,928,15, { isStatic: true, friction:1, restitution: 0.5, label: 'wall'});
    var wall2 = Bodies.rectangle(0,232,928,15, {isStatic: true, friction:1, restitution: 0.5, label: 'wall'});
    var wall3 = Bodies.rectangle(457,0,15,475, {isStatic: true, friction:1, restitution: 0.5, label: 'wall'}); 
    var wall4 = Bodies.rectangle(-455,0,15,475, {isStatic: true, friction:1, restitution: 0.5, label: 'wall'}); 

    walls.push(wall1);
    walls.push(wall2);
    walls.push(wall3);
    walls.push(wall4);
    
    World.add(world, [wall1, wall2, wall3,wall4]);
};

// Helper function to generate cue ball
function generateCueBall(){
    cueBall = Bodies.circle(-table.l/15*5-15,15, ballD/2, {restitution:0.8, friction: 0.5, gravityScale: 0}); 
    originalCueBallPosition = { x: cueBall.position.x, y: cueBall.position.y };

    World.add(world,[cueBall]);
};

// Helper function to draw walls
function drawWalls() {
    fill(165,105,30);
        for (var i=0;i<walls.length;i++){
            drawVertices (walls[i].vertices);
        }
 };

 // Helper function to draw the cue ball
function drawCueBall(){
    fill(255);
    stroke(0);
    ellipseMode(CENTER);
    ellipse(cueBall.position.x, cueBall.position.y, ballD);
};

// // Helper function to draw vertices
function drawVertices(vertices){
    beginShape();
    for (var i = 0; i < vertices.length; i++) { 
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape (CLOSE);
};

// Helper function to generate ball (normal mode)
function generateBalls1() {

    var startX = table.l / 15 * 4.5+25; // Starting x-coordinate for the straight line
    var startY = -24; // Starting y-coordinate for the straight line

    var numberOfRows = 5; // The number of rows in the triangle

    for (var row = 0; row < numberOfRows; row++) {
        for (var col = 0; col < numberOfRows - row; col++) {
            var ballX = startX - 13 * row;
            var ballY = startY + col * ballD + 6 * row;

            var ball = Bodies.circle(
                ballX,
                ballY,
                ballD / 2,
                { restitution: 0.8, friction: 0.2, label: 'redBall' }
            );
            balls1.push(ball);
        }
    }

    var greenBall = Bodies.circle(-table.l/15*4.5,-table.w/6, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var brownBall = Bodies.circle(-table.l/15*4.5,0, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var yellowBall = Bodies.circle(-table.l/15*4.5,0+table.w/6, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var blueBall = Bodies.circle(0,0, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var pinkBall = Bodies.circle(0+table.l/5+48,0, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var blackBall = Bodies.circle(table.l/3*1.3,0, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 

    colorBalls1.push(greenBall,brownBall,yellowBall,blueBall,pinkBall,blackBall);

    for (var i = 0; i < colorBalls1.length; i++) {
        originalColorBalls1Positions[i] = { x: colorBalls1[i].position.x, y: colorBalls1[i].position.y };
    }

    World.add(world, balls1);
    World.add(world, colorBalls1);

};

// Helper function to generate ball (random mode)
function generateBalls2() {
    var totalBalls = 21;
    var colorBallsCount = 6;

    // Generate 15 balls with random locations
    for (var i = 0; i < totalBalls; i++) {
        var ballX = random(-table.l / 2, table.l / 2);
        var ballY = random(-table.w / 2, table.w / 2);

        var ballLabel = i < colorBallsCount ? 'colorBall' : 'redBall';

        var ball = Bodies.circle(
            ballX,
            ballY,
            ballD / 2,
            { restitution: 0.8, friction: 0.2, label:ballLabel }
        );

        // If it's one of the first 6 balls, add it to the colorBalls2 array
        if (i < colorBallsCount) {
            colorBalls2.push(ball);
        }

        else{// Add the ball to the general balls array
        balls2.push(ball);
        }
    }

    for (var i = 0; i < colorBalls2.length; i++) {
        originalColorBalls2Positions[i] = { x: colorBalls2[i].position.x, y: colorBalls2[i].position.y };
    }

    // Add both arrays to the world
    World.add(world, balls2);
    World.add(world, colorBalls2);
}

// Helper function to generate ball (random red mode)
function generateBalls3() {
    var totalBalls = 15;
    // Generate 15 balls with random locations
    for (var i = 0; i < totalBalls; i++) {
        var ballX = random(-table.l / 2, table.l / 2);
        var ballY = random(-table.w / 2, table.w / 2);

        var ball = Bodies.circle(
            ballX,
            ballY,
            ballD / 2,
            { restitution: 0.8, friction: 0.2, label:'redBall' }
        );

        balls3.push(ball); // Add the ball to the array
    }

    var greenBall = Bodies.circle(-table.l/15*4.5,-table.w/6, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var brownBall = Bodies.circle(-table.l/15*4.5,0, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var yellowBall = Bodies.circle(-table.l/15*4.5,0+table.w/6, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var blueBall = Bodies.circle(0,0, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var pinkBall = Bodies.circle(0+table.l/5+48,0, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 
    var blackBall = Bodies.circle(table.l/3*1.3,0, ballD/2, {restitution:0.8, friction: 0.2,label:'colorBall'}); 

    colorBalls3.push(greenBall,brownBall,yellowBall,blueBall,pinkBall,blackBall);

    for (var i = 0; i < colorBalls3.length; i++) {
        originalColorBalls3Positions[i] = { x: colorBalls3[i].position.x, y: colorBalls3[i].position.y };
    }

    // Add the array of balls to the world
    World.add(world, balls3);
    World.add(world, colorBalls3);

}

// Helper function to draw ball (normal mode)
function drawBalls1() {
    for (var i = 0; i < balls1.length; i++) {
        fill(255,0,0);
        stroke(0);
        ellipse(balls1[i].position.x, balls1[i].position.y, ballD);
    }

    for (var i = 0; i < colorBalls1.length; i++){
        fill(BallsColor[i]);
        stroke(0);
        ellipse(colorBalls1[i].position.x, colorBalls1[i].position.y, ballD);
    }
};

// Helper function to draw ball (random mode)
function drawBalls2(){
    for (var i = 0; i < balls2.length; i++) {
        fill(255,0,0);
        stroke(0);
        ellipse(balls2[i].position.x, balls2[i].position.y, ballD);
    }

    for (var i = 0; i < colorBalls2.length; i++){
        fill(BallsColor[i]);
        stroke(0);
        ellipse(colorBalls2[i].position.x, colorBalls2[i].position.y, ballD);
    }
};

// Helper function to draw ball (random red mode)
function drawBalls3(){
    for (var i = 0; i < balls3.length; i++) {
        fill(255,0,0);
        stroke(0);
        ellipse(balls3[i].position.x, balls3[i].position.y, ballD);
    }

    for (var i = 0; i < colorBalls3.length; i++){
        fill(BallsColor[i]);
        stroke(0);
        ellipse(colorBalls3[i].position.x, colorBalls3[i].position.y, ballD);
    }
};

function mousePressed() {
    // Save the starting position of the mouse
    startMouseX = mouseX;
    startMouseY = mouseY;
}

function mouseReleased() {
    // Save the ending position of the mouse
    endMouseX = mouseX;
    endMouseY = mouseY;

    // Calculate the distance between starting and ending positions
    var distanceX = min(60,endMouseX - startMouseX);
    var distanceY = min(60,endMouseY - startMouseY);

    // Set a maximum force value to avoid excessive force
    var maxForce = 0.00003;

    // Calculate the magnitude of the force based on distance
    var forceMagnitude = Math.min(Math.sqrt(distanceX ** 2 + distanceY ** 2) * 0.1, maxForce);

    // Calculate the direction of the force
    var forceX = -distanceX * forceMagnitude;
    var forceY = -distanceY * forceMagnitude;

    // Apply the force to the cue ball
    if (isCueBallStopped()){
        Body.applyForce(cueBall, { x: cueBall.position.x, y: cueBall.position.y }, { x: forceX, y: forceY });
    }

    else if(isRandomGravity) {
        Body.applyForce(cueBall, { x: cueBall.position.x, y: cueBall.position.y }, { x: forceX, y: forceY }); 
    }

    // Limit the velocity of the cue ball
    var velocityMagnitude = Math.sqrt(cueBall.velocity.x ** 2 + cueBall.velocity.y ** 2);
    if (velocityMagnitude > maxVelocity) {
        // Scale down the velocity if it exceeds the maximum
        var scale = maxVelocity / velocityMagnitude;
        Body.setVelocity(cueBall, { x: cueBall.velocity.x * scale, y: cueBall.velocity.y * scale });
    }
}

// Helper function to draw cue
function drawCue() {
   // Check if the mouse is pressed and cue ball is stopped
    if (!mouseIsPressed && isCueBallStopped()) {
        // Calculate the direction from cue ball to mouse position
        var cueDirection = createVector(-cueBall.position.x-mouseX , -cueBall.position.y-mouseY);
        
        // Calculate the angle of the cue line
        var cueAngle = cueDirection.heading();
        
        // Draw the aiming line
        push();
        translate(cueBall.position.x, cueBall.position.y);
        rotate(cueAngle);
        stroke(255,0,0); // red color for the aiming line
        strokeWeight(1);
        line(0, 0, 100, 0); 
        pop();

        // Draw the cue behind the cue ball
        push();
        translate(cueBall.position.x, cueBall.position.y);
        rotate(cueAngle);
        fill(102, 51, 0); // Brown color for the cue line
        rect(-160, -1.5, 300, 5);
        fill(0);
        rect(-12, -1.5, 5, 5);
        pop();
    }
}

// Function to check if the cue ball is stopped
function isCueBallStopped() {
    // Calculate the magnitude of the cue ball's velocity vector
    var velocityMagnitude = dist(0, 0, cueBall.velocity.x, cueBall.velocity.y);
    
    // Set a threshold for determining if the cue ball is stopped
    var velocityThreshold = 0.1; // Adjust as needed
    
    // Return true if the cue ball's velocity is below the threshold
    return velocityMagnitude < velocityThreshold;
}

// Helper function to generate mode button
function ModeButton(){
    // Button for Normal Mode
    normalMode = createButton('Normal Mode');
    normalMode.position(30,30);
    normalMode.mousePressed(function(){
        mode1();
    });

    // Button for Random Mode
    randomMode = createButton('Random Mode');
    randomMode.position(30,60);
    randomMode.mousePressed(function(){
       mode2();
    });

    // Button for Random Red Mode
    randomRedMode = createButton('Random Red Mode');
    randomRedMode.position(30,90);
    randomRedMode.mousePressed(function(){
       mode3();
    });

    // Button for Random Gravity Mode
    randomGravityMode = createButton('Random Gravity Mode');
    randomGravityMode.position(30,120);
    randomGravityMode.mousePressed(function(){
        // Toggle random gravity mode
        isRandomGravity = !isRandomGravity;
            // Set initial gravity value based on the condition
        if (isRandomGravity) {
                // Call setInterval to update gravity every 250 milliseconds
                gravityInterval = setInterval(function () {
                    engine.world.gravity.y = random(-0.5, 0.5);
                }, 250);
            } 
            
            else if(!isRandomGravity){
                // Reset gravity to default (0)
                engine.world.gravity.y = 0;

                // Clear the interval for updating gravity
                clearInterval(gravityInterval);
            }
            });
}

//Function to set mode with keycode
function keyPressed() {
    if (keyCode === 49 || keyCode === 97) {
        mode1();
    } 
    
    if (keyCode === 50 || keyCode === 98) {
        mode2();
    }
    
    if (keyCode === 51 || keyCode === 99) {
        mode3();
    }
  }

//Function to set mode
function mode1(){
    // Set mode to 1 (Normal Mode)
    mode = 1;
        
    // Clear arrays for other modes
    clearArray();

    // Generate balls for Normal Mode
    generateBalls1();
}

function mode2(){
     // Set mode to 2 (Random Mode)
     mode = 2;
     Engine.update(engine);
     
     // Clear arrays for other modes
     clearArray();

     // Generate balls for Random Mode
     generateBalls2();
}

function mode3(){
     // Set mode to 3 (Random Red Mode)
     mode = 3;
     Engine.update(engine);
     
     // Clear arrays for other modes
     clearArray();

     // Generate balls for Random Red Mode
     generateBalls3();
}

// Helper funcion to clear arrays for other modes
function clearArray(){
     balls1.splice(0, balls1.length);
     colorBalls1.splice(0, colorBalls1.length);
     balls2.splice(0, balls2.length);
     colorBalls2.splice(0, colorBalls2.length);
     balls3.splice(0, balls3.length);
     colorBalls3.splice(0, colorBalls3.length);
}


// Function to check if a ball is in a pocket
function isBallInPocket(ball, pocket) {
    var distance = dist(ball.position.x,ball.position.y,pocket.position.x,pocket.position.y); 
    return distance < ballD*2;
}

// Functions to reset color balls
function resetColorBall1(index) {
    Body.setPosition(colorBalls1[index], originalColorBalls1Positions[index]);
    Body.setVelocity(colorBalls1[index], { x: 0, y: 0 });
}
function resetColorBall2(index) {
    Body.setPosition(colorBalls2[index], originalColorBalls2Positions[index]);
    Body.setVelocity(colorBalls2[index], { x: 0, y: 0 });
}
function resetColorBall3(index) {
    Body.setPosition(colorBalls3[index], originalColorBalls3Positions[index]);
    Body.setVelocity(colorBalls3[index], { x: 0, y: 0 });
}

// Functions to reset cue ball
function resetCueBall() {
    Body.setPosition(cueBall, originalCueBallPosition);
    Body.setVelocity(cueBall, { x: 0, y: 0 });
}

// Functions to update arrays of balls based on collisions
function updateBalls1Array() {
    for (var i = balls1.length - 1; i >= 0; i--) {
        for (var j = 0; j < pockets.length; j++) {
            if (isBallInPocket(balls1[i], pockets[j])) {
                // Ball is in the pocket, remove it from the array
                balls1.splice(i, 1);
                break; // No need to check other pockets for the same ball
            }
        }
    };

    for (var i = 0; i < colorBalls1.length; i++) {
        for (var j = 0; j < pockets.length; j++) {
            if (isBallInPocket(colorBalls1[i], pockets[j])) {
                // Ball is in the pocket, reset it to its original position
                resetColorBall1(i);

                // Check for consecutive colored balls falling into the pocket
                if (lastColoredBallIndex !== -1 && Math.abs(lastColoredBallIndex - i) === 1) {
                    // Notify the user of the mistake (you can replace this with your notification logic)
                    console.log("Two consecutive colored balls fell into the pocket!");
                }

                lastColoredBallIndex = i;
                break; // No need to check other pockets for the same ball
                
            }
        }
    }

    // Check if the cue ball is in the pocket
    for (var j = 0; j < pockets.length; j++) {
        if (isBallInPocket(cueBall, pockets[j])) {
            // Cue ball is in the pocket, reset it to its original position
            resetCueBall();
            // Reset the last colored ball index when the cue ball falls
            lastColoredBallIndex = -1;
            break; // No need to check other pockets for the cue ball
        }
    }
}

function updateBalls2Array() {
    for (var i = balls2.length - 1; i >= 0; i--) {
        for (var j = 0; j < pockets.length; j++) {
            if (isBallInPocket(balls2[i], pockets[j])) {
                // Ball is in the pocket, remove it from the array
                balls2.splice(i, 1);
                break; // No need to check other pockets for the same ball
            }
        }
    };

    for (var i = 0; i < colorBalls2.length; i++) {
        for (var j = 0; j < pockets.length; j++) {
            if (isBallInPocket(colorBalls2[i], pockets[j])) {
                // Ball is in the pocket, reset it to its original position
                resetColorBall2(i);

                // Check for consecutive colored balls falling into the pocket
                if (lastColoredBallIndex !== -1 && Math.abs(lastColoredBallIndex - i) === 1) {
                    // Notify the user of the mistake (you can replace this with your notification logic)
                    console.log("Two consecutive colored balls fell into the pocket!");
                }
                
                lastColoredBallIndex = i;
                break; // No need to check other pockets for the same ball
            }
        }
    }

    // Check if the cue ball is in the pocket
    for (var j = 0; j < pockets.length; j++) {
        if (isBallInPocket(cueBall, pockets[j])) {
            // Cue ball is in the pocket, reset it to its original position
            resetCueBall();
            // Reset the last colored ball index when the cue ball falls
            lastColoredBallIndex = -1;
            break; // No need to check other pockets for the cue ball
        }
    }
}

function updateBalls3Array() {
    for (var i = balls3.length - 1; i >= 0; i--) {
        for (var j = 0; j < pockets.length; j++) {
            if (isBallInPocket(balls3[i], pockets[j])) {
                // Ball is in the pocket, remove it from the array
                balls3.splice(i, 1);
                break; // No need to check other pockets for the same ball
            }
        }
    };

    for (var i = 0; i < colorBalls3.length; i++) {
        for (var j = 0; j < pockets.length; j++) {
            if (isBallInPocket(colorBalls3[i], pockets[j])) {
                // Ball is in the pocket, reset it to its original position
                resetColorBall3(i);
                // Check for consecutive colored balls falling into the pocket
                if (lastColoredBallIndex !== -1 && Math.abs(lastColoredBallIndex - i) === 1) {
                    // Notify the user of the mistake (you can replace this with your notification logic)
                    console.log("Two consecutive colored balls fell into the pocket!");
                }
                
                lastColoredBallIndex = i;
                break; // No need to check other pockets for the same ball
            }
        }
    }

    // Check if the cue ball is in the pocket
    for (var j = 0; j < pockets.length; j++) {
        if (isBallInPocket(cueBall, pockets[j])) {
            // Cue ball is in the pocket, reset it to its original position
            resetCueBall();
            // Reset the last colored ball index when the cue ball falls
            lastColoredBallIndex = -1;
            break; // No need to check other pockets for the cue ball
        }
    }
}
