// Defines the HTML objects needed for canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

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
const GCONST = 6.67*(10**-11);

// The coefficient of restitution between all of the objects in the game
const restitution = 1;

// The current game speed multiplier
let gameSpeed = 1;

// The current scale of the camera view
let scale = 0.3;

let doCollisions = true
let doGravity = true
let usePlayer = true

//
let objects = [];

let player;


// Dictionary of pressed keys
let keys = {
  w: false,
  a: false,
  s: false,
  d: false
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
  constructor(color, mass, radius, pos, vel, acc) {
    this.color = color;
    this.mass = mass;
    this.radius = radius;
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;

  }
  // Calculates and applies the gravitational attraction between
  // the parent object and the parameter object
  calculateGravity(object) {


    let dist = Math.hypot(this.pos.X - object.pos.X, this.pos.Y - object.pos.Y);
    let angle = Math.atan2(object.pos.Y - this.pos.Y, object.pos.X - this.pos.X);

    // Stops if the objects are intersecting
    if (dist < this.radius + object.radius) { return }

    let thisMagnitude = (GCONST * object.mass) / (dist ** 2);
    let objMagnitude = (GCONST * this.mass) / (dist ** 2);

    let thisAcceleration = new Vector(thisMagnitude, 0).rotate(angle)
    let objAcceleration = new Vector(objMagnitude, 0).rotate(angle + Math.PI)

    this.acc.X += thisAcceleration.X
    this.acc.Y += thisAcceleration.Y

    object.acc.X += objAcceleration.X
    object.acc.Y += objAcceleration.Y
  }
  // Calculates the consequences of an intersection between two objects
  calculateCollision(object) {
    if(this.mass==0 || object.mass==0){return}
    let dist = Math.hypot(this.pos.X - object.pos.X, this.pos.Y - object.pos.Y);
    if (dist < this.radius + object.radius) {
      console.log('COLLISION')
      let angle = -Math.atan2(object.pos.Y - this.pos.Y, object.pos.X - this.pos.X);

      // First, rotate the system by the angle
      // to align it to the x axis using vector multiplication

      let thisRotatedVelocity = this.vel.rotate(angle);
      let objRotatedVelocity = object.vel.rotate(angle);


      let e = restitution;

      let u1 = thisRotatedVelocity.X;
      let u2 = objRotatedVelocity.X;

      let m1 = this.mass;
      let m2 = object.mass;

      let v1 = (m1 * u1 + m2 * u2 + e * m2 * (u2 - u1)) / (m1 + m2);
      let v2 = (m1 * u1 + m2 * u2 + e * m1 * (u1 - u2)) / (m1 + m2);

      let dv1 = v1 - u1;
      let dv2 = v2 - u2;

      let thisRotatedAcceleration = new Vector(dv1, 0);
      let objRotatedAcceleration = new Vector(dv2, 0);

      let thisAcceleration = thisRotatedAcceleration.rotate(-angle);
      let objAcceleration = objRotatedAcceleration.rotate(-angle);

      this.vel.X += thisAcceleration.X;
      object.vel.X += objAcceleration.X;
      this.vel.Y += thisAcceleration.Y;
      object.vel.Y += objAcceleration.Y;


    }

  }

  // This method updates the positions
  // and velocities of objects using leapfrog integration


  renderObject() {

    // Saves the current canvas configuration
    ctx.save();

    ctx.beginPath();
    // Translates the origin to the position
    // of the object relative to the centre of the canvas
    ctx.translate(this.pos.X + centreX - player.pos.X,
      this.pos.Y + centreY - player.pos.Y);

    // Creates the circle
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);

    // Makes the fill colour correct
    ctx.fillStyle = this.color;

    // Fills the circle
    ctx.fill();

    // Restores the original canvas state
    ctx.restore();
  }

  renderSymbol() {
    ctx.save();

    ctx.beginPath();
    // Translates the origin to the position
    // of the object relative to the centre of the canvas
    ctx.translate(centreX + ((this.pos.X - player.pos.X)*scale),
      centreY - ((-this.pos.Y + player.pos.Y)*scale));

    // Creates the circle
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);

    // Makes the fill colour correct
    ctx.fillStyle = this.color;

    // Makes the circle transparent
    ctx.globalAlpha = 0.5

    // Fills the circle
    ctx.fill();

    // Makes the pen opaque again
    ctx.globalAlpha = 1

    // Restores the original canvas state
    ctx.restore();
  }
}
// The class for the player which inherits from object
class Player extends Object {
  constructor(color, mass, radius, pos, vel, acc){
    super(color, mass, radius, pos, vel, acc)
    this.angularVelocity = 0;
    this.angle = 0;

    // Decimal fraction of the acceleration being applied
    this.thrust = 0;

    // Maximum acceleration of the craft
    this.acceleration = 1;

    //
    this.sas = 'na'
  }
  // Renders the player object
  renderObject () {
    ctx.save();
    ctx.translate(centreX, centreY);
    ctx.rotate(- this.angle + Math.PI/2);


    // Draw exhaust
    if (this.thrust > 0) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-50 * this.thrust, 190 * this.thrust);
      ctx.lineTo(50 * this.thrust, 190 * this.thrust);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-35 * this.thrust, 160 * this.thrust);
      ctx.lineTo(35 * this.thrust, 160 * this.thrust);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-20 * this.thrust, 130 * this.thrust);
      ctx.lineTo(20 * this.thrust, 130 * this.thrust);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = "#444444";
    // Engine bell
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(50, 100);
    ctx.lineTo(-50, 100);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "gray";
    // Craft body
    ctx.beginPath();
    ctx.moveTo(-50, -50);
    ctx.lineTo(0, -150);
    ctx.lineTo(50, -50);
    ctx.lineTo(50, 50);
    ctx.lineTo(-50, 50);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
  // Renders the symbol of the ship (a green triangle)
  renderSymbol() {
    ctx.save();

    ctx.translate(centreX, centreY);
    ctx.rotate(- this.angle + Math.PI/2);
    ctx.translate(-centreX, -centreY);

    ctx.fillStyle = "green";
    ctx.globalAlpha = 0.5;

    ctx.beginPath();
    ctx.moveTo(centreX, centreY - 15);
    ctx.lineTo(centreX - 10, centreY + 15);
    ctx.lineTo(centreX + 10, centreY + 15);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;

    ctx.restore();
  }
  // Gets the sphere of influence of the player
  getSOI() {
    let soiEffect = -1;
    let soi = 0;
    for (let i = 0; i < objects.length; i++){
      let dist = Math.hypot(objects[i].pos.Y - this.pos.Y, objects[i].pos.X - this.pos.X)
      let effect = dist**2 / objects[i].mass
      if ((effect < soiEffect || soiEffect == -1) && dist!=0) {
        soiEffect = effect
        soi = i
      }
    }
    return objects[soi]
  }

  applyRocketControls(){
    // Checks if keys are pressed down. If true apply the correct effects
    if(keys.w){
      this.thrust += 0.02
    }
    if(keys.s){
      this.thrust -= 0.02
    }
    if(keys.a){
      this.angularVelocity += 0.0001
    }
    if(keys.d){
      this.angularVelocity -= 0.0001
    }
    // Applies the directions for different SAS controls relative to the nearest sphere of influence
    let soi = this.getSOI()
    let newAngle = this.angle
    switch (this.sas) {
      case 'pg':
        newAngle = -Math.atan2(this.vel.Y - soi.vel.Y, this.vel.X - soi.vel.X)
        break
      case 'rg':
        newAngle = -Math.atan2(this.vel.Y - soi.vel.Y, this.vel.X - soi.vel.X) + Math.PI
        break
      case 'no':
        newAngle = -Math.atan2(this.vel.Y - soi.vel.Y, this.vel.X - soi.vel.X) + Math.PI/2
        break
      case 'an':
        newAngle = -Math.atan2(this.vel.Y - soi.vel.Y, this.vel.X - soi.vel.X) + 3*Math.PI/2
        break
      case 'ri':
        newAngle = -Math.atan2(this.pos.Y - soi.pos.Y, this.pos.X - soi.pos.X) + Math.PI
        break
      case 'ro':
        newAngle = -Math.atan2(this.pos.Y - soi.pos.Y, this.pos.X - soi.pos.X)
        break
      default:
        break
    }

    if (this.sas == 'na') {

      this.angle += this.angularVelocity
      if (this.angle > Math.PI * 2) {
        this.angle -= Math.PI * 2
      }
    } else {
      this.angle = newAngle
      this.angularVelocity = 0
    }


    // Limits the thrust between 0 and 1

    if (this.thrust > 1) {
      this.thrust = 1
    } else if (this.thrust < 0) {
      this.thrust = 0
    }

    this.acc.X += this.acceleration * this.thrust * Math.cos(this.angle)
    this.acc.Y -= this.acceleration * this.thrust * Math.sin(this.angle)
  }

}
// Applies gravity and collisions to all objects
// if those features are enabled in the config
function applyPhysics() {
  for (let i = 0; i < objects.length; i++){
    for (let j = i + 1; j < objects.length; j++){
      if (doGravity) {
        objects[i].calculateGravity(objects[j]);
      }
      if (doCollisions) {
        objects[i].calculateCollision(objects[j]);
      }
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

  // If the player feature is active the rocket controls are applied
  if (usePlayer) {
    player.applyRocketControls();
  }

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
// Renders symbols if the object is too small in the game scene
function renderSymbols(){
  for (let i = 0; i < objects.length; i++){
    if (objects[i].radius * scale < minimumRadius) {
      objects[i].renderSymbol()
    }
  }
}


function draw(time) {
  console.log(objects)
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
  // Renders the symbols
  renderSymbols();

  // Requests the next frame to be drawn,
  // creating a loop repeating 60 times per second
  requestAnimationFrame(draw);
}

// Event listeners for keypresses

document.addEventListener("keydown", function (e) {

  switch(e.key){
    case "w":
      keys.w = true;
      break;
    case "a":
      keys.a = true;
      break;
    case "s":
      keys.s = true;
      break;
    case "d":
      keys.d = true;

      break;
    default:
      break;
  }
})

document.addEventListener("keyup", function (e) {
  switch(e.key){
    case "w":
      keys.w = false;
      break;
    case "a":
      keys.a = false;
      break;
    case "s":
      keys.s = false;
      break;
    case "d":
      keys.d = false;
      break;
    default:
      break;
  }
})

// Loads the config from text to the game
function loadConfig() {
  const JSONconfig = configInput.value
  const config = JSON.parse(JSONconfig)

  objects = [];
  usePlayer = config[0][0]
  doGravity = config[0][1]
  doCollisions = config[0][2]
  if (usePlayer) {
    player = new Player("red", 1, 1, new Vector(0, 0), new Vector(0, 0), new Vector(0, 0))
    objects.push(player)
  }


  // For every element in the object except the first it creates a new object with those properties
  for (let i = 1; i < config.length; i++){
    let card = config[i]
    objects.push(new Object(
      card[12],
      card[2] * 10 ** card[3],
      card[0] * 10 ** card[1],
      new Vector(card[4] * 10 ** card[5], card[6] * 10 ** card[7]),
      new Vector(card[8] * 10 ** card[9], card[10] * 10 ** card[11]),
      new Vector(0, 0)
    ))
  }
}
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

// Checks what box is checked for the SAS controls
function checkControls() {
  player.sas = document.querySelector('input[name="rocketControls"]:checked').value;
}

body.onwheel = zoom

function init() {
  draw();
}

draw();
