let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
const el = document.querySelector("body");

const canvas2 = document.getElementById("myCanvas2");
const context2 = canvas2.getContext("2d");

let scale = 500
let curvilinearSpeed = 5000
let speed = 0.00000001

let quadStr =  0.000001
let ringLength = 800
let radius = 800 / (Math.PI * 2)
let quadrupoles = 36
let L = 2
let d = 182 / 9
let particleCount = 1000

let particles = []

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;



class Vector2d {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

}

class Particle {
  constructor(s ,pos, vel, acc) {
    this.s = s
    this.pos = pos
    this.vel = vel
    this.acc = acc
  }
  leapfrog() {
    this.vel.x += this.acc.x / 2
    this.pos.x += this.vel.x
    this.vel.x += this.acc.x / 2
    this.acc.x = 0

    this.vel.y += this.acc.y / 2
    this.pos.y += this.vel.y
    this.vel.y += this.acc.y / 2
    this.acc.y = 0
  }
}


for (let i = 0; i < particleCount; i++){
  particles.push(new Particle(Math.random(), new Vector2d(-0.5 + Math.random(),-0.5 + Math.random()), new Vector2d(speed*(-0.5 + Math.random()),speed*(-0.5 + Math.random())), new Vector2d(0,0)))

}


function draw(time) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(centerX, centerY);
  context.scale(scale, scale);
  context.translate(-centerX, -centerY);
  for (let i = 0; i < particles.length; i++){
    let particle = particles[i]



    context.save()

    context.fillStyle = "gray";
    context.translate(particle.pos.x + centerX, particle.pos.y + centerY)
    context.beginPath();
    context.arc(0, 0, 0.01, 0, Math.PI * 2)
    context.fill()
    context.restore()
    for (let j = 0; j < curvilinearSpeed; j++){
      particle.leapfrog()
      particle.s += 0.05
      if (particle.s % 2 > 1) {
        particle.acc.y += quadStr*particle.pos.y
        particle.acc.x -= quadStr*particle.pos.x
      } else {
        particle.acc.y -= quadStr*particle.pos.y
        particle.acc.x += quadStr*particle.pos.x
      }
    }



  }
  context.restore()

  context2.clearRect(0, 0, 1000, 1000)

  context2.save()
  context2.translate(centerX, centerY)
  context2.rotate(Math.PI * 2 * (particles[0].s % 800 / 800))
  context2.fillStyle = "gray"
  context2.beginPath()
  context2.arc(0, 0, 100, 0, Math.PI/2)
  context2.fill()
  context2.fillStyle = "black"
  context2.beginPath()
  context2.arc(0, 0, 95, 0, Math.PI/2)
  context2.fill()

  context2.restore()


  requestAnimationFrame(draw)
}

draw()
