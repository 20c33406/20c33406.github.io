let rotation = 0
const rotspeed = 0.001
let Y_Velocity = 10
let X_Velocity = 0
const acceleration = 0.1  // The real life equivalent would be 60* this number
const translation = 0.006
const gconst = 0.0007
let gamespeed = 1
let boosting = false
let output = 0
let restitution = 1

let c_down = false
let a_down = false
let d_down = false
let w_down = false
let s_down = false
let x_down = false
let mapmode = false

let arrowdown_down = false
let arrowleft_down = false
let arrowright_down = false
let arrowup_down = false

const canvas = document.getElementById('myCanvas');
const rocket = canvas.getContext('2d');


let scale = 0.1;
const el = document.querySelector("body");


let angle = 0;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let X_pos = 1000
let Y_pos = 0

let newangle = 0
let ogangle = 0
let diff = 0



const FRAMES_PER_SECOND = 60;  // Valid values are 60,30,20,15,10...
// set the mim time to render the next frame
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;  // the last frame time


class object {
    constructor(x,y,size,mass,x_v,y_v){
        this.size = size
        
        this.mass = mass

        this.pos = {
            x: x,
            y: y
        }
        this.vel = {
            X: x_v/60,
            Y: y_v/60
        }
        
    }
    calculateGravity(object){
        if(this.pos !== object.pos){
            let magnitude = (object.mass*gconst)/((this.pos.x-object.pos.x)**2 + (this.pos.y-object.pos.y)**2)
            let angle = Math.atan2((object.pos.y-this.pos.y),(object.pos.x-this.pos.x))
                
            this.vel.Y+=magnitude*Math.sin(angle)
            this.vel.X+=magnitude*Math.cos(angle)

            object.vel.Y-=magnitude*Math.sin(angle)
            object.vel.X-=magnitude*Math.cos(angle)
        }
        
    }
    checkCollisions(object){
        let dist = Math.sqrt(((this.pos.x-object.pos.x)**2 + (this.pos.y-object.pos.y)**2))
        if(dist<this.size + object.size){
                let angle = -Math.atan2((object.pos.y-this.pos.y),(object.pos.x-this.pos.x))
                
                let thismat = [
                    [this.pos.x, this.vel.X],
                    [this.pos.y, this.vel.Y]                   
                ]   
                let objmat = [
                    [object.pos.x, object.vel.X],
                    [object.pos.y, object.vel.Y]
                ]   
                let thisrotatedMat = matMult(rotMat(angle),thismat)
                let objrotatedMat = matMult(rotMat(angle),objmat)
               
                let thisNewV = ((thisrotatedMat[0][1]*this.mass + objrotatedMat[0][1]*object.mass + restitution*object.mass*(thisrotatedMat[0][1] - objrotatedMat[0][1]))/(object.mass+this.mass))
                let objNewV = ((thisrotatedMat[0][1]*this.mass + objrotatedMat[0][1]*object.mass + restitution*this.mass*(objrotatedMat[0][1] - thisrotatedMat[0][1]))/(object.mass+this.mass))
                
                thisrotatedMat[0][1] = thisNewV
                objrotatedMat[0][1] = objNewV
                    
                    
                let newthismat = matMult(rotMat(-angle),thisrotatedMat)
                let newobjmat = matMult(rotMat(-angle),objrotatedMat)
                
                this.vel.X = newthismat[0][1]
                this.vel.Y = newthismat[1][1]
                object.vel.X = newobjmat[0][1]
                object.vel.Y = newobjmat[1][1]




                    /*
                    let massSum = this.mass + object.mass
                    let impact = {x: object.pos.x - this.pos.x, y: object.pos.y - this.pos.y}
                    let velDiff = {X: object.vel.X - this.vel.X, Y: object.vel.Y - this.vel.Y}
                    let velDotImpact = impact.x * velDiff.X + impact.y * velDiff.Y
                    let distance = Math.hypot(this.pos.x - object.pos.x, this.pos.y - object.pos.y)
                    
                    this.vel.X += impact.x * 2 * object.mass * velDotImpact / (massSum * distance * distance)
                    this.vel.Y -= impact.y * 2 * object.mass * velDotImpact / (massSum * distance * distance)
                    
                    
                    function resolveCollision (a, b) {
                        let massSum = a.mass + b.mass
                        let impact = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y }
                        let velDiff = { x: b.vel.x - a.vel.x, y: b.vel.y - a.vel.y } 
                        let velDotImpact = impact.x * velDiff.x + impact.y * velDiff.y
                        let distance = Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y)
                        for (let xy of ['x', 'y']) {
                            a.vel[xy] += impact[xy] * 2 * b.mass * velDotImpact / (massSum * distance * distance)
                            b.vel[xy] += impact[xy] * -2 * a.mass * velDotImpact / (massSum * distance * distance)
                        }
                    }

                    */
                }
                
                
            }
        
        
    
