let rotation = 0;
const rotspeed = 0.001;
let Y_Velocity = 10;
let X_Velocity = 0;
const acceleration = 1; // The real life equivalent would be 60* this number
const translation = 0.006;
let gconst = 1000;
let gamespeed = 1;
let boosting = false;
let output = 0;
let restitution = 0.5;
let framems = 0;
let astSpeed = 1;

let c_down = false;
let a_down = false;
let d_down = false;
let w_down = false;
let s_down = false;
let x_down = false;
let mapmode = false;

let arrowdown_down = false;
let arrowleft_down = false;
let arrowright_down = false;
let arrowup_down = false;

const canvas = document.getElementById("myCanvas");
const rocket = canvas.getContext("2d");
const gamespeedValue = document.getElementById("gamespeedValue");
const pingValue = document.getElementById("pingValue");
const gravityVal = document.getElementById("gravityVal");
const gravitySlider = document.getElementById("myRange");
const gravityButton = document.getElementById("gravityButton");
const speedInput = document.getElementById("speedInput");
const speedVal = document.getElementById("speedVal");
const astCount = document.getElementById("astCount");
const astCountVal = document.getElementById("astCountVal");


let scale = 0.005;
const el = document.querySelector("body");

let angle = 0;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let X_pos = 1000;
let Y_pos = 0;

let newangle = 0;
let ogangle = 0;
let diff = 0;



let img = new Image();
img.src = "asteroids/ast1.png";
let img1 = new Image();
img1.src = "asteroids/ast2.png";
let img2 = new Image();
img2.src = "asteroids/ast3.png";
let img3 = new Image();
img3.src = "asteroids/ast4.png";
let img4 = new Image();
img4.src = "asteroids/ast5.png";
let img5 = new Image();
img5.src = "asteroids/ast6.png";
let img6 = new Image();
img6.src = "asteroids/ast7.png";
let img7 = new Image();
img7.src = "asteroids/ast8.png";
let img8 = new Image();
img8.src = "asteroids/ast9.png";
let img9 = new Image();
img9.src = "asteroids/ast10.png";
let img10 = new Image();
img10.src = "asteroids/ast11.png";
let img11 = new Image();
img11.src = "asteroids/ast12.png";
let img12 = new Image();
img12.src = "asteroids/ast13.png";


let imgs = [img, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12];


const FRAMES_PER_SECOND = 60; // Valid values are 60,30,20,15,10...
// set the mim time to render the next frame
const FRAME_MIN_TIME =
  (1000 / 60) * (60 / FRAMES_PER_SECOND) - (1000 / 60) * 0.5;
var lastFrameTime = 0; // the last frame time

class object {
  constructor(x, y, size, mass, x_v, y_v) {
    this.size = size;
    this.imgIndex = Math.floor(Math.random() * imgs.length);
    this.mass = mass;
    this.angle = Math.random() * Math.PI * 2;
    this.pos = {
      x: x,
      y: y,
    };
    this.vel = {
      X: x_v / 60,
      Y: y_v / 60,
    };
  }

  calculateGravity(object) {
    if(Math.hypot(this.pos.x - object.pos.x, this.pos.y - object.pos.y) < this.size && Math.hypot(this.pos.x - object.pos.x, this.pos.y - object.pos.y) < object.size){return}
    if (this.pos !== object.pos) {
      let thismagnitude = (object.mass * gconst) / ((this.pos.x - object.pos.x) ** 2 + (this.pos.y - object.pos.y) ** 2);
      let objmagnitude = (this.mass * gconst) / ((this.pos.x - object.pos.x) ** 2 + (this.pos.y - object.pos.y) ** 2);
      let angle = Math.atan2(
        object.pos.y - this.pos.y,
        object.pos.x - this.pos.x,
      );

      this.vel.Y += thismagnitude * Math.sin(angle);
      this.vel.X += thismagnitude * Math.cos(angle);

      object.vel.Y -= objmagnitude * Math.sin(angle);
      object.vel.X -= objmagnitude * Math.cos(angle);
    }
  }
  checkCollisions(object) {
    let dist = Math.hypot(this.pos.x - object.pos.x, this.pos.y - object.pos.y);

    if (dist < this.size + object.size) {
      let angle = -Math.atan2(
        object.pos.y - this.pos.y,
        object.pos.x - this.pos.x,
      );

      let thismat = [
        [this.pos.x, this.vel.X],
        [this.pos.y, this.vel.Y],
      ];
      let objmat = [
        [object.pos.x, object.vel.X],
        [object.pos.y, object.vel.Y],
      ];
      let thisrotatedMat = matMult(rotMat(angle), thismat);
      let objrotatedMat = matMult(rotMat(angle), objmat);
      let e = restitution;
      let u1 = thisrotatedMat[0][1];
      let u2 = objrotatedMat[0][1];

      let m1 = this.mass;
      let m2 = object.mass;
      let v1 = (e * m2 * (u2 - u1) + m1 * u1 + m2 * u2) / (m1 + m2);
      let v2 = (e * m1 * (u1 - u2) + m1 * u1 + m2 * u2) / (m1 + m2);

      thisrotatedMat[0][1] = v1;
      objrotatedMat[0][1] = v2;

      let newthismat = matMult(rotMat(-angle), thisrotatedMat);
      let newobjmat = matMult(rotMat(-angle), objrotatedMat);

      this.vel.X = newthismat[0][1];
      this.vel.Y = newthismat[1][1];
      object.vel.X = newobjmat[0][1];
      object.vel.Y = newobjmat[1][1];
    }
  }

