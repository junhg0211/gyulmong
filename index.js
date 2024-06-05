const FPS = 60;

let canvas;
let context;

class Tangerine {
  static URLS = [
    "https://www.gstatic.com/android/keyboard/emojikitchen/20211115/u1f34a/u1f34a_u1f97a.png",
    "https://www.gstatic.com/android/keyboard/emojikitchen/20211115/u1f34a/u1f34a_u1f634.png",
    "https://www.gstatic.com/android/keyboard/emojikitchen/20211115/u1f34a/u1f34a_u1f60e.png"
  ];

  constructor(x, y, size) {
    this.image = new Image();
    this.x = x;
    this.y = y;
    this.size = size;

    this.angle = Math.random() * 2 * Math.PI;
    this.v = 1000;

    this.cooltime = 1;
    this.life = 200 / this.size;

    this.image.src = Tangerine.URLS[Math.floor(Math.random() * Tangerine.URLS.length)];
  }

  tick() {
    const vx = Math.cos(this.angle) * this.v;
    const vy = Math.sin(this.angle) * this.v;
    this.x += vx / this.size;
    this.y += vy / this.size;

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

    this.life -= 1 / FPS;
    this.cooltime -= 1 / FPS;

    if (this.life <= 0) {
      tangerines.splice(tangerines.indexOf(this), 1);
      tangerines.push(new Tangerine(this.x, this.y, this.size / 2));
      tangerines.push(new Tangerine(this.x, this.y, this.size / 2));
    }
  }

  render() {
    for (let dx = -canvas.width; dx <= canvas.width; dx += canvas.width) {
      for (let dy = -canvas.height; dy <= canvas.height; dy += canvas.height) {
        context.drawImage(
          this.image,
          this.x - this.size / 2 + dx,
          this.y - this.size / 2 + dy,
          this.size * 1.5,
          this.size * 1.5,
        );
      }
    }
  }
}

const tangerines = [new Tangerine(0, 0, 500)];

function tick() {
  tangerines.forEach((tangerine) => tangerine.tick());

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
        break;
      }
    }

    if (break_) {
      break;
    }
  }
}

function render() {
  context.fillStyle = "#2c2c2c";
  context.fillRect(0, 0, canvas.width, canvas.height);

  tangerines.forEach((tangerine) => tangerine.render());
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

  setInterval(() => {
    tick();
    render();
  }, 1000 / FPS);
});
