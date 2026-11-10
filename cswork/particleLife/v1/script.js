// Defines the HTML objects needed for canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const minDist = document.getElementById('minDist')
const maximumRange = document.getElementById('maxRange')
const forceMult = document.getElementById('forceMult')
const resVal = document.getElementById('resistance')

const startButton = document.getElementById('start')
const colourVal = document.getElementById('colourNum')
const objectNum = document.getElementById('objectNum')

// Reference to the body tag for deceting zoom event
const body = document.querySelector("body");

// The gameSpeedValue tag which is updated when the game speed is changed
const gameSpeedValue = document.getElementById("gameSpeedValue")

const configInput = document.getElementById('configInput')

// The location of the centre of the canvas
const centreY = canvas.height / 2;
const centreX = canvas.width / 2

// The minimum radius an object can be on the screen before its symbol appears
const minimumRadius = 1.5;

// The constant that defines the speed of the scrolling
const scaleFactor = 1/1000;

// The gravitational constant of the simulation
let forceConst = 1000;

// Constant resistance applied to objects
let resistance = 0.0001

// The size of the game scene
const sceneSize = 10000;

let maxRange = 500

let objectCount = 500

let minimumDistance = 50

// The coefficient of restitution between all of the objects in the game
const restitution = 1;

// The current game speed multiplier
let gameSpeed = 1;

// Mouse offsets
let offsetX = 0;
let offsetY = 0;

// The current scale of the camera view
let scale = 0.3;
let numColours = 20
let colours = []
for (let i = 0; i < numColours; i++){
  colours.push('#'+Math.floor(Math.random()*16777215).toString(16))
}

let colourConnections = [

]
for (let i = 0; i < colours.length; i++) {
  colourConnections.push([])
  for (let j = 0; j < colours.length; j++) {
    colourConnections[i].push(3*(Math.random() - 0.5))
  }
}

//
let objects = [];

let player;


// Dictionary of pressed keys
let keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  mouse: false
}

// A class for vectors, allowing me to do vector calculations easier
class Vector {
  constructor(x, y) {
    this.X = x;
    this.Y = y;
  }
  addVector(vector) {
    this.X += vector.X;
    this.Y += vector.Y;
  }
  setZero() {
    this.X = 0;
    this.Y = 0;
  }
  // Returns the vector rotated by theta degrees
  rotate(theta) {
    return new Vector(
      this.X * Math.cos(theta) - this.Y * Math.sin(theta),
      this.X * Math.sin(theta) + this.Y * Math.cos(theta)
    )
  }
  // Returns the vector as a unit vector (magnitude 1)
  unitVector() {
    return new Vector(
      this.X / Math.hypot(this.Y, this.X),
      this.Y / Math.hypot(this.Y, this.X)
    )
  }
  // Multiplies two vectors
  mult(mult) {
    return new Vector(
      this.X * mult,
      this.Y * mult
    )
  }
}


// A class for the objects
class Object {
  // Constructor for all of the attributes
  // that will be required to render the objects
  constructor(colour, mass) {
    this.colour = colour;
    this.mass = mass;
    this.radius = 20;
    this.pos = new Vector(0.5*sceneSize - sceneSize*Math.random(), 0.5*sceneSize - sceneSize*Math.random());
    this.vel = new Vector(0,0);
    this.acc = new Vector(0, 0);
    this.partition = new Vector(Math.floor(this.pos.X / maxRange), Math.floor(this.pos.Y / maxRange))

  }
  // Calculates and applies the gravitational attraction between
  // the parent object and the parameter object
  calculateGravity(object) {



    if(Math.abs(this.partition.X-object.partition.Y)>1 && Math.abs(this.partition.Y-object.partition.Y)>1){return}

    let dist = Math.hypot(this.pos.X - object.pos.X, this.pos.Y - object.pos.Y);
    if(dist>maxRange){return}
    let angle = Math.atan2(object.pos.Y - this.pos.Y, object.pos.X - this.pos.X);

    let thisMagnitude = (forceConst * object.mass) / (dist ** 2);
    let objMagnitude = (forceConst * this.mass) / (dist ** 2);

    let thisAcceleration = new Vector(thisMagnitude, 0).rotate(angle)
    let objAcceleration = new Vector(objMagnitude, 0).rotate(angle + Math.PI)
    if (dist > minimumDistance) {
      let forceMult = colourConnections[this.colour][object.colour]
      this.acc.X += forceMult * thisAcceleration.X
      this.acc.Y += forceMult * thisAcceleration.Y

      forceMult = colourConnections[object.colour][this.colour]
      object.acc.X += forceMult * objAcceleration.X
      object.acc.Y += forceMult * objAcceleration.Y
    } else if (dist>10){
      let repelMult = 3
      this.acc.X -= repelMult*thisAcceleration.X
      this.acc.Y -= repelMult*thisAcceleration.Y

      object.acc.X -= repelMult*objAcceleration.X
      object.acc.Y -= repelMult*objAcceleration.Y
    }


  }
  addResistance() {
    this.acc.X -= resistance*this.vel.X
    this.acc.Y -= resistance*this.vel.Y
  }