  updatePos() {
    this.pos.x += this.vel.X;
    this.pos.y += this.vel.Y;
  }
  getNearestObject() {
    let smallestDistMass = -1;
    let closestObj;
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i];
      if (this.pos !== object.pos) {
        let dist = Math.sqrt(
          (this.pos.x - object.pos.x) ** 2 + (this.pos.y - object.pos.y) ** 2,
        );
        let distmass = dist;
        if (distmass < smallestDistMass || smallestDistMass == -1) {
          smallestDistMass = distmass;
          closestObj = object;
        }
      }
    }
    return closestObj;
  }

  getRelativeVelocity(obj) {
    let xv = this.vel.X - obj.vel.X;
    let yv = this.vel.Y - obj.vel.Y;
    return {
      X: xv,
      Y: yv,
    };
  }
}

function renderObjects() {
  rocket.fillStyle = "gray";

  for (let i = 0; i < objects.length; i++) {
    if (objects[i].mass != 0) {
      let object = objects[i];
      rocket.save();
      rocket.translate(
        object.pos.x - player.pos.x + centerX,
        object.pos.y - player.pos.y + centerY,
      );
      rocket.beginPath();
      rocket.rotate(object.angle);
      rocket.drawImage(imgs[object.imgIndex], -object.size, -object.size, object.size * 2, object.size * 2);
      
      rocket.fill();
      rocket.restore();
    }
  }
}

function renderRocket() {
  rocket.save();
  rocket.translate(centerX, centerY);
  rocket.rotate(angle);
  rocket.translate(-centerX, -centerY);

  // Draw boost
  if (output > 0) {
    rocket.fillStyle = "red";
    rocket.beginPath();
    rocket.moveTo(centerX, centerY);
    rocket.lineTo(centerX - 50 * output, centerY + 190 * output);
    rocket.lineTo(centerX + 50 * output, centerY + 190 * output);
    rocket.closePath();
    rocket.fill();

    rocket.fillStyle = "orange";
    rocket.beginPath();
    rocket.moveTo(centerX, centerY);
    rocket.lineTo(centerX - 35 * output, centerY + 160 * output);
    rocket.lineTo(centerX + 35 * output, centerY + 160 * output);
    rocket.closePath();
    rocket.fill();
    rocket.fillStyle = "yellow";
    rocket.beginPath();
    rocket.moveTo(centerX, centerY);
    rocket.lineTo(centerX - 20 * output, centerY + 130 * output);
    rocket.lineTo(centerX + 20 * output, centerY + 130 * output);
    rocket.closePath();
    rocket.fill();
  }

  rocket.fillStyle = "#444444";
  // top bit
  rocket.beginPath();
  rocket.moveTo(centerX, centerY);
  rocket.lineTo(centerX - 50, centerY + 100);
  rocket.lineTo(centerX + 50, centerY + 100);
  rocket.closePath();
  rocket.fill();

  rocket.fillStyle = "gray";
  // Square
  rocket.beginPath();
  rocket.moveTo(centerX - 50, centerY - 50);
  rocket.lineTo(centerX, centerY - 150);
  rocket.lineTo(centerX + 50, centerY - 50);
  rocket.lineTo(centerX + 50, centerY + 50);
  rocket.lineTo(centerX - 50, centerY + 50);
  rocket.closePath();
  rocket.fill();

  rocket.restore();
}
function renderTriangle() {
  rocket.save();
  rocket.translate(centerX, centerY);
  rocket.rotate(angle);
  rocket.translate(-centerX, -centerY);
  rocket.fillStyle = "green";
  rocket.globalAlpha = 0.5;
  // top bit
  rocket.beginPath();
  rocket.moveTo(centerX, centerY - 15);
  rocket.lineTo(centerX - 10, centerY + 15);
  rocket.lineTo(centerX + 10, centerY + 15);
  rocket.closePath();
  rocket.fill();
  rocket.globalAlpha = 1;

  rocket.restore();
}

