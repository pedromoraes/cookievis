let ww = window.innerWidth;
let hh = window.innerHeight;

class App {
  constructor(data) {
    this.data = data;
    this.cells = [];
    this.domainCells = [];
    this.explosionForce = 1;
    this.setup();
  }

  setup() {
    this.pixi = new PIXI.Application(ww, hh, {
      backgroundColor: palette.shift(),
      transparent: false,
      antialias: true
    });
    // _.times(disabledParticles, () => this.cells.push(new Cell(this)));
    document.body.appendChild(this.pixi.view);
    this.pixi.ticker.add(time => this.update(time));
    window.addEventListener('resize', () => this.resize());

    this.createDomainCells();
    this.addSumCell();
  }

  addSumCell() {
    const text = this.data.total.toString();
    const cell = new Cell(null, null, hh / 3, text);
    cell.render();
    this.pixi.stage.addChildAt(cell.ctnr, this.pixi.stage.numChildren);
    this.cells.push(cell);
    cell.lock();
  }

  createDomainCells() {
    this.data.domains.forEach((domain) => {
      const cookies = this.data.consolidated[domain];
      const size = 14 + cookies.length * ww / this.data.total;
      const dataSize = Math.ceil(cookies
        .reduce((acc, curr) => acc + `{c.domain,c.name,c.value}`.length, 0) / 1024);
      const text = `${domain}\nx${cookies.length} ~${dataSize}kb`;
      const cell = new Cell(domain, cookies, size, text);
      cell.render();
      this.domainCells.push(cell);
    });
  }

  addDomainCells() {
    for (let i = 0; i < 10 && this.domainCells.length; i ++) {
      const cell = this.domainCells.shift();
      this.cells.push(cell);
      this.pixi.stage.addChild(cell.ctnr);
    }
    if (this.domainCells.length) {
      setTimeout(() => this.addDomainCells(), 20);
    }
  }

  wipe(cell) {
    _.pull(this.cells, cell);
    if (cell.cookies) {
      removeCookies(cell.cookies);
    } else {
      this.explode();
    }
  }

  explode() {
    this.explosionForce = 40;
    tween(this).to({ explosionForce: 1 }, 5000).start();
    this.addDomainCells();
  }

  update(time) {
    TWEEN.update(this.pixi.ticker.lastTime);
    this.cells.forEach(c => c.update());
  }

  resize() {
    ww = window.innerWidth;
    hh = window.innerHeight;
    this.pixi.renderer.resize(ww, hh);
  }
}

document.addEventListener('DOMContentLoaded', () =>
  getData().then((data) => window.app = new App(data)));
