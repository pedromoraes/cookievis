class App {
  constructor(data) {
    this.data = data;
    this.cells = [];
    this.setup();
  }

  get w() { return window.innerWidth; }
  get h() { return window.innerHeight; }

  setup() {
    this.pixi = new PIXI.Application(this.w, this.h, {
      backgroundColor: palette.shift(),
      transparent: false,
      antialias: true
    });
    this.data.domains.forEach((domain) => {
      const cookies = this.data.consolidated[domain];
      const size = 10 + cookies.length * this.w / this.data.total;
      this.cells.push(new Cell(this, domain, cookies, size))
    });
    document.body.appendChild(this.pixi.view);
    this.pixi.ticker.add(() => this.update());
    window.addEventListener("resize", () => this.resize());

  }

  update() {
    this.cells.forEach(c => !c.hover && c.update(this.w, this.h));
  }

  resize() {
    this.pixi.renderer.resize(this.w, this.h);
  }
}

document.addEventListener('DOMContentLoaded', () =>
  getData().then((data) => window.app = new App(data)));