    updatePos(){
        this.pos.x += this.vel.X
        this.pos.y += this.vel.Y
    }
    getNearestObject(){
        let smallestDistMass=-1;
        let closestObj;
        for(let i=0;i<objects.length;i++){
            
            let object = objects[i]
            if(this.pos !== object.pos){
                let dist = Math.sqrt(((this.pos.x-object.pos.x)**2 + (this.pos.y-object.pos.y)**2))
                let distmass= dist
                if(distmass<smallestDistMass || smallestDistMass == -1){
                    smallestDistMass = distmass
                    closestObj = object
                }
                
                
            }
        }
        return closestObj
    }

    getRelativeVelocity(obj){
        let xv = this.vel.X - obj.vel.X
        let yv = this.vel.Y - obj.vel.Y
        return {
            X: xv,
            Y: yv
        }
    }
}





function renderObjects(){
    rocket.fillStyle = 'gray';


    for(let i=0;i<objects.length;i++){
        if(objects[i].mass!=0){
            let object = objects[i]
            rocket.save()
            rocket.translate(object.pos.x-player.pos.x+centerX,object.pos.y-player.pos.y+centerY)
            rocket.beginPath()
            rocket.arc(0,0,object.size,0,2*Math.PI)
            rocket.fill()
            rocket.restore()
        }
    }
    
}

function renderRocket(){
    
    rocket.save();
    rocket.translate(centerX, centerY);
    rocket.rotate(angle)
    rocket.translate(-centerX, -centerY);
    
    // Draw boost
    if(output>0){
        rocket.fillStyle = 'red';
        rocket.beginPath();
        rocket.moveTo(centerX, centerY);
        rocket.lineTo(centerX-(50*output), centerY+(190*output));
        rocket.lineTo(centerX+(50*output), centerY +(190*output));
        rocket.closePath();
        rocket.fill();

        rocket.fillStyle = 'orange';
        rocket.beginPath();
        rocket.moveTo(centerX, centerY);
        rocket.lineTo(centerX-(35*output), centerY+(160*output));
        rocket.lineTo(centerX+(35*output), centerY +(160*output));
        rocket.closePath();
        rocket.fill();
        rocket.fillStyle = 'yellow';
        rocket.beginPath();
        rocket.moveTo(centerX, centerY);
        rocket.lineTo(centerX-(20*output), centerY+(130*output));
        rocket.lineTo(centerX+(20*output), centerY +(130*output));
        rocket.closePath();
        rocket.fill();
    }

    rocket.fillStyle = '#444444';
    // top bit
    rocket.beginPath();
    rocket.moveTo(centerX, centerY);
    rocket.lineTo(centerX-50, centerY+100);
    rocket.lineTo(centerX+50, centerY +100);
    rocket.closePath();
    rocket.fill();


    rocket.fillStyle = 'gray';
    // Square
    rocket.beginPath();
    rocket.moveTo(centerX -50, centerY - 50);
    rocket.lineTo(centerX, centerY -150);
    rocket.lineTo(centerX + 50, centerY -50);
    rocket.lineTo(centerX + 50, centerY + 50);
    rocket.lineTo(centerX - 50, centerY + 50);
    rocket.closePath();
    rocket.fill();
   


    

    
    
    rocket.restore();
}
function renderTriangle(){
    
    rocket.save();
    rocket.translate(centerX, centerY);
    rocket.rotate(angle)
    rocket.translate(-centerX, -centerY);
    rocket.fillStyle = 'green';
    rocket.globalAlpha = 0.5
    // top bit
    rocket.beginPath();
    rocket.moveTo(centerX, centerY-15);
    rocket.lineTo(centerX-10, centerY+15);
    rocket.lineTo(centerX+10, centerY +15);
    rocket.closePath();
    rocket.fill();
    rocket.globalAlpha = 1
    
    rocket.restore();
}