function calculateAcceleration() {
  if (w_down && output < 1) {
    output += 0.02;
  } else if (s_down && output > 0) {
    output -= 0.02;
  } else if (arrowup_down) {
    player.vel.Y -= Math.cos(angle) * translation;
    player.vel.X += Math.sin(angle) * translation;
  }
  if (arrowdown_down) {
    player.vel.Y += Math.cos(angle) * translation;
    player.vel.X -= Math.sin(angle) * translation;
  }
  if (arrowleft_down) {
    player.vel.Y -= Math.sin(angle) * translation;
    player.vel.X -= Math.cos(angle) * translation;
  }
  if (arrowright_down) {
    player.vel.Y += Math.sin(angle) * translation;
    player.vel.X += Math.cos(angle) * translation;
  }

  player.vel.Y -= Math.cos(angle) * acceleration * output;
  player.vel.X += Math.sin(angle) * acceleration * output;

  /*
    if(c_down){
        
        if(X_Velocity>0){
            X_Velocity-=acceleration
        } else if (X_Velocity<0){
            X_Velocity+=acceleration
        }
        if(Y_Velocity>0){
            Y_Velocity-=acceleration
        } else if (Y_Velocity){
            Y_Velocity+=acceleration
        }
    }
    */
}

function doObjectAccelerations() {
  calculateAcceleration();
  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      let curr = objects[i];
      let that = objects[j];
      curr.calculateGravity(that);
      curr.checkCollisions(that);
      
    }
  }
}

function calculateRotation() {
  if (a_down) {
    rotation -= rotspeed;
  }
  if (d_down) {
    rotation += rotspeed;
  }
  if (c_down) {
    newangle = Math.atan2(player.vel.Y, player.vel.X) + Math.PI / 2;

    if (angle < newangle) {
      if (Math.abs(rotation) < 0.05) {
        rotation += rotspeed;
      } else {
        rotation = 0.05;
      }
    } else if (angle > newangle) {
      if (Math.abs(rotation) < 0.05) {
        rotation -= rotspeed;
      } else {
        rotation = -0.05;
      }
    }
  }

  if (x_down) {
    newangle = Math.atan2(player.vel.Y, player.vel.X) - Math.PI / 2;
    if (angle < newangle) {
      if (Math.abs(rotation) < 0.05) {
        rotation += rotspeed;
      } else {
        rotation = 0.05;
      }
    } else if (angle > newangle) {
      if (Math.abs(rotation) < 0.05) {
        rotation -= rotspeed;
      } else {
        rotation = -0.05;
      }
    }
  }
}


let player = new object(0,0,100,0,0,0)
let objects = [];




   


function matMult(m1, m2) {
  return [
    [
      m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0],
      m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1],
    ],
    [
      m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0],
      m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1],
    ],
  ];
}

function rotMat(angle) {
  return [
    [Math.cos(angle), -Math.sin(angle)],
    [Math.sin(angle), Math.cos(angle)],
  ];
}

function draw(time) {
  rocket.clearRect(0, 0, canvas.width, canvas.height);
  // Performance checker: update pingValue with last frame time in ms
  if (lastFrameTime) {
    framems = time - lastFrameTime;
    // write ms per frame to pingValue element
    if (pingValue) pingValue.innerText = framems.toFixed(1) + " ms";
  }
  gamespeedValue.innerText = Math.round(gamespeed*(1000/(60*framems))*5)/5 + "x";;
  lastFrameTime = time;
  let pattern = rocket.createPattern(img, "no-repeat");
  rocket.fillStyle = pattern;
  rocket.save();
  rocket.translate(centerX, centerY);
  rocket.scale(scale, scale);
  rocket.translate(-centerX, -centerY);
  renderObjects();
  if (scale < 0.02) {
    renderRocket();
    rocket.restore();
    renderTriangle();
  } else {
    renderRocket();
    rocket.restore();
  }
  
  for (let times = 0; times < gamespeed; times++) {
    doObjectAccelerations();
    player.updatePos();
    for (let i = 0; i < objects.length; i++) {
      objects[i].updatePos();
    }
  }

  calculateRotation();
  angle += rotation;

  if (angle > Math.PI * 2) angle = 0;

  requestAnimationFrame(draw); // get next farme
}