  // This method updates the positions
  // and velocities of objects using leapfrog integration

  updatePartition() {
    if (this.partition.X * maxRange < this.pos.X || this.partition.Y*maxRange < this.pos.Y) {
      this.partition.X = Math.floor(this.pos.X / maxRange)
      this.partition.Y = Math.floor(this.pos.Y / maxRange)
    }
  }
  renderObject() {

    // Saves the current canvas configuration
    ctx.save();

    ctx.beginPath();
    // Translates the origin to the position
    // of the object relative to the centre of the canvas
    ctx.translate(this.pos.X + centreX + offsetX,
      this.pos.Y + centreY + offsetY);

    // Creates the circle
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);

    // Makes the fill colour correct

    ctx.fillStyle = colours[this.colour];

    // Fills the circle
    ctx.fill();

    // Restores the original canvas state
    ctx.restore();
  }
}

// Applies gravity and collisions to all objects
// if those features are enabled in the config
function applyPhysics() {
  for (let i = 0; i < objects.length; i++){
    for (let j = i + 1; j < objects.length; j++){

        objects[i].calculateGravity(objects[j]);
        objects[i].addResistance()


    }
  }
}


// Updates the positions of the objects using leapfrog integration
function updateObjects() {
  for (let i = 0; i < objects.length; i++) {
    // Adds half of the velocity for the next frame
    objects[i].vel.X += objects[i].acc.X/2;
    objects[i].vel.Y += objects[i].acc.Y / 2;
    // Updates the positions
    objects[i].pos.addVector(objects[i].vel);
  }

  for (let i = 0; i < objects.length; i++) {
    // Sets acc to zero
    objects[i].acc.setZero()
  }
  // Updates the physics
  applyPhysics();



  // Adds the rest of the velocity for the next frame
  for(let i = 0; i < objects.length; i++) {
    objects[i].vel.X += objects[i].acc.X/2;
    objects[i].vel.Y += objects[i].acc.Y / 2;
  }
}
// Renders all of the objects in the game scene
function renderObjects() {
  for(let i = 0; i < objects.length; i++) {
    objects[i].renderObject()

  }
}


function draw(time) {

  // Clears the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Scales the camera view
  ctx.save()
  ctx.translate(centreX,centreY)
  ctx.scale(scale,scale)
  ctx.translate(-centreX,-centreY)

  // Updates the positions and velocities of the objects
  // and repeats depending on the game speed
  for (let i = 0; i < gameSpeed; i++){
    updateObjects();
  }

  // Renders the objects on the canvas
  renderObjects();

  ctx.restore()


  // Requests the next frame to be drawn,
  // creating a loop repeating 60 times per second
  requestAnimationFrame(draw);
}

canvas.addEventListener("mousedown", function () {
  keys.mouse = true
});

// Let box listen for mouseout
canvas.addEventListener("mouseup", function () {
  keys.mouse = false
});

canvas.addEventListener('mousemove', function (e) {
  if (keys.mouse) {
    offsetX += e.movementX * (10/(3*scale))
    offsetY += e.movementY * (10/(3*scale))
  }
});

// Scales the game scene based on movements of the scroll wheel
function zoom(event) {
  scale = Math.min(1,scale + (scaleFactor * event.deltaY * scale))
}

// Increases game speed when the button is pressed
function increaseTime() {
  gameSpeed *= 2
  gameSpeedValue.innerText = gameSpeed

}

// decreases game speed when the button is pressed. Ensures that the value cannot go below one.
function decreaseTime() {
  if (gameSpeed == 1) { return }
  gameSpeed *= 0.5
  gameSpeedValue.innerText = gameSpeed
}

function setMinDist() {
  minimumDistance = minDist.value
}

function setMaxRange() {
  maxRange = maximumRange.value
}

function setForceMult() {
  forceConst = forceMult.value
}

function setResistance() {
  resistance = resVal.value/1000000
}

// Checks what box is checked for the SAS controls

body.onwheel = zoom
resVal.oninput = setResistance
forceMult.oninput = setForceMult
maximumRange.oninput = setMaxRange
minDist.oninput = setMinDist

startButton.onclick = restart

function init() {
  for (let i = 0; i < objectCount/colours.length; i++){
    for (let j = 0; j < colours.length; j++){
      objects.push(new Object(j, 1))
    }
  }

  draw();
}

function restart() {
  objects = []
  numColours = colourVal.value
  colours = []
  objectCount = objectNum.value
  for (let i = 0; i < numColours; i++){
    colours.push('#'+Math.floor(Math.random()*16777215).toString(16))
  }
  for (let i = 0; i < objectCount/numColours; i++){
    for (let j = 0; j < numColours; j++){
      objects.push(new Object(j, 1))
    }
  }
  colourConnections = [

  ]
  for (let i = 0; i < colours.length; i++) {
    colourConnections.push([])
    for (let j = 0; j < colours.length; j++) {
      colourConnections[i].push(3*(Math.random() - 0.5))
    }
  }
  draw();
}

init();
