const fps = 144;

let canvas;
let context;

let mouseX, mouseY;
let mouseDown;

const images = [
  "https://www.gstatic.com/android/keyboard/emojikitchen/20211115/u1f34a/u1f34a_u1f97a.png",
  "https://www.gstatic.com/android/keyboard/emojikitchen/20211115/u1f34a/u1f34a_u1f634.png",
  "https://www.gstatic.com/android/keyboard/emojikitchen/20211115/u1f34a/u1f34a_u1f60e.png",
];

class Tangerine {
  constructor(x, y, size) {
    this.image = new Image();
    this.x = x;
    this.y = y;
    this.size = size;

    this.angle = Math.random() * 2 * Math.PI;
    this.v = 100000 / this.size;

    this.cooltime = 1;
    this.life = 200 / this.size;

    this.image.src = images[Math.floor(Math.random() * images.length)];
  }

  move() {
    const v = this.v / fps;

    const vx = Math.cos(this.angle) * v;
    const vy = Math.sin(this.angle) * v;
    this.x += vx;
    this.y += vy;

    if (this.x > canvas.width) {
      this.x -= canvas.width;
    }
    if (this.x < 0) {
      this.x += canvas.width;
    }

    if (this.y > canvas.height) {
      this.y -= canvas.height;
    }
    if (this.y < 0) {
      this.y += canvas.height;
    }
  }

  split() {
    tangerines.splice(tangerines.indexOf(this), 1);
    tangerines.push(new Tangerine(this.x, this.y, this.size / 2));
    tangerines.push(new Tangerine(this.x, this.y, this.size / 2));
  }

  tickTanger() {
    this.life -= 1 / fps;
    this.cooltime -= 1 / fps;

    const distance = Math.hypot(this.x - mouseX, this.y - mouseY);

    if (this.life <= 0 || (distance < this.size && mouseDown)) {
      this.split();

      summonParticle(this.x, this.y, 20);
    }
  }

  tick() {
    this.move();
    this.tickTanger();
  }

  render() {
    for (let dx = -canvas.width; dx <= canvas.width; dx += canvas.width) {
      for (let dy = -canvas.height; dy <= canvas.height; dy += canvas.height) {
        context.drawImage(
          this.image,
          this.x - this.size / 2 + dx,
          this.y - this.size / 2 + dy,
          this.size * 1.5,
          this.size * 1.5
        );
      }
    }
  }
}

const tangerines = [];

class TangerineParticle extends Tangerine {
  constructor(x, y, size) {
    super(x, y, size);
    this.v = 10;
  }

  tickParticle() {
    this.size -= 1;
  }

  tick() {
    this.move();

    this.tickParticle();
  }
}

const particles = [];

function summonParticle(x, y, count) {
  for (let i = 0; i < count; i++) {
    particles.push(new TangerineParticle(x, y, Math.random() * 10 + 10));
  }
}

function tick() {
  tangerines.forEach((tangerine) => tangerine.tick());
  particles.forEach((particle) => particle.tick());

  for (let i = 0; i < tangerines.length; i++) {
    let break_ = false;
    const t1 = tangerines[i];
    if (t1.cooltime > 0) {
      continue;
    }

    for (let j = i + 1; j < tangerines.length; j++) {
      const t2 = tangerines[j];

      const distance = Math.hypot(t2.x - t1.x, t2.y - t1.y);
      if (distance < t1.size + t2.size) {
        tangerines.splice(j, 1);
        tangerines.splice(i, 1);
        tangerines.push(new Tangerine(t1.x, t2.y, t1.size + t2.size));
        break_ = true;
        summonParticle(t2.x, t1.y, 20);
        break;
      }
    }

    if (break_) {
      break;
    }
  }

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];

    if (particle.size <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
}

function render() {
  context.fillStyle = "#2c2c2c";
  context.fillRect(0, 0, canvas.width, canvas.height);

  tangerines.forEach((tangerine) => tangerine.render());
  particles.forEach((particle) => particle.render());

  // context.fillRect(mouseX, mouseY, 10, 10);
}

function resize() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
}
window.addEventListener("resize", resize);

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.querySelector("#canvas");
  context = canvas.getContext("2d");

  resize();
  tangerines.push(
    new Tangerine(
      (canvas.width / 2) * window.devicePixelRatio,
      (canvas.height / 2) * window.devicePixelRatio,
      500
    )
  );

  let previousTime = Date.now();

  setInterval(() => {
    tick();
    render();

    const currentTime = Date.now();
    const deltaTime = currentTime - previousTime;
    previousTime = currentTime;
    fps = 1000 / deltaTime;
  });
});

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX * window.devicePixelRatio;
  mouseY = e.clientY * window.devicePixelRatio;
});

document.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;

  mouseDown = true;
});

document.addEventListener("mouseup", (e) => {
  if (e.button !== 0) return;

  mouseDown = false;
});