// Start animation

function zoom(event) {
  event.preventDefault();

  scale += (-event.deltaY * scale) / 1000;

  // Restrict scale
}

el.onwheel = zoom;

document.addEventListener("keydown", function (event) {
  if (event.key === "a") {
    a_down = true;
  } else if (event.key === "d") {
    d_down = true;
  } else if (event.key === "c") {
    c_down = true;
  } else if (event.key === "m") {
    switchMapMode();
  } else if (event.key === "x") {
    x_down = true;
  } else if (event.key === "w") {
    w_down = true;
  } else if (event.key === "s") {
    s_down = true;
  } else if (event.key === "ArrowDown") {
    arrowdown_down = true;
  } else if (event.key === "ArrowLeft") {
    arrowleft_down = true;
  } else if (event.key === "ArrowRight") {
    arrowright_down = true;
  } else if (event.key === "ArrowUp") {
    arrowup_down = true;
  }

  switch (event.key) {
    default:
      break;
  }
});
document.addEventListener("keyup", function (event) {
  if (event.key === "a") {
    a_down = false;
  } else if (event.key === "d") {
    d_down = false;
  } else if (event.key === "c") {
    c_down = false;
    rotation = 0;
  } else if (event.key === "x") {
    x_down = false;
    rotation = 0;
  } else if (event.key === "w") {
    w_down = false;
  } else if (event.key === "s") {
    s_down = false;
  } else if (event.key === "ArrowDown") {
    arrowdown_down = false;
  } else if (event.key === "ArrowLeft") {
    arrowleft_down = false;
  } else if (event.key === "ArrowRight") {
    arrowright_down = false;
  } else if (event.key === "ArrowUp") {
    arrowup_down = false;
  }
});

function decreaseTime() {
  gamespeed = gamespeed / 2;
  if (gamespeed < 1) {
    gamespeed = 1;
    
  }
  
}

function increaseTime() {
  gamespeed = gamespeed * 2;

}
function switchMapMode() {
  if (mapmode) {
    scale = 0.1;
    mapmode = false;
  } else {
    let dist = Math.sqrt(
      (player.pos.y - player.getNearestObject().pos.y) ** 2 +
        (player.pos.x - player.getNearestObject().pos.x) ** 2,
    );
    scale = 200 / dist;
    mapmode = true;
  }
}

function setGravity(){
  gconst = 10**(gravitySlider.value/10);
  gravityVal.innerText = Math.round(gconst*10)/10;
}

function setSpeed(){
  astSpeed = parseFloat(document.getElementById("speedInput").value);
  speedVal.innerText = astSpeed;
}

function createGame(){
  objects = []
  for(let i=0;i<10;i++){
    let rand = Math.random()*3
    let angle = Math.random()*Math.PI*2 - Math.PI
    let dist = Math.random()*100000+50000
    objects.push(new object(Math.floor(Math.cos(angle)*dist),Math.floor(Math.sin(angle)*dist),4000*rand,(rand**3)*300*10^9,0,0))
  }
  for(let i=0;i<astCount.value*10;i++){
    let rand = Math.random()*1.5
    let angle = Math.random()*Math.PI*2 - Math.PI
    let dist = Math.random()*1000000+50000
    objects.push(new object(Math.floor(Math.cos(angle)*dist),Math.floor(Math.sin(angle)*dist),4000*rand,(rand**3)*300*10^9,-Math.floor(astSpeed*3000000*Math.sin(angle)/(Math.sqrt(dist))),Math.floor(astSpeed*3000000*Math.cos(angle)/(Math.sqrt(dist)))))
  }
}
gravitySlider.oninput = setGravity;
speedInput.oninput = setSpeed;
astCount.oninput = function() {
  astCountVal.innerText = astCount.value;
};

createGame()
requestAnimationFrame(draw);