function calculateAcceleration(){
    if(w_down && output<1){
        output += 0.02
    } else if (s_down && output>0){
        output -= 0.02
    } else if (arrowup_down){
        player.vel.Y-=Math.cos(angle)*translation
        player.vel.X+=Math.sin(angle)*translation
    }
    if(arrowdown_down){
        player.vel.Y+=Math.cos(angle)*translation
        player.vel.X-=Math.sin(angle)*translation
    }
    if(arrowleft_down){
        player.vel.Y-=Math.sin(angle)*translation
        player.vel.X-=Math.cos(angle)*translation
    }
    if(arrowright_down){
        player.vel.Y+=Math.sin(angle)*translation
        player.vel.X+=Math.cos(angle)*translation
    }

    player.vel.Y-=Math.cos(angle)*acceleration*output
    player.vel.X+=Math.sin(angle)*acceleration*output


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

function doObjectAccelerations(){
    calculateAcceleration()
    for(let i=0;i<objects.length;i++){
        for(let j=i+1;j<objects.length;j++){
            let curr = objects[i]
            let that = objects[j]
            curr.calculateGravity(that)
            curr.checkCollisions(that)
        }
    }
}




function calculateRotation(){
    if (a_down){
        rotation -= rotspeed
    }
    if (d_down){
        rotation += rotspeed
    }
    if(c_down){
        newangle = Math.atan2((player.vel.Y),(player.vel.X)) + Math.PI/2
        
        if(angle<newangle){
            if(Math.abs(rotation)<0.05){
                rotation += rotspeed
            } else {
                rotation = 0.05
            }
        } else if(angle>newangle){
            if(Math.abs(rotation)<0.05){
                rotation -= rotspeed
            } else {
                rotation = -0.05
            }
        } 
    }

    if(x_down){

        newangle = Math.atan2((player.vel.Y),(player.vel.X)) - Math.PI/2
        if(angle<newangle){
            if(Math.abs(rotation)<0.05){
                rotation += rotspeed
            } else {
                rotation = 0.05
            }
        } else if(angle>newangle){
            if(Math.abs(rotation)<0.05){
                rotation -= rotspeed
            } else {
                rotation = -0.05
            }
        }
    }
}





let objects = []
let player = new object(1,400,100,0,10,0)
objects.push(player)
for(let i=0;i<10;i++){
    let rand = 1
    objects.push(new object(Math.floor(Math.random()*40000),Math.floor(Math.random()*40000),rand*570,(rand**2)*300*10^9,10,0))
}

function matMult(m1,m2){
    return [
        [(m1[0][0]*m2[0][0])+(m1[0][1]*m2[1][0]),(m1[0][0]*m2[0][1])+(m1[0][1]*m2[1][1])],
        [(m1[1][0]*m2[0][0])+(m1[1][1]*m2[1][0]),(m1[1][0]*m2[0][1])+(m1[1][1]*m2[1][1])]
    ]
}

function rotMat(angle){
    return [
        [Math.cos(angle),-Math.sin(angle)],
        [Math.sin(angle),Math.cos(angle)]
    ]
}

function draw(time) {
    rocket.clearRect(0, 0, canvas.width, canvas.height);
    rocket.save()
    rocket.translate(centerX,centerY)
    rocket.scale(scale,scale)
    rocket.translate(-centerX,-centerY)
    renderObjects()
    if(scale<0.02){
        renderRocket()
       rocket.restore()
        renderTriangle()
    } else {
        renderRocket()
        rocket.restore()
        
    }
    for(let times=0;times<gamespeed;times++){
        
        doObjectAccelerations()
        for(let i=0;i<objects.length;i++){
            objects[i].updatePos()
        }
    }
    calculateRotation()
    angle += rotation;

    if (angle > Math.PI * 2) angle = 0;

    
    requestAnimationFrame(draw); // get next farme
}

    // Start animation



function zoom(event) {
  event.preventDefault();

  scale += -event.deltaY * scale / (1000) ;

  // Restrict scale
  


  
}

el.onwheel = zoom;


document.addEventListener('keydown', function(event) {


    if (event.key === 'a') {
        a_down = true
    } else if (event.key === 'd') {
        d_down = true
    } else if (event.key === 'c') {
    
        c_down = true
    } else if (event.key === 'm') {
        switchMapMode()
        
    } else if (event.key === 'x') {
        x_down = true

    }  else if (event.key === 'w') {
        w_down = true
        
    } else if (event.key === 's') {
        s_down = true
    } else if (event.key === "ArrowDown"){
        arrowdown_down = true
    } else if (event.key === "ArrowLeft"){
        arrowleft_down = true
    } else if (event.key === "ArrowRight"){
        arrowright_down = true
    } else if (event.key === "ArrowUp"){
        arrowup_down = true
    } 

    switch (event.key) {
        default:
            break
    }
});
document.addEventListener('keyup', function(event) {


    if (event.key === 'a') {
        a_down = false
    } else if (event.key === 'd') {
        d_down = false
    } else if (event.key === 'c') {
        c_down = false
        rotation = 0
    }else if (event.key === 'x') {
        x_down = false
        rotation = 0
    } 
    else if (event.key === 'w') {
        w_down = false
    } else if (event.key === 's') {
        s_down = false
    } else if (event.key === "ArrowDown"){
        arrowdown_down = false
    } else if (event.key === "ArrowLeft"){
        arrowleft_down = false
    } else if (event.key === "ArrowRight"){
        arrowright_down = false
    } else if (event.key === "ArrowUp"){
        arrowup_down = false
    } 
});

function decreaseTime(){
    gamespeed = gamespeed/2,1
    if(gamespeed<1){
        gamespeed = 1
    }
}

function increaseTime(){
    gamespeed = gamespeed*2
}
function switchMapMode(){

    if(mapmode){
        scale = 0.1
        mapmode = false
    } else {
        let dist = Math.sqrt((player.pos.y - player.getNearestObject().pos.y)**2 + (player.pos.x - player.getNearestObject().pos.x)**2)
        scale = 200 / dist
        mapmode = true
    }
}

requestAnimationFrame(draw)